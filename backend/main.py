from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from app.auth.routes import router as auth_router
from app.routers.theaters import router as theaters_router
from app.routers.movies import router as movies_router
from app.routers.showtimes import router as showtimes_router
from app.routers.bookings import router as bookings_router
from app.routers.voice import router as voice_router
from app.database import engine, Base

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Movie Ticket Management API",
    description="Backend API for Movie Ticket Booking System with JWT Authentication",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:5173"),
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(theaters_router, prefix="/api")
app.include_router(movies_router, prefix="/api")
app.include_router(showtimes_router, prefix="/api")
app.include_router(bookings_router, prefix="/api")
app.include_router(voice_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Movie Ticket Management API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "postgresql"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
