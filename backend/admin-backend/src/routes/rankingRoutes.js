import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { getRankings } from '../controllers/rankingController.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/', getRankings);

export default router;