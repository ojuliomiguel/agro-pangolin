import React from 'react'
import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import { baseApi } from '@/shared/api/baseApi'

const createTestStore = (preloadedState = {}) => configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  preloadedState,
})

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Entradas iniciais para MemoryRouter (ex.: ['/produtores/123']) */
  initialEntries?: string[]
  /** Padrão de rota para resolver parâmetros (ex.: '/produtores/:id') */
  path?: string
}

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const { initialEntries, path, ...renderOptions } = options ?? {}

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const store = createTestStore()

    if (initialEntries && path) {
      return (
        <Provider store={store}>
          <MemoryRouter initialEntries={initialEntries}>
            <Routes>
              <Route path={path} element={children} />
            </Routes>
          </MemoryRouter>
        </Provider>
      )
    }

    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
export { customRender as render, createTestStore }
