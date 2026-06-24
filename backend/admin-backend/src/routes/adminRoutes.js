import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdmins,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/', protect, adminOnly, getAdmins);

export default router;
