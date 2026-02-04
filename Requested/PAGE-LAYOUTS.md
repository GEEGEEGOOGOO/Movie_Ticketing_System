# Page Layouts & Wireframes
## Movie Ticket Management System - OLED Dark Interface

**Document Version**: 1.0  
**Date**: 2026-01-29  
**Design System**: OLED-Optimized Dark (#000000 on black)

---

## Navigation Structure

```
ROOT
├── Public Pages
│   ├── Login (/login)
│   ├── Register (/register)
│   ├── OAuth Callback (/auth/callback)
│   └── Home (/browse or /)
├── Customer Pages
│   ├── Browse Movies (/movies)
│   ├── Movie Detail (/movies/:id)
│   ├── Seat Selection (/booking/seats/:showtimeId)
│   ├── Payment (/booking/payment)
│   ├── Confirmation (/booking/confirmation/:bookingId)
│   ├── Dashboard (/dashboard)
│   ├── Bookings (/dashboard/bookings)
│   ├── Chat (/chat)
│   └── Voice (/voice)
└── Theater Owner Pages
    ├── Dashboard (/owner/dashboard)
    ├── Theaters (/owner/theaters)
    ├── Screens (/owner/theaters/:id/screens)
    ├── Movies (/owner/movies)
    └── Analytics (/owner/analytics)
```

---

## 1. Login Page (/login)

### Wireframe
```
┌─────────────────────────────────────────┐
│                                         │
│           Movie Ticket System           │
│              [NEON LOGO]                │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Email                          │   │
│  │  [________________]             │   │
│  │                                 │   │
│  │  Password                       │   │
│  │  [________________]             │   │
│  │                                 │   │
│  │  [LOGIN BUTTON (Purple)]        │   │
│  │                                 │   │
│  │  OR                             │   │
│  │                                 │   │
│  │  [LOGIN WITH GOOGLE BUTTON]     │   │
│  │                                 │   │
│  │  Don't have account? Register   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Design Specs

```
Container:
- Max width: 400px
- Centered on screen
- Background: #000000 (pure black)
- Border: 2px solid #FFFFFF
- Padding: 32px

Form Fields:
- Background: #000000
- Border: 2px solid #FFFFFF
- Height: 44px (touch target)
- Font: system-ui, 700
- Focus: border → #D946EF (purple)
- Focus: glow effect

Buttons:
- Login: 3px purple border, purple bg
- Google: 3px white border, black bg
- Width: 100% of container
- Height: 44px

Text:
- Primary: #FFFFFF
- Labels: #FFFFFF, 700
- Help text: rgba(255,255,255,0.6)
- Links: #00D9FF
```

### Features

```
✓ Email/password form
✓ "Remember me" checkbox
✓ "Forgot password?" link
✓ Google OAuth button
✓ Register link
✓ Form validation (Zod)
✓ Error messages in red (#FF0000)
✓ Loading state on button
✓ Keyboard navigation
✓ Focus management
✓ Responsive (mobile to desktop)
```

---

## 2. Browse Movies Page (/movies)

### Wireframe
```
┌─────────────────────────────────────────┐
│  [HEADER]                               │
│  Logo          Search     [Profile Menu]│
├─────────────────────────────────────────┤
│                                         │
│  Filters:                               │
│  [Genre ▼] [Language ▼] [Date ▼]       │
│  [Clear Filters]                        │
│                                         │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │          │  │          │  │        ││
│  │ Movie 1  │  │ Movie 2  │  │Movie 3 ││
│  │ [Poster] │  │[Poster]  │  │[Poster]││
│  │ Title    │  │ Title    │  │ Title  ││
│  │ ★★★★☆   │  │ ★★★★★   │  │★★★★☆  ││
│  │[BOOK NOW]│  │[BOOK NOW]│  │[BOOK]  ││
│  └──────────┘  └──────────┘  └────────┘│
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Movie 4  │  │ Movie 5  │  │Movie 6 ││
│  │[Poster]  │  │[Poster]  │  │[Poster]││
│  │ Title    │  │ Title    │  │ Title  ││
│  │ ★★★★☆   │  │ ★★★★★   │  │★★★★☆  ││
│  │[BOOK NOW]│  │[BOOK NOW]│  │[BOOK]  ││
│  └──────────┘  └──────────┘  └────────┘│
│                                         │
│  [← PREV]  [Page 1 of 5]  [NEXT →]    │
│                                         │
└─────────────────────────────────────────┘
```

### Design Specs

```
Header:
- Height: 64px
- Background: #000000
- Border-bottom: 2px white
- Flex layout: space-between

Search Box:
- Width: 300px
- Border: 2px white
- Focus: border → purple
- Height: 44px
- Placeholder: "Search movies..."

Filter Section:
- Grid layout
- Dropdowns: 2px white border
- Selected: purple text/border

Movie Grid:
- Responsive: 1 col (mobile), 2 (tablet), 3+ (desktop)
- Gap: 24px
- Card width: calc(100% / columns)

Movie Card:
- Border: 2px white or neon-green (highlight)
- Background: #000000
- Poster: responsive image
- Title: white, 18px, bold
- Rating: neon-green stars
- Button: purple 3px border
```

### Features

```
✓ Grid layout (responsive)
✓ Genre/language filter dropdowns
✓ Search functionality
✓ Pagination
✓ Movie card hover glow effect
✓ Lazy load movie images
✓ Click movie → detail page
✓ Click button → showtimes
✓ Loading skeletons
✓ Empty state message
✓ Infinite scroll OR pagination
```

---

## 3. Movie Detail Page (/movies/:id)

### Wireframe
```
┌─────────────────────────────────────────┐
│  [HEADER]                               │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │     MOVIE POSTER (wide)          │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  Title: [Movie Name]                    │
│  Rating: ★★★★★ (4.5/5)                 │
│  Genre: Action, Thriller                │
│  Language: English, Hindi               │
│  Duration: 2h 30m                       │
│  Release: 2026-02-15                    │
│                                         │
│  Synopsis:                              │
│  Lorem ipsum dolor sit amet...          │
│  [Show More]                            │
│                                         │
│  Cast: Actor 1, Actor 2, Actor 3        │
│  Director: [Name]                       │
│                                         │
├─────────────────────────────────────────┤
│  Select Theater & Showtime:             │
│  [Theater ▼]  [Date ▼]                  │
│                                         │
│  Available Showtimes:                   │
│  ┌──────────┐  ┌──────────┐             │
│  │ 09:30 AM │  │ 01:00 PM │             │
│  │ 347 Free │  │ 125 Free │             │
│  │[SELECT]  │  │[SELECT]  │             │
│  └──────────┘  └──────────┘             │
│                                         │
│  ┌──────────┐  ┌──────────┐             │
│  │ 04:30 PM │  │ 07:00 PM │             │
│  │ 89 Free  │  │ 50 Free  │             │
│  │[SELECT]  │  │[SELECT]  │             │
│  └──────────┘  └──────────┘             │
│                                         │
│  [CHAT WITH AI] [VOICE BOOKING]        │
│                                         │
└─────────────────────────────────────────┘
```

### Design Specs

```
Hero Section:
- Poster image: responsive, max-height: 400px
- Background: black
- Overlay: gradient fade to black bottom

Info Section:
- Grid: 2 columns (mobile: 1)
- Left: Poster and key info
- Right: Details and description

Movie Info:
- Title: h2, 36px, white
- Rating: stars in neon-green
- Details: white, 60% opacity
- Synopsis: text, 16px, line-height 1.6

Showtime Cards:
- Border: 2px white
- Grid: 2 columns responsive
- Time: monospace font, 20px
- Available: neon-green text
- Button: purple 3px border

Theater/Date Selector:
- Dropdowns above showtimes
- 2px white border
- Focus: purple border
```

---

## 4. Seat Selection Page (/booking/seats/:showtimeId)

### Wireframe
```
┌─────────────────────────────────────────┐
│  Showtime: [Movie Name] - Feb 15, 2:00PM│
│  Theater: [Name] - Screen [X]           │
├─────────────────────────────────────────┤
│                                         │
│            [SCREEN]                     │
│    ▲ ▲ ▲ ▲ ▲ ▲ ▲ ▲ ▲ ▲                 │
│                                         │
│  A  □ □ □ □ □ □ □ □ □ □               │
│  B  □ □ □ ■ ■ □ □ □ □ □               │
│  C  □ □ ■ ■ ■ ■ □ □ □ □               │
│  D  □ ■ ■ ■ ■ ■ ■ □ □ □               │
│  E  ■ ■ ■ ■ ■ ■ ■ ■ □ □               │
│  F  ■ ■ ■ ■ ■ ■ ■ ■ ■ □               │
│                                         │
│  Legend:                                │
│  □ Available  ■ Taken  ◼ Selected      │
│                                         │
├─────────────────────────────────────────┤
│  Selected Seats: A5, A6, B3             │
│  Price per Seat: ₹250                   │
│  Total: ₹750                            │
│                                         │
│  [← BACK]  [PROCEED TO PAYMENT →]      │
│                                         │
└─────────────────────────────────────────┘
```

### Design Specs

```
Screen Indicator:
- Text: "SCREEN", 16px, centered
- Triangle symbols above

Seat Grid:
- Background: #000000
- Seat size: 40x40px with gap-md
- Available: white border, 2px
- Taken: grey, opacity 30%
- Selected: green bg (#00FF41), black text
- Hover (available): glow effect, purple border

Seat Label:
- Row: A-Z (left side)
- Number: 1-20 (top numbers)
- Font: monospace, bold

Summary Section:
- Background: #121212
- Border: 2px white
- Padding: 16px
- Grid: 2 columns

Buttons:
- Back: secondary (white border)
- Proceed: primary (purple)
- Both: min 44px height
```

### Features

```
✓ Interactive seat grid
✓ Show seat status (available/taken)
✓ Select/deselect seats
✓ Show selected seats list
✓ Calculate total price
✓ Show price per seat
✓ Prevent selecting taken seats
✓ Min/max seat selection
✓ Responsive seat size (mobile-friendly)
✓ Seat legends
✓ Summary on side (tablet+)
✓ Keyboard navigation
✓ Accessibility: seat descriptions
```

---

## 5. Payment Page (/booking/payment)

### Wireframe
```
┌─────────────────────────────────────────┐
│  Step 3 of 4: Payment                   │
│  [Step Progress Bar]                    │
├─────────────────────────────────────────┤
│                                         │
│  Booking Summary:                       │
│  ┌─────────────────────────────────┐   │
│  │ Movie: [Title]                  │   │
│  │ Date/Time: Feb 15, 2:00 PM      │   │
│  │ Theater: [Name] - Screen [X]    │   │
│  │ Seats: A5, A6, B3 (₹250 × 3)    │   │
│  │ Subtotal: ₹750                  │   │
│  │ GST (18%): ₹135                 │   │
│  │ ──────────────────────────────  │   │
│  │ TOTAL: ₹885                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Payment Method:                        │
│  ◉ Credit/Debit Card                    │
│  ○ UPI                                  │
│  ○ Net Banking                          │
│                                         │
│  Card Details:                          │
│  Card Number: [_ _ _ _ _ _ _ _ _ _ _ _]│
│  Exp: [_ _/_ _]    CVV: [_ _ _]        │
│  Name: [________________]               │
│                                         │
│  ☐ Save card for future use             │
│                                         │
│  [← BACK]  [CONFIRM PAYMENT →]         │
│                                         │
│  Terms: I agree to the Terms & Conditions
│                                         │
└─────────────────────────────────────────┘
```

### Design Specs

```
Step Progress:
- Visual indicator: step 1, 2, 3, 4
- Current: purple neon (#D946EF)
- Complete: green neon (#00FF41)
- Height: 4px

Summary Card:
- Background: #121212
- Border: 2px white
- Padding: 16px
- Monospace for prices

Payment Methods:
- Radio buttons (styled)
- Selected: green border/text
- Gap: 8px between options

Form Fields:
- Card: CC format mask
- Exp: MM/YY format
- CVV: 3-4 digits
- Name: text
- All: 2px white border

Buttons:
- Back: secondary
- Submit: primary purple
- Loading state: spinner + disabled
```

### Features

```
✓ Display booking summary
✓ Payment method selection
✓ Card form with validation
✓ Card format validation (Luhn)
✓ Error messages for invalid input
✓ Loading state during processing
✓ Success confirmation
✓ Error handling
✓ Responsive form layout
✓ Accessibility labels
✓ PCI compliance (no logging card details)
```

---

## 6. Booking Confirmation Page (/booking/confirmation/:bookingId)

### Wireframe
```
┌─────────────────────────────────────────┐
│                                         │
│  ✓ BOOKING CONFIRMED                    │
│                                         │
│  Reference: BK-2026021500001            │
│  │  ┌─────────────────┐               │
│  │  │   [QR CODE]     │               │
│  │  │   (Auto-saved)  │               │
│  │  └─────────────────┘               │
│                                         │
│  Details:                               │
│  Movie: [Title]                         │
│  Date/Time: Feb 15, 2:00 PM             │
│  Theater: [Name] - Screen 1             │
│  Seats: A5, A6, B3                      │
│  Total: ₹885                            │
│                                         │
│  Confirmation sent to: user@email.com   │
│                                         │
│  ☑ Reminder set for 30 min before       │
│                                         │
│  [DOWNLOAD TICKET] [VIEW BOOKING]      │
│  [GO TO HOME]                           │
│                                         │
│  Important: Please arrive 15 min early  │
│                                         │
└─────────────────────────────────────────┘
```

### Design Specs

```
Success State:
- Large green check: neon-green (#00FF41)
- Size: 64px+
- Title: h1, "BOOKING CONFIRMED"

QR Code:
- White on black
- Size: 200x200px minimum
- Border: 2px white

Reference Number:
- Monospace font
- Neon-green color
- Selectable (copyable)

Details Section:
- Two-column layout
- Label: white-60
- Value: white, bold

Buttons:
- Download: primary purple
- View Booking: secondary
- Home: secondary
- Size: responsive, min 44px

Status Banner:
- Green border (left 4px)
- Background: #121212
- Yellow border (reminder)
```

---

## 7. Chat Interface (/chat)

### Wireframe
```
┌─────────────────────────────────────────┐
│  Chat with AI Assistant                 │
│  ┌─────────────────────────────────┐   │
│  │ [Close]                         │   │
├──┴─────────────────────────────────┴──┤
│                                         │
│  AI: Hi! How can I help you today?     │
│      Looking for a movie?              │
│                                         │
│  User: What action movies are showing? │
│                                         │
│  AI: Here are action movies playing    │
│      tomorrow:                          │
│      1. Movie A - 2:00 PM, ₹250        │
│      2. Movie B - 5:00 PM, ₹250        │
│      Would you like to book any?       │
│                                         │
│  User: Book movie A, 2 tickets         │
│                                         │
│  AI: Great! Proceeding to booking...   │
│      [SELECT SEATS]                    │
│                                         │
├─────────────────────────────────────────┤
│  [Input] Send                           │
│  Your message...                        │
└─────────────────────────────────────────┘
```

### Design Specs

```
Container:
- Full screen or modal
- Background: #000000
- Header: 2px border-bottom

Message List:
- Scrollable area
- Padding: 16px
- Auto-scroll to bottom

Message Bubble (AI):
- Background: #121212
- Border: 2px white
- Text: white
- Max-width: 70%
- Left-aligned

Message Bubble (User):
- Background: #D946EF
- Border: none
- Text: black
- Max-width: 70%
- Right-aligned

Timestamp:
- Size: 12px
- Color: white-30
- Below bubble

Input Area:
- Position: sticky bottom
- Border-top: 2px white
- Flex: input + button

Send Button:
- Icon or text
- Purple primary color
- Size: 44px
- Disabled if empty
```

### Features

```
✓ Message history display
✓ Typing indicator ("AI is typing...")
✓ Auto-scroll to latest message
✓ Message timestamps
✓ Character limit validation
✓ Empty state on first load
✓ Error recovery
✓ Keyboard support (Enter to send)
✓ Clear chat history option
✓ Copy message to clipboard
✓ Link support in messages
```

---

## 8. Voice Interface (/voice)

### Wireframe
```
┌─────────────────────────────────────────┐
│         Voice Chat Assistant            │
│                                         │
│  Status: Ready to listen                │
│                                         │
│          ◯ ◯ ◯ ◯ ◯                      │
│        ◯         ◯                      │
│       ◯           ◯                     │
│      ◯             ◯                    │
│     ◯ (Microphone) ◯                    │
│      ◯             ◯                    │
│       ◯           ◯                     │
│        ◯         ◯                      │
│          ◯ ◯ ◯ ◯ ◯                      │
│                                         │
│  [  CLICK TO SPEAK  ]                   │
│   (or hold spacebar)                    │
│                                         │
│  Transcription:                         │
│  "Show me action movies in Hindi"       │
│                                         │
│  AI Response Playing...                 │
│  ▶︎ [=======     ] 0:05 / 0:12          │
│                                         │
│  Transcript:                            │
│  "Here are action movies in Hindi:      │
│   1. Movie A - 2:00 PM"                 │
│                                         │
│  [CLEAR] [SETTINGS] [HISTORY]           │
│                                         │
└─────────────────────────────────────────┘
```

### Design Specs

```
Microphone Visualization:
- Circular pulsing animation (if recording)
- Center: microphone icon
- Color: neon-green when active
- Opacity pulse animation

Record Button:
- Size: 100x100px
- Border: 4px neon-green (recording)
- Border: 4px white (idle)
- Text: bold, white
- Hover: scale 1.05

Transcription Area:
- Background: #121212
- Border: 2px white
- Padding: 12px
- Min-height: 44px
- Monospace font
- Text: white-70

Audio Player:
- Play button
- Progress bar (2px white/green)
- Time display (monospace)
- Volume control

Transcript Display:
- Background: #000000
- Border: left 2px neon-blue
- Padding: 12px
- Line-height: 1.6

Status Indicator:
- Text: white-60
- Updates: "Recording...", "Processing...", "Playing..."
```

---

## 9. Customer Dashboard (/dashboard)

### Wireframe
```
┌─────────────────────────────────────────┐
│  Hello, [User Name]!                    │
│  [Edit Profile]                         │
├─────────────────────────────────────────┤
│                                         │
│  ACTIVE BOOKINGS                        │
│  ┌──────────────────────────────────┐   │
│  │ Movie Name                       │   │
│  │ Feb 15 • 2:00 PM                 │   │
│  │ Theater: [Name] • Seats: A5, A6  │   │
│  │ Ref: BK-2026021500001            │   │
│  │ [VIEW TICKET] [CANCEL BOOKING]   │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ Movie Name 2                     │   │
│  │ Feb 18 • 7:00 PM                 │   │
│  │ Theater: [Name] • Seats: C1, C2  │   │
│  │ Ref: BK-2026021800002            │   │
│  │ [VIEW TICKET] [CANCEL BOOKING]   │   │
│  └──────────────────────────────────┘   │
│                                         │
│  BOOKING HISTORY                        │
│  ┌──────────────────────────────────┐   │
│  │ Past Booking 1 (Completed)       │   │
│  │ Feb 10 • 5:30 PM                 │   │
│  │ [REBOOK] [VIEW DETAILS]          │   │
│  └──────────────────────────────────┘   │
│                                         │
│  STATS:                                 │
│  Total Bookings: 12  | Spent: ₹5,400    │
│  Favorite Theater: [Name]               │
│                                         │
│  [BROWSE NEW MOVIES]                   │
│                                         │
└─────────────────────────────────────────┘
```

### Design Specs

```
Profile Section:
- Avatar: 80x80px, border 2px white
- Name: h2, white
- Edit button: secondary

Booking Cards (Active):
- Border: 2px neon-green (upcoming)
- Background: #121212
- Padding: 16px
- Grid: 2 columns (responsive)

Booking Cards (History):
- Border: 2px white-20 (past)
- Background: #121212
- Padding: 16px

Actions:
- View Ticket: secondary blue
- Cancel: secondary red
- Rebook: primary purple

Stats Section:
- Grid: 3 columns
- Border: 2px white-20
- Padding: 12px

Tabs (if many bookings):
- Underline style
- Active: green underline
- Text: white
```

---

## 10. Owner Dashboard (/owner/dashboard)

### Wireframe
```
┌─────────────────────────────────────────┐
│  Theater Owner Dashboard                │
│  [Theater: [Name] ▼]                    │
├─────────────────────────────────────────┤
│                                         │
│  ANALYTICS                              │
│  ┌──────────┐  ┌──────────┐             │
│  │Bookings  │  │Revenue   │             │
│  │  1,234   │  │₹2.5L     │             │
│  └──────────┘  └──────────┘             │
│  ┌──────────┐  ┌──────────┐             │
│  │Avg Occ.  │  │Ratings   │             │
│  │  78%     │  │ ★★★★★    │             │
│  └──────────┘  └──────────┘             │
│                                         │
│  OCCUPANCY CHART (Weekly)               │
│  │    ╱╲    ╱╲   ╱╲                     │
│  │╱╲╱  ╲╱╲╱  ╲╱╲╱                      │
│  │Mon Tue Wed Thu Fri Sat Sun          │
│                                         │
│  QUICK ACTIONS                          │
│  [+ ADD SHOWTIME] [MANAGE SCREENS]     │
│  [MANAGE SEATS]   [THEATER SETTINGS]   │
│                                         │
│  RECENT BOOKINGS (Today)                │
│  ┌──────────────────────────────────┐   │
│  │ Booking ID: BK-20260129001       │   │
│  │ Movie: [Title] • 14:00 • 12 seats│   │
│  │ Revenue: ₹3,000                  │   │
│  └──────────────────────────────────┘   │
│                                         │
│  [VIEW ALL BOOKINGS] [ANALYTICS]       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 11. Responsive Design Breakpoints

### Mobile (320px - 640px)
```
- Single column layout
- Full-width cards
- Stacked buttons
- Bottom navigation tabs
- Vertical form layout
- Touch targets: 44x44px minimum
- Larger fonts: body 16px minimum
```

### Tablet (641px - 1024px)
```
- 2 column layout
- Side-by-side cards
- Inline buttons
- Grid: 2x2
- Side navigation drawer
- Mixed form layout
```

### Desktop (1025px+)
```
- 3+ column layout
- Full-width optimized (max 1200px)
- Side-by-side everything
- Grid: 3x3 or more
- Top navigation
- Multi-column form

```

---

## 12. Spacing & Layout Grid

### Spacing Standards (8px Grid)

```
Component Spacing:
- xs (4px): Micro spacing, element gaps
- sm (8px): Small padding, tight gaps
- md (16px): Standard padding, content gaps
- lg (24px): Large padding, section gaps
- xl (32px): Extra large, page sections
- 2xl (48px): Huge gaps, page-level spacing

Container:
- Mobile: 12px (px-md)
- Tablet: 24px (px-lg)
- Desktop: 48px (px-2xl)
- Max-width: 1200px (desktop)
```

---

## 13. Color Usage by Page

| Page | Primary Accent | Secondary | Status |
|------|---|---|---|
| Login | Purple #D946EF | Blue #00D9FF | - |
| Browse | Green #00FF41 | Purple #D946EF | - |
| Detail | Green #00FF41 | Purple #D946EF | - |
| Seats | Green #00FF41 | Blue #00D9FF | Available/Selected |
| Payment | Purple #D946EF | Gold #FFD700 | - |
| Confirm | Green #00FF41 | - | Success |
| Chat | Green #00FF41 | Blue #00D9FF | Interaction |
| Voice | Green #00FF41 | Blue #00D9FF | Recording |
| Dashboard | Purple #D946EF | Green #00FF41 | Stats |
| Owner | Gold #FFD700 | Green #00FF41 | Revenue |

---

## 14. Animation & Transitions

### Allowed Animations

```
Hover Effects:
- scale(1.02) - slight enlarge
- shadow-glow - neon glow effect
- opacity change - fade in/out
- border color change

Loading States:
- Skeleton screens (dark grey)
- Spinner animation (1s full rotation)
- Pulse effect (opacity pulse)

Transitions:
- Duration: 0s (instant) or none
- No smooth transitions (per design)
- State changes: instant/immediate

Micro-interactions:
- Button press: scale(0.98) then back
- Checkbox: instant color change
- Radio: instant fill change
```

---

**Document End**

Last Updated: 2026-01-29
Status: Ready for Development
