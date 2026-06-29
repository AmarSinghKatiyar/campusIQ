const express = require('express');
<<<<<<< HEAD
const {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  applyToOpportunity,
} = require('../controllers/opportunityController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
=======
const { getAllOpportunities } = require('../controllers/opportunityController');
>>>>>>> 2c05d62b9f8e0fd727b227128ca5915d840d4fe5

const router = express.Router();

/**
<<<<<<< HEAD
 * ========================================
 *          Opportunity Routes
 * ========================================
 * Base Path: /api/opportunities
 */

// @desc    Get all opportunities & Create a new opportunity
// @access  Student (GET), Admin (POST)
router
  .route('/')
  .get(authMiddleware, getAllOpportunities)
  .post(authMiddleware, adminMiddleware, createOpportunity);

// @desc    Get, Update, and Delete a single opportunity
// @access  Student (GET), Admin (PUT, DELETE)
router
  .route('/:id')
  .get(authMiddleware, getOpportunityById)
  .put(authMiddleware, adminMiddleware, updateOpportunity)
  .delete(authMiddleware, adminMiddleware, deleteOpportunity);

// @desc    Apply to an opportunity
router.post('/:id/apply', authMiddleware, applyToOpportunity);
=======
 * Opportunity Routes
 */

/**
 * GET /api/opportunities
 * Get all active opportunities
 */
router.get('/', getAllOpportunities);
>>>>>>> 2c05d62b9f8e0fd727b227128ca5915d840d4fe5

module.exports = router;