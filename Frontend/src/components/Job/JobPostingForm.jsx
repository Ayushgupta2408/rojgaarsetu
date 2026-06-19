"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { useTranslation } from "react-i18next"
import Layout from "../Layout/Layout"
import { useCreateJobMutation } from "@/redux/api/contractorApiSlice"
import FormField from "../common/FormField"
import SubmitButton from "../common/SubmitButton"
import ErrorMessage from "../common/ErrorMessage"

const JobPostingForm = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [createJob, { isLoading }] = useCreateJobMutation()

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { title, payscale, requiredSkill, experienceRequired, noOfWorkers, duration, location, description } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await createJob(formData).unwrap()
      toast.success(t("jobs.posting.success"))
      navigate("/contractor/dashboard")
    } catch (err) {
      const msg = err.response?.data?.message || t("jobs.posting.error")
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <motion.section
        className="min-h-screen flex items-center justify-center bg-[#E9F1FA] py-12 mt-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-lg md:max-w-4xl bg-white p-8 my-4 rounded-lg shadow-lg">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-black mb-1">{t("jobs.posting.title")}</h2>
            <p className="text-sm text-gray-600">{t("jobs.posting.subtitle")}</p>
          </div>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={onSubmit} className="w-full">
            <FormField
              label={t("jobs.fields.jobTitle")}
              name="title"
              type="text"
              placeholder={t("jobs.fields.jobTitlePlaceholder")}
              value={title}
              onChange={onChange}
              required
            />

            <div className="mb-6 grid grid-cols-2 gap-4">
              <FormField
                label={t("jobs.fields.payscale")}
                name="payscale"
                type="number"
                placeholder={t("jobs.fields.payscalePlaceholder")}
                value={payscale}
                onChange={onChange}
                required
              />
              <FormField
                label={t("jobs.fields.requiredSkill")}
                name="requiredSkill"
                type="text"
                placeholder={t("jobs.fields.requiredSkillPlaceholder")}
                value={requiredSkill}
                onChange={onChange}
                required
              />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <FormField
                label={t("jobs.fields.experience")}
                name="experienceRequired"
                type="number"
                placeholder={t("jobs.fields.experiencePlaceholder")}
                value={experienceRequired}
                onChange={onChange}
                required
              />
              <FormField
                label={t("jobs.fields.noOfWorkers")}
                name="noOfWorkers"
                type="number"
                placeholder={t("jobs.fields.noOfWorkersPlaceholder")}
                value={noOfWorkers}
                onChange={onChange}
                required
              />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <FormField
                label={t("jobs.fields.duration")}
                name="duration"
                type="number"
                placeholder={t("jobs.fields.durationPlaceholder")}
                value={duration}
                onChange={onChange}
                required
              />
              <FormField
                label={t("jobs.fields.location")}
                name="location"
                type="text"
                placeholder={t("jobs.fields.locationPlaceholder")}
                value={location}
                onChange={onChange}
                required
              />
            </div>

            <FormField
              label={t("jobs.fields.description")}
              name="description"
              type="textarea"
              placeholder={t("jobs.fields.descriptionPlaceholder")}
              value={description}
              onChange={onChange}
              rows={4}
              required
            />

            <div className="flex justify-end">
              <Link to="/contractor/dashboard" className="text-lg mt-2 text-blue-600 hover:text-red-600 mr-4">
                {t("common.actions.cancel")}
              </Link>
              <SubmitButton
                isLoading={loading}
                loadingText={t("jobs.posting.posting")}
                text={t("jobs.posting.postJob")}
              />
            </div>
          </form>
        </div>
      </motion.section>
    </Layout>
  )
}

export default JobPostingForm
