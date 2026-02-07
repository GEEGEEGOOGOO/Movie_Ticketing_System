"""
Seed data script for Movie Ticketing System
Run with: python seed_data.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
from decimal import Decimal
import random
import string
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User, UserRole
from app.models.movie import Movie, Language, Genre, Rating, Showtime
from app.models.theater import Theater, Screen, Seat, SeatType
from app.models.booking import Booking, BookingSeat, Payment, BookingStatus, PaymentStatus
from app.auth.security import get_password_hash


RANDOM_SEED = 42
THEATER_COUNT = 20
MOVIE_COUNT = 50
SHOW_DAYS = 10


def _rand_ref(prefix: str, length: int = 8) -> str:
    return f"{prefix}{''.join(random.choices(string.ascii_uppercase + string.digits, k=length))}"


def seed_database():
    db = SessionLocal()

    try:
        # Check if already seeded by checking for movies
        existing_movies = db.query(Movie).count()
        if existing_movies > 0:
            print("Database already has movies. Skipping seed.")
            print("To re-seed, delete all data manually or drop the database.")
            return

        random.seed(RANDOM_SEED)
        print("🌱 Seeding database...")

        # 1. Create or get Users
        print("  Setting up users...")
        customer = db.query(User).filter(User.email == "customer@test.com").first()
        owner = db.query(User).filter(User.email == "owner@test.com").first()
        owner2 = db.query(User).filter(User.email == "owner2@test.com").first()

        if not customer:
            customer = User(
                email="customer@test.com",
                password_hash=get_password_hash("password123"),
                name="John Customer",
                role=UserRole.CUSTOMER,
                is_verified=True,
                latitude=40.7128,
                longitude=-74.0060,
                city="New York"
            )
            db.add(customer)

        if not owner:
            owner = User(
                email="owner@test.com",
                password_hash=get_password_hash("password123"),
                name="Jane Owner",
                role=UserRole.OWNER,
                is_verified=True,
                latitude=40.7580,
                longitude=-73.9855,
                city="New York"
            )
            db.add(owner)

        if not owner2:
            owner2 = User(
                email="owner2@test.com",
                password_hash=get_password_hash("password123"),
                name="Aisha Owner",
                role=UserRole.OWNER,
                is_verified=True,
                latitude=34.0522,
                longitude=-118.2437,
                city="Los Angeles"
            )
            db.add(owner2)

        db.commit()
        db.refresh(customer)
        db.refresh(owner)
        db.refresh(owner2)
        owners = [owner, owner2]
        print(f"    ✓ Users ready (customer id={customer.id}, owners={len(owners)})")

        # 2. Create Movies (50)
        print("  Creating movies...")
        title_prefix = [
            "Crimson", "Silent", "Midnight", "Golden", "Hidden", "Last", "Electric",
            "Neon", "Fallen", "Rising", "Lost", "Iron", "Echo", "Shadow", "Infinite"
        ]
        title_suffix = [
            "Horizons", "Empire", "Rebellion", "Voyage", "Legacy", "Signal", "Frontier",
            "Labyrinth", "Odyssey", "Sanctum", "Protocol", "Pulse", "Mirage", "Paradox"
        ]
        genres = list(Genre)
        languages = list(Language)
        ratings = list(Rating)
        movies = []
        for i in range(MOVIE_COUNT):
            title = f"{random.choice(title_prefix)} {random.choice(title_suffix)} {i + 1}"
            duration = random.randint(90, 190)
            release_year = random.randint(2010, 2026)
            release_month = random.randint(1, 12)
            release_day = random.randint(1, 28)
            movies.append(Movie(
                title=title,
                description=f"A {random.choice(genres).value} feature in {random.choice(languages).value}.",
                release_date=datetime(release_year, release_month, release_day),
                genre=random.choice(genres),
                language=random.choice(languages),
                duration=duration,
                rating=random.choice(ratings),
                poster_url=None,
                trailer_url=None
            ))
        db.add_all(movies)
        db.commit()
        for m in movies:
            db.refresh(m)
        print(f"    ✓ Created {len(movies)} movies")

        # 3. Create Theaters (20) with geo spread
        print("  Creating theaters...")
        city_centers = [
            ("New York", 40.7128, -74.0060),
            ("Los Angeles", 34.0522, -118.2437),
            ("Chicago", 41.8781, -87.6298),
            ("San Francisco", 37.7749, -122.4194),
            ("Seattle", 47.6062, -122.3321),
            ("Boston", 42.3601, -71.0589),
            ("Miami", 25.7617, -80.1918),
            ("Houston", 29.7604, -95.3698),
        ]
        theaters = []
        for i in range(THEATER_COUNT):
            city, base_lat, base_lon = random.choice(city_centers)
            jitter_lat = random.uniform(-0.03, 0.03)
            jitter_lon = random.uniform(-0.03, 0.03)
            owner_for_theater = random.choice(owners)
            theater = Theater(
                name=f"Nova Cinema {city.split()[0]} {i + 1}",
                city=city,
                location=f"{100 + i} Main St, {city}",
                owner_id=owner_for_theater.id,
                latitude=round(base_lat + jitter_lat, 6),
                longitude=round(base_lon + jitter_lon, 6)
            )
            theaters.append(theater)
        db.add_all(theaters)
        db.commit()
        for t in theaters:
            db.refresh(t)
        print(f"    ✓ Created {len(theaters)} theaters")

        # 4. Create Screens (3-5 per theater)
        print("  Creating screens...")
        screen_name_pool = ["IMAX", "Dolby Atmos", "Screen A", "Screen B", "Screen C", "Screen D"]
        screens = []
        for theater in theaters:
            screen_count = random.randint(3, 5)
            used_names = set()
            for _ in range(screen_count):
                name = random.choice(screen_name_pool)
                while name in used_names:
                    name = random.choice(screen_name_pool)
                used_names.add(name)
                screen = Screen(name=name, theater_id=theater.id)
                screen._seats_count = random.choice([80, 90, 100, 120])
                screens.append(screen)
        db.add_all(screens)
        db.commit()
        for s in screens:
            db.refresh(s)
        print(f"    ✓ Created {len(screens)} screens")

        # 5. Create Seats (bulk for performance)
        print("  Creating seats (bulk)...")
        seat_objects = []
        for screen in screens:
            seats_to_create = getattr(screen, "_seats_count", 80)
            rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
            seats_per_row = seats_to_create // 10
            for row_idx, row in enumerate(rows):
                for num in range(1, seats_per_row + 1):
                    if row_idx < 2:
                        seat_type = SeatType.RECLINER
                        price = Decimal("24.00")
                    elif row_idx < 6:
                        seat_type = SeatType.PREMIUM
                        price = Decimal("18.00")
                    else:
                        seat_type = SeatType.REGULAR
                        price = Decimal("14.00")
                    seat_objects.append(Seat(
                        screen_id=screen.id,
                        row=row,
                        number=num,
                        seat_type=seat_type,
                        base_price=price
                    ))
        db.bulk_save_objects(seat_objects)
        db.commit()
        print(f"    ✓ Created {len(seat_objects)} seats")

        # 6. Create Showtimes (randomized)
        print("  Creating showtimes (bulk)...")
        showtime_objects = []
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        start_hours = [9, 11, 13, 16, 18, 20, 22]
        for day_offset in range(SHOW_DAYS):
            show_date = today + timedelta(days=day_offset)
            for screen in screens:
                daily_shows = random.randint(3, 5)
                hours = random.sample(start_hours, k=daily_shows)
                for hour in hours:
                    movie = random.choice(movies)
                    start_time = show_date.replace(hour=hour, minute=30)
                    end_time = start_time + timedelta(minutes=movie.duration)
                    multiplier = Decimal("1.20") if screen.name in ["IMAX", "Dolby Atmos"] else Decimal("1.00")
                    if hour >= 18:
                        multiplier += Decimal("0.10")
                    showtime_objects.append(Showtime(
                        movie_id=movie.id,
                        screen_id=screen.id,
                        start_time=start_time,
                        end_time=end_time,
                        price_multiplier=multiplier
                    ))
        db.bulk_save_objects(showtime_objects)
        db.commit()
        print(f"    ✓ Created {len(showtime_objects)} showtimes")

        # 7. Create Bookings to exercise seat locking + transactions
        print("  Creating sample bookings (locks, expired, confirmed)...")
        showtimes = db.query(Showtime).all()
        seats_by_screen = {}
        for screen in screens:
            seats_by_screen[screen.id] = db.query(Seat).filter(Seat.screen_id == screen.id).all()

        used_seats = {}
        booking_objects = []
        booking_seat_objects = []
        payment_objects = []
        now = datetime.now()

        def reserve_seats(showtime_id: int, screen_id: int, count: int):
            available = seats_by_screen[screen_id]
            used = used_seats.setdefault(showtime_id, set())
            choices = [s for s in available if s.id not in used]
            picked = random.sample(choices, k=count)
            for s in picked:
                used.add(s.id)
            return picked

        for _ in range(30):
            showtime = random.choice(showtimes)
            seat_count = random.randint(1, 4)
            seats = reserve_seats(showtime.id, showtime.screen_id, seat_count)
            total_amount = sum((Decimal(str(s.base_price)) * Decimal(str(showtime.price_multiplier))) for s in seats)

            status = random.choice([BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.EXPIRED])
            expires_at = None
            if status == BookingStatus.PENDING:
                expires_at = now + timedelta(minutes=10)
            if status == BookingStatus.EXPIRED:
                expires_at = now - timedelta(minutes=10)

            booking = Booking(
                booking_reference=_rand_ref("BK"),
                user_id=customer.id,
                showtime_id=showtime.id,
                status=status,
                total_amount=total_amount,
                seat_count=seat_count,
                expires_at=expires_at
            )
            db.add(booking)
            db.flush()
            booking_objects.append(booking)

            for seat in seats:
                booking_seat_objects.append(BookingSeat(
                    booking_id=booking.id,
                    seat_id=seat.id,
                    showtime_id=showtime.id,
                    price=(Decimal(str(seat.base_price)) * Decimal(str(showtime.price_multiplier))).quantize(Decimal("0.01"))
                ))

            if status == BookingStatus.CONFIRMED:
                payment_objects.append(Payment(
                    booking_id=booking.id,
                    amount=booking.total_amount,
                    status=PaymentStatus.SUCCESS,
                    transaction_id=_rand_ref("TXN"),
                    payment_method="simulated"
                ))

        db.add_all(booking_seat_objects)
        db.add_all(payment_objects)
        db.commit()
        print(f"    ✓ Created {len(booking_objects)} bookings with seats and payments")

        print("\n✅ Database seeded successfully!")
        print("\n📋 Test Credentials:")
        print("   Customer: customer@test.com / password123")
        print("   Owner:    owner@test.com / password123")
        print("   Owner2:   owner2@test.com / password123")

    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
