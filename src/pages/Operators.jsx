import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { OperatorForm } from '../components/operators/OperatorForm'
import { OperatorTable } from '../components/operators/OperatorTable'
import { SearchBar } from '../components/ui/SearchBar'
import { PlusIcon, DownloadIcon, FilterIcon } from '../components/ui/Icons'
import { useDebounce } from '../hooks/useDebounce'
import { exportOperators } from '../utils/exportCSV'
import { Link } from 'react-router-dom'

export function Operators() {
  const { operators, sectors, addOperator, updateOperator, deleteOperator, toast } = useApp()

  const [formOpen, setFormOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [searchRaw, setSearchRaw] = useState('')
  const [filterSetor, setFilterSetor] = useState('all')
  const [filterTurno, setFilterTurno] = useState('all')

  const search = useDebounce(searchRaw, 280)

  const filtered = useMemo(() => {
    return operators.filter((o) => {
      const sector = sectors.find((s) => s.id === o.setorId)

      const matchSearch =
        !search ||
        o.nome.toLowerCase().includes(search.toLowerCase()) ||
        o.matricula.toLowerCase().includes(search.toLowerCase()) ||
        (sector?.nome ?? '').toLowerCase().includes(search.toLowerCase())

      const matchSetor = filterSetor === 'all' || o.setorId === filterSetor
      const matchTurno = filterTurno === 'all' || o.turno === filterTurno

      return matchSearch && matchSetor && matchTurno
    })
  }, [operators, sectors, search, filterSetor, filterTurno])

  function handleOpenCreate() {
    setEditData(null)
    setFormOpen(true)
  }

  function handleEdit(operator) {
    setEditData(operator)
    setFormOpen(true)
  }

  function handleSubmit(data) {
    if (editData) {
      updateOperator(editData.id, data)
      toast.success(`Operador "${data.nome}" atualizado com sucesso!`)
    } else {
      addOperator(data)
      toast.success(`Operador "${data.nome}" cadastrado com sucesso!`)
    }
  }

  function handleDelete(id) {
    const op = operators.find((o) => o.id === id)
    deleteOperator(id)
    toast.warning(`Operador "${op?.nome}" removido.`)
  }

  const byTurno = ['Manhã', 'Tarde', 'Noite'].map((t) => ({
    turno: t,
    count: operators.filter((o) => o.turno === t).length,
  }))

  const hasFilters = filterSetor !== 'all' || filterTurno !== 'all' || Boolean(search)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Gestão de Operadores</h1>
          <p className="page-subtitle">
            {operators.length} operador{operators.length !== 1 ? 'es' : ''} cadastrado{operators.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportOperators(operators, sectors)}
            className="btn btn-secondary"
            disabled={!operators.length}
            title="Exportar CSV"
          >
            <DownloadIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="btn btn-primary"
            disabled={sectors.length === 0}
            title={sectors.length === 0 ? 'Cadastre setores antes de adicionar operadores' : ''}
          >
            <PlusIcon className="w-4 h-4" />
            Novo Operador
          </button>
        </div>
      </div>

      {sectors.length === 0 && (
        <div className="card p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            ⚠️ Nenhum setor cadastrado. Para cadastrar operadores, primeiro{' '}
            <Link to="/setores" className="font-semibold underline">
              cadastre um setor
            </Link>
            .
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: operators.length, color: 'text-brand-600 dark:text-brand-400' },
          { label: 'Turno Manhã', value: byTurno[0].count, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Turno Tarde', value: byTurno[1].count, color: 'text-orange-600 dark:text-orange-400' },
          { label: 'Turno Noite', value: byTurno[2].count, color: 'text-indigo-600 dark:text-indigo-400' },
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
            placeholder="Buscar por nome, matrícula ou setor..."
            className="flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterSetor}
              onChange={(e) => setFilterSetor(e.target.value)}
              className="input-base h-10 w-auto text-xs"
            >
              <option value="all">Todos os setores</option>
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
            <select
              value={filterTurno}
              onChange={(e) => setFilterTurno(e.target.value)}
              className="input-base h-10 w-auto text-xs"
            >
              <option value="all">Todos os turnos</option>
              <option value="Manhã">🌅 Manhã</option>
              <option value="Tarde">☀️ Tarde</option>
              <option value="Noite">🌙 Noite</option>
            </select>
            {hasFilters && (
              <button
                onClick={() => { setSearchRaw(''); setFilterSetor('all'); setFilterTurno('all') }}
                className="btn btn-ghost text-xs h-10 px-3"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
        {hasFilters && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Exibindo {filtered.length} de {operators.length} operadores
          </p>
        )}
      </div>

      <div className="card overflow-hidden">
        <OperatorTable
          operators={filtered}
          sectors={sectors}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <OperatorForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editData={editData}
        sectors={sectors}
      />
    </div>
  )
}
