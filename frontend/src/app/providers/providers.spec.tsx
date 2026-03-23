import { render, screen } from '@testing-library/react'
import { AppProvider } from './index'

describe('AppProvider', () => {
  it('renders children within Redux Provider', () => {
    render(
      <AppProvider>
        <div data-testid="child">Test Child</div>
      </AppProvider>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
