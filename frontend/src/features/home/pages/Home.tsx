import { Link } from 'react-router-dom'
import { FilePlus, LayoutDashboard, Users } from 'lucide-react'

export function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Agro Pangolin</h1>
        <p className="mt-2 text-lg text-gray-600">
          Sistema de gestão de produtores rurais e visão analítica.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Dashboard Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Visão Analítica</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Consulte indicadores consolidados sobre fazendas, culturas e uso de solo.
          </p>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Ver dashboard &rarr;
          </Link>
        </div>

        {/* Produtores Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Gestão de Produtores</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Administre cadastros de produtores rurais, propriedades e culturas.
          </p>
          <Link
            to="/produtores"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Gerenciar produtores &rarr;
          </Link>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <Link
          to="/produtores/novo"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors"
        >
          <FilePlus className="w-4 h-4" />
          Cadastrar produtor
        </Link>
      </div>
    </div>
  )
}
