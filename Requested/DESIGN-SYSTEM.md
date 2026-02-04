# Movie Ticket Management System - Design System
## OLED-Optimized Dark Interface

**Document Version**: 1.0  
**Date**: 2026-01-29  
**Design Status**: Implementation-Ready  
**Project Timeline**: 1-month development sprint

---

## 1. Executive Summary

This design system provides a comprehensive guide for implementing the Movie Ticket Management System frontend using an **OLED-optimized dark interface** with neon accents. The design aligns with ADR-005 (React), ADR-006 (TypeScript), and leverages Tailwind CSS for utility-first styling.

**Key Features:**
- Deep black (#000000) background for OLED power efficiency
- Vibrant neon accents (green, blue, purple, gold) for high contrast
- Minimal glow effects for eye comfort
- 7:1+ text contrast for accessibility
- Zero rounded corners (border-radius: 0px) for sharp, modern aesthetic
- System fonts (system-ui, monospace) for performance
- Bold typography (font-weight: 700+) for readability

---

## 2. Design Prompt Analysis

### 2.1 Core Design Specifications

```css
/* OLED Optimization */
--bg-black: #000000;              /* Deep black for power saving */
--bg-dark-grey: #121212;          /* Subtle elevation variation */
--text-primary: #FFFFFF;          /* Maximum contrast on black */

/* Neon Accent Palette */
--accent-neon-green: #00FF41;     /* Cyan-green neon */
--accent-neon-blue: #00D9FF;      /* Electric blue */
--accent-neon-purple: #D946EF;    /* Vibrant purple */
--accent-neon-gold: #FFD700;      /* Rich gold */
--accent-neon-red: #FF0000;       /* Pure red */

/* Constraints */
border-radius: 0px;               /* No rounded corners */
transition: none or 0s;           /* No smooth transitions */
font-family: system-ui, monospace; /* Native system fonts */
font-weight: 700+;                /* Bold typography */
border: visible 2-4px;            /* Strong borders */
```

### 2.2 Color Palette

| Color Name | Hex Code | Usage | WCAG Ratio |
|-----------|----------|-------|-----------|
| **Pure Black** | #000000 | Background (OLED optimized) | N/A |
| **Dark Grey** | #121212 | Cards, elevation, UI surface | N/A |
| **White** | #FFFFFF | Primary text | 21:1 |
| **Neon Green** | #00FF41 | Success, highlights, accents | 19.56:1 |
| **Neon Blue** | #00D9FF | Links, info, interactive | 18.5:1 |
| **Neon Purple** | #D946EF | CTAs, emphasis, special | 8.2:1 |
| **Neon Gold** | #FFD700 | Premium, warnings, accent | 19.3:1 |
| **Neon Red** | #FF0000 | Errors, critical states | 5.3:1 |

---

## 3. Implementation Rules

### 3.1 Typography Rules

```
Rule T1: Font Family
- Primary: system-ui (OS native fonts)
- Secondary: Courier New, monospace (technical UI)
- No Google Fonts (performance first)
- Font-weight: minimum 700 (bold only)

Rule T2: Text Hierarchy
- H1: system-ui, 48px, #FFFFFF, weight 700
- H2: system-ui, 36px, #FFFFFF, weight 700
- H3: system-ui, 28px, #FFFFFF, weight 700
- Body: system-ui, 16px, #FFFFFF, weight 700
- Small: system-ui, 12px, #FFFFFF, weight 700
- Code: monospace, 14px, #00FF41, weight 700

Rule T3: Line Height
- Headings: 1.2 (tight)
- Body text: 1.5 (readable)
- Code: 1.6 (spaced)

Rule T4: Letter Spacing
- Headings: 0.5px (character spacing)
- Body: 0px (tight)
- Code: 1px (distinct)
```

### 3.2 Color Rules

```
Rule C1: Background Usage
- Primary background: #000000 (OLED black)
- Secondary surfaces: #121212 (dark grey)
- Never use: #FFFFFF (no light backgrounds)

Rule C2: Text Color
- Primary text: #FFFFFF (always)
- Secondary: 80% opacity white (#FFFFFFCC)
- Tertiary: 60% opacity white (#FFFFFF99)
- Code/Technical: #00FF41 (neon green)

Rule C3: Accent Priority
✓ Do use: Neon green for success states
✓ Do use: Neon blue for interactive elements
✓ Do use: Neon purple for CTAs
✓ Do use: Neon gold for premium features
✗ Don't use: Pastels or desaturated colors
✗ Don't use: More than 2 primary accents per screen

Rule C4: Contrast Requirements
- Text on background: 7:1 minimum (WCAG AAA)
- Interactive elements: 3:1 minimum (WCAG AA)
- Border on surface: 2:1 minimum
- Test with: WebAIM Contrast Checker
```

### 3.3 Layout Rules

```
Rule L1: Border Radius
- ALL elements: border-radius: 0px (sharp corners)
- No exceptions for buttons, cards, inputs
- Rationale: Modern, technical aesthetic

Rule L2: Borders
- All interactive elements: 2-4px solid border
- Button borders: 3px
- Input borders: 2px
- Card borders: 2px
- Border color: Use accent color or #FFFFFF

Rule L3: Spacing (8px grid system)
- xs: 4px (micro)
- sm: 8px (small)
- md: 16px (standard)
- lg: 24px (large)
- xl: 32px (extra large)
- 2xl: 48px (huge)
- No half-units (no 6px, 10px, etc.)

Rule L4: Responsive Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+
- No fixed widths, always fluid
```

### 3.4 Animation Rules

```
Rule A1: Transitions
- Default: transition: none or 0s (no animations)
- Only for: Loading states, hover states (immediate)
- Max duration: 0.1s if required
- Easing: linear (no ease-in-out)

Rule A2: Hover States
- Add 2-4px scale: hover:scale-[1.02]
- Add accent glow: hover:shadow-[0_0_8px_#00FF41]
- Change opacity: hover:opacity-80
- Always show cursor: cursor-pointer on interactive

Rule A3: Loading States
- Use skeleton screens (dark grey #121212)
- Or spinning border animation
- Keep loading spinners: monochromatic (white)
- Max animation speed: 1s per revolution

Rule A4: Focus States
- Visible focus ring: 2px solid accent color
- Apply to: all buttons, inputs, links
- No removing native focus outlines
- High contrast required (4.5:1)
```

### 3.5 Component Rules

```
Rule CO1: Button Component
- Border: 3px solid (neon accent)
- Background: transparent or #121212
- Hover: scale-[1.02] + glow effect
- Text: #FFFFFF, weight 700
- Minimum size: 44x44px (touch target)
- Disabled: opacity-50, cursor-not-allowed

Rule CO2: Input Component
- Border: 2px solid #FFFFFF
- Background: #000000
- Text: #FFFFFF, weight 700
- Focus: border-color to accent
- Placeholder: opacity-60
- Error state: border-color #FF0000

Rule CO3: Card Component
- Border: 2px solid #121212 or accent
- Background: #000000 or #121212
- Padding: 16px minimum
- Shadow: minimal (0 0 12px rgba(255,255,255,0.1))
- No rounded corners

Rule CO4: Modal Component
- Overlay: rgba(0,0,0,0.8)
- Background: #000000
- Border: 3px solid accent
- Close button: accessible (4.5:1 contrast)
- Escape key: supported
```

### 3.6 Accessibility Rules

```
Rule AC1: Color Contrast (WCAG AAA)
✓ Text on #000000 with #FFFFFF: 21:1 (PASS)
✓ Text on #121212 with #FFFFFF: 19:1 (PASS)
✓ Neon green #00FF41 on black: 19.56:1 (PASS)
✓ Neon blue #00D9FF on black: 18.5:1 (PASS)
✗ Red #FF0000 on black: 5.3:1 (FAIL for small text)
   → Use red only for large elements (18pt+)

Rule AC2: Focus Management
- Tab order follows visual order
- Focus visible for all interactive elements
- Focus trapping in modals
- Skip navigation links provided

Rule AC3: Touch Targets
- Minimum: 44x44px (mobile)
- Desktop: minimum 32x32px
- Spacing: 8px minimum between targets
- Test: WCAG 2.1 Level AAA

Rule AC4: ARIA Labels
- Icon buttons: aria-label required
- Form inputs: label with for attribute
- Modals: role="dialog", aria-labelledby
- Loading states: aria-busy="true"
```

### 3.7 Performance Rules

```
Rule P1: CSS Optimization
- Use Tailwind CSS utility classes only
- No custom CSS unless necessary
- Purge unused styles in build
- Minify all production CSS

Rule P2: Image Optimization
- Format: WebP (primary), PNG (fallback)
- Compression: aggressive (quality 75-85%)
- Lazy loading: loading="lazy"
- Responsive: srcset for multiple sizes
- Max file size: 200KB per image

Rule P3: Font Optimization
- System fonts only (no custom fonts)
- Font-weight: 400, 700 only
- No variable fonts
- Preload critical fonts

Rule P4: OLED Power Saving
- Minimize bright content
- Render black (#000000) pixels for power
- Avoid full-screen white elements
- Test power consumption on real OLED devices
```

### 3.8 Movie Ticket Specific Rules

```
Rule M1: Seat Selection Interface
- Grid layout: no rounded corners
- Available seat: #121212 border, #00FF41 text on hover
- Selected seat: #00FF41 background, #000000 text
- Unavailable: opacity-30
- Hover: glow effect #00FF41

Rule M2: Showtime Cards
- Display: genre, language, duration, price
- Border: 2px, neon accent color
- CTA button: purple neon (#D946EF)
- Responsive: 1 per line (mobile), 2-3 (tablet), 4+ (desktop)

Rule M3: Booking Flow
- Step indicator: linear (left to right)
- Current step: neon accent border
- Completed step: #00FF41 check icon
- Progress bar: #00FF41 fill, #121212 background

Rule M4: Payment & QR Code
- QR code: white on black (#FFFFFF on #000000)
- Booking reference: monospace font, #00FF41
- Confirmation: neon green (#00FF41) check
- Error messages: red (#FF0000) with icon
```

---

## 4. Design System Variables (CSS Custom Properties)

```css
:root {
  /* Color Palette */
  --color-black: #000000;
  --color-grey-dark: #121212;
  --color-white: #FFFFFF;
  
  /* Neon Accents */
  --color-accent-green: #00FF41;
  --color-accent-blue: #00D9FF;
  --color-accent-purple: #D946EF;
  --color-accent-gold: #FFD700;
  --color-accent-red: #FF0000;
  
  /* Semantic Colors */
  --color-success: var(--color-accent-green);
  --color-info: var(--color-accent-blue);
  --color-warning: var(--color-accent-gold);
  --color-error: var(--color-accent-red);
  --color-primary: var(--color-accent-purple);
  
  /* Backgrounds */
  --bg-primary: var(--color-black);
  --bg-secondary: var(--color-grey-dark);
  --bg-tertiary: #1A1A1A;
  
  /* Text Colors */
  --text-primary: var(--color-white);
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-tertiary: rgba(255, 255, 255, 0.6);
  --text-code: var(--color-accent-green);
  
  /* Borders */
  --border-width-thin: 2px;
  --border-width-medium: 3px;
  --border-width-thick: 4px;
  --border-color-light: var(--color-white);
  --border-color-muted: rgba(255, 255, 255, 0.2);
  
  /* Spacing (8px grid) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  
  /* Typography */
  --font-primary: system-ui, -apple-system, sans-serif;
  --font-code: 'Courier New', monospace;
  --font-weight-bold: 700;
  
  /* Effects */
  --glow-soft: 0 0 8px rgba(0, 255, 65, 0.3);
  --glow-medium: 0 0 16px rgba(0, 255, 65, 0.5);
  --glow-strong: 0 0 24px rgba(0, 255, 65, 0.7);
  
  /* Transitions */
  --transition-none: none;
  --transition-instant: 0s;
  
  /* Z-Index Scale */
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-modal: 30;
  --z-popover: 25;
  --z-tooltip: 35;
  --z-notification: 40;
}
```

---

## 5. Component Library Specifications

### 5.1 Core Components (shadcn/ui base)

| Component | Styling | State | Notes |
|-----------|---------|-------|-------|
| Button | Purple border 3px, neon glow on hover | Active, disabled, loading | Touch target 44x44px min |
| Input | White border 2px, accent on focus | Focus, error, disabled | Supports validation states |
| Select | Same as input, blue neon on open | Open, closed, disabled | Dropdowns accessible |
| Card | Dark grey bg, white border 2px | Default, interactive | No shadows, borders only |
| Modal | Black bg, accent border 3px | Open, closed, loading | Escape key support |
| Tabs | Bottom border accent | Active, inactive | Clean line indicator |
| Alert | Colored left border 4px, bg #121212 | Success, info, warning, error | Icons with text labels |
| Form | Label above input, error message red | Valid, invalid | Clear validation feedback |
| Checkbox | Border 2px, green check on select | Checked, unchecked | Keyboard accessible |
| Radio | Border 2px, filled circle on select | Checked, unchecked | Keyboard accessible |

### 5.2 Custom Components for Movie Ticket System

```
SeatGrid
├── SeatRow (horizontal flex)
├── SeatCell
│   ├── Available: grey border, interactive
│   ├── Selected: green background, white text
│   └── Unavailable: opacity 30%, disabled
└── Legends (color key)

BookingFlow
├── StepIndicator (linear, numbered)
├── StepContent (current step only)
└── ActionButtons (prev, next, confirm)

MovieCard
├── Poster (WebP image)
├── Title (white text 20px bold)
├── Metadata (genre, language, duration)
├── Rating (stars with green accent)
└── CTAButton (purple neon)

ShowtimeGrid
├── ShowtimeCard (repeating)
│   ├── Time display (monospace)
│   ├── Language badge
│   ├── Available seats count
│   └── Book button (blue neon)
└── Responsive layout

ChatInterface
├── MessageList (scrollable)
├── Message (left=AI, right=user)
├── InputArea (bottom fixed)
└── SendButton (interactive purple)

VoiceInterface
├── RecordButton (pulsing green)
├── TranscriptionDisplay (monospace text)
├── ResponseAudio (play controls)
└── StatusIndicator (listening, processing, responding)
```

---

## 6. Implementation Priority & Task Boundaries

### 6.1 Phase 1: Foundation (Days 1-3)
**Boundary**: Design system setup and Tailwind configuration

- [ ] Create Tailwind config with custom theme
- [ ] Define CSS custom properties
- [ ] Create color palette documentation
- [ ] Test color contrast ratios
- [ ] Set up typography scales
- [ ] Create global styles reset

### 6.2 Phase 2: Core Components (Days 4-7)
**Boundary**: shadcn/ui components customization

- [ ] Button component (all variants)
- [ ] Input component (text, email, password)
- [ ] Card component (no shadow version)
- [ ] Modal/Dialog component
- [ ] Tabs component
- [ ] Form wrapper components

### 6.3 Phase 3: Custom Components (Days 8-12)
**Boundary**: Movie ticket specific components

- [ ] SeatGrid and Seat components
- [ ] MovieCard component
- [ ] ShowtimeGrid component
- [ ] BookingFlow component
- [ ] BookingConfirmation component
- [ ] QR Code display component

### 6.4 Phase 4: Pages (Days 13-20)
**Boundary**: Complete page layouts

- [ ] Authentication pages (login, register, OAuth)
- [ ] Home/Browse movies page
- [ ] Movie detail page
- [ ] Seat selection page
- [ ] Booking confirmation page
- [ ] User dashboard pages
- [ ] Admin dashboard pages

### 6.5 Phase 5: Features (Days 21-25)
**Boundary**: Interactive features and polish

- [ ] Real-time seat availability
- [ ] AI chat interface
- [ ] Voice interface (basic)
- [ ] Payment simulation
- [ ] Booking management
- [ ] Animations and micro-interactions

### 6.6 Phase 6: Optimization & Testing (Days 26-30)
**Boundary**: Performance, accessibility, QA

- [ ] Accessibility audit (WCAG AAA)
- [ ] Performance optimization
- [ ] Browser compatibility testing
- [ ] Mobile responsiveness testing
- [ ] Contrast ratio validation
- [ ] Production build optimization

---

## 7. Technology Stack Alignment

### Stack Integration

```
┌─────────────────────────────────────────────┐
│         Design System (This Document)       │
└────────────────┬────────────────────────────┘
                 │
        ┌────────┼────────┐
        │        │        │
    ┌───▼──┐ ┌──▼──┐ ┌──▼──┐
    │React │ │Type-│ │Tail- │
    │ 18   │ │Script│ │wind  │
    └──┬───┘ │     │ │CSS   │
       │ ADR │     │ │      │
       │ 005 └──┬──┘ └──┬───┘
       │        │      │
       │   ┌────┴──────┴────┐
       │   │ shadcn/ui      │
       │   │ (ADR-005 ref)  │
       │   └─────┬──────────┘
       │         │
       │    ┌────▼──────────┐
       └───▶│ Design Output │
            │ (Components)  │
            └───────────────┘
```

**Key Alignments:**
- **ADR-005 (React)**: Component-based architecture
- **ADR-006 (TypeScript)**: Type-safe component props
- **ADR-009 (Zustand + React Query)**: State management integration
- **Tailwind CSS**: Utility-first styling (as specified in ADRs)
- **shadcn/ui**: Customizable component base

---

## 8. Accessibility Compliance Checklist

### WCAG 2.1 Level AAA Compliance

- [ ] All text has 7:1+ contrast ratio (tested with WebAIM)
- [ ] Interactive elements 44x44px minimum (mobile)
- [ ] All buttons have aria-label if text not visible
- [ ] Form inputs have associated labels
- [ ] Modals have focus trapping
- [ ] Color not sole indicator (use icons + text)
- [ ] Keyboard navigation fully functional
- [ ] Screen reader compatible (tested with NVDA/JAWS)
- [ ] Focus states visible and distinct
- [ ] No motion parallax or auto-playing audio
- [ ] Reduced motion preferences respected
- [ ] Language specified in HTML lang attribute
- [ ] Page title descriptive
- [ ] Error messages accessible and helpful
- [ ] Alternative text for all meaningful images

### OLED Specific Considerations

- [ ] No full-screen white content
- [ ] Minimize bright pixels for power efficiency
- [ ] Test on real OLED devices (if available)
- [ ] Monitor power consumption
- [ ] Use pure black (#000000) for backgrounds
- [ ] Document pixel-ratio impact

---

## 9. Quality Assurance Criteria

### Design Quality

- [ ] All components follow zero border-radius rule
- [ ] All text uses system fonts or monospace
- [ ] No soft shadows (only borders)
- [ ] No smooth transitions (none or 0s)
- [ ] All accents are vibrant neon colors
- [ ] Consistent spacing (8px grid)
- [ ] No rounded corners anywhere

### Performance Metrics

- [ ] Page load: < 3 seconds (3G)
- [ ] Time to interactive: < 4 seconds
- [ ] Largest Contentful Paint: < 2.5s
- [ ] Cumulative Layout Shift: < 0.1
- [ ] CSS file size: < 100KB (gzipped)

### Browser Support

- [ ] Chrome/Edge 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Mobile browsers (iOS 14+, Android 10+)

---

## 10. Design Token Migration Path

### Step 1: Establish Foundation
```css
/* Global CSS Variables */
:root {
  --color-primary: #000000;
  --color-accent: #D946EF;
  /* ... etc */
}
```

### Step 2: Tailwind Configuration
```js
// tailwind.config.ts
export default {
  theme: {
    colors: {
      black: '#000000',
      accent: '#D946EF',
      // ... etc
    },
    /* ... */
  },
}
```

### Step 3: Component Mapping
```tsx
// components/Button.tsx
<button className="
  border-[3px] border-purple-500
  bg-black hover:bg-grey-dark
  text-white font-bold
  h-[44px] px-6
  transition-none
">
  {children}
</button>
```

---

## 11. Design Review Checklist

### Pre-Development Review

- [ ] All team members reviewed design system
- [ ] Accessibility requirements understood
- [ ] Color palette approved
- [ ] Component specifications clear
- [ ] Task boundaries defined
- [ ] Development timeline confirmed

### During Development Review

- [ ] Components match specifications
- [ ] Contrast ratios verified
- [ ] Responsive behavior tested
- [ ] Keyboard navigation functional
- [ ] Performance metrics on track
- [ ] No rounded corners introduced

### Pre-Launch Review

- [ ] Full WCAG AAA audit passed
- [ ] All browsers tested
- [ ] Mobile responsiveness verified
- [ ] Performance targets met
- [ ] Accessibility tools passing
- [ ] User testing completed

---

## 12. Resources & References

### Design Tools
- Figma (design mockups - optional)
- WebAIM Contrast Checker (color validation)
- WAVE (accessibility testing)
- Lighthouse (performance auditing)

### Documentation
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Accessibility](https://material.io/design/usability/accessibility.html)

### Related ADRs
- ADR-005: Frontend Framework Selection (React)
- ADR-006: Frontend Language Selection (TypeScript)
- ADR-009: State Management Solution (Zustand + React Query)

---

## Appendix A: Design System Approval

| Role | Name | Approval | Date |
|------|------|----------|------|
| Design Lead | [Name] | [ ] | [Date] |
| Frontend Lead | [Name] | [ ] | [Date] |
| Product Manager | [Name] | [ ] | [Date] |
| QA Lead | [Name] | [ ] | [Date] |

---

**Document End**
