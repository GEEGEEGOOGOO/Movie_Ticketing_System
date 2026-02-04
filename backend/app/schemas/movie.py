"""
Movie and Showtime Pydantic schemas
"""
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.movie import Genre, Language, Rating


# --- Movie Schemas ---

class MovieCreate(BaseModel):
    """Schema for creating a movie"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    genre: Genre
    language: Language
    duration: int = Field(..., ge=1, le=600)  # 1 min to 10 hours
    rating: Rating
    poster_url: Optional[str] = Field(None, max_length=500)
    trailer_url: Optional[str] = Field(None, max_length=500)
    release_date: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Inception",
                "description": "A thief who steals corporate secrets...",
                "genre": "Sci-Fi",
                "language": "English",
                "duration": 148,
                "rating": "UA",
                "poster_url": "https://example.com/inception.jpg",
                "release_date": "2010-07-16T00:00:00Z"
            }
        }


class MovieUpdate(BaseModel):
    """Schema for updating a movie"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    genre: Optional[Genre] = None
    language: Optional[Language] = None
    duration: Optional[int] = Field(None, ge=1, le=600)
    rating: Optional[Rating] = None
    poster_url: Optional[str] = Field(None, max_length=500)
    trailer_url: Optional[str] = Field(None, max_length=500)
    release_date: Optional[datetime] = None


class MovieResponse(BaseModel):
    """Schema for movie response"""
    id: int
    title: str
    description: Optional[str]
    genre: Genre
    language: Language
    duration: int
    rating: Rating
    poster_url: Optional[str]
    trailer_url: Optional[str]
    release_date: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class MovieList(BaseModel):
    """Schema for paginated movie list"""
    movies: List[MovieResponse]
    total: int
    page: int
    per_page: int


# --- Showtime Schemas ---

class ShowtimeCreate(BaseModel):
    """Schema for creating a showtime"""
    movie_id: int
    screen_id: int
    start_time: datetime
    price_multiplier: Decimal = Field(default=Decimal("1.00"), ge=0.5, le=3.0)

    class Config:
        json_schema_extra = {
            "example": {
                "movie_id": 1,
                "screen_id": 1,
                "start_time": "2026-01-31T18:00:00Z",
                "price_multiplier": 1.00
            }
        }


class ShowtimeResponse(BaseModel):
    """Schema for showtime response"""
    id: int
    movie_id: int
    screen_id: int
    start_time: datetime
    end_time: datetime
    price_multiplier: Decimal
    created_at: datetime

    class Config:
        from_attributes = True


class ShowtimeWithDetails(ShowtimeResponse):
    """Schema for showtime with movie and screen details"""
    movie: MovieResponse
    screen_name: str
    theater_name: str
    theater_city: str
    available_seats: int


class ShowtimeFilter(BaseModel):
    """Schema for filtering showtimes"""
    movie_id: Optional[int] = None
    theater_id: Optional[int] = None
    city: Optional[str] = None
    date: Optional[datetime] = None
    language: Optional[Language] = None
    genre: Optional[Genre] = None
