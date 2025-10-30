import React from 'react';
import { useNavigate } from 'react-router-dom';

const Top10Row = ({ top10Movies }) => {
  const navigate = useNavigate();

  if (!top10Movies || top10Movies.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 px-4 md:px-8">Top 10 This Week</h2>
      <div className="relative px-4 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {top10Movies.map((item) => (
            <div
              key={item.movie._id}
              className="relative group cursor-pointer"
              onClick={() => navigate(`/movie/${item.movie._id}`)}
            >
              {/* Rank Number */}
              <div className="absolute -left-2 -bottom-2 z-20">
                <svg width="80" height="100" viewBox="0 0 80 100" className="drop-shadow-2xl">
                  <text
                    x="40"
                    y="80"
                    fontSize="90"
                    fontWeight="900"
                    textAnchor="middle"
                    fill="#1a1a1a"
                    stroke="#E50914"
                    strokeWidth="3"
                    className="select-none"
                  >
                    {item.rank}
                  </text>
                </svg>
              </div>

              {/* Movie Poster */}
              <div className="relative overflow-hidden rounded-lg transform transition-transform duration-300 group-hover:scale-105 group-hover:z-10">
                <img
                  src={item.movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={item.movie.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                      {item.movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                        {item.movie.imdb?.rating || 'N/A'}
                      </span>
                      <span>•</span>
                      <span>{item.movie.year}</span>
                      {item.movie.rated && (
                        <>
                          <span>•</span>
                          <span className="px-1 border border-gray-400 text-xs">
                            {item.movie.rated}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* Watch Stats */}
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {item.stats.watchCount} views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trending Badge */}
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  🔥 TRENDING
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Top10Row;
