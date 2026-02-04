import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Chat() {
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your CineBook AI assistant. I can help you find movies, book tickets, or answer questions about showtimes. What would you like to do today?',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'I found some great options for you! Here are the top movies showing today: "Dune: Part Two", "Oppenheimer", and "The Batman". Would you like to see showtimes for any of these?',
        'Great choice! I can help you book tickets for that. Which theater would you prefer - CineMax Downtown, Regal Cinemas, or AMC Plaza?',
        'Based on your preferences, I recommend "Inception" - it\'s a mind-bending thriller that\'s highly rated. There are shows at 2:30 PM, 6:00 PM, and 9:30 PM. Would you like to book tickets?',
      ]
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const breadcrumbs = [
    { label: 'Home', href: '/home' },
    { label: 'AI Assistant' }
  ]

  const quickActions = [
    { icon: 'movie', label: 'Browse Movies', action: () => navigate('/movies') },
    { icon: 'confirmation_number', label: 'My Bookings', action: () => navigate('/dashboard') },
    { icon: 'mic', label: 'Voice Chat', action: () => navigate('/voice') },
  ]

  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      <Header breadcrumbs={breadcrumbs} />

      {/* Chat Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-primary' 
                    : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                }`}>
                  <span className="material-symbols-outlined text-white text-lg">
                    {message.role === 'user' ? 'person' : 'smart_toy'}
                  </span>
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'glass-panel'
                }`}>
                  <p className={message.role === 'user' ? 'text-white' : 'text-white'}>
                    {message.content}
                  </p>
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-text-secondary'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg">smart_toy</span>
                </div>
                <div className="glass-panel rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex gap-2 mb-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex items-center gap-2 px-4 py-2 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-full text-text-secondary hover:text-white text-sm transition-colors"
              >
                <span className="material-symbols-outlined text-base">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface-dark border-t border-white/10">
          <form onSubmit={handleSend} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about movies or bookings..."
                className="w-full px-5 py-4 bg-background-dark border border-white/10 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-4 bg-primary hover:bg-primary/90 disabled:bg-surface-highlight disabled:text-text-secondary rounded-xl text-white font-semibold transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
