import { useTranslation } from "react-i18next"

const EmptyState = ({ message, translationKey, actionButton }) => {
  const { t } = useTranslation()

  return (
    <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
      <p>{translationKey ? t(translationKey) : message}</p>
      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  )
}

export default EmptyState
