const express = require('express');
const {
  getNotifications,
  deleteNotification,
  markAsRead,
  broadcastNotification,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', getNotifications);
router.delete('/:notificationId', deleteNotification);
router.patch('/:notificationId/read', markAsRead);
router.post('/broadcast', broadcastNotification);

module.exports = router;
