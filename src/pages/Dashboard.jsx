import { useApp } from '../context/AppContext'
import { MetricCard } from '../components/dashboard/MetricCard'
import { SectorCard } from '../components/dashboard/SectorCard'
import { ConsumptionBarChart } from '../components/dashboard/ConsumptionBarChart'
import { ConsumptionPieChart } from '../components/dashboard/ConsumptionPieChart'
import { EfficiencyGauge } from '../components/dashboard/EfficiencyGauge'
import { ConsumptionLineChart } from '../components/dashboard/ConsumptionLineChart'
import { AlertsList } from '../components/dashboard/AlertsList'
import {
  BoltIcon,
  BuildingIcon,
  UsersIcon,
  ExclamationIcon,
  ShieldCheckIcon,
} from '../components/ui/Icons'
import {
  calcTotalConsumo,
  calcTotalMeta,
  calcSetoresAcimaDaMeta,
  calcSetoresEmAlerta,
  calcEfficiencyScore,
  calcEconomiaPotencial,
} from '../utils/calculations'
import { formatKWh } from '../utils/formatters'

export function Dashboard() {
  const { sectors, operators } = useApp()

  const totalConsumo = calcTotalConsumo(sectors)
  const totalMeta = calcTotalMeta(sectors)
  const setoresAcima = calcSetoresAcimaDaMeta(sectors)
  const setoresAlerta = calcSetoresEmAlerta(sectors)
  const efficiency = calcEfficiencyScore(sectors)
  const economia = calcEconomiaPotencial(sectors)
  const variacao = totalMeta > 0
    ? ((totalConsumo - totalMeta) / totalMeta * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Monitoramento em tempo real do consumo energético industrial
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Consumo Total"
          value={totalConsumo.toFixed(1)}
          unit="kWh"
          icon={BoltIcon}
          color="brand"
          trend={Number(variacao)}
          trendLabel="vs. meta total"
        />
        <MetricCard
          title="Setores Monitorados"
          value={sectors.length}
          icon={BuildingIcon}
          color="sky"
          trendLabel={`${setoresAlerta} em alerta`}
        />
        <MetricCard
          title="Acima da Meta"
          value={setoresAcima}
          icon={ExclamationIcon}
          color={setoresAcima > 0 ? 'rose' : 'emerald'}
          trendLabel={`de ${sectors.length} setores`}
        />
        <MetricCard
          title="Operadores"
          value={operators.length}
          icon={UsersIcon}
          color="violet"
          trendLabel="ativos no sistema"
        />
        <MetricCard
          title="Eficiência Geral"
          value={efficiency}
          unit="%"
          icon={ShieldCheckIcon}
          color={efficiency >= 80 ? 'emerald' : efficiency >= 60 ? 'amber' : 'rose'}
          trendLabel={economia > 0 ? `Potencial: -${formatKWh(economia)}` : 'Operação ideal'}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Consumo por Setor
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Atual vs Meta (kWh)</p>
            </div>
          </div>
          <div style={{ height: '260px' }}>
            {sectors.length > 0 ? (
              <ConsumptionBarChart sectors={sectors} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Sem dados para exibir
              </div>
            )}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Alertas Ativos
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Setores fora da meta
            </p>
          </div>
          <AlertsList sectors={sectors} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Índice de Eficiência
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Score geral do sistema
            </p>
          </div>
          <div style={{ height: '200px' }}>
            <EfficiencyGauge score={efficiency} />
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Meta Total', value: formatKWh(totalMeta) },
              { label: 'Consumo', value: formatKWh(totalConsumo) },
              { label: 'Variação', value: `${variacao > 0 ? '+' : ''}${variacao}%` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Distribuição do Consumo
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Participação percentual
            </p>
          </div>
          <div style={{ height: '220px' }}>
            {sectors.length > 0 ? (
              <ConsumptionPieChart sectors={sectors} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Sem dados para exibir
              </div>
            )}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Tendência Semanal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Consumo total — últimos 7 dias
            </p>
          </div>
          <div style={{ height: '220px' }}>
            {sectors.length > 0 ? (
              <ConsumptionLineChart sectors={sectors} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Sem dados para exibir
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Cards de Setores
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Status visual de cada setor
            </p>
          </div>
        </div>
        {sectors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sectors.map((sector) => (
              <SectorCard key={sector.id} sector={sector} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-slate-400 text-sm">
              Nenhum setor cadastrado. Vá em{' '}
              <a href="/setores" className="text-brand-500 hover:underline">
                Gestão de Setores
              </a>{' '}
              para começar.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
