"use client"

import { useTranslation } from "react-i18next"

const ActionButton = ({
  variant = "primary",
  size = "sm",
  icon: Icon,
  children,
  translationKey,
  text, // Added text prop for backward compatibility
  onClick,
  disabled = false,
  ...props
}) => {
  const { t } = useTranslation()

  const variants = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 border-blue-600",
    success: "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 border-green-600",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 border-red-600",
    secondary: "text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500 border-gray-300",
    indigo: "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 border-indigo-600",
  }

  const sizes = {
    sm: "px-3 py-2 text-sm", // Increased padding for better visibility
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  const buttonText = translationKey ? t(translationKey) : text || children

  return (
    <button
      className={`inline-flex items-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {buttonText}
    </button>
  )
}

export default ActionButton
