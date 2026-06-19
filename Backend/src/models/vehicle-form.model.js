import mongoose from "mongoose"

const VehicleFormSchema = new mongoose.Schema({
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contractor",
    required: [true, "Contractor ID is required"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  type: {
    type: String,
    enum: {
      values: ["vehicle", "instrument"],
      message: "Type must be either vehicle or instrument",
    },
    required: [true, "Type is required"],
  },
  payscale: {
    type: Number,
    required: [true, "Pay scale is required"],
    min: [0, "Pay scale cannot be negative"],
  },
  brand: { type: String },
  quantity: { type: Number },
  purchaseDate: { type: Date },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  organization: { type: String },
  contractorProfileLink: { type: String },
  otherDetails: { type: String },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "VehicleApplication" }],
})

const VehicleForm = mongoose.model("VehicleForm", VehicleFormSchema)

export default VehicleForm
