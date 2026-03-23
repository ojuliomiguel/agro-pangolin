import { Link } from 'react-router-dom'
import { FilePlus, LayoutDashboard, Users } from 'lucide-react'
import { PageHeader } from '../../../shared/components/PageHeader/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/Card/Card'
import { Button } from '../../../shared/components/Button/Button'

export function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageHeader 
        title="Agro Pangolin" 
        description="Sistema de gestão de produtores rurais e visão analítica." 
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-50">Visão Analítica</CardTitle>
            <CardDescription className="mt-1">
              Consulte indicadores consolidados sobre fazendas, culturas e uso de solo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
            >
              Ver dashboard &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2">
              <Users className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-50">Gestão de Produtores</CardTitle>
            <CardDescription className="mt-1">
              Administre cadastros de produtores rurais, propriedades e culturas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/produtores"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
            >
              Gerenciar produtores &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <Link to="/produtores/novo" tabIndex={-1}>
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500">
            <FilePlus className="w-4 h-4" />
            Cadastrar produtor
          </Button>
        </Link>
      </div>
    </div>
  )
}
