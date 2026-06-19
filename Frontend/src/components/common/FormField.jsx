"use client"
import { useTranslation } from "react-i18next"

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  options = [], // For radio buttons
  className = "",
}) => {
  const { t } = useTranslation()

  if (type === "radio") {
    return (
      <div className="md:flex mb-6">
        <div className="md:w-1/3 text-left">
          <label className="block text-black font-bold mb-1 md:mb-0">{label}</label>
        </div>
        <div className="md:w-2/3 flex items-center gap-4">
          {options.map((option) => (
            <label key={option.value} className="flex items-center text-gray-700 font-medium cursor-pointer">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                className="form-radio h-5 w-5 text-blue-600 mr-2 focus:outline-none focus:ring-0 focus:border-blue-600"
              />
              <span className="capitalize">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  if (type === "textarea") {
    return (
      <div className="mb-6">
        <label className="block text-black font-bold mb-2">{label}</label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={`w-full border border-gray-300 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-600 ${className}`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    )
  }

  return (
    <div className="md:flex mb-6">
      <div className="md:w-1/3 text-left">
        <label htmlFor={name} className="block text-black font-bold mb-1 md:mb-0">
          {label}
        </label>
      </div>
      <div className="md:w-2/3">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          maxLength={type === "text" && name === "otp" ? 6 : undefined}
          className={`w-full border border-gray-300 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-600 ${type === "text" && name === "otp" ? "text-center" : ""} ${className}`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  )
}

export default FormField
