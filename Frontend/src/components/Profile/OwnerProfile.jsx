"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import {
  useGetProfileQuery,
  useCompleteProfileMutation,
  useUploadProfileImageMutation,
} from "@/redux/api/profileApiSlice"
import { Edit, Eye, Upload, User, X } from "lucide-react"
import { useTranslation } from "react-i18next"

const OwnerProfile = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { data: profileData, isLoading, error: fetchError, refetch } = useGetProfileQuery()
  const [uploadProfileImage] = useUploadProfileImageMutation()
  const [completeProfile, { isLoading: isUpdating }] = useCompleteProfileMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
    location: "",
    organization: "",
    role: "",
    vehicleTypes: [],
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      bankName: "",
    },
  })

  const [previewImage, setPreviewImage] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (profileData?.profile) {
      const ownerProfile = profileData.profile
      setFormData({
        name: ownerProfile.name || "",
        email: ownerProfile.email || "",
        phone: ownerProfile.phone || "",
        image: ownerProfile.image || null,
        location: ownerProfile.location || "",
        organization: ownerProfile.organization || "",
        role: ownerProfile.role || "",
        vehicleTypes: ownerProfile.vehicleTypes || ownerProfile.availableVehicles || [],
        bankDetails: ownerProfile.bankDetails || {
          accountNumber: "",
          ifscCode: "",
          accountHolderName: "",
          bankName: "",
        },
      })
      if (ownerProfile.image) {
        setPreviewImage(ownerProfile.image)
      }
    }
  }, [profileData])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onBankDetailsChange = (e) => {
    setFormData({
      ...formData,
      bankDetails: { ...formData.bankDetails, [e.target.name]: e.target.value },
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)

    setUploadingImage(true)
    try {
      const formDataObj = new FormData()
      formDataObj.append("image", file)

      const response = await uploadProfileImage(formDataObj).unwrap()

      setFormData((prevState) => ({
        ...prevState,
        image: response.imageUrl,
      }))
      setSuccess(t("profile.imageUploadSuccess"))
    } catch (err) {
      setError(t("profile.imageUploadError"))
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddVehicle = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const vehicleData = {
      vehicleName: formData.get("vehicleName"),
      model: formData.get("model"),
      capacity: formData.get("capacity"),
    }

    setFormData((prev) => ({
      ...prev,
      vehicleTypes: [...prev.vehicleTypes, vehicleData],
    }))
    form.reset()
  }

  const handleRemoveVehicle = (index) => {
    setFormData((prev) => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.filter((_, i) => i !== index),
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const response = await completeProfile({
        ...formData,
        availableVehicles: formData.vehicleTypes.map((vehicle) => ({
          vehicleName: vehicle.vehicleName,
          model: vehicle.model,
          capacity: vehicle.capacity,
        })),
      }).unwrap()

      setSuccess(t("profile.updateSuccess"))
      setIsEditing(false)
      refetch()
    } catch (err) {
      setError(err.data?.message || t("profile.updateError"))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {t("profile.errorLoading")}: {fetchError.message}
      </div>
    )
  }

  const profileCompletion = profileData?.profile?.profileCompletion || 0

  return (
    <div className="min-h-screen mt-10 bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-xl rounded-2xl">
          {/* Header Section */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-t-2xl">
            <div>
              <h1 className="text-2xl font-bold text-white">{formData.organization || t("profile.owner.title")}</h1>
              <p className="mt-1 text-sm text-blue-100">{formData.role}</p>
            </div>

            <button
              className="inline-flex items-center px-3 py-1.5 bg-white text-xs font-medium rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Eye className="h-3.5 w-3.5 mr-1" /> {t("profile.viewMode")}
                </>
              ) : (
                <>
                  <Edit className="h-3.5 w-3.5 mr-1" /> {t("profile.editProfile")}
                </>
              )}
            </button>
          </div>

          {/* Profile Form */}
          <form onSubmit={onSubmit} className="space-y-6 p-6">
            {/* Personal Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 mx-auto">
                  {previewImage ? (
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt={t("profile.profileImageAlt")}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-full h-full text-gray-300 p-8" />
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm cursor-pointer">
                      <Upload className="h-5 w-5 text-blue-600" />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t("profile.fields.fullName")}</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t("profile.fields.email")}</label>
                    <p className="mt-1 text-gray-900">{formData.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t("profile.fields.phone")}</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t("profile.fields.location")}</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={onChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.location}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("profile.fields.organization")}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={onChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.organization}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t("profile.fields.role")}</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={onChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.role}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicles Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">{t("profile.vehicles.availableVehicles")}</h3>
              <div className="space-y-4">
                {formData.vehicleTypes.map((vehicle, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder={t("profile.vehicles.vehicleName")}
                          value={vehicle.vehicleName}
                          onChange={(e) => {
                            const newVehicles = [...formData.vehicleTypes]
                            newVehicles[index].vehicleName = e.target.value
                            setFormData({
                              ...formData,
                              vehicleTypes: newVehicles,
                            })
                          }}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder={t("profile.vehicles.model")}
                          value={vehicle.model}
                          onChange={(e) => {
                            const newVehicles = [...formData.vehicleTypes]
                            newVehicles[index].model = e.target.value
                            setFormData({
                              ...formData,
                              vehicleTypes: newVehicles,
                            })
                          }}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={t("profile.vehicles.capacity")}
                            value={vehicle.capacity}
                            onChange={(e) => {
                              const newVehicles = [...formData.vehicleTypes]
                              newVehicles[index].capacity = e.target.value
                              setFormData({
                                ...formData,
                                vehicleTypes: newVehicles,
                              })
                            }}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveVehicle(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{vehicle.vehicleName}</h4>
                          {vehicle.model && (
                            <p className="text-sm text-gray-500">
                              {t("profile.vehicles.model")}: {vehicle.model}
                            </p>
                          )}
                          {vehicle.capacity && (
                            <p className="text-sm text-gray-500">
                              {t("profile.vehicles.capacity")}: {vehicle.capacity}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <form onSubmit={handleAddVehicle} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input
                        name="vehicleName"
                        placeholder={t("profile.vehicles.vehicleName")}
                        required
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <input
                        name="model"
                        placeholder={t("profile.vehicles.model")}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <input
                        name="capacity"
                        placeholder={t("profile.vehicles.capacity")}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        {t("profile.vehicles.addVehicle")}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Form Actions */}
            {isEditing && (
              <div className="border-t pt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {t("common.actions.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? t("profile.saving") : t("profile.saveChanges")}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default OwnerProfile
