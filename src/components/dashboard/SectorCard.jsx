import { getSectorStatus, getStatusColors, calcConsumoPercentual } from '../../utils/calculations'
import { StatusBadge } from '../ui/Badge'
import { useApp } from '../../context/AppContext'
import { formatKWh } from '../../utils/formatters'
import { BuildingIcon } from '../ui/Icons'

export function SectorCard({ sector }) {
  const { operators } = useApp()
  const status = getSectorStatus(sector.consumo_atual, sector.consumo_meta)
  const colors = getStatusColors(status)
  const pct = Math.min(calcConsumoPercentual(sector.consumo_atual, sector.consumo_meta), 100)
  const overPct = Math.max(0, calcConsumoPercentual(sector.consumo_atual, sector.consumo_meta) - 100)
  const operatorCount = operators.filter((o) => o.setorId === sector.id).length

  const borderClasses = {
    success: 'border-l-emerald-500',
    warning: 'border-l-amber-500',
    danger: 'border-l-rose-500',
  }

  const barClasses = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  }

  const headerGradients = {
    success: 'from-emerald-500/5 to-transparent',
    warning: 'from-amber-500/5 to-transparent',
    danger: 'from-rose-500/5 to-transparent',
  }

  return (
    <div
      className={`card p-0 border-l-4 ${borderClasses[status]} overflow-hidden
        hover:shadow-card-md transition-all duration-200`}
    >
      <div className={`px-5 pt-4 pb-3 bg-gradient-to-r ${headerGradients[status]}`}>
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <BuildingIcon className={`w-4 h-4 ${colors.text} ${colors.textDark}`} />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {sector.categoria}
            </span>
          </div>
          <StatusBadge status={status} />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
          {sector.nome}
        </h3>
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className={`text-2xl font-bold ${colors.text} ${colors.textDark} leading-none`}>
              {formatKWh(sector.consumo_atual)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Meta: {formatKWh(sector.consumo_meta)}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${colors.text} ${colors.textDark} leading-none`}>
              {calcConsumoPercentual(sector.consumo_atual, sector.consumo_meta)}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              da meta
            </p>
          </div>
        </div>

        <div className="relative h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barClasses[status]}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {overPct > 0 && (
          <p className="text-xs font-medium text-rose-500 mt-1.5">
            +{formatKWh(sector.consumo_atual - sector.consumo_meta)} acima da meta
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {operatorCount} operador{operatorCount !== 1 ? 'es' : ''}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Atualizado hoje
          </span>
        </div>
      </div>
    </div>
  )
}
