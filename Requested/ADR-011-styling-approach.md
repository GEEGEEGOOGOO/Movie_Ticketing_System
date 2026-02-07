# ADR-011: CSS/Styling Approach Selection

**Status**: Accepted  
**Date**: 2026-02-06  
**Deciders**: Shashank (Intern)

## Context

The frontend needs a styling approach that supports:
- OLED-optimized dark theme with pure black (#000000) backgrounds
- Neon accent colors (#00FF41 green, #D946EF purple, #00D9FF blue)
- Zero border-radius design (sharp corners)
- Responsive layouts for mobile and desktop
- Fast development within 1-month timeline
- Easy maintenance and consistency

## Decision

We will use **Tailwind CSS** as the primary styling approach.

## Rationale

### Comparison

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Tailwind CSS** | Utility-first, fast iteration, small bundle (purged), great DX | Learning curve for utilities | ✅ **Chosen** |
| **CSS Modules** | Scoped styles, no conflicts | Slower iteration, separate files | ❌ |
| **Styled Components** | CSS-in-JS, dynamic styles | Runtime overhead, larger bundle | ❌ |
| **Emotion** | Similar to Styled Components | Same issues as Styled Components | ❌ |
| **SASS/SCSS** | Variables, nesting, mixins | Requires compilation, older approach | ❌ |

### Why Tailwind CSS

1. **Rapid Development**: Write styles directly in JSX without switching files
   ```tsx
   <button className="bg-black border-2 border-purple-500 text-white px-6 py-3 hover:scale-105">
     Book Now
   </button>
   ```

2. **Design System Alignment**: Custom theme configuration matches our OLED design
   ```js
   // tailwind.config.ts
   theme: {
     colors: {
       'background-dark': '#000000',
       'surface-dark': '#121212',
       'primary': '#D946EF',
       'accent-green': '#00FF41',
     }
   }
   ```

3. **Small Production Bundle**: PurgeCSS removes unused utilities
4. **Responsive Design**: Built-in breakpoint prefixes (`md:`, `lg:`)
5. **Dark Mode**: Native dark mode support
6. **Consistency**: Utility classes enforce design tokens
7. **Community**: Largest CSS framework, extensive resources

### Custom CSS Variables

We also use CSS custom properties for semantic tokens:
```css
:root {
  --color-primary: #D946EF;
  --color-success: #00FF41;
  --bg-primary: #000000;
}
```

## Consequences

### Positive
- Fast styling iteration
- Consistent design tokens
- Small production bundle (~10KB gzipped)
- Great IDE support with Tailwind IntelliSense

### Negative
- Long className strings in JSX
- Learning utility names
- Requires Tailwind configuration setup

## Integration

- **Build Tool**: Vite with PostCSS
- **Config**: `tailwind.config.ts` with custom theme
- **Purging**: Automatic in production builds

## References
- Tailwind CSS: https://tailwindcss.com/
- Tailwind with Vite: https://tailwindcss.com/docs/guides/vite
- DESIGN-SYSTEM.md for full color palette
