import { storage } from './storage'

const KEY = 'sectors'

function generateId() {
  return crypto.randomUUID()
}

export const sectorService = {
  getAll() {
    return storage.get(KEY) ?? []
  },

  getById(id) {
    return this.getAll().find((s) => s.id === id) ?? null
  },

  create(data) {
    const now = new Date().toISOString()
    const sector = {
      id: generateId(),
      nome: data.nome.trim(),
      categoria: data.categoria,
      consumo_meta: Number(data.consumo_meta),
      consumo_atual: Number(data.consumo_atual),
      criadoEm: now,
      atualizadoEm: now,
    }
    const all = this.getAll()
    storage.set(KEY, [...all, sector])
    return sector
  },

  update(id, data) {
    const all = this.getAll().map((s) =>
      s.id === id
        ? {
            ...s,
            nome: data.nome.trim(),
            categoria: data.categoria,
            consumo_meta: Number(data.consumo_meta),
            consumo_atual: Number(data.consumo_atual),
            atualizadoEm: new Date().toISOString(),
          }
        : s
    )
    storage.set(KEY, all)
  },

  remove(id) {
    storage.set(KEY, this.getAll().filter((s) => s.id !== id))
  },

  existsNome(nome, excludeId = null) {
    return this.getAll().some(
      (s) => s.nome.toLowerCase() === nome.toLowerCase() && s.id !== excludeId
    )
  },
}
