const express = require('express');
const router = express.Router();
const Series = require('../models/Series');

// @route   GET /api/series
// @desc    Get all series with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const series = await Series.find()
      .select('title plot poster year rated imdb.rating genres status seasons')
      .limit(limit)
      .skip(skip)
      .sort({ 'imdb.rating': -1 });

    const total = await Series.countDocuments();

    res.json({
      success: true,
      series,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch series'
    });
  }
});

// @route   GET /api/series/search
// @desc    Search series
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

    const series = await Series.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { plot: { $regex: q, $options: 'i' } },
        { genres: { $regex: q, $options: 'i' } },
        { cast: { $regex: q, $options: 'i' } }
      ]
    })
      .select('title plot poster year rated imdb.rating genres status')
      .limit(20);

    res.json({
      success: true,
      series,
      count: series.length
    });
  } catch (error) {
    console.error('Error searching series:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

// @route   GET /api/series/:id
// @desc    Get series by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series not found'
      });
    }

    res.json({
      success: true,
      series
    });
  } catch (error) {
    console.error('Error fetching series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch series'
    });
  }
});

// @route   GET /api/series/trending/top10
// @desc    Get top 10 trending series
// @access  Public
router.get('/trending/top10', async (req, res) => {
  try {
    const series = await Series.find()
      .select('title poster imdb.rating genres')
      .sort({ 'imdb.rating': -1 })
      .limit(10);

    res.json({
      success: true,
      top10: series
    });
  } catch (error) {
    console.error('Error fetching top 10 series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top 10 series'
    });
  }
});

module.exports = router;
