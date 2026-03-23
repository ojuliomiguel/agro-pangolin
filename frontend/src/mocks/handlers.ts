import { http, HttpResponse } from 'msw'

export const handlers = [
  // Exemplo de handler inicial
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
]
