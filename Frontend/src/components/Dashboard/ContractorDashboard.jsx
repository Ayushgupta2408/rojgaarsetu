"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import {
  useGetDashboardQuery,
  useProcessJobApplicationMutation,
  useProcessVehicleApplicationMutation,
  useSendJoiningLetterMutation,
} from "../../redux/api/contractorApiSlice"
import { toast } from "react-hot-toast"
import { Users, CheckCircle, Truck, FileText } from "lucide-react"

// Import reusable components
import StatCard from "../common/StatCard"
import ActionButton from "../common/ActionButton"
import EmptyState from "../common/EmptyState"
import LoadingSpinner from "../common/LoadingSpinner"
import StatusBadge from "../common/StatusBadge"

const ContractorDashboard = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [activeView, setActiveView] = useState("jobs")
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const { data, isSuccess } = useGetDashboardQuery()
  const [processJobApplication] = useProcessJobApplicationMutation()
  const [processVehicleApplication] = useProcessVehicleApplicationMutation()
  const [sendJoiningLetter] = useSendJoiningLetterMutation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isSuccess) setDashboardData(data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isSuccess, data])

  const handleJobAction = async (applicationId, action) => {
    try {
      const feedback = ""
      await processJobApplication({
        applicationId,
        data: { action, feedback },
      }).unwrap()
      toast.success(t(`contractor.dashboard.toast.application${action.charAt(0).toUpperCase() + action.slice(1)}`))
    } catch (err) {
      console.error("Error processing application:", err)
      toast.error(t("contractor.dashboard.toast.applicationError"))
    }
  }

  const handleVehicleAction = async (applicationId, action) => {
    try {
      await processVehicleApplication({
        applicationId,
        data: { action },
      }).unwrap()
      toast.success(t(`contractor.dashboard.toast.vehicle${action.charAt(0).toUpperCase() + action.slice(1)}`))
    } catch (err) {
      console.error("Error processing vehicle application:", err)
      toast.error(t("contractor.dashboard.toast.vehicleError"))
    }
  }

  const handleSendJoiningLetter = async (applicationId) => {
    try {
      await sendJoiningLetter(applicationId).unwrap()
      toast.success(t("contractor.dashboard.toast.joiningLetterSent"))
    } catch (err) {
      console.error("Error sending joining letter:", err)
      toast.error(t("contractor.dashboard.toast.joiningLetterError"))
    }
  }

  if (loading) return <LoadingSpinner />

  const {
    jobPosts = [],
    jobApplications = { appliedCandidates: [] },
    vehicleForms = [],
    vehicleApplications = { appliedCandidates: [] },
  } = dashboardData || {}

  const totalApplications = jobApplications.appliedCandidates?.length || 0
  const offersSent = jobApplications.appliedCandidates?.filter((app) => app.status === "approved")?.length || 0
  const totalVehicleApplications = vehicleApplications.appliedCandidates?.length || 0
  const vehicleOffersSent =
    vehicleApplications.appliedCandidates?.filter((app) => app.status === "accepted")?.length || 0

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Users}
              translationKey="contractor.dashboard.stats.totalApplications"
              value={totalApplications}
              bgColor="bg-blue-500"
            />
            <StatCard
              icon={CheckCircle}
              translationKey="contractor.dashboard.stats.offersSent"
              value={offersSent}
              bgColor="bg-green-500"
            />
            <StatCard
              icon={Truck}
              translationKey="contractor.dashboard.stats.vehicleApplications"
              value={totalVehicleApplications}
              bgColor="bg-purple-500"
            />
            <StatCard
              icon={FileText}
              translationKey="contractor.dashboard.stats.vehicleOffers"
              value={vehicleOffersSent}
              bgColor="bg-orange-500"
            />
          </div>

          {/* Toggle View */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={`${
                  activeView === "jobs" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                } relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                onClick={() => setActiveView("jobs")}
              >
                {t("contractor.dashboard.views.jobPostings")}
              </button>
              <button
                type="button"
                className={`${
                  activeView === "vehicles" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                } relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                onClick={() => setActiveView("vehicles")}
              >
                {t("contractor.dashboard.views.vehicleForms")}
              </button>
            </div>
          </div>

          {/* Content based on active view */}
          <div className="mt-6">
            {activeView === "jobs" ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {t("contractor.dashboard.sections.jobPostings")}
                  </h2>
                  <Link to="/job/create">
                    <ActionButton
                      variant="primary"
                      size="md"
                      translationKey="contractor.dashboard.actions.createNewJob"
                    />
                  </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  {jobPosts && jobPosts.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {jobPosts.map((job) => (
                        <li key={job._id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium text-blue-600 truncate">{job.title}</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                  {t("contractor.dashboard.applicationsCount", { count: job.applications.length })}
                                </p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex space-x-2">
                                <Link to={`/job/view/${job._id}`}>
                                  <ActionButton variant="primary" translationKey="common.actions.viewJob" />
                                </Link>
                                <Link to={`/job/applications/${job._id}`}>
                                  <ActionButton variant="success" translationKey="common.actions.viewApplications" />
                                </Link>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">📍 {job.location}</p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  💰 ₹{job.payscale}/{t("common.perDay")}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <span>
                                  {t("contractor.dashboard.postedOn")} {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState
                      translationKey="contractor.dashboard.empty.noJobs"
                      actionButton={
                        <Link to="/job/create">
                          <ActionButton
                            variant="primary"
                            size="md"
                            translationKey="contractor.dashboard.actions.createFirstJob"
                          />
                        </Link>
                      }
                    />
                  )}
                </div>

                {/* Applied Candidates Section */}
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {t("contractor.dashboard.sections.appliedCandidates")}
                  </h2>

                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {jobApplications.appliedCandidates && jobApplications.appliedCandidates.length > 0 ? (
                      <div className="px-4 py-5 sm:px-6">
                        <div className="flex flex-col">
                          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("contractor.dashboard.table.candidate")}
                                      </th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("contractor.dashboard.table.job")}
                                      </th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("contractor.dashboard.table.status")}
                                      </th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("contractor.dashboard.table.appliedOn")}
                                      </th>
                                      <th className="relative px-6 py-3">
                                        <span className="sr-only">{t("contractor.dashboard.table.actions")}</span>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {jobApplications.appliedCandidates.map((application) => (
                                      <tr key={application._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                              <span className="text-gray-500 font-medium">
                                                {application.name.charAt(0).toUpperCase()}
                                              </span>
                                            </div>
                                            <div className="ml-4">
                                              <div className="text-sm font-medium text-gray-900">
                                                {application.name}
                                              </div>
                                              <div className="text-sm text-gray-500">{application.email}</div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm text-gray-900">
                                            {jobPosts.find((job) => job._id === application.jobPostId)?.title ||
                                              t("common.unknownJob")}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <StatusBadge status={application.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {new Date(application.appliedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                          <Link
                                            to={`/job/application/${application._id}`}
                                            className="text-blue-600 hover:text-blue-900"
                                          >
                                            {t("common.actions.viewApplication")}
                                          </Link>
                                          {application.status === "pending" && (
                                            <div className="inline-flex space-x-2">
                                              <ActionButton
                                                variant="success"
                                                translationKey="common.actions.accept"
                                                onClick={() => handleJobAction(application._id, "accept")}
                                              />
                                              <ActionButton
                                                variant="danger"
                                                translationKey="common.actions.reject"
                                                onClick={() => handleJobAction(application._id, "reject")}
                                              />
                                            </div>
                                          )}
                                          {application.status === "approved" && (
                                            <ActionButton
                                              variant="primary"
                                              translationKey="contractor.dashboard.actions.sendJoiningLetter"
                                              onClick={() => handleSendJoiningLetter(application._id)}
                                            />
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <EmptyState translationKey="contractor.dashboard.empty.noCandidates" />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Vehicle Forms View
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {t("contractor.dashboard.sections.vehicleForms")}
                  </h2>
                  <Link to="/vehicle/create">
                    <ActionButton
                      variant="primary"
                      size="md"
                      translationKey="contractor.dashboard.actions.createNewForm"
                    />
                  </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  {vehicleForms && vehicleForms.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {vehicleForms.map((form) => (
                        <li key={form._id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium text-blue-600 truncate">{form.title}</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                  {t("contractor.dashboard.applicationsCount", { count: form.applications.length })}
                                </p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex space-x-2">
                                <Link to={`/vehicle/view/${form._id}`}>
                                  <ActionButton variant="primary" translationKey="common.actions.viewForm" />
                                </Link>
                                <Link to={`/vehicle/applications/${form._id}`}>
                                  <ActionButton variant="success" translationKey="common.actions.viewApplications" />
                                </Link>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">📍 {form.location}</p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  💰 ₹{form.payscale}/{t("common.perDay")}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <span>
                                  {t("contractor.dashboard.postedOn")} {new Date(form.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState
                      translationKey="contractor.dashboard.empty.noForms"
                      actionButton={
                        <Link to="/vehicle/create">
                          <ActionButton
                            variant="primary"
                            size="md"
                            translationKey="contractor.dashboard.actions.createFirstForm"
                          />
                        </Link>
                      }
                    />
                  )}
                </div>

                {/* Vehicle Applications Section */}
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {t("contractor.dashboard.sections.vehicleApplications")}
                  </h2>

                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {vehicleApplications.appliedCandidates && vehicleApplications.appliedCandidates.length > 0 ? (
                      <div className="px-4 py-5 sm:px-6">
                        <div className="flex flex-col">
                          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("contractor.dashboard.table.applicant")}
                                      </th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("contractor.dashboard.table.form")}
                                      </th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("contractor.dashboard.table.status")}
                                      </th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("contractor.dashboard.table.appliedOn")}
                                      </th>
                                      <th className="relative px-6 py-3">
                                        <span className="sr-only">{t("contractor.dashboard.table.actions")}</span>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {vehicleApplications.appliedCandidates.map((application) => (
                                      <tr key={application._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                              <span className="text-gray-500 font-medium">
                                                {application.name.charAt(0).toUpperCase()}
                                              </span>
                                            </div>
                                            <div className="ml-4">
                                              <div className="text-sm font-medium text-gray-900">
                                                {application.name}
                                              </div>
                                              <div className="text-sm text-gray-500">{application.email}</div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm text-gray-900">
                                            {vehicleForms.find((form) => form._id === application.vehicleFormId)
                                              ?.title || t("common.unknownForm")}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <StatusBadge status={application.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {new Date(application.appliedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                          <Link
                                            to={`/vehicle/application/${application._id}`}
                                            className="text-blue-600 hover:text-blue-900"
                                          >
                                            {t("common.actions.viewApplication")}
                                          </Link>
                                          {application.status === "pending" && (
                                            <div className="inline-flex space-x-2">
                                              <ActionButton
                                                variant="success"
                                                translationKey="common.actions.accept"
                                                onClick={() => handleVehicleAction(application._id, "accept")}
                                              />
                                              <ActionButton
                                                variant="danger"
                                                translationKey="common.actions.reject"
                                                onClick={() => handleVehicleAction(application._id, "reject")}
                                              />
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <EmptyState translationKey="contractor.dashboard.empty.noVehicleApplications" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ContractorDashboard
