"""
LLM Service with Groq Llama
Adapted from Voice_Platform for Movie Ticket System
"""
import httpx
from fastapi import HTTPException
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env.local first (for secrets), then .env
env_local = Path(__file__).parent.parent.parent / ".env.local"
if env_local.exists():
    load_dotenv(env_local)
load_dotenv()  # Load .env as fallback

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# System prompt for movie ticket assistant
MOVIE_ASSISTANT_PROMPT = """You are a helpful movie ticket booking assistant for CineBook.

Your capabilities:
- Help users find movies playing nearby
- Provide information about showtimes and theaters
- Assist with booking tickets
- Answer questions about movies, genres, and recommendations

Guidelines:
- Be friendly and conversational
- Keep responses concise (2-4 sentences for voice)
- If asked about specific bookings, guide users to the booking page
- Recommend popular or highly-rated movies when asked

Available movies include action, comedy, drama, thriller, and romance genres.
"""


async def generate_response_groq(user_message: str, model: str = "llama-3.3-70b-versatile") -> str:
    """Groq LLM - Llama 3.3 70B"""
    if not GROQ_API_KEY:
        raise Exception("GROQ_API_KEY not configured")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": model,
                "messages": [
                    {"role": "system", "content": MOVIE_ASSISTANT_PROMPT},
                    {"role": "user", "content": user_message}
                ],
                "max_tokens": 200,
                "temperature": 0.7
            }
        )
    
    if response.status_code != 200:
        raise Exception(f"Groq API error: {response.text}")
    
    return response.json()["choices"][0]["message"]["content"]


async def generate_response(user_message: str) -> str:
    """
    Generate LLM response for movie assistant.
    """
    print(f"[LLM] Generating response for: {user_message[:50]}...")
    
    try:
        response = await generate_response_groq(user_message)
        print(f"[LLM] Response: {response[:50]}...")
        return response
    except Exception as e:
        print(f"[LLM] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"LLM generation failed: {str(e)}")
