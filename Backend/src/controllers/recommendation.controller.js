import {
    recommendJobsForWorker,
    recommendWorkersForJob,
    recommendVehicleFormsForOwner,
  } from "../utils/recommendation.util.js"
  
  // Get recommendations based on user type
  const getRecommendations = async (req, res) => {
    try {
      const { userType, profileId } = req
      const { jobId, vehicleFormId } = req.query
  
      let result
  
      if (userType === "Worker") {
        result = await recommendJobsForWorker(profileId)
      } else if (userType === "Contractor" && jobId) {
        result = await recommendWorkersForJob(jobId)
      } else if (userType === "Owner") {
        result = await recommendVehicleFormsForOwner(profileId)
      } else {
        return res.status(400).json({ message: "Invalid request parameters" })
      }
  
      if (!result.success) {
        return res.status(500).json({ message: "Failed to get recommendations" })
      }
  
      res.json({
        recommendations: result.recommendations,
      })
    } catch (error) {
      console.error("Get recommendations error:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }
  
  export { getRecommendations }
  
  