import { http, HttpResponse } from 'msw'
import { fireEvent, screen, waitFor, within, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routeConfig } from '@/app/router'
import { server } from '@/mocks/server'
import { getApiUrl } from '@/shared/api/apiUrl'
import { producerListEmptyFixture, removeProducerFixture } from '@/mocks/fixtures/producers'
import { createTestStore } from '@/shared/test/test-utils'

function renderOnProducersRoute() {
  const store = createTestStore()
  const memoryRouter = createMemoryRouter(routeConfig, {
    initialEntries: ['/produtores'],
  })

  return render(
    <Provider store={store}>
      <RouterProvider router={memoryRouter} />
    </Provider>
  )
}

describe('Página de listagem de produtores', () => {
  it('renderiza o loading e depois a tabela com dados', async () => {
    renderOnProducersRoute()

    expect(screen.getByRole('status', { name: 'Carregando produtores' })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Produtor 01')).toBeInTheDocument()
    })

    const row = screen.getByText('Produtor 01').closest('tr')
    if (!row) {
      throw new Error('Linha do produtor não encontrada')
    }

    expect(within(row).getByText('000.000.001-91')).toBeInTheDocument()
    expect(within(row).getByText('2 fazendas')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Novo produtor' })).toBeInTheDocument()
    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument()
  })

  it('troca de página ao clicar em próxima', async () => {
    renderOnProducersRoute()

    await waitFor(() => {
      expect(screen.getByText('Produtor 01')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }))

    await waitFor(() => {
      expect(screen.getByText('Produtor 11')).toBeInTheDocument()
    })

    expect(screen.getByText('Página 2 de 2')).toBeInTheDocument()
  })

  it('permite navegar para detalhe a partir da linha', async () => {
    renderOnProducersRoute()

    await waitFor(() => {
      expect(screen.getByText('Produtor 01')).toBeInTheDocument()
    })

    const row = screen.getByText('Produtor 01').closest('tr')
    if (!row) {
      throw new Error('Linha do produtor não encontrada')
    }

    fireEvent.click(within(row).getByRole('link', { name: 'Ver detalhe de Produtor 01' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Detalhe do produtor' })).toBeInTheDocument()
    })
  })

  it('permite navegar para edição a partir da linha', async () => {
    renderOnProducersRoute()

    await waitFor(() => {
      expect(screen.getByText('Produtor 01')).toBeInTheDocument()
    })

    const row = screen.getByText('Produtor 01').closest('tr')
    if (!row) {
      throw new Error('Linha do produtor não encontrada')
    }

    fireEvent.click(within(row).getByRole('link', { name: 'Editar Produtor 01' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Editar produtor' })).toBeInTheDocument()
    })
  })

  it('renderiza o empty state quando não há produtores', async () => {
    server.use(
      http.get(getApiUrl('/api/producers'), () => {
        return HttpResponse.json(producerListEmptyFixture)
      })
    )

    renderOnProducersRoute()

    await waitFor(() => {
      expect(screen.getByText('Nenhum produtor cadastrado')).toBeInTheDocument()
    })

    expect(screen.getByRole('link', { name: 'Cadastrar produtor' })).toBeInTheDocument()
  })

  it('exclui produtor com sucesso e o remove da tabela', async () => {
    jest.spyOn(window, 'confirm').mockReturnValueOnce(true)

    renderOnProducersRoute()

    await waitFor(() => {
      expect(screen.getByText('Produtor 01')).toBeInTheDocument()
    })

    const row = screen.getByText('Produtor 01').closest('tr')
    if (!row) throw new Error('Linha do produtor não encontrada')

    fireEvent.click(within(row).getByRole('button', { name: 'Excluir Produtor 01' }))

    await waitFor(() => {
      expect(screen.queryByText('Produtor 01')).not.toBeInTheDocument()
    })
  })

  it('exibe banner de erro quando a exclusão falha', async () => {
    jest.spyOn(window, 'confirm').mockReturnValueOnce(true)
    server.use(
      http.delete(getApiUrl('/api/producers/:id'), () => {
        return HttpResponse.json({ message: 'Erro interno' }, { status: 500 })
      })
    )

    renderOnProducersRoute()

    await waitFor(() => {
      expect(screen.getByText('Produtor 01')).toBeInTheDocument()
    })

    const row = screen.getByText('Produtor 01').closest('tr')
    if (!row) throw new Error('Linha do produtor não encontrada')

    fireEvent.click(within(row).getByRole('button', { name: 'Excluir Produtor 01' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível excluir Produtor 01. Tente novamente.'
    )
  })

  it('desabilita apenas o botão do item sendo excluído durante a operação', async () => {
    jest.spyOn(window, 'confirm').mockReturnValueOnce(true)

    let resolveDelete!: () => void
    const pendingDelete = new Promise<void>((resolve) => {
      resolveDelete = resolve
    })
    server.use(
      http.delete(getApiUrl('/api/producers/:id'), async ({ params }) => {
        await pendingDelete
        removeProducerFixture(String(params.id))
        return new HttpResponse(null, { status: 204 })
      })
    )

    renderOnProducersRoute()

    await waitFor(() => {
      expect(screen.getByText('Produtor 01')).toBeInTheDocument()
    })

    const row1 = screen.getByText('Produtor 01').closest('tr')
    const row2 = screen.getByText('Produtor 02').closest('tr')
    if (!row1 || !row2) throw new Error('Linhas dos produtores não encontradas')

    fireEvent.click(within(row1).getByRole('button', { name: 'Excluir Produtor 01' }))

    await waitFor(() => {
      expect(within(row1).getByRole('button', { name: 'Excluir Produtor 01' })).toBeDisabled()
    })

    expect(within(row2).getByRole('button', { name: 'Excluir Produtor 02' })).not.toBeDisabled()

    resolveDelete()

    await waitFor(() => {
      expect(screen.queryByText('Produtor 01')).not.toBeInTheDocument()
    })
  })
})
