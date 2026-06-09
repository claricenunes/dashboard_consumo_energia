export function formatKWh(value, decimals = 1) {
  const n = Number(value)
  if (isNaN(n)) return '0 kWh'
  return `${n.toFixed(decimals)} kWh`
}

export function formatPercent(value, decimals = 0) {
  const n = Number(value)
  if (isNaN(n)) return '0%'
  return `${n.toFixed(decimals)}%`
}

export function formatDate(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateTime(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(Number(value))
}

export const TURNO_CONFIG = {
  Manhã: { icon: '🌅', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  Tarde: { icon: '☀️', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  Noite: { icon: '🌙', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
}
