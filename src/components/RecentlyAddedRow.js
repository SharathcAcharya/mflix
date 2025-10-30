import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecentlyAddedRow = ({ movies }) => {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <h2 className="text-2xl font-bold">Recently Added</h2>
        <span className="text-sm text-gray-400">New on MFlix</span>
      </div>
      
      <div className="relative px-4 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="group cursor-pointer"
              onClick={() => navigate(`/movie/${movie._id}`)}
            >
              <div className="relative overflow-hidden rounded-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:z-10">
                {/* Movie Poster */}
                <img
                  src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={movie.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
                
                {/* New Badge */}
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  NEW
                </div>

                {/* Year Badge */}
                {movie.year && (
                  <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                    {movie.year}
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {/* Title */}
                    <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                      {movie.title}
                    </h3>
                    
                    {/* Movie Info */}
                    <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                      {movie.imdb?.rating && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                          {movie.imdb.rating}
                        </span>
                      )}
                      {movie.rated && (
                        <>
                          <span>•</span>
                          <span className="px-1 border border-gray-400 text-xs">
                            {movie.rated}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* Genres */}
                    {movie.genres && movie.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {movie.genres.slice(0, 2).map((genre, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-700/80 px-2 py-0.5 rounded"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Play Button */}
                    <button className="mt-3 w-full bg-white text-black font-semibold py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      Play
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyAddedRow;
