const Interview = require("../models/Interview");

/**
 * ========================================
 *      Interview Controller
 * ========================================
 */

/**
 * Get all active interviews
 * Route: GET /api/interviews
 */
exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      isActive: true,
    }).sort({
      date: 1,
    });

    res.status(200).json({
      success: true,
      message: "Interviews fetched successfully",
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);

    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};

/**
 * Get interview by ID
 * Route: GET /api/interviews/:id
 */
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};

/**
 * Create interview
 * Route: POST /api/interviews
 */
exports.createInterview = async (req, res) => {
  try {
    const interview = await Interview.create(req.body);

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update interview
 * Route: PUT /api/interviews/:id
 */
exports.updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete interview
 * Route: DELETE /api/interviews/:id
 */
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    await interview.deleteOne();

    res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};