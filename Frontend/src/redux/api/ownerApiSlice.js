// redux/api/ownerApiSlice.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const ownerApiSlice = createApi({
  reducerPath: 'ownerApi',
  baseQuery,
  tagTypes: ['Owner', 'Vehicle'],
  endpoints: (builder) => ({
    getOwnerDashboard: builder.query({
      query: () => '/owner/dashboard',
      providesTags: ['Owner'],
    }),
    applyForVehicleForm: builder.mutation({
      query: (vehicleFormId) => ({
        url: `/owner/vehicle/${vehicleFormId}/apply`,
        method: 'POST',
      }),
      invalidatesTags: ['Owner'],
    }),
    addVehicle: builder.mutation({
      query: (formData) => ({
        url: '/owner/vehicle',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    removeVehicle: builder.mutation({
      query: (vehicleId) => ({
        url: `/owner/vehicle/${vehicleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicle'],
    }),
  }),
});

export const {
  useGetOwnerDashboardQuery,
  useApplyForVehicleFormMutation,
  useAddVehicleMutation,
  useRemoveVehicleMutation,
} = ownerApiSlice;
