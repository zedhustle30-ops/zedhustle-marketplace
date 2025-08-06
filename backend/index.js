const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_001',
      message: 'Too many requests, please try again later'
    }
  }
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_002',
      message: 'Too many authentication attempts, please try again later'
    }
  }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const investmentRoutes = require('./routes/investments');
const tradingRoutes = require('./routes/trading');
const paymentRoutes = require('./routes/payments');
const zedForexRoutes = require('./routes/zedforex');
const zedInvestRoutes = require('./routes/zedinvest');
const messageRoutes = require('./routes/messages');
const referralRoutes = require('./routes/referrals');
const bidRoutes = require('./routes/bids');

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/zedforex', zedForexRoutes);
app.use('/api/zedinvest', zedInvestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/bids', bidRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "ZedHustle API is running 🚀",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ZedHustle API 🚀",
    documentation: "/api/docs",
    health: "/api/health"
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: {
      code: error.code || 'SERVER_001',
      message: error.message || 'Internal server error'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ZedHustle API running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
