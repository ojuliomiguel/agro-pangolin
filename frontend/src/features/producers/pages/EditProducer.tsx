import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'
import { Skeleton } from '@/shared/components/Skeleton/Skeleton'
import { Card, CardContent } from '@/shared/components/Card/Card'
import { EmptyState } from '@/shared/components/EmptyState/EmptyState'
import { useGetProducerQuery, useUpdateProducerMutation } from '../api/producersApi'
import { ProducerForm } from '../components/ProducerForm/ProducerForm'
import { producerFormSchema, type ProducerFormValues } from '../components/ProducerForm/schema'
import { toFormValues } from '../mappers/toFormValues'


function EditProducerSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6" role="status" aria-label="Carregando produtor">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-96" />
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export function EditProducer() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    data: producer,
    isLoading,
    isError,
    refetch,
  } = useGetProducerQuery(id, { skip: !id })

  const [updateProducer, { isLoading: isSubmitting }] = useUpdateProducerMutation()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const methods = useForm<ProducerFormValues>({
    resolver: zodResolver(producerFormSchema),
    defaultValues: {
      name: '',
      document: '',
      farms: [],
    },
  })

  useEffect(() => {
    if (producer) {
      methods.reset(toFormValues(producer))
    }
  }, [producer, methods])

  const onSubmit = async (values: ProducerFormValues) => {
    setSubmitError(null)
    try {
      await updateProducer({ id, ...values }).unwrap()
      navigate(`/produtores/${id}`)
    } catch (error: unknown) {
      const msg = (error as { data?: { message?: string } })?.data?.message
      setSubmitError(msg || 'Erro ao salvar alterações. Verifique os dados e tente novamente.')
    }
  }

  if (isLoading) {
    return <EditProducerSkeleton />
  }

  if (isError || !producer) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <EmptyState
          icon={AlertTriangle}
          title="Erro ao carregar produtor"
          description="Não foi possível obter os dados para edição. Tente novamente."
          action={<Button onClick={() => void refetch()}>Tentar novamente</Button>}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/produtores/${id}`)}
          className="text-slate-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <PageHeader
        title="Editar Produtor"
        description={`Editando dados de ${producer.name}`}
      />

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{submitError}</p>
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="pb-20">
          <ProducerForm />

          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/produtores/${id}`)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
