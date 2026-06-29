const express = require('express');
const { getAllOpportunities } = require('../controllers/opportunityController');

const router = express.Router();

/**
 * Opportunity Routes
 */

/**
 * GET /api/opportunities
 * Get all active opportunities
 */
router.get('/', getAllOpportunities);

module.exports = router;