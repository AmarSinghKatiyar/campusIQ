import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  placement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Placement',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  stage: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview', 'Offered', 'Placed', 'Rejected'],
    default: 'Applied',
  },
}, {
  timestamps: true,
});

applicationSchema.index({ placement: 1, student: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
