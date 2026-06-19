"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useApplyForJobMutation } from "../../redux/api/workerApiSlice"
import { useGetProfileQuery } from "@/redux/api/profileApiSlice"
import { useGetJobByIdQuery } from "@/redux/api/jobsApiSlice"
import { Briefcase } from "lucide-react"
import FormField from "../common/FormField"
import SubmitButton from "../common/SubmitButton"
import LoadingSpinner from "../common/LoadingSpinner"
import ErrorMessage from "../common/ErrorMessage"

const JobApplicationForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id: jobPostId } = useParams()

  const { data: jobData, isLoading: jobLoading, isError: jobError } = useGetJobByIdQuery(jobPostId)
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery()
  const [applyForJob, { isLoading: isSubmitting }] = useApplyForJobMutation()

  const [formData, setFormData] = useState({
    experience: "",
    availability: "",
  })

  const [errors, setErrors] = useState({
    experience: "",
    availability: "",
  })

  useEffect(() => {
    if (profileData?.profile) {
      setFormData((prev) => ({
        ...prev,
        experience: profileData.profile.pastExperience?.toString() || "",
        availability: prev.availability,
      }))
    }
  }, [profileData])

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      experience: "",
      availability: "",
    }

    if (!formData.experience.trim()) {
      newErrors.experience = t("jobs.application.errors.experienceRequired")
      isValid = false
    } else if (isNaN(formData.experience) || Number(formData.experience) < 0) {
      newErrors.experience = t("jobs.application.errors.experienceInvalid")
      isValid = false
    }

    if (!formData.availability.trim()) {
      newErrors.availability = t("jobs.application.errors.availabilityRequired")
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await applyForJob({
        jobPostId,
        data: formData,
      }).unwrap()

      toast.success(t("jobs.application.success"))
      navigate("/dashboard")
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        ...(err.data?.errors || { general: err.data?.message || t("jobs.application.error") }),
      }))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const isLoading = jobLoading || profileLoading

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (jobError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center text-red-600">
            <p>{t("jobs.errors.notFoundOrRemoved")}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {t("common.actions.goBack")}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const job = jobData?.jobPost

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-900">{t("jobs.application.title", { jobTitle: job.title })}</h1>
            <p className="mt-2 text-sm text-gray-600">{t("jobs.application.subtitle")}</p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
                <span>{job.requiredSkill}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>₹{job.payscale}/day</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="px-4 py-5 sm:p-6 space-y-6">
            {(errors.general || errors.availability || errors.experience) && (
              <ErrorMessage message={errors.general || errors.availability || errors.experience} />
            )}

            <FormField
              label={t("jobs.application.fields.experience")}
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder={t("jobs.application.fields.experiencePlaceholder")}
              error={errors.experience}
              required
            />

            <FormField
              label={t("jobs.application.fields.availability")}
              name="availability"
              type="text"
              value={formData.availability}
              onChange={handleInputChange}
              placeholder={t("jobs.application.fields.availabilityPlaceholder")}
              error={errors.availability}
              required
            />

            <SubmitButton
              isLoading={isSubmitting}
              loadingText={t("jobs.application.submitting")}
              text={t("jobs.application.submit")}
              fullWidth
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default JobApplicationForm
