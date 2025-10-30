const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('watchlist', 'title poster year imdb.rating')
      .populate('watchHistory.movieId', 'title poster');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, preferences } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @route   POST /api/users/watchlist/:movieId
// @desc    Add movie to watchlist
// @access  Private
router.post('/watchlist/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.watchlist.includes(req.params.movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist'
      });
    }

    user.watchlist.push(req.params.movieId);
    await user.save();

    res.json({
      success: true,
      message: 'Movie added to watchlist',
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to watchlist'
    });
  }
});

// @route   DELETE /api/users/watchlist/:movieId
// @desc    Remove movie from watchlist
// @access  Private
router.delete('/watchlist/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.watchlist = user.watchlist.filter(
      id => id.toString() !== req.params.movieId
    );
    await user.save();

    res.json({
      success: true,
      message: 'Movie removed from watchlist',
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from watchlist'
    });
  }
});

// @route   GET /api/users/watchlist
// @desc    Get user's watchlist
// @access  Private
router.get('/watchlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchlist', 'title poster year rated imdb.rating genres');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist'
    });
  }
});

// @route   POST /api/users/watch-history
// @desc    Add to watch history
// @access  Private
router.post('/watch-history', auth, async (req, res) => {
  try {
    const { movieId, progress, duration } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if movie already in history
    const existingIndex = user.watchHistory.findIndex(
      item => item.movieId.toString() === movieId
    );

    if (existingIndex > -1) {
      // Update existing entry
      user.watchHistory[existingIndex].timestamp = Date.now();
      user.watchHistory[existingIndex].progress = progress;
      user.watchHistory[existingIndex].duration = duration;
    } else {
      // Add new entry
      user.watchHistory.push({
        movieId,
        progress,
        duration,
        timestamp: Date.now()
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Watch history updated'
    });
  } catch (error) {
    console.error('Error updating watch history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update watch history'
    });
  }
});

// @route   GET /api/users/all
// @desc    Get all users (Admin only)
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

module.exports = router;
