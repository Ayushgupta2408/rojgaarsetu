import { generateOfferLetter, generateJoiningLetter } from "../utils/pdf.util.js"

// Generate PDF (offer letter or joining letter)
const generatePDF = async (req, res) => {
  try {
    const { templateType, data } = req.body

    if (!templateType || !data) {
      return res.status(400).json({ message: "Template type and data are required" })
    }

    let result

    if (templateType === "offer") {
      result = await generateOfferLetter(data)
    } else if (templateType === "joining") {
      result = await generateJoiningLetter(data)
    } else {
      return res.status(400).json({ message: 'Invalid template type. Use "offer" or "joining"' })
    }

    if (!result.success) {
      return res.status(500).json({ message: `Failed to generate ${templateType} letter` })
    }

    res.json({
      message: `${templateType} letter generated successfully`,
      url: result.url,
    })
  } catch (error) {
    console.error("Generate PDF error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export { generatePDF }

