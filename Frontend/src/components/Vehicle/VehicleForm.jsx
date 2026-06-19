"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { useTranslation } from "react-i18next"
import Layout from "../Layout/Layout"
import { useCreateVehicleMutation } from "@/redux/api/contractorApiSlice"

const VehicleForm = () => {
  const { t } = useTranslation()
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
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const [createVehicle, { isLoading }] = useCreateVehicleMutation()

  const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Basic client‑side validation for required fields
    const required = ["title", "type", "payscale", "location"]
    const missing = required.filter((key) => !formData[key])
    if (missing.length) {
      return setError(t("vehicles.posting.validationError", { fields: missing.join(", ") }))
    }

    try {
      const payload = {
        ...formData,
        payscale: Number(formData.payscale),
        quantity: formData.quantity ? Number(formData.quantity) : undefined,
      }
      const res = await createVehicle(payload).unwrap()
      toast.success(res.message || t("vehicles.posting.success"))
      navigate("/dashboard")
    } catch (err) {
      const msg = err?.data?.message || t("vehicles.posting.error")
      setError(msg)
      toast.error(msg)
    }
  }

  return (
    <Layout>
      <motion.section
        className="min-h-screen flex items-center justify-center bg-[#E9F1FA] mt-8 py-12 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-extrabold text-black mb-6">{t("vehicles.posting.title")}</h2>

          {error && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Title */}
            <div className="md:flex">
              <label className="md:w-1/3 font-bold">
                {t("vehicles.fields.title")}
                <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={onChange}
                required
                className="md:w-2/3 ml-4 border rounded px-3 py-2 focus:border-blue-600"
                placeholder={t("vehicles.fields.titlePlaceholder")}
              />
            </div>

            {/* Type */}
            <div className="md:flex">
              <label className="md:w-1/3 font-bold">
                {t("vehicles.fields.type")}
                <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={onChange}
                required
                className="md:w-2/3 ml-4 border rounded px-3 py-2 focus:border-blue-600"
              >
                <option value="">{t("vehicles.fields.selectType")}</option>
                <option value="vehicle">{t("vehicles.types.vehicle")}</option>
                <option value="instrument">{t("vehicles.types.instrument")}</option>
              </select>
            </div>

            {/* Pay Scale */}
            <div className="md:flex">
              <label className="md:w-1/3 font-bold">
                {t("vehicles.fields.payscale")}
                <span className="text-red-500">*</span>
              </label>
              <input
                name="payscale"
                type="number"
                min="0"
                value={formData.payscale}
                onChange={onChange}
                required
                className="md:w-2/3 ml-4 border rounded px-3 py-2 focus:border-blue-600"
                placeholder={t("vehicles.fields.payscalePlaceholder")}
              />
            </div>

            {/* Brand */}
            <div className="md:flex">
              <label className="md:w-1/3 font-bold">{t("vehicles.fields.brand")}</label>
              <input
                name="brand"
                value={formData.brand}
                onChange={onChange}
                className="md:w-2/3 ml-4 border rounded px-3 py-2 focus:border-blue-600"
                placeholder={t("vehicles.fields.brandPlaceholder")}
              />
            </div>

            {/* Quantity */}
            <div className="md:flex">
              <label className="md:w-1/3 font-bold">{t("vehicles.fields.quantity")}</label>
              <input
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={onChange}
                className="md:w-2/3 ml-4 border rounded px-3 py-2 focus:border-blue-600"
                placeholder={t("vehicles.fields.quantityPlaceholder")}
              />
            </div>

            {/* Purchase Date */}
            <div className="md:flex">
              <label className="md:w-1/3 font-bold">{t("vehicles.fields.purchaseDate")}</label>
              <input
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={onChange}
                className="md:w-2/3 ml-4 border rounded px-3 py-2 focus:border-blue-600"
              />
            </div>

            {/* Location */}
            <div className="md:flex">
              <label className="md:w-1/3 font-bold">
                {t("vehicles.fields.location")}
                <span className="text-red-500">*</span>
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={onChange}
                required
                className="md:w-2/3 ml-4 border rounded px-3 py-2 focus:border-blue-600"
                placeholder={t("vehicles.fields.locationPlaceholder")}
              />
            </div>

            {/* Organization */}
            <div className="md:flex">
              <label className="md:w-1/3 font-bold">{t("vehicles.fields.organization")}</label>
              <input
                name="organization"
                value={formData.organization}
                onChange={onChange}
                className="md:w-2/3 ml-4 border rounded px-3 py-2 focus:border-blue-600"
                placeholder={t("vehicles.fields.organizationPlaceholder")}
              />
            </div>

            {/* Other Details */}
            <div className="md:flex">
              <label className="md:w-1/3 font-bold">{t("vehicles.fields.otherDetails")}</label>
              <textarea
                name="otherDetails"
                value={formData.otherDetails}
                onChange={onChange}
                rows="3"
                className="md:w-2/3 ml-4 border rounded px-3 py-2 focus:border-blue-600"
                placeholder={t("vehicles.fields.otherDetailsPlaceholder")}
              />
            </div>

            {/* Submit */}
            <div className="text-right">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 text-white px-6 py-2 rounded shadow font-bold hover:bg-blue-700 transition"
              >
                {isLoading ? t("vehicles.posting.posting") : t("vehicles.posting.submit")}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.section>
    </Layout>
  )
}

export default VehicleForm
