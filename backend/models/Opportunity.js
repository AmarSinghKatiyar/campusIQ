const mongoose = require('mongoose');

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
);

module.exports = mongoose.model('Opportunity', opportunitySchema);