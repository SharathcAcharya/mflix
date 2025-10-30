const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  avatar: {
    type: String,
    default: 'default1' // default1, default2, default3, etc.
  },
  isKids: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'en'
  },
  autoPlayNext: {
    type: Boolean,
    default: true
  },
  maturityRating: {
    type: String,
    enum: ['all', 'kids', 'teen', 'adult'],
    default: 'all'
  },
  watchlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  preferences: {
    genres: [String],
    hideSeenContent: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for fast user profile queries
profileSchema.index({ userId: 1 });

// Limit to 5 profiles per user
profileSchema.pre('save', async function(next) {
  if (this.isNew) {
    const profileCount = await this.constructor.countDocuments({ userId: this.userId });
    if (profileCount >= 5) {
      throw new Error('Maximum 5 profiles per account');
    }
  }
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
