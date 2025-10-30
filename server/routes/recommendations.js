const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Movie = require('../models/Movie');

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// @route   GET /api/recommendations/personalized
// @desc    Get personalized movie recommendations based on user history and preferences
// @access  Private
router.get('/personalized', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchHistory.movieId', 'genres')
      .populate('watchlist', 'genres');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Extract favorite genres from watch history and watchlist
    const genreMap = new Map();
    
    // Count genres from watch history
    user.watchHistory.forEach(item => {
      if (item.movieId && item.movieId.genres) {
        item.movieId.genres.forEach(genre => {
          genreMap.set(genre, (genreMap.get(genre) || 0) + 2); // Higher weight for watched
        });
      }
    });

    // Count genres from watchlist
    user.watchlist.forEach(movie => {
      if (movie.genres) {
        movie.genres.forEach(genre => {
          genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
        });
      }
    });

    // Add user's favorite genres
    if (user.preferences && user.preferences.favoriteGenres) {
      user.preferences.favoriteGenres.forEach(genre => {
        genreMap.set(genre, (genreMap.get(genre) || 0) + 3); // Highest weight
      });
    }

    // Get top 3 genres
    const topGenres = Array.from(genreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    if (topGenres.length === 0) {
      // If no genre preferences, return popular movies
      const popularMovies = await Movie.find()
        .select('title plot poster year rated imdb.rating genres cast directors')
        .sort({ 'imdb.rating': -1 })
        .limit(20);

      return res.json({
        success: true,
        recommendations: popularMovies,
        reason: 'Popular movies'
      });
    }

    // Get movies matching user's favorite genres
    const watchedMovieIds = user.watchHistory.map(item => item.movieId?._id).filter(Boolean);
    
    const recommendations = await Movie.find({
      genres: { $in: topGenres },
      _id: { $nin: [...watchedMovieIds, ...user.watchlist.map(m => m._id)] },
      'imdb.rating': { $gte: 7.0 }
    })
      .select('title plot poster year rated imdb.rating genres cast directors')
      .sort({ 'imdb.rating': -1 })
      .limit(20);

    res.json({
      success: true,
      recommendations,
      reason: `Based on your interest in ${topGenres.join(', ')}`,
      topGenres
    });
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    res.status(500).json({ success: false, message: 'Failed to get recommendations' });
  }
});

// @route   GET /api/recommendations/similar/:movieId
// @desc    Get similar movies based on a specific movie
// @access  Public
router.get('/similar/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Find similar movies based on genres, directors, and cast
    const similarMovies = await Movie.find({
      _id: { $ne: movieId },
      $or: [
        { genres: { $in: movie.genres } },
        { directors: { $in: movie.directors } },
        { cast: { $in: movie.cast?.slice(0, 3) || [] } }
      ],
      'imdb.rating': { $gte: 6.0 }
    })
      .select('title plot poster year rated imdb.rating genres')
      .sort({ 'imdb.rating': -1 })
      .limit(12);

    res.json({
      success: true,
      recommendations: similarMovies,
      basedOn: movie.title
    });
  } catch (error) {
    console.error('Error getting similar movies:', error);
    res.status(500).json({ success: false, message: 'Failed to get similar movies' });
  }
});

// @route   GET /api/recommendations/trending
// @desc    Get trending movies based on recent user activity
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Get movies that have been recently added to watchlists or watched
    const recentActivity = await User.aggregate([
      { $unwind: '$watchHistory' },
      {
        $match: {
          'watchHistory.timestamp': {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      },
      {
        $group: {
          _id: '$watchHistory.movieId',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) }
    ]);

    const movieIds = recentActivity.map(item => item._id);

    const trendingMovies = await Movie.find({ _id: { $in: movieIds } })
      .select('title plot poster year rated imdb.rating genres');

    // Sort by popularity count
    const sortedMovies = movieIds.map(id => 
      trendingMovies.find(m => m._id.toString() === id.toString())
    ).filter(Boolean);

    res.json({
      success: true,
      recommendations: sortedMovies,
      reason: 'Trending this week'
    });
  } catch (error) {
    console.error('Error getting trending movies:', error);
    res.status(500).json({ success: false, message: 'Failed to get trending movies' });
  }
});

// @route   GET /api/recommendations/because-you-watched/:movieId
// @desc    Get recommendations because user watched a specific movie
// @access  Private
router.get('/because-you-watched/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const user = await User.findById(req.user.id);
    const watchedIds = user.watchHistory.map(item => item.movieId?.toString()).filter(Boolean);

    // Find movies with similar attributes
    const recommendations = await Movie.find({
      _id: { $nin: [...watchedIds, movieId] },
      $or: [
        { genres: { $in: movie.genres } },
        { directors: { $in: movie.directors } },
        { year: { $gte: movie.year - 5, $lte: movie.year + 5 } }
      ],
      'imdb.rating': { $gte: movie.imdb?.rating - 1 }
    })
      .select('title plot poster year rated imdb.rating genres')
      .sort({ 'imdb.rating': -1 })
      .limit(10);

    res.json({
      success: true,
      recommendations,
      reason: `Because you watched ${movie.title}`
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ success: false, message: 'Failed to get recommendations' });
  }
});

// @route   GET /api/recommendations/top-picks
// @desc    Get top picks for user based on comprehensive analysis
// @access  Private
router.get('/top-picks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchHistory.movieId');

    // Analyze viewing patterns
    const viewingTimes = user.watchHistory.map(item => new Date(item.timestamp).getHours());
    const avgViewingTime = viewingTimes.reduce((a, b) => a + b, 0) / viewingTimes.length;

    // Get highly rated movies in preferred genres
    const topPicks = await Movie.find({
      'imdb.rating': { $gte: 8.0 },
      genres: { $in: user.preferences?.favoriteGenres || [] }
    })
      .select('title plot poster year rated imdb.rating genres cast directors')
      .sort({ 'imdb.rating': -1, 'imdb.votes': -1 })
      .limit(15);

    res.json({
      success: true,
      recommendations: topPicks,
      reason: 'Handpicked for you',
      insights: {
        preferredViewingTime: Math.round(avgViewingTime),
        totalWatched: user.watchHistory.length
      }
    });
  } catch (error) {
    console.error('Error getting top picks:', error);
    res.status(500).json({ success: false, message: 'Failed to get top picks' });
  }
});

module.exports = router;
