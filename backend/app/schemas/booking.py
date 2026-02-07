"""
Booking and Payment Pydantic schemas
Per ADR-003: Support for ACID transactions and race condition handling
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.booking import BookingStatus, PaymentStatus
from app.models.theater import SeatType


# --- Seat Availability ---

class SeatAvailability(BaseModel):
    """Schema for seat availability in a showtime"""
    seat_id: int
    row: str
    number: int
    seat_type: SeatType
    price: Decimal  # Calculated price with multiplier
    is_available: bool

    class Config:
        from_attributes = True


class ShowtimeSeats(BaseModel):
    """Schema for all seats in a showtime"""
    showtime_id: int
    movie_title: str
    screen_name: str
    start_time: datetime
    seats: List[SeatAvailability]
    total_seats: int
    available_seats: int


# --- Booking Schemas ---

class BookingCreate(BaseModel):
    """Schema for creating a booking"""
    showtime_id: int
    seat_ids: List[int] = Field(..., min_items=1, max_items=10)

    class Config:
        json_schema_extra = {
            "example": {
                "showtime_id": 1,
                "seat_ids": [1, 2, 3]
            }
        }


class BookingSeatResponse(BaseModel):
    """Schema for booked seat details"""
    seat_id: int
    row: str
    number: int
    seat_type: SeatType
    price: Decimal

    class Config:
        from_attributes = True


class BookingResponse(BaseModel):
    """Schema for booking response"""
    id: int
    booking_reference: str
    user_id: int
    showtime_id: int
    status: BookingStatus
    total_amount: Decimal
    seat_count: int
    created_at: datetime
    expires_at: Optional[datetime]

    class Config:
        from_attributes = True


class BookingDetail(BookingResponse):
    """Schema for detailed booking with seats and movie info"""
    seats: List[BookingSeatResponse]
    movie_title: str
    movie_language: str
    theater_name: str
    screen_name: str
    show_time: datetime
    payment: Optional["PaymentResponse"] = None


class BookingList(BaseModel):
    """Schema for user's booking history"""
    bookings: List[BookingDetail]
    total: int


# --- Payment Schemas ---

class PaymentCreate(BaseModel):
    """Schema for creating/processing payment"""
    booking_id: int
    payment_method: str = Field(..., max_length=50)  # "card", "upi", "simulated"

    class Config:
        json_schema_extra = {
            "example": {
                "booking_id": 1,
                "payment_method": "simulated"
            }
        }


class PaymentResponse(BaseModel):
    """Schema for payment response"""
    id: int
    booking_id: int
    amount: Decimal
    status: PaymentStatus
    transaction_id: Optional[str]
    payment_method: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class PaymentConfirmation(BaseModel):
    """Schema for payment confirmation (simulated)"""
    booking_reference: str
    transaction_id: str
    amount: Decimal
    status: PaymentStatus
    message: str


# --- Cancel Booking ---

class RefundSimulation(BaseModel):
    """Schema for simulated refund details returned during cancellation"""
    refund_reference: str
    original_transaction_id: Optional[str] = None
    amount: Decimal
    status: str  # "processed"
    processed_at: datetime
    is_simulated: bool = True
    message: str


class BookingCancel(BaseModel):
    """Schema for cancelling a booking"""
    reason: Optional[str] = None


class BookingCancelResponse(BaseModel):
    """Schema for cancellation response with refund simulation details"""
    booking: BookingResponse
    refund: Optional[RefundSimulation] = None
    message: str


# Update forward references
BookingDetail.model_rebuild()
