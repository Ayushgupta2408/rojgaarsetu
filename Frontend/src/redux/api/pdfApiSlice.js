// redux/api/pdfApiSlice.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const pdfApiSlice = createApi({
  reducerPath: 'pdfApi',
  baseQuery,
  endpoints: (builder) => ({
    generatePDF: builder.mutation({
      query: (data) => ({
        url: '/pdf/generate',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGeneratePDFMutation } = pdfApiSlice;
