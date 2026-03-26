import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Home as HomeIcon, Menu, X } from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { to: '/', end: true, icon: HomeIcon, label: 'Home' },
  { to: '/dashboard', end: false, icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/produtores', end: false, icon: Users, label: 'Produtores' },
]

function navLinkClass({ isActive }: { isActive: boolean }) {
  return clsx(
    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
    isActive
      ? 'bg-emerald-50 text-emerald-700'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  )
}

function SidebarNav({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={navLinkClass}
          onClick={onNavClick}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-emerald-700">Agro Pangolin</span>
        </div>
        <SidebarNav />
      </aside>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col md:hidden transition-transform duration-200',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-hidden={!isMenuOpen}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-emerald-700">Agro Pangolin</span>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Fechar menu"
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarNav onNavClick={() => setIsMenuOpen(false)} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8">
          <button
            type="button"
            className="md:hidden mr-4 p-1 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
