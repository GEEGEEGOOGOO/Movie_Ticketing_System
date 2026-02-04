"""
Showtime API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.movie import ShowtimeCreate, ShowtimeResponse, ShowtimeWithDetails
from app.schemas.booking import ShowtimeSeats, SeatAvailability
from app.crud import movie as crud_movie
from app.crud import booking as crud_booking
from app.auth.security import get_current_user, require_role

router = APIRouter(prefix="/showtimes", tags=["Showtimes"])


@router.post("/", response_model=ShowtimeResponse, status_code=status.HTTP_201_CREATED)
async def create_showtime(
    showtime_data: ShowtimeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.OWNER))
):
    """Create a new showtime (Theater Owners only)"""
    showtime = crud_movie.create_showtime(db, showtime_data)
    if not showtime:
        raise HTTPException(
            status_code=400,
            detail="Failed to create showtime. Check movie/screen IDs or time conflicts."
        )
    return showtime


@router.get("/movie/{movie_id}", response_model=List[ShowtimeWithDetails])
async def get_movie_showtimes(
    movie_id: int,
    city: Optional[str] = None,
    date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """Get all showtimes for a movie"""
    movie = crud_movie.get_movie(db, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    showtimes = crud_movie.get_showtimes_by_movie(db, movie_id, city, date)
    
    # Enrich with details
    result = []
    for st in showtimes:
        # Count available seats
        available = crud_booking.get_available_seats(db, st.id)
        available_count = sum(1 for s in available if s.is_available)
        
        result.append(ShowtimeWithDetails(
            id=st.id,
            movie_id=st.movie_id,
            screen_id=st.screen_id,
            start_time=st.start_time,
            end_time=st.end_time,
            price_multiplier=st.price_multiplier,
            created_at=st.created_at,
            movie=st.movie,
            screen_name=st.screen.name,
            theater_name=st.screen.theater.name,
            theater_city=st.screen.theater.city,
            available_seats=available_count
        ))
    
    return result


@router.get("/date", response_model=List[ShowtimeWithDetails])
async def get_showtimes_by_date(
    date: datetime = Query(..., description="Date to filter showtimes"),
    city: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all showtimes for a specific date"""
    showtimes = crud_movie.get_showtimes_by_date(db, date, city)
    
    result = []
    for st in showtimes:
        available = crud_booking.get_available_seats(db, st.id)
        available_count = sum(1 for s in available if s.is_available)
        
        result.append(ShowtimeWithDetails(
            id=st.id,
            movie_id=st.movie_id,
            screen_id=st.screen_id,
            start_time=st.start_time,
            end_time=st.end_time,
            price_multiplier=st.price_multiplier,
            created_at=st.created_at,
            movie=st.movie,
            screen_name=st.screen.name,
            theater_name=st.screen.theater.name,
            theater_city=st.screen.theater.city,
            available_seats=available_count
        ))
    
    return result


@router.get("/{showtime_id}", response_model=ShowtimeWithDetails)
async def get_showtime(showtime_id: int, db: Session = Depends(get_db)):
    """Get showtime details"""
    showtime = crud_movie.get_showtime(db, showtime_id)
    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")
    
    available = crud_booking.get_available_seats(db, showtime_id)
    available_count = sum(1 for s in available if s.is_available)
    
    return ShowtimeWithDetails(
        id=showtime.id,
        movie_id=showtime.movie_id,
        screen_id=showtime.screen_id,
        start_time=showtime.start_time,
        end_time=showtime.end_time,
        price_multiplier=showtime.price_multiplier,
        created_at=showtime.created_at,
        movie=showtime.movie,
        screen_name=showtime.screen.name,
        theater_name=showtime.screen.theater.name,
        theater_city=showtime.screen.theater.city,
        available_seats=available_count
    )


@router.get("/{showtime_id}/seats", response_model=ShowtimeSeats)
async def get_showtime_seats(showtime_id: int, db: Session = Depends(get_db)):
    """Get all seats with availability for a showtime"""
    showtime = crud_movie.get_showtime(db, showtime_id)
    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")
    
    seats = crud_booking.get_available_seats(db, showtime_id)
    total = len(seats)
    available = sum(1 for s in seats if s.is_available)
    
    return ShowtimeSeats(
        showtime_id=showtime_id,
        movie_title=showtime.movie.title,
        screen_name=showtime.screen.name,
        start_time=showtime.start_time,
        seats=seats,
        total_seats=total,
        available_seats=available
    )


@router.delete("/{showtime_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_showtime(
    showtime_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.OWNER))
):
    """Delete a showtime (Theater Owner only)"""
    if not crud_movie.delete_showtime(db, showtime_id, current_user.id):
        raise HTTPException(status_code=404, detail="Showtime not found or not authorized")
