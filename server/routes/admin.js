const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Series = require('../models/Series');
const WatchProgress = require('../models/WatchProgress');
const Profile = require('../models/Profile');

// Admin Auth Middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No admin token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Admin account not found or inactive' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid admin token' });
  }
};

// Check specific permission
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin.permissions[permission] && req.admin.role !== 'super-admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};

// @route   POST /api/admin/auth/login
// @desc    Admin login
// @access  Public
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (admin.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later.'
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact super admin.'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      // Increment login attempts
      admin.loginAttempts += 1;
      
      // Lock account after 5 failed attempts
      if (admin.loginAttempts >= 5) {
        admin.lockUntil = Date.now() + 30 * 60 * 1000; // Lock for 30 minutes
      }
      
      await admin.save();

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts and update last login
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLogin = Date.now();
    await admin.save();

    // Create token
    const token = jwt.sign(
      { 
        adminId: admin._id, 
        role: 'admin',
        permissions: admin.permissions
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// @route   POST /api/admin/auth/register
// @desc    Register new admin (Super admin only)
// @access  Private
router.post('/auth/register', adminAuth, checkPermission('canManageAdmins'), async (req, res) => {
  try {
    const { username, email, password, fullName, role, permissions } = req.body;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this username or email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: role || 'admin',
      permissions: permissions || {}
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin'
    });
  }
});

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalMovies,
      totalProfiles,
      totalWatchProgress,
      recentUsers,
      topMovies
    ] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Profile.countDocuments(),
      WatchProgress.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      WatchProgress.aggregate([
        { $group: { _id: '$movieId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    // Get movie details for top movies
    const topMovieIds = topMovies.map(m => m._id);
    const topMovieDetails = await Movie.find({ _id: { $in: topMovieIds } })
      .select('title poster year imdb.rating');

    const topMoviesWithDetails = topMovies.map(tm => {
      const movie = topMovieDetails.find(m => m._id.toString() === tm._id.toString());
      return {
        ...movie?._doc,
        viewCount: tm.count
      };
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalMovies,
        totalProfiles,
        totalViews: totalWatchProgress,
        recentUsers,
        topMovies: topMoviesWithDetails
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private
router.get('/users', adminAuth, checkPermission('canManageUsers'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search 
      ? { $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]}
      : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private
router.delete('/users/:id', adminAuth, checkPermission('canManageUsers'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete related data
    await Promise.all([
      Profile.deleteMany({ userId: req.params.id }),
      WatchProgress.deleteMany({ userId: req.params.id })
    ]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// @route   GET /api/admin/movies
// @desc    Get all movies with pagination
// @access  Private
router.get('/movies', adminAuth, checkPermission('canManageMovies'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search 
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const [movies, total] = await Promise.all([
      Movie.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Movie.countDocuments(query)
    ]);

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
    console.error('Get movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies'
    });
  }
});

// @route   POST /api/admin/movies
// @desc    Add new movie
// @access  Private
router.post('/movies', adminAuth, checkPermission('canManageMovies'), async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();

    res.status(201).json({
      success: true,
      message: 'Movie added successfully',
      movie
    });
  } catch (error) {
    console.error('Add movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add movie'
    });
  }
});

// @route   PUT /api/admin/movies/:id
// @desc    Update movie
// @access  Private
router.put('/movies/:id', adminAuth, checkPermission('canManageMovies'), async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      message: 'Movie updated successfully',
      movie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update movie'
    });
  }
});

// @route   DELETE /api/admin/movies/:id
// @desc    Delete movie
// @access  Private
router.delete('/movies/:id', adminAuth, checkPermission('canManageMovies'), async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Delete related watch progress
    await WatchProgress.deleteMany({ movieId: req.params.id });

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete movie'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get analytics data
// @access  Private
router.get('/analytics', adminAuth, checkPermission('canViewAnalytics'), async (req, res) => {
  try {
    // User growth over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Most watched genres
    const genreStats = await Movie.aggregate([
      { $unwind: '$genres' },
      {
        $group: {
          _id: '$genres',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Watch completion rates
    const completionRates = await WatchProgress.aggregate([
      {
        $group: {
          _id: null,
          avgCompletion: { $avg: '$percentage' },
          totalWatches: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $gte: ['$percentage', 90] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        userGrowth,
        genreStats,
        completionRates: completionRates[0] || { avgCompletion: 0, totalWatches: 0, completed: 0 }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// @route   GET /api/admin/profile
// @desc    Get admin profile
// @access  Private
router.get('/profile', adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    
    res.json({
      success: true,
      admin
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// ==================== SERIES MANAGEMENT ====================

// @route   GET /api/admin/series
// @desc    Get all series
// @access  Private (Admin)
router.get('/series', adminAuth, checkPermission('canManageMovies'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search 
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const [series, total] = await Promise.all([
      Series.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Series.countDocuments(query)
    ]);

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
    console.error('Get series error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch series'
    });
  }
});

// @route   POST /api/admin/series
// @desc    Add new series
// @access  Private (Admin)
router.post('/series', adminAuth, checkPermission('canManageMovies'), async (req, res) => {
  try {
    const series = new Series(req.body);
    await series.save();

    res.status(201).json({
      success: true,
      message: 'Series added successfully',
      series
    });
  } catch (error) {
    console.error('Add series error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add series'
    });
  }
});

// @route   PUT /api/admin/series/:id
// @desc    Update series
// @access  Private (Admin)
router.put('/series/:id', adminAuth, checkPermission('canManageMovies'), async (req, res) => {
  try {
    const series = await Series.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series not found'
      });
    }

    res.json({
      success: true,
      message: 'Series updated successfully',
      series
    });
  } catch (error) {
    console.error('Update series error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update series'
    });
  }
});

// @route   DELETE /api/admin/series/:id
// @desc    Delete series
// @access  Private (Admin)
router.delete('/series/:id', adminAuth, checkPermission('canManageMovies'), async (req, res) => {
  try {
    const series = await Series.findByIdAndDelete(req.params.id);

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series not found'
      });
    }

    res.json({
      success: true,
      message: 'Series deleted successfully'
    });
  } catch (error) {
    console.error('Delete series error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete series'
    });
  }
});

module.exports = router;
