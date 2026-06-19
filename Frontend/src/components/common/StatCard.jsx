import { useTranslation } from "react-i18next"

const StatCard = ({ icon: Icon, title, value, bgColor = "bg-blue-500", translationKey }) => {
  const { t } = useTranslation()

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {translationKey ? t(translationKey) : title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value || 0}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
