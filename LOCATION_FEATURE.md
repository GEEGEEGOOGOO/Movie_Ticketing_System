# GPS Location-Based Theater Search Feature

## Overview
The CineBook application now supports GPS-based location detection to show theaters within a 7km radius of the user's location.

## How It Works

### Frontend
1. **Click Location Icon**: When the user clicks the location icon in the header, the app immediately requests GPS permission
2. **GPS Permission**: Browser asks user to allow location access
3. **Location Detection**: If granted, the app gets latitude/longitude coordinates
4. **Reverse Geocoding**: Coordinates are converted to city name using OpenStreetMap Nominatim API
5. **Save to Database**: Location is automatically saved to the user's profile in the database
6. **Display Theaters**: Home page and movie pages now show only theaters within 7km radius

### Backend
1. **Database Schema**: Added latitude, longitude, and city columns to both `users` and `theaters` tables
2. **API Endpoint**: `/api/auth/location` (PUT) - Updates user's GPS coordinates
3. **Haversine Formula**: Calculates distance between user and theaters using GPS coordinates
4. **Filtered Results**: `/theaters/` endpoint supports latitude/longitude parameters to return nearby theaters
5. **7km Radius**: Default search radius is 7 kilometers (configurable via `radius_km` parameter)

## Key Features

### User Location
- Stored in database (latitude, longitude, city)
- Automatically updated when user shares location
- Used for personalized theater recommendations
- Persisted across sessions

### Theater Search
- `/theaters/?latitude={lat}&longitude={lon}&radius_km=7` - Search by GPS coordinates
- `/theaters/nearby` - Uses logged-in user's saved location
- Returns theaters sorted by distance (closest first)
- Each theater result includes distance in kilometers

### Privacy
- Location permission required before accessing GPS
- User can skip location sharing
- Manual city selection available as fallback
- Location data only saved for logged-in users

## API Endpoints

### Update User Location
```http
PUT /api/auth/location
Authorization: Bearer {token}
Content-Type: application/json

{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "city": "New York"
}
```

### Get Nearby Theaters (Using User's Saved Location)
```http
GET /theaters/nearby?radius_km=7
Authorization: Bearer {token}
```

### Get Nearby Theaters (Using Custom Coordinates)
```http
GET /theaters/?latitude=40.7128&longitude=-74.0060&radius_km=7
```

## Database Schema

### Users Table
```sql
ALTER TABLE users ADD COLUMN latitude NUMERIC(10, 8);
ALTER TABLE users ADD COLUMN longitude NUMERIC(11, 8);
ALTER TABLE users ADD COLUMN city VARCHAR(100);
```

### Theaters Table
```sql
ALTER TABLE theaters ADD COLUMN latitude NUMERIC(10, 8);
ALTER TABLE theaters ADD COLUMN longitude NUMERIC(11, 8);
```

## Distance Calculation

The Haversine formula is used to calculate the great-circle distance between two points on Earth:

```python
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371.0  # Earth radius in kilometers
    # Convert to radians and apply Haversine formula
    # Returns distance in kilometers
```

## Migration

Run the migration to add location columns:
```bash
cd backend
python -m alembic upgrade head
```

## Testing

1. Start backend: `cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Login to the app
4. Click location icon in header
5. Allow GPS permission when prompted
6. Check that location is displayed in header
7. Browse theaters - should only show nearby ones within 7km

## Future Enhancements

- Add theater owner dashboard to set theater GPS coordinates
- Display theater distance on movie detail pages
- Add "Sort by distance" option
- Implement location-based push notifications
- Support multiple saved locations per user
