# Accessibility & WCAG AAA Compliance Guide
## Movie Ticket Management System - OLED Dark Interface

**Document Version**: 1.0  
**Date**: 2026-01-29  
**Compliance Level**: WCAG 2.1 Level AAA  
**Target Users**: All users including those with disabilities

---

## Table of Contents
1. Overview & Standards
2. Color Contrast Requirements
3. Keyboard Navigation
4. Screen Reader Support
5. Focus Management
6. Form Accessibility
7. Visual Indicators
8. Testing & Audit Procedures
9. Accessibility Checklist
10. Tools & Resources

---

## 1. Overview & Standards

### 1.1 WCAG 2.1 Level AAA

This project aims for **WCAG 2.1 Level AAA** compliance - the highest accessibility standard.

**Key Requirements:**
- Color contrast: 7:1 for normal text
- Color contrast: 4.5:1 for large text
- All functionality available via keyboard
- Meaningful color + icon combinations
- Sufficient time for time-limited interactions
- No seizure-inducing content
- Text alternatives for non-text content

### 1.2 Legislation & Standards

- **WCAG 2.1** (Web Content Accessibility Guidelines)
- **ADA** (Americans with Disabilities Act)
- **GDPR** (General Data Protection Regulation)
- **AODA** (Accessibility for Ontarians with Disabilities Act)
- **EN 301 549** (European standard)

### 1.3 Disability Types Covered

```
Visual Impairments:
├─ Blindness → Screen reader support
├─ Low vision → High contrast, zoom support
├─ Color blindness → Non-color-dependent info
└─ Dyslexia → Readable fonts, clear layout

Hearing Impairments:
├─ Deafness → Captions, transcripts
└─ Hard of hearing → Visual alerts

Motor Impairments:
├─ Paralysis → Keyboard only
├─ Tremor → Large touch targets
└─ Inability to use mouse → Keyboard navigation

Cognitive/Neurological:
├─ Dyslexia → Simple language
├─ ADHD → Clear focus
├─ Autism → Predictable UI
└─ Epilepsy → No seizure-inducing content
```

---

## 2. Color Contrast Requirements

### 2.1 Contrast Ratios for WCAG AAA

```
Normal Text (< 18pt):
├─ WCAG AAA: 7:1 minimum
├─ WCAG AA: 4.5:1 minimum
└─ This design: 19:1+ (over AAA)

Large Text (≥ 18pt bold or ≥ 24pt):
├─ WCAG AAA: 7:1 minimum (same as normal)
├─ WCAG AA: 3:1 minimum
└─ This design: 19:1+ (over AAA)

Graphical Objects & UI Components:
├─ WCAG AAA: 7:1 minimum
├─ WCAG AA: 3:1 minimum
└─ This design: 7:1+ (AAA level)
```

### 2.2 Tested Color Combinations

| Foreground | Background | Ratio | Grade | Notes |
|-----------|-----------|-------|-------|-------|
| #FFFFFF | #000000 | 21:1 | AAA+ | Primary text ✓ |
| #00FF41 | #000000 | 19.56:1 | AAA+ | Neon green ✓ |
| #00D9FF | #000000 | 18.5:1 | AAA+ | Neon blue ✓ |
| #FFD700 | #000000 | 19.3:1 | AAA+ | Neon gold ✓ |
| #D946EF | #000000 | 8.2:1 | AAA | Purple neon ✓ |
| #FF0000 | #000000 | 5.3:1 | AA | Red only for large (18pt+) |
| #FFFFFF | #121212 | 19:1 | AAA+ | Secondary bg ✓ |
| #FFFFFF (80%) | #000000 | 16.8:1 | AAA+ | Secondary text ✓ |
| #FFFFFF (60%) | #000000 | 12.6:1 | AAA+ | Tertiary text ✓ |

**Testing Tool**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 2.3 Color Usage Rules

```
Rule 1: Never use color alone for information
✗ WRONG:
  Available = Green
  Taken = Red
  (Color-blind users can't distinguish)

✓ CORRECT:
  Available = Green ✓ + "Available" text + icon
  Taken = Red X + "Taken" text + icon
  (Multiple indicators)

Rule 2: Red text minimum size
✗ WRONG: Red error message at 12px
✓ CORRECT: Red error message at 18px+ OR secondary text

Rule 3: Test all combinations
✗ WRONG: Assume contrast looks good
✓ CORRECT: Test with WebAIM or axe DevTools

Rule 4: Gradient contrast
✗ WRONG: White text on gradient (changes contrast)
✓ CORRECT: Solid background with tested contrast
```

---

## 3. Keyboard Navigation

### 3.1 Required Keyboard Support

All users should be able to:
- Navigate using **Tab** key only
- Activate buttons with **Enter** key
- Close dialogs with **Escape** key
- Select checkboxes with **Space** key
- Navigate menus with arrow keys (↑ ↓ ← →)

### 3.2 Tab Order

**Rule**: Tab order must follow logical reading order (left to right, top to bottom).

```
Correct Tab Order:
1. Header (logo, nav menu)
2. Search box
3. Filter dropdowns
4. Movie cards (left to right)
5. Pagination buttons
6. Footer (links)

Incorrect Tab Order:
❌ Jumping around the page
❌ Skipping visible elements
❌ Tabbing to hidden elements
❌ Reverse visual order
```

### 3.3 Implementing Tab Order

```tsx
// ✓ CORRECT: Natural tab order (auto)
export function MovieGrid() {
  return (
    <div>
      <button>Filter</button>
      <div>
        {movies.map(movie => (
          <button key={movie.id}>{movie.title}</button>
        ))}
      </div>
    </div>
  );
}

// ✓ CORRECT: Manual tab order if needed
export function ComplexLayout() {
  return (
    <>
      <input tabIndex={0} />           {/* First */}
      <button tabIndex={1}>Search</button> {/* Second */}
      <button tabIndex={2}>Submit</button> {/* Third */}
    </>
  );
}

// ✗ WRONG: tabIndex > 0 creates confusion
<input tabIndex={3} />
<button tabIndex={1} />
<button tabIndex={2} />
// Tab order: button, button, input (not logical!)
```

### 3.4 Focus Visible Styling

Every interactive element MUST have a visible focus state:

```css
/* ALL interactive elements: buttons, links, inputs, etc */
button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 2px solid #00FF41;  /* Neon green */
  outline-offset: 2px;
  border-radius: 0px;
}

/* Use outline, NOT box-shadow for focus */
/* Outline is more reliable for accessibility */

/* Remove default browser outline only if replacing with custom */
button:focus {
  outline: none;                    /* Only if... */
  border: 2px solid #00FF41;       /* ...replacing with visible one */
}
```

### 3.5 Keyboard Shortcuts

```
Standard Shortcuts (implement if possible):
Ctrl/Cmd + K   → Open search/command palette
Ctrl/Cmd + /   → Open help
Escape         → Close modal/dialog
Enter          → Submit form / Activate button
Space          → Activate button / Toggle checkbox
Tab / Shift+Tab → Navigate forward / backward
Arrow Keys     → Menu navigation, slider adjustment
Alt + ?        → Show keyboard shortcuts help
```

---

## 4. Screen Reader Support

### 4.1 ARIA Attributes

Required ARIA attributes for common components:

```tsx
// Button (must have accessible name)
<button>Click Me</button>                    // ✓ Text is name
<button aria-label="Close modal">✕</button> // ✓ ARIA label
<button aria-label="Close" title="Close">
  ✕
</button>                                    // ✓ Both

// Form fields (must have labels)
<label htmlFor="email">Email</label>
<input id="email" type="email" />           // ✓ Correct

// Don't use placeholder as label
<input placeholder="Email" />                // ✗ WRONG

// Modal/Dialog
<div role="dialog" aria-labelledby="modal-title">
  <h2 id="modal-title">Confirm Booking</h2> // ✓ Connected
  <p>Are you sure?</p>
</div>

// Alert
<div role="alert" aria-live="polite">
  Booking confirmed!                        // ✓ Announced
</div>

// Loading state
<div aria-busy="true" aria-label="Loading">
  <span className="spinner"></span>
</div>

// Disabled button
<button disabled aria-disabled="true">
  Save                                      // ✓ Announced as disabled
</button>

// Image (must have alt text)
<img src="movie.jpg" alt="Movie Poster: Avatar 2" /> // ✓ Descriptive
<img src="logo.svg" alt="" />                        // ✓ Decorative

// Icon-only button
<button aria-label="Search">🔍</button>    // ✓ Has label

// List
<ul role="list">
  <li>Item 1</li>                           // ✓ Semantic HTML
  <li>Item 2</li>
</ul>
```

### 4.2 ARIA Live Regions

For dynamic content updates:

```tsx
// Polite region (announce after current speech)
<div aria-live="polite">
  {message}  {/* Updated messages announced */}
</div>

// Assertive (interrupt current speech - use sparingly)
<div aria-live="assertive">
  {error}    {/* Error messages announced immediately */}
</div>

// Loading state
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? "Loading..." : "Done!"}
</div>

// Lazy-loaded results
<div aria-live="polite" aria-label="Search results">
  {movies.map(movie => <MovieCard key={movie.id} {...movie} />)}
</div>
```

### 4.3 Testing with Screen Readers

**Free Screen Readers:**
- NVDA (Windows) - https://www.nvaccess.org/
- JAWS (Windows) - 40-minute trial
- VoiceOver (macOS/iOS) - Built-in
- TalkBack (Android) - Built-in

**Testing Checklist:**
- [ ] All buttons/links have accessible names
- [ ] Form labels associated with inputs
- [ ] Images have alt text
- [ ] Headings are hierarchical (h1 → h2 → h3)
- [ ] Lists use semantic HTML (ul, ol, li)
- [ ] Dynamic content updates announced
- [ ] Modal/dialog focus trapped
- [ ] Skip links present
- [ ] Language of page specified
- [ ] No screen reader-only content (unless necessary)

---

## 5. Focus Management

### 5.1 Initial Focus

When a page loads:
```tsx
// Option 1: Focus main content (recommended)
useEffect(() => {
  const mainContent = document.querySelector('main');
  mainContent?.focus({ preventScroll: true });
}, []);

// Option 2: Focus skip link
<a href="#main-content" className="skip-nav">
  Skip to main content
</a>

// Option 3: Focus h1
useEffect(() => {
  document.querySelector('h1')?.focus();
}, []);
```

### 5.2 Modal Focus Trap

When modal opens, focus must be trapped inside:

```tsx
// Use focus-trap library or implement manually
import FocusTrap from 'focus-trap-react';

export function Modal({ isOpen, onClose, children }) {
  return isOpen ? (
    <FocusTrap>
      <div role="dialog" aria-modal="true">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </FocusTrap>
  ) : null;
}

// Manual implementation
useEffect(() => {
  if (!isOpen) return;

  const dialog = dialogRef.current;
  const focusableElements = dialog?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements?.[0];
  const lastElement = focusableElements?.[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        (lastElement as HTMLElement)?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        (firstElement as HTMLElement)?.focus();
      }
    }
  };

  dialog?.addEventListener('keydown', handleKeyDown);
  (firstElement as HTMLElement)?.focus();

  return () => {
    dialog?.removeEventListener('keydown', handleKeyDown);
  };
}, [isOpen]);
```

### 5.3 Focus on Navigation

When user navigates to new page:

```tsx
useEffect(() => {
  // Scroll to top
  window.scrollTo(0, 0);
  
  // Focus main heading
  const mainHeading = document.querySelector('h1');
  mainHeading?.focus({ preventScroll: true });
  
  // Or use skip link focus
}, [location.pathname]); // When route changes
```

---

## 6. Form Accessibility

### 6.1 Form Structure

```tsx
// ✓ CORRECT: Proper label association
<div className="form-group">
  <label htmlFor="email">Email Address</label>
  <input
    id="email"
    type="email"
    placeholder="user@example.com"
    required
    aria-required="true"
    aria-describedby="email-hint"
  />
  <small id="email-hint">We'll never share your email.</small>
</div>

// ✗ WRONG: No label
<input type="email" placeholder="Email" />

// ✗ WRONG: Placeholder as label
<input type="email" placeholder="Email Address" />

// ✗ WRONG: Label not associated
<label>Email</label>
<input type="email" />
```

### 6.2 Error Messages

```tsx
// ✓ CORRECT: Associated with input, clear message
<div className="form-group">
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    aria-invalid={!!error}
    aria-describedby={error ? "password-error" : undefined}
  />
  {error && (
    <div id="password-error" className="error" role="alert">
      ✕ Password must be at least 8 characters
    </div>
  )}
</div>

// ✗ WRONG: Message not connected
<input type="password" />
<span style={{ color: 'red' }}>Invalid password</span>

// ✗ WRONG: No icon/text separation
<span style={{ color: 'red' }}>✕</span>  {/* Color-blind can't see */}
```

### 6.3 Required Fields

```tsx
// ✓ CORRECT: Multiple indicators
<label htmlFor="name">
  Full Name <span aria-label="required">*</span>
</label>
<input
  id="name"
  required
  aria-required="true"
  aria-describedby="name-hint"
/>
<small id="name-hint">Required field, marked with *</small>

// ✗ WRONG: Only visual indicator
<label>Full Name <span style={{ color: 'red' }}>*</span></label>
```

---

## 7. Visual Indicators

### 7.1 Icon + Text Pattern

Never use icons or colors alone:

```tsx
// ✓ CORRECT: Icon + text
<button>
  ✓ {/* Icon */}
  <span>Confirm</span> {/* Text */}
</button>

// ✓ CORRECT: Icon + aria-label
<button aria-label="Close modal">
  ✕
</button>

// ✗ WRONG: Icon only, no text or label
<button>✓</button>

// ✓ CORRECT: Color + icon + text
<div className="seat available">
  <div className="status">Available ✓</div>
</div>

// ✗ WRONG: Color only
<div style={{ backgroundColor: 'green' }}></div>
```

### 7.2 Disabled States

```tsx
// ✓ CORRECT: Visual + aria-disabled
<button
  disabled
  aria-disabled="true"
  style={{ opacity: 0.5 }}
>
  Submit
</button>

// ✗ WRONG: Only opacity change
<button style={{ opacity: 0.5 }}>Submit</button>
// User can't tell if it's disabled or just grayed out

// ✓ CORRECT: Multiple indicators
<button disabled aria-disabled="true">
  Submit
  {isDisabled && <span className="text-sm"> (Disabled)</span>}
</button>
```

---

## 8. Testing & Audit Procedures

### 8.1 Automated Testing

```bash
# Install axe DevTools (browser extension)
npm install @axe-core/react

# Install jest-axe for unit tests
npm install --save-dev jest-axe

# Run accessibility tests
npm test -- --coverage
```

### 8.2 Unit Test Example

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Button';

expect.extend(toHaveNoViolations);

test('Button component has no accessibility violations', async () => {
  const { container } = render(
    <Button onClick={() => {}}>Click Me</Button>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('Button has visible focus state', () => {
  render(<Button>Click Me</Button>);
  const button = screen.getByRole('button');
  button.focus();
  expect(button).toHaveFocus();
  expect(button).toHaveStyle('outline: 2px solid #00FF41');
});
```

### 8.3 Manual Testing Checklist

- [ ] Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- [ ] Screen reader testing (NVDA/JAWS/VoiceOver)
- [ ] Color contrast verification (WebAIM)
- [ ] Focus visibility on all interactive elements
- [ ] Form labels properly associated
- [ ] Error messages connected to inputs
- [ ] Images have alt text
- [ ] Heading hierarchy (h1 → h2 → h3)
- [ ] List semantics (ul, ol, li)
- [ ] Modal/dialog focus trapping
- [ ] Link text is descriptive
- [ ] Page title is descriptive
- [ ] Language specified in HTML
- [ ] Reduced motion support
- [ ] Zoom to 200% works correctly

### 8.4 Audit Tools

| Tool | Purpose | Type |
|------|---------|------|
| [axe DevTools](https://www.deque.com/axe/devtools/) | Automated scanning | Browser extension |
| [WAVE](https://wave.webaim.org/) | Visual feedback | Browser extension |
| [Lighthouse](https://developers.google.com/web/tools/lighthouse) | Page audit | Built into Chrome |
| [NVDA](https://www.nvaccess.org/) | Screen reader | Windows (free) |
| [WebAIM Contrast](https://webaim.org/resources/contrastchecker/) | Color contrast | Web tool |
| [Accessible Color Palette](https://accessible-colors.com/) | Color selection | Web tool |
| [Pa11y](https://pa11y.org/) | Automated testing | CLI/API |
| [Jest-axe](https://github.com/nickcolley/jest-axe) | Unit testing | NPM package |

---

## 9. Accessibility Checklist

### Phase 1: Design (Pre-Development)

- [ ] Color palette tested for WCAG AAA contrast
- [ ] No color-only information encoding
- [ ] Icons paired with text labels
- [ ] Touch targets minimum 44x44px defined
- [ ] Focus states designed (outline style, color)
- [ ] Form error patterns defined
- [ ] Keyboard navigation flow documented
- [ ] Heading hierarchy planned
- [ ] Motion/animation limited (no seizure risk)

### Phase 2: Development

#### Component Level
- [ ] All buttons have accessible names
- [ ] All links have descriptive text
- [ ] Form inputs have associated labels
- [ ] Images have alt text
- [ ] Color contrast 7:1 verified
- [ ] Focus states visible on all interactive elements
- [ ] Keyboard navigation supported
- [ ] ARIA attributes used appropriately
- [ ] Semantic HTML used (button not div[role=button])

#### Page Level
- [ ] Page title is descriptive
- [ ] h1 present and unique
- [ ] Heading hierarchy correct (no skipping levels)
- [ ] Lists use semantic HTML (ul, ol)
- [ ] Form structure accessible
- [ ] Modals have focus trapping
- [ ] Skip links present
- [ ] Language specified in HTML
- [ ] No keyboard traps

#### Dynamic Content
- [ ] Live regions for updates
- [ ] Loading states indicated
- [ ] Errors announced to screen readers
- [ ] Successful actions confirmed
- [ ] No content flashing > 3 per second

### Phase 3: Testing

- [ ] axe DevTools scan (no violations)
- [ ] jest-axe unit tests passing
- [ ] WAVE scan (no errors)
- [ ] Keyboard navigation testing
- [ ] Screen reader testing (NVDA + JAWS or equivalent)
- [ ] Zoom to 200% works
- [ ] Color contrast verified (all text, all states)
- [ ] Focus order tested
- [ ] Reduced motion respected
- [ ] Mobile accessibility tested (TalkBack/VoiceOver)

### Phase 4: Launch

- [ ] Accessibility statement on website
- [ ] Contact form for accessibility feedback
- [ ] PDF accessibility (if applicable)
- [ ] Video captions (if applicable)
- [ ] Audio transcripts (if applicable)
- [ ] Ongoing monitoring/audit scheduled
- [ ] Accessibility training for team
- [ ] Accessible updates process defined

---

## 10. Resources & References

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Articles](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [The A11Y Project](https://www.a11yproject.com/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [jest-axe](https://github.com/nickcolley/jest-axe)
- [Pa11y](https://pa11y.org/)

### Learning Resources
- [Web Accessibility by Google](https://www.udacity.com/course/web-accessibility--ud891)
- [Accessibility Fundamentals](https://www.coursera.org/learn/accessibility)
- [Inclusive Components](https://inclusive-components.design/)
- [A11Y Coffee](https://a11y.coffee/)

### Organizations
- [W3C WAI](https://www.w3.org/WAI/)
- [The A11Y Project](https://www.a11yproject.com/)
- [Deque Systems](https://www.deque.com/)
- [WebAIM](https://webaim.org/)

---

## Quick Reference: WCAG AAA Requirements

| Guideline | Level | Requirement |
|-----------|-------|------------|
| **Perceivable** | | Content must be perceivable |
| 1.1 Text Alternatives | A | All non-text content has text alternative |
| 1.4 Distinguishable | AAA | 7:1 contrast (text), 3:1 (non-text) |
| **Operable** | | Functionality available via keyboard |
| 2.1 Keyboard Accessible | A | All functionality keyboard accessible |
| 2.4 Navigable | AAA | Focus visible, meaningful link text |
| **Understandable** | | Content must be understandable |
| 3.2 Predictable | AAA | Consistent navigation and design |
| 3.3 Input Assistance | AAA | Error messages, confirmation prompts |
| **Robust** | | Compatible with assistive technologies |
| 4.1 Compatible | A | Valid HTML, ARIA properly used |

---

**Document End**

Last Updated: 2026-01-29  
Next Review: Pre-Launch Accessibility Audit  
Status: Ready for Development
