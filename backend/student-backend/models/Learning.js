const mongoose = require("mongoose");

const learningSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "DSA",
        "Web Development",
        "Machine Learning",
        "Aptitude",
        "Programming",
        "Core Subjects",
        "Interview",
        "Other",
      ],
      default: "Other",
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    duration: {
      type: String,
      default: "",
    },

    platform: {
      type: String,
      default: "",
    },

    instructor: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    resourceLink: {
      type: String,
      required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Learning", learningSchema);