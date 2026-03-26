import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { MainLayout } from '@/shared/components/MainLayout'
import { Home } from '@/features/home/pages/Home'
import { Dashboard } from '@/features/dashboard/pages/Dashboard'
import { ProducersList } from '@/features/producers/pages/ProducersList'
import { CreateProducer } from '@/features/producers/pages/CreateProducer'
import { ProducerDetail } from '@/features/producers/pages/ProducerDetail'
import { EditProducer } from '@/features/producers/pages/EditProducer'
import { NotFoundPage } from './NotFoundPage'

export const routeConfig: RouteObject[] = [
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
            element: <ProducersList />,
          },
          {
            path: 'novo',
            element: <CreateProducer />,
          },
          {
            path: ':id',
            element: <ProducerDetail />,
          },
          {
            path: ':id/editar',
            element: <EditProducer />,
          },
        ]
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]

export const router = createBrowserRouter(routeConfig)
