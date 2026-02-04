"""
Movie and Showtime models
Per ADR-003: PostgreSQL with proper relationships
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Numeric, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.database import Base


class Genre(str, enum.Enum):
    ACTION = "Action"
    COMEDY = "Comedy"
    DRAMA = "Drama"
    HORROR = "Horror"
    SCIFI = "Sci-Fi"
    ROMANCE = "Romance"
    THRILLER = "Thriller"
    ANIMATION = "Animation"
    DOCUMENTARY = "Documentary"


class Language(str, enum.Enum):
    ENGLISH = "English"
    HINDI = "Hindi"
    TAMIL = "Tamil"
    TELUGU = "Telugu"
    MALAYALAM = "Malayalam"
    KANNADA = "Kannada"
    BENGALI = "Bengali"
    MARATHI = "Marathi"


class Rating(str, enum.Enum):
    U = "U"  # Universal
    UA = "UA"  # Parental Guidance
    A = "A"  # Adults Only
    S = "S"  # Restricted to special classes


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    genre = Column(Enum(Genre), nullable=False, index=True)
    language = Column(Enum(Language), nullable=False, index=True)
    duration = Column(Integer, nullable=False)  # Duration in minutes
    rating = Column(Enum(Rating), nullable=False)
    poster_url = Column(String(500), nullable=True)
    trailer_url = Column(String(500), nullable=True)
    release_date = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    showtimes = relationship("Showtime", back_populates="movie", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Movie(id={self.id}, title='{self.title}', language='{self.language}')>"


class Showtime(Base):
    __tablename__ = "showtimes"

    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    screen_id = Column(Integer, ForeignKey("screens.id", ondelete="CASCADE"), nullable=False)
    
    # Showtime details
    start_time = Column(DateTime(timezone=True), nullable=False, index=True)
    end_time = Column(DateTime(timezone=True), nullable=False)
    price_multiplier = Column(Numeric(3, 2), default=1.00)  # For peak hour pricing
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    movie = relationship("Movie", back_populates="showtimes")
    screen = relationship("Screen", back_populates="showtimes")
    bookings = relationship("Booking", back_populates="showtime", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Showtime(id={self.id}, movie_id={self.movie_id}, start_time='{self.start_time}')>"
