import { useTranslation } from "react-i18next"

const StatusBadge = ({ status }) => {
  const { t } = useTranslation()

  const getStatusConfig = (status) => {
    const configs = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", key: "common.pending" },
      underreview: { bg: "bg-yellow-100", text: "text-yellow-800", key: "common.underReview" },
      approved: { bg: "bg-green-100", text: "text-green-800", key: "common.approved" },
      accepted: { bg: "bg-green-100", text: "text-green-800", key: "common.accepted" },
      rejected: { bg: "bg-red-100", text: "text-red-800", key: "common.rejected" },
      offerSent: { bg: "bg-blue-100", text: "text-blue-800", key: "common.offerReceived" },
      offerAccepted: { bg: "bg-green-100", text: "text-green-800", key: "common.offerAccepted" },
      default: { bg: "bg-gray-100", text: "text-gray-800", key: "common.unknown" },
    }

    return configs[status] || configs.default
  }

  const config = getStatusConfig(status)

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text}`}>
      {t(config.key)}
    </span>
  )
}

export default StatusBadge
