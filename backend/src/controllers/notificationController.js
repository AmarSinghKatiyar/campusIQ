const Student = require('../models/Student');

const getStudentByQuery = async (query) => {
  const filter = {};

  if (query.email) {
    filter.email = query.email.toLowerCase();
  }

  if (query.id) {
    filter._id = query.id;
  }

  if (!filter.email && !filter._id) {
    throw new Error('Email or student id is required');
  }

  return Student.findOne(filter);
};

exports.getNotifications = async (req, res) => {
  try {
    const student = await getStudentByQuery(req.query);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const notifications = (student.notifications || [])
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      data: {
        notifications,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Unable to fetch notifications',
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const student = await getStudentByQuery(req.query);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const notification = student.notifications.id(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    notification.remove();
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Notification removed successfully',
      data: {
        notifications: student.notifications,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Unable to remove notification',
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const student = await getStudentByQuery(req.query);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const notification = student.notifications.id(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    notification.isRead = true;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: {
        notification,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Unable to mark notification as read',
    });
  }
};

exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, link } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required for broadcasts',
      });
    }

    const notification = {
      title,
      message,
      link: link || null,
      isRead: false,
      createdAt: new Date(),
    };

    await Student.updateMany({}, { $push: { notifications: { $each: [notification] } } });

    res.status(200).json({
      success: true,
      message: 'Notification broadcast to all students successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Unable to broadcast notification',
    });
  }
};
