import express from "express"
import { auth } from "../middleware/auth.middleware.js"
import { completeProfile, getProfile, uploadProfileImage ,uploadResume} from "../controllers/profile.controller.js"
import { uploadImage } from "../middleware/upload.middleware.js"
import { uploadDocument } from "../middleware/upload.middleware.js"

const router = express.Router()

// Complete profile (protected route)
router.put("/complete", auth, completeProfile)

// Get profile (protected route)
router.get("/", auth, getProfile)

// Upload profile image (protected route)
router.post("/image", auth, uploadImage.single("image"), uploadProfileImage)

// update biodate/resume 
router.post('/upload-resume',auth,uploadDocument.single('resume'),uploadResume)

export default router
