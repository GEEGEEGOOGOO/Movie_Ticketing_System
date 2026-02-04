"""
Movie API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.user import User, UserRole
from app.models.movie import Genre, Language
from app.schemas.movie import (
    MovieCreate, MovieResponse, MovieUpdate, MovieList
)
from app.crud import movie as crud_movie
from app.auth.security import get_current_user, require_role

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.post("/", response_model=MovieResponse, status_code=status.HTTP_201_CREATED)
async def create_movie(
    movie_data: MovieCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.OWNER))
):
    """Create a new movie (Theater Owners only)"""
    return crud_movie.create_movie(db, movie_data)


@router.get("/", response_model=MovieList)
async def list_movies(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    genre: Optional[Genre] = None,
    language: Optional[Language] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all movies with filtering and pagination"""
    skip = (page - 1) * per_page
    movies, total = crud_movie.get_movies(
        db, skip=skip, limit=per_page,
        genre=genre, language=language, search=search
    )
    return MovieList(
        movies=movies,
        total=total,
        page=page,
        per_page=per_page
    )


@router.get("/{movie_id}", response_model=MovieResponse)
async def get_movie(movie_id: int, db: Session = Depends(get_db)):
    """Get movie details"""
    movie = crud_movie.get_movie(db, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


@router.put("/{movie_id}", response_model=MovieResponse)
async def update_movie(
    movie_id: int,
    movie_data: MovieUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.OWNER))
):
    """Update a movie (Theater Owners only)"""
    movie = crud_movie.update_movie(db, movie_id, movie_data)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_movie(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.OWNER))
):
    """Delete a movie (Theater Owners only)"""
    if not crud_movie.delete_movie(db, movie_id):
        raise HTTPException(status_code=404, detail="Movie not found")


@router.get("/genres/list", response_model=List[str])
async def list_genres():
    """Get all available genres"""
    return [g.value for g in Genre]


@router.get("/languages/list", response_model=List[str])
async def list_languages():
    """Get all available languages"""
    return [l.value for l in Language]
