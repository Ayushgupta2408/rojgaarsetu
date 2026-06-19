"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { useVerifyOtpMutation, useResendOtpMutation } from "@/redux/api/authApiSlice"
import FormField from "../common/FormField"
import SubmitButton from "../common/SubmitButton"
import ErrorMessage from "../common/ErrorMessage"

const OTPVerification = () => {
  const { t } = useTranslation()
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(60)
  const timerRef = useRef(null)

  const navigate = useNavigate()
  const location = useLocation()

  const userId = location.state?.userId
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation()

  useEffect(() => {
    if (!userId) {
      navigate("/login")
      return
    }

    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [userId, navigate, countdown === 60])

  const onChange = (e) => {
    const val = e.target.value
    if (/^\d*$/.test(val) && val.length <= 6) {
      setOtp(val)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError(t("auth.otpValidationError"))
      return
    }

    setLoading(true)
    setError("")
    try {
      await verifyOTP({ userId, otp }).unwrap()
      toast.success(t("auth.otpVerifiedSuccess"))
      navigate("/dashboard")
    } catch (err) {
      setError(err?.data?.message || t("auth.otpVerificationFailed"))
    } finally {
      setLoading(false)
    }
  }

  const resendOTPHelper = async () => {
    if (countdown > 0 || isResending) return

    setLoading(true)
    setError("")
    try {
      await resendOtp({ userId }).unwrap()
      toast.success(t("auth.otpResentSuccess"))
      setCountdown(60)
    } catch (err) {
      setError(err?.data?.message || t("auth.otpResendFailed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E9F1FA]">
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-lg shadow"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center mb-4">{t("auth.verifyPhoneNumber")}</h2>
        <p className="text-center text-sm text-gray-600 mb-6">{t("auth.otpSentMessage")}</p>

        <ErrorMessage error={error} />

        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            name="otp"
            type="text"
            value={otp}
            onChange={onChange}
            placeholder="123456"
            className="text-center"
          />

          <SubmitButton loading={loading || isVerifying} loadingText={t("auth.verifying")} className="w-full">
            {t("auth.verifyOTP")}
          </SubmitButton>
        </form>

        <button
          onClick={resendOTPHelper}
          disabled={countdown > 0 || isResending}
          className="mt-4 w-full text-center text-blue-600 disabled:text-gray-400"
        >
          {isResending
            ? t("auth.resending")
            : countdown > 0
              ? t("auth.resendOTPCountdown", { seconds: countdown })
              : t("auth.resendOTP")}
        </button>
      </motion.div>
    </div>
  )
}

export default OTPVerification
