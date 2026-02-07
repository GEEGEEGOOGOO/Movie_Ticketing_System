"""
Text-to-Speech Service with Edge TTS (Free)
Adapted from Voice_Platform for Movie Ticket System
"""
import edge_tts
import tempfile
import os
from fastapi import HTTPException


async def synthesize_edge_tts(text: str, voice: str = "en-US-ChristopherNeural") -> bytes:
    """Edge TTS (Free, High Quality)"""
    communicate = edge_tts.Communicate(text, voice)
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
        temp_path = temp_file.name
    
    try:
        await communicate.save(temp_path)
        with open(temp_path, "rb") as f:
            return f.read()
    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)


async def synthesize_speech(text: str, voice: str = "en-US-ChristopherNeural") -> bytes:
    """
    Synthesize speech using Edge TTS (Free).
    """
    print(f"[TTS] Synthesizing {len(text)} chars with voice: {voice}")
    
    try:
        audio = await synthesize_edge_tts(text, voice=voice)
        print(f"[TTS] Success: {len(audio)} bytes")
        return audio
    except Exception as e:
        print(f"[TTS] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")
