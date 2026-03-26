import { Link } from 'react-router-dom'
import { FilePlus, LayoutDashboard, Users, TrendingUp, Map, Sprout, ArrowRight } from 'lucide-react'
import { Button } from '../../../shared/components/Button/Button'
import { useGetDashboardQuery } from '../../dashboard/api/dashboardApi'
import { Skeleton } from '../../../shared/components/Skeleton/Skeleton'

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  loading?: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm">
      <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        {loading ? (
          <Skeleton className="h-6 w-16 mt-1" />
        ) : (
          <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
        )}
      </div>
    </div>
  )
}

function FeatureCard({
  to,
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  linkLabel,
}: {
  to: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  title: string
  description: string
  linkLabel: string
}) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col gap-4"
    >
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-800 text-base mb-1">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:text-emerald-700 transition-colors">
        {linkLabel}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  )
}

export function Home() {
  const { data, isLoading } = useGetDashboardQuery()

  const topCrop = data?.byCrop?.reduce(
    (best, curr) => (curr.count > best.count ? curr : best),
    { crop: '—', count: 0 },
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sprout className="w-6 h-6 text-emerald-200" />
              <span className="text-emerald-200 text-sm font-medium uppercase tracking-widest">
                Agro Pangolin
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight">
              Gestão de produtores rurais
            </h1>
            <p className="mt-2 text-emerald-100 text-sm max-w-md">
              Centralize cadastros, acompanhe propriedades e acesse indicadores analíticos em um só lugar.
            </p>
          </div>
          <Link to="/produtores/novo" tabIndex={-1}>
            <Button className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold shadow-none whitespace-nowrap">
              <FilePlus className="w-4 h-4" />
              Cadastrar produtor
            </Button>
          </Link>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Resumo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total de fazendas"
            value={data?.totalFarms ?? 0}
            icon={Map}
            loading={isLoading}
          />
          <StatCard
            label="Hectares registrados"
            value={
              data?.totalHectares != null
                ? data.totalHectares.toLocaleString('pt-BR')
                : 0
            }
            icon={TrendingUp}
            loading={isLoading}
          />
          <StatCard
            label="Cultura principal"
            value={topCrop?.crop ?? '—'}
            icon={Sprout}
            loading={isLoading}
          />
        </div>
      </div>

      {/* Navegação */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Acesso rápido
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FeatureCard
            to="/produtores"
            icon={Users}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            title="Gestão de Produtores"
            description="Administre cadastros de produtores rurais, propriedades e culturas agrícolas."
            linkLabel="Gerenciar produtores"
          />
          <FeatureCard
            to="/dashboard"
            icon={LayoutDashboard}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            title="Visão Analítica"
            description="Consulte indicadores consolidados sobre fazendas, culturas e uso de solo."
            linkLabel="Ver dashboard"
          />
        </div>
      </div>
    </div>
  )
}
