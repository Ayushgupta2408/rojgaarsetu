import { VehicleForm, VehicleApplication } from "../models/index.js"
import fs from "fs";
import { cloudinary } from "../utils/cloudinary.util.js"
// Get all vehicle forms with filtering and pagination
const getAllVehicleForms = async (req, res) => {
  try {
    const { location, type, minSalary, maxSalary } = req.query

    // Build filter object
    const filter = {}

    if (location) {
      filter.location = { $regex: location, $options: "i" }
    }

    if (type) {
      filter.type = type
    }

    if (minSalary) {
      filter.payscale = { ...filter.payscale, $gte: Number(minSalary) }
    }

    if (maxSalary) {
      filter.payscale = { ...filter.payscale, $lte: Number(maxSalary) }
    }

    // Get vehicle forms with pagination
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const vehicleForms = await VehicleForm.find(filter)
      .populate("contractorId", "name organizationName rating")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await VehicleForm.countDocuments(filter)

    res.json({
      vehicleForms,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get vehicle forms error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get vehicle form by ID
const getVehicleFormById = async (req, res) => {
  try {
    const vehicleForm = await VehicleForm.findById(req.params.id).populate(
      "contractorId",
      "name organizationName rating",
    )

    if (!vehicleForm) {
      return res.status(404).json({ message: "Vehicle form not found" })
    }

    res.json({ vehicleForm })
  } catch (error) {
    console.error("Get vehicle form error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Apply for a vehicle form (for workers and owners)
const applyForVehicleForm = async (req, res) => {
  try {
    const { vehicleFormId } = req.params;
    const {
      type,
      brand,
      quantity,
      purchaseDate,
      location,
      ownerDetails,
    } = req.body;

    const applicantId = req.profileId;
    const applicantModel = req.userType;

    if (applicantModel !== "Worker" && applicantModel !== "Owner") {
      return res.status(403).json({ message: "Only Workers and Owners can apply for vehicle forms" });
    }

    if (!ownerDetails) {
      return res.status(400).json({ message: "Owner details are required" });
    }
    const vehicleForm = await VehicleForm.findById(vehicleFormId);
    if (!vehicleForm) {
      return res.status(404).json({ message: "Vehicle form not found" });
    }

    const existingApplication = await VehicleApplication.findOne({
      applicantId,
      applicantModel,
      vehicleFormId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this vehicle form" });
    }

    let pictures = [];
    if (req.files?.vehicles?.length) {
      const uploadResults = await Promise.all(
        req.files.vehicles.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: "gig-worker-app/vehicles",
            transformation: [{ width: 800, height: 600, crop: "limit" }],
          })
        )
      );
      pictures = uploadResults.map((img) => img.secure_url);
      req.files.vehicles.forEach((file) => {
         fs.unlinkSync(file.path);
      });
    }

    const application = new VehicleApplication({
      applicantId,
      applicantModel,
      vehicleFormId,
      type: type || vehicleForm.type,
      brand,
      quantity: quantity ? Number(quantity) : undefined,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
      location: location || vehicleForm.location,
      pictures,
      ownerDetails,
    });

    await application.save();

    vehicleForm.applications.push(application._id);
    await vehicleForm.save();

    res.status(201).json({
      message: "Vehicle application submitted successfully",
      application,
    });
  } catch (error) {
    if (req.files?.vehicles?.length) {
      req.files.vehicles.forEach((file) => {
      fs.unlinkSync(file.path);
      });
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors: validationErrors });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get vehicle applications for a user
const getUserVehicleApplications = async (req, res) => {
  try {
    const applicantId = req.profileId
    const applicantModel = req.userType

    // Get all vehicle applications for this user
    const applications = await VehicleApplication.find({
      applicantId,
      applicantModel,
    })
      .populate({
        path: "vehicleFormId",
        select: "title type payscale location organization",
        populate: {
          path: "contractorId",
          select: "name organizationName",
        },
      })
      .sort({ appliedAt: -1 })

    res.json({
      applications,
      total: applications.length,
    })
  } catch (error) {
    console.error("Get user vehicle applications error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get vehicle application by ID
const getVehicleApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params
    const userId = req.profileId
    const userType = req.userType

    // Find the application
    const application = await VehicleApplication.findById(applicationId).populate({
      path: "vehicleFormId",
      select: "title type payscale location organization contractorId",
      populate: {
        path: "contractorId",
        select: "name organizationName",
      },
    })

    if (!application) {
      return res.status(404).json({ message: "Vehicle application not found" })
    } 

    // Check if the user is authorized to view this application
    // Either the applicant or the contractor who posted the vehicle form
    const isApplicant =
      application.applicantId.toString() === userId.toString() && application.applicantModel === userType
    const isContractor =
      userType === "Contractor" && application.vehicleFormId.contractorId?._id.toString() === userId.toString()
    
    if (!isApplicant && !isContractor) {
      return res.status(403).json({ message: "You are not authorized to view this application" })
    }

    res.json({ application })
  } catch (error) {
    console.error("Get vehicle application error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export {
  getAllVehicleForms,
  getVehicleFormById,
  applyForVehicleForm,
  getUserVehicleApplications,
  getVehicleApplicationById,
}
