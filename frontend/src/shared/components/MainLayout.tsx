import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Home as HomeIcon } from 'lucide-react'
import { clsx } from 'clsx'

export function MainLayout() {
  const navItems = [
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/produtores', icon: Users, label: 'Produtores' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-emerald-700">Agro Pangolin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
