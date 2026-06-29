const mongoose = require('mongoose');
<<<<<<< HEAD
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
=======

const opportunitySchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true,
        },
        companyLogo: String,
        mode: {
            type: String,
            enum: ['Remote', 'Hybrid', 'Onsite'],
        },
        status: {
            type: String,
            enum: ['Open', 'Closed'],
            default: 'Open',
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: ['Internship', 'Full Time'],
            required: true,
        },

        stipend: {
            type: String,
            default: '',
        },

        deadline: {
            type: Date,
            required: true,
        },

        eligibleBranches: [
            {
                type: String,
                enum: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
            },
        ],

        minimumCGPA: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },

        skillsRequired: [
            {
                type: String,
            },
        ],

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
>>>>>>> 2c05d62b9f8e0fd727b227128ca5915d840d4fe5
);

module.exports = mongoose.model('Opportunity', opportunitySchema);