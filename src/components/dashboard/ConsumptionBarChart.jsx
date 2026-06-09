import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useTheme } from '../../context/ThemeContext'
import { getSectorStatus } from '../../utils/calculations'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function ConsumptionBarChart({ sectors }) {
  const { isDark } = useTheme()

  const textColor = isDark ? '#94a3b8' : '#64748b'
  const gridColor = isDark ? 'rgba(51,65,85,0.6)' : 'rgba(226,232,240,0.8)'
  const bgColor = isDark ? '#1e293b' : '#ffffff'

  const barColors = sectors.map((s) => {
    const st = getSectorStatus(s.consumo_atual, s.consumo_meta)
    if (st === 'danger') return 'rgba(244,63,94,0.85)'
    if (st === 'warning') return 'rgba(245,158,11,0.85)'
    return 'rgba(16,185,129,0.85)'
  })

  const data = {
    labels: sectors.map((s) => s.nome),
    datasets: [
      {
        label: 'Consumo Atual (kWh)',
        data: sectors.map((s) => s.consumo_atual),
        backgroundColor: barColors,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Meta (kWh)',
        data: sectors.map((s) => s.consumo_meta),
        backgroundColor: isDark ? 'rgba(148,163,184,0.2)' : 'rgba(148,163,184,0.3)',
        borderColor: isDark ? 'rgba(148,163,184,0.5)' : 'rgba(148,163,184,0.6)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: textColor,
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 3,
          useBorderRadius: true,
          font: { size: 12, family: 'Inter' },
        },
      },
      tooltip: {
        backgroundColor: bgColor,
        titleColor: isDark ? '#f1f5f9' : '#0f172a',
        bodyColor: textColor,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} kWh`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 11, family: 'Inter' } },
        border: { display: false },
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { size: 11, family: 'Inter' },
          callback: (v) => `${v} kWh`,
        },
        border: { display: false },
      },
    },
  }

  return <Bar data={data} options={options} />
}
