import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getApiOrigin } from './apiUrl'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: getApiOrigin() }),
  tagTypes: ['Producers'],
  endpoints: () => ({}),
})
