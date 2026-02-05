import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useLocationStore } from './store/locationStore'
import LocationModal from './components/LocationModal'
import Login from './pages/Login'
import Home from './pages/Home'
import BrowseMovies from './pages/BrowseMovies'
import MovieDetail from './pages/MovieDetail'
import SeatSelection from './pages/SeatSelection'
import Payment from './pages/Payment'
import BookingConfirmation from './pages/BookingConfirmation'
import Chat from './pages/Chat'
import Voice from './pages/Voice'
import Dashboard from './pages/Dashboard'
import OwnerDashboard from './pages/OwnerDashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  const { permissionAsked } = useLocationStore()
  const [showLocationModal, setShowLocationModal] = useState(false)

  useEffect(() => {
    // Show location modal on first visit after user logs in
    const timer = setTimeout(() => {
      const isLoggedIn = localStorage.getItem('token')
      if (isLoggedIn && !permissionAsked) {
        setShowLocationModal(true)
      }
    }, 2000) // Delay for better UX after login

    return () => clearTimeout(timer)
  }, [permissionAsked])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<BrowseMovies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/booking/seats/:showtimeId" element={<SeatSelection />} />
          <Route path="/booking/payment" element={<Payment />} />
          <Route path="/booking/confirmation/:bookingId" element={<BookingConfirmation />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        </Routes>
        
        {/* Location Modal - Shows on first visit */}
        <LocationModal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} />
      </Router>
    </QueryClientProvider>
  )
}

export default App
