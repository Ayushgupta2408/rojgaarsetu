"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useGetOwnerDashboardQuery } from "../../redux/api/ownerApiSlice"

// Import reusable components
import StatusBadge from "../common/StatusBadge"
import ActionButton from "../common/ActionButton"
import EmptyState from "../common/EmptyState"
import LoadingSpinner from "../common/LoadingSpinner"
import ErrorMessage from "../common/ErrorMessage"

const OwnerDashboard = () => {
  const { t } = useTranslation()
  const { user } = useSelector((state) => state.auth)
  const { data, isLoading, isError } = useGetOwnerDashboardQuery()
  const [activeTab, setActiveTab] = useState("pending")

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorMessage translationKey="owner.dashboard.error.fetchData" />

  const vehicleApplications = data?.vehicleApplications || []
  const recommendedForms = data?.recommendedForms || []

  // Categorize applications
  const categorizedApplications = {
    pending: vehicleApplications.filter((app) => app.status === "pending"),
    accepted: vehicleApplications.filter((app) => app.status === "accepted"),
    rejected: vehicleApplications.filter((app) => app.status === "rejected"),
  }

  const tabs = ["pending", "accepted", "rejected"]

  return (
    <div className="min-h-screen mt-10 bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tabs for Application Status */}
          <div className="flex space-x-4 mb-6">
            {tabs.map((status) => (
              <button
                key={status}
                className={`py-2 px-4 rounded ${
                  activeTab === status ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab(status)}
              >
                {t(`owner.dashboard.tabs.${status}`)}
              </button>
            ))}
          </div>

          {/* Display Applications Based on Active Tab */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
            {categorizedApplications[activeTab].length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {categorizedApplications[activeTab].map((app) => (
                  <li key={app._id}>
                    <Link to={`/vehicle/application/${app._id}`} className="block px-4 py-4 sm:px-6 hover:bg-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-blue-600 truncate">{app.vehicleFormId.title}</h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {app.type} - {app.brand || t("common.notAvailable")}
                          </p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <p className="flex items-center text-sm text-gray-500">📍 {app.location}</p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          📅 {t("owner.dashboard.appliedOn")} {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState translationKey={`owner.dashboard.empty.${activeTab}`} />
            )}
          </div>

          {/* Recommended Forms */}
          <div className="space-y-4 mt-8">
            <h2 className="text-lg font-medium text-gray-900">{t("owner.dashboard.recommendedForms")}</h2>
            {recommendedForms.length > 0 ? (
              recommendedForms.map((form) => (
                <div
                  key={form._id}
                  className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{form.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{form.otherDetails}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>
                          🏷️ {t("owner.dashboard.brand")}: {form.brand}
                        </span>
                        <span>📍 {form.location}</span>
                        <span>
                          💰 ₹{form.payscale}/{t("common.perDay")}
                        </span>
                        <span>
                          🔢 {t("owner.dashboard.quantity")}: {form.quantity}
                        </span>
                        <span>📅 {new Date(form.purchaseDate).toLocaleDateString()}</span>
                        <span>🏢 {form.organization}</span>
                        <a
                          href={form.contractorProfileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          👤 {form.contractorId.name}
                        </a>
                      </div>
                    </div>
                    <Link to={`/vehicle/view/${form._id}`}>
                      <ActionButton variant="primary" translationKey="common.actions.viewDetails" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState translationKey="owner.dashboard.empty.noRecommendations" />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default OwnerDashboard
