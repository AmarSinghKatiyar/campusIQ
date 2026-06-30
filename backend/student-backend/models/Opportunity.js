const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opportunitySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ['Internship', 'Full-time', 'Part-time', 'Full Time'],
      required: true,
    },

    mode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'Onsite'],
      default: 'Remote',
    },

    location: {
      type: String,
      default: 'Remote',
    },

    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },

    stipend: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR',
      },
      period: {
        type: String,
        enum: ['per-month', 'lump-sum'],
        default: 'per-month',
      },
    },

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    skillsRequired: [
      {
        type: String,
      },
    ],

    eligibility: {
      cgpa: {
        type: Number,
        min: 0,
        max: 10,
      },
      branches: [String],
      graduationYears: [Number],
    },

    minimumCGPA: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    eligibleBranches: [
      {
        type: String,
        enum: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
      },
    ],

    applyBy: {
      type: Date,
    },

    deadline: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
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