import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { useTheme } from '../../context/ThemeContext'

ChartJS.register(ArcElement, Tooltip)

export function EfficiencyGauge({ score }) {
  const { isDark } = useTheme()

  const trackColor = isDark ? '#1e293b' : '#f1f5f9'
  const gaugeColor =
    score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e'

  const label =
    score >= 80 ? 'Eficiente' : score >= 60 ? 'Moderado' : 'Crítico'

  const labelColor =
    score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-rose-500'

  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [gaugeColor, trackColor],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        hoverBackgroundColor: [gaugeColor, trackColor],
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '78%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: { animateRotate: true, duration: 1000 },
  }

  return (
    <div className="relative flex items-center justify-center" style={{ height: '100%' }}>
      <Doughnut data={data} options={options} />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className={`text-3xl font-bold leading-none ${labelColor}`}>{score}%</p>
        <p className={`text-xs font-semibold mt-1 ${labelColor}`}>{label}</p>
      </div>
    </div>
  )
}
