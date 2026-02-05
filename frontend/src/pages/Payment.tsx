import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { bookingsAPI } from '../api/client'
import type { Booking, Showtime } from '../api/client'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface SavedCard {
  id: string
  last4: string
  type: 'visa' | 'mastercard' | 'amex'
  expiry: string
  brand: string
}

interface LocationState {
  booking?: Booking
  showtime?: Showtime
  selectedSeats?: Array<{ seat_id: number; row: string; number: number; price: number; seat_type: string }>
}

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | undefined
  
  const { booking, showtime, selectedSeats } = state || {}

  // Payment form state
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [selectedSavedCard, setSelectedSavedCard] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStage, setPaymentStage] = useState('')
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(600)

  // Mock saved cards
  const savedCards: SavedCard[] = [
    { id: '1', last4: '4242', type: 'visa', expiry: '09/26', brand: 'Visa' },
    { id: '2', last4: '8888', type: 'mastercard', expiry: '03/27', brand: 'MasterCard' },
  ]

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) {
      alert('Booking expired! Please book again.')
      navigate('/movies')
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, navigate])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const chunks = cleaned.match(/.{1,4}/g)
    return chunks ? chunks.join(' ') : cleaned
  }

  const totalAmount = booking?.total_amount || selectedSeats?.reduce((sum, s) => sum + s.price, 0) || 0
  const convenienceFee = (selectedSeats?.length || 0) * 1.5
  const taxes = totalAmount * 0.08
  const finalAmount = totalAmount + convenienceFee + taxes

  // Payment mutation using real API
  const paymentMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const paymentMethod = selectedSavedCard ? 'saved_card' : 'credit_card'
      return bookingsAPI.processPayment(bookingId, paymentMethod)
    },
    onSuccess: (paymentConfirmation) => {
      setProgress(100)
      setPaymentStage('Payment successful!')
      
      setTimeout(() => {
        navigate(`/booking/confirmation/${paymentConfirmation.booking_reference}`, {
          state: {
            paymentConfirmation,
            booking: {
              ...booking,
              booking_reference: paymentConfirmation.booking_reference,
              total_amount: finalAmount,
              status: 'confirmed',
            },
            showtime,
            selectedSeats,
          },
        })
      }, 500)
    },
    onError: (error: Error) => {
      setIsProcessing(false)
      setProgress(0)
      alert('Payment failed: ' + error.message)
    },
  })

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setProgress(0)

    const stages = [
      { stage: 'Validating payment details...', duration: 800 },
      { stage: 'Connecting to payment gateway...', duration: 1000 },
      { stage: 'Authenticating transaction...', duration: 1200 },
      { stage: 'Processing payment...', duration: 1500 },
      { stage: 'Confirming booking...', duration: 800 },
    ]

    // Show animation stages
    let currentProgress = 0
    for (let i = 0; i < stages.length - 1; i++) {
      setPaymentStage(stages[i].stage)
      await new Promise((resolve) => setTimeout(resolve, stages[i].duration))
      currentProgress = ((i + 1) / stages.length) * 100
      setProgress(currentProgress)
    }

    // Actually process payment via API
    if (booking?.id) {
      setPaymentStage('Processing payment...')
      paymentMutation.mutate(booking.id)
    } else {
      // Fallback for mock mode if no booking exists
      const mockBookingRef = 'BK' + Date.now().toString().slice(-8)
      const mockTxnId = 'TXN' + Math.random().toString(36).substr(2, 12).toUpperCase()
      setProgress(100)
      setPaymentStage('Payment successful!')

      setTimeout(() => {
        navigate(`/booking/confirmation/${mockBookingRef}`, {
          state: {
            paymentConfirmation: {
              booking_reference: mockBookingRef,
              transaction_id: mockTxnId,
              amount: finalAmount,
              status: 'success',
              message: 'Payment successful',
            },
            booking: {
              id: Math.floor(Math.random() * 10000),
              booking_reference: mockBookingRef,
              total_amount: finalAmount,
              status: 'confirmed',
              seat_count: selectedSeats?.length || 0,
            },
            showtime,
            selectedSeats,
          },
        })
      }, 500)
    }
  }

  if (!selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="bg-surface-dark/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl text-center">
          <span className="material-symbols-outlined text-5xl text-text-secondary mb-4">confirmation_number</span>
          <h2 className="text-white text-xl font-bold mb-2">No seats selected</h2>
          <p className="text-text-secondary mb-6">Please select your seats first to proceed to payment.</p>
          <button
            onClick={() => navigate('/movies')}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-colors"
          >
            Browse Movies
          </button>
        </div>
      </div>
    )
  }

  // Payment processing modal
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 max-w-md w-full mx-4 p-10 rounded-2xl relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 text-center">
            <div className="mb-8">
              <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-white text-2xl font-bold mb-4">Processing Payment</h2>
            <p className="text-primary mb-6 font-medium">{paymentStage}</p>
            <div className="w-full bg-black/30 rounded-full h-2 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-[#b90e1c] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-text-secondary text-sm">{progress.toFixed(0)}% Complete</p>
            <div className="mt-8 p-4 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-primary">lock</span>
                <span className="text-text-secondary text-sm">Secure Payment Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-background-dark group/design-root overflow-x-hidden font-display">
      <Header
        breadcrumbs={[
          { label: 'Movies', href: '/movies' },
          { label: 'Seats', href: '#' },
          { label: 'Checkout' },
        ]}
      />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-white text-3xl font-bold tracking-tight">Checkout</h1>
            <p className="text-text-secondary mt-1 font-body">Complete your booking securely</p>
          </div>

          {/* Timer Warning */}
          <div className="flex items-center gap-3 bg-surface-dark/50 border border-white/5 rounded-xl p-4 mb-8">
            <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">timer</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Session Timer</p>
              <p className="text-text-secondary text-xs">
                Complete payment in{' '}
                <span className={`font-bold ${timeRemaining < 60 ? 'text-primary' : 'text-white'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Order & Payment */}
            <div className="flex-1 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-surface-dark/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  Order Summary
                </h2>
                
                <div className="flex gap-4">
                  <div
                    className="w-24 h-36 bg-cover bg-center rounded-xl flex-shrink-0 shadow-lg"
                    style={{
                      backgroundImage: `url("${showtime?.movie?.poster_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgzp7xq2hqWPyA8Ek0PCFmBrI_nM3GVj1jXPF1sxEm2CJPAZ-S3hpL6fLPxrGgbcJRQ4opPmIhPrqRAbFaKuXfBHpkWQTRMraPFVASwL8Oim39qfmqk5TdOt4zWlH2FPMlLCEpuoQ24xYhq8S5cUmAnQwCtMkSMSALJgb9Pg1Q3aPq7xW6tq6C3HKxfxYELHwI71gvPFVZ8wWHVDIYgZgVCBXJgEkA6bVGTmPiZR0ggaDz8_SV4nL0_8qQwuC0hNfOqCtT6qUupXM'}")`
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-xl mb-1">
                      {showtime?.movie?.title || 'Dune: Part Two'}
                    </h3>
                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-3">
                      <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded">
                        {showtime?.movie?.rating || 'PG-13'}
                      </span>
                      <span>{showtime?.movie?.duration_minutes || 166} min</span>
                      <span>•</span>
                      <span>IMAX</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        <span>{showtime?.screen?.theater?.name || 'AMC Lincoln Square 13'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        <span>
                          {showtime?.start_time
                            ? new Date(showtime.start_time).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Saturday, March 15, 2025'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>
                          {showtime?.start_time
                            ? new Date(showtime.start_time).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '7:30 PM'}{' '}
                          - {showtime?.screen?.name || 'Screen 1 (IMAX)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Seats */}
                <div className="mt-5 pt-5 border-t border-white/5">
                  <h4 className="text-white text-sm font-bold mb-3">Selected Seats</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats?.map((seat) => (
                      <span
                        key={seat.seat_id}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                          seat.seat_type === 'vip' 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : seat.seat_type === 'premium'
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {seat.row}{seat.number}
                        <span className="text-xs opacity-70 ml-1">({seat.seat_type})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Saved Payment Methods */}
              <div className="bg-surface-dark/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">credit_card</span>
                  Payment Method
                </h2>

                {/* Saved Cards */}
                <div className="space-y-3 mb-6">
                  {savedCards.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setSelectedSavedCard(card.id === selectedSavedCard ? null : card.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        selectedSavedCard === card.id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/5 bg-black/20 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-lg flex items-center justify-center ${
                          card.type === 'visa' ? 'bg-blue-600/20' : 'bg-orange-500/20'
                        }`}>
                          <span className={`text-lg font-bold ${
                            card.type === 'visa' ? 'text-blue-400' : 'text-orange-400'
                          }`}>
                            {card.brand[0]}
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="text-white font-medium">{card.brand} •••• {card.last4}</p>
                          <p className="text-text-secondary text-sm">Expires {card.expiry}</p>
                        </div>
                      </div>
                      <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedSavedCard === card.id 
                          ? 'border-primary bg-primary' 
                          : 'border-white/20'
                      }`}>
                        {selectedSavedCard === card.id && (
                          <span className="material-symbols-outlined text-white text-[16px]">check</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="h-px flex-1 bg-white/5"></div>
                  <span className="text-text-secondary text-xs uppercase tracking-wider font-bold">Or pay with card</span>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>

                {/* New Card Form */}
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="group/input">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1">
                      Cardholder Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined text-[20px]">person</span>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        disabled={!!selectedSavedCard}
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="group/input">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined text-[20px]">credit_card</span>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value.replace(/\D/g, ''))
                          if (formatted.replace(/\s/g, '').length <= 16) {
                            setCardNumber(formatted)
                          }
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        disabled={!!selectedSavedCard}
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group/input">
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined text-[20px]">event</span>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '')
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4)
                            }
                            setExpiryDate(value)
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          disabled={!!selectedSavedCard}
                          className="w-full bg-black/30 border border-white/10 rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <div className="group/input">
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1">
                        CVV
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined text-[20px]">lock</span>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '')
                            if (value.length <= 4) setCvv(value)
                          }}
                          placeholder="•••"
                          maxLength={4}
                          disabled={!!selectedSavedCard}
                          className="w-full bg-black/30 border border-white/10 rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Badges */}
                  <div className="flex items-center justify-center gap-6 pt-4 mt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
                      <span className="text-xs">SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                      <span className="text-xs">PCI Compliant</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <span className="material-symbols-outlined text-[16px] text-primary">shield</span>
                      <span className="text-xs">Fraud Protection</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Price Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-surface-dark/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sticky top-24">
                <h2 className="text-white text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt</span>
                  Price Details
                </h2>

                <div className="space-y-4 mb-6">
                  {/* Ticket Breakdown */}
                  {selectedSeats &&
                    Object.entries(
                      selectedSeats.reduce((acc, seat) => {
                        const type = seat.seat_type
                        if (!acc[type]) acc[type] = { count: 0, price: seat.price }
                        acc[type].count++
                        return acc
                      }, {} as { [key: string]: { count: number; price: number } })
                    ).map(([type, { count, price }]) => (
                      <div key={type} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`size-3 rounded-full ${
                            type === 'vip' ? 'bg-amber-400' : type === 'premium' ? 'bg-primary' : 'bg-cyan-400'
                          }`}></span>
                          <span className="text-text-secondary text-sm capitalize">
                            {type} × {count}
                          </span>
                        </div>
                        <span className="text-white font-medium">${(count * price).toFixed(2)}</span>
                      </div>
                    ))}
                  
                  <div className="h-px bg-white/5 my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Subtotal</span>
                    <span className="text-white">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Convenience Fee</span>
                    <span className="text-white">${convenienceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Taxes & Fees</span>
                    <span className="text-white">${taxes.toFixed(2)}</span>
                  </div>
                </div>

                <div className="h-px bg-white/10 mb-5"></div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-primary text-3xl font-bold">${finalAmount.toFixed(2)}</span>
                </div>

                <button
                  onClick={handlePayment}
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-[#b90e1c] hover:to-primary text-white font-bold tracking-wide uppercase text-sm transition-all shadow-[0_4px_20px_-5px_rgba(236,19,37,0.4)] hover:shadow-[0_6px_25px_-5px_rgba(236,19,37,0.6)] transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    Pay ${finalAmount.toFixed(2)}
                  </span>
                </button>

                <p className="text-text-secondary/70 text-xs text-center mt-4 font-body">
                  By completing this purchase, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>

                {/* Promo Code */}
                <div className="mt-6 pt-5 border-t border-white/5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="flex-1 bg-black/30 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary transition-all"
                    />
                    <button className="px-4 py-2.5 bg-surface-highlight hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
