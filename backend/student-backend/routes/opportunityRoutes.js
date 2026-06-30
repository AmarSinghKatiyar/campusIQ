const express = require('express');
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

const router = express.Router();

/**
 * ========================================
 *          Opportunity Routes
 * ========================================
 * Base Path: /api/opportunities
 */

// @desc    Get all opportunities & Create a new opportunity
// @access  Student (GET), Admin (POST)
router
  .route('/')
  .get(getAllOpportunities)
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

module.exports = router;
