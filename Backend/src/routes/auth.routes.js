import express from "express"
import { auth } from "../middleware/auth.middleware.js"
import { register, login, logout, verifyUserOTP, resendOTP, getCurrentUser } from "../controllers/auth.controller.js"

const router = express.Router()

// Register a new user
router.post("/register", register)

// Login user
router.post("/login", login)

// Logout user
router.post("/logout", logout)

// Verify OTP
router.post("/verify-otp", verifyUserOTP)

// Resend OTP
router.post("/resend-otp", resendOTP)

// Get current user (protected route)
router.get("/me", auth, getCurrentUser)

export default router

