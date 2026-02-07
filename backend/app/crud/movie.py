"""
Movie and Showtime CRUD operations
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import List, Optional, Union
from datetime import datetime, timedelta, date

from app.models.movie import Movie, Showtime, Genre, Language
from app.models.theater import Screen, Theater
from app.schemas.movie import MovieCreate, MovieUpdate, ShowtimeCreate


# --- Movie CRUD ---

def create_movie(db: Session, movie_data: MovieCreate) -> Movie:
    """Create a new movie"""
    db_movie = Movie(
        title=movie_data.title,
        description=movie_data.description,
        genre=movie_data.genre,
        language=movie_data.language,
        duration=movie_data.duration,
        rating=movie_data.rating,
        poster_url=movie_data.poster_url,
        trailer_url=movie_data.trailer_url,
        release_date=movie_data.release_date
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie


def get_movie(db: Session, movie_id: int) -> Optional[Movie]:
    """Get movie by ID"""
    return db.query(Movie).filter(Movie.id == movie_id).first()


def get_movie_by_title(db: Session, title: str) -> Optional[Movie]:
    """Get movie by title"""
    return db.query(Movie).filter(Movie.title.ilike(f"%{title}%")).first()


def get_movies(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    genre: Optional[Genre] = None,
    language: Optional[Language] = None,
    search: Optional[str] = None
) -> tuple[List[Movie], int]:
    """Get movies with filters and pagination"""
    query = db.query(Movie)
    
    if genre:
        query = query.filter(Movie.genre == genre)
    if language:
        query = query.filter(Movie.language == language)
    if search:
        query = query.filter(Movie.title.ilike(f"%{search}%"))
    
    total = query.count()
    movies = query.order_by(Movie.created_at.desc()).offset(skip).limit(limit).all()
    
    return movies, total


def update_movie(db: Session, movie_id: int, movie_data: MovieUpdate) -> Optional[Movie]:
    """Update a movie"""
    db_movie = get_movie(db, movie_id)
    if not db_movie:
        return None
    
    update_data = movie_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_movie, key, value)
    
    db.commit()
    db.refresh(db_movie)
    return db_movie


def delete_movie(db: Session, movie_id: int) -> bool:
    """Delete a movie"""
    db_movie = get_movie(db, movie_id)
    if not db_movie:
        return False
    
    db.delete(db_movie)
    db.commit()
    return True


# --- Showtime CRUD ---

def create_showtime(db: Session, showtime_data: ShowtimeCreate) -> Optional[Showtime]:
    """Create a new showtime"""
    # Get movie to calculate end time
    movie = get_movie(db, showtime_data.movie_id)
    if not movie:
        return None
    
    # Verify screen exists
    screen = db.query(Screen).filter(Screen.id == showtime_data.screen_id).first()
    if not screen:
        return None
    
    # Calculate end time based on movie duration + 15 min buffer
    end_time = showtime_data.start_time + timedelta(minutes=movie.duration + 15)
    
    # Check for overlapping showtimes on the same screen
    overlapping = db.query(Showtime).filter(
        Showtime.screen_id == showtime_data.screen_id,
        Showtime.start_time < end_time,
        Showtime.end_time > showtime_data.start_time
    ).first()
    
    if overlapping:
        return None  # Time slot conflict
    
    db_showtime = Showtime(
        movie_id=showtime_data.movie_id,
        screen_id=showtime_data.screen_id,
        start_time=showtime_data.start_time,
        end_time=end_time,
        price_multiplier=showtime_data.price_multiplier
    )
    db.add(db_showtime)
    db.commit()
    db.refresh(db_showtime)
    return db_showtime


def get_showtime(db: Session, showtime_id: int) -> Optional[Showtime]:
    """Get showtime by ID"""
    return db.query(Showtime).filter(Showtime.id == showtime_id).first()


def get_showtimes_by_movie(
    db: Session,
    movie_id: int,
    city: Optional[str] = None,
    filter_date: Optional[Union[date, datetime]] = None
) -> List[Showtime]:
    """Get all showtimes for a movie with optional filters"""
    query = db.query(Showtime).join(Screen).join(Theater).filter(
        Showtime.movie_id == movie_id,
        Showtime.start_time >= datetime.now()  # Only future showtimes
    )
    
    if city:
        query = query.filter(Theater.city.ilike(f"%{city}%"))
    
    if filter_date:
        # Convert date to datetime if needed
        if isinstance(filter_date, date) and not isinstance(filter_date, datetime):
            start_of_day = datetime.combine(filter_date, datetime.min.time())
        else:
            start_of_day = filter_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        query = query.filter(
            Showtime.start_time >= start_of_day,
            Showtime.start_time < end_of_day
        )
    
    return query.order_by(Showtime.start_time).all()


def get_showtimes_by_date(
    db: Session,
    date: datetime,
    city: Optional[str] = None
) -> List[Showtime]:
    """Get all showtimes for a date"""
    start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = start_of_day + timedelta(days=1)
    
    query = db.query(Showtime).join(Screen).join(Theater).filter(
        Showtime.start_time >= start_of_day,
        Showtime.start_time < end_of_day
    )
    
    if city:
        query = query.filter(Theater.city.ilike(f"%{city}%"))
    
    return query.order_by(Showtime.start_time).all()


def get_showtimes_by_theater(db: Session, theater_id: int) -> List[Showtime]:
    """Get all future showtimes for a theater"""
    return db.query(Showtime).join(Screen).filter(
        Screen.theater_id == theater_id,
        Showtime.start_time >= datetime.now()
    ).order_by(Showtime.start_time).all()


def delete_showtime(db: Session, showtime_id: int, owner_id: int) -> bool:
    """Delete a showtime (only by theater owner)"""
    showtime = db.query(Showtime).join(Screen).join(Theater).filter(
        Showtime.id == showtime_id,
        Theater.owner_id == owner_id
    ).first()
    
    if not showtime:
        return False
    
    db.delete(showtime)
    db.commit()
    return True
