import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { SunIcon, MoonIcon, RefreshIcon, TrashIcon, DownloadIcon, BoltIcon } from '../components/ui/Icons'
import { exportSectors, exportOperators } from '../utils/exportCSV'

export function Settings() {
  const { theme, toggleTheme, isDark } = useTheme()
  const { sectors, operators, resetData, clearAllData, toast } = useApp()

  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  function handleReset() {
    resetData()
    toast.success('Dados restaurados para o estado inicial.')
  }

  function handleClear() {
    clearAllData()
    toast.warning('Todos os dados foram removidos.')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-title">Configurações</h1>
        <p className="page-subtitle">Preferências e gerenciamento do sistema</p>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Aparência
        </h2>
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Tema</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Alternar entre modo claro e escuro
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-all duration-300
              ${isDark ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'}`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 flex items-center justify-center
                ${isDark ? 'left-8' : 'left-1'}`}
            >
              {isDark ? (
                <MoonIcon className="w-3 h-3 text-brand-500" />
              ) : (
                <SunIcon className="w-3 h-3 text-amber-500" />
              )}
            </span>
          </button>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Tema atual: <span className="font-semibold">{isDark ? 'Escuro' : 'Claro'}</span>
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Dados do Sistema
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center">
            <p className="text-3xl font-bold text-brand-500">{sectors.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Setores</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center">
            <p className="text-3xl font-bold text-violet-500">{operators.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Operadores</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Exportar Setores
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Baixar dados dos setores em CSV
              </p>
            </div>
            <button
              onClick={() => { exportSectors(sectors); toast.info('Exportação iniciada.') }}
              className="btn btn-secondary text-xs"
              disabled={!sectors.length}
            >
              <DownloadIcon className="w-4 h-4" />
              CSV
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Exportar Operadores
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Baixar dados dos operadores em CSV
              </p>
            </div>
            <button
              onClick={() => { exportOperators(operators, sectors); toast.info('Exportação iniciada.') }}
              className="btn btn-secondary text-xs"
              disabled={!operators.length}
            >
              <DownloadIcon className="w-4 h-4" />
              CSV
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Restaurar Dados Padrão
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Recarrega os dados de demonstração iniciais
              </p>
            </div>
            <button
              onClick={() => setConfirmReset(true)}
              className="btn btn-secondary text-xs"
            >
              <RefreshIcon className="w-4 h-4" />
              Restaurar
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                Limpar Todos os Dados
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Remove permanentemente todos os dados do sistema
              </p>
            </div>
            <button
              onClick={() => setConfirmClear(true)}
              className="btn btn-danger text-xs"
            >
              <TrashIcon className="w-4 h-4" />
              Limpar
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
          Sobre o Sistema
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow">
            <BoltIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">SmartGrid</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dashboard de Consumo de Energia — v1.0.0</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400">
          {[
            ['Stack', 'React 18 + Vite 5'],
            ['Estilos', 'Tailwind CSS 3'],
            ['Gráficos', 'Chart.js 4'],
            ['Persistência', 'LocalStorage'],
          ].map(([k, v]) => (
            <div key={k}>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{k}:</span> {v}
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleReset}
        title="Restaurar Dados Padrão"
        message="Os dados atuais serão substituídos pelos dados de demonstração. Continuar?"
        confirmLabel="Restaurar"
        variant="warning"
      />

      <ConfirmDialog
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={handleClear}
        title="Limpar Todos os Dados"
        message="Todos os setores e operadores serão removidos permanentemente. Esta ação não pode ser desfeita!"
        confirmLabel="Limpar Tudo"
        variant="danger"
      />
    </div>
  )
}
