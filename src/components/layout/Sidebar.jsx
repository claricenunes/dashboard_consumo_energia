import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useApp } from '../../context/AppContext'
import {
  BoltIcon,
  BuildingIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  SunIcon,
  MoonIcon,
  XIcon,
} from '../ui/Icons'
import { calcSetoresEmAlerta } from '../../utils/calculations'

const NAV_ITEMS = [
  { to: '/', icon: ChartBarIcon, label: 'Dashboard' },
  { to: '/setores', icon: BuildingIcon, label: 'Setores' },
  { to: '/operadores', icon: UsersIcon, label: 'Operadores' },
  { to: '/configuracoes', icon: CogIcon, label: 'Configurações' },
]

export function Sidebar({ isOpen, onClose }) {
  const { theme, toggleTheme, isDark } = useTheme()
  const { sectors } = useApp()
  const alertCount = calcSetoresEmAlerta(sectors)

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-slate-900 border-r border-slate-800
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow">
              <BoltIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-sm tracking-wide">SmartGrid</span>
              <p className="text-slate-500 text-xs">Monitor de Energia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Menu Principal
          </p>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active text-brand-400' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-400' : ''}`} />
                  <span className="flex-1">{label}</span>
                  {label === 'Setores' && alertCount > 0 && (
                    <span className="ml-auto w-5 h-5 flex items-center justify-center rounded-full bg-rose-500 text-white text-xs font-bold">
                      {alertCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4 pt-2 border-t border-slate-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="sidebar-link w-full"
          >
            {isDark ? (
              <SunIcon className="w-5 h-5 shrink-0 text-amber-400" />
            ) : (
              <MoonIcon className="w-5 h-5 shrink-0 text-slate-400" />
            )}
            <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>

          <div className="px-3 py-2.5 rounded-lg bg-slate-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 border-2 border-brand-500/40 flex items-center justify-center text-brand-400 text-sm font-bold">
                A
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">Administrador</p>
                <p className="text-xs text-slate-500">Sistema Industrial</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
