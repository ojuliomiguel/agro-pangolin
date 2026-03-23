import { render, screen } from '@testing-library/react'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { router } from './index'

describe('Router', () => {
  it('renderiza o componente Home na rota inicial', () => {
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    )
    expect(screen.getByText('Visão Analítica')).toBeInTheDocument()
  })
})
