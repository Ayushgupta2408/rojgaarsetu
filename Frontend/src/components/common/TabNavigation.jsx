"use client"

import { useTranslation } from "react-i18next"

const TabNavigation = ({ tabs, activeTab, onTabChange, translationPrefix }) => {
  const { t } = useTranslation()

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`w-1/${tabs.length} py-4 px-1 text-center text-sm font-medium border-b-2 ${
              activeTab === tab
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => onTabChange(tab)}
          >
            {t(`${translationPrefix}.${tab}`)}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default TabNavigation
