"use client"
import { motion } from "framer-motion"

const SubmitButton = ({
  loading,
  loadingText,
  children,
  text, // Added text prop support
  disabled = false,
  variant = "primary",
  className = "",
  onClick,
  type = "submit",
}) => {
  const baseClasses =
    "px-5 py-2 rounded font-bold transition shadow focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500",
  }

  return (
    <motion.button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${loading || disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {loadingText}
        </span>
      ) : (
        text || children
      )}
    </motion.button>
  )
}

export default SubmitButton
