import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useLocationStore } from './store/locationStore'
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
import Profile from './pages/Profile'
import AiAssistantModal from './components/AiAssistantModal'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  const { coordinates, requestLocationAndSave } = useLocationStore()

  useEffect(() => {
    // Auto-request GPS location silently on first visit
    if (!coordinates) {
      requestLocationAndSave()
    }
  }, [coordinates, requestLocationAndSave])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<BrowseMovies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/booking/seats/:showtimeId" element={
            <RequireAuth>
              <SeatSelection />
            </RequireAuth>
          } />
          <Route path="/booking/payment" element={
            <RequireAuth>
              <Payment />
            </RequireAuth>
          } />
          <Route path="/booking/confirmation/:bookingId" element={
            <RequireAuth>
              <BookingConfirmation />
            </RequireAuth>
          } />
          <Route path="/chat" element={<Chat />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/owner/dashboard" element={
            <RequireAuth>
              <OwnerDashboard />
            </RequireAuth>
          } />
          <Route path="/profile" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />
        </Routes>
        {/* AI Assistant floating modal - available on all pages */}
        <AiAssistantModal />
      </Router>
    </QueryClientProvider>
  )
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const token = localStorage.getItem('token')
  if (!token) {
    const returnUrl = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />
  }
  return <>{children}</>
}

export default App
