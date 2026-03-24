import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Pencil,
  Sprout,
  Trash2,
  TreePine,
} from 'lucide-react'
import { Button, buttonVariants } from '@/shared/components/Button/Button'
import { Card, CardContent } from '@/shared/components/Card/Card'
import { EmptyState } from '@/shared/components/EmptyState/EmptyState'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'
import { Skeleton } from '@/shared/components/Skeleton/Skeleton'
import { useDeleteProducerMutation, useGetProducerQuery } from '../api/producersApi'
import type { FarmSummary } from '../types'

function formatArea(value: number) {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' ha'
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

function ProducerDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6" role="status" aria-label="Carregando produtor">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-40" />
      <div className="flex gap-3">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Farm Card ─────────────────────────────────────────────────────────────

function FarmCard({ farm }: { farm: FarmSummary }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Farm header */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-slate-900">{farm.name}</h3>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 shrink-0">
            <MapPin className="h-3.5 w-3.5" />
            {farm.city} – {farm.state}
          </span>
        </div>

        {/* Areas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Área Total</p>
            <p className="text-sm font-medium text-slate-800">{formatArea(farm.totalArea)}</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3 text-center">
            <p className="text-xs text-emerald-700 mb-1">Agricultável</p>
            <p className="text-sm font-medium text-emerald-800">{formatArea(farm.agriculturalArea)}</p>
          </div>
          <div className="rounded-lg bg-teal-50 p-3 text-center">
            <p className="text-xs text-teal-700 mb-1">Vegetação</p>
            <p className="text-sm font-medium text-teal-800">{formatArea(farm.vegetationArea)}</p>
          </div>
        </div>

        {/* Harvests */}
        {farm.harvests.length > 0 ? (
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Safras
            </p>
            <div className="space-y-2">
              {farm.harvests.map((harvest) => (
                <div key={harvest.id} className="rounded-lg border border-slate-100 bg-white p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">{harvest.year}</span>
                  </div>
                  {harvest.crops.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {harvest.crops.map((crop) => (
                        <span
                          key={crop.id}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                        >
                          <TreePine className="h-3 w-3" />
                          {crop.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Nenhuma cultura cadastrada</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400 border-t border-slate-100 pt-3">
            Nenhuma safra cadastrada nesta fazenda.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────

export function ProducerDetail() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    data: producer,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProducerQuery(id, { skip: !id })

  const [deleteProducer, { isLoading: isDeleting }] = useDeleteProducerMutation()

  const is404 =
    isError &&
    (error as { status?: number })?.status === 404

  const handleDelete = async () => {
    if (!producer) return
    if (!window.confirm(`Excluir ${producer.name}?`)) return
    try {
      await deleteProducer(id).unwrap()
      navigate('/produtores')
    } catch {
      // Error is not a state in this page; user can retry from list
    }
  }

  // ── States ────────────────────────────────────────────────────────────

  if (isLoading) {
    return <ProducerDetailSkeleton />
  }

  if (is404) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <EmptyState
          icon={AlertTriangle}
          title="Produtor não encontrado"
          description="O cadastro solicitado não existe ou foi removido."
          action={
            <Link to="/produtores" className={buttonVariants({ variant: 'default' })}>
              Voltar para produtores
            </Link>
          }
        />
      </div>
    )
  }

  if (isError || !producer) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <EmptyState
          icon={AlertTriangle}
          title="Erro ao carregar produtor"
          description="Não foi possível obter os dados. Tente novamente."
          action={<Button onClick={() => void refetch()}>Tentar novamente</Button>}
        />
      </div>
    )
  }

  // ── Success ───────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/produtores')}
          className="text-slate-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Header */}
      <PageHeader
        title={producer.name}
        description={producer.document}
      />

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          to={`/produtores/${id}/editar`}
          aria-label="Editar"
          className={buttonVariants({ variant: 'outline' })}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Link>
        <Button
          variant="destructive"
          onClick={() => void handleDelete()}
          disabled={isDeleting}
          aria-label="Excluir"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? 'Excluindo...' : 'Excluir'}
        </Button>
      </div>

      {/* Farms */}
      <section aria-label="Fazendas">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Fazendas ({producer.farms.length})
        </h2>

        {producer.farms.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-400">Nenhuma fazenda cadastrada para este produtor.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {producer.farms.map((farm) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
