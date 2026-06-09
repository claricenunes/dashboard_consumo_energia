export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    danger: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
    info: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    violet: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  }

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span
      className={`badge font-medium ${variants[variant] ?? variants.default} ${sizes[size] ?? sizes.sm} ${className}`}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const config = {
    success: { label: 'Dentro da Meta', variant: 'success' },
    warning: { label: 'Próximo da Meta', variant: 'warning' },
    danger: { label: 'Acima da Meta', variant: 'danger' },
  }
  const { label, variant } = config[status] ?? config.success
  return <Badge variant={variant}>{label}</Badge>
}

export function TurnoBadge({ turno }) {
  const config = {
    Manhã: { icon: '🌅', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
    Tarde: { icon: '☀️', className: 'bg-orange-500/10 text-orange-700 dark:text-orange-400' },
    Noite: { icon: '🌙', className: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' },
  }
  const cfg = config[turno] ?? config['Manhã']
  return (
    <span className={`badge font-medium text-xs px-2 py-0.5 ${cfg.className}`}>
      {cfg.icon} {turno}
    </span>
  )
}
