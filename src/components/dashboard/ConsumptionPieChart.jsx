import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useTheme } from '../../context/ThemeContext'
import { CHART_COLORS } from '../../utils/calculations'

ChartJS.register(ArcElement, Tooltip, Legend)

export function ConsumptionPieChart({ sectors }) {
  const { isDark } = useTheme()

  const textColor = isDark ? '#94a3b8' : '#64748b'
  const bgColor = isDark ? '#1e293b' : '#ffffff'

  const data = {
    labels: sectors.map((s) => s.nome),
    datasets: [
      {
        data: sectors.map((s) => s.consumo_atual),
        backgroundColor: CHART_COLORS.slice(0, sectors.length),
        borderColor: isDark ? '#0f172a' : '#ffffff',
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          boxWidth: 10,
          boxHeight: 10,
          borderRadius: 3,
          useBorderRadius: true,
          padding: 12,
          font: { size: 11, family: 'Inter' },
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
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
            const pct = ((ctx.parsed / total) * 100).toFixed(1)
            return ` ${ctx.parsed.toFixed(1)} kWh (${pct}%)`
          },
        },
      },
    },
  }

  return <Doughnut data={data} options={options} />
}
