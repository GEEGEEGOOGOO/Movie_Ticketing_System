import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function Voice() {
  const navigate = useNavigate()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [pulseScale, setPulseScale] = useState(1)

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setPulseScale(1 + Math.random() * 0.3)
      }, 150)
      return () => clearInterval(interval)
    }
  }, [isListening])

  const handleStartStop = () => {
    if (!isListening) {
      setIsListening(true)
      setTranscript('')
      setResponse('')
      
      // Simulate voice recognition
      setTimeout(() => {
        setTranscript('Show me action movies playing tonight')
        setTimeout(() => {
          setResponse('I found several action movies for you tonight! "Dune: Part Two" at 7:30 PM, "The Batman" at 8:00 PM, and "Mission: Impossible" at 9:15 PM. Would you like to book tickets for any of these?')
          setIsListening(false)
          setPulseScale(1)
        }, 1000)
      }, 2500)
    } else {
      setIsListening(false)
      setPulseScale(1)
    }
  }

  const breadcrumbs = [
    { label: 'Home', href: '/home' },
    { label: 'Voice Assistant' }
  ]

  const suggestedCommands = [
    'Show me action movies',
    'What\'s playing tonight?',
    'Book tickets for Dune',
    'Find movies near me',
    'Show my bookings',
  ]

  return (
    <div className="min-h-screen bg-background-dark">
      <Header breadcrumbs={breadcrumbs} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Voice Assistant</h1>
          <p className="text-text-secondary">Speak naturally to find movies and book tickets</p>
        </div>

        {/* Microphone Section */}
        <div className="flex flex-col items-center mb-12">
          {/* Animated Ring */}
          <div className="relative mb-8">
            {/* Outer pulse rings */}
            {isListening && (
              <>
                <div className="absolute inset-0 w-48 h-48 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '1.5s' }}></div>
                <div className="absolute inset-0 w-48 h-48 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
              </>
            )}
            
            {/* Main button */}
            <button
              onClick={handleStartStop}
              className={`
                relative w-48 h-48 rounded-full font-bold transition-all duration-300
                ${isListening 
                  ? 'bg-gradient-to-br from-primary to-red-700 shadow-lg shadow-primary/50' 
                  : 'bg-gradient-to-br from-surface-dark to-surface-highlight border-2 border-white/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20'
                }
              `}
              style={{ transform: `scale(${pulseScale})` }}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              <span className={`material-symbols-outlined text-6xl ${isListening ? 'text-white' : 'text-primary'}`}>
                {isListening ? 'graphic_eq' : 'mic'}
              </span>
            </button>
          </div>

          <p className="text-white text-xl mb-2 text-center">
            {isListening ? 'Listening...' : 'Tap to speak'}
          </p>
          <p className="text-text-secondary text-sm">
            {isListening ? 'Say something or tap again to stop' : 'Ask about movies, showtimes, or bookings'}
          </p>
        </div>

        {/* Transcript & Response */}
        {(transcript || response) && (
          <div className="space-y-4 mb-12">
            {transcript && (
              <div className="glass-panel p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white">person</span>
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm mb-1">You said</p>
                    <p className="text-white text-lg">{transcript}</p>
                  </div>
                </div>
              </div>
            )}

            {response && (
              <div className="glass-panel p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white">smart_toy</span>
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Assistant</p>
                    <p className="text-white text-lg">{response}</p>
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => navigate('/movies')}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white text-sm transition-colors"
                      >
                        Browse Movies
                      </button>
                      <button className="px-4 py-2 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-lg text-white text-sm transition-colors">
                        Ask Another Question
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Suggested Commands */}
        {!transcript && !response && (
          <div className="glass-panel p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              Try saying
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggestedCommands.map((command, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setTranscript(command)
                    setResponse('I can help with that! Let me search for the best options for you...')
                  }}
                  className="px-4 py-2 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-full text-text-secondary hover:text-white text-sm transition-colors"
                >
                  "{command}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <button
            onClick={() => navigate('/chat')}
            className="glass-panel p-6 text-left hover:bg-surface-highlight/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-cyan-400">chat</span>
            </div>
            <h4 className="text-white font-semibold mb-1">Text Chat</h4>
            <p className="text-text-secondary text-sm">Prefer typing? Switch to text chat</p>
          </button>

          <button
            onClick={() => navigate('/movies')}
            className="glass-panel p-6 text-left hover:bg-surface-highlight/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary">movie</span>
            </div>
            <h4 className="text-white font-semibold mb-1">Browse Movies</h4>
            <p className="text-text-secondary text-sm">Explore all movies manually</p>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="glass-panel p-6 text-left hover:bg-surface-highlight/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-green-400">confirmation_number</span>
            </div>
            <h4 className="text-white font-semibold mb-1">My Bookings</h4>
            <p className="text-text-secondary text-sm">View your ticket history</p>
          </button>
        </div>
      </main>
    </div>
  )
}
