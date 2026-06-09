import { storage } from './storage'

const KEY = 'operators'

function generateId() {
  return crypto.randomUUID()
}

export const operatorService = {
  getAll() {
    return storage.get(KEY) ?? []
  },

  getById(id) {
    return this.getAll().find((o) => o.id === id) ?? null
  },

  getBySetorId(setorId) {
    return this.getAll().filter((o) => o.setorId === setorId)
  },

  create(data) {
    const operator = {
      id: generateId(),
      setorId: data.setorId,
      nome: data.nome.trim(),
      turno: data.turno,
      matricula: data.matricula.trim().toUpperCase(),
      criadoEm: new Date().toISOString(),
    }
    const all = this.getAll()
    storage.set(KEY, [...all, operator])
    return operator
  },

  update(id, data) {
    const all = this.getAll().map((o) =>
      o.id === id
        ? {
            ...o,
            setorId: data.setorId,
            nome: data.nome.trim(),
            turno: data.turno,
            matricula: data.matricula.trim().toUpperCase(),
          }
        : o
    )
    storage.set(KEY, all)
  },

  remove(id) {
    storage.set(KEY, this.getAll().filter((o) => o.id !== id))
  },

  removeBySetorId(setorId) {
    storage.set(KEY, this.getAll().filter((o) => o.setorId !== setorId))
  },

  existsMatricula(matricula, excludeId = null) {
    return this.getAll().some(
      (o) =>
        o.matricula.toUpperCase() === matricula.toUpperCase() && o.id !== excludeId
    )
  },
}
