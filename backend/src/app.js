const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// Import routes
const studentRoutes = require('../routes/studentRoutes');
const authRoutes = require('../routes/authRoutes');
const notificationRoutes = require('../routes/notificationRoutes');
const opportunityRoutes = require('../routes/opportunityRoutes');
const assessmentRoutes = require("../routes/assessmentRoutes");
// Initialize Express app
const app = express();

/**
 * Middleware Configuration
 */

// CORS middleware - Allow requests from frontend
app.use(
  cors({
    origin:'http://localhost:5173',
    credentials: true, // Allow cookies to be sent
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Cookie parser middleware - Parse JWT from cookies
app.use(cookieParser());

/**
 * API Routes
 */

// Authentication routes
app.use('/api/auth', authRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// Opportunity routes
app.use('/api/opportunities', opportunityRoutes);

// Student routes (all protected)
app.use('/api/students', studentRoutes);

//assessment routes
app.use("/api/assessments", assessmentRoutes);

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

/**
 * 404 Error handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

module.exports = app;