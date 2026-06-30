// Student Model
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Student Schema
 * Contains all student information including authentication and profile details
 */
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT'],
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
      min: [2024, 'Graduation year must be valid'],
      max: [2030, 'Graduation year must be realistic'],
    },
    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: [0, 'CGPA cannot be less than 0'],
      max: [10, 'CGPA cannot exceed 10'],
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: 'Cannot have more than 20 skills',
      },
    },
    resumeUrl: {
      type: String,
      default: null,
    },
    githubUrl: {
      type: String,
      default: null,
      match: [
        /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
        'Please provide a valid GitHub URL',
      ],
    },
    linkedinUrl: {
      type: String,
      default: null,
      match: [
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
        'Please provide a valid LinkedIn URL',
      ],
    },
    phoneNumber: {
      type: String,
      default: null,
      sparse: true,
      match: [/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'],
    },
    securityPreferences: {
      twoStepVerification: {
        type: Boolean,
        default: false,
      },
      loginAlerts: {
        type: Boolean,
        default: true,
      },
      profileVisibility: {
        type: String,
        enum: ['placement-team', 'recruiters', 'private'],
        default: 'placement-team',
      },
    },
    placementStatus: {
      type: String,
      enum: [
        'Unplaced',
        'Applied',
        'Shortlisted',
        'Interview Scheduled',
        'Placed',
        'Rejected',
      ],
      default: 'Unplaced',
    },
    notifications: [
      {
        title: {
          type: String,
          required: [true, 'Notification title is required'],
          trim: true,
        },
        message: {
          type: String,
          required: [true, 'Notification message is required'],
          trim: true,
        },
        link: {
          type: String,
          default: null,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

/**
 * Hash password before saving
 * Only hash if password is modified
 */
studentSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare password method
 * Used for authentication
 */
studentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Remove password from response
 */
studentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Student', studentSchema);
