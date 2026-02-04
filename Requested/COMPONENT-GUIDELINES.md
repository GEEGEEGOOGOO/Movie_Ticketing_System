# Component Style Guidelines
## OLED-Optimized Dark Interface

**Document Version**: 1.0  
**Date**: 2026-01-29  
**Framework**: React 18 + TypeScript + Tailwind CSS + shadcn/ui

---

## 1. Button Components

### 1.1 Primary Button (CTA - Call-to-Action)

```tsx
// components/Button/ButtonPrimary.tsx
interface ButtonPrimaryProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  aria-label?: string;
}

export function ButtonPrimary({
  children,
  onClick,
  disabled = false,
  size = 'md',
  loading = false,
  'aria-label': ariaLabel,
}: ButtonPrimaryProps) {
  const sizeClasses = {
    sm: 'px-sm py-xs text-sm',
    md: 'px-md py-sm text-base',
    lg: 'px-lg py-md text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`
        ${sizeClasses[size]}
        min-h-touch min-w-touch
        bg-primary border-medium border-primary
        text-black font-bold
        cursor-pointer
        transition-none
        hover:shadow-glow-purple hover:scale-[1.02]
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-2 focus:outline-offset-2 focus:outline-neon-green
      `}
    >
      {loading ? (
        <span className="inline-flex items-center gap-sm">
          <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
```

### 1.2 Secondary Button (Alternative Action)

```tsx
// components/Button/ButtonSecondary.tsx
interface ButtonSecondaryProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'blue' | 'green' | 'gold';
  aria-label?: string;
}

export function ButtonSecondary({
  children,
  onClick,
  disabled = false,
  variant = 'blue',
  'aria-label': ariaLabel,
}: ButtonSecondaryProps) {
  const variantClasses = {
    blue: 'border-neon-blue text-neon-blue hover:shadow-glow-blue',
    green: 'border-neon-green text-neon-green hover:shadow-glow-soft',
    gold: 'border-neon-gold text-neon-gold hover:shadow-glow-gold',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        px-md py-sm min-h-touch min-w-touch
        bg-black border-medium
        ${variantClasses[variant]}
        font-bold
        cursor-pointer
        transition-none
        hover:scale-[1.02]
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-2 focus:outline-offset-2 focus:outline-neon-green
      `}
    >
      {children}
    </button>
  );
}
```

### 1.3 Icon Button

```tsx
// components/Button/IconButton.tsx
interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  aria-label: string; // REQUIRED for accessibility
}

export function IconButton({
  icon,
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        w-touch h-touch p-0
        flex items-center justify-center
        bg-black border-medium border-white
        text-white font-bold
        cursor-pointer
        transition-none
        hover:shadow-glow-soft hover:scale-[1.1]
        active:scale-[0.95]
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-2 focus:outline-offset-2 focus:outline-neon-green
      `}
    >
      {icon}
    </button>
  );
}
```

---

## 2. Input Components

### 2.1 Text Input

```tsx
// components/Input/TextInput.tsx
interface TextInputProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function TextInput({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-xs">
      <label htmlFor={id} className="text-white font-bold text-base">
        {label}
        {required && <span className="text-neon-red"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full px-md py-sm min-h-touch
          bg-black border-thin
          text-white font-bold
          placeholder-white-30
          transition-none
          focus:outline-none focus:border-primary focus:shadow-glow-purple
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-neon-red' : 'border-white'}
        `}
      />
      {error && (
        <span id={`${id}-error`} className="text-neon-red text-sm font-bold">
          {error}
        </span>
      )}
    </div>
  );
}
```

### 2.2 Select Dropdown

```tsx
// components/Input/Select.tsx
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  id: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function Select({
  label,
  id,
  options,
  value,
  onChange,
  error,
  disabled = false,
  placeholder,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-xs">
      <label htmlFor={id} className="text-white font-bold text-base">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={!!error}
        className={`
          w-full px-md py-sm min-h-touch
          bg-black border-thin
          text-white font-bold
          transition-none
          focus:outline-none focus:border-primary focus:shadow-glow-purple
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-neon-red' : 'border-white'}
          appearance-none cursor-pointer
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-neon-red text-sm font-bold">{error}</span>
      )}
    </div>
  );
}
```

---

## 3. Card Components

### 3.1 Basic Card

```tsx
// components/Card/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'interactive';
  onClick?: () => void;
}

export function Card({
  children,
  className,
  variant = 'default',
  onClick,
}: CardProps) {
  const variantClasses = {
    default: 'bg-black border-white',
    highlight: 'bg-black border-neon-green',
    interactive: 'bg-black border-white cursor-pointer hover:shadow-glow-soft hover:border-primary',
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${variantClasses[variant]}
        border-thin rounded-none
        p-md
        transition-none
        ${className}
      `}
    >
      {children}
    </div>
  );
}
```

---

## 4. Modal/Dialog Components

### 4.1 Modal Container

```tsx
// components/Modal/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div
      className="fixed inset-0 bg-overlay-80 z-modal flex items-center justify-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`
          ${sizeClasses[size]}
          w-full mx-md
          bg-black border-medium border-primary
          rounded-none
          max-h-[90vh] overflow-y-auto
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-md border-b-thin border-white">
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="
              w-touch h-touch p-0
              flex items-center justify-center
              text-white hover:text-primary
              focus:outline-2 focus:outline-neon-green
            "
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-md">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-md border-t-thin border-white flex gap-md justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 5. Form Components

### 5.1 Form Wrapper

```tsx
// components/Form/Form.tsx
interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  className?: string;
}

export function Form({ onSubmit, children, className }: FormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-md ${className}`}
      noValidate
    >
      {children}
    </form>
  );
}
```

### 5.2 Form Group (field wrapper)

```tsx
// components/Form/FormGroup.tsx
interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function FormGroup({ children, className }: FormGroupProps) {
  return <div className={`flex flex-col gap-xs ${className}`}>{children}</div>;
}
```

---

## 6. Alert/Notification Components

### 6.1 Alert Box

```tsx
// components/Alert/Alert.tsx
interface AlertProps {
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  onClose?: () => void;
}

export function Alert({ type, title, message, onClose }: AlertProps) {
  const typeClasses = {
    success: 'border-neon-green bg-black',
    info: 'border-neon-blue bg-black',
    warning: 'border-neon-gold bg-black',
    error: 'border-neon-red bg-black',
  };

  const iconClasses = {
    success: '✓',
    info: 'ℹ',
    warning: '⚠',
    error: '✕',
  };

  return (
    <div
      className={`${typeClasses[type]} border-l-thick p-md rounded-none`}
      role="alert"
    >
      <div className="flex items-start gap-md">
        <span className={`
          text-2xl font-bold flex-shrink-0
          ${type === 'success' && 'text-neon-green'}
          ${type === 'info' && 'text-neon-blue'}
          ${type === 'warning' && 'text-neon-gold'}
          ${type === 'error' && 'text-neon-red'}
        `}>
          {iconClasses[type]}
        </span>
        <div className="flex-grow">
          <h3 className="text-white font-bold text-base">{title}</h3>
          <p className="text-white-60 text-sm mt-xs">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close alert"
            className="text-white hover:text-primary focus:outline-2 focus:outline-neon-green"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## 7. Seat Grid Component (Movie Ticket Specific)

### 7.1 Seat Grid

```tsx
// components/Seat/SeatGrid.tsx
interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'unavailable';
}

interface SeatGridProps {
  seats: Seat[];
  onSeatClick: (seatId: string) => void;
  disabled?: boolean;
}

export function SeatGrid({ seats, onSeatClick, disabled = false }: SeatGridProps) {
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  return (
    <div className="flex flex-col gap-lg">
      {Object.entries(seatsByRow).map(([row, rowSeats]) => (
        <div key={row} className="flex gap-md items-center">
          <span className="w-8 text-white font-bold text-center">{row}</span>
          <div className="flex gap-md flex-wrap">
            {rowSeats.map((seat) => (
              <SeatCell
                key={seat.id}
                seat={seat}
                onClick={() => onSeatClick(seat.id)}
                disabled={disabled || seat.status === 'unavailable'}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// components/Seat/SeatCell.tsx
interface SeatCellProps {
  seat: Seat;
  onClick: () => void;
  disabled?: boolean;
}

function SeatCell({ seat, onClick, disabled }: SeatCellProps) {
  const statusClasses = {
    available: 'bg-black border-white text-white hover:border-neon-green hover:shadow-glow-soft',
    selected: 'bg-neon-green border-neon-green text-black',
    unavailable: 'bg-black border-white-20 text-white-30 opacity-50 cursor-not-allowed',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || seat.status === 'unavailable'}
      aria-label={`Seat ${seat.row}${seat.number} - ${seat.status}`}
      className={`
        w-12 h-12 p-0
        flex items-center justify-center
        border-medium rounded-none
        font-bold text-sm
        transition-none
        ${statusClasses[seat.status]}
        focus:outline-2 focus:outline-offset-2 focus:outline-neon-blue
      `}
    >
      {seat.number}
    </button>
  );
}
```

---

## 8. Text & Typography Classes

```tsx
// Typography utility classes
// Use with className

// Headings
'text-h1'  // 48px, font-bold
'text-h2'  // 36px, font-bold
'text-h3'  // 28px, font-bold
'text-h4'  // 24px, font-bold
'text-h5'  // 20px, font-bold
'text-h6'  // 16px, font-bold

// Body Text
'text-base'           // 16px
'text-sm'             // 14px
'text-xs'             // 12px
'text-white'          // Primary text color
'text-white-60'       // Secondary text color
'text-white-30'       // Tertiary text color

// Code
'font-mono text-neon-green'  // Code blocks

// Weight (always bold)
'font-bold'           // 700
'font-bolder'         // 800
'font-black'          // 900
```

---

## 9. Accessibility Guidelines

### 9.1 Focus States

All interactive elements MUST have visible focus states:

```tsx
// Focus ring on buttons, inputs, links
focus:outline-2 focus:outline-offset-2 focus:outline-neon-green

// Focus for modal/dialog
// Trap focus within modal with Tab key
```

### 9.2 ARIA Labels

```tsx
// Icon buttons MUST have aria-label
<IconButton icon={<SearchIcon />} aria-label="Search" />

// Form inputs MUST have associated labels
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Custom components MUST have role attributes
<div role="dialog" aria-labelledby="modal-title">
  <h2 id="modal-title">Modal Title</h2>
</div>
```

### 9.3 Color Contrast

- Text: 7:1 (WCAG AAA) ✓
- Interactive: 3:1 minimum (WCAG AA) ✓
- Test with: WebAIM Contrast Checker

---

## 10. Responsive Design

### 10.1 Breakpoints

```tsx
// Mobile First Approach
// Base styles: mobile (320px)
// sm: 640px (tablet)
// md: 1024px (desktop)
// lg: 1280px (large desktop)

// Usage in className
'hidden sm:block'     // Hide on mobile, show on tablet
'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
'text-sm sm:text-base md:text-lg'
```

### 10.2 Touch Targets

```tsx
// Mobile: 44x44px minimum
// Desktop: 32x32px minimum
'w-touch h-touch'  // 44px × 44px
```

---

## 11. Performance Considerations

- Use React.memo for pure components
- Use useCallback for event handlers
- Lazy load images with loading="lazy"
- Code split large features
- Minimize animations (none or 0s)

---

## 12. Testing Requirements

All components MUST have:
- Unit tests (Jest + React Testing Library)
- Accessibility tests (jest-axe)
- Visual regression tests (Chromatic)
- E2E tests for user flows (Cypress)

---

**Document End**
