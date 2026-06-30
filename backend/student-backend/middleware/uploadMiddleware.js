// Upload Middleware
const multer = require('multer');
const path = require('path');

/**
 * Configure storage for uploaded files
 * Files are stored in memory for direct Cloudinary upload
 */
const storage = multer.memoryStorage();

/**
 * File filter to accept only PDF files
 */
const fileFilter = (req, file, cb) => {
  // Check file mimetype
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed'), false);
  }

  cb(null, true);
};

/**
 * Multer configuration
 * Max file size: 5MB
 * Accepted files: PDF only
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

/**
 * Error handling middleware for multer
 * This handles errors from multer.single() and fileFilter
 */
const handleUploadErrors = (err, req, res, next) => {
  // If no error, pass to next middleware
  if (!err) {
    return next();
  }

  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 5MB limit',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Only one file can be uploaded',
      });
    }
  }

  // Handle custom errors (from fileFilter)
  if (err && err.message) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Generic file upload error
  return res.status(500).json({
    success: false,
    message: 'Error uploading file. Please try again.',
  });
};

module.exports = {
  uploadMiddleware: upload.single('resume'),
  handleUploadErrors,
};
