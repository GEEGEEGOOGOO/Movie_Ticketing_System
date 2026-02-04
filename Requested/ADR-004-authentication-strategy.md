# ADR-004: Authentication Strategy

**Status**: Proposed  
**Date**: 2026-01-27  
**Deciders**: Shashank (Intern), Technical Mentor

## Context

The Movie Ticket Management System requires a robust authentication mechanism for two user types: Theater Owners and Customers. The system must support:

**Mandatory Requirements:**
- Google OAuth integration (mandatory per project specs)
- Traditional email/password authentication
- Email verification with OTP
- Password reset functionality
- Role-based access control (RBAC) for Theater Owner vs Customer
- Session management
- Protected routes and API endpoints
- Security best practices (password hashing, token management)

**User Flows:**
- User registers with email/password → Receives OTP → Verifies → Logs in
- User logs in with Google OAuth → Automatically authenticated
- User forgets password → Receives OTP → Resets password
- User accesses protected routes → Token validated → RBAC check

**Performance & Scalability:**
- Stateless authentication preferred for horizontal scaling
- Token should contain user role for quick authorization checks
- API response time < 500ms including auth checks
- Support for concurrent sessions across devices

**Security Considerations:**
- Protect against CSRF, XSS, token theft
- Secure token storage on client side
- Token expiration and refresh mechanism
- Rate limiting on authentication endpoints
- Prevent brute force attacks

The primary candidates are JWT (stateless), Session-based (stateful), and OAuth2 flows.

## Decision

We will use **JWT (JSON Web Tokens) with OAuth2 Password and Bearer flows**, complemented by Google OAuth for third-party authentication.

## Rationale

### Stateless Architecture
- **Horizontal scalability**: No server-side session storage needed
- **Microservices-ready**: Tokens can be validated independently across services
- **Load balancer friendly**: No sticky sessions required
- **CDN compatible**: Static authentication, no database lookup per request
- **FastAPI alignment**: FastAPI designed with stateless JWT in mind
- Perfect for API-first architecture

### JWT Token Structure
- **Self-contained**: Token contains user ID, role, expiration
- **Quick authorization**: Role extracted from token without database query
- **Cryptographically signed**: HS256 or RS256 prevents tampering
- **Compact**: Small payload, easy to transmit in HTTP headers
- **Standard**: Industry-standard format (RFC 7519)
- Example payload:
  ```json
  {
    "sub": "user_id",
    "email": "user@example.com",
    "role": "theater_owner",
    "exp": 1643723400,
    "iat": 1643637000
  }
  ```

### OAuth2 Integration
- **Google OAuth support**: Native OAuth2 flow for third-party authentication
- **Standardized flow**: Well-documented Authorization Code flow
- **FastAPI support**: Built-in OAuth2PasswordBearer and OAuth2AuthorizationCodeBearer
- **Unified approach**: Both email/password and Google OAuth return JWT
- **Security**: Leverages Google's authentication infrastructure
- **User experience**: One-click login for users

### Security Features
- **Token expiration**: Short-lived access tokens (15-30 minutes)
- **Refresh tokens**: Long-lived refresh tokens (7-30 days) for seamless renewal
- **Token blacklisting**: Optional Redis-based token revocation for logout
- **Password hashing**: bcrypt/argon2 for password storage
- **HTTPS only**: Tokens transmitted over secure connections
- **HttpOnly cookies** (optional): Prevent XSS attacks on token theft

### RBAC Implementation
- **Role in token**: User role stored in JWT payload
- **Dependency injection**: FastAPI dependency checks role
- **Route protection**: Decorators enforce role-based access
- **Fine-grained control**: Can add permissions beyond roles if needed
- Example:
  ```python
  @router.post("/theaters")
  async def create_theater(
      current_user: User = Depends(get_current_theater_owner)
  ):
      # Only theater owners can access
  ```

### Developer Experience
- **FastAPI native**: Excellent OAuth2 and JWT support
- **Simple implementation**: python-jose or PyJWT libraries
- **Testing friendly**: Easy to generate test tokens
- **Debugging**: JWT tokens are readable (base64 decoded)
- **Documentation**: Swagger UI supports OAuth2 testing

### Performance
- **Fast validation**: No database lookup for token validation
- **In-memory**: Token signature verification is CPU-bound, very fast
- **Cacheable**: Public keys can be cached for RS256 validation
- **Concurrent**: Supports thousands of concurrent authentications
- **Low latency**: <10ms token validation overhead

### Google OAuth Flow
1. User clicks "Login with Google"
2. Redirect to Google OAuth consent screen
3. User grants permission
4. Google redirects back with authorization code
5. Backend exchanges code for Google access token
6. Backend fetches user info from Google
7. Backend creates/updates user in database
8. Backend generates JWT token
9. Return JWT to client

### Email/Password + OTP Flow
1. User registers with email/password
2. Backend generates OTP, sends via email
3. User enters OTP to verify email
4. User logs in with email/password
5. Backend validates credentials, generates JWT
6. Return JWT to client

## Consequences

### Positive
- **Scalable**: Stateless architecture scales horizontally effortlessly
- **Fast**: No database lookup per request after token generation
- **Standard**: JWT and OAuth2 are industry standards
- **Flexible**: Easy to add new authentication methods (GitHub, Facebook)
- **Secure**: Strong cryptographic signatures prevent tampering
- **Google OAuth**: Seamless third-party authentication
- **RBAC**: Role-based access control built into token
- **Multi-device**: Works across web, mobile, desktop
- **API-first**: Perfect for RESTful API architecture

### Negative
- **Token revocation complexity**: Logout requires token blacklist (Redis) or short expiration
- **Payload size**: Limited data in token (keep under 1KB)
- **Secret management**: JWT secret must be securely stored
- **Token theft risk**: If token stolen, valid until expiration (mitigated by short expiration + refresh)
- **No built-in refresh**: Must implement refresh token logic manually
- **Debugging**: Harder to track active sessions compared to session-based

### Neutral
- **Client-side storage**: Client responsible for storing token securely
- **Refresh token rotation**: Best practice requires implementation effort
- **Token versioning**: Schema changes require token version handling
- **Clock skew**: Must handle time synchronization for expiration

## Alternatives Considered

### Session-Based Authentication
**Strengths:**
- **Simple revocation**: Deleting session invalidates immediately
- **Server control**: Full control over active sessions
- **Familiar pattern**: Traditional web authentication
- **Less client complexity**: No token management on client

**Why Not Chosen:**
- **Stateful**: Requires server-side session storage (Redis, database)
- **Sticky sessions**: Load balancing becomes complex
- **Scaling challenges**: Session replication needed across servers
- **Not RESTful**: Violates REST stateless principle
- **Database dependency**: Session lookup adds latency
- **Poor for mobile**: Mobile apps prefer token-based auth
- **Microservices**: Sharing sessions across services complicated
- FastAPI is designed for stateless APIs, session-based fights framework design

### OAuth2 Only (No JWT)
**Strengths:**
- **Standard**: Pure OAuth2 implementation
- **Token introspection**: Centralized token validation
- **Revocation**: Native revocation endpoint

**Why Not Chosen:**
- **Extra network call**: Token validation requires API call to OAuth server
- **Latency**: 50-100ms overhead per request for introspection
- **Dependency**: Auth server must be highly available
- **Complexity**: Running own OAuth2 server (Keycloak, Auth0) is overkill
- **Google OAuth already covered**: We use OAuth2 for Google, JWT for our tokens
- JWT is simpler for internal authentication

### Firebase Authentication
**Strengths:**
- **Fully managed**: No auth infrastructure to maintain
- **Multi-provider**: Email, Google, Facebook, etc.
- **Real-time**: Built-in real-time database
- **Generous free tier**: Good for small projects

**Why Not Chosen:**
- **Vendor lock-in**: Tied to Firebase ecosystem
- **Cost**: Can become expensive at scale
- **Limited control**: Cannot customize auth flow
- **External dependency**: Relies on Firebase availability
- **Overkill**: We need simple auth, not entire backend platform
- **Learning requirement**: Additional SDK to learn
- We prefer full control over authentication logic

### API Keys
**Strengths:**
- **Simple**: Very easy to implement
- **Long-lived**: No expiration management

**Why Not Chosen:**
- **No user context**: Cannot identify which user made request
- **No expiration**: Revocation requires manual invalidation
- **Security risk**: Easy to leak and hard to rotate
- **No RBAC**: Cannot differentiate user roles
- **Not suitable for user authentication**: Good for service-to-service, not users

## Implementation Strategy

### JWT Configuration
```python
# config.py
from datetime import timedelta

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")  # Store in environment
JWT_ALGORITHM = "HS256"  # or RS256 for asymmetric
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
```

### Token Generation
```python
from jose import jwt
from datetime import datetime, timedelta

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def create_tokens(user: User):
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_access_token(
        data={"sub": str(user.id), "type": "refresh"},
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )
    return {"access_token": access_token, "refresh_token": refresh_token}
```

### Token Validation
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.get(User, int(user_id))
    if user is None:
        raise credentials_exception
    return user

async def get_current_theater_owner(current_user: User = Depends(get_current_user)):
    if current_user.role != "theater_owner":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user
```

### Google OAuth Integration
```python
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config

config = Config('.env')
oauth = OAuth(config)

oauth.register(
    name='google',
    client_id=config('GOOGLE_CLIENT_ID'),
    client_secret=config('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@router.get("/auth/google")
async def google_login(request: Request):
    redirect_uri = request.url_for('google_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def google_callback(request: Request, db: AsyncSession = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get('userinfo')
    
    # Find or create user
    user = await find_or_create_google_user(db, user_info)
    
    # Generate JWT
    tokens = create_tokens(user)
    return tokens
```

### Email/Password Login
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/auth/register")
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    # Hash password
    hashed_password = pwd_context.hash(user_data.password)
    
    # Create user
    user = User(email=user_data.email, password_hash=hashed_password, role=user_data.role)
    db.add(user)
    await db.commit()
    
    # Send OTP
    otp = generate_otp()
    await send_otp_email(user.email, otp)
    
    return {"message": "OTP sent to email"}

@router.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")
    
    tokens = create_tokens(user)
    return tokens
```

### Refresh Token Flow
```python
@router.post("/auth/refresh")
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user_id = payload.get("sub")
        user = await db.get(User, int(user_id))
        
        new_access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email, "role": user.role}
        )
        return {"access_token": new_access_token}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
```

### Frontend Token Storage
```javascript
// Store tokens
localStorage.setItem('access_token', response.access_token);
localStorage.setItem('refresh_token', response.refresh_token);

// Add token to requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`
};

// Refresh token when expired
if (response.status === 401) {
  const newToken = await refreshAccessToken();
  // Retry request with new token
}
```

## Security Best Practices

1. **Environment Variables**: Store JWT secret in environment, never commit
2. **HTTPS Only**: Enforce HTTPS in production
3. **Short Expiration**: 15-30 minutes for access tokens
4. **Refresh Rotation**: Rotate refresh tokens on use
5. **Rate Limiting**: Limit login attempts (5 per minute)
6. **Password Policy**: Minimum 8 characters, complexity requirements
7. **OTP Expiration**: OTP expires in 5 minutes
8. **Token Blacklist**: Use Redis for logout token invalidation (optional)

## Testing Strategy

```python
# Generate test token
def create_test_token(user_id: int, role: str):
    return create_access_token({"sub": str(user_id), "role": role})

# Test protected endpoint
def test_theater_owner_access():
    token = create_test_token(user_id=1, role="theater_owner")
    response = client.post(
        "/api/v1/theaters",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "Test Theater"}
    )
    assert response.status_code == 200
```

## References

- JWT RFC 7519: https://tools.ietf.org/html/rfc7519
- FastAPI OAuth2: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
- python-jose Documentation: https://python-jose.readthedocs.io/
- Authlib Documentation: https://docs.authlib.org/
- Google OAuth2: https://developers.google.com/identity/protocols/oauth2
- OAuth2 RFC 6749: https://tools.ietf.org/html/rfc6749
- OWASP Authentication: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
