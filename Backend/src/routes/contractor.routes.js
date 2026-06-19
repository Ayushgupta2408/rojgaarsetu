import express from "express"
import { auth, isContractor, isProfileComplete } from "../middleware/auth.middleware.js"
import { validateFields, validateNumeric } from "../middleware/validation.middleware.js"
import {
  createJobPost,
  updateJobPost,
  deleteJobPost,
  viewJob,
  viewAllJobs,
  createVehicleForm,
  updateVehicleForm,
  deleteVehicleForm,
  viewVehicle,
  viewAllVehicles,
  getDashboard,
  viewSingleJobApplication,
  viewSingleVehicleApplication,
  viewAllApplications,
  viewJobApplications,
  viewVehicleApplications,
  processJobApplication,
  sendJoiningLetter,
  processVehicleApplication,
  sendInvitation,
  uploadProjectImage,
} from "../controllers/contractor.controller.js"
import { uploadImage } from "../middleware/upload.middleware.js"

const router = express.Router()

// All contractor routes are protected
router.use(auth, isContractor)

// Dashboard
router.get("/dashboard", getDashboard)

// Job posting routes
router.get("/jobs", viewAllJobs)
router.get("/job/:id", viewJob)
router.post(
  "/job",
  isProfileComplete,
  validateFields(["title", "payscale", "requiredSkill", "experienceRequired", "noOfWorkers", "location"]),
  validateNumeric({
    payscale: { min: 0 },
    experienceRequired: { min: 0 },
    noOfWorkers: { min: 1 },
  }),
  createJobPost,
)
router.put("/job/:id", isProfileComplete, updateJobPost)
router.delete("/job/:id", deleteJobPost)

// Vehicle/instrument form routes
router.get("/vehicles", viewAllVehicles)
router.get("/vehicle/:id", viewVehicle)
router.post(
  "/vehicle",
  isProfileComplete,
  validateFields(["title", "type", "payscale", "location"]),
  validateNumeric({
    payscale: { min: 0 },
    quantity: { min: 1 },
  }),
  createVehicleForm,
)
router.put("/vehicle/:id", isProfileComplete, updateVehicleForm)
router.delete("/vehicle/:id", deleteVehicleForm)

// Application routes
router.get("/job/application/:applicationId", viewSingleJobApplication)
router.get("/vehicle/application/:applicationId", viewSingleVehicleApplication)
router.get("/applications", viewAllApplications)
router.get("/job/:jobId/applications", viewJobApplications)
router.get("/vehicle/:vehicleId/applications", viewVehicleApplications)

// Job application processing
router.put("/application/:applicationId/process", validateFields(["action"]), processJobApplication)
router.post("/application/:applicationId/joining-letter", sendJoiningLetter)

// Vehicle application processing
router.put("/vehicle-application/:applicationId/process", validateFields(["action"]), processVehicleApplication)

// Send invitation
router.post("/invite", validateFields(["userType", "userId", "message"]), sendInvitation)

// Upload project image
router.post("/project/image", uploadImage.single("image"), uploadProjectImage)

export default router
