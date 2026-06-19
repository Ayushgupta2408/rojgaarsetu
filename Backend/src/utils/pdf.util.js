import PDFDocument from "pdfkit"
import { cloudinary } from "./cloudinary.util.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Generate offer letter PDF
const generateOfferLetter = async (data) => {
  try {
    const { workerName, contractorName, organizationName, jobTitle, payscale, location, startDate, duration } = data

    // Create a temporary file path
    const tempFilePath = path.join(__dirname, "../temp", `offer_letter_${Date.now()}.pdf`)

    // Ensure temp directory exists
    if (!fs.existsSync(path.join(__dirname, "../temp"))) {
      fs.mkdirSync(path.join(__dirname, "../temp"), { recursive: true })
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 })
    const stream = fs.createWriteStream(tempFilePath)

    doc.pipe(stream)

    // Add company logo if available
    // doc.image('path/to/logo.png', 50, 45, { width: 150 });

    // Add header
    doc.fontSize(20).text("OFFER LETTER", { align: "center" })
    doc.moveDown()

    // Add date
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" })
    doc.moveDown()

    // Add content
    doc.fontSize(12).text(`Dear ${workerName},`, { align: "left" })
    doc.moveDown()

    doc.text(
      `We are pleased to offer you a position at ${organizationName} as a ${jobTitle}. This letter outlines the terms and conditions of your employment.`,
      { align: "left" },
    )
    doc.moveDown()

    doc.text("Terms of Employment:", { align: "left" })
    doc.moveDown()

    doc.text(`1. Position: ${jobTitle}`, { align: "left" })
    doc.text(`2. Compensation: ${payscale} per day`, { align: "left" })
    doc.text(`3. Location: ${location}`, { align: "left" })
    doc.text(`4. Start Date: ${startDate}`, { align: "left" })
    doc.text(`5. Duration: ${duration}`, { align: "left" })
    doc.moveDown()

    doc.text("Please indicate your acceptance of this offer by signing and returning this letter.", { align: "left" })
    doc.moveDown(2)

    doc.text("Sincerely,", { align: "left" })
    doc.moveDown()
    doc.text(`${contractorName}`, { align: "left" })
    doc.text(`${organizationName}`, { align: "left" })

    // Add signature lines
    doc.moveDown(3)
    doc.text("_______________________", { align: "left" })
    doc.text(`${workerName} - Signature`, { align: "left" })
    doc.text("Date: ___________________", { align: "left" })

    // Finalize PDF
    doc.end()

    // Wait for the stream to finish
    await new Promise((resolve) => stream.on("finish", resolve))

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: "gig-worker-app/offer-letters",
      resource_type: "raw",
    })

    // Delete temporary file
    fs.unlinkSync(tempFilePath)

    return { success: true, url: result.secure_url, publicId: result.public_id }
  } catch (error) {
    console.error("Error generating offer letter:", error)
    return { success: false, error }
  }
}

// Generate joining letter PDF
const generateJoiningLetter = async (data) => {
  try {
    const { workerName, contractorName, organizationName, jobTitle, payscale, location, startDate, duration } = data

    // Create a temporary file path
    const tempFilePath = path.join(__dirname, "../temp", `joining_letter_${Date.now()}.pdf`)

    // Ensure temp directory exists
    if (!fs.existsSync(path.join(__dirname, "../temp"))) {
      fs.mkdirSync(path.join(__dirname, "../temp"), { recursive: true })
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 })
    const stream = fs.createWriteStream(tempFilePath)

    doc.pipe(stream)

    // Add company logo if available
    // doc.image('path/to/logo.png', 50, 45, { width: 150 });

    // Add header
    doc.fontSize(20).text("JOINING LETTER", { align: "center" })
    doc.moveDown()

    // Add date
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" })
    doc.moveDown()

    // Add content
    doc.fontSize(12).text(`Dear ${workerName},`, { align: "left" })
    doc.moveDown()

    doc.text(
      `We are delighted to confirm that you have accepted our offer to join ${organizationName} as a ${jobTitle}. This letter serves as your official joining letter.`,
      { align: "left" },
    )
    doc.moveDown()

    doc.text("Employment Details:", { align: "left" })
    doc.moveDown()

    doc.text(`1. Position: ${jobTitle}`, { align: "left" })
    doc.text(`2. Compensation: ${payscale} per day`, { align: "left" })
    doc.text(`3. Location: ${location}`, { align: "left" })
    doc.text(`4. Start Date: ${startDate}`, { align: "left" })
    doc.text(`5. Duration: ${duration}`, { align: "left" })
    doc.moveDown()

    doc.text(
      "Please report to the job site on the start date mentioned above. We look forward to having you on our team.",
      { align: "left" },
    )
    doc.moveDown(2)

    doc.text("Sincerely,", { align: "left" })
    doc.moveDown()
    doc.text(`${contractorName}`, { align: "left" })
    doc.text(`${organizationName}`, { align: "left" })

    // Finalize PDF
    doc.end()

    // Wait for the stream to finish
    await new Promise((resolve) => stream.on("finish", resolve))

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: "gig-worker-app/joining-letters",
      resource_type: "raw",
    })

    // Delete temporary file
    fs.unlinkSync(tempFilePath)

    return { success: true, url: result.secure_url, publicId: result.public_id }
  } catch (error) {
    console.error("Error generating joining letter:", error)
    return { success: false, error }
  }
}

export { generateOfferLetter, generateJoiningLetter }

