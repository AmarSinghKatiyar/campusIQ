/**
 * Middleware to check if the user has an 'admin' role.
 * This should be used after the `authMiddleware`.
 */
const adminMiddleware = (req, res, next) => {
  // req.user is attached by the preceding authMiddleware
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. You must be an admin to perform this action.',
    });
  }
};

module.exports = adminMiddleware;