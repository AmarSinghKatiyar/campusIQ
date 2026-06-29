import Student from '../models/Student.js';
import { computeCompositeScore, SCORE_WEIGHTS } from '../utils/scoring.js';

// GET /api/rankings?branch=&search=&sort=score
export const getRankings = async (req, res) => {
  try {
    const { branch, search, sort = 'score' } = req.query;
    const query = {};
    if (branch && branch !== 'All') query.branch = branch;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query);

    const ranked = students
      .map((s) => ({
        id: s.rollNumber,
        _id: s._id,
        name: s.name,
        branch: s.branch,
        cgpa: s.cgpa,
        aptitude: s.aptitude,
        communication: s.communication,
        projects: s.projects,
        leetcode: s.leetcode,
        score: computeCompositeScore(s),
      }))
      .sort((a, b) => (b[sort] ?? 0) - (a[sort] ?? 0));

    res.json({ weights: SCORE_WEIGHTS, students: ranked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};