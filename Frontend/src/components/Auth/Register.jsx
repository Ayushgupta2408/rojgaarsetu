"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import Layout from "../Layout/Layout"
import { useRegisterMutation } from "@/redux/api/authApiSlice"
import FormField from "../common/FormField"
import SubmitButton from "../common/SubmitButton"
import ErrorMessage from "../common/ErrorMessage"

const Register = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "Worker",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { name, email, phone, password, confirmPassword, userType } = formData
  const [register] = useRegisterMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"))
      return
    }

    setLoading(true)
    setError("")
    try {
      const data = await register({ name, email, phone, password, userType }).unwrap()
      const userId = data?.user?.id
      toast.success(t("auth.registrationSuccess"))
      navigate("/verify-otp", { state: { userId } })
    } catch (err) {
      const msg = err?.data?.message || t("auth.registrationFailed")
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const userTypeOptions = [
    { value: "Worker", label: t("auth.worker") },
    { value: "Contractor", label: t("auth.contractor") },
    { value: "Owner", label: t("auth.owner") },
  ]

  return (
    <Layout>
      <motion.section
        className="min-h-screen flex items-center justify-center bg-[#E9F1FA] py-12 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-black mb-1">{t("auth.createAccount")}</h2>
            <p className="text-sm text-gray-600">
              {t("auth.or")}{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                {t("auth.signInExisting")}
              </Link>
            </p>
          </div>

          <ErrorMessage error={error} />

          <form onSubmit={onSubmit} className="w-full">
            <FormField
              label={t("auth.fullName")}
              name="name"
              type="text"
              placeholder={t("auth.fullNamePlaceholder")}
              required
              value={name}
              onChange={onChange}
            />

            <FormField
              label={t("auth.email")}
              name="email"
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              required
              value={email}
              onChange={onChange}
            />

            <FormField
              label={t("auth.phone")}
              name="phone"
              type="tel"
              placeholder={t("auth.phonePlaceholder")}
              required
              value={phone}
              onChange={onChange}
            />

            <FormField
              label={t("auth.password")}
              name="password"
              type="password"
              placeholder="********"
              required
              value={password}
              onChange={onChange}
            />

            <FormField
              label={t("auth.confirmPassword")}
              name="confirmPassword"
              type="password"
              placeholder={t("auth.confirmPasswordPlaceholder")}
              required
              value={confirmPassword}
              onChange={onChange}
            />

            <FormField
              label={t("auth.registerAs")}
              name="userType"
              type="radio"
              value={userType}
              onChange={onChange}
              options={userTypeOptions}
            />

            <div className="md:flex">
              <div className="md:w-1/3" />
              <div className="md:w-2/3">
                <SubmitButton loading={loading} loadingText={t("auth.registering")} className="w-full">
                  {t("auth.register")}
                </SubmitButton>
              </div>
            </div>
          </form>
        </div>
      </motion.section>
    </Layout>
  )
}

export default Register
