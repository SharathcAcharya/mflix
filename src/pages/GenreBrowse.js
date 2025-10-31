import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';

const GenreBrowse = () => {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');

  const genresList = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
    'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi',
    'Thriller', 'War', 'Western'
  ];

  const fetchMoviesByGenre = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/movies/genre/${genre}`, {
        params: { sort: sortBy }
      });
      setMovies(response.data.movies || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  }, [genre, sortBy]);

  useEffect(() => {
    fetchMoviesByGenre();
  }, [fetchMoviesByGenre]);

  const MovieCard = ({ movie }) => (
    <div
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="group cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden relative">
        <img
          src={movie.poster || 'https://via.placeholder.com/300x450'}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
              {movie.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              {movie.year && <span>{movie.year}</span>}
              {movie.imdb?.rating && (
                <>
                  <span>•</span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {movie.imdb.rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-netflix-red"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-24 px-8 md:px-16 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {genre} Movies
          </h1>
          
          {/* Genre Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {genresList.map((g) => (
              <Link
                key={g}
                to={`/browse/genre/${g.toLowerCase()}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  g.toLowerCase() === genre.toLowerCase()
                    ? 'bg-netflix-red text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {g}
              </Link>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-netflix-red"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="year">Newest First</option>
              <option value="title">A-Z</option>
            </select>
          </div>
        </div>

        {/* Movies Grid */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No movies found in this genre</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreBrowse;
