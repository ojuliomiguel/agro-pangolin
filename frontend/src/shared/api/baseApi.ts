import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getApiUrl } from './apiUrl'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: getApiUrl('/api') }),
  tagTypes: ['Producers'],
  endpoints: () => ({}),
})
