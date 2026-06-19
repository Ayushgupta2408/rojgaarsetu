// redux/api/workerApiSlice.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const workerApiSlice = createApi({
  reducerPath: 'workerApi',
  baseQuery,
  endpoints: (builder) => ({
    // Get worker portfolio (public – optional id)
    getPortfolio: builder.query({
      query: (id) =>
        id
          ? `/worker/portfolio/${id}`
          : '/worker/portfolio',
    }),

    // Get worker dashboard (protected)
    getDashboard: builder.query({
      query: () => '/worker/dashboard',
    }),

    // Apply for a job (requires profile complete)
    applyForJob: builder.mutation({
      query: ({ jobPostId, data }) => ({
        url: `/worker/job/${jobPostId}/apply`,
        method: 'POST',
        body: data,
      }),
    }),

    // Respond to an offer letter (accept/reject)
    respondToOffer: builder.mutation({
      query: ({ applicationId, data }) => ({
        url: `/worker/application/${applicationId}/respond`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Accept joining letter
    acceptJoiningLetter: builder.mutation({
      query: (applicationId) => ({
        url: `/worker/application/${applicationId}/accept-joining`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useGetPortfolioQuery,
  useGetDashboardQuery,
  useApplyForJobMutation,
  useRespondToOfferMutation,
  useAcceptJoiningLetterMutation,
} = workerApiSlice;
