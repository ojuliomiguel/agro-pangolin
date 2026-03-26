import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api/baseApi'
import { routeConfig } from './index'

function createTestStore() {
  return configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  })
}

function renderRoute(path: string) {
  const testStore = createTestStore()
  const memoryRouter = createMemoryRouter(routeConfig, { initialEntries: [path] })
  render(
    <Provider store={testStore}>
      <RouterProvider router={memoryRouter} />
    </Provider>
  )
}

describe('Smoke tests de rotas', () => {
  it('rota "/" renderiza a Home', () => {
    renderRoute('/')
    expect(screen.getByText('Visão Analítica')).toBeInTheDocument()
  })

  it('rota "/dashboard" renderiza o Dashboard', () => {
    renderRoute('/dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('rota "/produtores" renderiza a listagem de produtores', () => {
    renderRoute('/produtores')
    expect(screen.getByRole('heading', { name: 'Produtores' })).toBeInTheDocument()
  })

  it('rota "/produtores/novo" renderiza o formulário de criação', () => {
    renderRoute('/produtores/novo')
    expect(screen.getByRole('heading', { name: /novo produtor/i })).toBeInTheDocument()
  })

  it('rota desconhecida renderiza a página 404', () => {
    renderRoute('/rota-inexistente')
    expect(screen.getByText('Página não encontrada')).toBeInTheDocument()
  })
})
