"""
Booking API routes
Per ADR-003: ACID transactions for booking with race condition handling
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.schemas.booking import (
    BookingCreate, BookingResponse, BookingDetail, BookingList,
    PaymentCreate, PaymentResponse, PaymentConfirmation,
    BookingSeatResponse, BookingCancel, BookingCancelResponse
)
from app.crud import booking as crud_booking
from app.crud import movie as crud_movie
from app.auth.security import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new booking.
    Seats are locked for 10 minutes until payment is completed.
    Uses database constraints to prevent double-booking.
    """
    # Verify showtime exists
    showtime = crud_movie.get_showtime(db, booking_data.showtime_id)
    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")
    
    booking = crud_booking.create_booking(db, current_user.id, booking_data)
    if not booking:
        raise HTTPException(
            status_code=409,
            detail="Failed to create booking. Seats may already be booked or showtime has passed."
        )
    return booking


@router.get("/", response_model=BookingList)
async def get_my_bookings(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's booking history"""
    skip = (page - 1) * per_page
    bookings, total = crud_booking.get_user_bookings(db, current_user.id, skip, per_page)
    
    # Enrich with details
    detailed_bookings = []
    for booking in bookings:
        seats = [
            BookingSeatResponse(
                seat_id=bs.seat.id,
                row=bs.seat.row,
                number=bs.seat.number,
                seat_type=bs.seat.seat_type,
                price=bs.price
            )
            for bs in booking.booking_seats
        ]
        
        detailed_bookings.append(BookingDetail(
            id=booking.id,
            booking_reference=booking.booking_reference,
            user_id=booking.user_id,
            showtime_id=booking.showtime_id,
            status=booking.status,
            total_amount=booking.total_amount,
            seat_count=booking.seat_count,
            created_at=booking.created_at,
            expires_at=booking.expires_at,
            seats=seats,
            movie_title=booking.showtime.movie.title,
            movie_language=booking.showtime.movie.language.value,
            theater_name=booking.showtime.screen.theater.name,
            screen_name=booking.showtime.screen.name,
            show_time=booking.showtime.start_time,
            payment=booking.payment
        ))
    
    return BookingList(bookings=detailed_bookings, total=total)


@router.get("/{booking_id}", response_model=BookingDetail)
async def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get booking details"""
    booking = crud_booking.get_booking(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify ownership
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this booking")
    
    seats = [
        BookingSeatResponse(
            seat_id=bs.seat.id,
            row=bs.seat.row,
            number=bs.seat.number,
            seat_type=bs.seat.seat_type,
            price=bs.price
        )
        for bs in booking.booking_seats
    ]
    
    return BookingDetail(
        id=booking.id,
        booking_reference=booking.booking_reference,
        user_id=booking.user_id,
        showtime_id=booking.showtime_id,
        status=booking.status,
        total_amount=booking.total_amount,
        seat_count=booking.seat_count,
        created_at=booking.created_at,
        expires_at=booking.expires_at,
        seats=seats,
        movie_title=booking.showtime.movie.title,
        movie_language=booking.showtime.movie.language.value,
        theater_name=booking.showtime.screen.theater.name,
        screen_name=booking.showtime.screen.name,
        show_time=booking.showtime.start_time,
        payment=booking.payment
    )


@router.get("/reference/{booking_reference}", response_model=BookingDetail)
async def get_booking_by_reference(
    booking_reference: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get booking by reference number"""
    booking = crud_booking.get_booking_by_reference(db, booking_reference)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this booking")
    
    seats = [
        BookingSeatResponse(
            seat_id=bs.seat.id,
            row=bs.seat.row,
            number=bs.seat.number,
            seat_type=bs.seat.seat_type,
            price=bs.price
        )
        for bs in booking.booking_seats
    ]
    
    return BookingDetail(
        id=booking.id,
        booking_reference=booking.booking_reference,
        user_id=booking.user_id,
        showtime_id=booking.showtime_id,
        status=booking.status,
        total_amount=booking.total_amount,
        seat_count=booking.seat_count,
        created_at=booking.created_at,
        expires_at=booking.expires_at,
        seats=seats,
        movie_title=booking.showtime.movie.title,
        movie_language=booking.showtime.movie.language.value,
        theater_name=booking.showtime.screen.theater.name,
        screen_name=booking.showtime.screen.name,
        show_time=booking.showtime.start_time,
        payment=booking.payment
    )


@router.post("/{booking_id}/cancel", response_model=BookingCancelResponse)
async def cancel_booking(
    booking_id: int,
    cancel_data: BookingCancel | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel a booking"""
    cancellation_result = crud_booking.cancel_booking(db, booking_id, current_user.id)
    if not cancellation_result:
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel booking. It may not exist, already cancelled, or showtime has passed."
        )
    
    if cancel_data and cancel_data.reason:
        cancellation_result["message"] = (
            f"{cancellation_result['message']} "
            f"Cancellation reason noted: {cancel_data.reason}"
        )
    
    return cancellation_result


# --- Payment Endpoints ---

@router.post("/{booking_id}/pay", response_model=PaymentConfirmation)
async def process_payment(
    booking_id: int,
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Process payment for a booking (simulated).
    Per project requirements: simulated payment processing.
    """
    # Verify booking ownership
    booking = crud_booking.get_booking(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if payment_data.booking_id != booking_id:
        raise HTTPException(status_code=400, detail="Booking ID mismatch")
    
    # Process payment (simulated - always succeeds)
    payment = crud_booking.create_payment(
        db, booking_id, payment_data.payment_method, simulate_success=True
    )
    
    if not payment:
        raise HTTPException(
            status_code=400,
            detail="Payment failed. Booking may be expired or already paid."
        )
    
    return PaymentConfirmation(
        booking_reference=booking.booking_reference,
        transaction_id=payment.transaction_id,
        amount=payment.amount,
        status=payment.status,
        message="Payment successful! Your booking is confirmed."
    )
