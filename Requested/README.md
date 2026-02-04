# Architecture Decision Records (ADRs)

This directory contains all Architecture Decision Records for the Movie Ticket Management System project.

## Overview

These ADRs document the significant architectural and technical decisions made during the planning phase of the project. Each ADR follows a consistent format documenting the context, decision, rationale, consequences, and alternatives considered.

## ADR Index

### Backend Decisions

| ADR | Title | Status | Key Decision |
|-----|-------|--------|--------------|
| [ADR-001](./ADR-001-backend-programming-language.md) | Backend Programming Language Selection | Proposed | **Python** for AI integration and rapid development |
| [ADR-002](./ADR-002-backend-framework-selection.md) | Backend Framework Selection | Proposed | **FastAPI** for async performance and auto-documentation |
| [ADR-003](./ADR-003-database-selection.md) | Database Selection | Proposed | **PostgreSQL** for ACID compliance and relational data |
| [ADR-004](./ADR-004-authentication-strategy.md) | Authentication Strategy | Proposed | **JWT + OAuth2** for stateless authentication |

### Frontend Decisions

| ADR | Title | Status | Key Decision |
|-----|-------|--------|--------------|
| [ADR-005](./ADR-005-frontend-framework-selection.md) | Frontend Framework Selection | Proposed | **React** for ecosystem and component architecture |
| [ADR-006](./ADR-006-frontend-language-selection.md) | Frontend Language Selection | Proposed | **TypeScript** for type safety and developer experience |
| [ADR-010](./ADR-010-state-management-selection.md) | State Management Solution | Proposed | **Zustand + React Query** for client and server state |
| [ADR-011](./ADR-011-ui-component-library.md) | UI Component Library | Proposed | **shadcn/ui** for customizable, modern components |
| [ADR-012](./ADR-012-css-styling-approach.md) | CSS/Styling Approach | Proposed | **Tailwind CSS** for utility-first styling |
| [ADR-013](./ADR-013-frontend-folder-structure.md) | Frontend Folder Structure | Proposed | **Feature-based** structure for scalability |

### AI & Voice Decisions

| ADR | Title | Status | Key Decision |
|-----|-------|--------|--------------|
| [ADR-007](./ADR-007-ai-model-selection.md) | AI Model Selection | Proposed | **Anthropic Claude 3.5 Sonnet** for conversational AI |
| [ADR-008](./ADR-008-voice-ai-framework-selection.md) | Voice AI Framework Selection | Proposed | **PipeCat (Cascaded Architecture)** for voice pipeline |
| [ADR-009](./ADR-009-stt-provider-selection.md) | STT Provider Selection | Proposed | **Deepgram Nova-2** for Indian English and streaming |

## Technology Stack Summary

### Backend Stack
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy 2.0
- **Authentication**: JWT + OAuth2 (Google)
- **AI Model**: Anthropic Claude 3.5 Sonnet

### Frontend Stack
- **Language**: TypeScript
- **Framework**: React 18
- **State Management**: Zustand (client) + React Query (server)
- **UI Library**: shadcn/ui (Radix UI + Tailwind)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

### Voice AI Stack
- **Framework**: PipeCat
- **Architecture**: Cascaded (STT → LLM → TTS)
- **STT**: Deepgram Nova-2 (Indian English)
- **LLM**: Anthropic Claude 3.5 Sonnet
- **TTS**: To be determined (likely ElevenLabs)

## Decision Principles

The following principles guided these architectural decisions:

1. **Rapid Development**: 1-month timeline requires fast iteration and minimal boilerplate
2. **Type Safety**: TypeScript throughout stack reduces bugs and improves maintainability
3. **AI-First**: Chosen technologies optimize for AI and Voice AI integration
4. **Production Ready**: Battle-tested technologies used by major companies
5. **Developer Experience**: Excellent tooling, documentation, and IDE support
6. **Cost Effectiveness**: Reasonable costs for development and moderate production use
7. **Indian Market**: Special consideration for Indian English accents and code-switching

## Reading Guide

Each ADR follows this structure:

- **Status**: Current status (Proposed, Accepted, Deprecated, Superseded)
- **Date**: When the decision was made
- **Context**: What issue we're facing and requirements
- **Decision**: The chosen solution
- **Rationale**: Why this decision was made (key reasons and evidence)
- **Consequences**: Positive, negative, and neutral impacts
- **Alternatives Considered**: Other options evaluated and why not chosen
- **Implementation**: Code examples and integration notes (where applicable)
- **References**: Links to documentation and resources

## How to Use These ADRs

### For Implementation
1. Read the relevant ADR before starting a feature
2. Follow the implementation guidelines and code examples
3. Use the referenced documentation for detailed information
4. Stick to the decided patterns for consistency

### For Future Changes
1. If a decision needs to be changed, create a new ADR
2. Mark the old ADR as "Superseded" and reference the new one
3. Document why the change was necessary
4. Update this README to reflect the change

## Key Integration Points

### Backend + Frontend
- FastAPI generates OpenAPI spec → TypeScript types can be generated
- JWT tokens passed in Authorization header
- Consistent error handling format

### Backend + AI
- FastAPI async endpoints call Claude API non-blocking
- PipeCat integrates with FastAPI via WebSocket
- Conversation history stored in PostgreSQL

### Frontend + Voice AI
- React WebSocket hook connects to PipeCat pipeline
- Real-time transcription displayed in UI
- Voice state managed with Zustand

## Cost Estimates

**Development Phase (1 month):**
- Claude API: $3-5
- Deepgram STT: $25-40
- TTS (ElevenLabs): $10-20
- **Total: ~$50-70**

**Production (if scaled to 1000 users/month):**
- Database (Managed PostgreSQL): $15-30/month
- Backend Hosting (Cloud Run/Render): $10-30/month
- Frontend Hosting (Vercel/Netlify): $0-20/month
- AI APIs (moderate usage): $100-300/month
- **Total: ~$150-400/month**

## Next Steps

1. ✅ Complete ADR documentation
2. ⏭️ Set up development environment (Python, Node.js, PostgreSQL)
3. ⏭️ Initialize backend (FastAPI project structure)
4. ⏭️ Initialize frontend (React + TypeScript + Vite)
5. ⏭️ Implement authentication (JWT + Google OAuth)
6. ⏭️ Build core features (theaters, movies, bookings)
7. ⏭️ Integrate AI co-pilot
8. ⏭️ Integrate Voice AI
9. ⏭️ Testing and deployment

## Questions or Concerns?

If you have questions about any architectural decision:
1. First, read the relevant ADR thoroughly
2. Check the "Alternatives Considered" section
3. Review the "Consequences" section
4. If still unclear, discuss with technical mentor

## Contributing

When adding new ADRs:
1. Use the same format as existing ADRs
2. Number sequentially (ADR-014, ADR-015, etc.)
3. Update this README with the new ADR
4. Get review from technical mentor before finalizing
