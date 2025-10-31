import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/common/Navbar';
import ContinueWatchingRow from '../components/ContinueWatchingRow';
import Top10Row from '../components/Top10Row';
import RecentlyAddedRow from '../components/RecentlyAddedRow';
import SkeletonLoader from '../components/SkeletonLoader';

const Browse = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [top10Movies, setTop10Movies] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [recommendations, setRecommendations] = useState({
    personalized: [],
    trending: [],
    topPicks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [
        moviesRes, 
        continueRes, 
        top10Res,
        recentlyAddedRes,
        personalizedRes, 
        trendingRes, 
        topPicksRes
      ] = await Promise.all([
        api.get('/movies'),
        api.get('/progress/list/continue-watching').catch(() => ({ data: { continueWatching: [] } })),
        api.get('/movies/trending/top10').catch(() => ({ data: { top10: [] } })),
        api.get('/movies/recently-added/list').catch(() => ({ data: { movies: [] } })),
        api.get('/recommendations/personalized').catch(() => ({ data: { recommendations: [] } })),
        api.get('/recommendations/trending').catch(() => ({ data: { recommendations: [] } })),
        api.get('/recommendations/top-picks').catch(() => ({ data: { recommendations: [] } }))
      ]);

      setMovies(moviesRes.data.movies || []);
      setContinueWatching(continueRes.data.continueWatching || []);
      setTop10Movies(top10Res.data.top10 || []);
      setRecentlyAdded(recentlyAddedRes.data.movies || []);
      setRecommendations({
        personalized: personalizedRes.data.recommendations || [],
        trending: trendingRes.data.recommendations || [],
        topPicks: topPicksRes.data.recommendations || []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-200">
            ▶
          </button>
        </div>
        {movie.imdb?.rating && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs">
            <span className="text-yellow-400">⭐ {movie.imdb.rating}</span>
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
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        
        {/* Hero Skeleton */}
        <div className="relative h-screen">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900">
            <div className="absolute bottom-32 left-8 md:left-16 max-w-2xl space-y-4">
              <div className="h-16 bg-gray-800 rounded w-3/4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-800 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded w-4/6 animate-pulse"></div>
              </div>
              <div className="flex space-x-4">
                <div className="h-12 bg-gray-800 rounded w-32 animate-pulse"></div>
                <div className="h-12 bg-gray-800 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections Skeleton */}
        <div className="px-8 md:px-16 py-8 space-y-12">
          {/* Continue Watching Skeleton */}
          <div>
            <div className="h-6 bg-gray-800 rounded w-48 mb-4 animate-pulse"></div>
            <SkeletonLoader variant="continueWatching" count={6} />
          </div>

          {/* Top 10 Skeleton */}
          <div>
            <div className="h-6 bg-gray-800 rounded w-32 mb-4 animate-pulse"></div>
            <SkeletonLoader variant="movieGrid" count={10} />
          </div>

          {/* Popular Movies Skeleton */}
          <div>
            <div className="h-6 bg-gray-800 rounded w-40 mb-4 animate-pulse"></div>
            <SkeletonLoader variant="movieGrid" count={20} />
          </div>
        </div>
      </div>
    );
  }

  const featuredMovie = movies[0] || {};

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.9) 100%), url('${featuredMovie.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920'}')`
          }}
        >
          <div className="absolute bottom-32 left-8 md:left-16 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {featuredMovie.title || 'Featured Movie'}
            </h1>
            <p className="text-lg text-gray-300 mb-6 line-clamp-3">
              {featuredMovie.plot || 'Experience the latest blockbuster movie with stunning visuals and compelling storytelling.'}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-300 mb-6">
              {featuredMovie.year && <span>{featuredMovie.year}</span>}
              {featuredMovie.rated && <span className="border px-2 py-1">{featuredMovie.rated}</span>}
              {featuredMovie.runtime && <span>{featuredMovie.runtime} min</span>}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/movie/${featuredMovie._id}`)}
                className="px-8 py-3 bg-white text-black rounded font-semibold hover:bg-opacity-80 transition flex items-center"
              >
                <span className="mr-2">▶</span> Play
              </button>
              <button
                onClick={() => navigate(`/movie/${featuredMovie._id}`)}
                className="px-8 py-3 bg-gray-600 bg-opacity-70 text-white rounded font-semibold hover:bg-opacity-50 transition"
              >
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Sections */}
      <div className="relative z-10 -mt-32 px-8 md:px-16 pb-16 space-y-12">
        {/* Continue Watching */}
        <ContinueWatchingRow continueWatching={continueWatching} />

        {/* Top 10 This Week */}
        <Top10Row top10Movies={top10Movies} />

        {/* Recently Added */}
        <RecentlyAddedRow movies={recentlyAdded} />

        {/* Recommended For You */}
        {recommendations.personalized.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">Recommended For You</h2>
              <button
                onClick={() => navigate('/recommendations')}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                See All →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recommendations.personalized.slice(0, 6).map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Trending Now */}
        {recommendations.trending.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Trending Now</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recommendations.trending.slice(0, 6).map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Top Picks For You */}
        {recommendations.topPicks.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Top Picks For You</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recommendations.topPicks.slice(0, 6).map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* All Movies */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Browse All</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.slice(0, 18).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Browse;
