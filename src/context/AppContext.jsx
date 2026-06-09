import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { sectorService } from '../services/sectorService'
import { operatorService } from '../services/operatorService'
import { storage } from '../services/storage'
import { SEED_SECTORS, SEED_OPERATORS } from '../data/seedData'

const AppContext = createContext(null)

function initializeData() {
  const existing = storage.get('sectors')
  if (!existing || existing.length === 0) {
    storage.set('sectors', SEED_SECTORS)
    storage.set('operators', SEED_OPERATORS)
  }
}

export function AppProvider({ children }) {
  useEffect(() => { initializeData() }, [])

  const [sectors, setSectors] = useState(() => {
    initializeData()
    return sectorService.getAll()
  })

  const [operators, setOperators] = useState(() => operatorService.getAll())

  const [toasts, setToasts] = useState([])

  const refreshSectors = useCallback(() => setSectors(sectorService.getAll()), [])
  const refreshOperators = useCallback(() => setOperators(operatorService.getAll()), [])

  const addSector = useCallback((data) => {
    const created = sectorService.create(data)
    refreshSectors()
    return created
  }, [refreshSectors])

  const updateSector = useCallback((id, data) => {
    sectorService.update(id, data)
    refreshSectors()
  }, [refreshSectors])

  const deleteSector = useCallback((id) => {
    sectorService.remove(id)
    operatorService.removeBySetorId(id)
    refreshSectors()
    refreshOperators()
  }, [refreshSectors, refreshOperators])

  const addOperator = useCallback((data) => {
    const created = operatorService.create(data)
    refreshOperators()
    return created
  }, [refreshOperators])

  const updateOperator = useCallback((id, data) => {
    operatorService.update(id, data)
    refreshOperators()
  }, [refreshOperators])

  const deleteOperator = useCallback((id) => {
    operatorService.remove(id)
    refreshOperators()
  }, [refreshOperators])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  }

  const resetData = useCallback(() => {
    storage.set('sectors', SEED_SECTORS)
    storage.set('operators', SEED_OPERATORS)
    refreshSectors()
    refreshOperators()
  }, [refreshSectors, refreshOperators])

  const clearAllData = useCallback(() => {
    storage.clear()
    refreshSectors()
    refreshOperators()
  }, [refreshSectors, refreshOperators])

  return (
    <AppContext.Provider
      value={{
        sectors,
        addSector,
        updateSector,
        deleteSector,
        operators,
        addOperator,
        updateOperator,
        deleteOperator,
        toasts,
        removeToast,
        toast,
        resetData,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
