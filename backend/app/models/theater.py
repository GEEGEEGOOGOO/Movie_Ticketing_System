"""
Theater, Screen, and Seat models
Per ADR-003: PostgreSQL with proper relationships and constraints
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Numeric, UniqueConstraint, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.database import Base


class SeatType(str, enum.Enum):
    REGULAR = "regular"
    PREMIUM = "premium"
    RECLINER = "recliner"


class Theater(Base):
    __tablename__ = "theaters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(500), nullable=False)
    city = Column(String(100), nullable=False, index=True)
    
    # GPS coordinates for distance-based search
    latitude = Column(Numeric(10, 8), nullable=True)  # e.g., 40.7128
    longitude = Column(Numeric(11, 8), nullable=True)  # e.g., -74.0060
    
    # Foreign key to owner (User with role=owner)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="theaters")
    screens = relationship("Screen", back_populates="theater", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Theater(id={self.id}, name='{self.name}', city='{self.city}')>"


class Screen(Base):
    __tablename__ = "screens"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)  # e.g., "Screen 1", "IMAX"
    
    # Foreign key to theater
    theater_id = Column(Integer, ForeignKey("theaters.id", ondelete="CASCADE"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    theater = relationship("Theater", back_populates="screens")
    seats = relationship("Seat", back_populates="screen", cascade="all, delete-orphan")
    showtimes = relationship("Showtime", back_populates="screen", cascade="all, delete-orphan")

    # Unique constraint: screen name unique within a theater
    __table_args__ = (
        UniqueConstraint('theater_id', 'name', name='unique_screen_per_theater'),
    )

    def __repr__(self):
        return f"<Screen(id={self.id}, name='{self.name}', theater_id={self.theater_id})>"


class Seat(Base):
    __tablename__ = "seats"

    id = Column(Integer, primary_key=True, index=True)
    row = Column(String(2), nullable=False)  # e.g., "A", "B", "AA"
    number = Column(Integer, nullable=False)  # Seat number in row
    seat_type = Column(Enum(SeatType), default=SeatType.REGULAR, nullable=False)
    base_price = Column(Numeric(10, 2), nullable=False)  # Base price for this seat
    
    # Foreign key to screen
    screen_id = Column(Integer, ForeignKey("screens.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    screen = relationship("Screen", back_populates="seats")
    booking_seats = relationship("BookingSeat", back_populates="seat")

    # Unique constraint: seat position unique within a screen
    __table_args__ = (
        UniqueConstraint('screen_id', 'row', 'number', name='unique_seat_position'),
    )

    def __repr__(self):
        return f"<Seat(id={self.id}, row='{self.row}', number={self.number}, type='{self.seat_type}')>"
