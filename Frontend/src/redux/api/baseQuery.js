// redux/api/baseQuery.js
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://rojgaarsetu.onrender.com/api/v1',
  // include credentials so your HttpOnly cookie is sent with every request
  credentials: 'include',
  // no extra headers needed if you rely purely on cookie‑based auth
  prepareHeaders: (headers) => {
    return headers;
  },
});

export default baseQuery;
