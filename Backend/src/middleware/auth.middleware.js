import jwt from "jsonwebtoken"
import { User, Worker, Contractor, Owner } from "../models/index.js"

// Middleware to authenticate user using JWT
const auth = async (req, res, next) => {
  try {
    // Get token from cookie or header
    let token = req.cookies.token

    // If token is not in cookie, check header
    if (!token) {
      token = req.header("Authorization")?.replace("Bearer ", "")
    }

    if (!token) {
      return res.status(401).json({ message: "No authentication token, access denied" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find user by id
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: "Token is invalid" })
    }

    // Add user to request object
    req.user = user
    req.userId = user._id
    req.userType = user.userType
    req.profileId = user.profileId

    next()
  } catch (error) {
    res.status(401).json({ message: "Token is invalid" })
  }
}

// Middleware to check if user is a Worker
const isWorker = (req, res, next) => {
  if (req.userType !== "Worker") {
    return res.status(403).json({ message: "Access denied. Worker role required." })
  }
  next()
}

// Middleware to check if user is a Contractor
const isContractor = (req, res, next) => {
  if (req.userType !== "Contractor") {
    return res.status(403).json({ message: "Access denied. Contractor role required." })
  }
  next()
}

// Middleware to check if user is an Owner
const isOwner = (req, res, next) => {
  if (req.userType !== "Owner") {
    return res.status(403).json({ message: "Access denied. Owner role required." })
  }
  next()
}

// Middleware to check if profile is complete (90% or more)
const isProfileComplete = async (req, res, next) => {
  try {
    const { userType, profileId } = req

    let profile

    if (userType === "Worker") {
      profile = await Worker.findById(profileId)
    } else if (userType === "Contractor") {
      profile = await Contractor.findById(profileId)
    } else if (userType === "Owner") {
      profile = await Owner.findById(profileId)
    }

    if (!profile || profile.profileCompletion <= 70) {
      return res.status(403).json({
        message: "Profile completion must be at least 90% to perform this action",
        currentCompletion: profile ? profile.profileCompletion : 0,
      })
    }

    next()
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export { auth, isWorker, isContractor, isOwner, isProfileComplete }

