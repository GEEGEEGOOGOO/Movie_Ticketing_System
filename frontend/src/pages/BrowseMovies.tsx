import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { moviesAPI } from '../api/client'
import type { Movie } from '../api/client'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function BrowseMovies() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All')

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: moviesData, isLoading } = useQuery({
    queryKey: ['movies', debouncedSearch],
    queryFn: () => moviesAPI.getAll({ per_page: 50, search: debouncedSearch || undefined }),
  })

  const movies = moviesData?.movies || []

  // Mock data for demo - comprehensive movie list
  const mockMovies: Partial<Movie>[] = [
    { id: 1, title: 'The Dark Knight', genre: 'Action', language: 'English', duration: 152, rating: 'PG-13', description: 'Batman battles the Joker in Gotham City', poster_url: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400' },
    { id: 2, title: 'Inception', genre: 'Sci-Fi', language: 'English', duration: 148, rating: 'PG-13', description: 'A thief who steals secrets through dreams', poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400' },
    { id: 3, title: 'Interstellar', genre: 'Sci-Fi', language: 'English', duration: 169, rating: 'PG-13', description: 'Space travel to save humanity', poster_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400' },
    { id: 4, title: 'The Matrix', genre: 'Action', language: 'English', duration: 136, rating: 'R', description: 'A hacker discovers reality is simulated', poster_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400' },
    { id: 5, title: 'Pulp Fiction', genre: 'Crime', language: 'English', duration: 154, rating: 'R', description: 'Interconnected crime stories', poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400' },
    { id: 6, title: 'Oppenheimer', genre: 'Drama', language: 'English', duration: 180, rating: 'R', description: 'Story of the atomic bomb creator', poster_url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400' },
    { id: 7, title: 'Jawan', genre: 'Action', language: 'Hindi', duration: 169, rating: 'UA', description: 'High-octane action thriller', poster_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400' },
    { id: 8, title: 'RRR', genre: 'Action', language: 'Telugu', duration: 187, rating: 'UA', description: 'Period action epic', poster_url: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400' },
    { id: 9, title: 'Dune: Part Two', genre: 'Sci-Fi', language: 'English', duration: 166, rating: 'PG-13', description: 'Epic sci-fi adventure continues', poster_url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400' },
    { id: 10, title: 'Avatar 2', genre: 'Sci-Fi', language: 'English', duration: 192, rating: 'PG-13', description: 'Return to Pandora', poster_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400' },
    { id: 11, title: 'The Hangover', genre: 'Comedy', language: 'English', duration: 100, rating: 'R', description: 'Wild bachelor party in Vegas', poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400' },
    { id: 12, title: 'Joker', genre: 'Drama', language: 'English', duration: 122, rating: 'R', description: 'Origin story of Batman\'s nemesis', poster_url: 'https://images.unsplash.com/photo-1574267432667-f0b1cf4d6c57?w=400' },
  ]

  const displayMovies = movies.length > 0 ? movies : mockMovies as Movie[]

  const genres = ['All', ...new Set(displayMovies.map(m => m.genre).filter(Boolean))]
  const languages = ['All', ...new Set(displayMovies.map(m => m.language).filter(Boolean))]

  // Apply filters (search is already done by backend if using real API)
  const filteredMovies = displayMovies.filter(movie => {
    // Skip search filter for API results (already filtered by backend)
    const matchesSearch = movies.length > 0 ? true : movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre
    const matchesLanguage = selectedLanguage === 'All' || movie.language === selectedLanguage
    return matchesSearch && matchesGenre && matchesLanguage
  })

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hrs}h ${mins}m`
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-background-dark overflow-x-hidden font-sans">
      <Header />

      <main className="flex-1">
        <div className="px-6 sm:px-10 lg:px-16 py-8 lg:py-12">
          {/* Page Title */}
          <h1 className="text-white text-3xl lg:text-4xl font-bold leading-tight tracking-tight mb-8">Browse Movies</h1>

          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-xl">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full pl-12 pr-6 py-4 rounded-xl bg-surface-dark border border-surface-highlight text-white placeholder-text-secondary focus:outline-none focus:border-primary transition-colors text-base"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-6 py-4 rounded-xl bg-surface-dark border border-surface-highlight text-white focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer min-w-[160px]"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre === 'All' ? 'All Genres' : genre}</option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-6 py-4 rounded-xl bg-surface-dark border border-surface-highlight text-white focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer min-w-[160px]"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang === 'All' ? 'All Languages' : lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Genre Pills */}
          <div className="flex gap-3 overflow-x-auto pb-6 mb-6 scrollbar-hide">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`
                  px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all
                  ${selectedGenre === genre
                    ? 'bg-primary text-white'
                    : 'bg-surface-dark text-text-secondary hover:bg-surface-highlight hover:text-white'
                  }
                `}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-text-secondary text-sm mb-6">
            Showing {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
          </p>

          {/* Movie Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="skeleton rounded-xl aspect-[2/3] mb-4" />
                  <div className="h-5 skeleton rounded w-3/4 mb-2" />
                  <div className="h-4 skeleton rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
              {filteredMovies.map(movie => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <div
                      className="w-full aspect-[2/3] bg-center bg-cover bg-no-repeat group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url("${movie.poster_url || 'https://via.placeholder.com/300x400?text=No+Poster'}")` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <button className="w-full py-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors">
                          Book Now
                        </button>
                      </div>
                    </div>
                    {movie.rating && (
                      <span className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-surface-dark/90 text-white text-xs font-semibold">
                        {movie.rating}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-base group-hover:text-primary transition-colors truncate mb-1">
                    {movie.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {movie.genre} • {movie.duration ? formatDuration(movie.duration) : 'N/A'}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24">
              <span className="material-symbols-outlined text-7xl text-text-secondary mb-6">movie_off</span>
              <p className="text-white text-2xl font-semibold mb-3">No movies found</p>
              <p className="text-text-secondary text-lg">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
