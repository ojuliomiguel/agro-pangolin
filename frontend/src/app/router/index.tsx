import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { MainLayout } from '@/shared/components/MainLayout'
import { Home } from '@/features/home/pages/Home'
import { Dashboard } from '@/features/dashboard/pages/Dashboard'
import { ProducersList } from '@/features/producers/pages/ProducersList'
import { CreateProducer } from '@/features/producers/pages/CreateProducer'
import { ComingSoonPage } from './ComingSoonPage'

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
            element: (
              <ComingSoonPage
                title="Detalhe do produtor"
                description="A visualização detalhada do cadastro vem na etapa 5."
              />
            ),
          },
          {
            path: ':id/editar',
            element: (
              <ComingSoonPage
                title="Editar produtor"
                description="A edição do cadastro vem na etapa 6."
              />
            ),
          },
        ]
      },
    ],
  },
]

export const router = createBrowserRouter(routeConfig)
