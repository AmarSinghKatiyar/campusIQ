import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  ctc: {
    type: Number,
    required: true,
  },
  jobRole: {
    type: String,
    required: true,
  },
  registeredStudents: {
    type: Number,
    default: 0,
  },
  selectedStudents: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled'],
    default: 'Active',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
  eligibilityCriteria: {
    minCGPA: {
      type: Number,
      default: 0,
    },
    branchesAllowed: [{
      type: String,
      enum: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'],
    }],
  },
}, {
  timestamps: true,
});

const Placement = mongoose.model('Placement', placementSchema);
export default Placement;
