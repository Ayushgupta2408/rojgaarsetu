"use client"

import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useGetRecommendationsQuery } from "../../redux/api/recommendationApiSlice"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { AlertCircle, Briefcase, HardHat, Truck } from "lucide-react"

const RecommendationList = () => {
  const { t } = useTranslation()
  const { userType } = useSelector((state) => state.auth)
  const { data, isLoading, isError, refetch } = useGetRecommendationsQuery()

  useEffect(() => {
    refetch()
  }, [refetch])

  const getRecommendationIcon = () => {
    switch (userType) {
      case "Worker":
        return <Briefcase className="h-6 w-6 text-blue-600" />
      case "Contractor":
        return <HardHat className="h-6 w-6 text-green-600" />
      case "Owner":
        return <Truck className="h-6 w-6 text-orange-600" />
      default:
        return <Briefcase className="h-6 w-6 text-blue-600" />
    }
  }

  const getRouteForItem = (item) => {
    switch (userType) {
      case "Worker":
        return `/job/view/${item._id}`
      case "Contractor":
        return `/worker/profile/${item._id}`
      case "Owner":
        return `/vehicle/view/${item._id}`
      default:
        return "/"
    }
  }

  const renderRecommendationItem = (item) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title || item.name || item.vehicleName}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {item.description || item.pastExperience || item.vehicleType}
          </p>
          <div className="flex items-center space-x-4 text-sm">
            {item.location && <span className="flex items-center text-gray-500">📍 {item.location}</span>}
            {item.payscale && (
              <span className="flex items-center text-green-600">
                ₹{item.payscale}/{t("common.day")}
              </span>
            )}
            {item.rating && <span className="flex items-center text-yellow-600">⭐ {item.rating}/5</span>}
          </div>
        </div>
        <Link
          to={getRouteForItem(item)}
          className="ml-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
        >
          {t("common.actions.viewDetails")}
        </Link>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-6" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{t("recommendations.errors.loadFailed")}</span>
          </div>
        </div>
      </div>
    )
  }

  const getRecommendationTitle = () => {
    switch (userType) {
      case "Worker":
        return t("recommendations.titles.jobRecommendations")
      case "Contractor":
        return t("recommendations.titles.workerRecommendations")
      case "Owner":
        return t("recommendations.titles.vehicleRecommendations")
      default:
        return t("recommendations.titles.recommendations")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-10 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-xl rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-xl">{getRecommendationIcon()}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getRecommendationTitle()}</h1>
                <p className="text-gray-600 mt-1">{t("recommendations.subtitle")}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {data?.recommendations?.length > 0 ? (
              data.recommendations.map((item) => <div key={item._id}>{renderRecommendationItem(item)}</div>)
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">{t("recommendations.noRecommendations")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendationList
