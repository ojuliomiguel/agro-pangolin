import { baseApi } from '@/shared/api/baseApi'
import type { ProducersListQuery, ProducersListResponse } from '../types'

export const producersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducers: builder.query<ProducersListResponse, ProducersListQuery>({
      query: ({ page, limit }) => ({
        url: '/producers',
        params: { page, limit },
      }),
      providesTags: (result) => {
        if (!result) {
          return [{ type: 'Producers', id: 'LIST' }]
        }

        return [
          { type: 'Producers', id: 'LIST' },
          ...result.data.map(({ id }) => ({ type: 'Producers' as const, id })),
        ]
      },
    }),
    deleteProducer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/producers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Producers', id },
        { type: 'Producers', id: 'LIST' },
      ],
    }),
  }),
})

export const { useGetProducersQuery, useDeleteProducerMutation } = producersApi
