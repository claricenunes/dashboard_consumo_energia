import { useState } from 'react'
import { getSectorStatus, calcConsumoPercentual } from '../../utils/calculations'
import { formatKWh } from '../../utils/formatters'
import { StatusBadge } from '../ui/Badge'
import { PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from '../ui/Icons'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { EmptyState } from '../ui/EmptyState'
import { BuildingIcon } from '../ui/Icons'
import { useApp } from '../../context/AppContext'

function SortButton({ field, sortConfig, onSort }) {
  const isActive = sortConfig.key === field
  return (
    <button
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 hover:text-brand-500 transition-colors"
    >
      {isActive ? (
        sortConfig.dir === 'asc' ? (
          <ChevronUpIcon className="w-3.5 h-3.5 text-brand-500" />
        ) : (
          <ChevronDownIcon className="w-3.5 h-3.5 text-brand-500" />
        )
      ) : (
        <ChevronDownIcon className="w-3.5 h-3.5 opacity-30" />
      )}
    </button>
  )
}

export function SectorTable({ sectors, onEdit, onDelete }) {
  const { operators } = useApp()
  const [sortConfig, setSortConfig] = useState({ key: 'nome', dir: 'asc' })
  const [deleteTarget, setDeleteTarget] = useState(null)

  function handleSort(key) {
    setSortConfig((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    )
  }

  const sorted = [...sectors].sort((a, b) => {
    const aVal = a[sortConfig.key]
    const bVal = b[sortConfig.key]
    const dir = sortConfig.dir === 'asc' ? 1 : -1
    if (typeof aVal === 'number') return (aVal - bVal) * dir
    return String(aVal).localeCompare(String(bVal), 'pt-BR') * dir
  })

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    const opCount = operators.filter((o) => o.setorId === deleteTarget.id).length
    onDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const barClasses = { success: 'bg-emerald-500', warning: 'bg-amber-500', danger: 'bg-rose-500' }

  if (!sectors.length) {
    return (
      <EmptyState
        icon={<BuildingIcon className="w-8 h-8" />}
        title="Nenhum setor encontrado"
        description="Cadastre um novo setor ou ajuste os filtros de busca."
      />
    )
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>
                <div className="flex items-center gap-1">
                  Nome
                  <SortButton field="nome" sortConfig={sortConfig} onSort={handleSort} />
                </div>
              </th>
              <th>Categoria</th>
              <th>
                <div className="flex items-center gap-1">
                  Meta (kWh)
                  <SortButton field="consumo_meta" sortConfig={sortConfig} onSort={handleSort} />
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  Atual (kWh)
                  <SortButton field="consumo_atual" sortConfig={sortConfig} onSort={handleSort} />
                </div>
              </th>
              <th>Progresso</th>
              <th>Status</th>
              <th>Operadores</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((sector) => {
              const status = getSectorStatus(sector.consumo_atual, sector.consumo_meta)
              const pct = Math.min(calcConsumoPercentual(sector.consumo_atual, sector.consumo_meta), 100)
              const opCount = operators.filter((o) => o.setorId === sector.id).length

              return (
                <tr key={sector.id}>
                  <td>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {sector.nome}
                    </span>
                  </td>
                  <td>
                    <span className="text-slate-500 dark:text-slate-400">{sector.categoria}</span>
                  </td>
                  <td className="font-medium">{formatKWh(sector.consumo_meta)}</td>
                  <td className="font-semibold">{formatKWh(sector.consumo_atual)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barClasses[status]}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-8">
                        {calcConsumoPercentual(sector.consumo_atual, sector.consumo_meta)}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={status} />
                  </td>
                  <td>
                    <span className="text-slate-500 dark:text-slate-400">{opCount}</span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(sector)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-500/10 transition-all"
                        title="Editar"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(sector)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                        title="Excluir"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Setor"
        message={
          deleteTarget
            ? `Tem certeza que deseja excluir o setor "${deleteTarget.nome}"? Todos os operadores vinculados também serão removidos. Esta ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Excluir"
      />
    </>
  )
}
