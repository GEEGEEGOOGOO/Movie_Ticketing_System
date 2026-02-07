# ADR-012: Frontend Folder Structure Selection

**Status**: Accepted  
**Date**: 2026-02-06  
**Deciders**: Shashank (Intern)

## Context

The React frontend needs an organized folder structure that supports:
- Solo developer workflow (1 person)
- 1-month development timeline
- Clear separation of concerns
- Easy navigation and maintenance
- Scalability for future features

## Decision

We will use a **Layer-based (flat) structure** for the frontend.

## Rationale

### Options Considered

#### 1. Feature-based Structure
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── theaters/
│   └── bookings/
```
**Verdict**: Better for large teams, overkill for solo developer.

#### 2. Layer-based Structure ✅ CHOSEN
```
src/
├── components/    # Reusable UI components
├── pages/         # Route pages
├── hooks/         # Custom React hooks
├── store/         # Zustand stores
├── api/           # API client and services
├── types/         # TypeScript interfaces
└── utils/         # Helper functions
```
**Verdict**: Simple, intuitive, perfect for small team.

#### 3. Domain-driven Structure
```
src/
├── domain/
│   ├── movie/
│   ├── theater/
│   └── booking/
```
**Verdict**: Too complex for this project size.

### Why Layer-based

| Benefit | Explanation |
|---------|-------------|
| **Simplicity** | Easy to find files by type |
| **Fast Navigation** | Fewer nested folders |
| **Solo-friendly** | No need for cross-team coordination |
| **Quick Setup** | Minimal planning required |
| **IDE Support** | Flat structure works well with search |

### Current Implementation

```
frontend/src/
├── api/
│   └── client.ts           # Axios client + all API functions
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── hooks/
│   └── useGeolocation.ts
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── MovieDetail.tsx
│   ├── SeatSelection.tsx
│   ├── Payment.tsx
│   ├── BookingConfirmation.tsx
│   ├── Dashboard.tsx
│   ├── OwnerDashboard.tsx
│   ├── Chat.tsx
│   └── Voice.tsx
├── store/
│   ├── authStore.ts
│   └── locationStore.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Consequences

### Positive
- Easy to understand and navigate
- Fast development iteration
- No over-engineering
- Works well with Vite's fast refresh

### Negative
- May need restructuring if team grows significantly
- Components folder can get large (mitigated by clear naming)

### Migration Path
If the project grows, we can gradually adopt feature-based structure by:
1. Creating `features/` folder for new complex features
2. Keeping shared components in `components/`
3. Moving domain-specific code to feature folders

## References
- React Project Structure: https://react.dev/learn/thinking-in-react
- Vite + React: https://vitejs.dev/guide/
