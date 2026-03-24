import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AppProvider } from '@/app/providers'
import { router } from '@/app/router'
import { shouldEnableMocks } from '@/shared/config/runtime'
import './index.css'

async function enableMocks() {
  if (shouldEnableMocks(import.meta.env)) {
    const { worker } = await import('@/mocks/browser')
    await worker.start({ onUnhandledRequest: 'error' })
  }
}

async function bootstrap() {
  await enableMocks()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </StrictMode>,
  )
}

void bootstrap()
