import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { validateSector } from '../../utils/validators'
import { SECTOR_CATEGORIES } from '../../data/seedData'

const EMPTY = { nome: '', categoria: '', consumo_meta: '', consumo_atual: '' }

export function SectorForm({ isOpen, onClose, onSubmit, editData }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm(
        editData
          ? {
              nome: editData.nome,
              categoria: editData.categoria,
              consumo_meta: String(editData.consumo_meta),
              consumo_atual: String(editData.consumo_atual),
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
      setErrors(validateSector(updated, editData?.id ?? null))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const errs = validateSector(form, editData?.id ?? null)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onSubmit(form)
    onClose()
  }

  const isEditing = Boolean(editData)
  const title = isEditing ? `Editar Setor — ${editData.nome}` : 'Cadastrar Novo Setor'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div>
            <label className="label">
              Nome do Setor <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Usinagem, Montagem, ADM..."
              className={`input-base ${errors.nome ? 'input-error' : ''}`}
              autoFocus
            />
            {errors.nome && <p className="mt-1 text-xs text-rose-500">{errors.nome}</p>}
          </div>

          <div>
            <label className="label">
              Categoria <span className="text-rose-500">*</span>
            </label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className={`input-base ${errors.categoria ? 'input-error' : ''}`}
            >
              <option value="">Selecione uma categoria</option>
              {SECTOR_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.categoria && <p className="mt-1 text-xs text-rose-500">{errors.categoria}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                Meta de Consumo (kWh) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="consumo_meta"
                value={form.consumo_meta}
                onChange={handleChange}
                placeholder="0.0"
                min="0.1"
                step="0.1"
                className={`input-base ${errors.consumo_meta ? 'input-error' : ''}`}
              />
              {errors.consumo_meta && (
                <p className="mt-1 text-xs text-rose-500">{errors.consumo_meta}</p>
              )}
            </div>

            <div>
              <label className="label">
                Consumo Atual (kWh) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="consumo_atual"
                value={form.consumo_atual}
                onChange={handleChange}
                placeholder="0.0"
                min="0"
                step="0.1"
                className={`input-base ${errors.consumo_atual ? 'input-error' : ''}`}
              />
              {errors.consumo_atual && (
                <p className="mt-1 text-xs text-rose-500">{errors.consumo_atual}</p>
              )}
            </div>
          </div>

          {form.consumo_meta && form.consumo_atual && !errors.consumo_meta && !errors.consumo_atual && (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Percentual da meta:</span>
                <span className="font-semibold">
                  {Math.round((Number(form.consumo_atual) / Number(form.consumo_meta)) * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary flex-1">
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Setor'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
