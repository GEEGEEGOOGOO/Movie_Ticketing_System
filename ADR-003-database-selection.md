# ADR-003: Database Selection

**Status**: Proposed  
**Date**: 2026-01-27  
**Deciders**: Shashank (Intern), Technical Mentor

## Context

The Movie Ticket Management System requires a database that can handle:

**Data Requirements:**
- Users (Theater Owners, Customers) with authentication data
- Theaters with multiple screens and seating configurations
- Movies with metadata (title, genre, language, duration, images)
- Showtimes (complex relationships: theater → screen → movie → time slot)
- Bookings with seat selections and payment status
- Transactions and payment records
- AI conversation logs (chat history)
- Email OTP records with expiration
- Session management data

**Relationship Complexity:**
- One Theater has many Screens
- One Screen has many Seats
- One Movie can have many Showtimes across multiple Theaters
- One Showtime belongs to one Screen and one Movie
- One Booking can have many Seats for one Showtime
- One User can have many Bookings
- Foreign key constraints needed for data integrity

**Critical Features:**
- **ACID properties**: Essential for booking transactions to prevent double-booking
- **Concurrent access**: Multiple users booking same seats simultaneously
- **Race condition handling**: Row-level locking for seat availability
- **Transaction support**: Atomicity for booking + payment operations
- **Query complexity**: Join operations for seat availability, booking history, analytics
- **Data consistency**: Strict consistency over eventual consistency
- **Referential integrity**: Cascade deletes and foreign key constraints

**Performance Requirements:**
- API response time < 500ms
- Real-time seat availability checks
- Efficient queries for filtering movies (genre, language, date, location)
- Analytics queries for theater owner dashboard

**Scale Expectations:**
- Moderate scale for 1-month project
- 10-100 theaters, 1000s of daily bookings
- Not a massive-scale distributed system

The primary candidates are PostgreSQL (SQL) and MongoDB (NoSQL).

## Decision

We will use **PostgreSQL** as the database.

## Rationale

### ACID Compliance & Transaction Support
- **Critical for booking system**: ACID guarantees prevent double-booking
- **Atomic transactions**: Booking + payment + seat lock in single transaction
- **Isolation levels**: Serializable isolation for concurrent seat selection
- **Rollback capability**: Automatic rollback on payment failure
- **Data consistency**: Strong consistency ensures accurate seat availability
- MongoDB provides ACID only within single document or replica set transactions (limited scope)

### Race Condition Handling
- **Row-level locking**: `SELECT ... FOR UPDATE` prevents concurrent seat booking
- **Pessimistic locking**: Lock seats during booking process
- **Optimistic locking**: Version-based concurrency control
- **Advisory locks**: Application-level lock coordination
- PostgreSQL excels at concurrent write scenarios with minimal lock contention
- MongoDB's document-level locking less suitable for fine-grained seat locking

### Relationship Management
- **Natural fit**: Theater → Screen → Showtime → Booking → Seat relationships
- **Foreign keys**: Enforced referential integrity at database level
- **Cascading operations**: Automatic cascade deletes (delete showtime → delete bookings)
- **Complex joins**: Efficient JOIN operations for queries like "available seats for showtime"
- **Normalized schema**: Reduces data redundancy
- MongoDB would require denormalization and manual consistency maintenance

### Query Complexity
- **SQL expressiveness**: Complex queries with JOINs, aggregations, subqueries
- **Query examples needed:**
  ```sql
  -- Find available seats for a showtime
  SELECT s.* FROM seats s
  WHERE s.screen_id = ? 
  AND s.seat_id NOT IN (
    SELECT seat_id FROM bookings 
    WHERE showtime_id = ? AND status = 'confirmed'
  )
  
  -- Theater revenue analytics
  SELECT t.name, SUM(b.amount) as revenue
  FROM bookings b
  JOIN showtimes st ON b.showtime_id = st.id
  JOIN screens sc ON st.screen_id = sc.id
  JOIN theaters t ON sc.theater_id = t.id
  WHERE b.status = 'confirmed'
  GROUP BY t.id, t.name
  ```
- PostgreSQL optimizes complex joins efficiently
- MongoDB would require $lookup (slower) or data duplication

### Data Integrity & Constraints
- **Foreign key constraints**: Prevent orphaned records
- **Check constraints**: Validate seat numbers, prices, dates
- **Unique constraints**: Prevent duplicate bookings
- **NOT NULL constraints**: Ensure required fields
- **Database-level validation**: Complement application validation
- MongoDB relies on application-level validation only

### Scalability for Our Use Case
- **Vertical scaling**: PostgreSQL handles 100k+ transactions/sec on modern hardware
- **Connection pooling**: Efficient connection management with PgBouncer
- **Read replicas**: If needed for analytics queries
- **Partitioning**: Table partitioning for booking history if needed
- **Proven at scale**: Instagram, Spotify, Reddit use PostgreSQL
- Our moderate scale (1000s bookings/day) well within PostgreSQL capabilities

### Developer Experience
- **Rich ecosystem**: SQLAlchemy ORM, Alembic migrations
- **Async support**: asyncpg driver for FastAPI integration
- **Excellent tooling**: pgAdmin, DBeaver, DataGrip
- **SQL knowledge**: Industry-standard skill, well-documented
- **Debugging**: Easy to inspect data, run ad-hoc queries
- **Testing**: Simple to seed test data, reset database

### FastAPI Integration
- **SQLAlchemy 2.0**: Native async support with asyncpg
- **Alembic migrations**: Schema versioning and migrations
- **Pydantic integration**: Easy ORM to Pydantic model conversion
- **Type hints**: SQLAlchemy 2.0 fully typed
- Example:
  ```python
  from sqlalchemy.ext.asyncio import AsyncSession
  
  async def get_available_seats(db: AsyncSession, showtime_id: int):
      result = await db.execute(
          select(Seat).where(
              Seat.screen_id == screen_id,
              ~Seat.id.in_(booked_seat_ids)
          )
      )
      return result.scalars().all()
  ```

### Analytics & Reporting
- **Aggregation functions**: SUM, AVG, COUNT, GROUP BY
- **Window functions**: Ranking, running totals
- **Date/time functions**: Essential for showtime filtering
- **JSON support**: Store flexible data (AI conversation logs) when needed
- **Materialized views**: Pre-compute analytics for theater dashboards
- Better suited for business intelligence than MongoDB

## Consequences

### Positive
- **Zero double-booking risk**: ACID transactions ensure seat availability integrity
- **Clean data model**: Normalized schema reflects real-world relationships naturally
- **Powerful queries**: Complex analytics and filtering with standard SQL
- **Data integrity**: Database enforces constraints automatically
- **Production-ready**: Battle-tested for transactional systems
- **Easy debugging**: Standard SQL tools and queries
- **Type-safe ORM**: SQLAlchemy 2.0 with full type hints
- **Industry standard**: SQL knowledge transferable across projects

### Negative
- **Schema changes**: Requires migrations (Alembic) for schema evolution
- **Less flexible**: Schema must be defined upfront (mitigated by planning phase)
- **Vertical scaling**: Primarily vertical scaling (sufficient for our scale)
- **ORM complexity**: SQLAlchemy has learning curve (but excellent docs)
- **Join performance**: Complex joins can be slow if not indexed properly (mitigated by proper indexing)

### Neutral
- **SQL knowledge required**: Standard skill for backend developers
- **Backup strategy**: Standard PostgreSQL backup tools (pg_dump)
- **Deployment**: Requires PostgreSQL installation (or managed service)
- **Connection pooling**: Need to configure (standard practice)

## Alternatives Considered

### MongoDB (NoSQL)
**Strengths:**
- Flexible schema, easy to iterate
- JSON-like documents natural for APIs
- Horizontal scaling with sharding
- No migrations needed for schema changes
- Good for varied/evolving data structures
- Motor driver provides async support

**Why Not Chosen:**
- **Weak ACID support**: Transactions limited to replica sets, not suitable for critical bookings
- **No foreign keys**: Must maintain referential integrity in application code
- **Poor for relationships**: Theater-Screen-Showtime-Booking relationships awkward
- **Manual consistency**: Application must prevent double-booking (high risk)
- **Query complexity**: $lookup slower than SQL JOINs, less expressive
- **Denormalization**: Data duplication increases storage and update complexity
- **Seat locking**: Document-level locks insufficient for individual seat management
- **Analytics**: Aggregation pipeline less powerful than SQL for reports
- **Not optimal for highly relational data**: Booking systems are inherently relational

**When MongoDB is better:**
- Content management systems with flexible schemas
- Real-time analytics with high write throughput
- Catalog systems with product variations
- Logging and event storage
- Applications prioritizing availability over consistency
- **Not for**: Financial transactions, booking systems, e-commerce orders

### MySQL
**Strengths:**
- Similar to PostgreSQL for relational data
- Wide adoption, large community
- Good performance
- ACID compliant

**Why Not Chosen:**
- **JSON support**: PostgreSQL's JSON/JSONB superior
- **Window functions**: Less comprehensive than PostgreSQL
- **Advanced features**: PostgreSQL has more advanced SQL features (CTE, LATERAL joins)
- **Full-text search**: PostgreSQL's full-text search better
- **Extensions**: PostgreSQL's extension ecosystem richer (PostGIS, pg_trgm, etc.)
- **License**: PostgreSQL's license more permissive
- **Both are good choices**, but PostgreSQL edges out for advanced features we might use

### SQLite
**Strengths:**
- Zero configuration
- Serverless
- Good for development
- Simple deployment

**Why Not Chosen:**
- **Concurrent writes**: Poor concurrent write performance
- **Not for production**: Not suitable for multi-user web applications
- **Locking**: Database-level locking causes bottlenecks
- **Race conditions**: Cannot handle concurrent seat booking reliably
- **Good for**: Development, mobile apps, embedded systems
- **Not for**: Production web APIs with concurrent users

## Implementation Strategy

### Schema Design
```sql
-- Core tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('theater_owner', 'customer')),
    google_id VARCHAR(255) UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE theaters (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE screens (
    id SERIAL PRIMARY KEY,
    theater_id INTEGER REFERENCES theaters(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    rows INTEGER NOT NULL,
    columns INTEGER NOT NULL,
    UNIQUE(theater_id, name)
);

CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    row_label VARCHAR(5) NOT NULL,
    seat_number INTEGER NOT NULL,
    seat_type VARCHAR(20) CHECK (seat_type IN ('regular', 'premium', 'recliner')),
    UNIQUE(screen_id, row_label, seat_number)
);

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    language VARCHAR(50),
    duration INTEGER, -- minutes
    release_date DATE,
    poster_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE showtimes (
    id SERIAL PRIMARY KEY,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    UNIQUE(screen_id, start_time)
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    showtime_id INTEGER REFERENCES showtimes(id) ON DELETE CASCADE,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    payment_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE booking_seats (
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    seat_id INTEGER REFERENCES seats(id),
    seat_price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (booking_id, seat_id)
);

CREATE TABLE otp_codes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    purpose VARCHAR(50), -- 'registration', 'payment', 'password_reset'
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_showtimes_screen_time ON showtimes(screen_id, start_time);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_showtime ON bookings(showtime_id);
CREATE INDEX idx_otp_email_purpose ON otp_codes(email, purpose, is_used);
```

### Race Condition Prevention
```python
# Pessimistic locking for seat booking
async def book_seats(db: AsyncSession, showtime_id: int, seat_ids: list):
    async with db.begin():
        # Lock seats for update
        result = await db.execute(
            select(Seat)
            .where(Seat.id.in_(seat_ids))
            .with_for_update()
        )
        seats = result.scalars().all()
        
        # Check if already booked
        booked = await db.execute(
            select(BookingSeat.seat_id)
            .join(Booking)
            .where(
                BookingSeat.seat_id.in_(seat_ids),
                Booking.showtime_id == showtime_id,
                Booking.status == 'confirmed'
            )
        )
        
        if booked.scalars().first():
            raise SeatAlreadyBookedException()
        
        # Create booking
        booking = Booking(...)
        db.add(booking)
        await db.flush()
        
        # Add seats to booking
        for seat in seats:
            booking_seat = BookingSeat(booking_id=booking.id, seat_id=seat.id)
            db.add(booking_seat)
        
        await db.commit()
        return booking
```

### Connection Configuration
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql+asyncpg://user:password@localhost/movie_tickets"

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_size=20,
    max_overflow=0,
    pool_pre_ping=True
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

### Tools & Libraries
- **SQLAlchemy 2.0**: Async ORM with type hints
- **asyncpg**: PostgreSQL async driver
- **Alembic**: Database migrations
- **psycopg2** or **asyncpg**: PostgreSQL adapters
- **pgAdmin** or **DBeaver**: Database management GUI

## Migration Considerations

If we ever need horizontal scaling beyond PostgreSQL capabilities:
- Add read replicas for analytics queries
- Implement table partitioning (by date for bookings)
- Use caching (Redis) for frequently accessed data
- Consider PostgreSQL extensions (pg_partman, Citus)
- Only consider MongoDB if schema becomes truly flexible (unlikely for booking system)

## References

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- SQLAlchemy 2.0 Documentation: https://docs.sqlalchemy.org/
- Alembic Documentation: https://alembic.sqlalchemy.org/
- PostgreSQL vs MongoDB: https://www.postgresql.org/about/
- FastAPI with SQLAlchemy: https://fastapi.tiangolo.com/tutorial/sql-databases/
- Handling Race Conditions: https://www.postgresql.org/docs/current/explicit-locking.html
