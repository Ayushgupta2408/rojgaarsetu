"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useGetDashboardQuery,
  useRespondToOfferMutation,
  useAcceptJoiningLetterMutation,
} from "../../redux/api/workerApiSlice"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Download, Eye, Check, X } from "lucide-react"

import StatusBadge from "../common/StatusBadge"
import ActionButton from "../common/ActionButton"
import TabNavigation from "../common/TabNavigation"
import EmptyState from "../common/EmptyState"
import LoadingSpinner from "../common/LoadingSpinner"
import ErrorMessage from "../common/ErrorMessage"

const WorkerDashboard = () => {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = useGetDashboardQuery()
  const [activeTab, setActiveTab] = useState("applied")
  const navigate = useNavigate()

  const [respondToOffer] = useRespondToOfferMutation()
  const [acceptJoiningLetter] = useAcceptJoiningLetterMutation()

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorMessage translationKey="worker.dashboard.error.fetchData" />

  const { appliedJobs, offerLetterJobs, joiningLetterJobs, recommendedJobs } = data

  const handleRespondToOffer = async (applicationId, response) => {
    try {
      await respondToOffer({
        applicationId,
        data: { action: response },
      }).unwrap()

      toast.success(t(`worker.dashboard.toast.offer${response === "accept" ? "Accepted" : "Rejected"}`))
      refetch()
    } catch (error) {
      toast.error(
        t("worker.dashboard.toast.offerError", {
          action: response,
          message: error.data?.message || t("common.error.unknown"),
        }),
      )
    }
  }

  const handleAcceptJoiningLetter = async (applicationId) => {
    try {
      await acceptJoiningLetter(applicationId).unwrap()
      toast.success(t("worker.dashboard.toast.joiningAccepted"))
      refetch()
    } catch (error) {
      toast.error(
        t("worker.dashboard.toast.joiningError", {
          message: error.data?.message || t("common.error.unknown"),
        }),
      )
    }
  }

  const renderJobCard = (job, showActions = false, actionType = null) => (
    <li key={job._id} className="hover:bg-gray-50">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm font-medium text-blue-600 truncate">
              {job.jobPostId?.title || job.title || t("common.noTitle")}
            </p>
            <div className="ml-2">
              <StatusBadge status={job.status} />
            </div>
          </div>
          <div className="ml-2 flex-shrink-0 flex">
            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              ₹{job.jobPostId?.payscale || job.payscale || 0}/{t("common.perDay")}
            </p>
          </div>
        </div>
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="sm:flex">
            <p className="flex items-center text-sm text-gray-500">
              📍 {job.jobPostId?.location || job.location || t("common.noLocation")}
            </p>
            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
              📅 {t("worker.dashboard.appliedOn")} {new Date(job.appliedAt || job.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            {/* Download button for offer/joining letters */}
            {(job.offerLetter || job.joiningLetter) && (
              <a href={job.offerLetter || job.joiningLetter} target="_blank" rel="noopener noreferrer">
                <ActionButton variant="secondary" icon={Download} translationKey="common.actions.download" />
              </a>
            )}

            {/* View Job button */}
            <ActionButton
              variant="primary"
              icon={Eye}
              translationKey="common.actions.viewJob"
              onClick={() => navigate(`/job/view/${job.jobPostId?._id || job._id}`)}
            />

            {/* Action buttons based on type */}
            {actionType === "offer" && (
              <>
                <ActionButton
                  variant="success"
                  icon={Check}
                  translationKey="common.actions.accept"
                  onClick={() => handleRespondToOffer(job._id, "accept")}
                />
                <ActionButton
                  variant="danger"
                  icon={X}
                  translationKey="common.actions.reject"
                  onClick={() => handleRespondToOffer(job._id, "reject")}
                />
              </>
            )}

            {actionType === "joining" && (
              <ActionButton
                variant="success"
                icon={Check}
                translationKey="common.actions.accept"
                onClick={() => handleAcceptJoiningLetter(job._id)}
              />
            )}

            {actionType === "recommended" && (
              <ActionButton
                variant="success"
                translationKey="common.actions.apply"
                onClick={() => navigate(`/job/apply/${job._id}`)}
              />
            )}
          </div>
        </div>
      </div>
    </li>
  )

  const renderJobsList = (jobs, actionType = null) => (
    <ul className="divide-y divide-gray-200">
      {jobs.length > 0 ? (
        jobs.map((job) => renderJobCard(job, true, actionType))
      ) : (
        <EmptyState translationKey={`worker.dashboard.empty.${activeTab}`} />
      )}
    </ul>
  )

  const renderRecommendedJobs = () => (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 px-4 sm:px-6">{t("worker.dashboard.recommendedJobs")}</h3>
      <ul className="divide-y divide-gray-200 mt-2">
        {recommendedJobs && recommendedJobs.length > 0 ? (
          recommendedJobs.map((job) => renderJobCard(job, true, "recommended"))
        ) : (
          <EmptyState translationKey="worker.dashboard.empty.recommended" />
        )}
      </ul>
    </div>
  )

  const tabs = ["applied", "offer", "joining"]

  return (
    <div className="bg-white shadow py-10 mt-10 overflow-hidden sm:rounded-lg max-w-6xl mx-auto">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        translationPrefix="worker.dashboard.tabs"
      />

      <div>
        {activeTab === "applied" && renderJobsList(appliedJobs)}
        {activeTab === "offer" && renderJobsList(offerLetterJobs, "offer")}
        {activeTab === "joining" && renderJobsList(joiningLetterJobs, "joining")}
      </div>

      {activeTab === "applied" && renderRecommendedJobs()}
    </div>
  )
}

export default WorkerDashboard
