const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Please authenticate' });
  }
};

// @route   GET /api/profiles
// @desc    Get all profiles for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.userId })
      .select('-__v')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      profiles,
      count: profiles.length
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profiles'
    });
  }
});

// @route   POST /api/profiles
// @desc    Create new profile
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, avatar, isKids, maturityRating } = req.body;

    // Check profile limit
    const profileCount = await Profile.countDocuments({ userId: req.userId });
    if (profileCount >= 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 profiles per account'
      });
    }

    const profile = new Profile({
      userId: req.userId,
      name,
      avatar: avatar || 'default1',
      isKids: isKids || false,
      maturityRating: isKids ? 'kids' : (maturityRating || 'all')
    });

    await profile.save();

    res.status(201).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create profile'
    });
  }
});

// @route   GET /api/profiles/:id
// @desc    Get profile by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('watchlist', 'title poster year rated imdb.rating');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// @route   PUT /api/profiles/:id
// @desc    Update profile
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, avatar, isKids, maturityRating, autoPlayNext, language, preferences } = req.body;

    const profile = await Profile.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Update fields
    if (name) profile.name = name;
    if (avatar) profile.avatar = avatar;
    if (typeof isKids !== 'undefined') profile.isKids = isKids;
    if (maturityRating) profile.maturityRating = maturityRating;
    if (typeof autoPlayNext !== 'undefined') profile.autoPlayNext = autoPlayNext;
    if (language) profile.language = language;
    if (preferences) profile.preferences = { ...profile.preferences, ...preferences };

    await profile.save();

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @route   DELETE /api/profiles/:id
// @desc    Delete profile
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile'
    });
  }
});

// @route   POST /api/profiles/:id/watchlist/:movieId
// @desc    Add movie to profile watchlist
// @access  Private
router.post('/:id/watchlist/:movieId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    if (!profile.watchlist.includes(req.params.movieId)) {
      profile.watchlist.push(req.params.movieId);
      await profile.save();
    }

    res.json({
      success: true,
      watchlist: profile.watchlist
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to watchlist'
    });
  }
});

// @route   DELETE /api/profiles/:id/watchlist/:movieId
// @desc    Remove movie from profile watchlist
// @access  Private
router.delete('/:id/watchlist/:movieId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.watchlist = profile.watchlist.filter(
      id => id.toString() !== req.params.movieId
    );
    await profile.save();

    res.json({
      success: true,
      watchlist: profile.watchlist
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from watchlist'
    });
  }
});

module.exports = router;
