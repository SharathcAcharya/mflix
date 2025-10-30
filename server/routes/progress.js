const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const WatchProgress = require('../models/WatchProgress');
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

// @route   POST /api/progress
// @desc    Save or update watch progress
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, progress, duration } = req.body;
    const userId = req.user.id;

    if (!movieId || progress === undefined || !duration) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    // Update or create progress
    let watchProgress = await WatchProgress.findOneAndUpdate(
      { userId, movieId },
      {
        progress,
        duration,
        lastWatched: new Date(),
        $inc: { watchCount: 1 }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      progress: watchProgress
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// @route   GET /api/progress/:movieId
// @desc    Get watch progress for a specific movie
// @access  Private
router.get('/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const progress = await WatchProgress.findOne({ userId, movieId });

    if (!progress) {
      return res.json({
        success: true,
        progress: null
      });
    }

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/progress/continue-watching
// @desc    Get continue watching list (recently watched, not completed)
// @access  Private
router.get('/list/continue-watching', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const progressList = await WatchProgress.find({
      userId,
      completed: false,
      percentage: { $gte: 5, $lt: 90 } // At least 5% watched, less than 90%
    })
      .sort({ lastWatched: -1 })
      .limit(parseInt(limit))
      .populate('movieId', 'title poster plot genres runtime year imdb')
      .lean();

    // Filter out any entries where movie was deleted
    const validProgress = progressList.filter(p => p.movieId);

    res.json({
      success: true,
      continueWatching: validProgress
    });
  } catch (error) {
    console.error('Error fetching continue watching:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/progress/recently-watched
// @desc    Get recently watched movies (all, including completed)
// @access  Private
router.get('/list/recently-watched', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;

    const progressList = await WatchProgress.find({ userId })
      .sort({ lastWatched: -1 })
      .limit(parseInt(limit))
      .populate('movieId', 'title poster plot genres runtime year imdb')
      .lean();

    const validProgress = progressList.filter(p => p.movieId);

    res.json({
      success: true,
      recentlyWatched: validProgress
    });
  } catch (error) {
    console.error('Error fetching recently watched:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/progress/:movieId
// @desc    Delete watch progress (remove from continue watching)
// @access  Private
router.delete('/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    await WatchProgress.findOneAndDelete({ userId, movieId });

    res.json({
      success: true,
      message: 'Progress removed'
    });
  } catch (error) {
    console.error('Error deleting progress:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/progress/stats
// @desc    Get watch statistics for user
// @access  Private
router.get('/stats/user', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await WatchProgress.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalWatched: { $sum: 1 },
          totalCompleted: { $sum: { $cond: ['$completed', 1, 0] } },
          totalMinutes: { $sum: { $divide: ['$progress', 60] } }
        }
      }
    ]);

    const result = stats[0] || {
      totalWatched: 0,
      totalCompleted: 0,
      totalMinutes: 0
    };

    res.json({
      success: true,
      stats: {
        ...result,
        totalHours: Math.round(result.totalMinutes / 60)
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
