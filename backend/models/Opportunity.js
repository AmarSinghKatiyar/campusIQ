const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * ========================================
 *        Opportunity Schema
 * ========================================
 * Defines the structure for job and internship opportunities posted on the platform.
 */
const opportunitySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A detailed description is required'],
    },
    type: {
      type: String,
      enum: ['Internship', 'Full-time', 'Part-time'],
      required: [true, 'Opportunity type is required'],
    },
    location: {
      type: String,
      default: 'Remote',
    },
    stipend: {
      amount: Number,
      currency: { type: String, default: 'INR' },
      period: { type: String, enum: ['per-month', 'lump-sum'], default: 'per-month' },
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    eligibility: {
      cgpa: { type: Number, min: 0, max: 10 },
      branches: [String],
      graduationYears: [Number],
    },
    applyBy: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Student', // Assuming Admins are also in the 'Student' collection with a different role
      required: true,
    },
    applicants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);