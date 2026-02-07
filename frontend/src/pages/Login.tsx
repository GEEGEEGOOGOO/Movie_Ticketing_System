import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authAPI, pingAPI } from '../api/client'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, logout, isAuthenticated } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [isReady, setIsReady] = useState(false)

  // Check auth state on mount and redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    
    // If no token, clear any stale auth state and show login
    if (!token) {
      if (isAuthenticated) {
        logout()
      }
      setIsReady(true)
      return
    }
    
    // If has token and authenticated, redirect
    if (token && isAuthenticated) {
      const params = new URLSearchParams(location.search)
      const redirect = params.get('redirect')
      const safeRedirect = redirect && redirect.startsWith('/') && !redirect.startsWith('/login')
        ? decodeURIComponent(redirect)
        : '/home'
      navigate(safeRedirect, { replace: true })
      return
    }
    
    // If has token but not authenticated in store, show login (token may be invalid)
    setIsReady(true)
  }, [isAuthenticated, navigate, location.search, logout])

  // Backend health check
  useEffect(() => {
    let isMounted = true
    
    const checkBackend = async () => {
      try {
        const ok = await pingAPI()
        if (isMounted) {
          setBackendStatus(ok ? 'online' : 'offline')
        }
      } catch {
        if (isMounted) setBackendStatus('offline')
      }
    }

    checkBackend()
    const interval = setInterval(checkBackend, 10000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: { email?: string; password?: string; name?: string; general?: string } = {}
    
    // Simple validation - just check if fields are filled
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (isRegister && !name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      if (isRegister) {
        await authAPI.register({
          email: email.trim().toLowerCase(),
          password,
          full_name: name.trim(),
          role: 'customer'
        })
      }

      const authResponse = await authAPI.login(email.trim().toLowerCase(), password)
      localStorage.setItem('token', authResponse.access_token)
      
      const user = await authAPI.getMe()
      
      const params = new URLSearchParams(location.search)
      const redirect = params.get('redirect')
      const safeRedirect = redirect && redirect.startsWith('/') && !redirect.startsWith('/login')
        ? decodeURIComponent(redirect)
        : '/home'
      login(user, authResponse.access_token)
      navigate(safeRedirect, { replace: true })
      
    } catch (error: any) {
      let message = 'Authentication failed. Please try again.'
      
      const detail = error?.response?.data?.detail
      if (detail) {
        // Handle Pydantic validation errors (422) which come as array
        if (Array.isArray(detail)) {
          message = detail.map((err: any) => err.msg || err.message || String(err)).join(', ')
        } else if (typeof detail === 'string') {
          message = detail
        } else if (typeof detail === 'object') {
          message = detail.msg || detail.message || JSON.stringify(detail)
        }
      } else if (error?.response?.status === 400) {
        message = isRegister ? 'Email already registered' : 'Invalid credentials'
      } else if (error?.response?.status === 401) {
        message = 'Invalid email or password'
      } else if (error?.response?.status === 422) {
        message = 'Invalid input. Please check your details.'
      } else if (!error?.response) {
        message = 'Cannot reach server. Is the backend running?'
        setBackendStatus('offline')
      }
      
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking auth
  if (!isReady) {
    return (
      <div className="bg-background-dark font-display text-white overflow-hidden h-screen w-full flex items-center justify-center">
        <div className="animate-pulse text-primary-light">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-background-dark font-display text-white overflow-hidden h-screen w-full relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-[6px] scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDwACjs1qnhw5haMslnQPGHQAJ14Km6J0TemLmi26AWdbb2rERZwZMbAkVucyO7Hd3X1YLfi-KtLWP7JjUN2UXsEI2mX6qa9Mt3j4zpGM3Y7O9Ieg4acghIR5AxnHzlD-HrRR0BQ6b4g1fquwoIHcvqiDFJ-j8BcC69Rn3DlgAMIQNrVHStCMRZQiqr16e--4EWKduQm3jIMEzLpj1kerC5QTmq3tY1amDbnMz64bPWB9MpJBqua3kojuxyOeu3kyEKxpiMq9evY8I')`
          }}
        />
        <div className="absolute inset-0 bg-black/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-blue-900/20 to-background-dark/90"></div>
      </div>

      <main className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
        {/* Login Card */}
        <div className="w-full max-w-[440px] bg-surface-dark/50 backdrop-blur-2xl border border-blue-500/20 rounded-2xl shadow-[0_0_50px_-10px_rgba(35,75,158,0.5)] p-8 md:p-10 relative overflow-hidden group">
          {/* Decorative glows */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-all duration-700"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px]"></div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex flex-col items-center justify-center mb-10">
              <div className="size-14 text-primary-light drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] mb-4">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">CineBook</h1>
              <p className="text-text-secondary text-sm mt-2 font-body">Your front row seat awaits.</p>
            </div>

            {/* Status Badge - Always show Mock Mode */}
            <div className="flex items-center justify-center gap-2 mb-4 p-2 rounded-lg bg-surface-dark/50">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-text-secondary text-xs">Mock Mode - Any Email Accepted</span>
            </div>

            {errors.general && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-6">
                <p className="text-primary text-sm text-center">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {isRegister && (
                <div className="group/input">
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1 group-focus-within/input:text-primary transition-colors">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within/input:text-white transition-colors material-symbols-outlined text-[20px]">person</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      disabled={isLoading}
                      className={`w-full bg-black/30 border rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 font-body text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 ${errors.name ? 'border-primary-light' : 'border-white/10'}`}
                    />
                  </div>
                  {errors.name && <p className="text-primary text-xs mt-1 ml-1">{errors.name}</p>}
                </div>
              )}

              <div className="group/input">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1 group-focus-within/input:text-primary transition-colors">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within/input:text-white transition-colors material-symbols-outlined text-[20px]">mail</span>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@example.com or steve@123.com"
                    disabled={isLoading}
                    className={`w-full bg-black/30 border rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 font-body text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 ${errors.email ? 'border-primary-light' : 'border-white/10'}`}
                  />
                </div>
                {errors.email && <p className="text-primary text-xs mt-1 ml-1">{errors.email}</p>}
              </div>

              <div className="group/input">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1 group-focus-within/input:text-primary transition-colors">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within/input:text-white transition-colors material-symbols-outlined text-[20px]">lock</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={`w-full bg-black/30 border rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 font-body text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 ${errors.password ? 'border-primary-light' : 'border-white/10'}`}
                  />
                </div>
                {errors.password && <p className="text-primary text-xs mt-1 ml-1">{errors.password}</p>}
              </div>

              {!isRegister && (
                <div className="flex justify-end">
                  <a className="text-xs text-text-secondary hover:text-white transition-colors font-medium" href="#">Forgot Password?</a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`mt-2 w-full py-3.5 rounded-lg font-bold tracking-wide uppercase text-sm transition-all duration-300 ${
                  isLoading
                    ? 'bg-surface-highlight text-text-secondary cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-primary-light hover:to-blue-600 text-white shadow-[0_4px_20px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_25px_-5px_rgba(59,130,246,0.6)] transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isRegister ? 'Creating Account...' : 'Logging In...'}
                  </span>
                ) : isRegister ? 'Sign Up' : 'Log In'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
              <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Or continue with</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg py-2.5 transition-all text-sm font-medium text-gray-200 group"
              >
                <svg className="w-5 h-5 fill-current group-hover:text-white transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"></path>
                </svg>
                Google
              </button>
              <button 
                type="button"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg py-2.5 transition-all text-sm font-medium text-gray-200 group"
              >
                <svg className="w-5 h-5 fill-current group-hover:text-white transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.35-.16-1.07-.16-1.42 0-1.03.48-2.1.55-3.08-.4-1.96-1.91-1.71-5.35.79-6.6.7-.35 1.54-.33 2.15.11.23.17.65.17.88 0 .61-.44 1.45-.46 2.15-.11 1.76.88 2.47 2.92 1.6 4.6l-.06.11c-.53 1.07-.63 1.34-1.07 1.89H17.05zm-3.8-13.6c.55 0 1.25.17 1.65.65.4.52.4 1.36.08 2.06-.43.91-1.5.9-1.91.88-1.03-.05-1.9-.93-1.88-1.98.02-1.07 1.09-1.59 2.06-1.61z"></path>
                </svg>
                Apple
              </button>
            </div>

            {/* Toggle Mode */}
            <div className="mt-8 text-center">
              <p className="text-sm text-text-secondary">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister)
                    setErrors({})
                  }}
                  disabled={isLoading}
                  className="text-white font-bold hover:text-primary transition-colors ml-1"
                >
                  {isRegister ? 'Log In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-xs text-text-secondary/50">
          © 2024 CineBook Inc.
        </div>
      </main>
    </div>
  )
}
