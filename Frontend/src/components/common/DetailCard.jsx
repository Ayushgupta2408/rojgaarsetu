import { useTranslation } from "react-i18next"

const DetailCard = ({ title, data, type = "job" }) => {
  const { t } = useTranslation()

  const renderJobDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <p className="font-medium">{t("common.location")}:</p>
        <p className="text-gray-700">{data.location}</p>
      </div>
      <div>
        <p className="font-medium">{t("common.payscale")}:</p>
        <p className="text-gray-700">
          ₹{data.payscale}/{t("common.day")}
        </p>
      </div>
      <div>
        <p className="font-medium">{t("common.duration")}:</p>
        <p className="text-gray-700">{data.duration}</p>
      </div>
      <div>
        <p className="font-medium">{t("applications.requiredSkills")}:</p>
        <p className="text-gray-700">{data.requiredSkill}</p>
      </div>
      <div>
        <p className="font-medium">{t("applications.experienceRequired")}:</p>
        <p className="text-gray-700">
          {data.experienceRequired} {t("common.years")}
        </p>
      </div>
    </div>
  )

  const renderVehicleDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <p className="font-medium">{t("common.location")}:</p>
        <p className="text-gray-700">{data.location}</p>
      </div>
      <div>
        <p className="font-medium">{t("common.payscale")}:</p>
        <p className="text-gray-700">
          ₹{data.payscale}/{t("common.day")}
        </p>
      </div>
      <div>
        <p className="font-medium">{t("common.duration")}:</p>
        <p className="text-gray-700">{data.duration}</p>
      </div>
      <div>
        <p className="font-medium">{t("applications.vehicleType")}:</p>
        <p className="text-gray-700">{data.vehicleType}</p>
      </div>
      <div>
        <p className="font-medium">{t("applications.requirements")}:</p>
        <p className="text-gray-700">{data.requirements}</p>
      </div>
    </div>
  )

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {type === "job" ? renderJobDetails() : renderVehicleDetails()}
    </div>
  )
}

export default DetailCard
