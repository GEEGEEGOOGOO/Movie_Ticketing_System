# Movie Ticket Management System - Backend

FastAPI backend with JWT authentication for the Movie Ticket Booking System.

## Setup

1. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure environment variables:**
Edit `.env` file and update:
- `SECRET_KEY` - Change to a secure random string (min 32 characters)
- `DATABASE_URL` - Database connection string
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for OAuth

3. **Run the server:**
```bash
python main.py
```

Server will start at http://localhost:8000

4. **API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login with Google OAuth
- `GET /api/auth/me` - Get current user info (requires token)
- `POST /api/auth/logout` - Logout user

### Example Request
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass123","name":"John Doe","role":"customer"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass123"}'

# Get current user (with token)
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Features

✅ JWT Token Authentication (HS256)
✅ Password hashing with bcrypt
✅ OAuth2 compatible endpoints
✅ Email/Password registration & login
✅ Google OAuth integration (mock)
✅ Protected endpoints with token validation
✅ CORS enabled for frontend
✅ Role-based access (customer/owner)

## Tech Stack

- **FastAPI** - Modern Python web framework
- **python-jose** - JWT token generation/validation
- **passlib** - Password hashing (bcrypt)
- **pydantic** - Data validation
- **uvicorn** - ASGI server
