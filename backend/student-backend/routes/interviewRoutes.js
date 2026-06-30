const express = require("express");
const router = express.Router();

const {
  getAllInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
} = require("../controllers/interviewController");

router.get("/", getAllInterviews);

router.get("/:id", getInterviewById);

router.post("/", createInterview);

router.put("/:id", updateInterview);

router.delete("/:id", deleteInterview);

module.exports = router;