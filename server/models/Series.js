const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  episodeNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  plot: String,
  runtime: Number,
  streamingUrl: {
    type: String,
    default: ''
  },
  thumbnail: String,
  airDate: Date
});

const seasonSchema = new mongoose.Schema({
  seasonNumber: {
    type: Number,
    required: true
  },
  title: String,
  episodes: [episodeSchema],
  releaseYear: Number
});

const seriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  plot: String,
  genres: [String],
  cast: [String],
  directors: [String],
  year: Number,
  rated: String,
  poster: String,
  trailerUrl: {
    type: String,
    default: ''
  },
  seasons: [seasonSchema],
  imdb: {
    rating: Number,
    votes: Number,
    id: String
  },
  type: {
    type: String,
    default: 'series'
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'cancelled'],
    default: 'ongoing'
  },
  countries: [String],
  languages: [String],
  awards: {
    wins: Number,
    nominations: Number,
    text: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Series', seriesSchema);
