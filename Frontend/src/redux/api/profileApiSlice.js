import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const profileApiSlice = createApi({
  reducerPath: 'profileApi',
  baseQuery,
  endpoints: (builder) => ({
    completeProfile: builder.mutation({
      query: (data) => ({
        url: '/profile/complete',
        method: 'PUT',
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => '/profile',
    }),
    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: '/profile/image',
        method: 'POST',
        body: formData,
      }),
    }),
    uploadResume: builder.mutation({
      query: (formData) => ({
        url: '/profile/upload-resume',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useCompleteProfileMutation,
  useGetProfileQuery,
  useUploadProfileImageMutation,
  useUploadResumeMutation,
} = profileApiSlice;
