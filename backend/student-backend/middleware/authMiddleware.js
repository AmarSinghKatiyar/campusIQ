// Authentication Middleware
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

/**
 * Protect routes by verifying JWT token from cookies
 * Attaches authenticated student to req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login first.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find student by ID and attach to request
    req.user = await Student.findById(decoded.id);

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    next();
  } catch (error) {
    // Handle different JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error: ' + error.message,
    });
  }
};

module.exports = authMiddleware;
