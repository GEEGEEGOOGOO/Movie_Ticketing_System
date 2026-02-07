"""
Voice Chat Route - STT → LLM → TTS pipeline for Movie Ticket System
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
import base64

from ..services.stt import transcribe_audio
from ..services.llm import generate_response
from ..services.tts import synthesize_speech

router = APIRouter(prefix="/voice", tags=["voice"])


class ChatMessage(BaseModel):
    message: str


@router.post("/chat")
async def voice_chat(
    audio: UploadFile = File(...)
):
    """
    Complete voice chat pipeline:
    1. Receive audio from user
    2. Transcribe with Groq Whisper (STT)
    3. Generate response with Groq Llama (LLM)
    4. Synthesize speech with Edge TTS
    5. Return audio response with transcript
    """
    print(f"[VOICE] Starting voice chat...")
    
    try:
        # Step 1: Transcribe audio (STT)
        print("[VOICE] Step 1: Transcribing...")
        user_text = await transcribe_audio(audio)
        
        if not user_text.strip():
            raise HTTPException(status_code=400, detail="Could not transcribe audio")
        
        print(f"[VOICE] Transcribed: {user_text[:50]}...")
        
        # Step 2: Generate LLM response
        print("[VOICE] Step 2: Generating response...")
        llm_response = await generate_response(user_text)
        print(f"[VOICE] LLM response: {llm_response[:50]}...")
        
        # Step 3: Synthesize speech (TTS)
        print("[VOICE] Step 3: Synthesizing speech...")
        audio_bytes = await synthesize_speech(llm_response)
        print(f"[VOICE] Audio generated: {len(audio_bytes)} bytes")
        
        # Return JSON with audio (base64) and text for captions
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        return {
            "audio_base64": audio_base64,
            "audio_type": "audio/mpeg",
            "user_text": user_text,
            "agent_response": llm_response
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"[VOICE] Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Voice processing failed: {str(e)}")


@router.post("/chat/text")
async def text_chat(chat_message: ChatMessage):
    """
    Text-only chat endpoint (no STT/TTS):
    1. Receive text message
    2. Generate response with Groq Llama 3.3 70B
    3. Return text response
    """
    print(f"[TEXT CHAT] Received: {chat_message.message[:50]}...")
    
    try:
        # Generate LLM response using Groq Llama 3.3 70B
        llm_response = await generate_response(chat_message.message)
        print(f"[TEXT CHAT] Response: {llm_response[:50]}...")
        
        return {
            "response": llm_response
        }
    except Exception as e:
        print(f"[TEXT CHAT] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
