import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  branch: {
    type: String,
    enum: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'],
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  batch: {
    type: Number,
    required: true,
  },
  isEligible: {
    type: Boolean,
    default: true,
  },
  placementStatus: {
    type: String,
    enum: ['Placed', 'Unplaced', 'In-Progress'],
    default: 'Unplaced',
  },
  companyPlaced: {
    type: String,
    default: null,
  },
  salary: {
    type: Number,
    default: null,
  },
  profileCompletion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
