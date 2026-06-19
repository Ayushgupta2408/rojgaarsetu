import mongoose from "mongoose"

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  otpVerified: { type: Boolean, default: false },
  currentStatus: { type: String, enum: ["unemployed", "working"], default: "unemployed" },
  lookingFor: { type: String },
  image: { type: String }, // URL from Cloudinary
  pastExperience: { type: Number }, // in years
  expectedSalary: { type: Number },
  resume: { type: String }, // URL or file path
  profileCompletion: { type: Number, default: 0 },
  portfolio: { type: String }, // generated portfolio link or reference
  rating: { type: Number, default: 0 },
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobApplication" }],
})

const Worker = mongoose.model("Worker", WorkerSchema)

export default Worker

