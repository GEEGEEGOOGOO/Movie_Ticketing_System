import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { moviesAPI, theatersAPI } from '../api/client'
import { useLocationStore } from '../store/locationStore'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home() {
  const navigate = useNavigate()
  const { coordinates } = useLocationStore()

  const requireAuth = (path: string) => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate(path)
      return
    }
    navigate(`/login?redirect=${encodeURIComponent(path)}`)
  }

  const { data: moviesData, isLoading: moviesLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: () => moviesAPI.getAll({ per_page: 10 }),
  })

  // Fetch nearby theaters within 7km if user has shared location
  const { data: theaters, isLoading: theatersLoading } = useQuery({
    queryKey: ['theaters', 'nearby', coordinates?.latitude, coordinates?.longitude],
    queryFn: () => {
      if (coordinates?.latitude && coordinates?.longitude) {
        return theatersAPI.getNearby(coordinates.latitude, coordinates.longitude, 7)
      }
      return theatersAPI.getAll()
    },
    enabled: true,
  })

  const movies = moviesData?.movies || []

  // Mock data matching the HTML design
  const mockMovies = [
    {
      id: 1,
      title: 'Oppenheimer',
      genre: 'Bio • Drama',
      rating: '8.9',
      formats: ['IMAX 70mm', '2D'],
      poster_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2UncL713OHWH4qfkQEp4uavLSEVB0nratxZJuxFGSTt9ywYsWzoBAqe-VREra2roGJ1ANXqYVshP5FqC2guKa0_qq-dDqCGGaCW6t4GwuzMkeDjQ0LuwCcY8T3lEO5Bl5m-JzavnJpKX_i5dQtIaHdU3cf98gCrRA6kOaEJsfnU0XLNJgir07kEqKpd2SGGMDExaMGP3AlMV-Z2wqlhMEpNo9lnuXOBYC9g-Ml-QgXSp7r2kqYAFhwjWq_2aKWm12f2gYiknEC5k',
    },
    {
      id: 2,
      title: 'Spider-Verse',
      genre: 'Animation • Action',
      rating: '9.2',
      formats: ['Dolby', '3D'],
      poster_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmKZ9dhq-KNr0jo9anGqsBuSRGORkKs1_8uiF3Q8s3L6iYYvVKlp7hSRdpfFLpXs5WOkPK_cWeRTtIFpt5KFtj1_dZs8Ynxfa2ciV-rYIcPToR08F3HU7IE-C003TbbWrfqCjctCA69XschlLeEyfUdZgdhDYNVDf8eQyUyQH_zepzW97VESIUYNGfkVcB4f7DwEfkR-BryhaC7sdpeAY4v8prseRknKFusSLIU4IdX3mT3gFqBYaKdMdsOuIr9rnCmuQuVAmIluo',
    },
    {
      id: 3,
      title: 'Dune: Part Two',
      genre: 'Sci-Fi • Adventure',
      rating: '8.5',
      formats: ['IMAX', '4DX'],
      poster_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWMBcEQczAVAgpbg0hehDo3CXLkeKHG0U8Moi67GbtZ2smK181fakzlyL8nfmwVZo7lAx9M5sbSoKisAOq404mmQxuFn4LIogMVC-eJDpwh5DbOk7-ObHZ45KwR56qheuemVoqsbD46yhxfbhqBY5jE0VZeiTMNnpuLfe6IdCqjZgcIHygcIu76ej6vzhDdHkWHB-VfTgCkkEIUQZNHT2MCIQ6XluDfBpEomp-e7h7MydrBILooa48GtarTcH3l7nu9cKFOoNUJFM',
    },
    {
      id: 4,
      title: 'The Batman',
      genre: 'Action • Crime',
      rating: '7.8',
      formats: ['Dolby', 'ATMOS'],
      poster_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVACO1svyJ7fsMR2-9WlJz-xYmrJrGj0FEiGe0qFteIMFz-yVFn9Y2hLzcR0uMO3gtMgEPRPAhzW2lDVPSRRIT7Y45F0cT87JLNww6KkSckxdm8dp-V6QGzoaDDy1EqxmGEy3rIJ9yKkF0pqHOTfRRcfnAnWUWZleuiiGRfnI0lHbZbRjL5zBm6oKGWiRKd8dCv8fBGIl8qVJSTkCsZaMSLfpDmXixLpjRdIMVfj5NTnSlZzbjcsMaxF8P3jNU2fA5_Fn4gDmEs6Y',
    },
    {
      id: 5,
      title: 'Poor Things',
      genre: 'Comedy • Drama',
      rating: '8.1',
      formats: ['2D'],
      poster_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB5wzwUHLWG7stiI1cfd8Gm9V-BmbxbPDY_PBZnldtvwf3rbclXzgbm4JLxfpAEh0wb1rvpL0slhePLrM3Ct2x9OLWaqyCCVh9CzmEH1LN8xsxZT8g86ZZksqF-L_c55QRP_lpt4GzTPi01KTHCtXqGge1DtJoy2DvwPEpiEV5xIxRVomFHxor-nPBF4Ocx6KEUztRuaCpcCDK_6-CikeybWEe4LnIbNJDooNfTme1sUaJtjFiIHGBGhhGNIGRWUYYps9K1CsLsqE',
    },
  ]

  const mockTheaters = [
    {
      id: 1,
      name: 'PVR INOX Forum Mall',
      address: 'Forum Value Mall, Whitefield, Bangalore',
      distance: '3.2 km',
      nextShowing: '10:30 AM',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY8Ni_vslfTfAPyv9oVr5tJ6P-r4zfCVjXlK8AYAArVOdGs1z9EVsG6dhUfKf3Ei2h1e5eIijIB1kCtQY-ue7AAn0aMZJqj2j_kaaIWL4sLp0MycNjuzpKKaNysGeGhQngebbn73QKNV6yBDhcLQ9LUfiHpID8_sAJjj5kacgXEU9-czJxsunntpb6a0iVfDrhXpKK8IJZLXyFeLKZ0yexEPJUrVuno5JMmbyZy9m5H8mKoRh-i2BSwRbpeSSOG74ow2bdNSZfhGc',
    },
    {
      id: 2,
      name: 'Cinepolis Royal Meenakshi Mall',
      address: 'Bannerghatta Road, Hulimavu, Bangalore',
      distance: '5.1 km',
      nextShowing: '11:00 AM',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfD8FU70ntvrloBFuYsyeSpn0LghbH3pdUoAfzIsUfXMwhBfd9faOLkbY2orH9aVunTD0rdUy2otGTY4lSZ-uGlxkZoB73dfe3Bgla6FSt4quhToSEBtOx65ygK2R7f39mGe_UDSGhWt7Rjm-dFYtBOZXIgjITtNwEhSQYKI9C49PeQfj5KT4G_xvxjZn5OqM2gvNnREXpNVuNdh8zKulhC2jZyGLG3JZz_qPVGwFVYlcNyZ0lN5y_oTIN63kYQOzoS4HkN5_QJLs',
    },
    {
      id: 3,
      name: 'INOX Garuda Mall',
      address: 'Magrath Road, Ashok Nagar, Bangalore',
      distance: '6.8 km',
      nextShowing: '10:45 AM',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7UfQSPeyxvz049vm0z8m8oUMMmojXyDoflhzIUfFeld1M1ESOKTUj26YkucWO3GZHjDD0sU2MtzSR2wUhpiNQ6w4l_h3GN17Z1j8LYLLodrNYifnh1RzBEhsIwIp4Q1qx9DLLXgoS2Kyv_8vFABO3XK9Mg8IfQVzO33o5N1CPWV4Yoj_AYPd3nP_h9RPqK00D7MnAfdwTmBtfU6lLBU7g_iCYmdeREqiZN3YWHfzMmSpyh60s-FEaF0DSvjVd2Q474KFN5mquatM',
    },
  ]

  const recommendedMovies = [
    {
      id: 6,
      title: 'Mission: Impossible',
      subtitle: 'Based on your interest in Action',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtqetZeLh1YmSGkIL_F67zsO7cXnUZq-sMaqkjNcgfe5fmtgIoKgyDOKPYZ_TaQ2txAVV4AQfmN4ukw-rw170LXywSKom-J5qEBsKgFIOAzrSEoAYvNS_j126KzyjawsDy9-4e13Z_QAXC7K-OaFM0C2-hEWb7P01j7fOIhzhM7-0LIenLHp2czUGaajOFdElkcqmMofCQ-mOc30aK3I24n5l0ItnsgXhrxt61X29yiN7VNtTJN3ChlO6Sp9And3ZFwrT7hy1STXk',
    },
    {
      id: 7,
      title: 'Blade Runner 2049',
      subtitle: 'Because you watched Dune',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfvBZerMdP4KshOoym9a4byb9Oih4YgTnOkZLwHciHe_7ibPOILGfFcBExfdek05mkcMxb6zTnVnAWSHBBE2q-7neMAkhDBzc8QDBNIPHogZdQ0w2TXE1kdwHounFNx73tKr82nZSeQWcKk7hx0KDOrtOZLYL6thT7uvApF9ZDI6xsoV7iPT9g-egBNehavZpAs7rxH0o_1CqPOaQqmq8Tve998oJyh-oHgLu5OzgHdNS-7L_rNM_t-ta6FIbJj9SU6bUW0VukE9o',
    },
    {
      id: 8,
      title: 'Interstellar',
      subtitle: 'Top rated in Sci-Fi',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv3qLN1zkIvczMdoku1kpcg53mYEhgdxD34PA3geXrisAwgsnzOGeCfQwed1DbHgp-txdsZnSQXuY__rvkPqkZucmFV1-FRf-ojgd9Uc7b4OtUUo54_UtAAnm3nki9uCHa_0JlPTEYiE2PAxzFk8RjXtHnmCHLK0GnUQmr1J08d0WJQXUJmH1exjQhAb_7BmxiUNZ0Z-VzXp1cqHw9gEf1qcOUw6oUvAxbLDXqkzbHS2-ft7jq0DYWb2fEsasDE2tXYWj4o5PrNAQ',
    },
    {
      id: 9,
      title: 'Napoleon',
      subtitle: 'Trending this week',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ9OrBe1vRGTw-Idh5s_nSDLO_-p5uHadzY3_nTPHkGBjjLUAOoqKf_OZmne5sALzZdO8mMX6mi_gSxtGYu0cmPpYOAjOYbAKEFAo4ERr9-PXaZ2-eF3czXJXg9YSycoWz_7dpMFQRs1q8ZhohbblPPUh1n3yitBAyfFWhm-cmUX6dcgXj1rcScVrHyFvYZ-iEEUTTw85qAh1wJ2e-eJUVZfiBFsFgMH-vd58Isf1YRJbfx6d_asS_1fcQMzBdzB--yL-j4AU3Hus',
    },
  ]

  const displayMovies = movies.length > 0 ? movies.map((m, i) => ({
    ...m,
    rating: mockMovies[i]?.rating || '8.0',
    formats: mockMovies[i]?.formats || ['2D'],
    genre: m.genre || mockMovies[i]?.genre || 'Drama',
  })) : mockMovies

  const displayTheaters = theaters && theaters.length > 0 ? theaters : mockTheaters

  return (
    <div className="bg-background-dark font-display text-white overflow-x-hidden min-h-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Hero Section - Full Width */}
        <section className="relative w-full h-[500px] lg:h-[600px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDwACjs1qnhw5haMslnQPGHQAJ14Km6J0TemLmi26AWdbb2rERZwZMbAkVucyO7Hd3X1YLfi-KtLWP7JjUN2UXsEI2mX6qa9Mt3j4zpGM3Y7O9Ieg4acghIR5AxnHzlD-HrRR0BQ6b4g1fquwoIHcvqiDFJ-j8BcC69Rn3DlgAMIQNrVHStCMRZQiqr16e--4EWKduQm3jIMEzLpj1kerC5QTmq3tY1amDbnMz64bPWB9MpJBqua3kojuxyOeu3kyEKxpiMq9evY8I')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 sm:p-10 lg:p-16 w-full lg:w-1/2 flex flex-col gap-4">
            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full w-fit uppercase tracking-wider">Now Trending</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white drop-shadow-lg">Dune: Part Two</h1>
            <p className="text-gray-300 text-base lg:text-lg max-w-xl line-clamp-2 drop-shadow-md font-body">
              Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <button 
                onClick={() => requireAuth('/movies/3')}
                className="flex items-center gap-2 h-12 px-8 bg-primary hover:bg-red-600 text-white rounded-lg font-bold text-sm transition-all transform hover:scale-105 shadow-lg shadow-red-900/30"
              >
                <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                Book Tickets
              </button>
              <button className="flex items-center gap-2 h-12 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 rounded-lg font-medium text-sm transition-all">
                <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                Watch Trailer
              </button>
            </div>
          </div>
        </section>

        {/* Now Showing - Full Width */}
        <section className="w-full px-6 sm:px-10 lg:px-16 py-12 lg:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Now Showing</h2>
            <Link to="/movies" className="text-sm font-bold text-primary hover:text-white flex items-center gap-1 transition-colors">
              See All <span className="material-symbols-outlined text-lg">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 lg:gap-8">
            {moviesLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full aspect-[2/3] rounded-xl bg-surface-dark mb-4" />
                  <div className="h-5 bg-surface-dark rounded w-3/4 mb-2" />
                  <div className="h-4 bg-surface-dark rounded w-1/2" />
                </div>
              ))
            ) : (
              displayMovies.slice(0, 5).map((movie: any) => (
                <Link 
                  key={movie.id} 
                  to={`/movies/${movie.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-xl shadow-black/50">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${movie.poster_url}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                      <span className="material-symbols-outlined text-yellow-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold">{movie.rating}</span>
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className="text-base lg:text-lg font-bold text-white truncate group-hover:text-primary transition-colors">{movie.title}</h3>
                    <p className="text-text-secondary text-sm mt-1 font-body">{movie.genre}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {movie.formats?.slice(0, 2).map((format: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 border border-white/20 rounded-md text-xs text-gray-400">{format}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Cinemas Near You - Full Width */}
        <section className="w-full px-6 sm:px-10 lg:px-16 py-12 lg:py-16 bg-surface-dark/30">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Cinemas Near You</h2>
            <a href="#" className="text-sm font-bold text-primary hover:text-white flex items-center gap-1 transition-colors">
              View Map <span className="material-symbols-outlined text-lg">map</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {theatersLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-56 bg-surface-dark rounded-t-2xl" />
                  <div className="bg-surface-dark p-6 rounded-b-2xl">
                    <div className="h-6 bg-surface-highlight rounded w-3/4 mb-3" />
                    <div className="h-4 bg-surface-highlight rounded w-full" />
                  </div>
                </div>
              ))
            ) : (
              (displayTheaters as any[]).slice(0, 3).map((theater: any) => (
                <div key={theater.id} className="bg-surface-dark/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="relative h-56 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${theater.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY8Ni_vslfTfAPyv9oVr5tJ6P-r4zfCVjXlK8AYAArVOdGs1z9EVsG6dhUfKf3Ei2h1e5eIijIB1kCtQY-ue7AAn0aMZJqj2j_kaaIWL4sLp0MycNjuzpKKaNysGeGhQngebbn73QKNV6yBDhcLQ9LUfiHpID8_sAJjj5kacgXEU9-czJxsunntpb6a0iVfDrhXpKK8IJZLXyFeLKZ0yexEPJUrVuno5JMmbyZy9m5H8mKoRh-i2BSwRbpeSSOG74ow2bdNSZfhGc'}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-base">near_me</span>
                      <span className="text-sm font-medium text-white">{theater.distance || '1.0 mi'}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors mb-2">{theater.name}</h3>
                    <p className="text-text-secondary text-sm font-body mb-4">{theater.address || theater.location || `${theater.city}`}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="text-sm text-text-secondary font-body">Next: <span className="text-white font-bold">{theater.nextShowing || '10:30 AM'}</span></div>
                      <button 
                        onClick={() => navigate('/movies')}
                        className="text-sm font-bold text-primary hover:text-white transition-colors"
                      >
                        Showtimes
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recommended For You - Full Width */}
        <section className="w-full px-6 sm:px-10 lg:px-16 py-12 lg:py-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">Recommended for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {recommendedMovies.map((movie) => (
              <div key={movie.id} className="bg-surface-dark/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/5 hover:border-primary/30 transition-all group">
                <div className="relative h-52 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${movie.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <div>
                    <h4 className="font-bold text-white text-xl group-hover:text-primary transition-colors">{movie.title}</h4>
                    <p className="text-text-secondary text-sm font-body mt-1">{movie.subtitle}</p>
                  </div>
                  <button 
                    onClick={() => requireAuth(`/movies/${movie.id}`)}
                    className="mt-2 w-full h-12 rounded-xl bg-surface-highlight hover:bg-primary text-white text-sm font-bold transition-colors"
                  >
                    Book Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
