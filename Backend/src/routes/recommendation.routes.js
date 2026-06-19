import express from "express"
import { auth } from "../middleware/auth.middleware.js"
import { getRecommendations } from "../controllers/recommendation.controller.js"

const router = express.Router()

// All recommendation routes are protected
router.use(auth)

// Get recommendations based on user type
router.get("/", getRecommendations)

export default router

