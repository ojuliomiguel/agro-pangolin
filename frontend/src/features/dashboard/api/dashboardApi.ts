import { baseApi } from '@/shared/api/baseApi'
import type { DashboardSummary } from '../types'

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardSummary, void>({
      query: () => '/dashboard',
    }),
  }),
})

export const { useGetDashboardQuery } = dashboardApi