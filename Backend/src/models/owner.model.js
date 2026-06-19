import mongoose from "mongoose"

const OwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  organization: { type: String },
  location: { type: String },
  role: { type: String },
  image: { type: String },  
  availableVehicles: [
    {
      vehicleName: String,
      model: String,
      capacity: String,
      image: String, // URL from Cloudinary
    },
  ],
  otpVerified: { type: Boolean, default: false },
  profileCompletion: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
})

const Owner = mongoose.model("Owner", OwnerSchema)

export default Owner

