"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useGetAllVehiclesQuery } from "../../redux/api/vehicleApiSlice"
import { Truck, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

const AllVehicles = () => {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = useGetAllVehiclesQuery()
  const [searchTerm, setSearchTerm] = useState("")
  const [minPrice, setMinPrice] = useState("")

  const filterVehicles = () => {
    const vehicles = data?.vehicleForms || []

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(searchTerm.toLowerCase())

      const meetsPrice = minPrice === "" || vehicle.payscale >= Number.parseInt(minPrice)

      return matchesSearch && meetsPrice
    })
  }

  const filteredVehicles = filterVehicles()

  return (
    <div className="min-h-screen mt-10 bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t("vehicles.browse.title")}</h1>
              <p className="text-gray-600 mt-1">{t("vehicles.browse.subtitle")}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder={t("vehicles.browse.filters.searchPlaceholder")}
              className="border border-gray-300 rounded px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="number"
              placeholder={t("vehicles.browse.filters.minPricePlaceholder")}
              className="border border-gray-300 rounded px-4 py-2"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          {/* Refresh Button */}
          <button onClick={refetch} className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {t("vehicles.browse.refreshVehicles")}
          </button>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">{t("vehicles.browse.errors.loadFailed")}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{vehicle.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{vehicle.otherDetails}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>
                            🏷️ {t("vehicles.fields.brand")}: {vehicle.brand}
                          </span>
                          <span>📍 {vehicle.location}</span>
                          <span>
                            💰 ₹{vehicle.payscale}/{t("common.day")}
                          </span>
                          <span>
                            🔢 {t("vehicles.fields.quantity")}: {vehicle.quantity}
                          </span>
                          <span>📅 {new Date(vehicle.purchaseDate).toLocaleDateString()}</span>
                          <span>🏢 {vehicle.organization}</span>
                        </div>
                      </div>
                      <Link
                        to={`/vehicle/view/${vehicle._id}`}
                        className="ml-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      >
                        {t("common.actions.viewDetails")}
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-12">{t("vehicles.browse.noVehiclesFound")}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllVehicles
