import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { bookingsAPI } from '../api/client'
import type { Booking } from '../api/client'

// Extended booking type for display
interface DisplayBooking extends Booking {
  seats_display?: string[]
  poster_url?: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => bookingsAPI.getMyBookings(),
    retry: false
  })

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: (bookingId: number) => bookingsAPI.cancel(bookingId),
    onSuccess: () => {
      // Refresh bookings list after cancel
      queryClient.invalidateQueries({ queryKey: ['myBookings'] })
    },
    onError: (error: Error) => {
      alert('Failed to cancel booking: ' + error.message)
    },
  })

  const handleCancelBooking = (bookingId: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelMutation.mutate(bookingId)
    }
  }

  // Mock data fallback for demo
  const mockBookings: DisplayBooking[] = [
    {
      id: 1,
      user_id: 1,
      showtime_id: 1,
      total_amount: 42.00,
      booking_reference: 'BK7X9K2M',
      status: 'confirmed',
      seat_count: 3,
      created_at: new Date().toISOString(),
      movie_title: 'Inception',
      theater_name: 'CineMax Downtown',
      screen_name: 'IMAX Screen 1',
      show_time: '2025-02-15T19:00:00',
      seats_display: ['A1', 'A2', 'A3'],
      poster_url: ''
    },
    {
      id: 2,
      user_id: 1,
      showtime_id: 2,
      total_amount: 36.00,
      booking_reference: 'BK3M8P1Q',
      status: 'confirmed',
      seat_count: 2,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      movie_title: 'The Dark Knight',
      theater_name: 'Regal Cinemas',
      screen_name: 'Screen 4',
      show_time: '2025-02-08T16:30:00',
      seats_display: ['C5', 'C6'],
      poster_url: ''
    }
  ]

  const displayBookings: DisplayBooking[] = data?.bookings || mockBookings

  const breadcrumbs = [
    { label: 'Home', href: '/home' },
    { label: 'My Bookings' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'completed': return 'text-text-secondary bg-white/5 border-white/10'
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/30'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      default: return 'text-text-secondary bg-white/5 border-white/10'
    }
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <Header breadcrumbs={breadcrumbs} />

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Bookings</h1>
            <p className="text-text-secondary text-sm sm:text-base">View and manage your movie ticket bookings</p>
          </div>
          <button
            onClick={() => navigate('/movies')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold transition-colors"
          >
            <span className="material-symbols-outlined">movie</span>
            Book Tickets
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="glass-panel p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">confirmation_number</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">{displayBookings.length}</p>
                <p className="text-text-secondary text-sm">Total Bookings</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-green-400">event_available</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {displayBookings.filter(b => b.status === 'confirmed').length}
                </p>
                <p className="text-text-secondary text-sm">Upcoming Shows</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-cyan-400">payments</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  ${displayBookings.reduce((sum, b) => sum + b.total_amount, 0).toFixed(2)}
                </p>
                <p className="text-text-secondary text-sm">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-panel p-6 animate-pulse">
                <div className="flex gap-6">
                  <div className="w-24 h-36 bg-surface-highlight rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-surface-highlight rounded w-1/3"></div>
                    <div className="h-4 bg-surface-highlight rounded w-1/4"></div>
                    <div className="h-4 bg-surface-highlight rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass-panel p-12 text-center">
            <span className="material-symbols-outlined text-red-400 text-5xl mb-4">error</span>
            <p className="text-white text-lg mb-2">Failed to load bookings</p>
            <p className="text-text-secondary mb-6">Please try again later</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white transition-colors"
            >
              Retry
            </button>
          </div>
        ) : displayBookings.length === 0 ? (
          <div className="glass-panel p-16 text-center">
            <div className="w-20 h-20 bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-text-secondary text-4xl">movie</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No Bookings Yet</h3>
            <p className="text-text-secondary mb-8">Start your cinema journey by booking your first movie!</p>
            <button
              onClick={() => navigate('/movies')}
              className="px-8 py-4 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold transition-colors"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayBookings.map(booking => {
              return (
                <div key={booking.id} className="glass-panel p-4 sm:p-6 hover:bg-surface-highlight/50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Poster */}
                    <div className="w-full sm:w-24 h-48 sm:h-36 bg-surface-dark rounded-lg overflow-hidden flex-shrink-0">
                      {booking.poster_url ? (
                        <img src={booking.poster_url} alt={booking.movie_title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-text-secondary text-3xl">movie</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2 sm:gap-0">
                        <div>
                          <h3 className="text-white text-lg sm:text-xl font-semibold mb-1">
                            {booking.movie_title || 'Movie Title'}
                          </h3>
                          <p className="text-text-secondary text-sm">
                            {booking.theater_name || 'Theater'} • {booking.screen_name || 'Screen'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-text-secondary text-xs mb-1">Date & Time</p>
                          <p className="text-white text-sm">
                            {booking.show_time 
                              ? new Date(booking.show_time).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'N/A'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-text-secondary text-xs mb-1">Seats</p>
                          <p className="text-cyan-400 text-sm font-semibold">
                            {booking.seats_display?.join(', ') || `${booking.seat_count} seat(s)`}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-secondary text-xs mb-1">Booking Ref</p>
                          <p className="text-primary text-sm font-mono">{booking.booking_reference}</p>
                        </div>
                        <div>
                          <p className="text-text-secondary text-xs mb-1">Amount</p>
                          <p className="text-green-400 text-sm font-bold">${booking.total_amount.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {booking.status === 'confirmed' && (
                          <>
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-lg text-white text-sm transition-colors">
                              <span className="material-symbols-outlined text-base">qr_code_2</span>
                              View Ticket
                            </button>
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-lg text-white text-sm transition-colors">
                              <span className="material-symbols-outlined text-base">print</span>
                              Print
                            </button>
                            <button 
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={cancelMutation.isPending}
                              className="flex items-center gap-1.5 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 rounded-lg text-red-400 text-sm transition-colors disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-base">cancel</span>
                              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => navigate(`/booking/confirmation/${booking.id}`, {
                            state: {
                              bookingReference: booking.booking_reference,
                              transactionId: String(booking.id),
                              selectedSeats: booking.seats_display || [],
                              totalAmount: booking.total_amount,
                              movieTitle: booking.movie_title,
                              theaterName: booking.theater_name,
                              screenName: booking.screen_name,
                              showtime: booking.show_time,
                              posterUrl: booking.poster_url
                            }
                          })}
                          className="flex items-center gap-1.5 px-4 py-2 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-lg text-white text-sm transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
