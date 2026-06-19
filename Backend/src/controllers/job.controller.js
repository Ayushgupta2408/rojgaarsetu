import { JobPost } from "../models/index.js"

// Get all job posts with filtering and pagination
const getAllJobs = async (req, res) => {
  try {
    const { location, skill, minSalary, maxSalary, experience } = req.query

    // Build filter object
    const filter = {}

    if (location) {
      filter.location = { $regex: location, $options: "i" }
    }

    if (skill) {
      filter.requiredSkill = { $regex: skill, $options: "i" }
    }

    if (minSalary) {
      filter.payscale = { ...filter.payscale, $gte: Number(minSalary) }
    }

    if (maxSalary) {
      filter.payscale = { ...filter.payscale, $lte: Number(maxSalary) }
    }

    if (experience) {
      filter.experienceRequired = { $lte: Number(experience) }
    }

    // Get job posts with pagination
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const jobPosts = await JobPost.find(filter)
      .populate("contractorId", "name organizationName rating")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await JobPost.countDocuments(filter)

    res.json({
      jobPosts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get job posts error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get job post by ID
const getJobById = async (req, res) => {
  try {
    const jobPost = await JobPost.findById(req.params.id).populate("contractorId", "name organizationName rating")

    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" })
    }

    res.json({ jobPost })
  } catch (error) {
    console.error("Get job post error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export { getAllJobs, getJobById }

