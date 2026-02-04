# ADR-002: Backend Framework Selection

**Status**: Proposed  
**Date**: 2026-01-27  
**Deciders**: Shashank (Intern), Technical Mentor

## Context

Following the decision to use Python (ADR-001), we need to select a backend framework for the Movie Ticket Management System. The framework must support:

**Core Requirements:**
- RESTful API development with automatic documentation
- Async request handling for concurrent seat bookings
- Request/response validation with type safety
- Authentication (JWT, OAuth2)
- Database ORM integration
- File upload handling (movie/theater images)
- WebSocket support for real-time seat updates
- CORS configuration
- Rate limiting capabilities
- Comprehensive error handling

**Performance Requirements:**
- API response time < 500ms for non-AI endpoints
- Handle concurrent bookings with race condition prevention
- Support for async AI API calls without blocking

**Developer Experience:**
- Fast development for 1-month timeline
- Automatic API documentation generation
- Good IDE support and type checking
- Extensive ecosystem and community

The primary candidates are FastAPI and Django (with Django REST Framework).

## Decision

We will use **FastAPI** as the backend framework.

## Rationale

### Performance & Async Capabilities
- **Built on Starlette and Pydantic**: One of the fastest Python frameworks, comparable to Node.js and Go
- **Native async/await support**: First-class async support throughout the framework
- **Non-blocking I/O**: Essential for AI API calls, email sending, and concurrent bookings
- **Handles concurrent requests efficiently**: Critical for race condition management in seat booking
- **Benchmarks**: 2-3x faster than Django for async operations

### Type Safety & Validation
- **Pydantic integration**: Automatic request/response validation with Python type hints
- **Runtime type checking**: Catches errors before they reach business logic
- **IDE autocomplete**: Excellent IntelliSense support in VSCode/PyCharm
- **Reduced bugs**: Type hints catch errors during development
- **Data serialization**: Automatic JSON serialization/deserialization

### Automatic Documentation
- **OpenAPI/Swagger**: Automatic interactive API documentation at `/docs`
- **ReDoc**: Alternative documentation UI at `/redoc`
- **Zero additional effort**: Documentation generated from code and type hints
- **Always up-to-date**: No manual documentation maintenance
- **API testing**: Interactive testing directly from browser

### Development Speed
- **Minimal boilerplate**: Concise route definitions with decorators
- **Dependency injection**: Built-in DI system for clean code
- **Quick setup**: Minimal configuration needed to start
- **Hot reload**: Automatic server restart during development
- **Easy testing**: Simple test structure with pytest

### Authentication & Security
- **OAuth2 support**: Built-in OAuth2 with Password and Bearer flows
- **JWT handling**: Easy integration with python-jose or PyJWT
- **Security utilities**: Built-in security schemes and dependencies
- **Google OAuth**: Simple integration with authlib or httpx-oauth
- **CORS middleware**: Built-in CORS support

### Database Integration
- **ORM agnostic**: Works with SQLAlchemy, Tortoise ORM, or MongoDB motor
- **Async database support**: Native support for async database drivers
- **Connection pooling**: Efficient database connection management
- **Transaction support**: Proper transaction handling for bookings

### Ecosystem & Community
- **Rapidly growing**: One of the fastest-growing Python frameworks
- **Active development**: Frequent updates and improvements
- **Strong community**: Large community on GitHub, Stack Overflow
- **Production-ready**: Used by Microsoft, Uber, Netflix
- **Well-documented**: Excellent official documentation

### AI Integration Advantages
- **Async AI calls**: Non-blocking calls to OpenAI/Anthropic/Gemini APIs
- **Background tasks**: Built-in background task support for email notifications
- **Streaming responses**: Support for streaming AI responses
- **WebSocket support**: For real-time AI chat and voice interactions

## Consequences

### Positive
- Lightning-fast API development with minimal code
- Automatic API documentation saves significant time
- Type safety reduces debugging time and production bugs
- Excellent performance handles concurrent bookings efficiently
- Modern async architecture scales well
- Built-in features (validation, docs, security) reduce dependencies
- Strong type hints improve code maintainability
- Easy integration with all required libraries (AI SDKs, email, etc.)
- Production-ready with minimal configuration

### Negative
- Relatively newer framework (since 2018) compared to Django (2005)
- Smaller ecosystem of third-party packages compared to Django
- No built-in admin panel (unlike Django)
- Less opinionated architecture requires more design decisions
- Fewer ready-made authentication solutions compared to Django
- Learning curve for developers unfamiliar with async Python

### Neutral
- Requires understanding of async/await patterns
- ORM selection is separate decision (ADR-003 covers database)
- Authentication system needs to be built (but OAuth2 utilities provided)
- Project structure needs to be defined (not enforced by framework)

## Alternatives Considered

### Django + Django REST Framework (DRF)
**Strengths:**
- Mature, battle-tested framework (since 2005)
- Batteries-included approach with built-in admin panel
- Excellent ORM (Django ORM) with migrations
- Strong authentication system out of the box
- Large ecosystem of reusable apps
- Comprehensive documentation
- django-allauth for OAuth integration

**Why Not Chosen:**
- **Performance**: Significantly slower than FastAPI for async operations
- **Async support**: Bolted-on async support (added in Django 3.1+), not native
- **Boilerplate**: More configuration and boilerplate code required
- **API documentation**: Requires additional setup (drf-spectacular)
- **Type safety**: Less emphasis on type hints, more runtime magic
- **Overkill**: Too heavy for API-only project (includes templating, admin, etc.)
- **Monolithic**: Harder to adopt microservices if needed
- While Django is excellent for full-stack web apps, FastAPI's API-first design better suits our needs

### Flask + Flask-RESTful
**Strengths:**
- Lightweight and minimalist
- Flexible and unopinionated
- Large ecosystem of extensions
- Simple learning curve
- Good for small projects

**Why Not Chosen:**
- **No async support**: Synchronous only (blocks on I/O operations)
- **Manual validation**: No built-in request validation (need Flask-Marshmallow)
- **No auto-documentation**: Requires manual Swagger setup (Flask-RESTX)
- **More boilerplate**: Need to install/configure many extensions
- **Performance**: Slower than FastAPI due to sync nature
- **Type safety**: No built-in type checking support
- **Outdated approach**: Design predates async Python patterns
- Better suited for simpler applications without concurrent operations

### Express.js (Node.js)
**Strengths:**
- Mature Node.js framework
- Large ecosystem (npm)
- Good async performance
- Single language (JavaScript/TypeScript)

**Why Not Chosen:**
- Already decided on Python for AI integration advantages (ADR-001)
- Requires TypeScript for type safety (additional setup)
- No automatic validation/documentation like FastAPI
- Callback hell or Promise complexity without TypeScript
- Less suitable for our Python-first AI ecosystem

### NestJS (Node.js)
**Strengths:**
- TypeScript-first framework
- Angular-inspired architecture
- Excellent structure and modularity
- Built-in decorators and DI

**Why Not Chosen:**
- Already decided on Python (ADR-001)
- Steeper learning curve
- More enterprise-focused (overkill for 1-month project)
- Compilation step adds complexity
- Python AI SDKs superior to Node.js equivalents

## Implementation Strategy

### Project Structure
```
app/
├── main.py                 # FastAPI application entry point
├── api/
│   ├── v1/
│   │   ├── endpoints/
│   │   │   ├── auth.py
│   │   │   ├── theaters.py
│   │   │   ├── bookings.py
│   │   │   ├── ai_copilot.py
│   │   │   └── voice.py
│   │   └── router.py
├── core/
│   ├── config.py          # Settings and configuration
│   ├── security.py        # JWT, OAuth2 utilities
│   └── dependencies.py    # Dependency injection
├── db/
│   ├── models.py          # Database models
│   └── session.py         # Database connection
├── schemas/
│   └── *.py               # Pydantic models
├── services/
│   ├── ai_service.py
│   ├── voice_service.py
│   └── email_service.py
└── utils/
```

### Key Libraries to Use
- **FastAPI**: Core framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **SQLAlchemy 2.0**: Async ORM (if SQL) or Motor (if MongoDB)
- **python-jose**: JWT tokens
- **passlib**: Password hashing
- **python-multipart**: File uploads
- **authlib** or **httpx-oauth**: Google OAuth
- **pytest** + **httpx**: Testing

### Configuration
```python
# main.py example
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Movie Ticket Management System",
    description="API for theater and booking management",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(theaters_router, prefix="/api/v1/theaters", tags=["theaters"])
```

## Migration Path (if needed)

If we later need Django's admin panel or ORM features:
- FastAPI can coexist with Django
- Use FastAPI for API endpoints
- Use Django admin for backoffice management
- Share database models through SQLAlchemy

## References

- FastAPI Documentation: https://fastapi.tiangolo.com/
- FastAPI GitHub: https://github.com/tiangolo/fastapi
- Pydantic Documentation: https://docs.pydantic.dev/
- Starlette Documentation: https://www.starlette.io/
- FastAPI Performance Benchmarks: https://www.techempower.com/benchmarks/
- Real-world FastAPI Examples: https://github.com/nsidnev/fastapi-realworld-example-app
