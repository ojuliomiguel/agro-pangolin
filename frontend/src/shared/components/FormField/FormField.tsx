import { cn } from '@/shared/utils/cn'

interface FormFieldProps {
  label?: string
  error?: string
  children: React.ReactNode
  className?: string
  id?: string
}

export function FormField({ label, error, children, className, id }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>}
      {children}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}
