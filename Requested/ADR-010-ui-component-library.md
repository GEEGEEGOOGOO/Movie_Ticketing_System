# ADR-010: UI Component Library Selection

**Status**: Accepted  
**Date**: 2026-02-06  
**Deciders**: Shashank (Intern)

## Context

The Movie Ticket Management System needs a UI component library for building consistent, accessible, and production-ready interfaces. The components include buttons, inputs, modals, cards, forms, tabs, and custom components like seat grids and booking flows.

**Requirements:**
- Dark theme support (OLED-optimized design)
- High customization for unique design system
- TypeScript support
- Accessibility (WCAG compliance)
- Small bundle size
- Good documentation

## Decision

We will use **Tailwind CSS with custom components** instead of a traditional UI library.

## Rationale

### Why Not Traditional UI Libraries

| Library | Why Not Chosen |
|---------|----------------|
| **Material-UI (MUI)** | Heavy bundle size (~300KB), opinionated Material Design conflicts with our OLED dark theme |
| **Ant Design** | Enterprise-focused, excessive features we don't need, large bundle |
| **Chakra UI** | Great but still adds abstraction layer over Tailwind |
| **shadcn/ui** | Considered, but decided to build custom for full control |

### Why Tailwind + Custom Components

1. **Full Design Control**: Our OLED-optimized design with neon accents, zero border-radius, and specific color palette is easier to implement without fighting a library's defaults
2. **Smaller Bundle**: No library overhead, only the CSS we use
3. **No Abstraction Layer**: Direct control over each component's behavior
4. **Faster Iteration**: Modify styles instantly without library constraints
5. **Learning Opportunity**: Building components from scratch is educational

### Component Strategy

```
Custom Components Built:
├── Button (primary, secondary, disabled states)
├── Input (text, password, with validation)
├── Card (movie cards, booking cards)
├── Modal (booking confirmation, location)
├── Header (navigation, location display)
├── Footer (site information)
├── SeatGrid (interactive seat selection)
└── BookingFlow (multi-step process)
```

## Consequences

### Positive
- Complete design control
- Smaller bundle size
- No library update dependencies
- Tailwind's utility classes are intuitive

### Negative
- More development time building components
- Must ensure accessibility manually
- No pre-built complex components (date pickers, etc.)

## References
- Tailwind CSS: https://tailwindcss.com/
- DESIGN-SYSTEM.md for component specifications
