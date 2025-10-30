import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContinueWatchingRow = ({ continueWatching }) => {
  const navigate = useNavigate();

  if (!continueWatching || continueWatching.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-white mb-4">Continue Watching</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {continueWatching.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/movie/${item.movieId._id}`)}
            className="relative cursor-pointer group"
          >
            {/* Movie Poster */}
            <div className="relative overflow-hidden rounded-md">
              <img
                src={item.movieId.poster || 'https://via.placeholder.com/300x450'}
                alt={item.movieId.title}
                className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450';
                }}
              />
              
              {/* Progress Bar Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-netflix-red transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-white ml-1" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Movie Info */}
            <div className="mt-2">
              <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-netflix-red transition-colors">
                {item.movieId.title}
              </h3>
              <p className="text-gray-400 text-xs mt-1">
                {item.percentage}% watched
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContinueWatchingRow;
