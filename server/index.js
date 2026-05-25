// ============================================================
// Elite Dine - Main Server Entry Point
// ============================================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// Middleware Setup
// ============================================================

// Enable CORS so the React frontend can communicate with this server
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-production-domain.com'
    : 'http://localhost:3000',
  credentials: true
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ============================================================
// MongoDB Connection
// ============================================================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elitedine');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure if DB connection fails
    process.exit(1);
  }
};

connectDB();

// ============================================================
// API Routes
// ============================================================

// Import route handlers
const reservationRoutes = require('./routes/reservations');
const contactRoutes = require('./routes/contact');
const menuRoutes = require('./routes/menu');
const adminRoutes = require('./routes/admin');

// Mount routes at their respective paths
app.use('/api/reservations', reservationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint - useful for deployment monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Elite Dine API is running',
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// 404 Handler - for undefined routes
// ============================================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ============================================================
// Global Error Handling Middleware
// ============================================================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);

  // Send appropriate error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only show stack trace in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================================
// Start Server
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 Elite Dine Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
