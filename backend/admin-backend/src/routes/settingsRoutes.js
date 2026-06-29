import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
  getProfile,
  updateProfile,
  updateNotifications,
  updateInstitution,
  updatePassword,
  updateTwoFactor,
  deleteAccount,
} from '../controllers/settingsController.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/notifications', updateNotifications);
router.put('/institution', updateInstitution);
router.put('/password', updatePassword);
router.put('/two-factor', updateTwoFactor);
router.delete('/account', deleteAccount);

export default router;