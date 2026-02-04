# Movie Ticket Booking - Payment Flow Test Script
# This script tests the complete booking and payment flow

$BASE_URL = "http://127.0.0.1:8000"

Write-Host "🎬 Movie Ticket Booking - Payment Flow Test" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Register Theater Owner
Write-Host "1. Registering Theater Owner..." -ForegroundColor Yellow
try {
    $ownerResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body (@{
            email = "owner@example.com"
            password = "ownerpassword"
            full_name = "Cineplex Owner"
            role = "owner"
        } | ConvertTo-Json)
    Write-Host "[OK] Owner registered successfully" -ForegroundColor Green
} catch {
    Write-Host "[INFO] Owner may already exist" -ForegroundColor Gray
}

# Step 2: Login as Owner
Write-Host "2️⃣  Logging in as Owner..." -ForegroundColor Yellow
$ownerToken = (Invoke-RestMethod -Uri "$BASE_URL/auth/token" `
    -Method POST `
    -ContentType "application/x-www-form-urlencoded" `
    -Body "username=owner@example.com&password=ownerpassword").access_token
Write-Host "✓ Owner logged in successfully" -ForegroundColor Green
Write-Host "   Token: $ownerToken" -ForegroundColor Gray
Write-Host ""

# Step 3: Create Theater with Screens
Write-Host "3️⃣  Creating Theater with Screen..." -ForegroundColor Yellow
$theater = Invoke-RestMethod -Uri "$BASE_URL/theaters/" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $ownerToken" } `
    -Body (@{
        name = "Cineplex Downtown"
        city = "Metropolis"
        address = "123 Main Street"
        screens = @(
            @{
                name = "Screen 1"
                total_seats = 50
            }
        )
    } | ConvertTo-Json -Depth 10)

Write-Host "✓ Theater created: $($theater.name)" -ForegroundColor Green
Write-Host "   Theater ID: $($theater.id)" -ForegroundColor Gray
Write-Host "   Screen ID: $($theater.screens[0].id)" -ForegroundColor Gray
Write-Host ""

# Step 4: Add Movie
Write-Host "4️⃣  Adding Movie..." -ForegroundColor Yellow
$movie = Invoke-RestMethod -Uri "$BASE_URL/movies/" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $ownerToken" } `
    -Body (@{
        title = "The Galactic Voyager"
        description = "An epic journey across the stars with stunning visuals and a gripping storyline."
        release_date = "2026-02-15"
        genre = "sci_fi"
        language = "english"
        director = "Jane Doe"
        duration_minutes = 148
        rating = "pg_13"
    } | ConvertTo-Json)

Write-Host "✓ Movie added: $($movie.title)" -ForegroundColor Green
Write-Host "   Movie ID: $($movie.id)" -ForegroundColor Gray
Write-Host ""

# Step 5: Create Showtime
Write-Host "5️⃣  Creating Showtime..." -ForegroundColor Yellow
$showtime = Invoke-RestMethod -Uri "$BASE_URL/showtimes/" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $ownerToken" } `
    -Body (@{
        movie_id = $movie.id
        screen_id = $theater.screens[0].id
        start_time = "2026-02-20T19:00:00"
        price = 15.50
    } | ConvertTo-Json)

Write-Host "✓ Showtime created" -ForegroundColor Green
Write-Host "   Showtime ID: $($showtime.id)" -ForegroundColor Gray
Write-Host "   Price: ₹$($showtime.price)" -ForegroundColor Gray
Write-Host ""

# Step 6: Register Customer
Write-Host "6️⃣  Registering Customer..." -ForegroundColor Yellow
try {
    $customerResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body (@{
            email = "customer@example.com"
            password = "customerpassword"
            full_name = "John Doe"
            role = "customer"
        } | ConvertTo-Json)
    Write-Host "✓ Customer registered successfully" -ForegroundColor Green
} catch {
    Write-Host "ℹ Customer may already exist" -ForegroundColor Gray
}

# Step 7: Login as Customer
Write-Host "7️⃣  Logging in as Customer..." -ForegroundColor Yellow
$customerToken = (Invoke-RestMethod -Uri "$BASE_URL/auth/token" `
    -Method POST `
    -ContentType "application/x-www-form-urlencoded" `
    -Body "username=customer@example.com&password=customerpassword").access_token
Write-Host "✓ Customer logged in successfully" -ForegroundColor Green
Write-Host ""

# Step 8: Check Available Seats
Write-Host "8️⃣  Checking Available Seats..." -ForegroundColor Yellow
$availableSeats = Invoke-RestMethod -Uri "$BASE_URL/showtimes/$($showtime.id)/availability" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $customerToken" }
Write-Host "✓ Available seats: $($availableSeats.Count)" -ForegroundColor Green
Write-Host "   First 5 seats: $($availableSeats[0..4] | ForEach-Object { "$($_.row)$($_.number)" } | Join-String -Separator ', ')" -ForegroundColor Gray
Write-Host ""

# Step 9: Create Booking
Write-Host "9️⃣  Creating Booking for seats 23, 24..." -ForegroundColor Yellow
$booking = Invoke-RestMethod -Uri "$BASE_URL/bookings/" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $customerToken" } `
    -Body (@{
        showtime_id = $showtime.id
        seat_ids = @(23, 24)
    } | ConvertTo-Json)

Write-Host "✓ Booking created successfully!" -ForegroundColor Green
Write-Host "   Booking ID: $($booking.id)" -ForegroundColor Gray
Write-Host "   Reference: $($booking.booking_reference)" -ForegroundColor Cyan
Write-Host "   Status: $($booking.status)" -ForegroundColor Gray
Write-Host "   Amount: ₹$($booking.total_amount)" -ForegroundColor Green
Write-Host "   Expires: $($booking.expires_at)" -ForegroundColor Gray
Write-Host ""

# Step 10: Process Payment
Write-Host "🔟 Processing Payment..." -ForegroundColor Yellow
$payment = Invoke-RestMethod -Uri "$BASE_URL/bookings/$($booking.id)/pay" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $customerToken" } `
    -Body (@{
        booking_id = $booking.id
        payment_method = "card"
    } | ConvertTo-Json)

Write-Host "✓ Payment processed successfully!" -ForegroundColor Green
Write-Host "   Transaction ID: $($payment.transaction_id)" -ForegroundColor Cyan
Write-Host "   Status: $($payment.status)" -ForegroundColor Green
Write-Host "   Message: $($payment.message)" -ForegroundColor Gray
Write-Host ""

# Step 11: Verify Booking
Write-Host "1️⃣1️⃣  Verifying Booking..." -ForegroundColor Yellow
$confirmedBooking = Invoke-RestMethod -Uri "$BASE_URL/bookings/$($booking.id)" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $customerToken" }

Write-Host "✓ Booking verified!" -ForegroundColor Green
Write-Host "   Status: $($confirmedBooking.status)" -ForegroundColor Green
Write-Host "   Movie: $($confirmedBooking.movie_title)" -ForegroundColor Gray
Write-Host "   Theater: $($confirmedBooking.theater_name)" -ForegroundColor Gray
Write-Host "   Screen: $($confirmedBooking.screen_name)" -ForegroundColor Gray
Write-Host ""

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "✅ Complete Payment Flow Test Successful!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  • Theater: $($theater.name)" -ForegroundColor White
Write-Host "  • Movie: $($movie.title)" -ForegroundColor White
Write-Host "  • Showtime: Feb 20, 2026 at 7:00 PM" -ForegroundColor White
Write-Host "  • Booking Reference: $($booking.booking_reference)" -ForegroundColor Cyan
Write-Host "  • Transaction ID: $($payment.transaction_id)" -ForegroundColor Cyan
Write-Host "  • Amount Paid: ₹$($booking.total_amount)" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 View API Documentation: http://127.0.0.1:8000/docs" -ForegroundColor Magenta
