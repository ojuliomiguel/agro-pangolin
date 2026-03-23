import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/shared/components/MainLayout'
import { Home } from '@/features/home/pages/Home'
import { Dashboard } from '@/features/dashboard/pages/Dashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'produtores',
        children: [
          {
            index: true,
            element: <div>Produtores List (Em Breve)</div>,
          },
          {
            path: 'novo',
            element: <div>Novo Produtor (Em Breve)</div>,
          },
        ]
      }
    ],
  },
])
