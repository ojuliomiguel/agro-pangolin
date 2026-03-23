import { http, HttpResponse } from 'msw'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/shared/test/test-utils'
import { server } from '@/mocks/server'
import { dashboardEmptyFixture } from '@/mocks/fixtures/dashboard'
import { getApiUrl } from '@/shared/api/apiUrl'
import { Dashboard } from './Dashboard'

describe('Dashboard Page', () => {
  it('renders loading state initially', () => {
    render(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders dashboard with data when API returns successfully', async () => {
    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Total de Fazendas')).toBeInTheDocument()
    })
    expect(screen.getByText('Total de Hectares')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ver produtores' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cadastrar produtor' })).toBeInTheDocument()
  })

  it('renders error state and allows retry', async () => {
    server.use(
      http.get(getApiUrl('/api/dashboard'), () => {
        return HttpResponse.json({ message: 'boom' }, { status: 500 })
      })
    )

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar dashboard')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
  })

  it('renders empty state when dashboard has no farms', async () => {
    server.use(
      http.get(getApiUrl('/api/dashboard'), () => {
        return HttpResponse.json(dashboardEmptyFixture)
      })
    )

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Nenhuma fazenda cadastrada')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Cadastrar produtor' })).toBeInTheDocument()
  })
})
