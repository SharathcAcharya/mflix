const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
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

// @route   GET /api/comments/:movieId
// @desc    Get all comments for a movie
// @access  Public
router.get('/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    const sortOption = sort === 'newest' ? { createdAt: -1 } : 
                       sort === 'oldest' ? { createdAt: 1 } :
                       sort === 'topRated' ? { rating: -1 } :
                       sort === 'mostLiked' ? { 'likes': -1 } : { createdAt: -1 };

    const comments = await Comment.find({ movieId })
      .populate('userId', 'name avatar')
      .populate('replies.userId', 'name avatar')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Comment.countDocuments({ movieId });

    // Calculate average rating
    const ratingStats = await Comment.aggregate([
      { $match: { movieId: new mongoose.Types.ObjectId(movieId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      stats: ratingStats[0] || { avgRating: 0, count: 0 }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
});

// @route   POST /api/comments
// @desc    Create a new comment
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, text, rating } = req.body;

    // Validate movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Check if user already commented
    const existingComment = await Comment.findOne({
      movieId,
      userId: req.user.id
    });

    if (existingComment) {
      return res.status(400).json({
        success: false,
        message: 'You have already commented on this movie'
      });
    }

    const comment = new Comment({
      movieId,
      userId: req.user.id,
      text,
      rating
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'name avatar');

    res.status(201).json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ success: false, message: 'Failed to create comment' });
  }
});

// @route   PUT /api/comments/:commentId
// @desc    Update a comment
// @access  Private
router.put('/:commentId', auth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text, rating } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    comment.text = text || comment.text;
    comment.rating = rating || comment.rating;
    comment.isEdited = true;
    comment.updatedAt = Date.now();

    await comment.save();

    res.json({ success: true, comment });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ success: false, message: 'Failed to update comment' });
  }
});

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment
// @access  Private
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await comment.deleteOne();

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, message: 'Failed to delete comment' });
  }
});

// @route   POST /api/comments/:commentId/like
// @desc    Like/Unlike a comment
// @access  Private
router.post('/:commentId/like', auth, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex > -1) {
      // Unlike
      comment.likes.splice(userIndex, 1);
    } else {
      // Like
      comment.likes.push(req.user.id);
    }

    await comment.save();

    res.json({
      success: true,
      likes: comment.likes.length,
      isLiked: userIndex === -1
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ success: false, message: 'Failed to like comment' });
  }
});

// @route   POST /api/comments/:commentId/reply
// @desc    Reply to a comment
// @access  Private
router.post('/:commentId/reply', auth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    comment.replies.push({
      userId: req.user.id,
      text,
      createdAt: Date.now()
    });

    await comment.save();

    const updatedComment = await Comment.findById(commentId)
      .populate('userId', 'name avatar')
      .populate('replies.userId', 'name avatar');

    res.json({ success: true, comment: updatedComment });
  } catch (error) {
    console.error('Error replying to comment:', error);
    res.status(500).json({ success: false, message: 'Failed to reply to comment' });
  }
});

module.exports = router;
