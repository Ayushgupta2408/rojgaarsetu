import express from "express"
import { auth, isProfileComplete } from "../middleware/auth.middleware.js"
import { validateFields } from "../middleware/validation.middleware.js"
import { uploadImage } from "../middleware/upload.middleware.js"
import {
  getAllVehicleForms,
  getVehicleFormById,
  applyForVehicleForm,
  getUserVehicleApplications,
} from "../controllers/vehicle.controller.js"
import {viewSingleVehicleApplication} from '../controllers/contractor.controller.js'

const router = express.Router()

// Public routes
router.get("/", getAllVehicleForms)
router.get("/:id", getVehicleFormById)

// Protected routes
router.use(auth)

// Apply for a vehicle form (requires profile completion)
router.post(
  "/:vehicleFormId/apply",
  isProfileComplete,
  uploadImage.fields([{ name: "vehicles", maxCount: 5 }]),
  applyForVehicleForm
);

// Get user's vehicle applications
router.get("/applications/me", getUserVehicleApplications)

// Get specific vehicle application
router.get("/application/:applicationId", viewSingleVehicleApplication)

export default router
