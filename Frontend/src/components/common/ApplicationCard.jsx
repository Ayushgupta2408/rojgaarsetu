"use client"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import StatusBadge from "./StatusBadge"
import ActionButton from "./ActionButton"

const ApplicationCard = ({
  application,
  type = "job", // 'job' or 'vehicle'
  linkTo,
  showActions = false,
  onAction,
}) => {
  const { t } = useTranslation()

  const renderJobApplication = () => (
    <>
      <h3 className="text-2xl font-semibold text-gray-800">{application.name}</h3>
      <div className="space-y-2 mt-3">
        <p className="text-gray-600">
          <strong>{t("common.status")}:</strong>
          <StatusBadge status={application.status} />
        </p>
        <p className="text-gray-600">
          <strong>{t("common.experience")}:</strong> {application.experience} {t("common.years")}
        </p>
        <p className="text-gray-600">
          <strong>{t("common.email")}:</strong> {application.email}
        </p>
        <p className="text-gray-600">
          <strong>{t("common.phone")}:</strong> {application.phone}
        </p>
        {application.profileLink && (
          <p className="text-gray-600">
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
        )}
      </div>
    </>
  )

  const renderVehicleApplication = () => (
    <>
      <h3 className="text-2xl font-semibold text-gray-800">{application.applicantId?.name || application.name}</h3>
      <div className="space-y-2 mt-3">
        <p className="text-gray-600">
          <strong>{t("common.status")}:</strong>
          <StatusBadge status={application.status} />
        </p>
        <p className="text-gray-600">
          <strong>{t("applications.vehicleType")}:</strong> {application.type}
        </p>
        <p className="text-gray-600">
          <strong>{t("applications.brand")}:</strong> {application.brand}
        </p>
        <p className="text-gray-600">
          <strong>{t("applications.model")}:</strong> {application.model}
        </p>
        {application.year && (
          <p className="text-gray-600">
            <strong>{t("applications.year")}:</strong> {application.year}
          </p>
        )}
        <p className="text-gray-600">
          <strong>{t("common.email")}:</strong> {application.applicantId?.email || application.email}
        </p>
        <p className="text-gray-600">
          <strong>{t("common.phone")}:</strong> {application.applicantId?.phone || application.phone}
        </p>
      </div>
    </>
  )

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      {type === "job" ? renderJobApplication() : renderVehicleApplication()}

      <div className="mt-4 flex gap-2">
        <Link
          to={linkTo}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {t("common.viewApplication")}
        </Link>

        {showActions && application.status === "pending" && (
          <>
            <ActionButton variant="success" onClick={() => onAction("accept")}>
              {t("common.accept")}
            </ActionButton>
            <ActionButton variant="danger" onClick={() => onAction("reject")}>
              {t("common.reject")}
            </ActionButton>
          </>
        )}
      </div>
    </div>
  )
}

export default ApplicationCard
