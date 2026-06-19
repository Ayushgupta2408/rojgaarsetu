import mongoose from "mongoose"

const JobApplicationSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
  jobPostId: { type: mongoose.Schema.Types.ObjectId, ref: "JobPost", required: true },
  name: { type: String, required: true },
  experience: { type: Number },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  profileLink: { type: String, required: true },
  lookingFor: { type: String },
  resume: { type: String },
  availability: { type: String },
  status: {
    type: String,
    enum: ["considering", "rejected", "underreview", "offerSent", "offerAccepted", "joiningLetterSent","joined"],
    default: "underreview",
  },
  offerLetter: { type: String }, // PDF URL
  joiningLetter: { type: String }, // PDF URL
  appliedAt: { type: Date, default: Date.now },
})

const JobApplication = mongoose.model("JobApplication", JobApplicationSchema)

export default JobApplication

