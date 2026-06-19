import express from "express"
import { auth, isContractor } from "../middleware/auth.middleware.js"
import { generatePDF } from "../controllers/pdf.controller.js"

const router = express.Router()

// PDF generation route (only for contractors)
router.post("/generate", auth, isContractor, generatePDF)

export default router

