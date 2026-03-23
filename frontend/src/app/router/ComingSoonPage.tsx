import { Card, CardContent } from '@/shared/components/Card/Card'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'

interface ComingSoonPageProps {
  title: string
  description: string
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card>
        <CardContent className="p-6 text-sm text-slate-600">
          Esta tela será concluída nas próximas etapas.
        </CardContent>
      </Card>
    </div>
  )
}
