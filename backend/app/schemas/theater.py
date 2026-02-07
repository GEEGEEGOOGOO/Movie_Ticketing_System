"""
Theater, Screen, and Seat Pydantic schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.theater import SeatType


# --- Theater Schemas ---

class TheaterCreate(BaseModel):
    """Schema for creating a theater"""
    name: str = Field(..., min_length=1, max_length=255)
    location: str = Field(..., min_length=1, max_length=500)
    city: str = Field(..., min_length=1, max_length=100)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "PVR Cinemas Phoenix",
                "location": "Phoenix Mall, Lower Parel",
                "city": "Mumbai"
            }
        }


class TheaterUpdate(BaseModel):
    """Schema for updating a theater"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    location: Optional[str] = Field(None, min_length=1, max_length=500)
    city: Optional[str] = Field(None, min_length=1, max_length=100)


class TheaterResponse(BaseModel):
    """Schema for theater response"""
    id: int
    name: str
    location: str
    city: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    distance_km: Optional[float] = None
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TheaterWithScreens(TheaterResponse):
    """Schema for theater with screens included"""
    screens: List["ScreenResponse"] = []


# --- Screen Schemas ---

class ScreenCreate(BaseModel):
    """Schema for creating a screen"""
    name: str = Field(..., min_length=1, max_length=100)
    theater_id: int

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Screen 1",
                "theater_id": 1
            }
        }


class ScreenResponse(BaseModel):
    """Schema for screen response"""
    id: int
    name: str
    theater_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ScreenWithSeats(ScreenResponse):
    """Schema for screen with seats included"""
    seats: List["SeatResponse"] = []


# --- Seat Schemas ---

class SeatCreate(BaseModel):
    """Schema for creating a single seat"""
    row: str = Field(..., min_length=1, max_length=2)
    number: int = Field(..., ge=1, le=50)
    seat_type: SeatType = SeatType.REGULAR
    base_price: Decimal = Field(..., ge=0, decimal_places=2)
    screen_id: int


class SeatBulkCreate(BaseModel):
    """Schema for bulk seat creation"""
    screen_id: int
    rows: List[str] = Field(..., min_items=1)  # e.g., ["A", "B", "C"]
    seats_per_row: int = Field(..., ge=1, le=50)
    seat_type: SeatType = SeatType.REGULAR
    base_price: Decimal = Field(..., ge=0, decimal_places=2)

    class Config:
        json_schema_extra = {
            "example": {
                "screen_id": 1,
                "rows": ["A", "B", "C", "D", "E"],
                "seats_per_row": 12,
                "seat_type": "regular",
                "base_price": 200.00
            }
        }


class SeatResponse(BaseModel):
    """Schema for seat response"""
    id: int
    row: str
    number: int
    seat_type: SeatType
    base_price: Decimal
    screen_id: int

    class Config:
        from_attributes = True


# Update forward references
TheaterWithScreens.model_rebuild()
ScreenWithSeats.model_rebuild()
