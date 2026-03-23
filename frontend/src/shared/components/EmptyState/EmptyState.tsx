import * as React from "react"
import { cn } from "../../utils/cn"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description?: string
  children?: React.ReactNode
}

function EmptyState({ icon: Icon, title, description, children, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center animate-in fade-in-50 dark:border-slate-800 dark:bg-slate-900/50",
        className
      )}
      data-testid="empty-state"
      {...props}
    >
      {Icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <Icon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
      {description && (
        <p className="mb-4 mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

export { EmptyState }
