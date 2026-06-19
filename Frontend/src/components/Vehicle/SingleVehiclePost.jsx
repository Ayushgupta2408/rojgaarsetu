"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useUpdateVehicleMutation, useDeleteVehicleMutation } from "@/redux/api/contractorApiSlice"
import { useGetVehicleByIdQuery } from "@/redux/api/vehicleApiSlice"
import { useSelector } from "react-redux"
import Layout from "../Layout/Layout"
import DeleteConfirmationModal from "../DeleteConfirmationModal"

const SingleVehiclePost = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: vehicleData, isLoading, isError } = useGetVehicleByIdQuery(id)
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation()
  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation()

  const { user, userType } = useSelector((state) => state.auth)

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    payscale: "",
    brand: "",
    quantity: "",
    purchaseDate: "",
    location: "",
    organization: "",
    otherDetails: "",
  })

  useEffect(() => {
    if (vehicleData?.vehicleForm) {
      const v = vehicleData.vehicleForm
      setFormData({
        title: v.title || "",
        type: v.type || "",
        payscale: v.payscale || "",
        brand: v.brand || "",
        quantity: v.quantity || "",
        purchaseDate: v.purchaseDate?.split("T")[0] || "",
        location: v.location || "",
        organization: v.organization || "",
        otherDetails: v.otherDetails || "",
      })
    }
  }, [vehicleData])

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleEdit = () => setIsEditing(true)

  const handleCancel = () => {
    if (vehicleData?.vehicleForm) {
      const v = vehicleData.vehicleForm
      setFormData({
        title: v.title,
        type: v.type,
        payscale: v.payscale,
        brand: v.brand,
        quantity: v.quantity,
        purchaseDate: v.purchaseDate?.split("T")[0],
        location: v.location,
        organization: v.organization,
        otherDetails: v.otherDetails,
      })
    }
    setIsEditing(false)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await updateVehicle({ id, ...formData }).unwrap()
      toast.success(t("vehicles.update.success"))
      setIsEditing(false)
    } catch (err) {
      toast.error(err?.data?.message || t("vehicles.update.error"))
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteVehicle(id).unwrap()
      toast.success(t("vehicles.delete.success"))
      navigate("/contractor/dashboard")
    } catch (err) {
      toast.error(err?.data?.message || t("vehicles.delete.error"))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isError || !vehicleData?.vehicleForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center text-red-600">
            <p>{t("vehicles.errors.notFound")}</p>
            <Link to="/contractor/dashboard" className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
              {t("common.actions.goBack")}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const vehicle = vehicleData.vehicleForm

  return (
    <Layout>
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}

      <motion.section
        className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-black">{t("vehicles.details.title")}</h2>
            {!isEditing && (
              <div className="space-x-2">
                {userType === "Contractor" && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      {t("common.actions.edit")}
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      {t("common.actions.delete")}
                    </button>
                  </>
                )}
                {userType === "Owner" && (
                  <button
                    onClick={() => navigate(`/vehicle/apply/${vehicle._id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    {t("common.actions.apply")}
                  </button>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              {[
                { name: "title", label: t("vehicles.fields.title") },
                { name: "type", label: t("vehicles.fields.type") },
                { name: "payscale", label: t("vehicles.fields.payscale"), type: "number" },
                { name: "brand", label: t("vehicles.fields.brand") },
                { name: "quantity", label: t("vehicles.fields.quantity"), type: "number" },
                { name: "purchaseDate", label: t("vehicles.fields.purchaseDate"), type: "date" },
                { name: "location", label: t("vehicles.fields.location") },
                { name: "organization", label: t("vehicles.fields.organization") },
              ].map(({ name, label, type = "text" }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-black font-bold mb-2">
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    required
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-600"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="otherDetails" className="block text-black font-bold mb-2">
                  {t("vehicles.fields.otherDetails")}
                </label>
                <textarea
                  id="otherDetails"
                  name="otherDetails"
                  rows="4"
                  required
                  value={formData.otherDetails}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={handleCancel} className="px-5 py-2 border rounded">
                  {t("common.actions.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isUpdating ? t("vehicles.update.updating") : t("vehicles.update.saveChanges")}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p>
                <span className="font-bold">{t("vehicles.fields.title")}:</span> {vehicle.title}
              </p>
              <p>
                <span className="font-bold">{t("vehicles.fields.type")}:</span> {vehicle.type}
              </p>
              <p>
                <span className="font-bold">{t("vehicles.fields.payscale")}:</span> ₹{vehicle.payscale}/
                {t("common.day")}
              </p>
              <p>
                <span className="font-bold">{t("vehicles.fields.brand")}:</span> {vehicle.brand}
              </p>
              <p>
                <span className="font-bold">{t("vehicles.fields.quantity")}:</span> {vehicle.quantity}
              </p>
              <p>
                <span className="font-bold">{t("vehicles.fields.purchaseDate")}:</span>{" "}
                {vehicle.purchaseDate?.split("T")[0]}
              </p>
              <p>
                <span className="font-bold">{t("vehicles.fields.location")}:</span> {vehicle.location}
              </p>
              <p>
                <span className="font-bold">{t("vehicles.fields.organization")}:</span> {vehicle.organization}
              </p>
              <div>
                <span className="font-bold">{t("vehicles.fields.otherDetails")}:</span>
                <p className="mt-1">{vehicle.otherDetails}</p>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </Layout>
  )
}

export default SingleVehiclePost
