"use client"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useGetJobApplicationsQuery } from "@/redux/api/contractorApiSlice"
import LoadingSpinner from "../common/LoadingSpinner"
import ErrorMessage from "../common/ErrorMessage"
import EmptyState from "../common/EmptyState"
import DetailCard from "../common/DetailCard"
import ApplicationCard from "../common/ApplicationCard"

function ApplicationsOnJob() {
  const { t } = useTranslation()
  const { jobId } = useParams()
  const { data: jobApplications, isLoading, error } = useGetJobApplicationsQuery(jobId)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error.message} />

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            {t("applications.applicationsForJob", { title: jobApplications.jobPost.title })}
          </h1>

          <DetailCard title={t("applications.jobDetails")} data={jobApplications.jobPost} type="job" />

          <h2 className="text-xl font-semibold mb-4">{t("applications.applications")}</h2>
          {jobApplications.applications.length > 0 ? (
            jobApplications.applications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                type="job"
                linkTo={`/job/application/${application._id}`}
              />
            ))
          ) : (
            <EmptyState message={t("applications.noApplicationsYet")} />
          )}
        </div>
      </main>
    </div>
  )
}

export default ApplicationsOnJob
