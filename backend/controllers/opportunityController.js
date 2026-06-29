const Opportunity = require('../models/Opportunity');
<<<<<<< HEAD
const Student = require('../models/Student');

/**
 * ========================================
 *      Opportunity Controller
 * ========================================
 */

/**
 * Get all opportunities (for students)
 * @route   GET /api/opportunities
 * @access  Protected
 */
exports.getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ applyBy: { $gte: new Date() } })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
=======

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
>>>>>>> 2c05d62b9f8e0fd727b227128ca5915d840d4fe5
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
<<<<<<< HEAD
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};

/**
 * Get a single opportunity by ID
 * @route   GET /api/opportunities/:id
 * @access  Protected
 */
exports.getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('postedBy', 'name');
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }
    res.status(200).json({ success: true, data: opportunity });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};

/**
 * Create a new opportunity
 * @route   POST /api/opportunities
 * @access  Admin
 */
exports.createOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.create({
      ...req.body,
      postedBy: req.user._id,
    });
    res.status(201).json({ success: true, data: opportunity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Update an opportunity
 * @route   PUT /api/opportunities/:id
 * @access  Admin
 */
exports.updateOpportunity = async (req, res) => {
  try {
    let opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: opportunity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Delete an opportunity
 * @route   DELETE /api/opportunities/:id
 * @access  Admin
 */
exports.deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    await opportunity.deleteOne();

    res.status(200).json({ success: true, message: 'Opportunity removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};

/**
 * Apply to an opportunity
 * @route   POST /api/opportunities/:id/apply
 * @access  Protected (Student)
 */
exports.applyToOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    // Check if student has already applied
    if (opportunity.applicants.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You have already applied for this opportunity' });
    }

    // Add student to applicants list
    opportunity.applicants.push(req.user._id);
    await opportunity.save();

    // Add opportunity to student's applications list
    const student = await Student.findById(req.user._id);
    student.applications.push(opportunity._id);
    await student.save();

    res.status(200).json({ success: true, message: 'Successfully applied to opportunity' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
=======
    console.error('Error fetching opportunities:', error);

    res.status(500).json({
      success: false,
      message: 'Error fetching opportunities',
    });
>>>>>>> 2c05d62b9f8e0fd727b227128ca5915d840d4fe5
  }
};