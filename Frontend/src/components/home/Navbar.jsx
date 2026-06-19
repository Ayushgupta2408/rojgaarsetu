"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Menu, X } from "lucide-react"
import { useLogoutApiMutation } from "../../redux/api/authApiSlice"
import { useGetProfileQuery } from "@/redux/api/profileApiSlice"
import { logoutAndClearData } from "@/redux/slices/authSlice"
import { useTranslation } from "react-i18next"
import LanguageSwitch from ".././common/LanguageSwitch"

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const { userType, user } = useSelector((state) => state.auth)
  const { data } = useGetProfileQuery()
  const image = data?.profile?.image || "/avatar.png"
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutApi] = useLogoutApiMutation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logoutApi().unwrap()
    dispatch(logoutAndClearData())
    navigate("/")
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/")

  const portalName = () => {
    if (userType === "Worker") return t("portal.worker")
    if (userType === "Contractor") return t("portal.contractor")
    if (userType === "Owner") return t("portal.owner")
    return t("portal.default")
  }

  const linkClass = (path) =>
    `block lg:inline-block px-3 py-2 rounded ${
      isActive(path) ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
    }`

  const changeLanguage = (lang) => i18n.changeLanguage(lang)

  const authLinks = () => {
    switch (userType) {
      case "Worker":
        return (
          <>
            <Link to="/dashboard" className={linkClass("/dashboard")}>
              {t("nav.dashboard")}
            </Link>
            <Link to="/worker/profile" className={linkClass("/worker/profile")}>
              {t("nav.profile")}
            </Link>
            <Link to="/job/all" className={linkClass("/job/all")}>
              {t("nav.jobs")}
            </Link>
            <Link to="/recommendations" className={linkClass("/recommendations")}>
              {t("nav.recommendations")}
            </Link>
          </>
        )
      case "Contractor":
        return (
          <>
            <Link to="/dashboard" className={linkClass("/dashboard")}>
              {t("nav.dashboard")}
            </Link>
            <Link to="/contractor/profile" className={linkClass("/contractor/profile")}>
              {t("nav.profile")}
            </Link>
            <Link to="/job/create" className={linkClass("/job/create")}>
              {t("nav.postJob")}
            </Link>
            <Link to="/vehicle/create" className={linkClass("/vehicle/create")}>
              {t("nav.addVehicle")}
            </Link>
          </>
        )
      case "Owner":
        return (
          <>
            <Link to="/dashboard" className={linkClass("/dashboard")}>
              {t("nav.dashboard")}
            </Link>
            <Link to="/owner/profile" className={linkClass("/owner/profile")}>
              {t("nav.profile")}
            </Link>
            <Link to="/vehicle/all" className={linkClass("/vehicle/all")}>
              {t("nav.vehicles")}
            </Link>
          </>
        )
      default:
        return (
          <>
            <Link to="/" className={linkClass("/")}>
              {t("nav.home")}
            </Link>
            <Link to="/login" className={linkClass("/login")}>
              {t("nav.login")}
            </Link>
            <Link to="/register" className={linkClass("/register")}>
              {t("nav.register")}
            </Link>
          </>
        )
    }
  }

  return (
    <nav className="bg-white border-b fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate("/")}>
          {portalName()}
        </div>

        {/* Language Toggle */}
        <div className="hidden lg:flex items-center">
          <LanguageSwitch />
        </div>

        {/* Hamburger (mobile) */}
        <div className="lg:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 focus:outline-none">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Links & User (desktop) */}
        <div className="hidden lg:flex lg:items-center space-x-4">
          {authLinks()}
          {user && (
            <div className="flex items-center space-x-2 ml-4">
              <img src={image || "/avatar.png"} alt="avatar" className="h-8 w-8 rounded-full object-cover border" />
              <span className="text-sm font-medium text-gray-800">{user.name}</span>
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                {t("nav.logout")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {authLinks()}
            <div className="mt-4 flex justify-center">
              <LanguageSwitch />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
