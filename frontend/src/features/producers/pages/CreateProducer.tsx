import { useNavigate } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'
import { useCreateProducerMutation } from '../api/producersApi'
import { ProducerForm } from '../components/ProducerForm/ProducerForm'
import { producerFormSchema, type ProducerFormValues } from '../components/ProducerForm/schema'
import { useState } from 'react'

export function CreateProducer() {
  const navigate = useNavigate()
  const [createProducer, { isLoading }] = useCreateProducerMutation()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const methods = useForm<ProducerFormValues>({
    resolver: zodResolver(producerFormSchema),
    defaultValues: {
      name: '',
      document: '',
      farms: [],
    },
  })

  const onSubmit = async (values: ProducerFormValues) => {
    setSubmitError(null)
    try {
      await createProducer(values).unwrap()
      navigate('/produtores')
    } catch (error: unknown) {
      const msg = (error as { data?: { message?: string } })?.data?.message
      setSubmitError(msg || 'Erro ao salvar produtor. Verifique os dados e tente novamente.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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

      <PageHeader
        title="Novo Produtor"
        description="Preencha os dados abaixo para cadastrar um novo produtor e suas propriedades."
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
              onClick={() => navigate('/produtores')}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Produtor'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
