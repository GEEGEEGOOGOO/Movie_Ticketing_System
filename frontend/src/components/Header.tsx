import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useLocationStore } from '../store/locationStore'
import LocationModal from './LocationModal'

interface Breadcrumb {
  label: string
  href?: string
}

interface HeaderProps {
  showSearch?: boolean
  breadcrumbs?: Breadcrumb[]
}

export default function Header({ showSearch = true, breadcrumbs }: HeaderProps) {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const { city, requestLocationAndSave, isLoading } = useLocationStore()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isLoggedIn = !!localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleLocationClick = async () => {
    // First try to get GPS location
    await requestLocationAndSave()
    // If GPS fails or user wants to change, show modal
    setShowLocationModal(true)
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background-dark/95 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-4 w-full">
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
            <div className="size-8 text-primary-light">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">CineBook</h2>
          </Link>

          {/* Nav Links or Breadcrumb */}
          {hasBreadcrumbs ? (
            <div className="hidden lg:flex items-center text-sm font-medium text-text-secondary">
              {breadcrumbs.map((item, index) => (
                <span key={index} className="flex items-center">
                  {index > 0 && <span className="material-symbols-outlined text-sm mx-2">chevron_right</span>}
                  {item.href ? (
                    <Link to={item.href} className="text-white hover:text-primary transition-colors">{item.label}</Link>
                  ) : (
                    <span className="text-primary font-bold">{item.label}</span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <nav className="hidden lg:flex items-center gap-8">
              <button 
                onClick={handleLocationClick}
                disabled={isLoading}
                className="text-sm font-medium text-primary-light hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">{isLoading ? 'refresh' : 'location_on'}</span>
                {isLoading ? 'Getting location...' : (city || 'Get Location')}
              </button>
              <Link to="/movies" className="text-sm font-medium text-white hover:text-primary-light transition-colors">Movies</Link>
              <Link to="/home" className="text-sm font-medium text-white hover:text-primary-light transition-colors">Cinemas</Link>
              <Link to="/home" className="text-sm font-medium text-white hover:text-primary-light transition-colors">Offers</Link>
            </nav>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Search */}
          {showSearch && !hasBreadcrumbs && (
            <div className="hidden md:flex items-center bg-white/5 hover:bg-white/10 rounded-lg px-4 py-2.5 w-64 xl:w-80 border border-white/10 focus-within:border-primary-light/50 transition-all">
              <span className="material-symbols-outlined text-text-secondary text-[20px]">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder-text-secondary w-full ml-2.5 outline-none font-body"
                placeholder="Search movies, cinemas..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchQuery && navigate(`/movies?q=${searchQuery}`)}
              />
            </div>
          )}

          {/* Secure Checkout indicator */}
          {hasBreadcrumbs && (
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <span className="material-symbols-outlined text-green-500">lock</span>
              Secure Checkout
            </div>
          )}

          {/* User Menu */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center text-xs font-bold text-text-secondary">
                  {getInitials(user.full_name || user.name)}
                </div>
                <span className="hidden md:block text-sm text-white">{user.full_name || user.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm text-text-secondary hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-red-600 transition-colors text-white text-sm font-bold tracking-wide"
            >
              Log In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[100%] left-0 w-full bg-[#221012] border-b border-surface-highlight p-4 flex flex-col gap-4">
          {!hasBreadcrumbs && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center bg-surface-highlight rounded-lg px-3 py-2 w-full border border-transparent focus-within:border-primary/50 transition-colors mb-2">
                <span className="material-symbols-outlined text-text-secondary">search</span>
                <input 
                  className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder-text-secondary w-full ml-2 outline-none"
                  placeholder="Search movies..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchQuery && navigate(`/movies?q=${searchQuery}`)}
                />
              </div>
              <button 
                onClick={handleLocationClick}
                disabled={isLoading}
                className="text-base font-medium text-white py-2 border-b border-surface-highlight flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">{isLoading ? 'refresh' : 'location_on'}</span>
                {isLoading ? 'Getting location...' : (city || 'Get Location')}
              </button>
              <Link to="/movies" className="text-base font-medium text-white py-2 border-b border-surface-highlight">Movies</Link>
              <Link to="/home" className="text-base font-medium text-white py-2 border-b border-surface-highlight">Cinemas</Link>
              <Link to="/home" className="text-base font-medium text-white py-2">Offers</Link>
            </div>
          )}
        </div>
      )}
      
      {/* Location Modal */}
      <LocationModal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} />
    </header>
  )
}
