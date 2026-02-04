# Movie Ticket Management System
## Complete Implementation Plan & Execution Guide

**Project**: Movie Ticket Management System  
**Duration**: 30 days  
**Design System**: OLED-Optimized Dark Interface  
**Tech Stack**: Python/FastAPI (Backend), React/TypeScript (Frontend)  
**Status**: Ready for Development  
**Last Updated**: 2026-01-29

---

## Executive Summary

This document provides a complete, day-by-day implementation plan for building the Movie Ticket Management System with an OLED-optimized dark interface. It integrates all ADR decisions (ADR-001 through ADR-009) and aligns with the SKILL.md design framework.

**Key Deliverables:**
- Full-stack application with AI and voice AI capabilities
- WCAG AAA compliant accessible dark interface
- Production-ready code with comprehensive testing
- Complete documentation and deployment guides

---

## Part 1: Architecture Overview

### 1.1 Technology Stack Summary

```
BACKEND (Python)
├── Language: Python 3.11+
├── Framework: FastAPI (ADR-002)
├── Database: PostgreSQL + SQLAlchemy 2.0 (ADR-003)
├── Auth: JWT + OAuth2 (ADR-004)
├── AI: Claude 3.5 Sonnet (ADR-007)
└── Voice: PipeCat + Deepgram Nova-2 (ADR-007, ADR-008)

FRONTEND (React)
├── Language: TypeScript (ADR-006)
├── Framework: React 18 (ADR-005)
├── Build: Vite
├── State: Zustand + React Query (ADR-009)
├── UI: shadcn/ui + Tailwind CSS
└── Styling: OLED Dark Theme (this plan)

INFRASTRUCTURE
├── Deployment: Vercel (Frontend), Render/Railway (Backend)
├── Database: Vercel Postgres / Railway Postgres
├── CDN: Vercel Edge
└── Monitoring: Sentry (errors), Vercel Analytics
```

### 1.2 Project Constraints

- **Timeline**: 30 days
- **Developer**: 1 person (intern)
- **Scope**: MVP (minimum viable product)
- **Target Users**: Indian customers (English + Hindi)

### 1.3 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load (3G) | <3s | Lighthouse |
| API Response | <500ms | Monitoring |
| Accessibility | WCAG AAA | WAVE audit |
| Test Coverage | 80%+ | Jest coverage |
| Uptime | 99%+ | Monitoring |

---

## Part 2: Project Phases

### Phase Overview

```
Phase 1: Foundation (Days 1-3)      [Design System]
Phase 2: Core Setup (Days 4-7)      [Backend + Frontend Scaffolding]
Phase 3: Features (Days 8-20)       [Core Features Implementation]
Phase 4: Integration (Days 21-25)   [Testing + Bug Fixes]
Phase 5: Polish (Days 26-30)        [Optimization + Deployment]
```

---

## Phase 1: Foundation (Days 1-3)

### Day 1: Design System Setup

**Deliverables:**
- ✓ Tailwind CSS configuration (tailwind.config.ts)
- ✓ Global CSS styles (global.css)
- ✓ Design system documentation (DESIGN-SYSTEM.md)
- ✓ Component guidelines (COMPONENT-GUIDELINES.md)

**Tasks:**

```
1. Create Tailwind configuration
   └─ Custom theme with OLED colors
   └─ Spacing scale (8px grid)
   └─ Typography scales
   └─ Custom utilities

2. Create global CSS
   └─ CSS variables
   └─ Reset styles
   └─ Typography rules
   └─ Focus states
   └─ Scrollbar styling

3. Document all design tokens
   └─ Color palette
   └─ Typography
   └─ Spacing
   └─ Effects/glows
   └─ Z-index scale

4. Create component spec document
   └─ Button variants
   └─ Input styles
   └─ Card styles
   └─ Modal patterns
   └─ Movie-specific components
```

**Files to Create:**
- [✓] `tailwind.config.ts`
- [✓] `global.css`
- [✓] `DESIGN-SYSTEM.md`
- [✓] `COMPONENT-GUIDELINES.md`

---

### Day 2: Component Foundation

**Deliverables:**
- [ ] Base components library structure
- [ ] Core component (Button, Input, Card)
- [ ] Storybook setup (optional)
- [ ] Component test setup

**Tasks:**

```
1. Create component directory structure
   src/
   ├── components/
   │   ├── Button/
   │   │   ├── Button.tsx
   │   │   ├── ButtonPrimary.tsx
   │   │   ├── ButtonSecondary.tsx
   │   │   ├── IconButton.tsx
   │   │   └── Button.test.tsx
   │   ├── Input/
   │   │   ├── TextInput.tsx
   │   │   ├── Select.tsx
   │   │   └── Input.test.tsx
   │   ├── Card/
   │   │   ├── Card.tsx
   │   │   └── Card.test.tsx
   │   ├── Modal/
   │   │   ├── Modal.tsx
   │   │   └── Modal.test.tsx
   │   └── common/
   │       ├── ErrorBoundary.tsx
   │       └── LoadingSpinner.tsx

2. Implement base components
   └─ Button (primary, secondary, icon)
   └─ TextInput with validation
   └─ Select dropdown
   └─ Card with variants
   └─ Modal dialog

3. Setup component testing
   └─ Jest configuration
   └─ React Testing Library setup
   └─ Accessibility testing (jest-axe)

4. Create component exports
   └─ src/components/index.ts
```

**Files to Create:**
- [ ] `src/components/Button/` (multiple files)
- [ ] `src/components/Input/` (multiple files)
- [ ] `src/components/Card/Card.tsx`
- [ ] `src/components/Modal/Modal.tsx`
- [ ] `jest.config.ts`
- [ ] `src/components/index.ts`

---

### Day 3: Project Scaffolding & Setup

**Deliverables:**
- [ ] React project initialized (Vite)
- [ ] TypeScript configuration
- [ ] Development environment setup
- [ ] Git repository initialized
- [ ] Initial project structure

**Tasks:**

```
1. Create React + TypeScript + Vite project
   $ npm create vite@latest movie-ticket-system -- --template react-ts
   $ cd movie-ticket-system
   $ npm install

2. Install dependencies
   CORE:
   └─ react, react-dom, react-router-dom
   
   STATE MANAGEMENT:
   └─ zustand, @tanstack/react-query
   
   UI:
   └─ tailwindcss, postcss, autoprefixer
   └─ radix-ui (base for shadcn/ui)
   └─ clsx, tailwind-merge
   
   UTILITIES:
   └─ axios (API calls)
   └─ zod (runtime validation)
   └─ react-hook-form (forms)
   
   DEVELOPMENT:
   └─ @types/react, @types/node
   └─ typescript
   └─ eslint, prettier
   └─ jest, @testing-library/react
   └─ @axe-core/react (accessibility)

3. Configure TypeScript
   └─ Strict mode enabled
   └─ Path aliases (@/components, @/utils)
   └─ Base URL configuration

4. Configure build tools
   └─ Vite configuration
   └─ PostCSS configuration
   └─ ESLint configuration
   └─ Prettier configuration

5. Create project structure
   src/
   ├── components/
   ├── pages/
   ├── hooks/
   ├── utils/
   ├── types/
   ├── services/
   ├── store/
   ├── App.tsx
   └── main.tsx
   public/
   ├── icons/
   └── images/
   tests/
   docs/

6. Initialize Git repository
   $ git init
   $ git add .
   $ git commit -m "Initial project setup"

7. Create README with setup instructions
   └─ Installation steps
   └─ Development commands
   └─ Build commands
   └─ Testing commands
```

**Commands to Run:**
```bash
npm create vite@latest movie-ticket-system -- --template react-ts
cd movie-ticket-system
npm install
npm install zustand @tanstack/react-query axios zod react-hook-form
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

**Files to Create:**
- [ ] `vite.config.ts`
- [ ] `tsconfig.json`
- [ ] `tailwind.config.ts`
- [ ] `postcss.config.js`
- [ ] `.eslintrc.cjs`
- [ ] `.prettierrc`
- [ ] `src/` directory structure
- [ ] `README.md`

**End of Phase 1 Checkpoint:**
- ✓ Design system fully documented
- ✓ Component guidelines complete
- ✓ Tailwind CSS configured
- ✓ Global styles applied
- ✓ React project scaffolded
- ✓ TypeScript configured
- ✓ Development environment ready

---

## Phase 2: Core Setup (Days 4-7)

### Day 4: Backend Setup & Data Models

**Scope**: Backend - Database & API skeleton

**Deliverables:**
- [ ] PostgreSQL database schema
- [ ] SQLAlchemy models
- [ ] Database migrations setup
- [ ] API scaffolding

**Backend Tasks:**

```
1. Setup FastAPI project
   $ mkdir movie-ticket-backend
   $ cd movie-ticket-backend
   $ python -m venv venv
   $ source venv/bin/activate  (or venv\Scripts\activate on Windows)
   $ pip install fastapi uvicorn sqlalchemy psycopg2 python-dotenv

2. Create database models (SQLAlchemy)
   models/
   ├── user.py          # User model
   ├── theater.py       # Theater model
   ├── screen.py        # Screen model
   ├── movie.py         # Movie model
   ├── showtime.py      # Showtime model
   ├── booking.py       # Booking model
   ├── seat.py          # Seat model
   └── transaction.py   # Payment transaction

3. Setup database connection
   └─ Connection pooling
   └─ Environment variables
   └─ Database initialization

4. Create Alembic migrations
   └─ Initial schema creation
   └─ Version control for DB changes

5. Create API routes scaffolding
   routes/
   ├── auth.py         # Authentication endpoints
   ├── movies.py       # Movie endpoints
   ├── theaters.py     # Theater endpoints
   ├── bookings.py     # Booking endpoints
   └── users.py        # User endpoints

6. Setup error handling & logging
   └─ Custom exception classes
   └─ Logging configuration
```

---

### Day 5: Authentication System

**Scope**: Backend authentication + Frontend auth UI

**Backend Deliverables:**
- [ ] JWT token generation/validation
- [ ] OAuth2 Google authentication
- [ ] Password hashing with bcrypt
- [ ] User registration endpoint
- [ ] Login endpoint
- [ ] Token refresh endpoint

**Frontend Deliverables:**
- [ ] Login page
- [ ] Register page
- [ ] OAuth callback page
- [ ] Auth context/store setup

**Tasks:**

Backend:
```python
# Backend: Auth Setup
1. Install dependencies
   pip install python-jose[cryptography] passlib[bcrypt] google-auth

2. Create auth utilities
   utils/security.py:
   └─ hash_password()
   └─ verify_password()
   └─ create_access_token()
   └─ verify_token()
   └─ get_current_user()

3. Create User model with password
   models/user.py:
   └─ User (id, email, password_hash, role)

4. Create auth endpoints
   routes/auth.py:
   └─ POST /auth/register
   └─ POST /auth/login
   └─ POST /auth/token/refresh
   └─ POST /auth/oauth/google
   └─ GET /auth/me (protected)

5. Setup OAuth2 with Google
   └─ Google OAuth client setup
   └─ Callback handling
   └─ Token exchange
```

Frontend:
```tsx
// Frontend: Auth Pages
1. Create auth pages
   src/pages/
   ├── LoginPage.tsx
   ├── RegisterPage.tsx
   └── OAuthCallbackPage.tsx

2. Create auth store (Zustand)
   src/store/authStore.ts:
   └─ user state
   └─ token state
   └─ login action
   └─ logout action
   └─ register action

3. Create auth context hook
   src/hooks/useAuth.ts:
   └─ getCurrentUser()
   └─ login()
   └─ logout()
   └─ register()

4. Create protected route component
   src/components/ProtectedRoute.tsx:
   └─ Check authentication
   └─ Redirect to login if not authenticated

5. Create auth API service
   src/services/auth.ts:
   └─ loginAPI()
   └─ registerAPI()
   └─ refreshTokenAPI()
   └─ oauthGoogleAPI()
```

---

### Day 6: Movie & Theater Management

**Scope**: Movie/Theater data and display

**Backend Deliverables:**
- [ ] Movie model and endpoints
- [ ] Theater/Screen endpoints
- [ ] Showtime endpoints
- [ ] Movie filtering/search

**Frontend Deliverables:**
- [ ] Browse Movies page
- [ ] Movie detail page
- [ ] Theater list
- [ ] Showtime selection

**Tasks:**

```
1. Backend: Movie & Theater Endpoints
   routes/movies.py:
   └─ GET /movies (with filters)
   └─ GET /movies/{id}
   └─ POST /movies (admin)
   
   routes/theaters.py:
   └─ GET /theaters
   └─ GET /theaters/{id}
   └─ GET /theaters/{id}/screens

   routes/showtimes.py:
   └─ GET /showtimes?movieId=X&theaterId=Y
   └─ GET /showtimes/{id}

2. Frontend: Movie Browse Page
   src/pages/BrowseMoviesPage.tsx:
   └─ Display list of movies
   └─ Filter by genre, language
   └─ Search functionality
   └─ Responsive grid layout

3. Frontend: Movie Detail Page
   src/pages/MovieDetailPage.tsx:
   └─ Movie info (title, poster, description)
   └─ Showtimes list
   └─ Select showtime
   └─ Navigate to booking

4. Create movie card component
   src/components/MovieCard.tsx:
   └─ Image, title, rating
   └─ Genre/language badges
   └─ CTA button
```

---

### Day 7: Seat Selection & Booking Core

**Scope**: Seat grid + basic booking flow

**Backend Deliverables:**
- [ ] Seat model and endpoints
- [ ] Booking endpoints (create, list)
- [ ] Race condition prevention (seat locking)
- [ ] Available seats check

**Frontend Deliverables:**
- [ ] Seat selection page
- [ ] Booking summary
- [ ] Booking form

**Tasks:**

```
1. Backend: Seat Management
   models/seat.py:
   └─ Seat (id, screen_id, row, number, status)
   
   routes/seats.py:
   └─ GET /seats/{screenId}/available
   └─ GET /seats/{screenId}/all
   
   utils/booking.py:
   └─ Check seat availability
   └─ Lock seats for booking
   └─ Release locks if booking fails

2. Backend: Booking Endpoints
   routes/bookings.py:
   └─ POST /bookings (create booking)
   └─ GET /bookings (list user bookings)
   └─ GET /bookings/{id}
   └─ POST /bookings/{id}/cancel
   
3. Frontend: Seat Selection Component
   src/components/SeatGrid.tsx:
   └─ Display seat grid
   └─ Show seat status (available, selected, taken)
   └─ Handle seat click
   └─ Show price per seat
   
   src/pages/SeatSelectionPage.tsx:
   └─ Seat grid component
   └─ Booking summary (seats, total price)
   └─ Proceed to payment button

4. Create booking store
   src/store/bookingStore.ts:
   └─ selectedSeats state
   └─ showtime state
   └─ totalPrice state
   └─ addSeat(), removeSeat()
```

**End of Phase 2 Checkpoint:**
- ✓ Backend FastAPI setup complete
- ✓ Database models created
- ✓ Authentication system working
- ✓ Movie/Theater data accessible
- ✓ Seat selection functional
- ✓ Basic booking flow started

---

## Phase 3: Features (Days 8-20)

### Day 8-9: Payment & Booking Confirmation

**Tasks:**

```
BACKEND:
1. Payment simulation
   routes/payments.py:
   └─ POST /payments/initiate
   └─ POST /payments/verify
   └─ Stripe/Razorpay integration (or mock)

2. Booking confirmation
   └─ Generate booking reference
   └─ Generate QR code
   └─ Send confirmation email
   └─ Create transaction record

FRONTEND:
1. Payment page
   src/pages/PaymentPage.tsx:
   └─ Display booking summary
   └─ Accept card details
   └─ Process payment
   
2. Booking confirmation page
   src/pages/BookingConfirmationPage.tsx:
   └─ Booking reference
   └─ QR code display
   └─ Download ticket
   └─ Email confirmation
   
3. QR code component
   src/components/QRCode.tsx:
   └─ Generate QR from booking reference
   └─ Display with styling
```

---

### Day 10-11: User Dashboard

**Tasks:**

```
BACKEND:
1. Dashboard endpoints
   routes/dashboard.py:
   └─ GET /dashboard/user (bookings, profile)
   └─ GET /dashboard/theater (analytics for owner)

FRONTEND:
1. Customer Dashboard
   src/pages/CustomerDashboard.tsx:
   └─ Active bookings
   └─ Booking history
   └─ Cancel booking
   └─ Download tickets
   
2. Theater Owner Dashboard
   src/pages/OwnerDashboard.tsx:
   └─ Theater/screen management
   └─ Showtime management
   └─ Analytics (revenue, occupancy)
   └─ Create new showtime
```

---

### Day 12-14: AI Chat Interface

**Tasks:**

```
BACKEND:
1. Integrate Claude API
   pip install anthropic

2. Chat endpoints
   routes/chat.py:
   └─ POST /chat/message
   └─ GET /chat/history
   └─ WebSocket /ws/chat (optional)

3. AI System Prompt
   └─ Instruction to help with movie bookings
   └─ Context about available movies
   └─ Handle movie queries, bookings

FRONTEND:
1. Chat interface
   src/components/ChatInterface.tsx:
   └─ Message list
   └─ Message input
   └─ Typing indicator
   
2. Chat store (Zustand)
   src/store/chatStore.ts:
   └─ messages state
   └─ isLoading state
   └─ sendMessage action
   
3. Chat page
   src/pages/ChatPage.tsx:
   └─ Chat interface component
   └─ Message history
```

---

### Day 15-17: Voice AI Integration

**Tasks:**

```
BACKEND:
1. Integrate PipeCat
   pip install pipecat-ai deepgram
   pip install google-cloud-texttospeech (or ElevenLabs)

2. Voice endpoints
   routes/voice.py:
   └─ WebSocket /ws/voice
   └─ Handle audio streaming
   └─ STT → LLM → TTS pipeline

FRONTEND:
1. Voice interface
   src/components/VoiceInterface.tsx:
   └─ Record button
   └─ Transcription display
   └─ Audio player for response
   └─ Status indicator
   
2. Voice hook
   src/hooks/useVoice.ts:
   └─ recordAudio()
   └─ startListening()
   └─ stopListening()
   
3. Voice page
   src/pages/VoicePage.tsx:
   └─ Voice interface component
```

---

### Day 18-20: Testing & Refinement

**Tasks:**

```
BACKEND:
1. Unit tests for models
2. Integration tests for APIs
3. E2E tests for booking flow
4. Load testing

FRONTEND:
1. Component tests
2. Integration tests
3. Accessibility tests (WCAG AAA)
4. Visual regression tests
5. E2E tests (Cypress)

POLISH:
1. Error handling
2. Loading states
3. Empty states
4. Validation messages
5. Mobile responsiveness
```

**End of Phase 3 Checkpoint:**
- ✓ Full booking flow functional
- ✓ Payment processing working
- ✓ User dashboard complete
- ✓ AI chat interface ready
- ✓ Voice AI integrated (basic)
- ✓ All tests written

---

## Phase 4: Integration & Testing (Days 21-25)

### Tasks

```
1. End-to-end testing
   └─ Complete booking flow
   └─ Payment process
   └─ QR code generation
   └─ Email notifications

2. Accessibility audit
   └─ WAVE testing
   └─ Screen reader testing
   └─ Keyboard navigation
   └─ Color contrast validation

3. Performance optimization
   └─ Bundle size analysis
   └─ Code splitting
   └─ Image optimization
   └─ Lazy loading
   └─ Lighthouse score (90+)

4. Security audit
   └─ OWASP top 10
   └─ JWT token security
   └─ SQL injection prevention
   └─ CSRF protection

5. Bug fixes and refinement
   └─ User testing feedback
   └─ Edge cases
   └─ Error scenarios
```

---

## Phase 5: Polish & Deployment (Days 26-30)

### Tasks

```
DAY 26-27:
1. Deployment preparation
   └─ Environment configuration
   └─ Database migrations script
   └─ API documentation
   └─ Frontend build optimization

2. Frontend deployment (Vercel)
   └─ Build: npm run build
   └─ Deploy to Vercel
   └─ Setup custom domain
   └─ Configure environment variables

3. Backend deployment
   Option A: Render
   └─ Create Render account
   └─ Connect Git repository
   └─ Deploy FastAPI app
   
   Option B: Railway
   └─ Create Railway account
   └─ Connect Git
   └─ Deploy with Procfile
   
   Option C: Local VPS
   └─ Setup Nginx/Gunicorn
   └─ Configure SSL

DAY 28:
1. Database setup on production
   └─ Create PostgreSQL instance
   └─ Run migrations
   └─ Seed initial data
   └─ Setup backups

2. API integration with frontend
   └─ Update API base URL
   └─ Test all endpoints
   └─ Verify authentication

DAY 29:
1. Monitoring setup
   └─ Sentry for errors
   └─ Vercel Analytics
   └─ Uptime monitoring

2. Documentation
   └─ README updated
   └─ API documentation
   └─ Deployment guide
   └─ User guide

DAY 30:
1. Final testing
   └─ Smoke tests
   └─ Payment flow test
   └─ Email notifications
   └─ Error scenarios

2. Go-live
   └─ Production deployment
   └─ Monitor for issues
   └─ Hotfix if needed
```

---

## Part 3: Detailed Task Breakdown

### Task: Setup React Project (Day 3)

**Estimated Time**: 2-3 hours

```bash
# 1. Create project
npm create vite@latest movie-ticket-system -- --template react-ts
cd movie-ticket-system

# 2. Install core dependencies
npm install react-router-dom axios

# 3. Install state management
npm install zustand @tanstack/react-query

# 4. Install UI dependencies
npm install clsx tailwind-merge

# 5. Install form dependencies
npm install react-hook-form zod @hookform/resolvers

# 6. Install development dependencies
npm install -D \
  tailwindcss postcss autoprefixer \
  eslint @typescript-eslint/eslint-plugin \
  prettier \
  jest @testing-library/react @testing-library/jest-dom \
  @axe-core/react

# 7. Initialize Tailwind
npx tailwindcss init -p

# 8. Start development server
npm run dev
```

---

### Task: Create Button Component (Day 2)

**Estimated Time**: 1 hour

```tsx
// src/components/Button/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  ...props
}: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-primary border-primary text-black hover:shadow-glow-purple',
    secondary: 'bg-black border-neon-blue text-neon-blue hover:shadow-glow-blue',
  };

  const sizeClasses = {
    sm: 'px-sm py-xs text-sm',
    md: 'px-md py-sm text-base',
    lg: 'px-lg py-md text-lg',
  };

  return (
    <button
      {...props}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        min-h-touch min-w-touch
        border-medium rounded-none font-bold
        transition-none
        hover:scale-[1.02]
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-2 focus:outline-offset-2 focus:outline-neon-green
        ${className}
      `}
      disabled={loading || props.disabled}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
```

---

## Part 4: Key Implementation Rules

### Rule 1: Component Structure

```
Every component should follow this pattern:

src/components/[ComponentName]/
├── [ComponentName].tsx      # Main component
├── [ComponentName].test.tsx  # Tests
├── [ComponentName].types.ts  # TypeScript interfaces
└── index.ts                  # Exports

Export from: src/components/index.ts
Usage: import { ComponentName } from '@/components'
```

### Rule 2: TypeScript Strict Mode

```tsx
// REQUIRED for all files
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,           // ✓ Required
    "noImplicitAny": true,    // ✓ Required
    "strictNullChecks": true, // ✓ Required
  }
}

// ALWAYS type your props
interface ButtonProps {
  text: string;        // ✓
  onClick: () => void; // ✓
  // onClick?: undefined;  // ✗ Not allowed in strict mode
}
```

### Rule 3: Accessibility

Every component MUST:
- [ ] Have visible focus states (outline-2 outline-neon-green)
- [ ] Support keyboard navigation (Tab, Enter, Escape)
- [ ] Have proper ARIA labels (aria-label, role)
- [ ] Meet 7:1 contrast ratio (text on black)
- [ ] Pass jest-axe tests

### Rule 4: Styling

```tsx
// ✓ CORRECT: Use Tailwind classes
<button className="bg-primary border-medium text-black font-bold">
  Click me
</button>

// ✗ WRONG: Don't use custom CSS
<button style={{ backgroundColor: '#D946EF' }}>Click me</button>

// ✗ WRONG: No rounded corners
<button className="rounded-lg">Click me</button>

// ✓ CORRECT: Use border-radius-none (0px)
<button className="rounded-none">Click me</button>
```

### Rule 5: State Management

```tsx
// Client State (UI state) → Use Zustand
const useUIStore = create((set) => ({
  isModalOpen: false,
  toggleModal: () => set(state => ({ isModalOpen: !state.isModalOpen }))
}))

// Server State (API data) → Use React Query
const { data: movies } = useQuery({
  queryKey: ['movies'],
  queryFn: fetchMovies,
})

// Form State → Use react-hook-form + Zod
const { register, watch, formState: { errors } } = useForm({
  resolver: zodResolver(movieFilterSchema),
})
```

### Rule 6: Error Handling

```tsx
// ✓ CORRECT: Try-catch with user feedback
try {
  await loginUser(email, password);
} catch (error) {
  setError('Invalid credentials. Please try again.');
  // Log to Sentry
}

// ✓ CORRECT: Boundary component
<ErrorBoundary fallback={<ErrorPage />}>
  <AppComponent />
</ErrorBoundary>

// ✗ WRONG: Silent failures
try {
  await loginUser(email, password);
} catch (error) {
  console.log(error); // ✗ Don't ignore errors
}
```

### Rule 7: API Integration

```tsx
// ✓ CORRECT: Type-safe API calls
const loginUser = async (email: string, password: string): Promise<User> => {
  const response = await axios.post<LoginResponse>('/auth/login', {
    email,
    password,
  });
  return response.data.user;
};

// Use with React Query
const { mutate: login } = useMutation({
  mutationFn: ({ email, password }) => loginUser(email, password),
  onSuccess: (user) => {
    useAuthStore.setState({ user, token });
  },
});
```

---

## Part 5: Development Workflow

### Daily Standup Template

```
Date: YYYY-MM-DD
Phase: [Phase N]
Day: [Day N/30]

COMPLETED:
- [ ] Task 1
- [ ] Task 2

IN PROGRESS:
- [ ] Task 3

BLOCKERS:
- Issue: [describe]
  Solution: [describe]

NEXT DAY:
- [ ] Task 4
- [ ] Task 5

METRICS:
- Code coverage: XX%
- Bundle size: XX KB
- Lighthouse score: XX/100
```

### Git Workflow

```bash
# Branch naming
feature/[feature-name]      # New feature
bugfix/[bug-name]           # Bug fix
hotfix/[hotfix-name]        # Production hotfix

# Commit messages
feat: add seat selection component
fix: resolve race condition in booking
docs: update deployment guide
style: apply OLED theme colors
test: add unit tests for Button component
refactor: simplify auth flow

# Example
git checkout -b feature/seat-grid
git add src/components/SeatGrid.tsx
git commit -m "feat: add seat grid component"
git push origin feature/seat-grid
# Create Pull Request
```

---

## Part 6: Success Criteria Checklist

### Backend Checklist

- [ ] All endpoints tested and documented
- [ ] Database migrations working
- [ ] Authentication working (JWT + OAuth)
- [ ] Error handling comprehensive
- [ ] Logging configured
- [ ] Rate limiting implemented
- [ ] CORS configured for frontend
- [ ] Security headers set
- [ ] Database backups configured
- [ ] API documentation (OpenAPI/Swagger)

### Frontend Checklist

- [ ] All pages created and styled
- [ ] Dark theme applied everywhere
- [ ] Components follow design system
- [ ] TypeScript strict mode passing
- [ ] All interactive elements keyboard accessible
- [ ] WCAG AAA accessibility passing
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Error boundaries implemented
- [ ] Loading states for all async operations
- [ ] Test coverage > 80%

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] TLS/SSL certificate installed
- [ ] Monitoring set up (Sentry, Analytics)
- [ ] Backups configured
- [ ] CI/CD pipeline working
- [ ] Error tracking working
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Runbook documentation complete

---

## Part 7: Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Scope creep | Delays | Strict scope boundaries, ADR decisions |
| Time estimation error | Missed deadline | Daily tracking, phase buffers |
| Database performance | Slow queries | Query optimization, indexing |
| Mobile responsiveness | Poor UX | Test on real devices, automated tests |
| API rate limits (AI) | Service interruption | Implement caching, fallback UI |
| Voice AI latency | Poor UX | Optimize pipeline, user feedback |
| Browser compatibility | Production bugs | Test on all major browsers |
| Accessibility issues | WCAG failures | Automated testing + manual audit |

---

## Part 8: Resources & References

### Documentation
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org)
- [React 18 Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query/latest)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref)

### Tools
- VS Code (Editor)
- TablePlus (Database GUI)
- Postman/Insomnia (API Testing)
- Chrome DevTools (Frontend Debugging)
- Sentry (Error Tracking)
- Lighthouse (Performance)
- WAVE (Accessibility)
- WebAIM (Contrast Checker)

### Libraries Used

**Backend:**
- FastAPI: Web framework
- SQLAlchemy 2.0: ORM
- Alembic: Database migrations
- python-jose: JWT handling
- passlib: Password hashing
- anthropic: Claude API
- pipecat-ai: Voice AI framework
- deepgram-sdk: STT provider
- axios: HTTP client

**Frontend:**
- React 18: UI framework
- TypeScript: Type safety
- Vite: Build tool
- TailwindCSS: Styling
- Zustand: State management
- React Query: Server state
- react-hook-form: Forms
- Zod: Validation
- axios: HTTP client
- react-router-dom: Routing

---

## Part 9: Post-Launch Maintenance

### Week 1 (Post-Launch Monitoring)
- Monitor error rates
- Check performance metrics
- Gather user feedback
- Fix critical bugs

### Week 2-4
- Feature requests triage
- Performance optimization
- Security updates
- Documentation updates

### Ongoing
- Monthly security audits
- Quarterly performance reviews
- Continuous monitoring
- User feedback integration

---

## Appendix A: ADR Integration Map

```
DESIGN SYSTEM ← All decisions
├── ADR-001: Python (Backend language)
├── ADR-002: FastAPI (Backend framework)
├── ADR-003: PostgreSQL (Database)
├── ADR-004: JWT + OAuth2 (Authentication)
├── ADR-005: React (Frontend framework)
├── ADR-006: TypeScript (Frontend language)
├── ADR-007: Claude 3.5 (AI model)
├── ADR-008: PipeCat (Voice AI)
├── ADR-009: Zustand + React Query (State)
├── ADR-010: shadcn/ui + Tailwind (UI)
└── DESIGN-SYSTEM.md: OLED dark theme (this document)
```

---

## Document Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Lead Developer | | | |
| QA Lead | | | |
| Product Owner | | | |

---

**END OF IMPLEMENTATION PLAN**

Last Updated: 2026-01-29  
Next Review: When Phase 1 Complete
Status: Ready for Development
