import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['profile', 'drive', 'placement', 'ranking', 'report', 'other'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  relatedStudentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null,
  },
  relatedPlacementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Placement',
    default: null,
  },
}, {
  timestamps: true,
});

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
