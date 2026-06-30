const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * ========================================
 *        Notification Schema
 * ========================================
 * This schema defines individual notifications that are stored in their own collection.
 * This allows for more scalable and flexible notification management compared to
 * embedding them directly in the user document.
 */
const notificationSchema = new Schema(
  {
    // The user who will receive the notification.
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Student', // References the 'Student' model
      required: true,
      index: true, // Index for efficient querying of notifications by user
    },

    // A short, descriptive title for the notification.
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },

    // The main content of the notification.
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },

    // An optional link to navigate to when the notification is clicked.
    link: {
      type: String,
      trim: true,
      default: null,
    },

    // Flag to track if the user has read the notification.
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields.
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);