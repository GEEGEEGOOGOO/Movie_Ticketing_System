"""
Theater API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.theater import (
    TheaterCreate, TheaterResponse, TheaterUpdate, TheaterWithScreens,
    ScreenCreate, ScreenResponse, ScreenWithSeats,
    SeatBulkCreate, SeatResponse
)
from app.crud import theater as crud_theater
from app.auth.security import get_current_user, require_role

router = APIRouter(prefix="/theaters", tags=["Theaters"])


# --- Theater Endpoints ---

@router.post("/", response_model=TheaterResponse, status_code=status.HTTP_201_CREATED)
async def create_theater(
    theater_data: TheaterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.OWNER))
):
    """Create a new theater (Theater Owners only)"""
    return crud_theater.create_theater(db, theater_data, current_user.id)


@router.get("/", response_model=List[TheaterResponse])
async def list_theaters(
    city: str = None,
    latitude: float = None,
    longitude: float = None,
    radius_km: float = 7.0,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    List all theaters, optionally filtered by:
    - city: Filter by city name
    - latitude/longitude: GPS coordinates for distance-based search
    - radius_km: Search radius in kilometers (default: 7km)
    """
    # If GPS coordinates provided, search by distance
    if latitude is not None and longitude is not None:
        return crud_theater.get_theaters_nearby(db, latitude, longitude, radius_km)
    
    # Otherwise filter by city if provided
    if city:
        return crud_theater.get_theaters_by_city(db, city)
    
    return crud_theater.get_all_theaters(db, skip, limit)


@router.get("/nearby", response_model=List[TheaterResponse])
async def get_nearby_theaters(
    radius_km: float = 7.0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get theaters within radius_km of user's saved location"""
    if not current_user.latitude or not current_user.longitude:
        raise HTTPException(
            status_code=400, 
            detail="User location not set. Please update your location first."
        )
    
    return crud_theater.get_theaters_nearby(
        db, 
        float(current_user.latitude), 
        float(current_user.longitude), 
        radius_km
    )



@router.get("/my-theaters", response_model=List[TheaterWithScreens])
async def get_my_theaters(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.OWNER))
):
    """Get all theaters owned by the current user"""
    theaters = crud_theater.get_theaters_by_owner(db, current_user.id)
    return theaters


@router.get("/{theater_id}", response_model=TheaterWithScreens)
async def get_theater(theater_id: int, db: Session = Depends(get_db)):
    """Get theater details with screens"""
    theater = crud_theater.get_theater(db, theater_id)
    if not theater:
        raise HTTPException(status_code=404, detail="Theater not found")
    return theater


@router.put("/{theater_id}", response_model=TheaterResponse)
async def update_theater(
    theater_id: int,
    theater_data: TheaterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.OWNER))
):
    """Update a theater (owner only)"""
    theater = crud_theater.update_theater(db, theater_id, theater_data, current_user.id)
    if not theater:
        raise HTTPException(status_code=404, detail="Theater not found or not authorized")
    return theater


@router.delete("/{theater_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_theater(
    theater_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.OWNER))
):
    """Delete a theater (owner only)"""
    if not crud_theater.delete_theater(db, theater_id, current_user.id):
        raise HTTPException(status_code=404, detail="Theater not found or not authorized")


# --- Screen Endpoints ---

@router.post("/screens", response_model=ScreenResponse, status_code=status.HTTP_201_CREATED)
async def create_screen(
    screen_data: ScreenCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.OWNER))
):
    """Create a new screen in a theater (owner only)"""
    screen = crud_theater.create_screen(db, screen_data, current_user.id)
    if not screen:
        raise HTTPException(
            status_code=400,
            detail="Failed to create screen. Check theater ownership or duplicate name."
        )
    return screen


@router.get("/{theater_id}/screens", response_model=List[ScreenResponse])
async def get_theater_screens(theater_id: int, db: Session = Depends(get_db)):
    """Get all screens in a theater"""
    theater = crud_theater.get_theater(db, theater_id)
    if not theater:
        raise HTTPException(status_code=404, detail="Theater not found")
    return crud_theater.get_screens_by_theater(db, theater_id)


@router.get("/screens/{screen_id}", response_model=ScreenWithSeats)
async def get_screen_with_seats(screen_id: int, db: Session = Depends(get_db)):
    """Get screen details with all seats"""
    screen = crud_theater.get_screen(db, screen_id)
    if not screen:
        raise HTTPException(status_code=404, detail="Screen not found")
    return screen


# --- Seat Endpoints ---

@router.post("/seats/bulk", response_model=List[SeatResponse], status_code=status.HTTP_201_CREATED)
async def create_seats_bulk(
    bulk_data: SeatBulkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.OWNER))
):
    """Create multiple seats at once (owner only)"""
    seats = crud_theater.create_seats_bulk(db, bulk_data, current_user.id)
    if not seats:
        raise HTTPException(
            status_code=400,
            detail="Failed to create seats. Check screen ownership or duplicate seats."
        )
    return seats


@router.get("/screens/{screen_id}/seats", response_model=List[SeatResponse])
async def get_screen_seats(screen_id: int, db: Session = Depends(get_db)):
    """Get all seats in a screen"""
    screen = crud_theater.get_screen(db, screen_id)
    if not screen:
        raise HTTPException(status_code=404, detail="Screen not found")
    return crud_theater.get_seats_by_screen(db, screen_id)
