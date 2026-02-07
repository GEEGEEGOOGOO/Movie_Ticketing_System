import { useState, useRef, useEffect } from 'react'
import { WavRecorder } from '../utils/audioRecorder'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function AiAssistantModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat')

    // Chat state
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! I\'m your movie assistant. Ask me about movies, showtimes, or help with booking!' }
    ])
    const [input, setInput] = useState('')
    const [isChatLoading, setIsChatLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Voice state
    const [isListening, setIsListening] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [voiceResponse, setVoiceResponse] = useState('')
    const recorderRef = useRef<WavRecorder | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Chat handlers
    const handleSendMessage = async () => {
        if (!input.trim() || isChatLoading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsChatLoading(true)

        try {
            // Use the LLM endpoint for chat
            const response = await fetch('http://localhost:8002/api/voice/chat/text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            })

            if (!response.ok) {
                // Fallback to simulated response
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: `I'd be happy to help you with "${userMessage}". Let me search for that information...`
                    }])
                    setIsChatLoading(false)
                }, 1000)
                return
            }

            const data = await response.json()
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        } catch {
            // Fallback response
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I can help you find movies! Try browsing our collection or ask about specific genres.'
            }])
        } finally {
            setIsChatLoading(false)
        }
    }

    // Voice handlers
    const handleVoiceToggle = async () => {
        if (isProcessing) return

        if (!isListening) {
            setIsListening(true)
            setTranscript('')
            setVoiceResponse('')

            try {
                recorderRef.current = new WavRecorder({ sampleRate: 16000 })
                await recorderRef.current.start()
            } catch (err) {
                console.error('Mic error:', err)
                setIsListening(false)
            }
        } else {
            setIsListening(false)
            setIsProcessing(true)

            try {
                if (!recorderRef.current) throw new Error('No recorder')
                const audioBlob = await recorderRef.current.stop()

                const formData = new FormData()
                formData.append('audio', audioBlob, 'recording.wav')

                const res = await fetch('http://localhost:8002/api/voice/chat', {
                    method: 'POST',
                    body: formData,
                })

                if (res.ok) {
                    const data = await res.json()
                    setTranscript(data.user_text)
                    setVoiceResponse(data.agent_response)

                    // Also add to chat history
                    setMessages(prev => [
                        ...prev,
                        { role: 'user', content: data.user_text },
                        { role: 'assistant', content: data.agent_response }
                    ])

                    // Play audio
                    if (data.audio_base64 && audioRef.current) {
                        audioRef.current.src = `data:${data.audio_type};base64,${data.audio_base64}`
                        audioRef.current.play()
                    }
                }
            } catch (err) {
                console.error('Voice error:', err)
            } finally {
                setIsProcessing(false)
            }
        }
    }

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
          bg-gradient-to-br from-primary to-purple-700
          shadow-lg shadow-primary/30 hover:shadow-primary/50
          flex items-center justify-center
          transition-all duration-300 hover:scale-110
          ${isOpen ? 'rotate-45' : ''}
        `}
                aria-label="AI Assistant"
            >
                <span className="material-symbols-outlined text-white text-2xl">
                    {isOpen ? 'close' : 'smart_toy'}
                </span>
            </button>

            {/* Modal Panel */}
            <div className={`
        fixed bottom-24 right-6 z-40
        w-96 h-[32rem] max-h-[80vh]
        bg-surface-dark/95 backdrop-blur-xl
        rounded-2xl border border-white/10
        shadow-2xl shadow-black/50
        flex flex-col
        transition-all duration-300 ease-out
        ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}>
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">smart_toy</span>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">CineBot</h3>
                            <p className="text-text-secondary text-xs">Your movie assistant</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2
                ${activeTab === 'chat'
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-highlight text-text-secondary hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-lg">chat</span>
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('voice')}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2
                ${activeTab === 'voice'
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-highlight text-text-secondary hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-lg">mic</span>
                            Voice
                        </button>
                    </div>
                </div>

                {/* Hidden audio element */}
                <audio ref={audioRef} className="hidden" />

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {activeTab === 'chat' ? (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm
                      ${msg.role === 'user'
                                                ? 'bg-primary text-white rounded-br-md'
                                                : 'bg-surface-highlight text-white rounded-bl-md'}`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isChatLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-surface-highlight px-4 py-2 rounded-2xl rounded-bl-md">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t border-white/10">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ask about movies..."
                                        className="flex-1 bg-surface-highlight border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder:text-text-secondary focus:outline-none focus:border-primary"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!input.trim() || isChatLoading}
                                        className="w-10 h-10 bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-xl flex items-center justify-center transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-white">send</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Voice Tab */
                        <div className="flex-1 flex flex-col items-center justify-center p-6">
                            {/* Voice Button */}
                            <div className="relative mb-6">
                                {isListening && (
                                    <>
                                        <div className="absolute inset-0 w-28 h-28 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '1.5s' }}></div>
                                        <div className="absolute inset-0 w-28 h-28 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s' }}></div>
                                    </>
                                )}
                                <button
                                    onClick={handleVoiceToggle}
                                    disabled={isProcessing}
                                    className={`
                    relative w-28 h-28 rounded-full transition-all duration-300
                    ${isProcessing
                                            ? 'bg-gradient-to-br from-yellow-600 to-orange-700 cursor-wait'
                                            : isListening
                                                ? 'bg-gradient-to-br from-primary to-red-700 shadow-lg shadow-primary/50'
                                                : 'bg-gradient-to-br from-surface-dark to-surface-highlight border-2 border-white/10 hover:border-primary/50'
                                        }
                  `}
                                >
                                    <span className={`material-symbols-outlined text-4xl ${isProcessing ? 'animate-spin text-white' : isListening ? 'text-white' : 'text-primary'}`}>
                                        {isProcessing ? 'sync' : isListening ? 'graphic_eq' : 'mic'}
                                    </span>
                                </button>
                            </div>

                            <p className="text-white text-lg mb-1">
                                {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Tap to speak'}
                            </p>
                            <p className="text-text-secondary text-sm text-center">
                                {isProcessing ? 'Generating response' : isListening ? 'Tap again when done' : 'Ask about movies or bookings'}
                            </p>

                            {/* Voice Results */}
                            {(transcript || voiceResponse) && (
                                <div className="mt-4 w-full space-y-2 text-sm">
                                    {transcript && (
                                        <div className="bg-surface-highlight/50 p-3 rounded-lg">
                                            <p className="text-text-secondary text-xs mb-1">You said:</p>
                                            <p className="text-white">{transcript}</p>
                                        </div>
                                    )}
                                    {voiceResponse && (
                                        <div className="bg-primary/20 p-3 rounded-lg">
                                            <p className="text-text-secondary text-xs mb-1">Assistant:</p>
                                            <p className="text-white">{voiceResponse}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
