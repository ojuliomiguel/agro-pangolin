import { render, screen } from '@testing-library/react'
import { AppProvider } from './index'

describe('AppProvider', () => {
  it('renderiza os filhos dentro do Provider do Redux', () => {
    render(
      <AppProvider>
        <div data-testid="child">Test Child</div>
      </AppProvider>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
