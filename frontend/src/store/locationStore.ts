import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../api/client'

interface LocationCoordinates {
  latitude: number
  longitude: number
}

interface LocationState {
  city: string | null
  coordinates: LocationCoordinates | null
  permissionAsked: boolean
  permissionGranted: boolean
  isLoading: boolean
  error: string | null
  setLocation: (city: string, coordinates: LocationCoordinates) => void
  setPermissionAsked: (asked: boolean) => void
  setPermissionGranted: (granted: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearLocation: () => void
  requestLocationAndSave: () => Promise<void>
}

// Reverse geocoding to get city name from coordinates
async function getCityFromCoordinates(lat: number, lon: number): Promise<string> {
  try {
    // Using OpenStreetMap Nominatim API (free, no key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
    )
    const data = await response.json()
    
    // Extract city from address
    const city = data.address?.city || 
                 data.address?.town || 
                 data.address?.village || 
                 data.address?.county || 
                 'Unknown Location'
    
    return city
  } catch (error) {
    console.error('Geocoding error:', error)
    return 'Unknown Location'
  }
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      city: null,
      coordinates: null,
      permissionAsked: false,
      permissionGranted: false,
      isLoading: false,
      error: null,
      
      setLocation: (city, coordinates) => set({ city, coordinates, error: null }),
      setPermissionAsked: (asked) => set({ permissionAsked: asked }),
      setPermissionGranted: (granted) => set({ permissionGranted: granted }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearLocation: () => set({ 
        city: null, 
        coordinates: null, 
        permissionGranted: false,
        error: null 
      }),
      
      requestLocationAndSave: async () => {
        const state = get()
        
        if (!navigator.geolocation) {
          state.setError('Geolocation is not supported by your browser')
          state.setPermissionAsked(true)
          return
        }

        state.setLoading(true)
        state.setError(null)

        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: true,
            })
          })

          const { latitude, longitude } = position.coords
          const coordinates = { latitude, longitude }
          
          // Get city name from coordinates
          const city = await getCityFromCoordinates(latitude, longitude)
          
          // Save location to frontend state
          state.setLocation(city, coordinates)
          state.setPermissionGranted(true)
          state.setPermissionAsked(true)
          
          // Save location to backend database
          try {
            const token = localStorage.getItem('token')
            if (token) {
              await authAPI.updateLocation({ latitude, longitude, city })
              console.log('Location saved to database:', { latitude, longitude, city })
            }
          } catch (backendError) {
            console.error('Failed to save location to backend:', backendError)
            // Continue anyway - location is saved locally
          }
          
          state.setLoading(false)
        } catch (error: any) {
          console.error('Location error:', error)
          
          let errorMessage = 'Unable to retrieve your location'
          if (error.code === 1) {
            errorMessage = 'Location permission denied'
          } else if (error.code === 2) {
            errorMessage = 'Location unavailable'
          } else if (error.code === 3) {
            errorMessage = 'Location request timeout'
          }
          
          state.setError(errorMessage)
          state.setPermissionAsked(true)
          state.setPermissionGranted(false)
          state.setLoading(false)
        }
      },
    }),
    {
      name: 'location-storage',
    }
  )
)
