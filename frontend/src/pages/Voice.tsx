import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { WavRecorder } from '../utils/audioRecorder'

export default function Voice() {
  const navigate = useNavigate()
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [pulseScale, setPulseScale] = useState(1)
  const recorderRef = useRef<WavRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setPulseScale(1 + Math.random() * 0.3)
      }, 150)
      return () => clearInterval(interval)
    }
  }, [isListening])

  const handleStartStop = async () => {
    if (isProcessing) return

    if (!isListening) {
      // Start recording
      setIsListening(true)
      setTranscript('')
      setResponse('')
      setError('')

      try {
        recorderRef.current = new WavRecorder({ sampleRate: 16000 })
        await recorderRef.current.start()
      } catch (err) {
        console.error('Failed to start recording:', err)
        setError('Microphone access denied. Please allow microphone access.')
        setIsListening(false)
      }
    } else {
      // Stop recording and process
      setIsListening(false)
      setPulseScale(1)
      setIsProcessing(true)

      try {
        if (!recorderRef.current) throw new Error('No recorder')

        const audioBlob = await recorderRef.current.stop()

        // Send to backend
        const formData = new FormData()
        formData.append('audio', audioBlob, 'recording.wav')

        const res = await fetch('http://localhost:8002/api/voice/chat', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.detail || 'Voice processing failed')
        }

        const data = await res.json()
        setTranscript(data.user_text)
        setResponse(data.agent_response)

        // Play audio response
        if (data.audio_base64) {
          const audioSrc = `data:${data.audio_type};base64,${data.audio_base64}`
          if (audioRef.current) {
            audioRef.current.src = audioSrc
            audioRef.current.play()
          }
        }
      } catch (err) {
        console.error('Voice processing error:', err)
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsProcessing(false)
      }
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

      {/* Hidden audio element for TTS playback */}
      <audio ref={audioRef} className="hidden" />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Voice Assistant</h1>
          <p className="text-text-secondary">Speak naturally to find movies and book tickets</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

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
              disabled={isProcessing}
              className={`
                relative w-48 h-48 rounded-full font-bold transition-all duration-300
                ${isProcessing
                  ? 'bg-gradient-to-br from-yellow-600 to-orange-700 cursor-wait'
                  : isListening
                    ? 'bg-gradient-to-br from-primary to-red-700 shadow-lg shadow-primary/50'
                    : 'bg-gradient-to-br from-surface-dark to-surface-highlight border-2 border-white/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20'
                }
              `}
              style={{ transform: `scale(${pulseScale})` }}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              <span className={`material-symbols-outlined text-6xl ${isProcessing ? 'text-white animate-spin' : isListening ? 'text-white' : 'text-primary'}`}>
                {isProcessing ? 'sync' : isListening ? 'graphic_eq' : 'mic'}
              </span>
            </button>
          </div>

          <p className="text-white text-xl mb-2 text-center">
            {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Tap to speak'}
          </p>
          <p className="text-text-secondary text-sm">
            {isProcessing ? 'Transcribing and generating response' : isListening ? 'Tap again when done speaking' : 'Ask about movies, showtimes, or bookings'}
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
                      <button
                        onClick={() => {
                          setTranscript('')
                          setResponse('')
                        }}
                        className="px-4 py-2 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-lg text-white text-sm transition-colors"
                      >
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
        {!transcript && !response && !isListening && !isProcessing && (
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
                    setResponse('Click the microphone and speak this command to try it!')
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
