import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const searchMovies = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const response = await api.get('/movies/search', {
          params: { q: query }
        });
        setResults(response.data.movies || []);
      } catch (error) {
        console.error('Error searching movies:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Search Results for "{query}"
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No results found for "{query}"</p>
              <Link to="/browse" className="mt-4 inline-block text-netflix-red hover:underline">
                Back to Browse
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 pb-12">
              {results.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
