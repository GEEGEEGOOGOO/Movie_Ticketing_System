"""
User CRUD operations
"""
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Optional
from passlib.context import CryptContext

from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_user(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()


def get_user_by_google_id(db: Session, google_id: str) -> Optional[User]:
    """Get user by Google OAuth ID"""
    return db.query(User).filter(User.google_id == google_id).first()


def create_user(db: Session, user_data: UserCreate) -> User:
    """Create a new user"""
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        name=user_data.name,
        role=user_data.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_oauth_user(db: Session, email: str, name: str, google_id: str) -> User:
    """Create a new user from OAuth"""
    db_user = User(
        email=email,
        name=name,
        google_id=google_id,
        role=UserRole.CUSTOMER,
        is_verified=True  # OAuth users are pre-verified
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, user_data: UserUpdate) -> Optional[User]:
    """Update user profile"""
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user_data.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["password_hash"] = get_password_hash(update_data.pop("password"))
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user


def set_user_otp(db: Session, user_id: int, otp: str, expires_at) -> Optional[User]:
    """Set OTP for user verification"""
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    db_user.verification_otp = otp
    db_user.otp_expires_at = expires_at
    db.commit()
    db.refresh(db_user)
    return db_user


def verify_user_email(db: Session, user_id: int) -> Optional[User]:
    """Mark user email as verified"""
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    db_user.is_verified = True
    db_user.verification_otp = None
    db_user.otp_expires_at = None
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate user with email and password"""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not user.password_hash:
        return None  # OAuth user trying to login with password
    if not verify_password(password, user.password_hash):
        return None
    return user
