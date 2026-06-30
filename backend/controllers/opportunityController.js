const Opportunity = require("../models/Opportunity");
const Student = require("../models/Student");

/**
 * ========================================
 *      Opportunity Controller
 * ========================================
 */

/**
 * Get all opportunities (for students)
 * @route GET /api/opportunities
 * @access Protected
 */
exports.getAllOpportunities = async (req, res) => {
  try {
    console.log("========== GET ALL OPPORTUNITIES ==========");
    console.log("Connected Database:", Opportunity.db.name);

    const opportunities = await Opportunity.find({})
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    console.log("Total Opportunities:", opportunities.length);
    console.log(opportunities);

    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    console.error("Get Opportunities Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};

/**
 * Get single opportunity
 */
exports.getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      "postedBy",
      "name"
    );

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};

/**
 * Create opportunity
 */
exports.createOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.create({
      ...req.body,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update opportunity
 */
exports.updateOpportunity = async (req, res) => {
  try {
    let opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete opportunity
 */
exports.deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    await opportunity.deleteOne();

    res.status(200).json({
      success: true,
      message: "Opportunity removed",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};

/**
 * Apply to opportunity
 */
exports.applyToOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    if (opportunity.applicants.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this opportunity",
      });
    }

    opportunity.applicants.push(req.user._id);
    await opportunity.save();

    const student = await Student.findById(req.user._id);

    if (student) {
      student.applications.push(opportunity._id);
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: "Successfully applied to opportunity",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};