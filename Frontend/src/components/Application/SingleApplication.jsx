"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "react-hot-toast"
import { useProcessJobApplicationMutation, useGetSingleApplicationQuery } from "@/redux/api/contractorApiSlice"
import LoadingSpinner from "../common/LoadingSpinner"
import ErrorMessage from "../common/ErrorMessage"
import FormField from "../common/FormField"
import ActionButton from "../common/ActionButton"

function SingleApplication() {
  const { t } = useTranslation()
  const { applicationId } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, error } = useGetSingleApplicationQuery(applicationId)
  const application = data?.application || {}

  const [processJobApplication] = useProcessJobApplicationMutation()
  const [feedback, setFeedback] = useState("")

  const handleAction = async (action) => {
    try {
      if (!action) {
        console.error("Action is required")
        return
      }

      const data = { action, feedback }
      await processJobApplication({ applicationId, data }).unwrap()
      toast.success(t("applications.actionSuccess", { action: t(`common.${action}`) }))
      navigate(`/job/applications`)
    } catch (err) {
      console.error("Error processing application:", err)
      toast.error(t("applications.actionError"))
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error.message} />

  return (
    <div className="max-w-2xl mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("applications.applicationDetails")}</h1>

      <div className="space-y-3">
        <p className="text-gray-700">
          <strong>{t("common.name")}:</strong> {application.name}
        </p>
        <p className="text-gray-700">
          <strong>{t("common.experience")}:</strong> {application.experience} {t("common.years")}
        </p>
        <p className="text-gray-700">
          <strong>{t("common.email")}:</strong> {application.email}
        </p>
        <p className="text-gray-700">
          <strong>{t("common.status")}:</strong> {t(`common.${application.status}`)}
        </p>
        <p className="text-gray-700">
          <strong>{t("applications.appliedAt")}:</strong> {new Date(application.appliedAt).toLocaleDateString()}
        </p>
        <p className="text-gray-700">
          <strong>{t("applications.profileLink")}:</strong>{" "}
          <a
            href={application.profileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {t("applications.viewProfile")}
          </a>
        </p>
      </div>

      {application.status === "rejected" && (
        <div className="mt-4">
          <FormField
            label={t("applications.feedbackForRejection")}
            name="feedback"
            type="textarea"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t("applications.feedbackPlaceholder")}
          />
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        {application.status !== "rejected" && (
          <ActionButton variant="danger" onClick={() => handleAction("reject")}>
            {t("common.reject")}
          </ActionButton>
        )}
        {application.status === "underreview" && (
          <ActionButton variant="success" onClick={() => handleAction("sendOffer")}>
            {t("applications.sendOffer")}
          </ActionButton>
        )}
      </div>
    </div>
  )
}

export default SingleApplication
