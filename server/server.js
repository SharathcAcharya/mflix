const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const seriesRoutes = require('./routes/series');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');
const recommendationRoutes = require('./routes/recommendations');
const progressRoutes = require('./routes/progress');
const profileRoutes = require('./routes/profiles');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    });
    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Connected to: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Trying alternative connection methods...');
    
    // Fallback: Try without SRV
    try {
      const fallbackURI = process.env.MONGODB_URI_FALLBACK || process.env.MONGODB_URI.replace('mongodb+srv://', 'mongodb://');
      await mongoose.connect(fallbackURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4
      });
      console.log('✅ MongoDB connected with fallback method');
    } catch (fallbackErr) {
      console.error('❌ Fallback connection also failed:', fallbackErr.message);
      console.log('⚠️  Please check your internet connection and MongoDB Atlas settings');
    }
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ScreenPlex API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
});
