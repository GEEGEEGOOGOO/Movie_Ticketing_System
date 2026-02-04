# ADR-008: Voice AI Framework Selection

**Status**: Proposed  
**Date**: 2026-01-27  
**Deciders**: Shashank (Intern), Technical Mentor

## Context

The Movie Ticket Management System requires voice AI capabilities to enable customers to interact through voice commands. This is a **mandatory requirement** per project specifications.

**Requirements:**
- Real-time voice conversation with minimal latency (<1s target)
- Support for Indian English accents and code-switching (English-Hindi)
- Bidirectional voice communication
- Integration with AI model 
- Handle interruptions and multi-turn dialogues
- Graceful error handling and fallback mechanisms
- Voice commands for movie search, showtime selection, seat selection, booking confirmation

**Evaluation Criteria:**
- **End-to-end latency**: Time from user speech to AI voice response
- **Integration complexity**: Ease of setup and integration with backend
- **STT accuracy**: Especially for Indian English and code-switching
- **TTS quality**: Natural-sounding voice output
- **Cost**: Per-minute pricing or API costs
- **Documentation**: Quality and availability of docs
- **Reliability**: Uptime and error handling
- **Python support**: SDK availability for backend integration

**Architecture Decision:**
The system needs to choose between two primary approaches:
1. **Speech-to-Speech (Direct)**: Real-time audio input → unified model → audio output
2. **Cascaded (STT → LLM → TTS)**: Separate components for each stage

Frameworks to evaluate: PipeCat, LiveKit, Vapi, Retell AI, Bland AI, OpenAI Realtime API, Custom implementation.

## Decision

We will use **PipeCat framework** with a **Cascaded architecture** (STT → LLM → TTS).

### Architecture: Cascaded (STT → LLM → TTS)
We choose the cascaded approach over speech-to-speech for this project.

## Rationale

### PipeCat Framework Selection

#### Integration & Developer Experience
- **Python-first**: Native Python framework aligns with backend (ADR-001)
- **FastAPI compatible**: Easy integration with our FastAPI backend
- **Modular design**: Pluggable components for STT, LLM, TTS
- **Open source**: MIT license, full control and customization
- **Active development**: Regular updates and community support
- **Well-documented**: Clear documentation and examples
- **Async/await native**: Works seamlessly with FastAPI's async architecture

#### Flexibility & Control
- **Provider agnostic**: Can swap STT/TTS providers easily (Deepgram, ElevenLabs, etc.)
- **LLM agnostic**: Works with Claude, GPT-4, or any LLM
- **Custom pipelines**: Build complex voice workflows
- **Middleware support**: Add custom processing (profanity filter, analytics)
- **Debug friendly**: Easy to add logging and monitoring at each stage

#### Cost Effectiveness
- **Framework free**: Open-source, no framework fees
- **Pay for usage only**: Only pay for STT, LLM, TTS API calls
- **No per-minute framework charges**: Unlike Vapi or Retell AI
- **Transparent pricing**: Direct API costs, no hidden fees
- **Cost control**: Can optimize each component independently

#### Real-time Performance
- **WebRTC support**: Low-latency audio streaming
- **Stream processing**: Process audio chunks in real-time
- **Optimized pipelines**: Designed for conversational AI
- **Target latency**: 500ms-1s total latency achievable
- **Transport options**: WebSocket, WebRTC for bidirectional audio

#### Community & Ecosystem
- **Growing adoption**: Used by several production voice AI apps
- **Active Discord**: Responsive community support
- **Example projects**: Multiple open-source examples
- **Integration guides**: Clear guides for common use cases

### Cascaded Architecture (STT → LLM → TTS) Selection

#### Better Debugging & Development
- **Inspect each stage**: See transcription, LLM response, TTS separately
- **Easier troubleshooting**: Identify which component causes issues
- **Iterative development**: Test and optimize each component independently
- **Clear error messages**: Know exactly where failure occurred
- **Development speed**: Faster to debug during 1-month timeline

#### Proven Pattern
- **Industry standard**: Most production voice AI uses cascaded approach
- **Well-documented**: Abundant resources and best practices
- **Reliable**: Each component is mature and battle-tested
- **Easier team collaboration**: Clear separation of concerns

#### Cost Optimization
- **Selective processing**: Don't need to process if transcription fails
- **Caching**: Can cache LLM responses for common queries
- **Fallback strategies**: Use cheaper alternatives when appropriate
- **Usage tracking**: Easy to track costs per component

#### Latency Analysis (Cascaded)
- **STT (Deepgram)**: 100-200ms for streaming transcription
- **LLM (Claude)**: 500-800ms for response generation (with streaming)
- **TTS (ElevenLabs)**: 200-300ms for voice synthesis
- **Network overhead**: ~100ms
- **Total latency**: 900ms-1400ms
- **Meets requirement**: Within <1s target with optimization

## Consequences

### Positive
- **Full control**: Complete visibility and control over voice pipeline
- **Debuggable**: Easy to identify and fix issues at each stage
- **Flexible**: Can swap any component (STT, LLM, TTS) easily
- **Cost-effective**: Only pay for API usage, no framework fees
- **Python-native**: Seamless FastAPI integration
- **Production-ready**: Proven architecture used by many apps
- **Optimizable**: Can optimize each stage independently
- **Maintainable**: Clear architecture for future developers

### Negative
- **Higher latency vs S2S**: 200-400ms higher latency than pure speech-to-speech
- **More complexity**: Three separate API integrations vs one
- **More failure points**: Each stage can fail independently
- **Configuration overhead**: Need to configure three services
- **Debugging complexity**: More components to monitor

### Neutral
- **API key management**: Need keys for STT, LLM, TTS (already needed)
- **Error handling**: Must handle errors at each stage
- **Monitoring**: Need to monitor three services (good for visibility)

## Alternatives Considered

### OpenAI Realtime API (Speech-to-Speech)
**Strengths:**
- **Lowest latency**: ~300ms end-to-end
- **Single API**: Unified interface, simple integration
- **Less complexity**: One API call handles everything
- **Natural interruptions**: Handles conversation flow natively

**Why Not Chosen:**
- **Black box**: Cannot debug intermediate stages
- **Less control**: Cannot swap TTS or optimize components
- **Newer API**: Less mature, fewer production examples
- **Cost**: $0.06/min input + $0.24/min output = ~$20/hour
- **Limited customization**: Cannot adjust voice or processing
- **Vendor lock-in**: Tied to OpenAI ecosystem
- **LLM constraint**: Must use GPT-4o (we chose Claude in ADR-007)
- Great for simplicity, but we need flexibility and Claude integration

### Vapi (Managed Voice AI Platform)
**Strengths:**
- **Fully managed**: Handles infrastructure and scaling
- **Simple integration**: JavaScript/TypeScript SDK
- **Good documentation**: Clear guides and examples
- **Dashboard**: Nice UI for monitoring conversations
- **Assistants**: Pre-built voice assistant templates

**Why Not Chosen:**
- **Cost**: $0.05-0.15 per minute + API costs (expensive at scale)
- **Framework fees**: Pay for both Vapi and underlying APIs
- **Less control**: Cannot customize pipeline deeply
- **JavaScript-first**: Python support secondary
- **Vendor lock-in**: Harder to migrate away
- **Cost adds up**: For production use, framework fees significant
- Good for non-technical teams, but we have technical capability

### Retell AI (Managed Platform)
**Strengths:**
- **Low latency**: Optimized for speed
- **Phone integration**: Built-in telephony support
- **Good documentation**: Clear API reference
- **Agent builder**: Visual interface for building agents

**Why Not Chosen:**
- **Cost**: Similar to Vapi, per-minute pricing + API costs
- **Less flexible**: Limited customization options
- **Smaller community**: Fewer examples and resources
- **Not Python-native**: RESTful API, not Python SDK
- **Overkill**: Phone features not needed for web app
- **Framework fees**: Additional cost layer

### LiveKit (Open-Source Infrastructure)
**Strengths:**
- **Open-source**: Full control, no framework fees
- **Scalable**: Designed for real-time communication at scale
- **WebRTC native**: Excellent for video/audio streaming
- **Production-grade**: Used by many large companies

**Why Not Chosen:**
- **Infrastructure heavy**: Need to deploy and manage servers
- **Overkill complexity**: More suited for video conferencing
- **Steeper learning curve**: Complex setup and configuration
- **Time investment**: Too much setup time for 1-month project
- **Not AI-focused**: General real-time communication, not voice AI specific
- Great for scale, but PipeCat simpler for our use case

### Custom Implementation (WebRTC + STT + LLM + TTS)
**Strengths:**
- **Full control**: Complete customization
- **No framework dependency**: Direct API integration
- **Cost-effective**: Only pay for APIs

**Why Not Chosen:**
- **Time-consuming**: Would take weeks to build robust pipeline
- **Complex**: WebRTC, audio processing, error handling all custom
- **Reinventing wheel**: PipeCat already solves these problems
- **Bugs & edge cases**: More time debugging custom code
- **Maintenance burden**: Ongoing maintenance required
- **Not worth it**: PipeCat provides all needed features

### Speech-to-Speech Architecture (Alternative Approach)
**Strengths:**
- **Lower latency**: ~300-500ms total
- **More natural**: Preserves prosody and emotion
- **Simpler conceptual model**: Audio in, audio out

**Why Not Chosen for Our Project:**
- **Black box**: Cannot debug intermediate stages (critical for 1-month timeline)
- **Limited options**: Only OpenAI Realtime API mature for this
- **Less flexible**: Cannot swap components independently
- **Harder debugging**: When something fails, hard to know why
- **Less established**: Fewer production patterns and examples
- **LLM constraint**: OpenAI only (we chose Claude)
- **Better for production at scale**: When latency is critical and system is stable
- **Our context**: Learning project with 1-month timeline benefits from visibility

