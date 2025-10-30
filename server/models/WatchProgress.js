const mongoose = require('mongoose');

const watchProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: null
  },
  progress: {
    type: Number, // seconds watched
    required: true,
    default: 0
  },
  duration: {
    type: Number, // total duration in seconds
    required: true
  },
  percentage: {
    type: Number, // completion percentage
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastWatched: {
    type: Date,
    default: Date.now
  },
  device: {
    type: String,
    default: 'web'
  }
}, {
  timestamps: true
});

// Index for fast queries
watchProgressSchema.index({ userId: 1, lastWatched: -1 });
watchProgressSchema.index({ userId: 1, movieId: 1 }, { unique: true });

// Auto-calculate percentage before save
watchProgressSchema.pre('save', function(next) {
  if (this.duration > 0) {
    this.percentage = Math.round((this.progress / this.duration) * 100);
    // Mark as completed if watched 90% or more
    if (this.percentage >= 90) {
      this.completed = true;
    }
  }
  next();
});

module.exports = mongoose.model('WatchProgress', watchProgressSchema);
