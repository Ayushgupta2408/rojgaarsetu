import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"
import dotenv from "dotenv"

dotenv.config({
  path: "./.env",
})

// Configure Cloudinary with consistent environment variable names
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Create storage engine for profile images
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gig-worker-app/profiles",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
})

// Create storage engine for resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gig-worker-app/resumes",
    allowed_formats: ["pdf", "doc", "docx"],
    resource_type: "raw",
  },
})

// Create storage engine for vehicle images
const vehicleStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gig-worker-app/vehicles",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  },
})

// Create multer upload instances
const uploadProfileImage = multer({ storage: profileStorage })
const uploadResume = multer({ storage: resumeStorage })
const uploadVehicleImage = multer({ storage: vehicleStorage })

// Function to delete file from Cloudinary
const deleteFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId)
    return { success: true }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error)
    return { success: false, error }
  }
}

export { cloudinary, uploadProfileImage, uploadResume, uploadVehicleImage, deleteFile }
