"""
User Pydantic schemas for request/response validation
Per ADR-004: JWT authentication with role-based access
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


# --- Request Schemas ---

class UserCreate(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    name: str = Field(..., min_length=1, max_length=255)
    role: UserRole = UserRole.CUSTOMER

    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com",
                "password": "securepassword123",
                "name": "John Doe",
                "role": "customer"
            }
        }


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com",
                "password": "securepassword123"
            }
        }


class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    password: Optional[str] = Field(None, min_length=8, max_length=100)


# --- Response Schemas ---

class UserResponse(BaseModel):
    """Schema for user response (public data only)"""
    id: int
    email: EmailStr
    name: str
    role: UserRole
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    """Schema for decoded JWT token data"""
    user_id: Optional[int] = None
    email: Optional[str] = None
    role: Optional[str] = None


# --- OTP Schemas ---

class OTPRequest(BaseModel):
    """Schema for requesting OTP"""
    email: EmailStr


class OTPVerify(BaseModel):
    """Schema for verifying OTP"""
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)


class PasswordReset(BaseModel):
    """Schema for password reset"""
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8, max_length=100)
