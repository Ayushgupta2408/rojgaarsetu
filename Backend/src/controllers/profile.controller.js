import { Worker, Contractor, Owner } from "../models/index.js"
import fs from "fs"
import { cloudinary } from "../utils/cloudinary.util.js"

// Calculate profile completion percentage
const calculateProfileCompletion = (profile, userType) => {
  let totalFields = 0
  let completedFields = 0

  if (userType === "Worker") {
    // Define required fields for Worker
    const fields = [
      "name",
      "email",
      "phone",
      "otpVerified",
      "currentStatus",
      "lookingFor",
      "image",
      "pastExperience",
      "expectedSalary",
      "resume",
    ]

    totalFields = fields.length

    // Count completed fields
    fields.forEach((field) => {
      if (profile[field] !== undefined && profile[field] !== null && profile[field] !== "") {
        completedFields++
      }
    })
  } else if (userType === "Contractor") {
    // Define required fields for Contractor
    const fields = [
      "name",
      "email",
      "phone",
      "image",
      "location",
      "role",
      "workProfile",
      "completedProjects",
      "organizationName",
      "otpVerified",
    ]

    totalFields = fields.length

    // Count completed fields
    fields.forEach((field) => {
      if (field === "completedProjects") {
        if (profile[field] && profile[field].length > 0) {
          completedFields++
        }
      } else if (profile[field] !== undefined && profile[field] !== null && profile[field] !== "") {
        completedFields++
      }
    })
  } else if (userType === "Owner") {
    // Define required fields for Owner
    const fields = ["name", "phone", "email", "organization", "location", "role", "availableVehicles", "otpVerified"]

    totalFields = fields.length

    // Count completed fields
    fields.forEach((field) => {
      if (field === "availableVehicles") {
        if (profile[field] && profile[field].length > 0) {
          completedFields++
        }
      } else if (profile[field] !== undefined && profile[field] !== null && profile[field] !== "") {
        completedFields++
      }
    })
  }

  // Calculate percentage
  return Math.round((completedFields / totalFields) * 100)
}

// Complete profile
const completeProfile = async (req, res) => {
  try {
    const { userId, userType } = req
    const profileData = req.body

    // Validate required fields based on user type
    let requiredFields = []

    if (userType === "Worker") {
      requiredFields = ["lookingFor", "expectedSalary"]
    } else if (userType === "Contractor") {
      requiredFields = ["location", "role", "organizationName"]
    } else if (userType === "Owner") {
      requiredFields = ["organization", "location", "role"]
    }

    const missingFields = requiredFields.filter((field) => !profileData[field])

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      })
    }

    let profile

    // Get and update profile based on user type
    if (userType === "Worker") {
      profile = await Worker.findByIdAndUpdate(req.profileId, { ...profileData }, { new: true, runValidators: true })
    } else if (userType === "Contractor") {
      profile = await Contractor.findByIdAndUpdate(
        req.profileId,
        { ...profileData },
        { new: true, runValidators: true },
      )
    } else if (userType === "Owner") {
      profile = await Owner.findByIdAndUpdate(req.profileId, { ...profileData }, { new: true, runValidators: true })
    } else {
      return res.status(400).json({ message: "Invalid user type" })
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    // Calculate profile completion percentage
    const completionPercentage = calculateProfileCompletion(profile, userType)

    // Update profile completion percentage
    profile.profileCompletion = completionPercentage
    await profile.save()

    // Generate portfolio link for Worker
    if (userType === "Worker") {
      // Simple portfolio link generation
      profile.portfolio = `${process.env.FRONTEND_URL}/worker/${profile._id}`
      await profile.save()
    }

    res.json({
      message: "Profile updated successfully",
      profile,
      completionPercentage,
    })
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: "Validation error", errors: validationErrors })
    }

    console.error("Profile completion error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get profile
const getProfile = async (req, res) => {
  try {
    const { userType, profileId } = req

    let profile

    // Get profile based on user type
    if (userType === "Worker") {
      profile = await Worker.findById(profileId)
    } else if (userType === "Contractor") {
      profile = await Contractor.findById(profileId)
    } else if (userType === "Owner") {
      profile = await Owner.findById(profileId)
    } else {
      return res.status(400).json({ message: "Invalid user type" })
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    res.json({ profile })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" })
    }

    const { userType, profileId } = req

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `gig-worker-app/profiles/${userType.toLowerCase()}s`,
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    })

    // Remove temp file
    fs.unlinkSync(req.file.path)

    // Update profile with image URL
    let profile
    if (userType === "Worker") {
      profile = await Worker.findByIdAndUpdate(profileId, { image: result.secure_url }, { new: true })
    } else if (userType === "Contractor") {
      profile = await Contractor.findByIdAndUpdate(profileId, { image: result.secure_url }, { new: true })
    } else if (userType === "Owner") {
      profile = await Owner.findByIdAndUpdate(profileId, { image: result.secure_url }, { new: true })
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    res.json({
      message: "Profile image uploaded successfully",
      imageUrl: result.secure_url,
      profile,
    })
  } catch (error) {
    console.error("Profile image upload error:", error)

    // Clean up temp file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Upload resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file provided" })
    }

    const { userType, profileId } = req

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `gig-worker-app/profiles/${userType.toLowerCase()}s/resumes`,
      resource_type: "raw",
    })

    // Remove temp file
    fs.unlinkSync(req.file.path)

    // Update profile with resume URL
    let profile
    if (userType === "Worker") {
      profile = await Worker.findByIdAndUpdate(profileId, { resume: result.secure_url }, { new: true })
    } else if (userType === "Contractor") {
      profile = await Contractor.findByIdAndUpdate(profileId, { resume: result.secure_url }, { new: true })
    } else if (userType === "Owner") {
      profile = await Owner.findByIdAndUpdate(profileId, { resume: result.secure_url }, { new: true })
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    res.json({
      message: "Resume uploaded successfully",
      resumeUrl: result.secure_url,
      profile,
    })
  } catch (error) {
    console.error("Resume upload error:", error)

    // Clean up temp file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    res.status(500).json({ message: "Server error", error: error.message })
  }
}
export { completeProfile, getProfile, calculateProfileCompletion, uploadProfileImage ,uploadResume}
