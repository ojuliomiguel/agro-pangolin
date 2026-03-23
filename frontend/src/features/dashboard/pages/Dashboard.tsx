import { useGetDashboardQuery } from '../api/dashboardApi'
import { DashboardCharts } from '../components/DashboardCharts'
import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'
import { Skeleton } from '@/shared/components/Skeleton/Skeleton'
import { EmptyState } from '@/shared/components/EmptyState/EmptyState'
import { Button } from '@/shared/components/Button/Button'
import { useNavigate } from 'react-router-dom'
import { HardDrive, LayoutDashboard, Plus } from 'lucide-react'

export function Dashboard() {
  const navigate = useNavigate()
  const { data, isLoading, error, refetch } = useGetDashboardQuery()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Visão geral das fazendas cadastradas"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-[350px] w-full" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Visão geral das fazendas cadastradas"
        />
        <EmptyState
          title="Erro ao carregar dashboard"
          description="Não foi possível obter os dados. Tente novamente."
          action={
            <Button onClick={() => void refetch()}>
              Tentar novamente
            </Button>
          }
        />
      </div>
    )
  }

  const isEmpty = data.totalFarms === 0

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Visão geral das fazendas cadastradas"
        />
        <EmptyState
          title="Nenhuma fazenda cadastrada"
          description="Cadastre sua primeira fazenda para ver os dados aqui."
          action={
            <Button onClick={() => navigate('/produtores/novo')}>
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar produtor
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral das fazendas cadastradas"
      />
      
      <div className="grid gap-4 md:grid-cols-2">
        <KpiCard
          title="Total de Fazendas"
          value={data.totalFarms}
          icon={<LayoutDashboard className="h-4 w-4 text-slate-500" />}
        />
        <KpiCard
          title="Total de Hectares"
          value={data.totalHectares.toLocaleString()}
          icon={<HardDrive className="h-4 w-4 text-slate-500" />}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => navigate('/produtores')}>
          Ver produtores
        </Button>
        <Button onClick={() => navigate('/produtores/novo')}>
          Cadastrar produtor
        </Button>
      </div>

      <DashboardCharts
        byState={data.byState}
        byCrop={data.byCrop}
        bySoilUse={data.bySoilUse}
      />
    </div>
  )
}
