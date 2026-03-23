import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
