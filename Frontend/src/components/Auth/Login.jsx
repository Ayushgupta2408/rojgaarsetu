"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import Layout from "../Layout/Layout"
import { useLoginMutation } from "@/redux/api/authApiSlice"
import { setCredentials } from "@/redux/slices/authSlice"
import FormField from "../common/FormField"
import SubmitButton from "../common/SubmitButton"
import ErrorMessage from "../common/ErrorMessage"

const Login = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { email, password } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await login({ email, password }).unwrap()
      dispatch(
        setCredentials({
          user: res.user,
          userType: res.user.userType,
          token: res.token,
        }),
      )
      toast.success(t("auth.loginSuccess"))
      navigate("/dashboard")
    } catch (err) {
      const msg = err?.data?.message || t("auth.loginFailed")
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

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
            <h2 className="text-3xl font-extrabold text-black mb-1">{t("auth.signInToAccount")}</h2>
            <p className="text-sm text-gray-600">
              {t("auth.or")}{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                {t("auth.createNewAccount")}
              </Link>
            </p>
          </div>

          <ErrorMessage error={error} />

          <form onSubmit={onSubmit} className="w-full">
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
              label={t("auth.password")}
              name="password"
              type="password"
              placeholder="********"
              required
              value={password}
              onChange={onChange}
            />

            <div className="md:flex">
              <div className="md:w-1/3"></div>
              <div className="md:w-2/3">
                <SubmitButton loading={loading} loadingText={t("auth.signingIn")} className="w-full">
                  {t("auth.signIn")}
                </SubmitButton>
              </div>
            </div>
          </form>
        </div>
      </motion.section>
    </Layout>
  )
}

export default Login
