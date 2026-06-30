const Assessment = require("../models/Assessment");

// GET all assessments
exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find().sort({ deadline: 1 });

    console.log("Assessments found:", assessments);

    res.status(200).json({
      success: true,
      message: "Assessments fetched successfully",
      count: assessments.length,
      data: assessments,
    });
  } catch (error) {
    console.error("Error fetching assessments:", error);

    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};

// GET assessment by ID
exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE assessment
exports.createAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.create(req.body);

    res.status(201).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE assessment
exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE assessment
exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    await assessment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Assessment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
