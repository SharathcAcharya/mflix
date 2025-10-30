const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  plot: String,
  genres: [String],
  runtime: Number,
  cast: [String],
  directors: [String],
  year: Number,
  rated: String,
  poster: String,
  streamingUrl: {
    type: String,
    default: ''
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  imdb: {
    rating: Number,
    votes: Number,
    id: String
  },
  released: Date,
  type: {
    type: String,
    enum: ['movie', 'series'],
    default: 'movie'
  },
  countries: [String],
  languages: [String],
  awards: {
    wins: Number,
    nominations: Number,
    text: String
  },
  tomatoes: {
    viewer: {
      rating: Number,
      numReviews: Number
    },
    critic: {
      rating: Number,
      numReviews: Number
    }
  }
}, {
  collection: 'movies',
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);
