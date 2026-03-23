import * as React from "react"
import { cn } from "../../utils/cn"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  children?: React.ReactNode
}

function EmptyState({ icon: Icon, title, description, action, children, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center animate-in fade-in-50",
        className
      )}
      data-testid="empty-state"
      {...props}
    >
      {Icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <Icon className="h-6 w-6 text-slate-500" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="mx-auto mb-4 mt-2 max-w-sm text-sm text-slate-500">
          {description}
        </p>
      )}
      {(action || children) && <div className="mt-4">{action || children}</div>}
    </div>
  )
}

export { EmptyState }
