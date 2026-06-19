import mongoose from "mongoose"

const JobPostSchema = new mongoose.Schema({
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contractor",
    required: [true, "Contractor ID is required"],
  },
  title: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
  },
  payscale: {
    type: Number,
    required: [true, "Pay scale is required"],
    min: [0, "Pay scale cannot be negative"],
  },
  requiredSkill: {
    type: String,
    required: [true, "Required skill is required"],
    trim: true,
  },
  experienceRequired: {
    type: Number,
    required: [true, "Experience required is required"],
    min: [0, "Experience cannot be negative"],
  },
  noOfWorkers: {
    type: Number,
    required: [true, "Number of workers is required"],
    min: [1, "At least one worker is required"],
  },
  duration: { type: String },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobApplication" }],
})

const JobPost = mongoose.model("JobPost", JobPostSchema)

export default JobPost
