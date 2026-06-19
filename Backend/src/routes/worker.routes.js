import express from "express"
import { auth, isWorker, isProfileComplete } from "../middleware/auth.middleware.js"
import {
  getPortfolio,
  applyForJob,
  getDashboard,
  respondToOffer,
  acceptJoiningLetter,
  uploadResume,
} from "../controllers/worker.controller.js"
import { uploadDocument } from "../middleware/upload.middleware.js"

const router = express.Router()

// Get worker portfolio (public route)
router.get("/portfolio/:id?", getPortfolio)

// Protected worker routes
router.use(auth, isWorker)

// Get worker dashboard
router.get("/dashboard", getDashboard)

// Apply for a job (requires 90% profile completion)
router.post("/job/:jobPostId/apply", isProfileComplete, applyForJob)

// Respond to offer letter (accept/reject)
router.put("/application/:applicationId/respond", respondToOffer)

// Accept joining letter
router.put("/application/:applicationId/accept-joining", acceptJoiningLetter)

// Upload resume
router.post("/resume", uploadDocument.single("resume"), uploadResume)

export default router
