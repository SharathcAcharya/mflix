const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// @route   GET /api/movies
// @desc    Get all movies with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find()
      .select('title plot poster year rated imdb.rating imdb.votes genres streamingUrl trailerUrl runtime cast directors')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1, 'imdb.rating': -1 });

    const total = await Movie.countDocuments();

    res.json({
      success: true,
      movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies'
    });
  }
});

// @route   GET /api/movies/search
// @desc    Search movies
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const movies = await Movie.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { plot: { $regex: q, $options: 'i' } },
        { genres: { $regex: q, $options: 'i' } },
        { cast: { $regex: q, $options: 'i' } }
      ]
    })
      .select('title plot poster year rated imdb.rating genres')
      .limit(20);

    res.json({
      success: true,
      movies,
      count: movies.length
    });
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

// @route   GET /api/movies/:id
// @desc    Get movie by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      movie
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movie'
    });
  }
});

// @route   GET /api/movies/genre/:genre
// @desc    Get movies by genre
// @access  Public
router.get('/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({
      genres: { $regex: genre, $options: 'i' }
    })
      .select('title plot poster year rated imdb.rating genres streamingUrl trailerUrl')
      .limit(limit)
      .skip(skip)
      .sort({ 'imdb.rating': -1 });

    res.json({
      success: true,
      movies,
      genre,
      count: movies.length
    });
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies'
    });
  }
});

// @route   GET /api/movies/trending/top10
// @desc    Get Top 10 trending movies this week
// @access  Public
router.get('/trending/top10', async (req, res) => {
  try {
    const WatchProgress = require('../models/WatchProgress');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get most watched movies in the last 7 days
    const topMovies = await WatchProgress.aggregate([
      {
        $match: {
          lastWatched: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: '$movieId',
          watchCount: { $sum: 1 },
          totalProgress: { $sum: '$progress' },
          avgCompletion: { $avg: '$percentage' }
        }
      },
      {
        $sort: { watchCount: -1, avgCompletion: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Populate movie details
    const movieIds = topMovies.map(m => m._id);
    const movies = await Movie.find({ _id: { $in: movieIds } })
      .select('title plot poster year rated imdb.rating genres streamingUrl trailerUrl');

    // Merge watch stats with movie data and add ranking
    const top10WithStats = movies.map((movie, index) => {
      const stats = topMovies.find(t => t._id.toString() === movie._id.toString());
      return {
        rank: index + 1,
        movie: movie,
        stats: {
          watchCount: stats?.watchCount || 0,
          avgCompletion: Math.round(stats?.avgCompletion || 0)
        }
      };
    });

    res.json({
      success: true,
      top10: top10WithStats,
      period: 'Last 7 days'
    });
  } catch (error) {
    console.error('Error fetching top 10:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top 10 movies'
    });
  }
});

// @route   GET /api/movies/recently-added
// @desc    Get recently added movies
// @access  Public
router.get('/recently-added/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    // Get recently added movies - sort by createdAt if available, otherwise by year
    const movies = await Movie.find()
      .select('title plot poster year rated imdb.rating genres released streamingUrl trailerUrl createdAt')
      .sort({ createdAt: -1, year: -1 })
      .limit(limit);

    res.json({
      success: true,
      movies,
      count: movies.length
    });
  } catch (error) {
    console.error('Error fetching recently added:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recently added movies'
    });
  }
});

module.exports = router;
