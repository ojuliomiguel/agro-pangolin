import { baseApi } from '@/shared/api/baseApi'
import type {
  ProducersListQuery,
  ProducersListResponse,
  ProducerSummary,
  CreateProducerRequest,
  UpdateProducerRequest,
} from '../types'

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
    getProducer: builder.query<ProducerSummary, string>({
      query: (id) => `/producers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Producers', id }],
    }),
    createProducer: builder.mutation<ProducerSummary, CreateProducerRequest>({
      query: (body) => ({
        url: '/producers',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Producers', id: 'LIST' }],
    }),
    updateProducer: builder.mutation<ProducerSummary, UpdateProducerRequest>({
      query: ({ id, ...body }) => ({
        url: `/producers/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Producers', id },
        { type: 'Producers', id: 'LIST' },
      ],
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

export const {
  useGetProducersQuery,
  useGetProducerQuery,
  useCreateProducerMutation,
  useUpdateProducerMutation,
  useDeleteProducerMutation,
} = producersApi
