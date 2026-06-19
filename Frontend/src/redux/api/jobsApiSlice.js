// redux/api/jobApiSlice.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const jobApiSlice = createApi({
  reducerPath: 'jobApi',
  baseQuery,
  tagTypes: ['Job'],
  endpoints: (builder) => ({
    getAllJobs: builder.query({
      query: () => '/jobs',
      providesTags: ['Job'],
    }),
    getJobById: builder.query({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
} = jobApiSlice;
