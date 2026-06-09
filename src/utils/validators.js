import { sectorService } from '../services/sectorService'
import { operatorService } from '../services/operatorService'

export function validateSector(data, editingId = null) {
  const errors = {}

  if (!data.nome || !data.nome.trim()) {
    errors.nome = 'Nome é obrigatório'
  } else if (data.nome.trim().length < 2) {
    errors.nome = 'Nome deve ter pelo menos 2 caracteres'
  } else if (sectorService.existsNome(data.nome.trim(), editingId)) {
    errors.nome = 'Já existe um setor com este nome'
  }

  if (!data.categoria) {
    errors.categoria = 'Categoria é obrigatória'
  }

  const meta = Number(data.consumo_meta)
  if (!data.consumo_meta && data.consumo_meta !== 0) {
    errors.consumo_meta = 'Meta de consumo é obrigatória'
  } else if (isNaN(meta)) {
    errors.consumo_meta = 'Meta deve ser um número válido'
  } else if (meta <= 0) {
    errors.consumo_meta = 'Meta deve ser maior que zero'
  }

  const atual = Number(data.consumo_atual)
  if (data.consumo_atual === '' || data.consumo_atual === null || data.consumo_atual === undefined) {
    errors.consumo_atual = 'Consumo atual é obrigatório'
  } else if (isNaN(atual)) {
    errors.consumo_atual = 'Consumo deve ser um número válido'
  } else if (atual < 0) {
    errors.consumo_atual = 'Consumo não pode ser negativo'
  }

  return errors
}

export function validateOperator(data, editingId = null) {
  const errors = {}

  if (!data.nome || !data.nome.trim()) {
    errors.nome = 'Nome é obrigatório'
  } else if (data.nome.trim().length < 3) {
    errors.nome = 'Nome deve ter pelo menos 3 caracteres'
  }

  if (!data.matricula || !data.matricula.trim()) {
    errors.matricula = 'Matrícula é obrigatória'
  } else if (data.matricula.trim().length < 3) {
    errors.matricula = 'Matrícula deve ter pelo menos 3 caracteres'
  } else if (operatorService.existsMatricula(data.matricula.trim(), editingId)) {
    errors.matricula = 'Esta matrícula já está cadastrada'
  }

  if (!data.turno) {
    errors.turno = 'Turno é obrigatório'
  }

  if (!data.setorId) {
    errors.setorId = 'Setor é obrigatório'
  }

  return errors
}

export function isFormValid(errors) {
  return Object.keys(errors).length === 0
}
