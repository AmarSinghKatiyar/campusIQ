import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  branch: {
    type: String,
    enum: ['Computer Science', 'Computer Science (AI)', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical'],
    required: true,
  },
  batch: {
    type: Number,
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  leetcode: {
    type: Number,
    required: true,
    min: 0,
  },
  readiness: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['Placed', 'Eligible', 'Not Eligible'],
    required: true,
    default: 'Eligible',
  },
}, {
  timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
