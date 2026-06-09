import { useLocation } from 'react-router-dom'
import { MenuIcon, BoltIcon } from '../ui/Icons'
import { useApp } from '../../context/AppContext'
import { calcSetoresEmAlerta } from '../../utils/calculations'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/setores': 'Gestão de Setores',
  '/operadores': 'Gestão de Operadores',
  '/configuracoes': 'Configurações',
}

const PAGE_SUBTITLES = {
  '/': 'Visão geral do consumo energético',
  '/setores': 'Monitore e gerencie os setores industriais',
  '/operadores': 'Gerencie os operadores por setor e turno',
  '/configuracoes': 'Preferências e gerenciamento de dados',
}

export function Navbar({ onMenuToggle }) {
  const location = useLocation()
  const { sectors } = useApp()
  const alertCount = calcSetoresEmAlerta(sectors)
  const title = PAGE_TITLES[location.pathname] ?? 'SmartGrid'
  const subtitle = PAGE_SUBTITLES[location.pathname] ?? ''

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <div className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center">
            <BoltIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">SmartGrid</span>
        </div>

        <div className="hidden lg:block">
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {alertCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {alertCount} setor{alertCount > 1 ? 'es' : ''} em alerta
            </span>
          </div>
        )}

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/50">
          <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Admin</span>
        </div>
      </div>
    </header>
  )
}
