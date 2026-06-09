export function getSectorStatus(consumo_atual, consumo_meta) {
  if (consumo_meta <= 0) return 'success'
  const ratio = consumo_atual / consumo_meta
  if (ratio >= 1.0) return 'danger'
  if (ratio >= 0.8) return 'warning'
  return 'success'
}

export function getSectorStatusLabel(status) {
  const map = {
    success: 'Dentro da Meta',
    warning: 'Próximo da Meta',
    danger: 'Acima da Meta',
  }
  return map[status] ?? 'Dentro da Meta'
}

export function getStatusColors(status) {
  const map = {
    success: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600',
      textDark: 'dark:text-emerald-400',
      border: 'border-emerald-500',
      borderL: 'border-l-emerald-500',
      bar: 'bg-emerald-500',
      ring: 'ring-emerald-500',
      gradient: 'from-emerald-500 to-emerald-400',
      hex: '#10b981',
    },
    warning: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600',
      textDark: 'dark:text-amber-400',
      border: 'border-amber-500',
      borderL: 'border-l-amber-500',
      bar: 'bg-amber-500',
      ring: 'ring-amber-500',
      gradient: 'from-amber-500 to-amber-400',
      hex: '#f59e0b',
    },
    danger: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-600',
      textDark: 'dark:text-rose-400',
      border: 'border-rose-500',
      borderL: 'border-l-rose-500',
      bar: 'bg-rose-500',
      ring: 'ring-rose-500',
      gradient: 'from-rose-500 to-rose-400',
      hex: '#f43f5e',
    },
  }
  return map[status] ?? map.success
}

export function calcTotalConsumo(sectors) {
  return sectors.reduce((acc, s) => acc + Number(s.consumo_atual), 0)
}

export function calcTotalMeta(sectors) {
  return sectors.reduce((acc, s) => acc + Number(s.consumo_meta), 0)
}

export function calcSetoresAcimaDaMeta(sectors) {
  return sectors.filter((s) => getSectorStatus(s.consumo_atual, s.consumo_meta) === 'danger').length
}

export function calcSetoresEmAlerta(sectors) {
  return sectors.filter((s) => getSectorStatus(s.consumo_atual, s.consumo_meta) !== 'success').length
}

export function calcEfficiencyScore(sectors) {
  if (!sectors.length) return 100
  const scores = sectors.map((s) => {
    if (s.consumo_meta <= 0) return 1
    const excess = Math.max(0, s.consumo_atual - s.consumo_meta)
    return Math.max(0, 1 - excess / s.consumo_meta)
  })
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.round(avg * 100)
}

export function calcConsumoPercentual(consumo_atual, consumo_meta) {
  if (consumo_meta <= 0) return 0
  return Math.round((consumo_atual / consumo_meta) * 100)
}

export function calcEconomiaPotencial(sectors) {
  return sectors
    .filter((s) => s.consumo_atual > s.consumo_meta)
    .reduce((acc, s) => acc + (s.consumo_atual - s.consumo_meta), 0)
}

export function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export function generateTrend(sectorId, currentValue, days = 7) {
  const hash = sectorId.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0)
  return Array.from({ length: days }, (_, i) => {
    const r = seededRandom(hash + i * 13)
    const variation = (r - 0.5) * 0.28
    return Math.max(0, Math.round(currentValue * (1 + variation)))
  })
}

export function calcTotalTrend(sectors, days = 7) {
  if (!sectors.length) return Array(days).fill(0)
  const trends = sectors.map((s) => generateTrend(s.id, s.consumo_atual, days))
  return Array.from({ length: days }, (_, i) =>
    Math.round(trends.reduce((acc, t) => acc + t[i], 0))
  )
}

export const CHART_COLORS = [
  '#0ea5e9',
  '#8b5cf6',
  '#f97316',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#14b8a6',
  '#6366f1',
  '#ef4444',
  '#84cc16',
]

export const WEEK_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
