"""
Booking and Payment CRUD operations
Per ADR-003: ACID transactions with race condition handling
"""
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime, timedelta
from decimal import Decimal
import uuid

from app.models.booking import Booking, BookingSeat, Payment, BookingStatus, PaymentStatus
from app.models.theater import Seat
from app.models.movie import Showtime
from app.schemas.booking import BookingCreate, SeatAvailability


def generate_booking_reference() -> str:
    """Generate unique booking reference"""
    timestamp = datetime.now().strftime("%Y%m%d")
    unique_id = uuid.uuid4().hex[:6].upper()
    return f"BK{timestamp}{unique_id}"


def get_available_seats(db: Session, showtime_id: int) -> List[SeatAvailability]:
    """
    Get all seats with availability status for a showtime.
    Uses subquery to check booked seats efficiently.
    """
    showtime = db.query(Showtime).filter(Showtime.id == showtime_id).first()
    if not showtime:
        return []
    
    # Get all seats for the screen
    seats = db.query(Seat).filter(Seat.screen_id == showtime.screen_id).all()
    
    # Get booked seat IDs for this showtime (confirmed or pending non-expired)
    booked_seat_ids = db.query(BookingSeat.seat_id).join(Booking).filter(
        BookingSeat.showtime_id == showtime_id,
        Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
        # Exclude expired pending bookings
        ~and_(
            Booking.status == BookingStatus.PENDING,
            Booking.expires_at < datetime.now()
        )
    ).all()
    booked_ids = {seat_id for (seat_id,) in booked_seat_ids}
    
    # Calculate price with multiplier
    result = []
    for seat in seats:
        price = Decimal(str(seat.base_price)) * showtime.price_multiplier
        result.append(SeatAvailability(
            seat_id=seat.id,
            row=seat.row,
            number=seat.number,
            seat_type=seat.seat_type,
            price=price.quantize(Decimal("0.01")),
            is_available=seat.id not in booked_ids
        ))
    
    return sorted(result, key=lambda s: (s.row, s.number))


def create_booking(
    db: Session,
    user_id: int,
    booking_data: BookingCreate
) -> Optional[Booking]:
    """
    Create a booking with race condition handling.
    Uses database unique constraint to prevent double-booking.
    """
    showtime = db.query(Showtime).filter(Showtime.id == booking_data.showtime_id).first()
    if not showtime:
        return None
    
    # Verify showtime is in the future
    if showtime.start_time <= datetime.now():
        return None
    
    # Get seats and verify they exist and belong to the correct screen
    seats = db.query(Seat).filter(
        Seat.id.in_(booking_data.seat_ids),
        Seat.screen_id == showtime.screen_id
    ).all()
    
    if len(seats) != len(booking_data.seat_ids):
        return None  # Some seats don't exist or wrong screen
    
    # Calculate total amount
    total_amount = Decimal("0.00")
    for seat in seats:
        price = Decimal(str(seat.base_price)) * showtime.price_multiplier
        total_amount += price
    
    # Create booking
    booking_ref = generate_booking_reference()
    expires_at = datetime.now() + timedelta(minutes=10)  # 10 min to complete payment
    
    db_booking = Booking(
        booking_reference=booking_ref,
        user_id=user_id,
        showtime_id=booking_data.showtime_id,
        status=BookingStatus.PENDING,
        total_amount=total_amount,
        seat_count=len(seats),
        expires_at=expires_at
    )
    
    try:
        db.add(db_booking)
        db.flush()  # Get booking ID without committing
        
        # Create booking seats (this is where race condition is handled)
        for seat in seats:
            price = Decimal(str(seat.base_price)) * showtime.price_multiplier
            booking_seat = BookingSeat(
                booking_id=db_booking.id,
                seat_id=seat.id,
                showtime_id=booking_data.showtime_id,
                price=price.quantize(Decimal("0.01"))
            )
            db.add(booking_seat)
        
        db.commit()
        db.refresh(db_booking)
        return db_booking
        
    except IntegrityError:
        # Race condition: someone else booked the seat
        db.rollback()
        return None


def get_booking(db: Session, booking_id: int) -> Optional[Booking]:
    """Get booking by ID"""
    return db.query(Booking).filter(Booking.id == booking_id).first()


def get_booking_by_reference(db: Session, booking_reference: str) -> Optional[Booking]:
    """Get booking by reference"""
    return db.query(Booking).filter(Booking.booking_reference == booking_reference).first()


def get_user_bookings(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 20
) -> tuple[List[Booking], int]:
    """Get all bookings for a user"""
    query = db.query(Booking).filter(Booking.user_id == user_id)
    total = query.count()
    bookings = query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()
    return bookings, total


def confirm_booking(db: Session, booking_id: int) -> Optional[Booking]:
    """Confirm a booking (after successful payment)"""
    booking = get_booking(db, booking_id)
    if not booking:
        return None
    
    if booking.status != BookingStatus.PENDING:
        return None
    
    # Check if expired
    if booking.expires_at and booking.expires_at < datetime.now():
        booking.status = BookingStatus.EXPIRED
        db.commit()
        return None
    
    booking.status = BookingStatus.CONFIRMED
    booking.expires_at = None  # Clear expiration
    db.commit()
    db.refresh(booking)
    return booking


def cancel_booking(db: Session, booking_id: int, user_id: int) -> Optional[Booking]:
    """Cancel a booking (only by owner or before showtime)"""
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == user_id
    ).first()
    
    if not booking:
        return None
    
    if booking.status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
        return None
    
    # Can only cancel before showtime
    if booking.showtime.start_time <= datetime.now():
        return None
    
    booking.status = BookingStatus.CANCELLED
    
    # If payment exists and was successful, mark as refunded
    if booking.payment and booking.payment.status == PaymentStatus.SUCCESS:
        booking.payment.status = PaymentStatus.REFUNDED
    
    db.commit()
    db.refresh(booking)
    return booking


def expire_pending_bookings(db: Session) -> int:
    """Expire all pending bookings past their expiration time"""
    count = db.query(Booking).filter(
        Booking.status == BookingStatus.PENDING,
        Booking.expires_at < datetime.now()
    ).update({"status": BookingStatus.EXPIRED})
    db.commit()
    return count


# --- Payment CRUD ---

def create_payment(
    db: Session,
    booking_id: int,
    payment_method: str,
    simulate_success: bool = True
) -> Optional[Payment]:
    """
    Create payment and process it (simulated).
    Per project requirements: simulated payment processing.
    """
    booking = get_booking(db, booking_id)
    if not booking:
        return None
    
    if booking.status != BookingStatus.PENDING:
        return None
    
    # Check if payment already exists
    if booking.payment:
        return booking.payment
    
    # Simulate payment processing
    transaction_id = f"TXN{uuid.uuid4().hex[:12].upper()}"
    status = PaymentStatus.SUCCESS if simulate_success else PaymentStatus.FAILED
    
    payment = Payment(
        booking_id=booking_id,
        amount=booking.total_amount,
        status=status,
        transaction_id=transaction_id,
        payment_method=payment_method
    )
    
    try:
        db.add(payment)
        
        # If payment successful, confirm booking
        if status == PaymentStatus.SUCCESS:
            booking.status = BookingStatus.CONFIRMED
            booking.expires_at = None
        else:
            booking.status = BookingStatus.EXPIRED
        
        db.commit()
        db.refresh(payment)
        return payment
        
    except IntegrityError:
        db.rollback()
        return None


def get_payment(db: Session, payment_id: int) -> Optional[Payment]:
    """Get payment by ID"""
    return db.query(Payment).filter(Payment.id == payment_id).first()


def get_payment_by_transaction_id(db: Session, transaction_id: str) -> Optional[Payment]:
    """Get payment by transaction ID"""
    return db.query(Payment).filter(Payment.transaction_id == transaction_id).first()
