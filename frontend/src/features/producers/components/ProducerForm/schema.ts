import { z } from 'zod'

// Ambas as funções aceitam apenas dígitos — responsabilidade de quem chama fazer a limpeza
function isValidCPF(cpf: string): boolean {
  if (cpf.length !== 11) return false
  if (/^(\d)\1+$/.test(cpf)) return false

  let sum = 0
  let rest
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
  rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(cpf.substring(9, 10))) return false

  sum = 0
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
  rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(cpf.substring(10, 11))) return false

  return true
}

function isValidCNPJ(cnpj: string): boolean {
  if (cnpj.length !== 14) return false
  if (/^(\d)\1+$/.test(cnpj)) return false

  let size = cnpj.length - 2
  let numbers = cnpj.substring(0, size)
  const digits = cnpj.substring(size)
  let sum = 0
  let pos = size - 7
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false

  size = size + 1
  numbers = cnpj.substring(0, size)
  sum = 0
  pos = size - 7
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) return false

  return true
}

export const producerFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  document: z.string().refine((val) => {
    const clean = val.replace(/[^\d]/g, '')
    if (clean.length === 11) return isValidCPF(clean)
    if (clean.length === 14) return isValidCNPJ(clean)
    return false
  }, 'CPF ou CNPJ inválido'),
  farms: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'O nome da fazenda deve ter pelo menos 2 caracteres'),
    city: z.string().min(2, 'A cidade deve ter pelo menos 2 caracteres'),
    state: z.string().length(2, 'Selecione um estado'),
    totalArea: z.number({ error: 'Informe a área total' }).min(0.1, 'A área deve ser maior que 0'),
    agriculturalArea: z.number({ error: 'Informe a área agricultável' }).min(0, 'A área não pode ser negativa'),
    vegetationArea: z.number({ error: 'Informe a área de vegetação' }).min(0, 'A área não pode ser negativa'),
    harvests: z.array(z.object({
      id: z.string().optional(),
      year: z.string().regex(/^\d{4}(\/\d{4})?$/, 'Formato de safra inválido (ex: 2024 ou 2024/2025)'),
      crops: z.array(z.object({
        id: z.string().optional(),
        name: z.string().min(1, 'Selecione uma cultura'),
      })).min(1, 'Adicione pelo menos uma cultura'),
    })).min(1, 'Adicione pelo menos uma safra'),
  })).min(1, 'Adicione pelo menos uma fazenda').superRefine((farms, ctx) => {
    farms.forEach((farm, index) => {
      if (farm.agriculturalArea + farm.vegetationArea > farm.totalArea) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A soma das áreas agricultável e de vegetação não pode ultrapassar a área total',
          path: [index, 'agriculturalArea'],
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A soma das áreas agricultável e de vegetação não pode ultrapassar a área total',
          path: [index, 'vegetationArea'],
        })
      }
    })
  }),
})

export type ProducerFormValues = z.infer<typeof producerFormSchema>
