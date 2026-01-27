# ADR-006: Frontend Programming Language Selection

**Status**: Proposed  
**Date**: 2026-01-27  
**Deciders**: Shashank (Intern), Technical Mentor

## Context

Following the decision to use React (ADR-005), we need to choose between JavaScript and TypeScript for frontend development. The application involves:

**Complexity Factors:**
- Complex data models (User, Theater, Screen, Seat, Showtime, Booking)
- API integration with strict type contracts
- State management with multiple data shapes
- Real-time seat booking with race condition handling
- AI conversation history and context management
- Voice AI integration with audio stream handling
- Form validation and error handling
- Role-based UI rendering (Theater Owner vs Customer)

**Team Context:**
- Solo developer (intern) for 1-month timeline
- Need to catch bugs early to avoid debugging time
- Code maintainability for future developers
- Clear API contracts with backend (FastAPI with Pydantic)

**Development Goals:**
- Fast iteration without sacrificing code quality
- Prevent runtime errors in production
- Self-documenting code
- Excellent IDE support for faster development
- Easy refactoring as requirements evolve

The choice is between **JavaScript** (dynamic typing) and **TypeScript** (static typing).

## Decision

We will use **TypeScript** as the frontend programming language.

## Rationale

### Type Safety & Bug Prevention
- **Catch errors at compile time**: 15-20% of JavaScript bugs caught before runtime
- **API contract enforcement**: Backend returns typed responses, frontend expects typed data
- **Prevent null/undefined errors**: TypeScript's strict null checks prevent common crashes
- **Refactoring safety**: IDE catches all affected code when types change
- **Self-validating code**: Types document expected data structures
- Example:
  ```typescript
  // TypeScript catches this at compile time
  interface Movie {
    id: number;
    title: string;
    duration: number;
  }
  
  function displayMovie(movie: Movie) {
    console.log(movie.ttle); // ERROR: Property 'ttle' does not exist
  }
  
  // JavaScript only fails at runtime
  function displayMovie(movie) {
    console.log(movie.ttle); // undefined, silent failure
  }
  ```

### Developer Experience & IDE Support
- **IntelliSense autocomplete**: IDE suggests properties and methods while typing
- **Jump to definition**: Navigate to type definitions instantly
- **Inline documentation**: Hover over variables to see types and JSDoc
- **Refactoring tools**: Rename symbols safely across entire codebase
- **Import suggestions**: IDE automatically imports required types
- **Error highlighting**: Red squiggles show errors before running code
- 30-40% faster development with excellent IDE support (VS Code)

### API Integration Benefits
- **Backend type alignment**: FastAPI Pydantic models → TypeScript interfaces
- **Request/response types**: API calls are type-safe end-to-end
- **Code generation**: Can generate TypeScript types from OpenAPI spec
- **Runtime validation**: Combine with Zod for runtime type checking
- Example:
  ```typescript
  // Frontend types match backend Pydantic models
  interface CreateTheaterRequest {
    name: string;
    location: string;
    owner_id: number;
  }
  
  interface TheaterResponse {
    id: number;
    name: string;
    location: string;
    owner_id: number;
    created_at: string;
  }
  
  async function createTheater(data: CreateTheaterRequest): Promise<TheaterResponse> {
    const response = await api.post('/theaters', data);
    return response.data; // TypeScript validates response shape
  }
  ```

### State Management Type Safety
- **Redux Toolkit**: Fully typed actions, reducers, and selectors
- **Zustand**: Type-safe store with TypeScript inference
- **React Query**: Generic types for query results
- **React hooks**: useState<Type>, useRef<Type> ensure type consistency
- Example:
  ```typescript
  interface BookingState {
    selectedSeats: Seat[];
    currentShowtime: Showtime | null;
    totalAmount: number;
  }
  
  const useBookingStore = create<BookingState>((set) => ({
    selectedSeats: [],
    currentShowtime: null,
    totalAmount: 0,
  }));
  ```

### Component Props Type Safety
- **Interface contracts**: Components declare expected props
- **Required vs optional**: TypeScript enforces required props
- **Default props**: Type-safe default values
- **Children types**: Type-safe children components
- Example:
  ```typescript
  interface SeatProps {
    seat: Seat;
    isSelected: boolean;
    isBooked: boolean;
    onSelect: (seatId: number) => void;
  }
  
  export const SeatComponent: React.FC<SeatProps> = ({
    seat,
    isSelected,
    isBooked,
    onSelect
  }) => {
    // TypeScript ensures all props are provided and correct type
  };
  ```

### Complex Data Model Management
- **Union types**: Model multiple states (BookingStatus = 'pending' | 'confirmed' | 'cancelled')
- **Discriminated unions**: Type-safe state machines
- **Generics**: Reusable type-safe components
- **Type guards**: Runtime type narrowing
- Example:
  ```typescript
  type SeatType = 'regular' | 'premium' | 'recliner';
  type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
  
  interface Seat {
    id: number;
    row: string;
    number: number;
    type: SeatType;
    price: number;
  }
  
  interface Booking {
    id: number;
    status: BookingStatus;
    seats: Seat[];
    total: number;
    user_id: number;
  }
  
  // TypeScript prevents invalid status values
  const booking: Booking = {
    status: 'invalid', // ERROR: Type '"invalid"' is not assignable
  };
  ```

### Code Maintainability
- **Self-documenting**: Types serve as inline documentation
- **Easier onboarding**: New developers understand code structure quickly
- **Refactoring confidence**: Change types once, find all affected code
- **Reduced comments**: Type signatures explain intent
- **Contract enforcement**: API changes detected immediately

### Error Prevention Examples
```typescript
// 1. Null safety
function getMovieTitle(movie: Movie | null): string {
  return movie.title; // ERROR: Object is possibly 'null'
  return movie?.title ?? 'Unknown'; // CORRECT
}

// 2. Array operations
const movies: Movie[] = [];
movies.map(m => m.title); // ✓ TypeScript knows 'm' is Movie

// 3. Async/await
async function fetchTheaters(): Promise<Theater[]> {
  const response = await api.get<Theater[]>('/theaters');
  return response.data; // Type-checked response
}

// 4. Event handlers
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.currentTarget.disabled = true; // Type-safe DOM access
};
```

### React & TypeScript Integration
- **First-class support**: React 18+ has excellent TypeScript support
- **Type definitions**: @types/react provides all React types
- **JSX typing**: Type-safe JSX elements
- **Hook types**: All hooks have generic type parameters
- **Context API**: Type-safe context with TypeScript
- **Component typing**: FC<Props>, memo<Props>, forwardRef<Props>

### Ecosystem & Libraries
- **Type definitions**: 8000+ packages have @types definitions
- **Axios**: Built-in TypeScript support
- **React Router**: Full TypeScript support
- **Redux Toolkit**: TypeScript-first design
- **UI libraries**: MUI, Chakra, shadcn all have TypeScript support
- **Testing**: Jest and React Testing Library support TypeScript

### Learning Curve Management
- **Gradual adoption**: Can use `any` type initially, add types incrementally
- **Type inference**: TypeScript infers many types automatically
- **VS Code integration**: Built-in TypeScript support, no setup needed
- **Documentation**: Excellent official docs and tutorials
- **React TypeScript Cheatsheet**: Community resource for common patterns

## Consequences

### Positive
- **15-20% fewer bugs**: Catch type errors before runtime
- **30-40% faster development**: IDE autocomplete and IntelliSense
- **Better refactoring**: Safe, automated refactoring across codebase
- **Self-documenting code**: Types explain data structures and APIs
- **Easier debugging**: Type errors caught at compile time, not runtime
- **Confidence in changes**: TypeScript validates changes across codebase
- **Better collaboration**: Clear contracts between functions and components
- **Production stability**: Fewer runtime errors in production

### Negative
- **Initial learning curve**: 2-3 days to get comfortable with TypeScript basics
- **Compilation step**: Adds build time (mitigated by Vite's fast compilation)
- **Type definitions**: Some packages lack types (rare, can use `any` or write own)
- **Verbosity**: More code to write types (offset by IDE autocomplete)
- **Complex types**: Advanced types can be confusing (stick to basics initially)
- **Strict mode challenges**: Strict null checks require careful handling

### Neutral
- **tsconfig.json**: Need to configure TypeScript compiler options
- **Type declarations**: Create .d.ts files for third-party libraries without types
- **Build setup**: Vite/CRA handle TypeScript automatically
- **Type versioning**: @types packages need version management

## Alternatives Considered

### JavaScript (ES6+)
**Strengths:**
- **No compilation**: Direct browser execution (with module bundler)
- **No learning curve**: Standard JavaScript knowledge sufficient
- **Flexibility**: Dynamic typing allows quick prototyping
- **Smaller codebase**: No type annotations
- **Simple setup**: No tsconfig.json configuration

**Why Not Chosen:**
- **Runtime errors**: Type errors only discovered when code executes
- **Poor IDE support**: Limited autocomplete and IntelliSense
- **Refactoring risk**: Renaming variables/functions error-prone
- **No API contracts**: Cannot validate API responses at compile time
- **Harder debugging**: Bugs surface in production, not development
- **Maintenance burden**: Large codebase becomes hard to understand
- **Team communication**: Implicit contracts lead to misunderstandings
- For 1-month solo project, TypeScript's safety net outweighs learning curve

### JavaScript with JSDoc
**Strengths:**
- **Type hints**: JSDoc comments provide some type information
- **No compilation**: Pure JavaScript
- **IDE support**: VS Code uses JSDoc for autocomplete
- **Gradual typing**: Add types incrementally

**Why Not Chosen:**
- **Not enforced**: Types are comments, not validated
- **Verbose**: JSDoc syntax more verbose than TypeScript
- **Limited features**: No advanced types (union, intersection, generics)
- **No compile-time checking**: Errors still occur at runtime
- **Inconsistent**: Easy to forget JSDoc comments
- **Worse DX**: Less reliable than TypeScript's compiler
- If we want types, better to use TypeScript directly

### Flow (Facebook's type checker)
**Strengths:**
- **Type checking**: Similar to TypeScript
- **Facebook backing**: Used by Facebook internally

**Why Not Chosen:**
- **Declining adoption**: Community moved to TypeScript
- **Smaller ecosystem**: Fewer type definitions available
- **Less IDE support**: VS Code TypeScript integration superior
- **Limited resources**: Fewer tutorials and documentation
- **Facebook-specific**: Primarily used within Facebook
- TypeScript is industry standard with much better ecosystem

## Implementation Strategy

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowJs": false,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### Type Organization
```
src/
├── types/
│   ├── index.ts          # Re-export all types
│   ├── user.ts           # User-related types
│   ├── theater.ts        # Theater, Screen, Seat types
│   ├── movie.ts          # Movie types
│   ├── booking.ts        # Booking types
│   ├── api.ts            # API request/response types
│   └── voice.ts          # Voice AI types
```

### Example Type Definitions
```typescript
// types/user.ts
export interface User {
  id: number;
  email: string;
  role: 'theater_owner' | 'customer';
  is_verified: boolean;
  google_id?: string;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
}

// types/theater.ts
export interface Theater {
  id: number;
  owner_id: number;
  name: string;
  location: string;
  created_at: string;
}

export interface Screen {
  id: number;
  theater_id: number;
  name: string;
  rows: number;
  columns: number;
}

export type SeatType = 'regular' | 'premium' | 'recliner';

export interface Seat {
  id: number;
  screen_id: number;
  row_label: string;
  seat_number: number;
  seat_type: SeatType;
}

// types/booking.ts
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: number;
  user_id: number;
  showtime_id: number;
  booking_reference: string;
  total_amount: number;
  status: BookingStatus;
  payment_verified: boolean;
  created_at: string;
  seats: Seat[];
}
```

### API Service Types
```typescript
// services/api.ts
import axios, { AxiosResponse } from 'axios';
import type { Theater, CreateTheaterRequest } from '../types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export async function createTheater(
  data: CreateTheaterRequest
): Promise<Theater> {
  const response: AxiosResponse<Theater> = await api.post('/theaters', data);
  return response.data;
}

export async function getTheaters(): Promise<Theater[]> {
  const response: AxiosResponse<Theater[]> = await api.get('/theaters');
  return response.data;
}
```

### Component Types
```typescript
// components/SeatGrid.tsx
import React from 'react';
import type { Seat, SeatType } from '../types';

interface SeatGridProps {
  seats: Seat[];
  selectedSeats: number[];
  bookedSeats: number[];
  onSeatSelect: (seatId: number) => void;
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  selectedSeats,
  bookedSeats,
  onSeatSelect,
}) => {
  return (
    <div className="seat-grid">
      {seats.map((seat) => (
        <SeatComponent
          key={seat.id}
          seat={seat}
          isSelected={selectedSeats.includes(seat.id)}
          isBooked={bookedSeats.includes(seat.id)}
          onSelect={onSeatSelect}
        />
      ))}
    </div>
  );
};
```

### Gradual Adoption Strategy
```typescript
// Start with basics, add complexity as comfortable

// Week 1: Basic types
let count: number = 0;
const name: string = 'Theater';

// Week 2: Interfaces
interface Movie {
  id: number;
  title: string;
}

// Week 3: Generics and advanced types
function fetchData<T>(url: string): Promise<T> {
  return api.get<T>(url).then(res => res.data);
}

// Week 4: Complex types
type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
  message?: string;
};
```

### Type Generation from Backend
```bash
# Optional: Generate TypeScript types from OpenAPI spec
npm install openapi-typescript-codegen
openapi-typescript-codegen --input http://localhost:8000/openapi.json --output ./src/types/api
```

## Learning Resources

- Official TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/
- React TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/
- TypeScript Deep Dive: https://basarat.gitbook.io/typescript/
- Total TypeScript: https://www.totaltypescript.com/
- TypeScript Playground: https://www.typescriptlang.org/play

## References

- TypeScript Documentation: https://www.typescriptlang.org/
- React + TypeScript: https://react.dev/learn/typescript
- TypeScript ESLint: https://typescript-eslint.io/
- Type vs Interface: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces
