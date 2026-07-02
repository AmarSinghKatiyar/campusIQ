const express = require("express");
const router = express.Router();

const {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} = require("../controllers/assessmentController");

router.get("/", getAllAssessments);

router.get("/:id", getAssessmentById);

router.post("/", createAssessment);

router.put("/:id", updateAssessment);

router.delete("/:id", deleteAssessment);

module.exports = router;