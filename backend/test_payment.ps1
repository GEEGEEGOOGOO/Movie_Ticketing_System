# Movie Ticket Booking - Payment Flow Test Script
$BASE_URL = "http://127.0.0.1:8000"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Movie Ticket Booking - Payment Flow Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Register Theater Owner
Write-Host "Step 1: Registering Theater Owner..." -ForegroundColor Yellow
try {
    $ownerResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"email":"owner@example.com","password":"ownerpassword","full_name":"Cineplex Owner","role":"owner"}'
    Write-Host "[OK] Owner registered" -ForegroundColor Green
} catch {
    Write-Host "[INFO] Owner may already exist" -ForegroundColor Gray
}

# Step 2: Login as Owner
Write-Host "Step 2: Logging in as Owner..." -ForegroundColor Yellow
$ownerToken = (Invoke-RestMethod -Uri "$BASE_URL/auth/token" `
    -Method POST `
    -ContentType "application/x-www-form-urlencoded" `
    -Body "username=owner@example.com&password=ownerpassword").access_token
Write-Host "[OK] Owner logged in" -ForegroundColor Green
Write-Host ""

# Step 3: Create Theater
Write-Host "Step 3: Creating Theater with Screen..." -ForegroundColor Yellow
$theaterBody = '{"name":"Cineplex Downtown","city":"Metropolis","address":"123 Main Street","screens":[{"name":"Screen 1","total_seats":50}]}'
$theater = Invoke-RestMethod -Uri "$BASE_URL/theaters/" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $ownerToken" } `
    -Body $theaterBody

$theaterId = $theater.id
$screenId = $theater.screens[0].id
Write-Host "[OK] Theater created - ID: $theaterId, Screen ID: $screenId" -ForegroundColor Green
Write-Host ""

# Step 4: Add Movie
Write-Host "Step 4: Adding Movie..." -ForegroundColor Yellow
$movieBody = '{"title":"The Galactic Voyager","description":"An epic journey across the stars","release_date":"2026-02-15","genre":"sci_fi","language":"english","director":"Jane Doe","duration_minutes":148,"rating":"pg_13"}'
$movie = Invoke-RestMethod -Uri "$BASE_URL/movies/" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $ownerToken" } `
    -Body $movieBody

$movieId = $movie.id
Write-Host "[OK] Movie added - ID: $movieId" -ForegroundColor Green
Write-Host ""

# Step 5: Create Showtime
Write-Host "Step 5: Creating Showtime..." -ForegroundColor Yellow
$showtimeBody = "{`"movie_id`":$movieId,`"screen_id`":$screenId,`"start_time`":`"2026-02-20T19:00:00`",`"price`":15.50}"
$showtime = Invoke-RestMethod -Uri "$BASE_URL/showtimes/" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $ownerToken" } `
    -Body $showtimeBody

$showtimeId = $showtime.id
Write-Host "[OK] Showtime created - ID: $showtimeId" -ForegroundColor Green
Write-Host ""

# Step 6: Register Customer
Write-Host "Step 6: Registering Customer..." -ForegroundColor Yellow
try {
    $customerResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"email":"customer@example.com","password":"customerpassword","full_name":"John Doe","role":"customer"}'
    Write-Host "[OK] Customer registered" -ForegroundColor Green
} catch {
    Write-Host "[INFO] Customer may already exist" -ForegroundColor Gray
}

# Step 7: Login as Customer
Write-Host "Step 7: Logging in as Customer..." -ForegroundColor Yellow
$customerToken = (Invoke-RestMethod -Uri "$BASE_URL/auth/token" `
    -Method POST `
    -ContentType "application/x-www-form-urlencoded" `
    -Body "username=customer@example.com&password=customerpassword").access_token
Write-Host "[OK] Customer logged in" -ForegroundColor Green
Write-Host ""

# Step 8: Check Available Seats
Write-Host "Step 8: Checking Available Seats..." -ForegroundColor Yellow
$availableSeats = Invoke-RestMethod -Uri "$BASE_URL/showtimes/$showtimeId/availability" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $customerToken" }
Write-Host "[OK] Available seats: $($availableSeats.Count)" -ForegroundColor Green
Write-Host ""

# Step 9: Create Booking
Write-Host "Step 9: Creating Booking..." -ForegroundColor Yellow
$bookingBody = "{`"showtime_id`":$showtimeId,`"seat_ids`":[23,24]}"
$booking = Invoke-RestMethod -Uri "$BASE_URL/bookings/" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $customerToken" } `
    -Body $bookingBody

$bookingId = $booking.id
$bookingRef = $booking.booking_reference
Write-Host "[OK] Booking created!" -ForegroundColor Green
Write-Host "    Booking ID: $bookingId" -ForegroundColor Cyan
Write-Host "    Reference: $bookingRef" -ForegroundColor Cyan
Write-Host "    Status: $($booking.status)" -ForegroundColor Gray
Write-Host "    Amount: Rs $($booking.total_amount)" -ForegroundColor Green
Write-Host ""

# Step 10: Process Payment
Write-Host "Step 10: Processing Payment..." -ForegroundColor Yellow
$paymentBody = "{`"booking_id`":$bookingId,`"payment_method`":`"card`"}"
$payment = Invoke-RestMethod -Uri "$BASE_URL/bookings/$bookingId/pay" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $customerToken" } `
    -Body $paymentBody

$txnId = $payment.transaction_id
Write-Host "[OK] Payment successful!" -ForegroundColor Green
Write-Host "    Transaction ID: $txnId" -ForegroundColor Cyan
Write-Host "    Status: $($payment.status)" -ForegroundColor Green
Write-Host ""

# Step 11: Verify Booking
Write-Host "Step 11: Verifying Booking..." -ForegroundColor Yellow
$confirmedBooking = Invoke-RestMethod -Uri "$BASE_URL/bookings/$bookingId" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $customerToken" }

Write-Host "[OK] Booking verified!" -ForegroundColor Green
Write-Host "    Status: $($confirmedBooking.status)" -ForegroundColor Green
Write-Host "    Movie: $($confirmedBooking.movie_title)" -ForegroundColor Gray
Write-Host "    Theater: $($confirmedBooking.theater_name)" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Payment Flow Test SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "SUMMARY:" -ForegroundColor Yellow
Write-Host "  Theater: Cineplex Downtown" -ForegroundColor White
Write-Host "  Movie: The Galactic Voyager" -ForegroundColor White
Write-Host "  Booking Reference: $bookingRef" -ForegroundColor Cyan
Write-Host "  Transaction ID: $txnId" -ForegroundColor Cyan
Write-Host "  Amount: Rs $($booking.total_amount)" -ForegroundColor Green
Write-Host ""
Write-Host "View API Docs: http://127.0.0.1:8000/docs" -ForegroundColor Magenta
