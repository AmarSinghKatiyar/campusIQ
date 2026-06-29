import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
  getPlacements,
  getPlacementById,
  createPlacement,
  updatePlacement,
  deletePlacement,
  getApplications,
  addApplication,
  updateApplicationStage,
} from '../controllers/placementController.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/', getPlacements);
router.post('/', createPlacement);
router.get('/:id', getPlacementById);
router.put('/:id', updatePlacement);
router.delete('/:id', deletePlacement);

router.get('/:id/applications', getApplications);
router.post('/:id/applications', addApplication);
router.put('/:id/applications/:applicationId', updateApplicationStage);

export default router;