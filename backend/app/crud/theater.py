"""
Theater, Screen, and Seat CRUD operations
"""
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional

from app.models.theater import Theater, Screen, Seat, SeatType
from app.schemas.theater import (
    TheaterCreate, TheaterUpdate, ScreenCreate, SeatCreate, SeatBulkCreate
)


# --- Theater CRUD ---

def create_theater(db: Session, theater_data: TheaterCreate, owner_id: int) -> Theater:
    """Create a new theater"""
    db_theater = Theater(
        name=theater_data.name,
        location=theater_data.location,
        city=theater_data.city,
        owner_id=owner_id
    )
    db.add(db_theater)
    db.commit()
    db.refresh(db_theater)
    return db_theater


def get_theater(db: Session, theater_id: int) -> Optional[Theater]:
    """Get theater by ID"""
    return db.query(Theater).filter(Theater.id == theater_id).first()


def get_theaters_by_owner(db: Session, owner_id: int) -> List[Theater]:
    """Get all theaters owned by a user"""
    return db.query(Theater).filter(Theater.owner_id == owner_id).all()


def get_theaters_by_city(db: Session, city: str) -> List[Theater]:
    """Get all theaters in a city"""
    return db.query(Theater).filter(Theater.city.ilike(f"%{city}%")).all()


def get_all_theaters(db: Session, skip: int = 0, limit: int = 100) -> List[Theater]:
    """Get all theaters with pagination"""
    return db.query(Theater).offset(skip).limit(limit).all()


def update_theater(
    db: Session, theater_id: int, theater_data: TheaterUpdate, owner_id: int
) -> Optional[Theater]:
    """Update a theater (only by owner)"""
    db_theater = db.query(Theater).filter(
        Theater.id == theater_id,
        Theater.owner_id == owner_id
    ).first()
    
    if not db_theater:
        return None
    
    update_data = theater_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_theater, key, value)
    
    db.commit()
    db.refresh(db_theater)
    return db_theater


def delete_theater(db: Session, theater_id: int, owner_id: int) -> bool:
    """Delete a theater (only by owner)"""
    db_theater = db.query(Theater).filter(
        Theater.id == theater_id,
        Theater.owner_id == owner_id
    ).first()
    
    if not db_theater:
        return False
    
    db.delete(db_theater)
    db.commit()
    return True


# --- Screen CRUD ---

def create_screen(db: Session, screen_data: ScreenCreate, owner_id: int) -> Optional[Screen]:
    """Create a new screen (verify theater ownership)"""
    # Verify theater ownership
    theater = db.query(Theater).filter(
        Theater.id == screen_data.theater_id,
        Theater.owner_id == owner_id
    ).first()
    
    if not theater:
        return None
    
    db_screen = Screen(
        name=screen_data.name,
        theater_id=screen_data.theater_id
    )
    
    try:
        db.add(db_screen)
        db.commit()
        db.refresh(db_screen)
        return db_screen
    except IntegrityError:
        db.rollback()
        return None  # Duplicate screen name


def get_screen(db: Session, screen_id: int) -> Optional[Screen]:
    """Get screen by ID"""
    return db.query(Screen).filter(Screen.id == screen_id).first()


def get_screens_by_theater(db: Session, theater_id: int) -> List[Screen]:
    """Get all screens in a theater"""
    return db.query(Screen).filter(Screen.theater_id == theater_id).all()


# --- Seat CRUD ---

def create_seat(db: Session, seat_data: SeatCreate) -> Optional[Seat]:
    """Create a single seat"""
    db_seat = Seat(
        row=seat_data.row,
        number=seat_data.number,
        seat_type=seat_data.seat_type,
        base_price=seat_data.base_price,
        screen_id=seat_data.screen_id
    )
    
    try:
        db.add(db_seat)
        db.commit()
        db.refresh(db_seat)
        return db_seat
    except IntegrityError:
        db.rollback()
        return None


def create_seats_bulk(db: Session, bulk_data: SeatBulkCreate, owner_id: int) -> List[Seat]:
    """Create multiple seats at once (verify screen ownership)"""
    # Verify screen ownership through theater
    screen = db.query(Screen).join(Theater).filter(
        Screen.id == bulk_data.screen_id,
        Theater.owner_id == owner_id
    ).first()
    
    if not screen:
        return []
    
    seats = []
    for row in bulk_data.rows:
        for num in range(1, bulk_data.seats_per_row + 1):
            seat = Seat(
                row=row,
                number=num,
                seat_type=bulk_data.seat_type,
                base_price=bulk_data.base_price,
                screen_id=bulk_data.screen_id
            )
            seats.append(seat)
    
    try:
        db.add_all(seats)
        db.commit()
        for seat in seats:
            db.refresh(seat)
        return seats
    except IntegrityError:
        db.rollback()
        return []


def get_seats_by_screen(db: Session, screen_id: int) -> List[Seat]:
    """Get all seats in a screen"""
    return db.query(Seat).filter(
        Seat.screen_id == screen_id
    ).order_by(Seat.row, Seat.number).all()


def get_seat(db: Session, seat_id: int) -> Optional[Seat]:
    """Get seat by ID"""
    return db.query(Seat).filter(Seat.id == seat_id).first()
