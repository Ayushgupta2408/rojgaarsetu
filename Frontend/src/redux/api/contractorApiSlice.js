import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const contractorApiSlice = createApi({
  reducerPath: 'contractorApi',
  baseQuery,
  tagTypes: ['Job', 'Vehicle', 'Application', 'Dashboard'],
  endpoints: (builder) => ({

    // Dashboard
    getDashboard: builder.query({
      query: () => '/contractor/dashboard',
      providesTags: ['Dashboard'],
    }),

    // Job routes
    getAllJobs: builder.query({
      query: () => '/contractor/jobs',
      providesTags: ['Job'],
    }),
    getJobById: builder.query({
      query: (id) => `/contractor/job/${id}`,
      providesTags: ['Job'],
    }),
    createJob: builder.mutation({
      query: (data) => ({
        url: '/contractor/job',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Job'],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/contractor/job/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Job'],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/contractor/job/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),

    // Vehicle routes
    getAllVehicles: builder.query({
      query: () => '/contractor/vehicles',
      providesTags: ['Vehicle'],
    }),
    getVehicleById: builder.query({
      query: (id) => `/contractor/vehicle/${id}`,
      providesTags: ['Vehicle'],
    }),
    createVehicle: builder.mutation({
      query: (data) => ({
        url: '/contractor/vehicle',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    updateVehicle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/contractor/vehicle/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    deleteVehicle: builder.mutation({
      query: (id) => ({
        url: `/contractor/vehicle/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicle'],
    }),

    // Applications
    getSingleApplication: builder.query({
      query: (applicationId) => `/contractor/job/application/${applicationId}`,
      providesTags: ['Application'],
    }),
    getSingleApplicationByVehicle: builder.query({
      query: (applicationId) => `/contractor/vehicle/application/${applicationId}`, 
      providesTags: ['Application'],
    }),
    getAllApplications: builder.query({
      query: () => '/contractor/applications',
      providesTags: ['Application'],
    }),
    getJobApplications: builder.query({
      query: (jobId) => `/contractor/job/${jobId}/applications`,
      providesTags: ['Application'],
    }),
    getVehicleApplications: builder.query({
      query: (vehicleId) => `/contractor/vehicle/${vehicleId}/applications`,
      providesTags: ['Application'],
    }),

    // Process job application
    processJobApplication: builder.mutation({
      query: ({ applicationId, data }) => ({
        url: `/contractor/application/${applicationId}/process`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Application'],
    }),
    sendJoiningLetter: builder.mutation({
      query: ({ applicationId, data }) => ({
        url: `/contractor/application/${applicationId}/joining-letter`,
        method: 'POST',
        body: data,
      }),
    }),

    // Process vehicle application
    processVehicleApplication: builder.mutation({
      query: ({ applicationId, data }) => ({
        url: `/contractor/vehicle-application/${applicationId}/process`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Application'],
    }),

    // Send invitation
    sendInvitation: builder.mutation({
      query: (data) => ({
        url: '/contractor/invite',
        method: 'POST',
        body: data,
      }),
    }),

  }),
});

export const {
  useGetDashboardQuery,
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,

  useGetAllVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,

  useGetSingleApplicationQuery,
  useGetSingleApplicationByVehicleQuery,
  useGetAllApplicationsQuery,
  useGetJobApplicationsQuery,
  useGetVehicleApplicationsQuery,
  useProcessJobApplicationMutation,
  useSendJoiningLetterMutation,
  useProcessVehicleApplicationMutation,

  useSendInvitationMutation,
} = contractorApiSlice;
