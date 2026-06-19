import express from "express"
import { getAllJobs, getJobById } from "../controllers/job.controller.js"

const router = express.Router()

// Get all job posts (public route)
router.get("/", getAllJobs)

// Get job post by ID (public route)
router.get("/:id", getJobById)

export default router

