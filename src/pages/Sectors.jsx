import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { SectorForm } from '../components/sectors/SectorForm'
import { SectorTable } from '../components/sectors/SectorTable'
import { SearchBar } from '../components/ui/SearchBar'
import { Badge } from '../components/ui/Badge'
import { PlusIcon, DownloadIcon, BuildingIcon } from '../components/ui/Icons'
import { useDebounce } from '../hooks/useDebounce'
import { exportSectors } from '../utils/exportCSV'
import { calcSetoresAcimaDaMeta, calcSetoresEmAlerta } from '../utils/calculations'
import { formatKWh } from '../utils/formatters'

export function Sectors() {
  const { sectors, addSector, updateSector, deleteSector, toast } = useApp()

  const [formOpen, setFormOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [searchRaw, setSearchRaw] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const search = useDebounce(searchRaw, 280)

  const filtered = useMemo(() => {
    return sectors.filter((s) => {
      const matchSearch =
        !search ||
        s.nome.toLowerCase().includes(search.toLowerCase()) ||
        s.categoria.toLowerCase().includes(search.toLowerCase())

      const status =
        s.consumo_atual > s.consumo_meta
          ? 'danger'
          : s.consumo_atual >= s.consumo_meta * 0.8
          ? 'warning'
          : 'success'

      const matchFilter = filterStatus === 'all' || status === filterStatus
      return matchSearch && matchFilter
    })
  }, [sectors, search, filterStatus])

  function handleOpenCreate() {
    setEditData(null)
    setFormOpen(true)
  }

  function handleEdit(sector) {
    setEditData(sector)
    setFormOpen(true)
  }

  function handleSubmit(data) {
    if (editData) {
      updateSector(editData.id, data)
      toast.success(`Setor "${data.nome}" atualizado com sucesso!`)
    } else {
      addSector(data)
      toast.success(`Setor "${data.nome}" cadastrado com sucesso!`)
    }
  }

  function handleDelete(id) {
    const sector = sectors.find((s) => s.id === id)
    deleteSector(id)
    toast.warning(`Setor "${sector?.nome}" removido.`)
  }

  const acima = calcSetoresAcimaDaMeta(sectors)
  const alerta = calcSetoresEmAlerta(sectors)
  const totalConsumo = sectors.reduce((a, s) => a + s.consumo_atual, 0)
  const totalMeta = sectors.reduce((a, s) => a + s.consumo_meta, 0)

  const FILTERS = [
    { value: 'all', label: 'Todos', count: sectors.length },
    { value: 'success', label: 'Dentro da Meta', count: sectors.length - alerta },
    { value: 'warning', label: 'Próximo', count: alerta - acima },
    { value: 'danger', label: 'Acima da Meta', count: acima },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Gestão de Setores</h1>
          <p className="page-subtitle">
            {sectors.length} setor{sectors.length !== 1 ? 'es' : ''} cadastrado{sectors.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportSectors(sectors)}
            className="btn btn-secondary"
            disabled={!sectors.length}
            title="Exportar CSV"
          >
            <DownloadIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <PlusIcon className="w-4 h-4" />
            Novo Setor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Setores', value: sectors.length, color: 'text-brand-600 dark:text-brand-400' },
          { label: 'Acima da Meta', value: acima, color: 'text-rose-600 dark:text-rose-400' },
          { label: 'Consumo Total', value: formatKWh(totalConsumo), color: 'text-slate-800 dark:text-slate-200' },
          { label: 'Meta Total', value: formatKWh(totalMeta), color: 'text-slate-800 dark:text-slate-200' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={searchRaw}
            onChange={setSearchRaw}
            placeholder="Buscar por nome ou categoria..."
            className="flex-1"
          />
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map(({ value, label, count }) => (
              <button
                key={value}
                onClick={() => setFilterStatus(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${filterStatus === value
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                  ${filterStatus === value ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {(search || filterStatus !== 'all') && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Exibindo {filtered.length} de {sectors.length} setores
          </p>
        )}
      </div>

      <div className="card overflow-hidden">
        <SectorTable sectors={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <SectorForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </div>
  )
}
