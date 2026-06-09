import { TrendUpIcon, TrendDownIcon } from '../ui/Icons'

export function MetricCard({ title, value, unit, icon: Icon, color = 'brand', trend, trendLabel }) {
  const colorMap = {
    brand: { bg: 'bg-brand-500/10', text: 'text-brand-500', iconBg: 'bg-brand-500' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', iconBg: 'bg-emerald-500' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', iconBg: 'bg-rose-500' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', iconBg: 'bg-amber-500' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', iconBg: 'bg-violet-500' },
    sky: { bg: 'bg-sky-500/10', text: 'text-sky-500', iconBg: 'bg-sky-500' },
  }

  const { bg, text, iconBg } = colorMap[color] ?? colorMap.brand
  const isPositive = trend > 0
  const isNegative = trend < 0

  return (
    <div className="card p-5 hover:shadow-card-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-md
              ${isPositive ? 'text-emerald-600 bg-emerald-500/10' : ''}
              ${isNegative ? 'text-rose-600 bg-rose-500/10' : ''}
              ${!isPositive && !isNegative ? 'text-slate-500 bg-slate-100 dark:bg-slate-700' : ''}`}
          >
            {isPositive && <TrendUpIcon />}
            {isNegative && <TrendDownIcon />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-1">
          {value}
          {unit && <span className="text-lg font-semibold text-slate-400 ml-1">{unit}</span>}
        </p>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        {trendLabel && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{trendLabel}</p>
        )}
      </div>
    </div>
  )
}
