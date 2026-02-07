import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function BookingConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const ticketRef = useRef<HTMLDivElement>(null)
  
  // Extract data from location state (passed from Payment page)
  const state = location.state || {}
  const { booking, showtime, selectedSeats, paymentConfirmation } = state
  
  // Provide default values for missing data
  const bookingReference = paymentConfirmation?.booking_reference || booking?.booking_reference || 'BK' + Date.now().toString().slice(-6)
  const transactionId = paymentConfirmation?.transaction_id || 'TXN' + Date.now()
  const totalAmount = Number(paymentConfirmation?.amount || booking?.total_amount || 0)
  const movieTitle = showtime?.movie?.title || 'Unknown Movie'
  const theaterName = showtime?.screen?.theater?.name || 'Unknown Theater'
  const screenName = showtime?.screen?.name || 'Screen 1'
  const showtimeDate = showtime?.start_time ? new Date(showtime.start_time) : new Date()
  const posterUrl = showtime?.movie?.poster_url || ''
  const seats = selectedSeats || []
  const paymentMethod = paymentConfirmation?.payment_method || 'card'

  const generatePDF = async () => {
    if (!ticketRef.current) return
    
    setIsGeneratingPDF(true)
    
    try {
      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // PDF Colors
      const primaryColor = '#3b82f6'
      const darkBg = '#0f172a'
      const textWhite = '#ffffff'
      const textGray = '#94a3b8'
      
      // Header background
      pdf.setFillColor(15, 23, 42)
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')
      
      // Header Section
      pdf.setFillColor(30, 41, 59)
      pdf.rect(0, 0, pageWidth, 45, 'F')
      
      // Logo/Title
      pdf.setTextColor(59, 130, 246)
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('CineBook', 15, 20)
      
      pdf.setTextColor(148, 163, 184)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Movie E-Ticket', 15, 28)
      
      // Confirmed badge
      pdf.setFillColor(34, 197, 94)
      pdf.roundedRect(pageWidth - 50, 12, 35, 10, 2, 2, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'bold')
      pdf.text('CONFIRMED', pageWidth - 45, 18.5)
      
      // Booking Reference Section
      let y = 55
      pdf.setTextColor(148, 163, 184)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Booking Reference', 15, y)
      
      pdf.setTextColor(59, 130, 246)
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.text(bookingReference, 15, y + 8)
      
      // Transaction ID
      pdf.setTextColor(148, 163, 184)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Transaction ID', pageWidth - 60, y)
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(10)
      pdf.text(transactionId, pageWidth - 60, y + 7)
      
      // Divider
      y += 20
      pdf.setDrawColor(51, 65, 85)
      pdf.setLineWidth(0.3)
      pdf.line(15, y, pageWidth - 15, y)
      
      // Movie Details Section
      y += 12
      pdf.setFillColor(30, 41, 59)
      pdf.roundedRect(15, y, pageWidth - 30, 60, 3, 3, 'F')
      
      // Movie Title
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text(movieTitle, 25, y + 15)
      
      // Details grid
      const detailsY = y + 28
      const col1 = 25
      const col2 = 80
      const col3 = 135
      
      // Date
      pdf.setTextColor(148, 163, 184)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text('DATE', col1, detailsY)
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text(showtimeDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), col1, detailsY + 7)
      
      // Time
      pdf.setTextColor(148, 163, 184)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text('TIME', col2, detailsY)
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text(showtimeDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), col2, detailsY + 7)
      
      // Screen
      pdf.setTextColor(148, 163, 184)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text('SCREEN', col3, detailsY)
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text(screenName, col3, detailsY + 7)
      
      // Theater row
      const theaterY = detailsY + 18
      pdf.setTextColor(148, 163, 184)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text('THEATER', col1, theaterY)
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text(theaterName, col1, theaterY + 7)
      
      // Seats
      pdf.setTextColor(148, 163, 184)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text('SEATS', col2, theaterY)
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      const seatsList = seats.length > 0 
        ? seats.map((s: any) => `${s.row}${s.number}`).join(', ')
        : 'N/A'
      pdf.text(seatsList, col2, theaterY + 7)
      
      // Tickets count
      pdf.setTextColor(148, 163, 184)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text('TICKETS', col3, theaterY)
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${seats.length || 1} Ticket(s)`, col3, theaterY + 7)
      
      // Payment Details Section
      y += 75
      pdf.setFillColor(30, 41, 59)
      pdf.roundedRect(15, y, pageWidth - 30, 35, 3, 3, 'F')
      
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Payment Details', 25, y + 12)
      
      pdf.setTextColor(148, 163, 184)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Payment Method: ${paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod.toUpperCase()}`, 25, y + 22)
      pdf.text('Payment Status: Completed', 25, y + 30)
      
      // Total Amount
      pdf.setTextColor(34, 197, 94)
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`$${totalAmount.toFixed(2)}`, pageWidth - 50, y + 22)
      pdf.setTextColor(148, 163, 184)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Total Paid', pageWidth - 50, y + 30)
      
      // QR Code placeholder (simulated)
      y += 50
      pdf.setFillColor(255, 255, 255)
      pdf.roundedRect(pageWidth/2 - 25, y, 50, 50, 2, 2, 'F')
      
      // QR code pattern (simplified grid pattern)
      pdf.setFillColor(0, 0, 0)
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (Math.random() > 0.5) {
            pdf.rect(pageWidth/2 - 22 + i*4.4, y + 3 + j*4.4, 4, 4, 'F')
          }
        }
      }
      
      // Instructions
      y += 60
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Important Instructions', 15, y)
      
      y += 8
      pdf.setTextColor(148, 163, 184)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      const instructions = [
        '• Arrive at the theater at least 15 minutes before showtime',
        '• Carry a valid government ID for verification',
        '• Outside food & beverages are not allowed',
        '• Cancellations before showtime are eligible for simulated refunds'
      ]
      instructions.forEach((inst, idx) => {
        pdf.text(inst, 15, y + (idx * 7))
      })
      
      // Footer
      pdf.setTextColor(100, 116, 139)
      pdf.setFontSize(8)
      pdf.text('Generated by CineBook | www.cinebook.com', pageWidth / 2, pageHeight - 15, { align: 'center' })
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
      
      // Save PDF
      pdf.save(`CineBook_Ticket_${bookingReference}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try printing instead.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const breadcrumbs = [
    { label: 'Home', href: '/home' },
    { label: 'Movies', href: '/movies' },
    { label: 'Booking Confirmed' }
  ]

  return (
    <div className="min-h-screen bg-background-dark">
      <Header breadcrumbs={breadcrumbs} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Icon */}
        <div className="text-center mb-10">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(34,197,94,0.5)]">
            <span className="material-symbols-outlined text-white" style={{ fontSize: '80px', fontVariationSettings: "'FILL' 1" }}>
              check
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-text-secondary">Your tickets have been booked successfully</p>
        </div>

        {/* Main Confirmation Card */}
        <div className="glass-panel p-8 mb-8">
          {/* Ticket Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
            <div>
              <p className="text-text-secondary text-sm mb-1">Booking Reference</p>
              <p className="text-2xl font-bold text-primary tracking-wider">{bookingReference}</p>
            </div>
            <div className="text-right">
              <p className="text-text-secondary text-sm mb-1">Transaction ID</p>
              <p className="text-white font-mono text-sm">{transactionId}</p>
            </div>
          </div>

          {/* Movie & Booking Details */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            {/* Poster */}
            <div className="w-32 h-48 sm:w-40 sm:h-60 bg-surface-dark rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0 shadow-lg">
              {posterUrl ? (
                <img src={posterUrl} alt={movieTitle} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-text-secondary text-4xl">movie</span>
                </div>
              )}
            </div>

            {/* Details Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
              <div className="col-span-1 sm:col-span-2">
                <p className="text-text-secondary text-sm">Movie</p>
                <p className="text-white font-semibold text-lg sm:text-xl">{movieTitle}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Theater</p>
                <p className="text-white">{theaterName}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Screen</p>
                <p className="text-white">{screenName}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Date & Time</p>
                <p className="text-white">
                  {new Date(showtime).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Seats</p>
                <p className="text-cyan-400 font-semibold text-lg">
                  {selectedSeats.map((seat: any) => 
                    typeof seat === 'string' ? seat : `${seat.row}${seat.number}`
                  ).join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code & Amount */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-surface-dark rounded-xl p-6 gap-6 sm:gap-4">
            {/* QR Code Placeholder */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center p-2 shadow-md">
                <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Scan this QR code</p>
                <p className="text-white text-sm">at the theater entrance</p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="text-center sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-white/10 pt-4 sm:pt-0">
              <p className="text-text-secondary text-sm">Total Paid</p>
              <p className="text-3xl font-bold text-green-400">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="glass-panel p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-8 rounded flex items-center justify-center ${
                paymentMethod === 'card' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800' 
                  : paymentMethod === 'gpay'
                  ? 'bg-white'
                  : 'bg-surface-highlight'
              }`}>
                {paymentMethod === 'card' && <span className="text-white text-xs font-bold">VISA</span>}
                {paymentMethod === 'gpay' && <span className="text-xl">G</span>}
                {paymentMethod !== 'card' && paymentMethod !== 'gpay' && (
                  <span className="material-symbols-outlined text-white text-sm">payments</span>
                )}
              </div>
              <div>
                <p className="text-white">
                  {paymentMethod === 'card' ? '•••• •••• •••• 4242' : 
                   paymentMethod === 'gpay' ? 'Google Pay' : 'Payment Method'}
                </p>
                <p className="text-text-secondary text-sm">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="material-symbols-outlined">verified</span>
              <span className="font-semibold">Payment Successful</span>
            </div>
          </div>
        </div>

        {/* Email Notification */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">mail</span>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Confirmation Email Sent</h3>
              <p className="text-text-secondary text-sm">
                A confirmation email with your e-ticket has been sent to your registered email address.
                Please show this booking reference or the e-ticket at the theater entrance.
              </p>
            </div>
          </div>
        </div>

        {/* Important Instructions */}
        <div className="glass-panel p-6 mb-10">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">info</span>
            Important Instructions
          </h3>
          <ul className="space-y-3">
            {[
              'Arrive at the theater at least 15 minutes before showtime',
              'Carry a valid government ID for verification',
              'Outside food & beverages are not allowed',
              'Cancellations before showtime are eligible for simulated refunds'
            ].map((instruction, index) => (
              <li key={index} className="flex items-start gap-3 text-text-secondary">
                <span className="material-symbols-outlined text-text-secondary text-sm mt-0.5">chevron_right</span>
                {instruction}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">{isGeneratingPDF ? 'hourglass_empty' : 'picture_as_pdf'}</span>
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-xl text-white transition-colors"
          >
            <span className="material-symbols-outlined">print</span>
            Print Ticket
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-xl text-white transition-colors"
          >
            <span className="material-symbols-outlined">confirmation_number</span>
            My Bookings
          </button>
          
          <button
            onClick={() => navigate('/movies')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold transition-colors"
          >
            <span className="material-symbols-outlined">movie</span>
            Book Another
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
