import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/shared/components/MainLayout'
import { Home } from '@/features/home/pages/Home'

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
        element: <div>Dashboard Content (Em Breve)</div>,
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
