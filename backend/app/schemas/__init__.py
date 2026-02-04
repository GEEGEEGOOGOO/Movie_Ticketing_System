"""
Pydantic schemas package - exports all request/response models
"""
from app.schemas.user import (
    UserCreate, UserResponse, UserLogin, UserUpdate, Token, TokenData
)
from app.schemas.theater import (
    TheaterCreate, TheaterResponse, TheaterUpdate,
    ScreenCreate, ScreenResponse,
    SeatCreate, SeatResponse, SeatBulkCreate
)
from app.schemas.movie import (
    MovieCreate, MovieResponse, MovieUpdate,
    ShowtimeCreate, ShowtimeResponse
)
from app.schemas.booking import (
    BookingCreate, BookingResponse, BookingDetail,
    PaymentCreate, PaymentResponse,
    SeatAvailability
)

__all__ = [
    # User
    "UserCreate", "UserResponse", "UserLogin", "UserUpdate", "Token", "TokenData",
    # Theater
    "TheaterCreate", "TheaterResponse", "TheaterUpdate",
    "ScreenCreate", "ScreenResponse",
    "SeatCreate", "SeatResponse", "SeatBulkCreate",
    # Movie
    "MovieCreate", "MovieResponse", "MovieUpdate",
    "ShowtimeCreate", "ShowtimeResponse",
    # Booking
    "BookingCreate", "BookingResponse", "BookingDetail",
    "PaymentCreate", "PaymentResponse",
    "SeatAvailability"
]
