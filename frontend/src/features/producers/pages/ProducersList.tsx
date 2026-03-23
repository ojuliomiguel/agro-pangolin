import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  PencilLine,
  Plus,
  Trash2,
  Users,
} from 'lucide-react'
import { buttonVariants, Button } from '@/shared/components/Button/Button'
import { Card, CardContent } from '@/shared/components/Card/Card'
import { EmptyState } from '@/shared/components/EmptyState/EmptyState'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'
import { Skeleton } from '@/shared/components/Skeleton/Skeleton'
import { cn } from '@/shared/utils/cn'
import { PRODUCERS_PAGE_LIMIT } from '../constants'
import { useDeleteProducerMutation, useGetProducersQuery } from '../api/producersApi'
import type { ProducerSummary } from '../types'

function formatFarmCount(count: number) {
  return count === 1 ? '1 fazenda' : `${count} fazendas`
}

function getRangeLabel(page: number, limit: number, total: number) {
  if (total === 0) {
    return '0 produtores'
  }

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return `${start}-${end} de ${total} produtores`
}

function ProducersListHeader() {
  return (
    <PageHeader
      title="Produtores"
      description="Lista paginada de produtores rurais cadastrados"
    >
      <Link
        to="/produtores/novo"
        className={buttonVariants({ variant: 'default' })}
      >
        <Plus className="mr-2 h-4 w-4" />
        Novo produtor
      </Link>
    </PageHeader>
  )
}

function ProducersListSkeleton() {
  return (
    <div className="space-y-6">
      <ProducersListHeader />

      <div role="status" aria-label="Carregando produtores" className="space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Fazendas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-40" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ProducersListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="space-y-6">
      <ProducersListHeader />

      <EmptyState
        icon={AlertTriangle}
        title="Erro ao carregar produtores"
        description="Não foi possível obter a listagem. Tente novamente."
        action={<Button onClick={onRetry}>Tentar novamente</Button>}
      />
    </div>
  )
}

function ProducersListEmpty() {
  return (
    <div className="space-y-6">
      <ProducersListHeader />

      <EmptyState
        icon={Users}
        title="Nenhum produtor cadastrado"
        description="Cadastre seu primeiro produtor para começar a usar a listagem."
        action={
          <Link
            to="/produtores/novo"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar produtor
          </Link>
        }
      />
    </div>
  )
}

export function ProducersList() {
  const [page, setPage] = useState(1)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteProducer] = useDeleteProducerMutation()
  const { currentData, error, isLoading, isFetching, refetch } = useGetProducersQuery({
    page,
    limit: PRODUCERS_PAGE_LIMIT,
  })

  const isLoadingState = isLoading || (!currentData && isFetching)

  useEffect(() => {
    setActionError(null)
  }, [page])

  useEffect(() => {
    if (!currentData || currentData.total === 0) return
    const totalPages = Math.max(1, Math.ceil(currentData.total / currentData.limit))
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [currentData, page])

  const handleDelete = async (producer: ProducerSummary) => {
    if (!window.confirm(`Excluir ${producer.name}?`)) return
    setActionError(null)
    setDeletingId(producer.id)
    try {
      await deleteProducer(producer.id).unwrap()
    } catch {
      setActionError(`Não foi possível excluir ${producer.name}. Tente novamente.`)
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoadingState) {
    return <ProducersListSkeleton />
  }

  if (error || !currentData) {
    return <ProducersListError onRetry={() => void refetch()} />
  }

  if (currentData.total === 0) {
    return <ProducersListEmpty />
  }

  const totalPages = Math.max(1, Math.ceil(currentData.total / currentData.limit))
  const canGoBack = page > 1 && !isFetching
  const canGoForward = page < totalPages && !isFetching
  const rangeLabel = getRangeLabel(page, currentData.limit, currentData.total)

  return (
    <div className="space-y-6">
      <ProducersListHeader />

      {actionError && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {actionError}
        </div>
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Fazendas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {currentData.data.map((producer) => (
                  <tr key={producer.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {producer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {producer.document}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatFarmCount(producer.farms.length)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/produtores/${producer.id}`}
                          aria-label={`Ver detalhe de ${producer.name}`}
                          className={cn(
                            buttonVariants({ variant: 'outline', size: 'sm' }),
                            'whitespace-nowrap'
                          )}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhe
                        </Link>
                        <Link
                          to={`/produtores/${producer.id}/editar`}
                          aria-label={`Editar ${producer.name}`}
                          className={cn(
                            buttonVariants({ variant: 'outline', size: 'sm' }),
                            'whitespace-nowrap'
                          )}
                        >
                          <PencilLine className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                        <button
                          type="button"
                          aria-label={`Excluir ${producer.name}`}
                          className={cn(
                            buttonVariants({ variant: 'destructive', size: 'sm' }),
                            'whitespace-nowrap'
                          )}
                          onClick={() => void handleDelete(producer)}
                          disabled={deletingId === producer.id}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">{rangeLabel}</p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => current - 1)}
            disabled={!canGoBack}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm text-slate-600">
            Página {page} de {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => current + 1)}
            disabled={!canGoForward}
          >
            Próxima
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
