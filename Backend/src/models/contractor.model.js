import mongoose from "mongoose"

const ContractorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  image: { type: String },
  location: { type: String },
  role: { type: String },
  workProfile: { type: String },
  completedProjects: [
    {
      projectName: String,
      location: String,
      duration: String,
      workingDays: Number,
      additionalDetails: String,
    },
  ],
  organizationName: { type: String },
  otpVerified: { type: Boolean, default: false },
  profileCompletion: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  jobPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
  vehicleForms: [{ type: mongoose.Schema.Types.ObjectId, ref: "VehicleForm" }],
})

const Contractor = mongoose.model("Contractor", ContractorSchema)

export default Contractor

