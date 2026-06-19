"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { useUpdateJobMutation, useDeleteJobMutation } from "@/redux/api/contractorApiSlice"
import { useGetJobByIdQuery } from "../../redux/api/jobsApiSlice"
import Layout from "../Layout/Layout"
import FormField from "../common/FormField"
import ActionButton from "../common/ActionButton"
import LoadingSpinner from "../common/LoadingSpinner"

const SingleJobPost = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { userType } = useSelector((state) => state.auth)
  const { data: jobData, isLoading, isError } = useGetJobByIdQuery(id)
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation()
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    payscale: "",
    requiredSkill: "",
    experienceRequired: "",
    noOfWorkers: "",
    duration: "",
    location: "",
    description: "",
  })

  useEffect(() => {
    if (jobData?.jobPost) {
      const j = jobData.jobPost
      setFormData({
        title: j.title || "",
        payscale: j.payscale || "",
        requiredSkill: j.requiredSkill || "",
        experienceRequired: j.experienceRequired || "",
        noOfWorkers: j.noOfWorkers || "",
        duration: j.duration || "",
        location: j.location || "",
        description: j.description || "",
      })
    }
  }, [jobData])

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleEdit = () => setIsEditing(true)

  const handleCancel = () => {
    if (jobData?.jobPost) {
      const j = jobData.jobPost
      setFormData({
        title: j.title,
        payscale: j.payscale,
        requiredSkill: j.requiredSkill,
        experienceRequired: j.experienceRequired,
        noOfWorkers: j.noOfWorkers,
        duration: j.duration,
        location: j.location,
        description: j.description,
      })
    }
    setIsEditing(false)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await updateJob({ id, ...formData }).unwrap()
      toast.success(t("jobs.update.success"))
      setIsEditing(false)
    } catch (err) {
      toast.error(err?.data?.message || t("jobs.update.error"))
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteJob(id).unwrap()
      toast.success(t("jobs.delete.success"))
      navigate("/contractor/dashboard")
    } catch (err) {
      toast.error(err?.data?.message || t("jobs.delete.error"))
    }
  }

  const renderActionButtons = () => {
    if (!isEditing) {
      return (
        <div className="space-x-2">
          {userType === "Contractor" ? (
            <>
              <ActionButton onClick={handleEdit} variant="success" text={t("common.actions.edit")} />
              <ActionButton
                onClick={() => setShowDeleteModal(true)}
                variant="danger"
                text={t("common.actions.delete")}
              />
            </>
          ) : userType === "Worker" ? (
            <Link
              to={`/job/apply/${id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {t("jobs.actions.applyNow")}
            </Link>
          ) : null}
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError || !jobData?.jobPost) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center text-red-600">
            <p>{t("jobs.errors.notFound")}</p>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
              {t("common.actions.goBack")}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const job = jobData.jobPost

  return (
    <Layout>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">{t("jobs.delete.confirmTitle")}</h3>
            <p className="mb-6">{t("jobs.delete.confirmMessage")}</p>
            <div className="flex justify-end space-x-4">
              <ActionButton
                onClick={() => setShowDeleteModal(false)}
                variant="secondary"
                text={t("common.actions.cancel")}
              />
              <ActionButton
                onClick={confirmDelete}
                variant="danger"
                text={isDeleting ? t("jobs.delete.deleting") : t("common.actions.delete")}
                disabled={isDeleting}
              />
            </div>
          </div>
        </div>
      )}

      <motion.section
        className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-black">{t("jobs.details.title")}</h2>
            {renderActionButtons()}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <FormField
                label={t("jobs.fields.jobTitle")}
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <FormField
                label={t("jobs.fields.payscale")}
                name="payscale"
                type="number"
                value={formData.payscale}
                onChange={handleChange}
                required
              />

              <FormField
                label={t("jobs.fields.requiredSkill")}
                name="requiredSkill"
                type="text"
                value={formData.requiredSkill}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label={t("jobs.fields.experience")}
                  name="experienceRequired"
                  type="number"
                  value={formData.experienceRequired}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label={t("jobs.fields.noOfWorkers")}
                  name="noOfWorkers"
                  type="number"
                  value={formData.noOfWorkers}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label={t("jobs.fields.duration")}
                  name="duration"
                  type="text"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label={t("jobs.fields.location")}
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <FormField
                label={t("jobs.fields.description")}
                name="description"
                type="textarea"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />

              <div className="flex justify-end space-x-4">
                <ActionButton onClick={handleCancel} variant="secondary" text={t("common.actions.cancel")} />
                <ActionButton
                  type="submit"
                  variant="primary"
                  text={isUpdating ? t("jobs.update.updating") : t("jobs.update.saveChanges")}
                  disabled={isUpdating}
                />
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p>
                <span className="font-bold">{t("jobs.fields.title")}:</span> {job.title}
              </p>
              <p>
                <span className="font-bold">{t("jobs.fields.payscale")}:</span> ₹{job.payscale}/day
              </p>
              <p>
                <span className="font-bold">{t("jobs.fields.requiredSkill")}:</span> {job.requiredSkill}
              </p>
              <p>
                <span className="font-bold">{t("jobs.fields.experience")}:</span> {job.experienceRequired}{" "}
                {t("jobs.fields.years")}
              </p>
              <p>
                <span className="font-bold">{t("jobs.fields.noOfWorkers")}:</span> {job.noOfWorkers}
              </p>
              <p>
                <span className="font-bold">{t("jobs.fields.duration")}:</span> {job.duration}
              </p>
              <p>
                <span className="font-bold">{t("jobs.fields.location")}:</span> {job.location}
              </p>
              <div>
                <span className="font-bold">{t("jobs.fields.description")}:</span>
                <p className="mt-1">{job.description}</p>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </Layout>
  )
}

export default SingleJobPost
