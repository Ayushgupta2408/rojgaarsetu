"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useGetAllJobsQuery } from "../../redux/api/jobsApiSlice"
import { Briefcase } from "lucide-react"
import { Link } from "react-router-dom"
import EmptyState from "../common/EmptyState"
import ErrorMessage from "../common/ErrorMessage"

const AllJobs = () => {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = useGetAllJobsQuery()
  const [searchTerm, setSearchTerm] = useState("")
  const [minPayscale, setMinPayscale] = useState("")
  const [minExperience, setMinExperience] = useState("")

  const filterJobs = () => {
    const jobs = data?.jobPosts || []
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requiredSkill.toLowerCase().includes(searchTerm.toLowerCase())

      const meetsPayscale = minPayscale === "" || job.payscale >= Number.parseInt(minPayscale)

      const meetsExperience = minExperience === "" || (job.experienceRequired || 0) >= Number.parseInt(minExperience)

      return matchesSearch && meetsPayscale && meetsExperience
    })
  }

  const filteredJobs = filterJobs()

  return (
    <div className="min-h-screen mt-10 bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t("jobs.browse.title")}</h1>
              <p className="text-gray-600 mt-1">{t("jobs.browse.subtitle")}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder={t("jobs.browse.filters.searchPlaceholder")}
              className="border border-gray-300 rounded px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="number"
              placeholder={t("jobs.browse.filters.minPayscalePlaceholder")}
              className="border border-gray-300 rounded px-4 py-2"
              value={minPayscale}
              onChange={(e) => setMinPayscale(e.target.value)}
            />
            <input
              type="number"
              placeholder={t("jobs.browse.filters.minExperiencePlaceholder")}
              className="border border-gray-300 rounded px-4 py-2"
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
            />
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorMessage message={t("jobs.browse.errors.loadFailed")} />
          ) : (
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>📍 {job.location}</span>
                          <span>💰 ₹{job.payscale}/day</span>
                          <span>🛠️ {job.requiredSkill}</span>
                          {job.experienceRequired && (
                            <span>
                              🧰 {job.experienceRequired}+ {t("jobs.fields.years")}
                            </span>
                          )}
                          <span>
                            👷 {job.noOfWorkers} {t("jobs.fields.workers")}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/job/view/${job._id}`}
                        className="ml-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      >
                        {t("jobs.actions.viewDetails")}
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message={t("jobs.browse.noJobsFound")} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllJobs
