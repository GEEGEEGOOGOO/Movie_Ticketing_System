# ADR-009: State Management Solution Selection

**Status**: Proposed  
**Date**: 2026-01-27  
**Deciders**: Shashank (Intern), Technical Mentor

## Context

React application (ADR-005) requires state management for:
- Authentication state (user, tokens, role)
- Booking flow state (selected seats, showtime, total amount)
- AI chat history and context
- Voice conversation state
- Theater/movie data caching
- Form state

**Requirements:**
- Global state for auth and user data
- Local state for UI components
- Server state management for API data
- Minimal boilerplate for 1-month timeline
- Good TypeScript support (ADR-006)
- DevTools for debugging

**Candidates**: Redux Toolkit, Zustand, Context API, Recoil, Jotai, React Query.

## Decision

We will use **Zustand** for client state and **React Query** for server state.

## Rationale

### Zustand for Client State
- **Minimal boilerplate**: Simplest API among state managers
- **No providers**: No Provider wrapper needed
- **TypeScript native**: Excellent type inference
- **Small bundle**: ~1KB minified
- **Fast**: No unnecessary re-renders
- **DevTools**: Redux DevTools compatible
- **Async actions**: Built-in async support
- **Perfect for booking flow**: Simple state updates for seat selection

Example:
```typescript
import create from 'zustand';

interface BookingState {
  selectedSeats: number[];
  addSeat: (seatId: number) => void;
  removeSeat: (seatId: number) => void;
}

const useBookingStore = create<BookingState>((set) => ({
  selectedSeats: [],
  addSeat: (seatId) => set((state) => ({ 
    selectedSeats: [...state.selectedSeats, seatId] 
  })),
  removeSeat: (seatId) => set((state) => ({
    selectedSeats: state.selectedSeats.filter(id => id !== seatId)
  })),
}));
```

### React Query for Server State
- **Server state specialized**: Designed for API data
- **Automatic caching**: Caches API responses intelligently
- **Background refetching**: Keeps data fresh automatically
- **Loading/error states**: Built-in loading and error handling
- **Optimistic updates**: Update UI before server response
- **Infinite queries**: For paginated movie lists
- **Perfect for**: Movies, theaters, showtimes, bookings data

Example:
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

function useMovies() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

function useBookTicket() {
  return useMutation({
    mutationFn: bookTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
    },
  });
}
```

## Consequences

### Positive
- **Simple**: Zustand easiest to learn and use
- **Fast development**: Minimal boilerplate, quick iteration
- **Type-safe**: Excellent TypeScript support
- **Separation**: Clear separation between client and server state
- **Automatic caching**: React Query handles API caching
- **Better UX**: Loading states, background refetch, optimistic updates
- **Small bundle**: Combined size < 50KB

### Negative
- **Two libraries**: Need to learn both (but both simple)
- **Less opinionated**: Must decide what goes where
- **Smaller ecosystem**: Fewer middleware than Redux

## Alternatives Considered

**Redux Toolkit**: Too much boilerplate for simple app. Better for complex apps with time-travel debugging needs.

**Context API**: No built-in optimization, causes unnecessary re-renders. Good for simple theme/auth, not complex state.

**Recoil**: Atom-based, more complex than Zustand. Meta backing uncertain.

**Jotai**: Similar to Recoil, smaller. But Zustand simpler for our needs.

## Implementation

```typescript
// stores/auth.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

// stores/booking.ts
export const useBookingStore = create<BookingState>((set) => ({
  selectedSeats: [],
  showtime: null,
  addSeat: (seat) => set((state) => ({ 
    selectedSeats: [...state.selectedSeats, seat] 
  })),
}));

// services/api.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    },
  },
});

// App.tsx
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

## References
- Zustand: https://github.com/pmndrs/zustand
- React Query: https://tanstack.com/query/latest
