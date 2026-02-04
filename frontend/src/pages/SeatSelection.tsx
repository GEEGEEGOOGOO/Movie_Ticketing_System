import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { showtimesAPI, bookingsAPI } from '../api/client'
import type { SeatAvailability } from '../api/client'
import Header from '../components/Header'
import Footer from '../components/Footer'

type SeatStatus = 'available' | 'selected' | 'booked'

interface SeatDisplay extends SeatAvailability {
  status: SeatStatus
}

export default function SeatSelection() {
  const { showtimeId } = useParams()
  const navigate = useNavigate()
  const [selectedSeats, setSelectedSeats] = useState<SeatDisplay[]>([])
  const [timeLeft, setTimeLeft] = useState(5 * 60) // 5 minutes in seconds

  // Fetch showtime details
  const { data: showtime, isLoading: showtimeLoading } = useQuery({
    queryKey: ['showtime', showtimeId],
    queryFn: () => showtimesAPI.getById(Number(showtimeId)),
    enabled: !!showtimeId,
  })

  // Fetch seat availability
  const { data: seatAvailability, isLoading: seatsLoading } = useQuery({
    queryKey: ['seatAvailability', showtimeId],
    queryFn: () => showtimesAPI.getAvailability(Number(showtimeId)),
    enabled: !!showtimeId,
  })

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (data: { showtime_id: number; seat_ids: number[] }) =>
      bookingsAPI.create(data),
    onSuccess: (booking) => {
      navigate('/booking/payment', {
        state: {
          booking,
          showtime,
          selectedSeats,
        },
      })
    },
    onError: (error: Error) => {
      alert('Failed to create booking: ' + error.message)
    },
  })

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate(-1)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  // Mock seat data matching the HTML design
  const mockSeats: SeatDisplay[] = useMemo(() => {
    const standardRows = ['A', 'B', 'C']
    const premiumRows = ['D', 'E', 'F', 'G']
    const vipRows = ['H', 'I', 'J']
    const seatsPerRow = 8
    const seats: SeatDisplay[] = []
    let seatId = 1

    const allRows = [...standardRows, ...premiumRows, ...vipRows]
    
    allRows.forEach((row) => {
      for (let num = 1; num <= seatsPerRow; num++) {
        const isBooked = Math.random() > 0.7
        const seatType = standardRows.includes(row) ? 'standard' : premiumRows.includes(row) ? 'premium' : 'vip'
        const price = seatType === 'standard' ? 14 : seatType === 'premium' ? 18 : 25
        
        seats.push({
          seat_id: seatId++,
          row,
          number: num,
          seat_type: seatType,
          price,
          is_available: !isBooked,
          status: isBooked ? 'booked' : 'available',
        })
      }
    })
    return seats
  }, [])

  // Process seats for display
  const displaySeats: SeatDisplay[] = useMemo(() => {
    if (seatAvailability && seatAvailability.length > 0) {
      return seatAvailability.map((seat) => ({
        ...seat,
        status: seat.is_available
          ? selectedSeats.some((s) => s.seat_id === seat.seat_id)
            ? 'selected'
            : 'available'
          : 'booked',
      }))
    }
    return mockSeats.map((seat) => ({
      ...seat,
      status: selectedSeats.some((s) => s.seat_id === seat.seat_id)
        ? 'selected'
        : seat.status,
    }))
  }, [seatAvailability, selectedSeats, mockSeats])

  // Group seats by row
  const seatsByRow = useMemo(() => {
    const grouped: { [key: string]: SeatDisplay[] } = {}
    displaySeats.forEach((seat) => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = []
      }
      grouped[seat.row].push(seat)
    })
    Object.keys(grouped).forEach((row) => {
      grouped[row].sort((a, b) => a.number - b.number)
    })
    return grouped
  }, [displaySeats])

  const standardRows = ['A', 'B', 'C']
  const premiumRows = ['D', 'E', 'F', 'G']
  const vipRows = ['H', 'I', 'J']

  const toggleSeat = (seat: SeatDisplay) => {
    if (seat.status === 'booked') return

    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.seat_id === seat.seat_id)
      if (exists) {
        return prev.filter((s) => s.seat_id !== seat.seat_id)
      }
      return [...prev, { ...seat, status: 'selected' }]
    })
  }

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 1.50 : 0

  const handleContinue = () => {
    if (selectedSeats.length === 0) return

    // For mock mode, navigate directly to payment with mock data
    navigate('/booking/payment', {
      state: {
        booking: {
          id: Math.floor(Math.random() * 10000),
          booking_reference: `BK${Date.now().toString().slice(-8)}`,
          showtime_id: Number(showtimeId),
          seat_count: selectedSeats.length,
          total_amount: totalAmount + convenienceFee,
          status: 'pending',
        },
        showtime: showtime || {
          id: Number(showtimeId),
          movie: { title: 'Mock Movie', duration_minutes: 120 },
          screen: { name: 'Screen 1', theater: { name: 'Cinema Paradise', city: 'Downtown' } },
          start_time: new Date().toISOString(),
        },
        selectedSeats,
      },
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getSeatClasses = (seat: SeatDisplay) => {
    const base = 'w-7 h-7 md:w-9 md:h-9 rounded-t-lg md:rounded-t-xl transition-all duration-300 focus:outline-none'
    
    if (seat.status === 'booked') {
      return `${base} bg-red-900/40 border border-red-800/50 cursor-not-allowed flex items-center justify-center`
    }
    
    if (seat.status === 'selected') {
      return `${base} bg-cyan-400 shadow-seat-selected scale-110 z-10 text-surface-dark font-bold text-[10px] flex items-center justify-center`
    }
    
    if (seat.seat_type === 'vip') {
      return `${base} border-2 border-cyan-500/30 bg-white/90 hover:bg-cyan-400 hover:shadow-seat-selected hover:scale-110`
    }
    
    return `${base} bg-white/90 hover:bg-cyan-400 hover:shadow-seat-selected hover:scale-110`
  }

  if (showtimeLoading || seatsLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-background-dark font-display text-white overflow-x-hidden min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">
        {/* Movie Info Bar */}
        <section className="flex flex-col md:flex-row items-center justify-between bg-surface-dark border border-surface-highlight rounded-xl p-4 md:px-8 shadow-lg gap-4">
          <div className="flex items-center gap-6">
            <div className="h-16 w-12 rounded overflow-hidden bg-gray-800 hidden md:block">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${showtime?.movie?.poster_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwACjs1qnhw5haMslnQPGHQAJ14Km6J0TemLmi26AWdbb2rERZwZMbAkVucyO7Hd3X1YLfi-KtLWP7JjUN2UXsEI2mX6qa9Mt3j4zpGM3Y7O9Ieg4acghIR5AxnHzlD-HrRR0BQ6b4g1fquwoIHcvqiDFJ-j8BcC69Rn3DlgAMIQNrVHStCMRZQiqr16e--4EWKduQm3jIMEzLpj1kerC5QTmq3tY1amDbnMz64bPWB9MpJBqua3kojuxyOeu3kyEKxpiMq9evY8I'}')` }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">{showtime?.movie?.title || 'Dune: Part Two'}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary mt-1">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">theaters</span> {showtime?.screen?.theater?.name || 'AMC Empire 25'}</span>
                <span className="w-1 h-1 bg-surface-highlight rounded-full"></span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> Today, 19:30</span>
                <span className="w-1 h-1 bg-surface-highlight rounded-full"></span>
                <span className="bg-surface-highlight/50 px-2 py-0.5 rounded text-xs text-white border border-surface-highlight">IMAX Laser</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-red-900/10 border border-red-900/30 px-4 py-2 rounded-lg">
            <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Reserving seats for:</span>
            <span className="font-mono text-xl font-bold text-primary tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </section>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 relative items-start">
          {/* Seat Map */}
          <div className="flex-1 w-full bg-[#1a0c0e] rounded-2xl border border-surface-highlight p-6 md:p-10 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/10 blur-[60px] pointer-events-none"></div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-white/90 border border-gray-400"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-cyan-400 shadow-[0_0_10px_cyan]"></span>
                <span className="text-white font-medium">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-red-900/40 border border-red-800/50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-red-700">close</span>
                </span>
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md border-2 border-cyan-500/30"></span>
                <span>VIP ($25)</span>
              </div>
            </div>

            {/* Screen */}
            <div className="perspective-container flex flex-col items-center mb-16">
              <div className="relative w-full max-w-2xl h-12 border-t-[3px] border-cyan-400/50 rounded-[50%] shadow-screen screen-curve bg-gradient-to-b from-cyan-500/10 to-transparent flex items-end justify-center">
                <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 uppercase mb-4 font-bold">Screen</span>
              </div>
            </div>

            {/* Seat Sections */}
            <div className="flex flex-col gap-10 items-center mx-auto max-w-4xl select-none">
              {/* Standard Section */}
              <div className="flex flex-col gap-3 w-full items-center">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Standard - $14</h3>
                {standardRows.filter(row => seatsByRow[row]).map((row) => (
                  <div key={row} className="flex gap-2 md:gap-4 items-center">
                    <span className="text-xs text-gray-500 w-4 text-right">{row}</span>
                    <div className="flex gap-2 md:gap-3">
                      {seatsByRow[row]?.slice(0, 4).map((seat) => (
                        <button
                          key={seat.seat_id}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.status === 'booked'}
                          className={`group relative ${getSeatClasses(seat)}`}
                        >
                          {seat.status === 'booked' && <span className="material-symbols-outlined text-sm text-red-900/60">close</span>}
                          {seat.status === 'selected' && seat.number}
                        </button>
                      ))}
                      <div className="w-6 md:w-10"></div>
                      {seatsByRow[row]?.slice(4, 8).map((seat) => (
                        <button
                          key={seat.seat_id}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.status === 'booked'}
                          className={`group relative ${getSeatClasses(seat)}`}
                        >
                          {seat.status === 'booked' && <span className="material-symbols-outlined text-sm text-red-900/60">close</span>}
                          {seat.status === 'selected' && seat.number}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 w-4 text-left">{row}</span>
                  </div>
                ))}
              </div>

              {/* Premium Section */}
              <div className="flex flex-col gap-3 w-full items-center">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1 mt-2">Premium - $18</h3>
                {premiumRows.filter(row => seatsByRow[row]).map((row) => (
                  <div key={row} className="flex gap-2 md:gap-4 items-center">
                    <span className="text-xs text-gray-500 w-4 text-right">{row}</span>
                    <div className="flex gap-2 md:gap-3">
                      {seatsByRow[row]?.slice(0, 4).map((seat) => (
                        <button
                          key={seat.seat_id}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.status === 'booked'}
                          className={`group relative ${getSeatClasses(seat)}`}
                        >
                          {seat.status === 'booked' && <span className="material-symbols-outlined text-sm text-red-900/60">close</span>}
                          {seat.status === 'selected' && seat.number}
                        </button>
                      ))}
                      <div className="w-6 md:w-10"></div>
                      {seatsByRow[row]?.slice(4, 8).map((seat) => (
                        <button
                          key={seat.seat_id}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.status === 'booked'}
                          className={`group relative ${getSeatClasses(seat)}`}
                        >
                          {seat.status === 'booked' && <span className="material-symbols-outlined text-sm text-red-900/60">close</span>}
                          {seat.status === 'selected' && seat.number}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 w-4 text-left">{row}</span>
                  </div>
                ))}
              </div>

              {/* VIP Section */}
              <div className="flex flex-col gap-3 w-full items-center">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">diamond</span> VIP - $25
                </h3>
                {vipRows.filter(row => seatsByRow[row]).map((row) => (
                  <div key={row} className="flex gap-2 md:gap-4 items-center">
                    <span className="text-xs text-gray-500 w-4 text-right">{row}</span>
                    <div className="flex gap-2 md:gap-3">
                      {seatsByRow[row]?.slice(0, 4).map((seat) => (
                        <button
                          key={seat.seat_id}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.status === 'booked'}
                          className={`group relative ${getSeatClasses(seat)}`}
                        >
                          {seat.status === 'booked' && <span className="material-symbols-outlined text-sm text-red-900/60">close</span>}
                          {seat.status === 'selected' && seat.number}
                        </button>
                      ))}
                      <div className="w-6 md:w-10"></div>
                      {seatsByRow[row]?.slice(4, 8).map((seat) => (
                        <button
                          key={seat.seat_id}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.status === 'booked'}
                          className={`group relative ${getSeatClasses(seat)}`}
                        >
                          {seat.status === 'booked' && <span className="material-symbols-outlined text-sm text-red-900/60">close</span>}
                          {seat.status === 'selected' && seat.number}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 w-4 text-left">{row}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="sticky top-24 bg-surface-dark/95 backdrop-blur-xl border border-surface-highlight rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Booking Summary</h2>
                <p className="text-xs text-text-secondary">{showtime?.movie?.title || 'Dune: Part Two'} • {showtime?.screen?.theater?.name || 'AMC Empire 25'}</p>
              </div>

              {/* Selected Seats */}
              <div className="flex flex-col gap-3">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map((seat) => (
                    <div key={seat.seat_id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-surface-highlight group hover:border-cyan-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">{seat.row}{seat.number}</div>
                        <div>
                          <div className="text-sm font-bold text-white capitalize">{seat.seat_type} Seat</div>
                          <div className="text-xs text-text-secondary">Row {seat.row}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">${seat.price.toFixed(2)}</div>
                        <button 
                          onClick={() => toggleSeat(seat)}
                          className="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-text-secondary text-sm text-center py-4">Select seats from the map</p>
                )}
              </div>

              {/* Price Breakdown */}
              {selectedSeats.length > 0 && (
                <div className="border-t border-surface-highlight pt-4 flex flex-col gap-2">
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>Convenience Fee</span>
                    <span>${convenienceFee.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-surface-highlight pt-4">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-sm font-bold text-gray-300">Total Amount</span>
                  <span className="text-2xl font-bold text-white">${(totalAmount + convenienceFee).toFixed(2)}</span>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 text-xs text-cyan-400 bg-cyan-900/10 px-3 py-2 rounded border border-cyan-900/30">
                    <span className="material-symbols-outlined text-sm">lock_clock</span>
                    <span>Seats locked for payment</span>
                  </div>
                )}

                <button
                  onClick={handleContinue}
                  disabled={selectedSeats.length === 0 || createBookingMutation.isPending}
                  className={`w-full py-4 font-bold text-lg rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${
                    selectedSeats.length > 0
                      ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                      : 'bg-surface-highlight text-text-secondary cursor-not-allowed'
                  }`}
                >
                  {createBookingMutation.isPending ? 'Processing...' : 'Proceed to Payment'}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
