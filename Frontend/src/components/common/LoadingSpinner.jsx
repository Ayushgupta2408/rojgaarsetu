import { useTranslation } from "react-i18next"

const LoadingSpinner = ({ translationKey = "common.loading" }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">{t(translationKey)}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
