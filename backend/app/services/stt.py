"""
Speech-to-Text Service with Groq Whisper
Adapted from Voice_Platform for Movie Ticket System
"""
import httpx
from fastapi import UploadFile, HTTPException
import os

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")


async def transcribe_groq_whisper(audio_bytes: bytes, filename: str, mime_type: str) -> str:
    """Groq Whisper (Fast & Free)"""
    if not GROQ_API_KEY:
        raise Exception("GROQ_API_KEY not configured")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            files={"file": (filename, audio_bytes, mime_type)},
            data={"model": "whisper-large-v3"}
        )
    
    if response.status_code != 200:
        raise Exception(f"Groq Whisper error: {response.text}")
    
    result = response.json()
    return result.get("text", "").strip()


async def transcribe_audio(file: UploadFile) -> str:
    """
    Transcribe audio using Groq Whisper.
    """
    audio_bytes = await file.read()
    filename = file.filename or "audio.wav"
    mime_type = file.content_type or "audio/wav"
    
    print(f"[STT] Received: {len(audio_bytes)} bytes")
    
    try:
        transcript = await transcribe_groq_whisper(audio_bytes, filename, mime_type)
        print(f"[STT] Transcript: {transcript[:50]}...")
        return transcript
    except Exception as e:
        print(f"[STT] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
