const Opportunity = require('../models/Opportunity');

/**
 * Get all active opportunities
 * Route: GET /api/opportunities
 */
exports.getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      isActive: true,
    }).sort({
      deadline: 1,
    });

    res.status(200).json({
      success: true,
      message: 'Opportunities fetched successfully',
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);

    res.status(500).json({
      success: false,
      message: 'Error fetching opportunities',
    });
  }
};