import { JobPost, Worker, VehicleForm, Owner } from "../models/index.js"

// Recommend jobs for a worker
const recommendJobsForWorker = async (workerId) => {
  try {
    // Get worker details
    const worker = await Worker.findById(workerId)

    if (!worker) {
      return { success: false, message: "Worker not found" }
    }

    // Extract worker's skills and preferences
    const { lookingFor, pastExperience, expectedSalary, currentStatus } = worker

    // Find jobs that match worker's preferences
    const matchingJobs = await JobPost.find({
      // Only show jobs if worker is unemployed or looking for work
      ...(currentStatus === "unemployed" ? {} : { requiredSkill: { $regex: lookingFor, $options: "i" } }),
      // Match salary expectations (with some flexibility)
      payscale: { $gte: expectedSalary * 0.8 },
    }).populate("contractorId", "name organizationName rating")

    // Sort jobs by relevance
    const scoredJobs = matchingJobs.map((job) => {
      let score = 0

      // Score based on skill match
      if (job.requiredSkill && lookingFor && job.requiredSkill.toLowerCase().includes(lookingFor.toLowerCase())) {
        score += 5
      }

      // Score based on salary match
      if (job.payscale >= expectedSalary) {
        score += 3
      }

      // Score based on contractor rating
      if (job.contractorId && job.contractorId.rating >= 4) {
        score += 2
      }

      return { job, score }
    })

    // Sort by score (descending)
    scoredJobs.sort((a, b) => b.score - a.score)

    // Return top recommendations
    return {
      success: true,
      recommendations: scoredJobs.slice(0, 10).map((item) => item.job),
    }
  } catch (error) {
    console.error("Error recommending jobs:", error)
    return { success: false, error }
  }
}

// Recommend workers for a job
const recommendWorkersForJob = async (jobId) => {
  try {
    // Get job details
    const job = await JobPost.findById(jobId)

    if (!job) {
      return { success: false, message: "Job not found" }
    }

    // Find workers that match job requirements
    const matchingWorkers = await Worker.find({
      currentStatus: "unemployed",
      ...(job.requiredSkill ? { lookingFor: { $regex: job.requiredSkill, $options: "i" } } : {}),
      expectedSalary: { $lte: job.payscale * 1.2 }, // Allow some flexibility in salary expectations
    })

    // Score workers based on relevance
    const scoredWorkers = matchingWorkers.map((worker) => {
      let score = 0

      // Score based on skill match
      if (
        worker.lookingFor &&
        job.requiredSkill &&
        worker.lookingFor.toLowerCase().includes(job.requiredSkill.toLowerCase())
      ) {
        score += 5
      }

      // Score based on experience
      if (worker.pastExperience) {
        score += 3
      }

      // Score based on rating
      if (worker.rating >= 4) {
        score += 2
      }

      return { worker, score }
    })

    // Sort by score (descending)
    scoredWorkers.sort((a, b) => b.score - a.score)

    // Return top recommendations
    return {
      success: true,
      recommendations: scoredWorkers.slice(0, 10).map((item) => item.worker),
    }
  } catch (error) {
    console.error("Error recommending workers:", error)
    return { success: false, error }
  }
}

// Recommend vehicle/instrument forms for an owner
const recommendVehicleFormsForOwner = async (ownerId) => {
  try {
    // Get owner details
    const owner = await Owner.findById(ownerId)

    if (!owner) {
      return { success: false, message: "Owner not found" }
    }

    // Extract owner's vehicle types
    const vehicleTypes = owner.availableVehicles.map((v) => v.vehicleName.toLowerCase())

    // Find vehicle forms that match owner's vehicles
    const matchingForms = await VehicleForm.find({
      location: owner.location, // Match by location
    }).populate("contractorId", "name organizationName rating")

    // Score forms based on relevance
    const scoredForms = matchingForms.map((form) => {
      let score = 0

      // Score based on type match
      if (vehicleTypes.some((type) => form.title.toLowerCase().includes(type))) {
        score += 5
      }

      // Score based on location match
      if (form.location === owner.location) {
        score += 3
      }

      // Score based on contractor rating
      if (form.contractorId && form.contractorId.rating >= 4) {
        score += 2
      }

      return { form, score }
    })

    // Sort by score (descending)
    scoredForms.sort((a, b) => b.score - a.score)

    // Return top recommendations
    return {
      success: true,
      recommendations: scoredForms.slice(0, 10).map((item) => item.form),
    }
  } catch (error) {
    console.error("Error recommending vehicle forms:", error)
    return { success: false, error }
  }
}

export { recommendJobsForWorker, recommendWorkersForJob, recommendVehicleFormsForOwner }

