import { Link } from 'react-router-dom'
import { buttonVariants } from '@/shared/components/Button/Button'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'

export function NotFoundPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Página não encontrada"
        description="A rota acessada não existe nesta aplicação."
      />
      <Link to="/" className={buttonVariants({ variant: 'outline' })}>
        Voltar para a Home
      </Link>
    </div>
  )
}
