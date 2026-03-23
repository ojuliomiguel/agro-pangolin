import { render, screen } from '@testing-library/react'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { router } from './index'

describe('AppRouter', () => {
  it('renders Home component on initial route', () => {
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    )
    expect(screen.getByText('Visão Analítica')).toBeInTheDocument()
  })
})
