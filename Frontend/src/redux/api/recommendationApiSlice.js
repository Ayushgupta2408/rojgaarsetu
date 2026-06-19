import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const recommendationApiSlice = createApi({
  reducerPath: 'recommendationApi',
  baseQuery,
  endpoints: (builder) => ({
    getRecommendations: builder.query({
      query: () => '/recommendations',
    }),
  }),
});

export const {
  useGetRecommendationsQuery,
} = recommendationApiSlice;
