import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Card, CardContent } from '@/shared/components/Card/Card'
import { FormField } from '@/shared/components/FormField/FormField'
import { Input } from '@/shared/components/Input/Input'
import { Select } from '@/shared/components/Select/Select'
import { BRAZIL_STATES, CROPS } from '../../constants'
import type { ProducerFormValues } from './schema'

export function ProducerForm() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<ProducerFormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'farms',
  })

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-900">Dados do Produtor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Nome completo"
              error={errors.name?.message}
              id="producer-name"
            >
              <Input
                id="producer-name"
                {...register('name')}
                placeholder="Ex: João da Silva"
                error={!!errors.name}
              />
            </FormField>

            <FormField
              label="CPF ou CNPJ"
              error={errors.document?.message}
              id="producer-document"
            >
              <Input
                id="producer-document"
                {...register('document')}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                error={!!errors.document}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Propriedades (Fazendas)</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                name: '',
                city: '',
                state: '',
                totalArea: 0,
                agriculturalArea: 0,
                vegetationArea: 0,
                harvests: [],
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Fazenda
          </Button>
        </div>

        {fields.map((field, index) => (
          <FarmItem key={field.id} index={index} onRemove={() => remove(index)} />
        ))}

        {fields.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
            Nenhuma fazenda adicionada. Clique em "Adicionar Fazenda" para começar.
          </p>
        )}
      </div>
    </div>
  )
}

function FarmItem({ index, onRemove }: { index: number; onRemove: () => void }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProducerFormValues>()

  const farmErrors = errors.farms?.[index]
  const farmId = `farm-${index}`

  return (
    <Card className="relative overflow-visible">
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-3 -right-3 h-8 w-8 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:text-red-500 hover:border-red-200 shadow-sm transition-colors z-10"
        title="Remover fazenda"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Nome da Fazenda"
            error={farmErrors?.name?.message}
            id={`${farmId}-name`}
          >
            <Input
              id={`${farmId}-name`}
              {...register(`farms.${index}.name`)}
              placeholder="Ex: Fazenda Bela Vista"
              error={!!farmErrors?.name}
            />
          </FormField>

          <FormField
            label="Cidade"
            error={farmErrors?.city?.message}
            id={`${farmId}-city`}
          >
            <Input
              id={`${farmId}-city`}
              {...register(`farms.${index}.city`)}
              placeholder="Ex: Ribeirão Preto"
              error={!!farmErrors?.city}
            />
          </FormField>

          <FormField
            label="Estado"
            error={farmErrors?.state?.message}
            id={`${farmId}-state`}
          >
            <Select
              id={`${farmId}-state`}
              {...register(`farms.${index}.state`)}
              error={!!farmErrors?.state}
            >
              <option value="">Selecione...</option>
              {BRAZIL_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Área Total (ha)"
            error={farmErrors?.totalArea?.message}
            id={`${farmId}-totalArea`}
          >
            <Input
              id={`${farmId}-totalArea`}
              type="number"
              step="0.01"
              {...register(`farms.${index}.totalArea`, { valueAsNumber: true })}
              error={!!farmErrors?.totalArea}
            />
          </FormField>

          <FormField
            label="Área Agricultável (ha)"
            error={farmErrors?.agriculturalArea?.message}
            id={`${farmId}-agriculturalArea`}
          >
            <Input
              id={`${farmId}-agriculturalArea`}
              type="number"
              step="0.01"
              {...register(`farms.${index}.agriculturalArea`, { valueAsNumber: true })}
              error={!!farmErrors?.agriculturalArea}
            />
          </FormField>

          <FormField
            label="Área Vegetação (ha)"
            error={farmErrors?.vegetationArea?.message}
            id={`${farmId}-vegetationArea`}
          >
            <Input
              id={`${farmId}-vegetationArea`}
              type="number"
              step="0.01"
              {...register(`farms.${index}.vegetationArea`, { valueAsNumber: true })}
              error={!!farmErrors?.vegetationArea}
            />
          </FormField>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <HarvestFieldArray farmIndex={index} />
        </div>
      </CardContent>
    </Card>
  )
}

function HarvestFieldArray({ farmIndex }: { farmIndex: number }) {
  const { control } = useFormContext<ProducerFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `farms.${farmIndex}.harvests`,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700">Safras</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => append({ year: '', crops: [] })}
        >
          <Plus className="mr-1 h-3 w-3" />
          Adicionar Safra
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {fields.map((field, index) => (
          <HarvestItem
            key={field.id}
            farmIndex={farmIndex}
            harvestIndex={index}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </div>
  )
}

function HarvestItem({
  farmIndex,
  harvestIndex,
  onRemove,
}: {
  farmIndex: number
  harvestIndex: number
  onRemove: () => void
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProducerFormValues>()

  const harvestErrors = errors.farms?.[farmIndex]?.harvests?.[harvestIndex]
  const harvestId = `farm-${farmIndex}-harvest-${harvestIndex}`

  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 relative group">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100"
        title="Remover safra"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="space-y-4">
        <FormField
          label="Ano da Safra"
          error={harvestErrors?.year?.message}
          className="max-w-[200px]"
          id={`${harvestId}-year`}
        >
          <Input
            id={`${harvestId}-year`}
            {...register(`farms.${farmIndex}.harvests.${harvestIndex}.year`)}
            placeholder="Ex: 2024/2025"
            error={!!harvestErrors?.year}
          />
        </FormField>

        <CropFieldArray farmIndex={farmIndex} harvestIndex={harvestIndex} />
      </div>
    </div>
  )
}

function CropFieldArray({
  farmIndex,
  harvestIndex,
}: {
  farmIndex: number
  harvestIndex: number
}) {
  const { control, formState: { errors } } = useFormContext<ProducerFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `farms.${farmIndex}.harvests.${harvestIndex}.crops`,
  })

  const cropArrayError =
    errors.farms?.[farmIndex]?.harvests?.[harvestIndex]?.crops?.root?.message ??
    errors.farms?.[farmIndex]?.harvests?.[harvestIndex]?.crops?.message

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Culturas Plantadas
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => append({ name: '' })}
        >
          <Plus className="mr-1 h-3 w-3" />
          Adicionar Cultura
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <CropItem
            key={field.id}
            farmIndex={farmIndex}
            harvestIndex={harvestIndex}
            cropIndex={index}
            onRemove={() => remove(index)}
          />
        ))}
        {cropArrayError && (
          <span className="text-xs text-red-500 font-medium">{cropArrayError}</span>
        )}
      </div>
    </div>
  )
}

function CropItem({
  farmIndex,
  harvestIndex,
  cropIndex,
  onRemove,
}: {
  farmIndex: number
  harvestIndex: number
  cropIndex: number
  onRemove: () => void
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProducerFormValues>()

  const cropErrors =
    errors.farms?.[farmIndex]?.harvests?.[harvestIndex]?.crops?.[cropIndex]
  const cropId = `farm-${farmIndex}-harvest-${harvestIndex}-crop-${cropIndex}`

  return (
    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md pl-1 pr-2 py-1 shadow-sm">
      <Select
        id={cropId}
        aria-label="Cultura"
        {...register(
          `farms.${farmIndex}.harvests.${harvestIndex}.crops.${cropIndex}.name`
        )}
        className="h-7 py-0 px-2 text-xs border-0 focus-visible:ring-0 w-32"
        error={!!cropErrors?.name}
      >
        <option value="">Cultura...</option>
        {CROPS.map((crop) => (
          <option key={crop} value={crop}>
            {crop}
          </option>
        ))}
      </Select>
      <button
        type="button"
        onClick={onRemove}
        className="text-slate-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}
