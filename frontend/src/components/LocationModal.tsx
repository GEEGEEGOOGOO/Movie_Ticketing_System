import { useEffect, useState } from 'react'
import { useLocationStore } from '../store/locationStore'

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
}

// Indian cities for manual selection
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot',
  'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad',
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'
].sort()

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const {
    city,
    isLoading,
    error,
    requestLocationAndSave,
    setLocation,
    setPermissionAsked,
  } = useLocationStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCities, setFilteredCities] = useState(INDIAN_CITIES)

  useEffect(() => {
    // Close modal when city is set
    if (city && isOpen) {
      onClose()
    }
  }, [city, isOpen, onClose])

  useEffect(() => {
    // Filter cities based on search
    if (searchQuery.trim()) {
      const filtered = INDIAN_CITIES.filter(cityName =>
        cityName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCities(filtered)
    } else {
      setFilteredCities(INDIAN_CITIES)
    }
  }, [searchQuery])

  const handleDetectLocation = async () => {
    await requestLocationAndSave()
  }

  const handleManualSelect = (selectedCity: string) => {
    // Set mock coordinates for the selected city
    const mockCoordinates = {
      latitude: 0,
      longitude: 0,
    }
    setLocation(selectedCity, mockCoordinates)
    setPermissionAsked(true)
    onClose()
  }

  const handleSkip = () => {
    setPermissionAsked(true)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f1419] border border-blue-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-blue-500/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 relative">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-white">location_on</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Choose Your Location</h2>
              <p className="text-blue-100 text-sm mt-1">
                Find theaters and movies playing near you
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Detect Location Button */}
          <button
            onClick={handleDetectLocation}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] disabled:scale-100 shadow-lg mb-6"
          >
            <span className="material-symbols-outlined">{isLoading ? 'refresh' : 'my_location'}</span>
            {isLoading ? 'Detecting Location...' : 'Detect My Location'}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3">
              <span className="material-symbols-outlined flex-shrink-0 mt-0.5">error</span>
              <div>
                <p className="font-semibold">Location Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-400 text-sm font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* Manual City Selection */}
          <div>
            <h3 className="text-white font-semibold mb-3">Select Your City</h3>
            
            {/* Search Input */}
            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                type="text"
                placeholder="Search for your city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Cities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
              {filteredCities.map((cityName) => (
                <button
                  key={cityName}
                  onClick={() => handleManualSelect(cityName)}
                  className="bg-gray-800/50 hover:bg-blue-600/20 border border-gray-700 hover:border-blue-500 text-gray-300 hover:text-white py-3 px-4 rounded-lg transition-all text-sm font-medium"
                >
                  {cityName}
                </button>
              ))}
              {filteredCities.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-8">
                  No cities found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 bg-gray-900/50">
          <button
            onClick={handleSkip}
            className="w-full text-gray-400 hover:text-white py-2 text-sm font-medium transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  )
}
