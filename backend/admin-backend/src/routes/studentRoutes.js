import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getBranches,
} from '../controllers/studentController.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/', getStudents);
router.get('/meta/branches', getBranches);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;