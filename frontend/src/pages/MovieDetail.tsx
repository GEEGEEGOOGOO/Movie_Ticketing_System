import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { moviesAPI } from '../api/client'
import type { Movie, Showtime } from '../api/client'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])

  const { data: movie, isLoading: movieLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => moviesAPI.getById(Number(id)),
    enabled: !!id,
  })

  const { data: showtimes, isLoading: showtimesLoading } = useQuery({
    queryKey: ['showtimes', id, selectedDate],
    queryFn: () => moviesAPI.getShowtimes(Number(id), undefined, selectedDate),
    enabled: !!id,
  })

  // Mock movie database
  const mockMovieDatabase: { [key: number]: Partial<Movie> } = {
    1: { id: 1, title: 'The Dark Knight', genre: 'Action, Crime, Drama', language: 'English', duration_minutes: 152, rating: 'PG-13', director: 'Christopher Nolan', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', poster_url: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800', backdrop_url: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1600' },
    2: { id: 2, title: 'Inception', genre: 'Sci-Fi, Thriller', language: 'English', duration_minutes: 148, rating: 'PG-13', director: 'Christopher Nolan', description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a CEO.', poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800', backdrop_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600' },
    3: { id: 3, title: 'Interstellar', genre: 'Sci-Fi, Drama', language: 'English', duration_minutes: 169, rating: 'PG-13', director: 'Christopher Nolan', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', poster_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800', backdrop_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1600' },
    4: { id: 4, title: 'The Matrix', genre: 'Action, Sci-Fi', language: 'English', duration_minutes: 136, rating: 'R', director: 'The Wachowskis', description: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.', poster_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800', backdrop_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1600' },
    5: { id: 5, title: 'Pulp Fiction', genre: 'Crime, Drama', language: 'English', duration_minutes: 154, rating: 'R', director: 'Quentin Tarantino', description: 'The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence and redemption.', poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', backdrop_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600' },
    6: { id: 6, title: 'Oppenheimer', genre: 'Biography, Drama', language: 'English', duration_minutes: 180, rating: 'R', director: 'Christopher Nolan', description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', poster_url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800', backdrop_url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1600' },
    7: { id: 7, title: 'Jawan', genre: 'Action, Thriller', language: 'Hindi', duration_minutes: 169, rating: 'UA', director: 'Atlee', description: 'A high-octane action thriller which outlines the emotional journey of a man.', poster_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800', backdrop_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1600' },
    8: { id: 8, title: 'RRR', genre: 'Action, Drama', language: 'Telugu', duration_minutes: 187, rating: 'UA', director: 'S.S. Rajamouli', description: 'A fictional story about two legendary revolutionaries and their journey away from home.', poster_url: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800', backdrop_url: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1600' },
    9: { id: 9, title: 'Dune: Part Two', genre: 'Sci-Fi, Adventure', language: 'English', duration_minutes: 166, rating: 'PG-13', director: 'Denis Villeneuve', description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', poster_url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800', backdrop_url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1600' },
  }

  const mockMovie = mockMovieDatabase[Number(id)] || mockMovieDatabase[1]

  // Generate mock showtimes for the selected date
  const generateMockShowtimes = (dateStr: string): Partial<Showtime>[] => {
    const date = new Date(dateStr)
    const showtimes: Partial<Showtime>[] = []
    
    const theaters = [
      { id: 1, name: 'Cinema Paradise', city: 'Downtown' },
      { id: 2, name: 'IMAX Theater', city: 'Midtown' },
      { id: 3, name: 'Star Cinemas', city: 'Uptown' },
      { id: 4, name: 'Regal Multiplex', city: 'Eastside' },
    ]

    const times = ['10:00', '13:30', '16:00', '18:30', '21:00']
    
    theaters.forEach((theater, tIdx) => {
      times.slice(0, tIdx + 2).forEach((time, timeIdx) => {
        const [hours, minutes] = time.split(':')
        const showDate = new Date(date)
        showDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        
        showtimes.push({
          id: tIdx * 10 + timeIdx + 1,
          start_time: showDate.toISOString(),
          screen: {
            id: timeIdx + 1,
            name: timeIdx === 0 ? 'IMAX' : `Screen ${timeIdx}`,
            theater_id: theater.id,
            total_seats: 120,
            theater: {
              id: theater.id,
              name: theater.name,
              city: theater.city,
              screens: []
            }
          } as any
        })
      })
    })
    
    return showtimes
  }

  const mockShowtimes = generateMockShowtimes(selectedDate)

  const displayMovie = movie || mockMovie as Movie
  const displayShowtimes = showtimes && showtimes.length > 0 ? showtimes : mockShowtimes as Showtime[]

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hrs}h ${mins}m`
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // Generate next 7 days for date selection
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      value: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    }
  })

  // Group showtimes by theater
  const showtimesByTheater = displayShowtimes.reduce((acc, st) => {
    const theaterName = st.screen?.theater?.name || 'Unknown Theater'
    if (!acc[theaterName]) {
      acc[theaterName] = { theater: st.screen?.theater, showtimes: [] }
    }
    acc[theaterName].showtimes.push(st)
    return acc
  }, {} as { [key: string]: { theater: any; showtimes: Showtime[] } })

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-background-dark overflow-x-hidden font-sans">
      <Header
        breadcrumbs={[
          { label: 'Movies', href: '/movies' },
          { label: displayMovie.title },
        ]}
      />

      <main className="flex-1">
        {/* Hero Banner */}
        <div className="relative h-[450px] lg:h-[500px] w-full">
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url("${displayMovie.backdrop_url || displayMovie.poster_url}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 to-transparent" />
        </div>

        {/* Movie Info */}
        <div className="px-6 sm:px-10 lg:px-16 -mt-40 lg:-mt-48 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div
                className="w-56 lg:w-64 aspect-[2/3] bg-center bg-cover bg-no-repeat rounded-xl shadow-2xl"
                style={{ backgroundImage: `url("${displayMovie.poster_url}")` }}
              />
            </div>

            {/* Details */}
            <div className="flex-1 pt-4 text-center lg:text-left">
              <h1 className="text-white text-3xl lg:text-5xl font-bold mb-4">{displayMovie.title}</h1>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                {displayMovie.rating && (
                  <span className="px-4 py-2 rounded-full bg-surface-highlight text-white text-sm font-semibold">
                    {displayMovie.rating}
                  </span>
                )}
                {displayMovie.duration_minutes && (
                  <span className="text-text-secondary">
                    {formatDuration(displayMovie.duration_minutes)}
                  </span>
                )}
                {displayMovie.genre && (
                  <span className="text-text-secondary">{displayMovie.genre}</span>
                )}
                {displayMovie.language && (
                  <span className="text-text-secondary">{displayMovie.language}</span>
                )}
              </div>

              {displayMovie.description && (
                <p className="text-text-secondary leading-relaxed mb-6 max-w-3xl mx-auto lg:mx-0 text-lg">
                  {displayMovie.description}
                </p>
              )}

              {displayMovie.director && (
                <p className="text-text-secondary">
                  <span className="text-white font-semibold">Director:</span> {displayMovie.director}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
                <button className="flex items-center gap-3 px-8 py-4 rounded-full bg-surface-highlight hover:bg-surface-highlight/80 text-white font-semibold transition-colors">
                  <span className="material-symbols-outlined text-2xl">play_arrow</span>
                  Watch Trailer
                </button>
                <button className="flex items-center justify-center w-14 h-14 rounded-full bg-surface-dark hover:bg-surface-highlight text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">favorite_border</span>
                </button>
                <button className="flex items-center justify-center w-14 h-14 rounded-full bg-surface-dark hover:bg-surface-highlight text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Showtimes Section */}
        <div className="px-6 sm:px-10 lg:px-16 py-12 lg:py-16">
          <h2 className="text-white text-2xl lg:text-3xl font-bold mb-8">Select Showtime</h2>

          {/* Date Selector */}
          <div className="flex gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide">
            {dates.map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`
                  flex flex-col items-center justify-center px-5 py-4 rounded-xl min-w-[80px] transition-all
                  ${selectedDate === d.value
                    ? 'bg-primary text-white'
                    : 'bg-surface-dark text-text-secondary hover:bg-surface-highlight hover:text-white'
                  }
                `}
              >
                <span className="text-xs font-semibold">{d.day}</span>
                <span className="text-2xl font-bold">{d.date}</span>
                <span className="text-xs">{d.month}</span>
              </button>
            ))}
          </div>

          {/* Theaters and Showtimes */}
          {showtimesLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse glass-panel rounded-xl p-6">
                  <div className="h-6 skeleton rounded w-1/4 mb-4" />
                  <div className="flex gap-3">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-12 skeleton rounded-lg w-24" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(showtimesByTheater).map(([theaterName, { theater, showtimes: sts }]) => (
                <div key={theaterName} className="glass-panel rounded-xl p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-white font-bold text-xl">{theaterName}</h3>
                      <p className="text-text-secondary">{theater?.city || 'City'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-text-secondary">location_on</span>
                      <span className="text-text-secondary">2.5 km</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {sts.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => navigate(`/booking/seats/${st.id}`)}
                        className="px-6 py-3 rounded-lg border border-surface-highlight hover:border-primary hover:text-primary text-white font-semibold transition-colors"
                      >
                        {formatTime(st.start_time)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(showtimesByTheater).length === 0 && (
                <div className="text-center py-16">
                  <span className="material-symbols-outlined text-6xl text-text-secondary mb-4">event_busy</span>
                  <p className="text-white text-xl font-semibold mb-2">No showtimes available</p>
                  <p className="text-text-secondary">Try selecting a different date</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
