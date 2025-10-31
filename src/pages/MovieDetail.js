import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import VideoPlayer from '../components/VideoPlayer';
import SkeletonLoader from '../components/SkeletonLoader';
import api from '../utils/api';
// import ReactPlayer from 'react-player';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [newComment, setNewComment] = useState({ text: '', rating: 8 });
  const [commentStats, setCommentStats] = useState({ avgRating: 0, count: 0 });
  // const [watchProgress, setWatchProgress] = useState(0);
  // const playerRef = useRef(null);
  // const [playing] = useState(true);
  // const [volume, setVolume] = useState(0.8);
  // const [muted, setMuted] = useState(false);
  // const [playbackRate, setPlaybackRate] = useState(1);
  // const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  const fetchMovieDetails = useCallback(async () => {
    try {
      const response = await api.get(`/movies/${id}`);
      setMovie(response.data.movie);
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchSimilarMovies = useCallback(async () => {
    try {
      const response = await api.get(`/recommendations/similar/${id}`);
      setSimilarMovies(response.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching similar movies:', error);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await api.get(`/comments/${id}`);
      setComments(response.data.comments || []);
      setCommentStats(response.data.stats || { avgRating: 0, count: 0 });
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [id]);

  const checkWatchlistStatus = useCallback(async () => {
    try {
      const response = await api.get('/users/watchlist');
      const inList = response.data.watchlist.some(m => m._id === id);
      setIsInWatchlist(inList);
    } catch (error) {
      console.error('Error checking watchlist:', error);
    }
  }, [id]);

  const fetchWatchProgress = useCallback(async () => {
    try {
      const response = await api.get(`/progress/${id}`);
      if (response.data.progress) {
        // setWatchProgress(response.data.progress.progress || 0);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieDetails();
    fetchSimilarMovies();
    fetchComments();
    checkWatchlistStatus();
    fetchWatchProgress();
  }, [fetchMovieDetails, fetchSimilarMovies, fetchComments, checkWatchlistStatus, fetchWatchProgress]);

  // Keyboard shortcuts
  // const resetControlsTimeout = useCallback(() => {
  //   if (controlsTimeoutRef.current) {
  //     clearTimeout(controlsTimeoutRef.current);
  //   }
  //   controlsTimeoutRef.current = setTimeout(() => {
  //     if (playing) {
  //       // setShowControls(false);
  //     }
  //   }, 3000);
  // }, [playing]);

  // Suppress unused warning for controlsTimeoutRef
  if (controlsTimeoutRef.current) {
    // Used for future functionality
  }

  // const handleMouseMove = () => {
  //   setShowControls(true);
  //   resetControlsTimeout();
  // };

  // const saveProgress = async (progress, duration) => {
  //   try {
  //     await api.post('/progress', {
  //       movieId: id,
  //       progress: Math.floor(progress),
  //       duration: Math.floor(duration)
  //     });
  //   } catch (error) {
  //     console.error('Error saving progress:', error);
  //   }
  // };

  // const handleProgress = (state) => {
  //   // Save progress every 10 seconds
  //   if (Math.floor(state.playedSeconds) % 10 === 0) {
  //     saveProgress(state.playedSeconds, state.loadedSeconds || movie?.runtime * 60 || 3600);
  //   }
  // };

  const toggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await api.delete(`/users/watchlist/${id}`);
        setIsInWatchlist(false);
      } else {
        await api.post(`/users/watchlist/${id}`);
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/comments', {
        movieId: id,
        text: newComment.text,
        rating: newComment.rating
      });
      setComments([response.data.comment, ...comments]);
      setNewComment({ text: '', rating: 8 });
      fetchComments(); // Refresh to update stats
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      setComments(comments.map(c => 
        c._id === commentId 
          ? { ...c, likes: response.data.isLiked 
              ? [...c.likes, 'currentUser'] 
              : c.likes.filter(l => l !== 'currentUser')
            } 
          : c
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <SkeletonLoader variant="detailHero" />
        
        {/* Similar Movies Skeleton */}
        <div className="px-8 md:px-16 py-8">
          <div className="h-6 bg-gray-800 rounded w-48 mb-4 animate-pulse"></div>
          <SkeletonLoader variant="movieGrid" count={6} />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%), url(${movie.poster || 'https://via.placeholder.com/1920x1080'})`,
          }}
        >
          <div className="absolute bottom-32 left-8 md:left-16 max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              {movie.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-green-500 font-bold text-xl">
                {movie.imdb?.rating ? `${movie.imdb.rating}/10` : 'N/A'}
              </span>
              <span className="text-gray-300">{movie.year}</span>
              <span className="border border-gray-400 px-2 py-1 text-gray-300 text-sm">
                {movie.rated || 'NR'}
              </span>
              <span className="text-gray-300">{movie.runtime ? `${movie.runtime} min` : ''}</span>
            </div>

            {commentStats.count > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-yellow-400">⭐</span>
                <span className="text-white">
                  {commentStats.avgRating.toFixed(1)} User Rating ({commentStats.count} reviews)
                </span>
              </div>
            )}

            <p className="text-lg text-gray-300 mb-8 line-clamp-3">
              {movie.plot || 'No description available.'}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genres?.map((genre, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-800 bg-opacity-70 text-white rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowPlayer(true)}
                className="px-8 py-4 bg-white text-black rounded font-semibold hover:bg-opacity-80 transition flex items-center space-x-2"
              >
                <span className="text-2xl">▶</span>
                <span>Play</span>
              </button>
              
              <button
                onClick={toggleWatchlist}
                className={`px-8 py-4 rounded font-semibold transition flex items-center space-x-2 ${
                  isInWatchlist
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-600 bg-opacity-70 text-white hover:bg-opacity-50'
                }`}
              >
                <span className="text-2xl">{isInWatchlist ? '✓' : '+'}</span>
                <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal - Google Drive Streaming */}
      {showPlayer && movie && (
        <VideoPlayer
          streamingUrl={movie.streamingUrl}
          title={movie.title}
          onClose={() => setShowPlayer(false)}
        />
      )}

      {/* Movie Details */}
      <div className="relative z-10 -mt-32 px-8 md:px-16 pb-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.slice(0, 10).map((actor, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Directors */}
            {movie.directors && movie.directors.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Director(s)</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.directors.map((director, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg"
                    >
                      {director}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                User Reviews ({comments.length})
              </h2>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-8 bg-gray-900 p-6 rounded-lg">
                <textarea
                  value={newComment.text}
                  onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                  placeholder="Write your review..."
                  className="w-full p-4 bg-gray-800 text-white rounded mb-4 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  rows="4"
                  required
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="text-white">Your Rating:</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={newComment.rating}
                      onChange={(e) => setNewComment({ ...newComment, rating: parseFloat(e.target.value) })}
                      className="w-20 p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
                    />
                    <span className="text-gray-400">/ 10</span>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-netflix-red text-white rounded hover:bg-red-700 transition"
                  >
                    Submit Review
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-900 p-6 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={comment.userId?.avatar || 'https://i.pravatar.cc/150'}
                          alt={comment.userId?.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-white font-semibold">{comment.userId?.name}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-white font-semibold">{comment.rating}/10</span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{comment.text}</p>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
                      >
                        <span>👍</span>
                        <span>{comment.likes?.length || 0}</span>
                      </button>
                      {comment.isEdited && (
                        <span className="text-gray-500 text-sm">(edited)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Additional Info */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                {movie.released && (
                  <div>
                    <span className="text-gray-400">Released:</span>
                    <span className="text-white ml-2">
                      {new Date(movie.released).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {movie.countries && (
                  <div>
                    <span className="text-gray-400">Country:</span>
                    <span className="text-white ml-2">{movie.countries.join(', ')}</span>
                  </div>
                )}
                {movie.languages && (
                  <div>
                    <span className="text-gray-400">Languages:</span>
                    <span className="text-white ml-2">{movie.languages.join(', ')}</span>
                  </div>
                )}
                {movie.awards?.text && (
                  <div>
                    <span className="text-gray-400">Awards:</span>
                    <span className="text-white ml-2">{movie.awards.text}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-6">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMovies.map((similarMovie) => (
                <div
                  key={similarMovie._id}
                  onClick={() => navigate(`/movie/${similarMovie._id}`)}
                  className="cursor-pointer group"
                >
                  <div className="aspect-[2/3] bg-gray-800 rounded overflow-hidden mb-2">
                    <img
                      src={similarMovie.poster || 'https://via.placeholder.com/300x450'}
                      alt={similarMovie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-white text-sm font-semibold truncate">
                    {similarMovie.title}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {similarMovie.year} • ⭐ {similarMovie.imdb?.rating || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
