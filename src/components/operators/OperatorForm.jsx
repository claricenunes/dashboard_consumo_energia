import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { validateOperator } from '../../utils/validators'
import { TURNOS, SECTOR_CATEGORIES } from '../../data/seedData'

const EMPTY = { nome: '', matricula: '', turno: '', setorId: '' }

export function OperatorForm({ isOpen, onClose, onSubmit, editData, sectors }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm(
        editData
          ? {
              nome: editData.nome,
              matricula: editData.matricula,
              turno: editData.turno,
              setorId: editData.setorId,
            }
          : EMPTY
      )
      setErrors({})
      setSubmitted(false)
    }
  }, [isOpen, editData])

  function handleChange(e) {
    const { name, value } = e.target
    const updated = { ...form, [name]: value }
    setForm(updated)
    if (submitted) {
      setErrors(validateOperator(updated, editData?.id ?? null))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const errs = validateOperator(form, editData?.id ?? null)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onSubmit(form)
    onClose()
  }

  const groupedSectors = SECTOR_CATEGORIES.reduce((acc, cat) => {
    const inCat = sectors.filter((s) => s.categoria === cat)
    if (inCat.length > 0) acc[cat] = inCat
    return acc
  }, {})

  const ungrouped = sectors.filter(
    (s) => !SECTOR_CATEGORIES.includes(s.categoria)
  )

  const isEditing = Boolean(editData)
  const title = isEditing ? `Editar Operador — ${editData.nome}` : 'Cadastrar Novo Operador'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div>
            <label className="label">
              Nome Completo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Nome completo do operador"
              className={`input-base ${errors.nome ? 'input-error' : ''}`}
              autoFocus
            />
            {errors.nome && <p className="mt-1 text-xs text-rose-500">{errors.nome}</p>}
          </div>

          <div>
            <label className="label">
              Matrícula <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="matricula"
              value={form.matricula}
              onChange={handleChange}
              placeholder="Ex: OP-2024-001"
              className={`input-base ${errors.matricula ? 'input-error' : ''}`}
            />
            {errors.matricula && (
              <p className="mt-1 text-xs text-rose-500">{errors.matricula}</p>
            )}
          </div>

          <div>
            <label className="label">
              Turno <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-3">
              {TURNOS.map((turno) => {
                const icons = { Manhã: '🌅', Tarde: '☀️', Noite: '🌙' }
                const isSelected = form.turno === turno
                return (
                  <label
                    key={turno}
                    className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${isSelected
                        ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                        : 'border-slate-200 dark:border-slate-600 text-slate-500 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                  >
                    <input
                      type="radio"
                      name="turno"
                      value={turno}
                      checked={form.turno === turno}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-xl">{icons[turno]}</span>
                    <span className="text-xs font-semibold">{turno}</span>
                  </label>
                )
              })}
            </div>
            {errors.turno && <p className="mt-1 text-xs text-rose-500">{errors.turno}</p>}
          </div>

          <div>
            <label className="label">
              Setor <span className="text-rose-500">*</span>
            </label>
            {sectors.length === 0 ? (
              <p className="text-sm text-amber-600 dark:text-amber-400 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                ⚠️ Nenhum setor cadastrado. Crie um setor antes de cadastrar operadores.
              </p>
            ) : (
              <select
                name="setorId"
                value={form.setorId}
                onChange={handleChange}
                className={`input-base ${errors.setorId ? 'input-error' : ''}`}
              >
                <option value="">Selecione o setor</option>

                {Object.entries(groupedSectors).map(([cat, catSectors]) => (
                  <optgroup key={cat} label={cat}>
                    {catSectors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nome}
                      </option>
                    ))}
                  </optgroup>
                ))}

                {ungrouped.length > 0 && (
                  <optgroup label="Outros">
                    {ungrouped.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nome}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            )}
            {errors.setorId && <p className="mt-1 text-xs text-rose-500">{errors.setorId}</p>}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary flex-1" disabled={sectors.length === 0}>
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Operador'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
