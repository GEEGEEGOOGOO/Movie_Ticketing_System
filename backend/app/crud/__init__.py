"""
CRUD operations package
"""
from app.crud.user import (
    get_user, get_user_by_email, create_user, update_user
)
from app.crud.theater import (
    create_theater, get_theater, get_theaters_by_owner, get_theaters_by_city,
    update_theater, delete_theater,
    create_screen, get_screen, get_screens_by_theater,
    create_seats_bulk, get_seats_by_screen
)
from app.crud.movie import (
    create_movie, get_movie, get_movies, update_movie, delete_movie,
    create_showtime, get_showtime, get_showtimes_by_movie, get_showtimes_by_date
)
from app.crud.booking import (
    get_available_seats, create_booking, get_booking, get_user_bookings,
    confirm_booking, cancel_booking, create_payment
)
