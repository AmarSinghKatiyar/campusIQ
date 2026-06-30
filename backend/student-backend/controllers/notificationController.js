const Notification = require('../models/Notification');

/**
 * ========================================
 *      Notification Controller
 * ========================================
 */

/**
 * Get all notifications for the logged-in user
 * @route   GET /api/notifications
 * @access  Protected
 */
exports.getAllNotifications = async (req, res) => {
  try {
    // req.user is attached by authMiddleware
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error('Error in getAllNotifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications: ' + error.message,
    });
  }
};

/**
 * Mark a single notification as read
 * @route   POST /api/notifications/:id/read
 * @access  Protected
 */
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id, // Ensure the notification belongs to the user
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or you do not have permission to modify it',
      });
    }

    // If already read, no need to update
    if (notification.isRead) {
      return res.status(200).json({
        success: true,
        message: 'Notification was already marked as read',
        data: notification,
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification: ' + error.message,
    });
  }
};

/**
 * Mark all unread notifications as read for the logged-in user
 * @route   POST /api/notifications/read-all
 * @access  Protected
 */
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: 'All unread notifications marked as read',
    });
  } catch (error) {
    console.error('Error in markAllAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notifications: ' + error.message,
    });
  }
};