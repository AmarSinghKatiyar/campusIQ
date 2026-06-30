import Student from '../models/Student.js';
import Activity from '../models/Activity.js';
import { withScore } from '../utils/scoring.js';

const normalizeStudentPayload = (payload = {}) => ({
  ...payload,
  rollNumber: payload.rollNumber?.toString().trim(),
  name: payload.name?.toString().trim(),
  email: payload.email?.toString().trim().toLowerCase(),
  phone: payload.phone?.toString().trim(),
  branch: payload.branch?.toString().trim(),
  batch: payload.batch !== undefined ? Number(payload.batch) : undefined,
  cgpa: payload.cgpa !== undefined ? Number(payload.cgpa) : undefined,
  leetcode: payload.leetcode !== undefined ? Number(payload.leetcode) : undefined,
  readiness: payload.readiness !== undefined ? Number(payload.readiness) : undefined,
  status: payload.status?.toString().trim(),
});

// GET /api/students  (supports ?branch=&status=&sort=&search=)
export const getStudents = async (req, res) => {
  try {
    const { branch, status, sort = '-createdAt', search } = req.query;
    const query = {};

    if (branch && branch !== 'All') query.branch = branch;
    if (status && status !== 'All') {
      const statusValue = status.toString().trim();
      const mappedStatus =
        statusValue === 'In-Progress' ? 'Eligible' :
        statusValue === 'Unplaced' ? 'Not Eligible' :
        statusValue;

      query.$or = [
        { status: mappedStatus },
        { placementStatus: statusValue === 'In-Progress' ? 'In-Progress' : statusValue === 'Unplaced' ? 'Unplaced' : mappedStatus },
      ];
    }
    if (search) {
      const searchQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } },
        ],
      };

      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          searchQuery,
        ];
        delete query.$or;
      } else {
        query.$or = searchQuery.$or;
      }
    }

    const students = await Student.find(query).sort(sort);
    res.json(students.map(withScore));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/students/:id
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/students
export const createStudent = async (req, res) => {
  try {
    const payload = normalizeStudentPayload(req.body);

    if (!payload.rollNumber || !payload.name || !payload.email || !payload.phone || !payload.branch || payload.batch === undefined || payload.cgpa === undefined || payload.leetcode === undefined || payload.readiness === undefined || !payload.status) {
      return res.status(400).json({ message: 'All required student fields must be provided.' });
    }

    const student = new Student(payload);
    const saved = await student.save();

    await Activity.create({
      type: 'profile',
      text: `${saved.name} (${saved.rollNumber}) was added to the student database`,
      relatedStudentId: saved._id,
    });

    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A student with the same roll number or email already exists.' });
    }
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/students/:id
export const updateStudent = async (req, res) => {
  try {
    const previous = await Student.findById(req.params.id);
    if (!previous) return res.status(404).json({ message: 'Student not found' });

    const payload = normalizeStudentPayload(req.body);
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (payload.status === 'Placed' && previous.status !== 'Placed') {
      await Activity.create({
        type: 'placement',
        text: `${student.name} was marked as placed`,
        relatedStudentId: student._id,
      });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/students/meta/branches - distinct branch list for filter dropdowns
export const getBranches = async (req, res) => {
  try {
    const branches = await Student.distinct('branch');
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};