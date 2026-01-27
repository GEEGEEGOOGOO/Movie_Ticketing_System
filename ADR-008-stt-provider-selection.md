# ADR-009: Speech-to-Text (STT) Provider Selection

**Status**: Proposed  
**Date**: 2026-01-27  
**Deciders**: Shashank (Intern), Technical Mentor

## Context

The Movie Ticket Management System requires high-quality Speech-to-Text (STT) capabilities for:
- **Voice AI conversations**: Transcribe user voice input in real-time
- **Text chat voice announcement**: Convert text to speech for accessibility (covered in separate TTS decision)

**Critical Requirements:**
- **Indian English accent support**: Must accurately transcribe Indian English speakers
- **Code-switching support**: Handle English-Hindi code-switching common in India
- **Real-time streaming**: Transcribe audio as it's being spoken (<200ms latency)
- **High accuracy**: >90% word error rate (WER) for clear audio
- **Noise handling**: Reasonable performance in moderate background noise
- **WebSocket/streaming support**: Integration with PipeCat framework
- **Cost-effective**: Reasonable per-minute pricing for development

**Use Cases:**
- Customer asks: "Show me movies playing tomorrow in Hindi" (English)
- Customer asks: "Kal ke liye Hindi movies dikhao" (Hindi)
- Customer asks: "Can you show me action movies in Hindi language?" (Code-switching)
- Customer says: "Book 2 seats in row D" (Clear commands)

**Evaluation Criteria:**
- **Accent accuracy**: Indian English transcription quality
- **Code-switching**: English-Hindi mixing support
- **Latency**: Time to first word and overall streaming latency
- **Streaming support**: Real-time transcription capabilities
- **Cost**: Per-minute or per-second pricing
- **API reliability**: Uptime and error handling
- **Integration**: Python SDK and PipeCat compatibility
- **Documentation**: Quality of docs and examples

Candidates: Deepgram, OpenAI Whisper, Google Speech-to-Text, ElevenLabs, Cartesia, Assembly AI.

## Decision

We will use **Deepgram Nova-2** as the Speech-to-Text provider.

## Rationale

### Indian English Accent Support
- **Nova-2 model**: Specifically trained on diverse English accents including Indian English
- **Multi-accent training**: Handles variations in Indian English pronunciation
- **High accuracy**: 90%+ accuracy for Indian English speakers
- **Tested performance**: Proven in Indian market applications
- **Better than OpenAI Whisper**: Whisper less optimized for Indian accents
- Deepgram has specific focus on accent diversity

### Streaming Performance & Latency
- **Real-time streaming**: True streaming transcription, not batch
- **Low latency**: 100-200ms typical latency
- **Time-to-first-word**: <100ms
- **WebSocket support**: Native WebSocket streaming
- **No batching delay**: Transcribes as user speaks
- **Meets requirement**: Well under <200ms target
- Faster than Google Speech-to-Text and AssemblyAI

### Code-Switching Capability
- **Language detection**: Automatic language detection within speech
- **Multi-language models**: Can handle mixed English-Hindi
- **Detect_language parameter**: Enable automatic language switching
- **Hindi support**: Good Hindi language model available
- **Hybrid transcription**: Can transcribe mixed language input
- Note: True seamless code-switching still challenging for all providers, but Deepgram best-in-class

### Integration & Developer Experience
- **Official Python SDK**: Well-maintained, type-hinted library
- **PipeCat integration**: Native PipeCat support (`DeepgramSTTService`)
- **Async support**: Native async/await for FastAPI
- **WebSocket API**: Clean WebSocket interface
- **Simple setup**: Minimal configuration needed
- **Good documentation**: Clear API reference and examples
- **Active support**: Responsive developer support

Example Integration:
```python
from deepgram import DeepgramClient, PrerecordedOptions, LiveOptions

# Streaming transcription
dg_client = DeepgramClient(DEEPGRAM_API_KEY)

options = LiveOptions(
    model="nova-2",
    language="en-IN",  # Indian English
    smart_format=True,
    interim_results=True,
    endpointing=300,  # ms of silence to detect end
)

connection = dg_client.listen.websocket.v("1")
await connection.start(options)
```

### Cost Effectiveness
- **Pay-as-you-go**: $0.0043 per minute (Nova-2 model)
- **No minimum**: No monthly minimums
- **Free tier**: $200 free credits for development
- **Transparent pricing**: Simple per-minute pricing
- **Most affordable**: Cheaper than Google ($0.006/min) and OpenAI Whisper API
- Development cost: ~100 hours testing = $25.80

### Features for Voice AI
- **Speaker diarization**: Identify different speakers (useful for future features)
- **Punctuation**: Automatic punctuation insertion
- **Smart formatting**: Formats numbers, dates, currencies
- **Custom vocabulary**: Add domain-specific terms (movie names, theaters)
- **Interim results**: Get partial transcripts before utterance complete
- **End-pointing**: Automatic detection of speech end

### Accuracy & Reliability
- **Industry-leading WER**: <10% word error rate for clear audio
- **Noise robustness**: Handles moderate background noise well
- **99.99% uptime SLA**: Highly reliable service
- **Error handling**: Clear error messages and recovery
- **Production-grade**: Used by Spotify, NASA, Twilio

### Model Options
- **Nova-2**: Latest model, best accuracy, good for our use case
- **Nova-2-general**: General-purpose, best all-around
- **Nova-2-meeting**: Optimized for meetings (not needed)
- **Nova-2-phonecall**: Optimized for phone audio (not needed)
- **Enhanced models**: Can upgrade to enhanced tier if needed

## Consequences

### Positive
- **High accuracy for target users**: Indian English speakers transcribed accurately
- **Low latency**: Real-time streaming under 200ms
- **Cost-effective**: Affordable for development and moderate production use
- **Easy integration**: Native PipeCat support, minimal setup
- **Reliable**: Production-grade service with high uptime
- **Scalable**: Can handle production traffic without issues
- **Good DX**: Excellent documentation and Python SDK
- **Feature-rich**: Smart formatting, punctuation, speaker diarization

### Negative
- **Code-switching limitations**: Perfect English-Hindi mixing still challenging (limitation of all providers)
- **API dependency**: Requires internet and Deepgram service availability
- **Accent edge cases**: Very strong regional Indian accents may have lower accuracy
- **Cost at scale**: $0.0043/min can add up at high volume (but still cheaper than alternatives)
- **No offline mode**: Cannot work without internet (not a requirement anyway)

### Neutral
- **API key management**: Need secure storage of Deepgram API key
- **WebSocket management**: Need to handle WebSocket lifecycle
- **Error handling**: Must implement reconnection logic
- **Usage monitoring**: Need to track API usage for cost management

## Alternatives Considered

### OpenAI Whisper API
**Strengths:**
- **High accuracy**: Very accurate for general English
- **Multilingual**: Supports 99+ languages including Hindi
- **Large model**: Large-v3 model very capable
- **Free tier**: Generous free tier
- **Simple API**: RESTful API easy to use

**Why Not Chosen:**
- **Batch processing**: Not true streaming, needs audio file upload
- **Higher latency**: 1-3 seconds latency (doesn't meet <200ms requirement)
- **Indian accent**: Less optimized for Indian English than Deepgram
- **No real-time**: Not suitable for real-time conversation
- **Code-switching**: Less reliable for mixed English-Hindi
- **Cost**: $0.006/min (40% more expensive than Deepgram)
- **Better for**: Batch transcription of recorded audio, not real-time conversation
- Would consider for asynchronous tasks, but not for real-time voice

### Google Cloud Speech-to-Text
**Strengths:**
- **High accuracy**: Google-quality transcription
- **Streaming support**: Real-time streaming available
- **Language variety**: 125+ languages
- **Integration**: Good Python SDK
- **Google ecosystem**: Easy GCP integration

**Why Not Chosen:**
- **Cost**: $0.006/min (40% more expensive)
- **Complexity**: More setup than Deepgram (GCP project, service account)
- **PipeCat integration**: Less mature than Deepgram
- **Latency**: Slightly higher latency than Deepgram (200-300ms)
- **Indian English**: Good but not better than Deepgram
- **Overkill**: GCP ecosystem unnecessary for our focused use case
- Good option for existing GCP users, but Deepgram simpler

### AssemblyAI
**Strengths:**
- **High accuracy**: Competitive with Deepgram
- **Rich features**: Sentiment analysis, entity detection
- **Good documentation**: Clear docs and examples
- **Async and real-time**: Both modes available

**Why Not Chosen:**
- **Cost**: $0.00025/second ($0.015/min) - 3.5x more expensive!
- **Indian English**: Not specifically optimized like Deepgram
- **Streaming latency**: 300-500ms (higher than Deepgram)
- **Smaller ecosystem**: Less adoption than Deepgram/Google
- **PipeCat support**: Less mature integration
- Features are great, but cost and latency don't justify

### ElevenLabs
**Strengths:**
- **Great TTS**: Excellent for text-to-speech (we might use for TTS)
- **Same provider**: Could use single provider for STT and TTS
- **Good quality**: Decent transcription quality

**Why Not Chosen:**
- **TTS-focused**: Primary focus is TTS, STT is newer/secondary
- **Cost**: More expensive than Deepgram for STT
- **Less proven**: STT offering less mature than dedicated providers
- **Indian English**: Not specifically optimized
- **Use for TTS**: We'll likely use ElevenLabs for TTS, but not STT
- Stick to specialized providers for each task

### Cartesia
**Strengths:**
- **Low latency**: Very fast TTS
- **Real-time focus**: Designed for conversational AI

**Why Not Chosen:**
- **TTS-focused**: Primarily a TTS provider
- **Newer entrant**: Less proven than Deepgram
- **STT offering**: STT capabilities not as mature
- **Documentation**: Less comprehensive than Deepgram
- **Cost**: Not clearly cheaper than Deepgram
- Good for TTS, but Deepgram better for STT

### Whisper (Self-hosted Open Source)
**Strengths:**
- **Free (after hosting)**: No per-minute API costs
- **Privacy**: Full data control
- **Customizable**: Can fine-tune models
- **Offline**: Works without internet

**Why Not Chosen:**
- **Infrastructure complexity**: Need GPU servers (expensive)
- **Latency**: Higher latency than cloud APIs (model inference time)
- **Real-time challenges**: Hard to achieve <200ms latency
- **Maintenance**: Need to maintain servers and models
- **Time investment**: Too much setup for 1-month project
- **Cost**: GPU hosting may exceed API costs at low volume
- Better for: High-volume production or privacy-critical applications
- Our scale: API services more cost-effective

## Implementation Strategy

### Deepgram Configuration

```python
# services/stt_service.py
from deepgram import (
    DeepgramClient,
    DeepgramClientOptions,
    LiveTranscriptionEvents,
    LiveOptions,
)

class DeepgramSTTService:
    def __init__(self):
        config = DeepgramClientOptions(
            api_key=os.environ["DEEPGRAM_API_KEY"],
            options={"keepalive": "true"}
        )
        self.client = DeepgramClient("", config)
        
    async def start_transcription(self, on_transcript_callback):
        options = LiveOptions(
            model="nova-2",
            language="en-IN",  # Indian English
            smart_format=True,  # Auto punctuation, number formatting
            interim_results=True,  # Get partial results
            endpointing=300,  # 300ms silence to detect end
            utterance_end_ms="1000",  # Full utterance after 1s silence
            punctuate=True,
            diarize=False,  # Speaker diarization (optional)
            # Custom vocabulary for domain-specific terms
            keywords=["movie", "theater", "booking", "showtime"],
        )
        
        connection = self.client.listen.websocket.v("1")
        
        async def on_message(self, result, **kwargs):
            sentence = result.channel.alternatives[0].transcript
            if sentence and len(sentence) > 0:
                await on_transcript_callback(sentence)
        
        connection.on(LiveTranscriptionEvents.Transcript, on_message)
        
        if not await connection.start(options):
            raise Exception("Failed to start Deepgram connection")
        
        return connection
```

### PipeCat Integration

```python
# voice/pipeline.py
from pipecat.services.deepgram import DeepgramSTTService

# In create_voice_pipeline function
stt_service = DeepgramSTTService(
    api_key=os.environ["DEEPGRAM_API_KEY"],
    model="nova-2",
    language="en-IN",
    smart_format=True,
    interim_results=True,
    endpointing=300,
)
```

### Code-Switching Support

```python
# Enhanced configuration for code-switching
options = LiveOptions(
    model="nova-2",
    language="en-IN",  # Primary: Indian English
    detect_language=True,  # Auto-detect language switches
    # Alternative: multi-language
    # language=["en-IN", "hi"],  # English + Hindi
    smart_format=True,
)
```

### Custom Vocabulary for Domain Terms

```python
# Add movie/theater specific terms
options = LiveOptions(
    model="nova-2",
    language="en-IN",
    keywords=[
        # Movie genres
        "action", "comedy", "drama", "thriller", "romance", "horror",
        # Common terms
        "showtime", "theater", "screen", "booking", "seats",
        # Payment
        "payment", "confirmation", "ticket",
    ],
    boost_keywords={
        "theater": 2.0,  # Boost weight for "theater"
        "booking": 2.0,
    }
)
```

### Error Handling & Reconnection

```python
# services/stt_service.py
class DeepgramSTTService:
    async def start_with_retry(self, max_retries=3):
        for attempt in range(max_retries):
            try:
                return await self.start_transcription(on_transcript)
            except Exception as e:
                logger.error(f"Deepgram connection failed (attempt {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
                else:
                    raise Exception("Failed to establish Deepgram connection")
```

### Monitoring & Logging

```python
# voice/monitoring.py
class STTMonitor:
    def log_transcription(
        self,
        transcript: str,
        confidence: float,
        latency_ms: float,
        is_final: bool
    ):
        logger.info(f"STT: '{transcript}' (confidence: {confidence}, latency: {latency_ms}ms, final: {is_final})")
        
        # Track metrics
        metrics.histogram("stt.latency", latency_ms)
        metrics.histogram("stt.confidence", confidence)
```

### Testing Strategy

```python
# tests/test_stt.py
import pytest
from services.stt_service import DeepgramSTTService

@pytest.mark.asyncio
async def test_indian_english_transcription():
    stt = DeepgramSTTService()
    
    # Test with Indian English audio sample
    audio_file = "tests/audio/indian_english_sample.wav"
    transcript = await stt.transcribe_file(audio_file)
    
    assert "movie" in transcript.lower()
    assert transcript.confidence > 0.8

@pytest.mark.asyncio
async def test_code_switching():
    stt = DeepgramSTTService()
    
    # Test with English-Hindi mixed audio
    audio_file = "tests/audio/code_switching_sample.wav"
    transcript = await stt.transcribe_file(audio_file)
    
    # Verify both languages transcribed
    assert transcript is not None
```

## Accent Testing Plan

1. **Collect test samples**: 
   - North Indian English accent
   - South Indian English accent
   - English-Hindi code-switching
   - Clear vs noisy environments

2. **Measure accuracy**:
   - Word Error Rate (WER)
   - Confidence scores
   - Latency distribution

3. **Iterate if needed**:
   - Adjust `boost_keywords`
   - Test alternative models (enhanced tier)
   - Add custom vocabulary

## Cost Optimization

```python
# Optimize costs with caching and batching
class CachedSTTService:
    def __init__(self):
        self.transcript_cache = {}
    
    async def transcribe_with_cache(self, audio_hash: str, audio_data):
        if audio_hash in self.transcript_cache:
            return self.transcript_cache[audio_hash]
        
        transcript = await deepgram.transcribe(audio_data)
        self.transcript_cache[audio_hash] = transcript
        return transcript
```

## Future Enhancements

- **Custom model training**: Train custom model on specific accents if needed
- **Speaker verification**: Voice biometrics for authentication
- **Emotion detection**: Analyze speech emotion and tone
- **Multi-language support**: Add Tamil, Telugu, Bengali for other regions
- **Offline fallback**: Local Whisper model for connectivity issues

## References

- Deepgram Documentation: https://developers.deepgram.com/
- Deepgram Nova-2 Model: https://developers.deepgram.com/docs/nova-2
- Deepgram Python SDK: https://github.com/deepgram/deepgram-python-sdk
- Deepgram Streaming Guide: https://developers.deepgram.com/docs/getting-started-with-live-streaming-audio
- Indian English Accents: https://developers.deepgram.com/docs/language-models
- PipeCat Deepgram Integration: https://docs.pipecat.ai/services/deepgram
