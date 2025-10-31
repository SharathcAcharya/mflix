import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SkeletonLoader from '../components/SkeletonLoader';
import api from '../utils/api';

const MyList = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('dateAdded');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('myListViewMode') || 'grid';
  });
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/watchlist');
      setWatchlist(response.data.watchlist || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      setRemovingId(movieId);
      await api.delete(`/users/watchlist/${movieId}`);
      setWatchlist(watchlist.filter(movie => movie._id !== movieId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('myListViewMode', mode);
  };

  const sortMovies = (movies) => {
    const sorted = [...movies];
    switch (sortBy) {
      case 'dateAdded':
        return sorted.reverse(); // Assuming newest first
      case 'titleAsc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'titleDesc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'ratingHigh':
        return sorted.sort((a, b) => (b.imdb?.rating || 0) - (a.imdb?.rating || 0));
      case 'ratingLow':
        return sorted.sort((a, b) => (a.imdb?.rating || 0) - (b.imdb?.rating || 0));
      case 'yearNew':
        return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
      case 'yearOld':
        return sorted.sort((a, b) => (a.year || 0) - (b.year || 0));
      default:
        return sorted;
    }
  };

  const sortedMovies = sortMovies(watchlist);

  const MovieGridCard = ({ movie }) => (
    <div className="group relative cursor-pointer transition-transform duration-300 hover:scale-105">
      <div onClick={() => navigate(`/movie/${movie._id}`)} className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden relative">
        <img
          src={movie.poster || 'https://via.placeholder.com/300x450'}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors">
            ▶
          </button>
        </div>
        {movie.imdb?.rating && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs">
            <span className="text-yellow-400">⭐ {movie.imdb.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-white text-sm font-semibold truncate">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span>{movie.year}</span>
          <span>{movie.rated || 'NR'}</span>
        </div>
      </div>
      
      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeFromWatchlist(movie._id);
        }}
        disabled={removingId === movie._id}
        className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-50"
        title="Remove from My List"
      >
        {removingId === movie._id ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>
    </div>
  );

  const MovieListCard = ({ movie }) => (
    <div className="flex items-center space-x-4 bg-gray-900 hover:bg-gray-800 p-4 rounded-lg transition-colors duration-300 group">
      <div 
        onClick={() => navigate(`/movie/${movie._id}`)}
        className="w-24 h-36 flex-shrink-0 bg-gray-800 rounded overflow-hidden cursor-pointer"
      >
        <img
          src={movie.poster || 'https://via.placeholder.com/300x450'}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450';
          }}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 
          onClick={() => navigate(`/movie/${movie._id}`)}
          className="text-white text-lg font-semibold mb-1 truncate cursor-pointer hover:text-netflix-red transition-colors"
        >
          {movie.title}
        </h3>
        <div className="flex items-center space-x-3 text-sm text-gray-400 mb-2">
          {movie.year && <span>{movie.year}</span>}
          {movie.rated && (
            <>
              <span>•</span>
              <span className="border border-gray-600 px-2 py-0.5 rounded">{movie.rated}</span>
            </>
          )}
          {movie.runtime && (
            <>
              <span>•</span>
              <span>{movie.runtime} min</span>
            </>
          )}
          {movie.imdb?.rating && (
            <>
              <span>•</span>
              <span className="flex items-center text-yellow-400">
                ⭐ {movie.imdb.rating.toFixed(1)}
              </span>
            </>
          )}
        </div>
        <p className="text-gray-300 text-sm line-clamp-2">
          {movie.plot || 'No description available.'}
        </p>
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {movie.genres.slice(0, 3).map((genre, index) => (
              <span key={index} className="text-xs bg-gray-700 px-2 py-1 rounded">
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromWatchlist(movie._id)}
        disabled={removingId === movie._id}
        className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-300 disabled:opacity-50"
        title="Remove from My List"
      >
        {removingId === movie._id ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="px-8 md:px-16 py-8 pt-24">
          <div className="h-10 bg-gray-800 rounded w-48 mb-8 animate-pulse"></div>
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-800 rounded w-32 animate-pulse"></div>
            <div className="flex space-x-4">
              <div className="h-10 bg-gray-800 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-800 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          <SkeletonLoader variant="movieGrid" count={12} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="px-8 md:px-16 py-8 pt-24">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          My List
        </h1>

        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h2 className="text-2xl font-semibold text-white mb-4">Your list is empty</h2>
            <p className="text-gray-400 mb-8">
              Add movies and shows to your list to watch them later.
            </p>
            <button
              onClick={() => navigate('/browse')}
              className="bg-netflix-red hover:bg-red-700 text-white px-8 py-3 rounded font-semibold transition-colors duration-300"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="text-gray-400">
                {sortedMovies.length} {sortedMovies.length === 1 ? 'title' : 'titles'}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-netflix-red transition-colors"
                >
                  <option value="dateAdded">Date Added</option>
                  <option value="titleAsc">Title (A-Z)</option>
                  <option value="titleDesc">Title (Z-A)</option>
                  <option value="ratingHigh">Rating (High-Low)</option>
                  <option value="ratingLow">Rating (Low-High)</option>
                  <option value="yearNew">Year (Newest)</option>
                  <option value="yearOld">Year (Oldest)</option>
                </select>

                {/* View Toggle */}
                <div className="flex bg-gray-800 rounded border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`px-4 py-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-netflix-red text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Grid View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`px-4 py-2 transition-colors ${
                      viewMode === 'list' ? 'bg-netflix-red text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    title="List View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Movies Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-12">
                {sortedMovies.map((movie) => (
                  <MovieGridCard key={movie._id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 pb-12">
                {sortedMovies.map((movie) => (
                  <MovieListCard key={movie._id} movie={movie} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyList;
