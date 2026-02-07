import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuthStore } from '../store/authStore'
import { useLocationStore } from '../store/locationStore'
import { authAPI } from '../api/client'

export default function Profile() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const { city, coordinates, requestLocationAndSave, isLoading, error } = useLocationStore()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    if (!user) {
      authAPI.getMe()
        .then((me) => setUser(me))
        .catch(() => {
          navigate('/login')
        })
    }
  }, [user, setUser, navigate])

  const displayName = user?.full_name || user?.email?.split('@')[0] || 'User'
  const roleLabel = user?.role === 'owner' ? 'Owner' : 'Customer'

  return (
    <div className="min-h-screen bg-background-dark">
      <Header breadcrumbs={[{ label: 'Home', href: '/home' }, { label: 'Profile' }]} showSearch={false} />

      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile</h1>
            <p className="text-text-secondary text-sm sm:text-base">Manage your account and preferences</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-lg bg-surface-highlight hover:bg-primary text-white text-sm font-semibold transition-colors"
            >
              My Bookings
            </button>
            {user?.role === 'owner' && (
              <button
                onClick={() => navigate('/owner/dashboard')}
                className="px-4 py-2 rounded-lg bg-surface-highlight hover:bg-primary text-white text-sm font-semibold transition-colors"
              >
                Owner Dashboard
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-surface-highlight flex items-center justify-center text-lg font-bold text-text-secondary">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">{displayName}</h2>
                <p className="text-text-secondary text-sm">{roleLabel}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-dark/60 border border-white/5 rounded-xl p-4">
                <p className="text-text-secondary text-xs mb-1">Full Name</p>
                <p className="text-white text-sm font-semibold">{displayName}</p>
              </div>
              <div className="bg-surface-dark/60 border border-white/5 rounded-xl p-4">
                <p className="text-text-secondary text-xs mb-1">Email</p>
                <p className="text-white text-sm font-semibold">{user?.email || 'Not available'}</p>
              </div>
              <div className="bg-surface-dark/60 border border-white/5 rounded-xl p-4">
                <p className="text-text-secondary text-xs mb-1">Role</p>
                <p className="text-white text-sm font-semibold">{roleLabel}</p>
              </div>
              <div className="bg-surface-dark/60 border border-white/5 rounded-xl p-4">
                <p className="text-text-secondary text-xs mb-1">Status</p>
                <p className="text-white text-sm font-semibold">Active</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-white font-semibold mb-4">Location</h3>
            <div className="space-y-3">
              <div className="bg-surface-dark/60 border border-white/5 rounded-xl p-4">
                <p className="text-text-secondary text-xs mb-1">City</p>
                <p className="text-white text-sm font-semibold">{city || 'Not set'}</p>
              </div>
              <div className="bg-surface-dark/60 border border-white/5 rounded-xl p-4">
                <p className="text-text-secondary text-xs mb-1">Coordinates</p>
                <p className="text-white text-sm font-semibold">
                  {coordinates ? `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}` : 'Not set'}
                </p>
              </div>
              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}
              <button
                onClick={requestLocationAndSave}
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {isLoading ? 'Updating Location...' : 'Update Location'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
