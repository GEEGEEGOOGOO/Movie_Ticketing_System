"""
API Routers package
"""
from app.routers.theaters import router as theaters_router
from app.routers.movies import router as movies_router
from app.routers.showtimes import router as showtimes_router
from app.routers.bookings import router as bookings_router

__all__ = [
    "theaters_router",
    "movies_router",
    "showtimes_router",
    "bookings_router"
]
