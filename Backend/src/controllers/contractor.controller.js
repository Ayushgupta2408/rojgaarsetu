import { Contractor, JobPost, JobApplication, VehicleForm, VehicleApplication, Worker, Owner } from "../models/index.js"
import { createNotification } from "../utils/notification.util.js"
import { generateOfferLetter, generateJoiningLetter } from "../utils/pdf.util.js"
import { recommendWorkersForJob } from "../utils/recommendation.util.js"
import fs from "fs"
import { cloudinary } from "../utils/cloudinary.util.js"

// Create a job posting
const createJobPost = async (req, res) => {
  try {
    const { title, payscale, requiredSkill, experienceRequired, noOfWorkers, duration, location, description } =
      req.body
    const contractorId = req.profileId

    // Validate required fields
    const requiredFields = {
      title,
      payscale,
      requiredSkill,
      experienceRequired,
      noOfWorkers,
      location,
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      })
    }

    // Validate numeric fields
    if (payscale < 0) {
      return res.status(400).json({ message: "Pay scale cannot be negative" })
    }

    if (experienceRequired < 0) {
      return res.status(400).json({ message: "Experience required cannot be negative" })
    }

    if (noOfWorkers < 1) {
      return res.status(400).json({ message: "At least one worker is required" })
    }

    // Create job post
    const jobPost = new JobPost({
      contractorId,
      title,
      payscale,
      requiredSkill,
      experienceRequired,
      noOfWorkers,
      duration,
      location,
      description,
    })

    // Save job post
    await jobPost.save()

    // Update contractor with job post
    await Contractor.findByIdAndUpdate(contractorId, { $push: { jobPosts: jobPost._id } })

    res.status(201).json({
      message: "Job post created successfully",
      jobPost,
    })
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: "Validation error", errors: validationErrors })
    }

    console.error("Create job post error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update a job posting
const updateJobPost = async (req, res) => {
  try {
    const { id } = req.params
    const contractorId = req.profileId

    // Check if job post exists and belongs to this contractor
    const jobPost = await JobPost.findOne({
      _id: id,
      contractorId,
    })

    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found or unauthorized" })
    }

    // Update job post
    Object.keys(req.body).forEach((key) => {
      jobPost[key] = req.body[key]
    })

    // Save updated job post
    await jobPost.save()

    res.json({
      message: "Job post updated successfully",
      jobPost,
    })
  } catch (error) {
    console.error("Update job post error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete a job posting
const deleteJobPost = async (req, res) => {
  try {
    const { id } = req.params
    const contractorId = req.profileId

    // Check if job post exists and belongs to this contractor
    const jobPost = await JobPost.findOne({
      _id: id,
      contractorId,
    })

    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found or unauthorized" })
    }

    // Delete job post
    await JobPost.findByIdAndDelete(id)

    // Remove job post from contractor
    await Contractor.findByIdAndUpdate(contractorId, { $pull: { jobPosts: id } })

    // Notify applicants about job post deletion
    const applications = await JobApplication.find({ jobPostId: id })

    for (const application of applications) {
      await createNotification(
        application.workerId,
        "Worker",
        `A job you applied for (${jobPost.title}) has been removed by the contractor`,
        "job",
        application._id,
      )
    }

    // Delete all applications for this job
    await JobApplication.deleteMany({ jobPostId: id })

    res.json({ message: "Job post deleted successfully" })
  } catch (error) {
    console.error("Delete job post error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// View a specific job post
const viewJob = async (req, res) => {
  try {
    const { id } = req.params
    const contractorId = req.profileId

    // Check if job post exists and belongs to this contractor
    const jobPost = await JobPost.findOne({
      _id: id,
      contractorId,
    })

    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found or unauthorized" })
    }

    res.json({ jobPost })
  } catch (error) {
    console.error("View job error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// View all jobs posted by the contractor
const viewAllJobs = async (req, res) => {
  try {
    const contractorId = req.profileId

    // Get all job posts for this contractor with pagination
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const jobPosts = await JobPost.find({ contractorId }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await JobPost.countDocuments({ contractorId })

    res.json({
      jobPosts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("View all jobs error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create a vehicle/instrument form
const createVehicleForm = async (req, res) => {
  try {
    const { title, type, payscale, brand, quantity, purchaseDate, location, organization, otherDetails } = req.body
    const contractorId = req.profileId

    // Validate required fields
    const requiredFields = {
      title,
      type,
      payscale,
      location,
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      })
    }

    // Validate type
    if (type !== "vehicle" && type !== "instrument") {
      return res.status(400).json({ message: "Type must be either 'vehicle' or 'instrument'" })
    }

    // Validate payscale
    if (payscale < 0) {
      return res.status(400).json({ message: "Pay scale cannot be negative" })
    }

    // Get contractor profile for profile link
    const contractor = await Contractor.findById(contractorId)

    // Create vehicle form
    const vehicleForm = new VehicleForm({
      contractorId,
      title,
      type,
      payscale,
      brand,
      quantity,
      purchaseDate,
      location,
      organization: organization || contractor.organizationName,
      contractorProfileLink: `${process.env.FRONTEND_URL}/contractor/${contractorId}`,
      otherDetails,
    })

    // Save vehicle form
    await vehicleForm.save()

    // Update contractor with vehicle form
    await Contractor.findByIdAndUpdate(contractorId, { $push: { vehicleForms: vehicleForm._id } })

    res.status(201).json({
      message: "Vehicle/instrument form created successfully",
      vehicleForm,
    })
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: "Validation error", errors: validationErrors })
    }

    console.error("Create vehicle form error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update a vehicle/instrument form
const updateVehicleForm = async (req, res) => {
  try {
    const { id } = req.params
    const contractorId = req.profileId

    // Check if vehicle form exists and belongs to this contractor
    const vehicleForm = await VehicleForm.findOne({
      _id: id,
      contractorId,
    })

    if (!vehicleForm) {
      return res.status(404).json({ message: "Vehicle form not found or unauthorized" })
    }

    // Update vehicle form
    Object.keys(req.body).forEach((key) => {
      vehicleForm[key] = req.body[key]
    })

    // Save updated vehicle form
    await vehicleForm.save()

    res.json({
      message: "Vehicle/instrument form updated successfully",
      vehicleForm,
    })
  } catch (error) {
    console.error("Update vehicle form error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete a vehicle/instrument form
const deleteVehicleForm = async (req, res) => {
  try {
    const { id } = req.params
    const contractorId = req.profileId

    // Check if vehicle form exists and belongs to this contractor
    const vehicleForm = await VehicleForm.findOne({
      _id: id,
      contractorId,
    })

    if (!vehicleForm) {
      return res.status(404).json({ message: "Vehicle form not found or unauthorized" })
    }

    // Delete vehicle form
    await VehicleForm.findByIdAndDelete(id)

    // Remove vehicle form from contractor
    await Contractor.findByIdAndUpdate(contractorId, { $pull: { vehicleForms: id } })

    // Delete all applications for this vehicle form
    await VehicleApplication.deleteMany({ vehicleFormId: id })

    res.json({ message: "Vehicle/instrument form deleted successfully" })
  } catch (error) {
    console.error("Delete vehicle form error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// View a specific vehicle form
const viewVehicle = async (req, res) => {
  try {
    const { id } = req.params
    const contractorId = req.profileId

    // Check if vehicle form exists and belongs to this contractor
    const vehicleForm = await VehicleForm.findOne({
      _id: id,
      contractorId,
    })

    if (!vehicleForm) {
      return res.status(404).json({ message: "Vehicle form not found or unauthorized" })
    }

    res.json({ vehicleForm })
  } catch (error) {
    console.error("View vehicle error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// View all vehicle forms posted by the contractor
const viewAllVehicles = async (req, res) => {
  try {
    const contractorId = req.profileId

    // Get all vehicle forms for this contractor with pagination
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const vehicleForms = await VehicleForm.find({ contractorId }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await VehicleForm.countDocuments({ contractorId })

    res.json({
      vehicleForms,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("View all vehicles error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get contractor dashboard data
const getDashboard = async (req, res) => {
  try {
    const contractorId = req.profileId

    // Get all job posts for this contractor
    const jobPosts = await JobPost.find({ contractorId }).sort({ createdAt: -1 })

    // Get all job applications for these job posts
    const jobApplications = await JobApplication.find({
      jobPostId: { $in: jobPosts.map((job) => job._id) },
    }).populate("workerId", "name email phone rating")

    // Get all vehicle forms for this contractor
    const vehicleForms = await VehicleForm.find({ contractorId }).sort({ createdAt: -1 })

    const vehicleApplications = await VehicleApplication.find({
      vehicleFormId: { $in: vehicleForms.map((form) => form._id) },
    })
      .populate({
        path: "applicantId",
        select: "name email phone rating",
        model: "Owner",
      })
      .populate("vehicleFormId", "title type payscale")

    // Categorize job applications
    const appliedCandidates = jobApplications.filter((app) =>
      ["considering", "rejected", "underreview"].includes(app.status),
    )

    const offerLetterSent = jobApplications.filter((app) => ["offerSent", "offerAccepted"].includes(app.status))

    const joiningLetterSent = jobApplications.filter((app) => app.status === "joiningLetterSent")
    
    const joinedCandidates = jobApplications.filter((app) => app.status === "joined")

    // Get recommended workers for each job
    const jobRecommendations = {}
    for (const job of jobPosts) {
      const { recommendations } = await recommendWorkersForJob(job._id)
      jobRecommendations[job._id] = recommendations || []
    }

    res.json({
      jobPosts,
      vehicleForms,
      jobApplications: {
        appliedCandidates,
        offerLetterSent,
        joiningLetterSent,
        joinedCandidates,
      },
      vehicleApplications,
      jobRecommendations,
    })
  } catch (error) {
    console.error("Get contractor dashboard error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// View a single job application
const viewSingleJobApplication = async (req, res) => {
  try {
    const { applicationId } = req.params
    // const contractorId = req.profileId;

    // Find the application with populated worker and jobPost
    const application = await JobApplication.findById(applicationId)
      .populate("workerId", "name email phone rating")
      .populate("jobPostId", "title payscale location contractorId")

    if (!application) {
      return res.status(404).json({ message: "Job application not found" })
    }

    // Check if the job post belongs to the contractor
    // if (application.jobPostId.contractorId.toString() !== contractorId) {
    //   return res.status(403).json({ message: "Unauthorized access to this job application" });
    // }

    res.json({ application })
  } catch (error) {
    console.error("View single job application error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// View a single vehicle application
const viewSingleVehicleApplication = async (req, res) => {
  try {
    const { applicationId } = req.params
    const contractorId = req.profileId

    const application = await VehicleApplication.findById(applicationId)
      .populate({
        path: "applicantId",
        select: "name email phone rating",
        refPath: "applicantModel", // ← use refPath here instead of model: fn
      })
      .populate("vehicleFormId")

    if (!application) {
      return res.status(404).json({ message: "Vehicle application not found" })
    }
    // if (application.vehicleFormId.contractorId.toString() !== contractorId) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    return res.json({ application })
  } catch (error) {
    console.error("View single vehicle application error:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
}

// View all applications (both job and vehicle)
const viewAllApplications = async (req, res) => {
  try {
    const contractorId = req.profileId

    // Get all job posts for this contractor
    const jobPosts = await JobPost.find({ contractorId })

    // Get all job applications for these job posts
    const jobApplications = await JobApplication.find({
      jobPostId: { $in: jobPosts.map((job) => job._id) },
    })
      .populate("workerId", "name email phone rating")
      .populate("jobPostId", "title payscale location")

    // Get all vehicle forms for this contractor
    const vehicleForms = await VehicleForm.find({ contractorId })

    // Get all vehicle applications for these forms
    const vehicleApplications = await VehicleApplication.find({
      vehicleFormId: { $in: vehicleForms.map((form) => form._id) },
    })
      .populate({
        path: "applicantId",
        select: "name email phone rating",
      })
      .populate("vehicleFormId", "title type payscale")

    res.json({
      jobApplications,
      vehicleApplications,
      total: jobApplications.length + vehicleApplications.length,
    })
  } catch (error) {
    console.error("View all applications error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// View applications for a specific job
const viewJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params
    const contractorId = req.profileId

    // Check if job post exists and belongs to this contractor
    const jobPost = await JobPost.findOne({
      _id: jobId,
      contractorId,
    })

    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found or unauthorized" })
    }

    // Get all applications for this job
    const applications = await JobApplication.find({ jobPostId: jobId })
      .populate("workerId", "name email phone rating")
      .sort({ appliedAt: -1 })

    // Categorize applications by status
    const categorized = {
      underreview: applications.filter((app) => app.status === "underreview"),
      considering: applications.filter((app) => app.status === "considering"),
      offerSent: applications.filter((app) => app.status === "offerSent"),
      offerAccepted: applications.filter((app) => app.status === "offerAccepted"),
      joiningLetterSent: applications.filter((app) => app.status === "joiningLetterSent"),
      rejected: applications.filter((app) => app.status === "rejected"),
    }

    res.json({
      jobPost,
      applications,
      categorized,
      total: applications.length,
    })
  } catch (error) {
    console.error("View job applications error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// View applications for a specific vehicle form
const viewVehicleApplications = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const contractorId = req.profileId

    // 1. Verify ownership
    const vehicleForm = await VehicleForm.findOne({ _id: vehicleId, contractorId })
    if (!vehicleForm) {
      return res.status(404).json({ message: "Vehicle form not found or unauthorized" })
    }

    // 2. Fetch + dynamic-populate
    const applications = await VehicleApplication.find({ vehicleFormId: vehicleId })
      .populate("applicantId", "name email phone rating")
      .sort({ appliedAt: -1 })

    // 3. Categorize
    const categorized = {
      pending: applications.filter((a) => a.status === "pending"),
      accepted: applications.filter((a) => a.status === "accepted"),
      rejected: applications.filter((a) => a.status === "rejected"),
    }

    // 4. Respond
    return res.json({
      vehicleForm,
      applications,
      categorized,
      total: applications.length,
    })
  } catch (error) {
    console.error("View vehicle applications error:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Process job application (consider, reject, send offer)
const processJobApplication = async (req, res) => {
  try {
    const { applicationId } = req.params
    const { action, feedback } = req.body // 'consider', 'reject', 'sendOffer'
    const contractorId = req.profileId

    // Check if application exists and belongs to a job post by this contractor
    const application = await JobApplication.findById(applicationId).populate({
      path: "jobPostId",
      select: "contractorId title payscale location duration",
    })

    if (!application || application.jobPostId.contractorId.toString() !== contractorId.toString()) {
      return res.status(404).json({ message: "Application not found or unauthorized" })
    }

    // Process based on action
    if (action === "consider") {
      application.status = "considering"
      await application.save()

      // Create notification for worker
      await createNotification(
        application.workerId,
        "Worker",
        `Your application for ${application.jobPostId.title} is being considered`,
        "application",
        application._id,
      )

      res.json({ message: "Application marked as considering" })
    } else if (action === "reject") {
      application.status = "rejected"
      await application.save()

      // Create notification for worker
      await createNotification(
        application.workerId,
        "Worker",
        `Your application for ${application.jobPostId.title} has been rejected${feedback ? ": " + feedback : ""}`,
        "application",
        application._id,
      )

      res.json({ message: "Application rejected" })
    } else if (action === "sendOffer") {
      // Get contractor details
      const contractor = await Contractor.findById(contractorId)

      // Get contractor details
      //const contractor = await Contractor.findById(contractorId) //Fixed: removed redeclaration

      // Generate offer letter
      const offerLetterResult = await generateOfferLetter({
        workerName: application.name,
        contractorName: contractor.name,
        organizationName: contractor.organizationName,
        jobTitle: application.jobPostId.title,
        payscale: application.jobPostId.payscale,
        location: application.jobPostId.location,
        startDate: new Date().toLocaleDateString(),
        duration: application.jobPostId.duration,
      })
      if (!offerLetterResult.success) {
        return res.status(500).json({ message: "Failed to generate offer letter" })
      }

      // Update application with offer letter URL
      application.status = "offerSent"
      application.offerLetter = offerLetterResult.url
      await application.save()

      // Create notification for worker
      await createNotification(
        application.workerId,
        "Worker",
        `You have received an offer letter for ${application.jobPostId.title}`,
        "offer",
        application._id,
      )

      res.json({
        message: "Offer letter sent successfully",
        offerLetterUrl: offerLetterResult.url,
      })
    } else {
      return res.status(400).json({ message: 'Invalid action. Use "consider", "reject", or "sendOffer"' })
    }
  } catch (error) {
    console.error("Process job application error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Send joining letter
const sendJoiningLetter = async (req, res) => {
  try {
    const { applicationId } = req.params
    const contractorId = req.profileId

    // Check if application exists, has accepted offer, and belongs to a job post by this contractor
    const application = await JobApplication.findOne({
      _id: applicationId,
      status: "offerAccepted",
    }).populate({
      path: "jobPostId",
      select: "contractorId title payscale location duration",
    })

    if (!application || application.jobPostId.contractorId.toString() !== contractorId.toString()) {
      return res.status(404).json({ message: "Application not found, unauthorized, or offer not accepted" })
    }

    // Get contractor details
    const contractor = await Contractor.findById(contractorId)

    // Generate joining letter
    const joiningLetterResult = await generateJoiningLetter({
      workerName: application.name,
      contractorName: contractor.name,
      organizationName: contractor.organizationName,
      jobTitle: application.jobPostId.title,
      payscale: application.jobPostId.payscale,
      location: application.jobPostId.location,
      startDate: new Date().toLocaleDateString(),
      duration: application.jobPostId.duration,
    })

    if (!joiningLetterResult.success) {
      return res.status(500).json({ message: "Failed to generate joining letter" })
    }

    // Update application with joining letter URL
    application.status = "joiningLetterSent"
    application.joiningLetter = joiningLetterResult.url
    await application.save()

    // Create notification for worker
    await createNotification(
      application.workerId,
      "Worker",
      `You have received a joining letter for ${application.jobPostId.title}`,
      "joining",
      application._id,
    )

    res.json({
      message: "Joining letter sent successfully",
      joiningLetterUrl: joiningLetterResult.url,
    })
  } catch (error) {
    console.error("Send joining letter error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Process vehicle application (accept, reject)
const processVehicleApplication = async (req, res) => {
  try {
    const { applicationId } = req.params
    const { action, feedback } = req.body // 'accept', 'reject'
    const contractorId = req.profileId

    // Check if application exists and belongs to a vehicle form by this contractor
    const application = await VehicleApplication.findById(applicationId).populate({
      path: "vehicleFormId",
      select: "contractorId title type",
    })

    if (!application || application.vehicleFormId.contractorId.toString() !== contractorId.toString()) {
      return res.status(404).json({ message: "Application not found or unauthorized" })
    }

    // Process based on action
    if (action === "accept") {
      application.status = "accepted"
      if (feedback) {
        application.feedback = feedback
      }
      await application.save()

      // Create notification for applicant
      await createNotification(
        application.applicantId,
        application.applicantModel,
        `Your application for ${application.vehicleFormId.title} has been accepted`,
        "vehicle",
        application._id,
      )

      res.json({ message: "Vehicle application accepted" })
    } else if (action === "reject") {
      application.status = "rejected"
      if (feedback) {
        application.feedback = feedback
      }
      await application.save()

      // Create notification for applicant
      await createNotification(
        application.applicantId,
        application.applicantModel,
        `Your application for ${application.vehicleFormId.title} has been rejected${feedback ? ": " + feedback : ""}`,
        "vehicle",
        application._id,
      )

      res.json({ message: "Vehicle application rejected" })
    } else {
      return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject"' })
    }
  } catch (error) {
    console.error("Process vehicle application error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Send invitation to workers or owners
const sendInvitation = async (req, res) => {
  try {
    const { userType, userId, jobPostId, vehicleFormId, message } = req.body
    const contractorId = req.profileId

    // Validate input
    if (!userType || !userId || (!jobPostId && !vehicleFormId) || !message) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    if (userType !== "Worker" && userType !== "Owner") {
      return res.status(400).json({ message: "Invalid user type" })
    }

    // Check if user exists
    let user
    if (userType === "Worker") {
      user = await Worker.findById(userId)
    } else {
      user = await Owner.findById(userId)
    }

    if (!user) {
      return res.status(404).json({ message: `${userType} not found` })
    }

    // Check if job post or vehicle form exists and belongs to this contractor
    let referenceId
    let type
    let title

    if (jobPostId) {
      const jobPost = await JobPost.findOne({
        _id: jobPostId,
        contractorId,
      })

      if (!jobPost) {
        return res.status(404).json({ message: "Job post not found or unauthorized" })
      }

      referenceId = jobPost._id
      type = "job"
      title = jobPost.title
    } else {
      const vehicleForm = await VehicleForm.findOne({
        _id: vehicleFormId,
        contractorId,
      })

      if (!vehicleForm) {
        return res.status(404).json({ message: "Vehicle form not found or unauthorized" })
      }

      referenceId = vehicleForm._id
      type = "vehicle"
      title = vehicleForm.title
    }

    // Create notification for user
    const notification = await createNotification(userId, userType, message, type, referenceId)

    if (!notification.success) {
      return res.status(500).json({ message: "Failed to send invitation" })
    }

    res.json({
      message: `Invitation sent successfully to ${userType.toLowerCase()}`,
      notification: notification.notification,
    })
  } catch (error) {
    console.error("Send invitation error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Upload project images (Contractor only)
const uploadProjectImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" })
    }

    const { userType, profileId } = req
    const { projectIndex } = req.body

    // Verify user is a Contractor
    if (userType !== "Contractor") {
      // Clean up temp file
      fs.unlinkSync(req.file.path)
      return res.status(403).json({ message: "Only Contractors can upload project images" })
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "gig-worker-app/projects",
    })

    // Remove temp file
    fs.unlinkSync(req.file.path)

    // If projectIndex is provided, update that specific project
    if (projectIndex !== undefined) {
      const contractor = await Contractor.findById(profileId)

      if (!contractor) {
        return res.status(404).json({ message: "Contractor profile not found" })
      }

      if (!contractor.completedProjects || !contractor.completedProjects[projectIndex]) {
        return res.status(404).json({ message: "Project not found" })
      }

      // Add image URL to the project
      if (!contractor.completedProjects[projectIndex].images) {
        contractor.completedProjects[projectIndex].images = []
      }

      contractor.completedProjects[projectIndex].images.push(result.secure_url)
      await contractor.save()

      return res.json({
        message: "Project image uploaded successfully",
        imageUrl: result.secure_url,
        project: contractor.completedProjects[projectIndex],
      })
    }

    // If no projectIndex, just return the image URL for client to use
    res.json({
      message: "Project image uploaded successfully",
      imageUrl: result.secure_url,
    })
  } catch (error) {
    console.error("Project image upload error:", error)

    // Clean up temp file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export {
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
}
