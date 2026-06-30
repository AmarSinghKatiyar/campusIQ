// Student Routes
const express = require('express');
const {
  getProfile,
  updateProfile,
  uploadResume,
  deleteResume,
  getDashboard,
} = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadMiddleware, handleUploadErrors } = require('../middleware/uploadMiddleware');

const router = express.Router();

/**
 * Student Profile Routes
 * All routes are protected with JWT authentication
 */

/**
 * GET /api/students/profile
 * Get logged-in student's complete profile
 * Protected: Yes (Requires valid JWT token in cookies)
 */
router.get('/profile', authMiddleware, getProfile);

/**
 * PUT /api/students/profile
 * Update student profile (allowed fields only)
 * Protected: Yes (Requires valid JWT token in cookies)
 * Body: { name, email, cgpa, skills, githubUrl, linkedinUrl, phoneNumber, securityPreferences }
 */
router.put('/profile', authMiddleware, updateProfile);

/**
 * POST /api/students/upload-resume
 * Upload resume PDF to Cloudinary
 * Protected: Yes (Requires valid JWT token in cookies)
 * File: resume (PDF, max 5MB)
 */
router.post('/upload-resume', authMiddleware, uploadMiddleware, handleUploadErrors, uploadResume);

/**
 * GET /api/students/dashboard
 * Student Dashboard
 * Protected: Yes
 */
router.get('/dashboard', authMiddleware, getDashboard);

/**
 * DELETE /api/students/resume
 * Delete student's resume from Cloudinary
 * Protected: Yes (Requires valid JWT token in cookies)
 */
router.delete('/resume', authMiddleware, deleteResume);

module.exports = router;
