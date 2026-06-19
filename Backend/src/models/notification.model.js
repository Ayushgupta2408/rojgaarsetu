import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userType: { type: String, enum: ["Worker", "Contractor", "Owner"], required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["job", "application", "offer", "joining", "vehicle", "profile", "system"],
    default: "system",
  },
  referenceId: { type: mongoose.Schema.Types.ObjectId }, // ID of the related entity (job, application, etc.)
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const Notification = mongoose.model("Notification", NotificationSchema)

export default Notification

