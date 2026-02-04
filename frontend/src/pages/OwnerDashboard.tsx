import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const MOCK_THEATERS = [
  {
    id: '1',
    name: 'CineMax Downtown',
    location: 'New York, NY',
    screens: 8,
    totalSeats: 1200,
    bookingsToday: 450,
    revenue: 12500,
  },
  {
    id: '2',
    name: 'Regal Cinemas Plaza',
    location: 'Los Angeles, CA',
    screens: 6,
    totalSeats: 900,
    bookingsToday: 320,
    revenue: 8900,
  },
]

const MOCK_MOVIES = [
  { id: '1', title: 'Dune: Part Two', shows: 24, bookings: 180, revenue: 4500, poster: '' },
  { id: '2', title: 'Oppenheimer', shows: 20, bookings: 150, revenue: 3800, poster: '' },
  { id: '3', title: 'The Batman', shows: 16, bookings: 120, revenue: 3200, poster: '' },
]

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const [selectedView, setSelectedView] = useState<'overview' | 'theaters' | 'movies'>('overview')

  const totalRevenue = MOCK_THEATERS.reduce((sum, t) => sum + t.revenue, 0)
  const totalBookings = MOCK_THEATERS.reduce((sum, t) => sum + t.bookingsToday, 0)

  const breadcrumbs = [
    { label: 'Home', href: '/home' },
    { label: 'Theater Management' }
  ]

  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: 'dashboard' },
    { id: 'theaters' as const, label: 'Theaters', icon: 'location_city' },
    { id: 'movies' as const, label: 'Movies', icon: 'movie' },
  ]

  return (
    <div className="min-h-screen bg-background-dark">
      <Header breadcrumbs={breadcrumbs} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Theater Management</h1>
            <p className="text-text-secondary">Monitor performance and manage your cinema operations</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-xl text-text-secondary hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-surface-dark rounded-xl w-fit">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedView(item.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors ${
                selectedView === item.id
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Overview View */}
        {selectedView === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-400">payments</span>
                  </div>
                  <span className="text-green-400 text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">trending_up</span>
                    +12%
                  </span>
                </div>
                <p className="text-text-secondary text-sm mb-1">Today's Revenue</p>
                <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
              </div>
              
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-cyan-400">confirmation_number</span>
                  </div>
                  <span className="text-cyan-400 text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">trending_up</span>
                    +8%
                  </span>
                </div>
                <p className="text-text-secondary text-sm mb-1">Bookings Today</p>
                <p className="text-3xl font-bold text-white">{totalBookings}</p>
              </div>
              
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">location_city</span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mb-1">Active Theaters</p>
                <p className="text-3xl font-bold text-white">{MOCK_THEATERS.length}</p>
              </div>
              
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-yellow-400">tv</span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mb-1">Total Screens</p>
                <p className="text-3xl font-bold text-white">
                  {MOCK_THEATERS.reduce((sum, t) => sum + t.screens, 0)}
                </p>
              </div>
            </div>

            {/* Top Movies Chart */}
            <div className="glass-panel p-6 mb-8">
              <h3 className="text-white text-xl font-semibold mb-6">Top Performing Movies</h3>
              <div className="space-y-4">
                {MOCK_MOVIES.map((movie, index) => (
                  <div key={movie.id} className="flex items-center gap-4">
                    <span className="text-text-secondary w-6">{index + 1}</span>
                    <div className="w-12 h-16 bg-surface-dark rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-text-secondary">movie</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{movie.title}</p>
                      <p className="text-text-secondary text-sm">{movie.shows} shows • {movie.bookings} bookings</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-surface-dark rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full"
                          style={{ width: `${(movie.revenue / MOCK_MOVIES[0].revenue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-green-400 font-bold w-24 text-right">${movie.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel p-6">
              <h3 className="text-white text-xl font-semibold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'New booking', detail: 'Dune: Part Two - 4 tickets', time: '2 min ago', icon: 'confirmation_number', color: 'text-green-400' },
                  { action: 'Show started', detail: 'Oppenheimer - Screen 3', time: '15 min ago', icon: 'play_circle', color: 'text-cyan-400' },
                  { action: 'New booking', detail: 'The Batman - 2 tickets', time: '23 min ago', icon: 'confirmation_number', color: 'text-green-400' },
                  { action: 'Show ended', detail: 'Inception - Screen 1', time: '45 min ago', icon: 'stop_circle', color: 'text-text-secondary' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                    <div className={`w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center ${activity.color}`}>
                      <span className="material-symbols-outlined">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white">{activity.action}</p>
                      <p className="text-text-secondary text-sm">{activity.detail}</p>
                    </div>
                    <p className="text-text-secondary text-sm">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Theaters View */}
        {selectedView === 'theaters' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">My Theaters</h2>
              <button className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold transition-colors">
                <span className="material-symbols-outlined">add</span>
                Add Theater
              </button>
            </div>

            <div className="space-y-4">
              {MOCK_THEATERS.map(theater => (
                <div key={theater.id} className="glass-panel p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-white text-xl font-semibold mb-1">{theater.name}</h3>
                      <p className="text-text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        {theater.location}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-lg text-text-secondary hover:text-white transition-colors">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className="p-2 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-lg text-text-secondary hover:text-white transition-colors">
                        <span className="material-symbols-outlined">analytics</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-text-secondary text-sm mb-1">Screens</p>
                      <p className="text-white text-2xl font-bold">{theater.screens}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary text-sm mb-1">Total Seats</p>
                      <p className="text-white text-2xl font-bold">{theater.totalSeats}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary text-sm mb-1">Bookings Today</p>
                      <p className="text-cyan-400 text-2xl font-bold">{theater.bookingsToday}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary text-sm mb-1">Revenue Today</p>
                      <p className="text-green-400 text-2xl font-bold">${theater.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Movies View */}
        {selectedView === 'movies' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Movie Performance</h2>
              <button className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold transition-colors">
                <span className="material-symbols-outlined">add</span>
                Add Movie
              </button>
            </div>

            <div className="space-y-4">
              {MOCK_MOVIES.map(movie => (
                <div key={movie.id} className="glass-panel p-6">
                  <div className="flex gap-6">
                    <div className="w-20 h-28 bg-surface-dark rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-text-secondary text-3xl">movie</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-white text-xl font-semibold">{movie.title}</h3>
                        <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark hover:bg-surface-highlight border border-white/10 rounded-lg text-text-secondary hover:text-white text-sm transition-colors">
                          <span className="material-symbols-outlined text-base">schedule</span>
                          Manage Showtimes
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <p className="text-text-secondary text-sm mb-1">Shows Today</p>
                          <p className="text-white text-2xl font-bold">{movie.shows}</p>
                        </div>
                        <div>
                          <p className="text-text-secondary text-sm mb-1">Bookings</p>
                          <p className="text-cyan-400 text-2xl font-bold">{movie.bookings}</p>
                        </div>
                        <div>
                          <p className="text-text-secondary text-sm mb-1">Revenue</p>
                          <p className="text-green-400 text-2xl font-bold">${movie.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
