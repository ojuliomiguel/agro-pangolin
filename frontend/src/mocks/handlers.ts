import { http, HttpResponse } from 'msw'
import { dashboardFixture } from './fixtures/dashboard'
import { getApiUrl } from '@/shared/api/apiUrl'

export const handlers = [
  http.get(getApiUrl('/api/health'), () => {
    return HttpResponse.json({ status: 'ok' })
  }),
  http.get(getApiUrl('/api/dashboard'), () => {
    return HttpResponse.json(dashboardFixture)
  }),
]
