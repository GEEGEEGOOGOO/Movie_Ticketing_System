"""
Seed data script for Movie Ticketing System
Run with: python seed_data.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app.models.user import User, UserRole
from app.models.movie import Movie, Language, Genre, Rating, Showtime
from app.models.theater import Theater, Screen, Seat, SeatType
from app.auth.security import get_password_hash

def seed_database():
    db = SessionLocal()
    
    try:
        # Check if already seeded by checking for movies
        existing_movies = db.query(Movie).count()
        if existing_movies > 0:
            print("Database already has movies. Skipping seed.")
            print("To re-seed, delete all data manually or drop the database.")
            return
        
        print("🌱 Seeding database...")
        
        # 1. Create or get Users
        print("  Setting up users...")
        customer = db.query(User).filter(User.email == "customer@test.com").first()
        owner = db.query(User).filter(User.email == "owner@test.com").first()
        
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
        
        db.commit()
        db.refresh(customer)
        db.refresh(owner)
        print(f"    ✓ Users ready (customer id={customer.id}, owner id={owner.id})")
        
        # 2. Create Movies
        print("  Creating movies...")
        movies = [
            Movie(
                title="Dune: Part Two",
                description="Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
                release_date=datetime(2024, 3, 1),
                genre=Genre.SCIFI,
                language=Language.ENGLISH,
                duration=166,
                rating=Rating.UA,
                poster_url="https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
                trailer_url="https://www.youtube.com/watch?v=Way9Dexny3w"
            ),
            Movie(
                title="Oppenheimer",
                description="The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
                release_date=datetime(2023, 7, 21),
                genre=Genre.DRAMA,
                language=Language.ENGLISH,
                duration=180,
                rating=Rating.A,
                poster_url="https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                trailer_url="https://www.youtube.com/watch?v=uYPbbksJxIg"
            ),
            Movie(
                title="The Batman",
                description="Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
                release_date=datetime(2022, 3, 4),
                genre=Genre.ACTION,
                language=Language.ENGLISH,
                duration=176,
                rating=Rating.UA,
                poster_url="https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
                trailer_url="https://www.youtube.com/watch?v=mqqft2x_Aa4"
            ),
            Movie(
                title="Inception",
                description="A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
                release_date=datetime(2010, 7, 16),
                genre=Genre.SCIFI,
                language=Language.ENGLISH,
                duration=148,
                rating=Rating.UA,
                poster_url="https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Ber.jpg",
                trailer_url="https://www.youtube.com/watch?v=YoHD9XEInc0"
            ),
            Movie(
                title="Avatar: The Way of Water",
                description="Jake Sully and Neytiri have formed a family and are doing everything to stay together.",
                release_date=datetime(2022, 12, 16),
                genre=Genre.SCIFI,
                language=Language.ENGLISH,
                duration=192,
                rating=Rating.UA,
                poster_url="https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
                trailer_url="https://www.youtube.com/watch?v=d9MyW72ELq0"
            ),
        ]
        db.add_all(movies)
        db.commit()
        for m in movies:
            db.refresh(m)
        print(f"    ✓ Created {len(movies)} movies")
        
        # 3. Create Theaters
        print("  Creating theaters...")
        theater1 = Theater(
            name="CineMax Downtown",
            city="New York",
            location="123 Broadway, Manhattan",
            owner_id=owner.id,
            latitude=40.7580,
            longitude=-73.9855
        )
        theater2 = Theater(
            name="INOX Megaplex",
            city="New York",
            location="456 5th Avenue, Manhattan",
            owner_id=owner.id,
            latitude=40.7527,
            longitude=-73.9772
        )
        db.add_all([theater1, theater2])
        db.commit()
        db.refresh(theater1)
        db.refresh(theater2)
        print(f"    ✓ Created theaters: {theater1.name}, {theater2.name}")
        
        # 4. Create Screens
        print("  Creating screens...")
        screens_data = [
            {"name": "IMAX Screen 1", "theater_id": theater1.id, "seats_count": 80},
            {"name": "Screen 2", "theater_id": theater1.id, "seats_count": 60},
            {"name": "Screen 3", "theater_id": theater1.id, "seats_count": 60},
            {"name": "Dolby Atmos", "theater_id": theater2.id, "seats_count": 100},
            {"name": "Screen 2", "theater_id": theater2.id, "seats_count": 80},
        ]
        screens = []
        for sd in screens_data:
            screen = Screen(name=sd["name"], theater_id=sd["theater_id"])
            screen._seats_count = sd["seats_count"]  # Store for later use
            db.add(screen)
            screens.append(screen)
        db.commit()
        for s in screens:
            db.refresh(s)
        print(f"    ✓ Created {len(screens)} screens")
        
        # 5. Create Seats for each screen
        print("  Creating seats...")
        seat_count = 0
        for screen in screens:
            seats_to_create = getattr(screen, '_seats_count', 80)
            rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
            seats_per_row = seats_to_create // 10
            
            for row_idx, row in enumerate(rows):
                for num in range(1, seats_per_row + 1):
                    # First 2 rows: Recliner, middle 4: Premium, last 4: Regular
                    if row_idx < 2:
                        seat_type = SeatType.RECLINER
                        price = 25.00
                    elif row_idx < 6:
                        seat_type = SeatType.PREMIUM
                        price = 18.00
                    else:
                        seat_type = SeatType.REGULAR
                        price = 14.00
                    
                    seat = Seat(
                        screen_id=screen.id,
                        row=row,
                        number=num,
                        seat_type=seat_type,
                        base_price=price
                    )
                    db.add(seat)
                    seat_count += 1
        
        db.commit()
        print(f"    ✓ Created {seat_count} seats")
        
        # 6. Create Showtimes
        print("  Creating showtimes...")
        showtime_count = 0
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Create showtimes for next 7 days
        for day_offset in range(7):
            show_date = today + timedelta(days=day_offset)
            
            for movie in movies:
                for screen in screens[:3]:  # First theater screens
                    for hour in [10, 13, 16, 19, 22]:  # 5 shows per day
                        start_time = show_date.replace(hour=hour, minute=30)
                        end_time = start_time + timedelta(minutes=movie.duration)
                        
                        showtime = Showtime(
                            movie_id=movie.id,
                            screen_id=screen.id,
                            start_time=start_time,
                            end_time=end_time,
                            price_multiplier=1.5 if screen.name.startswith('IMAX') else 1.0
                        )
                        db.add(showtime)
                        showtime_count += 1
        
        db.commit()
        print(f"    ✓ Created {showtime_count} showtimes")
        
        print("\n✅ Database seeded successfully!")
        print("\n📋 Test Credentials:")
        print("   Customer: customer@test.com / password123")
        print("   Owner:    owner@test.com / password123")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
