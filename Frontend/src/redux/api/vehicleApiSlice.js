import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const vehicleApiSlice = createApi({
  reducerPath: 'vehicleApi',
  baseQuery,
  endpoints: (builder) => ({
    // Get all vehicle posts with optional pagination or filter
    getAllVehicles: builder.query({
      query: () => '/vehicles',
    }),

    // Get vehicle by ID
    getVehicleById: builder.query({
      query: (id) => `/vehicles/${id}`,
    }),

    // Post a new vehicle form
    createVehicle: builder.mutation({
      query: (data) => ({
        url: '/vehicles',
        method: 'POST',
        body: data,
      }),
    }),

    // Apply to a vehicle post
   applyToVehicle: builder.mutation({
  query: ({ vehicleId, formData }) => ({
    url: `/vehicles/${vehicleId}/apply`,
    method: 'POST',
    body: formData,
    formData: true, 
  }),
  }),

  // Get Vehicle Application by ID
  getVehicleApplicationById: builder.query({
    query: (applicationId) => `/vehicles/application/${applicationId}`, 
  }),

  }),

});

export const {
  useGetAllVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useApplyToVehicleMutation,
  useGetVehicleApplicationByIdQuery,
} = vehicleApiSlice;
