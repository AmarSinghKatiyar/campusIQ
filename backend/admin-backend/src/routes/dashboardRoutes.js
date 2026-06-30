import express from 'express';
import {
  getDashboardStats,
  getTopStudents,
  getRecentActivities,
  getPerformanceData,
  getBranchDistribution,
  getAllStudents,
  getAllPlacementDrives,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);
router.use(adminOnly);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Students data
router.get('/top-students', getTopStudents);
router.get('/students', getAllStudents);
router.get('/branch-distribution', getBranchDistribution);

// Activities & Performance
router.get('/recent-activities', getRecentActivities);
router.get('/performance', getPerformanceData);

// Placement drives
router.get('/placement-drives', getAllPlacementDrives);

export default router;
