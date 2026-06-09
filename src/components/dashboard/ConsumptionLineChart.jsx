import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { useTheme } from '../../context/ThemeContext'
import { calcTotalTrend, calcTotalMeta, WEEK_LABELS } from '../../utils/calculations'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export function ConsumptionLineChart({ sectors }) {
  const { isDark } = useTheme()

  const textColor = isDark ? '#94a3b8' : '#64748b'
  const gridColor = isDark ? 'rgba(51,65,85,0.6)' : 'rgba(226,232,240,0.8)'
  const bgColor = isDark ? '#1e293b' : '#ffffff'

  const trendData = calcTotalTrend(sectors)
  const totalMeta = calcTotalMeta(sectors)
  const metaLine = Array(7).fill(totalMeta)

  const data = {
    labels: WEEK_LABELS,
    datasets: [
      {
        label: 'Consumo Total (kWh)',
        data: trendData,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#0ea5e9',
        pointBorderColor: isDark ? '#1e293b' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Meta Total (kWh)',
        data: metaLine,
        borderColor: isDark ? 'rgba(148,163,184,0.5)' : 'rgba(148,163,184,0.6)',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        tension: 0,
        fill: false,
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
          boxHeight: 2,
          padding: 16,
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

  return <Line data={data} options={options} />
}
