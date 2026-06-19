"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { toast } from "react-hot-toast"
import { useProcessVehicleApplicationMutation } from "@/redux/api/contractorApiSlice"
import { useGetVehicleApplicationByIdQuery } from "@/redux/api/vehicleApiSlice"
import LoadingSpinner from "../common/LoadingSpinner"
import ErrorMessage from "../common/ErrorMessage"
import FormField from "../common/FormField"
import ActionButton from "../common/ActionButton"

function SingleVehicleApplication() {
  const { t } = useTranslation()
  const { applicationId } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, error } = useGetVehicleApplicationByIdQuery(applicationId)
  const application = data?.application || {}
  const applicant = application.applicantId || {}

  const { userType } = useSelector((state) => state.auth)
  const [processVehicleApplication] = useProcessVehicleApplicationMutation()
  const [feedback, setFeedback] = useState("")

  const handleAction = async (action) => {
    if (!action) return

    try {
      await processVehicleApplication({
        applicationId,
        data: { action, feedback },
      }).unwrap()

      toast.success(t("applications.actionSuccess", { action: t(`common.${action}`) }))
      navigate("/vehicle/applications")
    } catch (err) {
      console.error("Processing error:", err)
      toast.error(t("applications.actionError"))
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error.message} />

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{t("applications.vehicleApplication")}</h1>

      <section className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">{t("applications.applicantInformation")}</h2>
          <div className="space-y-2">
            <p>
              <strong>{t("common.name")}:</strong> {applicant.name}
            </p>
            <p>
              <strong>{t("common.email")}:</strong> {applicant.email}
            </p>
            <p>
              <strong>{t("common.phone")}:</strong> {applicant.phone}
            </p>
            <p>
              <strong>{t("common.status")}:</strong> {t(`common.${application.status}`)}
            </p>
            <p>
              <strong>{t("applications.appliedAt")}:</strong> {new Date(application.appliedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">{t("applications.vehicleDetails")}</h2>
          <div className="space-y-2">
            <p>
              <strong>{t("applications.type")}:</strong> {application.type}
            </p>
            <p>
              <strong>{t("applications.brand")}:</strong> {application.brand}
            </p>
            <p>
              <strong>{t("applications.quantity")}:</strong> {application.quantity}
            </p>
            <p>
              <strong>{t("common.location")}:</strong> {application.location}
            </p>
            <p>
              <strong>{t("applications.organization")}:</strong> {application.vehicleFormId?.organization}
            </p>
            <p>
              <strong>{t("applications.purchaseDate")}:</strong>{" "}
              {new Date(application.purchaseDate).toLocaleDateString()}
            </p>
            <p>
              <strong>{t("applications.otherDetails")}:</strong> {application.vehicleFormId?.otherDetails}
            </p>
          </div>
        </div>
      </section>

      {application.pictures && application.pictures.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">{t("applications.vehiclePictures")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {application.pictures.map((pic, index) => (
              <img
                key={index}
                src={pic || "/placeholder.svg"}
                alt={t("applications.vehicleImageAlt", { number: index + 1 })}
                className="w-full h-32 object-cover rounded-md shadow-sm hover:scale-105 transition"
              />
            ))}
          </div>
        </div>
      )}

      {userType === "Contractor" && application.status === "pending" && (
        <div className="mt-6">
          <FormField
            label={t("applications.feedbackForRejection")}
            name="feedback"
            type="textarea"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t("applications.feedbackOptional")}
          />
        </div>
      )}

      {userType === "Owner" && application.status === "rejected" && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">{t("applications.feedback")}</h2>
          <p className="text-gray-600">{application.feedback || t("applications.noFeedbackProvided")}</p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        {userType === "Contractor" && application.status === "pending" && (
          <>
            <ActionButton variant="success" onClick={() => handleAction("accept")}>
              {t("common.accept")}
            </ActionButton>
            <ActionButton variant="danger" onClick={() => handleAction("reject")}>
              {t("common.reject")}
            </ActionButton>
          </>
        )}
        <ActionButton variant="secondary" onClick={() => navigate(-1)}>
          {t("common.back")}
        </ActionButton>
      </div>
    </div>
  )
}

export default SingleVehicleApplication
