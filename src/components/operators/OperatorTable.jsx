import { useState } from 'react'
import { TurnoBadge } from '../ui/Badge'
import { PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from '../ui/Icons'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { EmptyState } from '../ui/EmptyState'
import { UsersIcon } from '../ui/Icons'
import { formatDate } from '../../utils/formatters'

function SortBtn({ field, sortConfig, onSort }) {
  const isActive = sortConfig.key === field
  return (
    <button onClick={() => onSort(field)} className="inline-flex items-center gap-1 hover:text-brand-500 transition-colors">
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

export function OperatorTable({ operators, sectors, onEdit, onDelete }) {
  const [sortConfig, setSortConfig] = useState({ key: 'nome', dir: 'asc' })
  const [deleteTarget, setDeleteTarget] = useState(null)

  const sectorMap = Object.fromEntries(sectors.map((s) => [s.id, s]))

  function handleSort(key) {
    setSortConfig((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    )
  }

  const sortable = operators.map((o) => ({
    ...o,
    _sectorNome: sectorMap[o.setorId]?.nome ?? '',
  }))

  const sorted = [...sortable].sort((a, b) => {
    let aVal = sortConfig.key === 'setor' ? a._sectorNome : a[sortConfig.key]
    let bVal = sortConfig.key === 'setor' ? b._sectorNome : b[sortConfig.key]
    const dir = sortConfig.dir === 'asc' ? 1 : -1
    return String(aVal).localeCompare(String(bVal), 'pt-BR') * dir
  })

  if (!operators.length) {
    return (
      <EmptyState
        icon={<UsersIcon className="w-8 h-8" />}
        title="Nenhum operador encontrado"
        description="Cadastre um novo operador ou ajuste os filtros."
      />
    )
  }

  function getInitials(nome) {
    return nome
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const avatarColors = [
    'bg-brand-500', 'bg-violet-500', 'bg-emerald-500',
    'bg-amber-500', 'bg-rose-500', 'bg-teal-500',
  ]

  function getAvatarColor(id) {
    const idx = id.charCodeAt(id.length - 1) % avatarColors.length
    return avatarColors[idx]
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>
                <div className="flex items-center gap-1">
                  Operador
                  <SortBtn field="nome" sortConfig={sortConfig} onSort={handleSort} />
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  Matrícula
                  <SortBtn field="matricula" sortConfig={sortConfig} onSort={handleSort} />
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  Setor
                  <SortBtn field="setor" sortConfig={sortConfig} onSort={handleSort} />
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  Turno
                  <SortBtn field="turno" sortConfig={sortConfig} onSort={handleSort} />
                </div>
              </th>
              <th>Cadastrado em</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((op) => {
              const sector = sectorMap[op.setorId]
              return (
                <tr key={op.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${getAvatarColor(op.id)}`}
                      >
                        {getInitials(op.nome)}
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {op.nome}
                      </span>
                    </div>
                  </td>
                  <td>
                    <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300">
                      {op.matricula}
                    </code>
                  </td>
                  <td>
                    <span className="text-slate-600 dark:text-slate-300">
                      {sector?.nome ?? <span className="text-rose-400">Setor removido</span>}
                    </span>
                  </td>
                  <td>
                    <TurnoBadge turno={op.turno} />
                  </td>
                  <td className="text-slate-500 dark:text-slate-400 text-xs">
                    {formatDate(op.criadoEm)}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(op)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-500/10 transition-all"
                        title="Editar"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(op)}
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
        onConfirm={() => onDelete(deleteTarget?.id)}
        title="Excluir Operador"
        message={deleteTarget ? `Tem certeza que deseja excluir "${deleteTarget.nome}"? Esta ação não pode ser desfeita.` : ''}
        confirmLabel="Excluir"
      />
    </>
  )
}
