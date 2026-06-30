const express = require('express');
const {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * ========================================
 *          Notification Routes
 * ========================================
 * All routes are protected with JWT authentication.
 * Base Path: /api/notifications
 */

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for the logged-in user
 * @access  Protected
 */
router.get('/', authMiddleware, getAllNotifications);

/**
 * @route   POST /api/notifications/:id/read
 * @desc    Mark a single notification as read by its ID
 * @access  Protected
 */
router.post('/:id/read', authMiddleware, markAsRead);

/**
 * @route   POST /api/notifications/read-all
 * @desc    Mark all unread notifications as read for the logged-in user
 * @access  Protected
 */
router.post('/read-all', authMiddleware, markAllAsRead);

module.exports = router;