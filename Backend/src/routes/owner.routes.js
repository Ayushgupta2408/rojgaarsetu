import express from "express"
import { auth, isOwner, isProfileComplete } from "../middleware/auth.middleware.js"
import {
  getDashboard,
  applyForVehicleForm,
  addVehicle,
  removeVehicle,
  uploadVehicleImage,
} from "../controllers/owner.controller.js"
import { uploadImage } from "../middleware/upload.middleware.js"

const router = express.Router()

// All owner routes are protected
router.use(auth, isOwner)

// Get owner dashboard
router.get("/dashboard", getDashboard)

// Apply for a vehicle/instrument form (requires 90% profile completion)
router.post("/vehicle/:vehicleFormId/apply", isProfileComplete, applyForVehicleForm)

// Add vehicle to owner's profile
router.post("/vehicle", addVehicle)

// Remove vehicle from owner's profile
router.delete("/vehicle/:vehicleId", removeVehicle)

// Upload vehicle image
router.post("/vehicle/image", uploadImage.single("image"), uploadVehicleImage)

export default router
