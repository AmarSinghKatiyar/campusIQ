const Learning = require("../models/Learning");

exports.getAllLearning = async (req, res) => {
  try {
    const resources = await Learning.find()
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getLearningById = async (req, res) => {
  try {
    const resource = await Learning.findById(req.params.id).populate(
      "postedBy",
      "name"
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found",
      });
    }

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createLearning = async (req, res) => {
  try {
    const resource = await Learning.create({
      ...req.body,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: resource,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateLearning = async (req, res) => {
  try {
    let resource = await Learning.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found",
      });
    }

    resource = await Learning.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteLearning = async (req, res) => {
  try {
    const resource = await Learning.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found",
      });
    }

    await resource.deleteOne();

    res.status(200).json({
      success: true,
      message: "Learning resource deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};