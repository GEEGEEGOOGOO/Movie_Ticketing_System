# Mock Payment Gateway - Testing Guide

## ✅ What Was Implemented

### 1. **Frontend Payment Gateway** ([Payment.tsx](frontend/src/pages/Payment.tsx))

A complete mock payment gateway with:

#### 🎨 **4 Payment Methods**
- **💳 Credit/Debit Card** - Full card details form with validation
- **📱 UPI Payment** - UPI ID input with QR code placeholder
- **🏦 Net Banking** - Bank selection dropdown
- **👛 Digital Wallet** - Wallet provider selection

#### ⚡ **Features**
- **10-minute countdown timer** - Booking expires if payment not completed
- **Real-time payment processing animation** with progress bar
- **5-stage payment simulation**:
  1. Validating payment details
  2. Connecting to payment gateway  
  3. Authenticating transaction
  4. Processing payment
  5. Confirming booking

- **Security indicators**: SSL encryption, PCI DSS compliance badges
- **Order summary** with itemized breakdown
- **Input validation** and formatting (card number, expiry, CVV)

### 2. **Booking Confirmation Page** ([BookingConfirmation.tsx](frontend/src/pages/BookingConfirmation.tsx))

Enhanced confirmation page showing:
- ✅ Success animation
- 🎫 Booking reference number
- 💳 Payment details (transaction ID, method, status)
- 🎬 Complete booking information
- 📧 Email confirmation notice
- 🖨️ Print ticket option

### 3. **Backend Payment API** (Already implemented)

The backend has complete payment processing:
- `POST /bookings/{booking_id}/pay` - Process payment endpoint
- Simulated payment gateway (always succeeds)
- Transaction ID generation
- Payment status tracking (SUCCESS/FAILED/REFUNDED)
- Booking confirmation on successful payment

---

## 🚀 How to Test

### Option 1: Using Swagger UI (Recommended)

1. **Start the server** (if not running):
   ```powershell
   cd c:\Downloads\files\backend
   python -m uvicorn main:app --reload --port 8000
   ```

2. **Open Swagger UI**: http://127.0.0.1:8000/docs

3. **Follow this workflow**:

#### Step 1: Register Owner
- Endpoint: `POST /auth/register`
- Body:
  ```json
  {
    "email": "owner@cinema.com",
    "password": "owner123",
    "full_name": "Theater Owner",
    "role": "owner"
  }
  ```

#### Step 2: Login as Owner
- Endpoint: `POST /auth/token`
- Form data:
  - username: `owner@cinema.com`
  - password: `owner123`
- **Copy the `access_token`**
- Click "Authorize" button (top right) and paste token

#### Step 3: Create Theater
- Endpoint: `POST /theaters/`
- Body:
  ```json
  {
    "name": "Cineplex Downtown",
    "city": "Metropolis",
    "address": "123 Main Street",
    "screens": [
      {
        "name": "Screen 1",
        "total_seats": 50
      }
    ]
  }
  ```
- **Note the `screen_id`** from response

#### Step 4: Add Movie
- Endpoint: `POST /movies/`
- Body:
  ```json
  {
    "title": "The Galactic Voyager",
    "description": "Epic space adventure",
    "release_date": "2026-02-15",
    "genre": "sci_fi",
    "language": "english",
    "director": "Jane Doe",
    "duration_minutes": 148,
    "rating": "pg_13"
  }
  ```
- **Note the `movie_id`** from response

#### Step 5: Create Showtime
- Endpoint: `POST /showtimes/`
- Body:
  ```json
  {
    "movie_id": 1,
    "screen_id": 1,
    "start_time": "2026-02-20T19:00:00",
    "price": 15.50
  }
  ```
- **Note the `showtime_id`**

#### Step 6: Register Customer
- Logout from owner account (click Authorize → Logout)
- Endpoint: `POST /auth/register`
- Body:
  ```json
  {
    "email": "customer@email.com",
    "password": "customer123",
    "full_name": "John Doe",
    "role": "customer"
  }
  ```

#### Step 7: Login as Customer
- Endpoint: `POST /auth/token`
- Form data:
  - username: `customer@email.com`
  - password: `customer123`
- **Authorize with new token**

#### Step 8: Check Available Seats
- Endpoint: `GET /showtimes/{showtime_id}/availability`
- Use `showtime_id: 1`
- View all 50 available seats

#### Step 9: Create Booking
- Endpoint: `POST /bookings/`
- Body:
  ```json
  {
    "showtime_id": 1,
    "seat_ids": [23, 24]
  }
  ```
- **Note the `booking_id`** and `booking_reference`
- Status will be `PENDING`
- Booking expires in 10 minutes

#### Step 10: Process Payment (Mock Gateway!)
- Endpoint: `POST /bookings/{booking_id}/pay`
- Use `booking_id` from step 9
- Body:
  ```json
  {
    "booking_id": 1,
    "payment_method": "card"
  }
  ```
- Response shows:
  - `transaction_id`: Unique transaction reference
  - `status`: SUCCESS
  - Booking status changes to CONFIRMED

#### Step 11: Verify Booking
- Endpoint: `GET /bookings/{booking_id}`
- Status should now be `CONFIRMED`
- `expires_at` is cleared
- `payment` object contains transaction details

---

### Option 2: Using Frontend UI

1. **Start both servers**:
   
   **Backend**:
   ```powershell
   cd c:\Downloads\files\backend
   python -m uvicorn main:app --reload --port 8000
   ```

   **Frontend**:
   ```powershell
   cd c:\Downloads\files\frontend
   npm run dev
   ```

2. **Navigate through the app**:
   - Register/Login as customer
   - Browse movies
   - Select showtime
   - Choose seats
   - **Go to Payment page** 🎉

3. **Test the payment gateway**:
   - Select any payment method (Card/UPI/NetBanking/Wallet)
   - Fill in form (any values work - it's mocked!)
   - Click "Pay" button
   - Watch the 5-stage processing animation
   - See booking confirmation with transaction details

---

## 🎯 Payment Gateway UI Features to Test

### Timer
- ⏱️ Notice the countdown timer (10:00 → 0:00)
- Timer turns red when < 2 minutes remaining
- Booking expires if timer reaches 0

### Payment Methods
#### Card Payment
- Enter card number (auto-formats with spaces)
- Enter expiry date (auto-formats MM/YY)
- Enter CVV (3 digits, password masked)
- See accepted card logos

#### UPI Payment
- Enter UPI ID (e.g., user@upi)
- View QR code placeholder
- Mobile-friendly design

#### Net Banking
- Select from major banks (HDFC, ICICI, SBI, Axis, Kotak, etc.)
- Bank redirect simulation

#### Wallet
- Choose wallet (Paytm, PhonePe, Google Pay, etc.)
- One-click payment flow

### Processing Animation
- Watch 5-stage progress:
  1. ✓ Validating payment details
  2. ✓ Connecting to gateway
  3. ✓ Authenticating transaction
  4. ✓ Processing payment
  5. ✓ Confirming booking
- Progress bar fills smoothly
- Spinner animation
- Security badges

### Confirmation Page
- ✅ Success animation
- Transaction ID displayed
- Booking reference
- Payment method icon
- Complete booking details
- Email sent notification
- Print ticket button

---

## 📝 Test Data You Can Use

### Credit Card Test Numbers
```
Card Number: 4111 1111 1111 1111 (Visa)
Card Number: 5500 0000 0000 0004 (Mastercard)
Expiry: 12/28
CVV: 123
Name: Any Name
```

### UPI IDs
```
test@paytm
demo@phonepe
user@googlepay
```

### Banks
- HDFC Bank
- ICICI Bank
- State Bank of India
- Axis Bank
- Kotak Mahindra Bank

### Wallets
- Paytm
- PhonePe
- Google Pay
- Amazon Pay

---

## 🔍 What Happens Behind the Scenes

### Frontend → Backend Flow:

1. **User selects payment method** and fills form
2. **Frontend validates** input (format, required fields)
3. **Countdown timer** ensures 10-minute booking window
4. **On submit**:
   - Shows processing animation
   - Simulates 5-stage payment (5 seconds total)
   - Calls `POST /bookings/{id}/pay` with payment method
5. **Backend processes**:
   - Creates Payment record
   - Generates transaction ID
   - Sets status to SUCCESS
   - Updates Booking status to CONFIRMED
   - Clears expiration time
6. **Frontend receives** confirmation:
   - Redirects to confirmation page
   - Shows transaction details
   - Displays booking reference

### Database Changes:
```sql
-- Before payment
Booking: status = PENDING, expires_at = 10 mins from now
Payment: NULL

-- After payment
Booking: status = CONFIRMED, expires_at = NULL
Payment: transaction_id = TXN..., status = SUCCESS, amount = total
```

---

## 🎨 UI/UX Features

- **Responsive design** - Works on mobile, tablet, desktop
- **Loading states** - Buttons disable during processing
- **Error handling** - Validation messages for invalid input
- **Security badges** - SSL, PCI DSS compliance indicators
- **Trust signals**:
  - No hidden charges
  - Instant confirmation
  - Secure payment
  - Easy cancellation
- **Accessibility** - Proper labels, focus states, keyboard navigation

---

## 💡 Key Implementation Details

### Frontend State Management:
- `paymentMethod`: Tracks selected method (card/upi/netbanking/wallet)
- `isProcessing`: Controls loading/disabled states
- `paymentStage`: Shows current processing step
- `progress`: 0-100% for progress bar
- `timeRemaining`: Countdown in seconds

### Validation:
- Card number: 16 digits, auto-formatted
- Expiry: MM/YY format, auto-formatted
- CVV: 3 digits, password masked
- UPI ID: Email-like format
- Required fields enforced

### Animation Timing:
```javascript
Stage 1: Validating     - 800ms
Stage 2: Connecting     - 1000ms
Stage 3: Authenticating - 1200ms
Stage 4: Processing     - 1500ms
Stage 5: Confirming     - 800ms
Total: ~5.3 seconds
```

---

## 🚨 Important Notes

1. **This is a MOCK payment gateway** - No real money is processed
2. **All payments succeed** - Backend simulates 100% success rate
3. **No actual bank/UPI integration** - For demonstration only
4. **Transaction IDs are generated** randomly (not real gateway IDs)
5. **Timer is enforced** - Bookings expire after 10 minutes

---

## 📚 Files Modified/Created

### Frontend:
- ✅ `frontend/src/pages/Payment.tsx` - Complete payment gateway UI
- ✅ `frontend/src/pages/BookingConfirmation.tsx` - Enhanced confirmation page

### Backend:
- ✅ Already had `POST /bookings/{id}/pay` endpoint
- ✅ Payment model with status tracking
- ✅ Transaction ID generation
- ✅ Booking confirmation logic

### Test Scripts:
- ✅ `backend/test_payment.ps1` - PowerShell test automation

---

## 🎬 Quick Demo Script

```powershell
# 1. Start backend
cd c:\Downloads\files\backend
python -m uvicorn main:app --reload --port 8000

# 2. Open Swagger UI
# Navigate to: http://127.0.0.1:8000/docs

# 3. Register owner → Login → Create theater/movie/showtime
# 4. Register customer → Login → Create booking
# 5. Call payment endpoint
# 6. See booking confirmed!
```

---

## ✨ Summary

You now have a **fully functional mock payment gateway** with:
- 4 payment methods (Card, UPI, NetBanking, Wallet)
- Real-time processing animations
- Security indicators and trust signals
- Countdown timer for booking expiration
- Transaction tracking
- Booking confirmation with payment details

**The entire payment flow is testable through both Swagger UI and the frontend!**

Enjoy testing! 🎉
