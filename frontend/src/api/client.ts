import axios from 'axios'

const API_BASE_URL = 'http://localhost:8002'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle token expiration - only redirect if not already on login page
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Don't redirect if already on login page to avoid loop
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ==================== Types ====================

export interface User {
  id: number
  email: string
  full_name: string
  role: 'customer' | 'owner'
  is_active: boolean
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface Movie {
  id: number
  title: string
  description: string
  release_date: string
  genre: string
  language: string
  duration: number  // minutes
  rating: string
  poster_url?: string
  trailer_url?: string
  created_at?: string
}

export interface Theater {
  id: number
  name: string
  city: string
  address?: string
  screens: Screen[]
}

export interface Screen {
  id: number
  name: string
  theater_id: number
  total_seats: number
  seats?: Seat[]
}

export interface Seat {
  id: number
  screen_id: number
  row: string
  number: number
  seat_type: 'standard' | 'premium' | 'vip' | 'wheelchair'
  base_price: number
}

export interface Showtime {
  id: number
  movie_id: number
  screen_id: number
  start_time: string
  end_time?: string
  price_multiplier: number
  created_at?: string
  movie?: Movie
  screen_name?: string
  theater_name?: string
  theater_city?: string
  theater_latitude?: number
  theater_longitude?: number
  available_seats?: number
  screen?: Screen & { theater?: Theater }
}

export interface SeatAvailability {
  seat_id: number
  row: string
  number: number
  seat_type: string
  price: number | string  // Backend may return string, we convert to number
  is_available: boolean
}

export interface ShowtimeSeats {
  showtime_id: number
  movie_title: string
  screen_name: string
  start_time: string
  seats: SeatAvailability[]
  total_seats: number
  available_seats: number
}

export interface Booking {
  id: number
  booking_reference: string
  user_id: number
  showtime_id: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired'
  total_amount: number
  seat_count: number
  created_at: string
  expires_at?: string
  seats?: BookingSeat[]
  movie_title?: string
  movie_language?: string
  theater_name?: string
  screen_name?: string
  show_time?: string
  payment?: Payment
}

export interface BookingSeat {
  seat_id: number
  row: string
  number: number
  seat_type: string
  price: number | string  // Backend may return string, convert to number when needed
}

export interface Payment {
  id: number
  booking_id: number
  amount: number
  status: 'pending' | 'success' | 'failed' | 'refunded'
  transaction_id: string
  payment_method: string
  created_at: string
}

export interface PaymentConfirmation {
  booking_reference: string
  transaction_id: string
  amount: number
  status: string
  message: string
}

export interface RefundSimulation {
  refund_reference: string
  original_transaction_id?: string | null
  amount: number
  status: 'processed'
  processed_at: string
  is_simulated: boolean
  message: string
}

export interface BookingCancelResponse {
  booking: Booking
  refund?: RefundSimulation | null
  message: string
}

// Health check
export const pingAPI = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health')
    return response.data?.status === 'healthy'
  } catch {
    return false
  }
}

// ==================== Auth API ====================

export const authAPI = {
  register: async (data: { email: string; password: string; full_name: string; role: string }): Promise<User> => {
    const response = await apiClient.post<User>('/api/auth/register', {
      email: data.email,
      password: data.password,
      name: data.full_name,
      role: data.role
    })
    return response.data
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)
    
    const response = await apiClient.post<AuthResponse>('/api/auth/login/oauth2', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    return response.data
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/api/auth/me')
    // Map backend 'name' to frontend 'full_name'
    const data = response.data
    return {
      id: data.id,
      email: data.email,
      full_name: data.name || data.full_name,
      role: data.role,
      is_active: data.is_verified ?? true
    }
  },

  updateLocation: async (data: { latitude: number; longitude: number; city?: string }): Promise<User> => {
    const response = await apiClient.put('/api/auth/location', data)
    const resData = response.data
    return {
      id: resData.id,
      email: resData.email,
      full_name: resData.name || resData.full_name,
      role: resData.role,
      is_active: resData.is_verified ?? true
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// ==================== Movies API ====================

export const moviesAPI = {
  getAll: async (params?: { genre?: string; language?: string; page?: number; per_page?: number; search?: string }): Promise<{ movies: Movie[]; total: number }> => {
    const response = await apiClient.get('/api/movies/', { params })
    return response.data
  },

  getById: async (id: number): Promise<Movie> => {
    const response = await apiClient.get<Movie>(`/api/movies/${id}`)
    return response.data
  },

  getShowtimes: async (movieId: number, city?: string, date?: string, userLat?: number, userLng?: number): Promise<Showtime[]> => {
    const params: Record<string, any> = {}
    if (city) params.city = city
    if (date) params.date = date
    if (userLat !== undefined && userLng !== undefined) {
      params.user_lat = userLat
      params.user_lng = userLng
    }
    const response = await apiClient.get(`/api/showtimes/movie/${movieId}`, { params })
    return response.data
  },

  create: async (data: Partial<Movie>): Promise<Movie> => {
    const response = await apiClient.post<Movie>('/api/movies/', data)
    return response.data
  },
}

// ==================== Theaters API ====================

export const theatersAPI = {
  getAll: async (city?: string): Promise<Theater[]> => {
    const response = await apiClient.get<Theater[]>('/api/theaters/', { params: { city } })
    return response.data
  },

  getNearby: async (latitude?: number, longitude?: number, radius_km: number = 7): Promise<Theater[]> => {
    if (latitude && longitude) {
      const response = await apiClient.get<Theater[]>('/api/theaters/', { 
        params: { latitude, longitude, radius_km } 
      })
      return response.data
    }
    // If user is logged in and has location saved, use that
    const response = await apiClient.get<Theater[]>('/api/theaters/nearby', { 
      params: { radius_km } 
    })
    return response.data
  },

  getById: async (id: number): Promise<Theater> => {
    const response = await apiClient.get<Theater>(`/api/theaters/${id}`)
    return response.data
  },

  getMyTheaters: async (): Promise<Theater[]> => {
    const response = await apiClient.get<Theater[]>('/api/theaters/my-theaters')
    return response.data
  },

  create: async (data: { name: string; city: string; address?: string; screens?: { name: string; total_seats: number }[] }): Promise<Theater> => {
    const response = await apiClient.post<Theater>('/api/theaters/', data)
    return response.data
  },
}

// ==================== Showtimes API ====================

export const showtimesAPI = {
  getById: async (id: number): Promise<Showtime> => {
    const response = await apiClient.get<Showtime>(`/api/showtimes/${id}`)
    return response.data
  },

  getAvailability: async (showtimeId: number): Promise<SeatAvailability[]> => {
    const response = await apiClient.get<ShowtimeSeats>(`/api/showtimes/${showtimeId}/seats`)
    return response.data.seats || []
  },

  create: async (data: { movie_id: number; screen_id: number; start_time: string; price: number }): Promise<Showtime> => {
    const response = await apiClient.post<Showtime>('/api/showtimes/', data)
    return response.data
  },
}

// ==================== Bookings API ====================

export const bookingsAPI = {
  create: async (data: { showtime_id: number; seat_ids: number[] }): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/api/bookings/', data)
    return response.data
  },

  getMyBookings: async (page?: number, perPage?: number): Promise<{ bookings: Booking[]; total: number }> => {
    const response = await apiClient.get('/api/bookings/', { params: { page, per_page: perPage } })
    return response.data
  },

  getById: async (id: number): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/api/bookings/${id}`)
    return response.data
  },

  getByReference: async (reference: string): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/api/bookings/reference/${reference}`)
    return response.data
  },

  cancel: async (id: number, reason?: string): Promise<BookingCancelResponse> => {
    const response = await apiClient.post<BookingCancelResponse>(
      `/api/bookings/${id}/cancel`,
      reason ? { reason } : undefined
    )
    return response.data
  },

  processPayment: async (bookingId: number, paymentMethod: string): Promise<PaymentConfirmation> => {
    const response = await apiClient.post<PaymentConfirmation>(`/api/bookings/${bookingId}/pay`, {
      booking_id: bookingId,
      payment_method: paymentMethod
    })
    return response.data
  },
}

export default apiClient
