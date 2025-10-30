import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';

const Recommendations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState({
    personalized: [],
    trending: [],
    topPicks: []
  });
  const [activeTab, setActiveTab] = useState('personalized');

  useEffect(() => {
    fetchAllRecommendations();
  }, []);

  const fetchAllRecommendations = async () => {
    try {
      const [personalizedRes, trendingRes, topPicksRes] = await Promise.all([
        api.get('/recommendations/personalized'),
        api.get('/recommendations/trending'),
        api.get('/recommendations/top-picks')
      ]);

      setRecommendations({
        personalized: personalizedRes.data.recommendations || [],
        trending: trendingRes.data.recommendations || [],
        topPicks: topPicksRes.data.recommendations || []
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const MovieCard = ({ movie }) => (
    <div
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="group cursor-pointer"
    >
      <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden mb-3 relative">
        <img
          src={movie.poster || 'https://via.placeholder.com/300x450'}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button className="w-full bg-white text-black rounded-full py-2 font-semibold flex items-center justify-center space-x-2 hover:bg-opacity-90">
              <span>▶</span>
              <span>Play</span>
            </button>
          </div>
        </div>
        {movie.imdb?.rating && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded">
            <span className="text-yellow-400 text-sm">⭐ {movie.imdb.rating}</span>
          </div>
        )}
      </div>
      <h3 className="text-white font-semibold truncate group-hover:text-netflix-red transition">
        {movie.title}
      </h3>
      <div className="flex items-center justify-between text-sm text-gray-400 mt-1">
        <span>{movie.year}</span>
        <span>{movie.rated || 'NR'}</span>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {movie.genres?.slice(0, 3).map((genre, idx) => (
          <span
            key={idx}
            className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded"
          >
            {genre}
          </span>
        ))}
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

  const currentRecommendations = recommendations[activeTab] || [];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-24 px-8 md:px-16 pb-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recommended For You
          </h1>
          <p className="text-gray-400 text-lg">
            Discover movies tailored to your taste
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('personalized')}
            className={`pb-4 px-2 font-semibold transition-colors ${
              activeTab === 'personalized'
                ? 'text-white border-b-2 border-netflix-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`pb-4 px-2 font-semibold transition-colors ${
              activeTab === 'trending'
                ? 'text-white border-b-2 border-netflix-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Trending Now
          </button>
          <button
            onClick={() => setActiveTab('topPicks')}
            className={`pb-4 px-2 font-semibold transition-colors ${
              activeTab === 'topPicks'
                ? 'text-white border-b-2 border-netflix-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Top Picks
          </button>
        </div>

        {/* Movies Grid */}
        {currentRecommendations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {currentRecommendations.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl text-white mb-2">No recommendations yet</h3>
            <p className="text-gray-400">
              Start watching movies to get personalized recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
