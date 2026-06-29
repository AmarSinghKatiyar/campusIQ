import Student from '../models/Student.js';
import Activity from '../models/Activity.js';
import { withScore } from '../utils/scoring.js';

// GET /api/students  (supports ?branch=&status=&sort=&search=)
export const getStudents = async (req, res) => {
  try {
    const { branch, status, sort = '-cgpa', search } = req.query;
    const query = {};

    if (branch && branch !== 'All') query.branch = branch;
    if (status && status !== 'All') query.placementStatus = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
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
    const student = new Student(req.body);
    const saved = await student.save();

    await Activity.create({
      type: 'profile',
      text: `${saved.name} (${saved.rollNumber}) was added to the student database`,
      relatedStudentId: saved._id,
    });

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/students/:id
export const updateStudent = async (req, res) => {
  try {
    const previous = await Student.findById(req.params.id);
    if (!previous) return res.status(404).json({ message: 'Student not found' });

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (req.body.placementStatus === 'Placed' && previous.placementStatus !== 'Placed') {
      await Activity.create({
        type: 'placement',
        text: `${student.name} was marked as placed${student.companyPlaced ? ` at ${student.companyPlaced}` : ''}`,
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