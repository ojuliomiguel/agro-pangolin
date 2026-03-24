import { http, HttpResponse } from 'msw'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/shared/test/test-utils'
import { server } from '@/mocks/server'
import { dashboardEmptyFixture } from '@/mocks/fixtures/dashboard'
import { getApiUrl } from '@/shared/api/apiUrl'
import { Dashboard } from './Dashboard'

describe('Página do Dashboard', () => {
  it('renderiza o estado de carregamento inicialmente', () => {
    render(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renderiza o dashboard com dados quando a API responde com sucesso', async () => {
    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Total de Fazendas')).toBeInTheDocument()
    })
    expect(screen.getByText('Total de Hectares')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ver produtores' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cadastrar produtor' })).toBeInTheDocument()
  })

  it('renderiza o estado de erro e permite tentar novamente', async () => {
    server.use(
      http.get(getApiUrl('/dashboard'), () => {
        return HttpResponse.json({ message: 'boom' }, { status: 500 })
      })
    )

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar dashboard')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
  })

  it('renderiza o estado vazio quando o dashboard não possui fazendas', async () => {
    server.use(
      http.get(getApiUrl('/dashboard'), () => {
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
