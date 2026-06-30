import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { getReportStats, getBranchPlacements, getPlacementTrend } from '../controllers/reportController.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/stats', getReportStats);
router.get('/branch-placements', getBranchPlacements);
router.get('/trend', getPlacementTrend);

export default router;