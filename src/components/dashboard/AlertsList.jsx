import { getSectorStatus, getStatusColors } from '../../utils/calculations'
import { formatKWh } from '../../utils/formatters'
import { ExclamationIcon, CheckIcon } from '../ui/Icons'
import { Link } from 'react-router-dom'

export function AlertsList({ sectors }) {
  const alerts = sectors
    .filter((s) => getSectorStatus(s.consumo_atual, s.consumo_meta) !== 'success')
    .sort((a, b) => b.consumo_atual / b.consumo_meta - a.consumo_atual / a.consumo_meta)

  if (!alerts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
          <CheckIcon className="w-6 h-6 text-emerald-500" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Todos os setores estão dentro da meta!
        </p>
        <p className="text-xs text-slate-400 mt-1">Sistema operando normalmente</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {alerts.map((sector) => {
        const status = getSectorStatus(sector.consumo_atual, sector.consumo_meta)
        const colors = getStatusColors(status)
        const over = sector.consumo_atual - sector.consumo_meta
        const pct = Math.round((sector.consumo_atual / sector.consumo_meta) * 100)

        return (
          <div
            key={sector.id}
            className={`flex items-center gap-3 p-3 rounded-lg border ${colors.bg} ${colors.border}/30`}
          >
            <ExclamationIcon className={`w-4 h-4 shrink-0 ${colors.text} ${colors.textDark}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {sector.nome}
              </p>
              <p className={`text-xs ${colors.text} ${colors.textDark}`}>
                {pct}% da meta
                {status === 'danger' && ` · +${formatKWh(over)} acima`}
              </p>
            </div>
            <Link
              to="/setores"
              className="text-xs font-medium text-slate-500 hover:text-brand-500 transition-colors shrink-0"
            >
              Ver →
            </Link>
          </div>
        )
      })}
    </div>
  )
}
