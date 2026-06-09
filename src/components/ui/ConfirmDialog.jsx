import { Modal } from './Modal'
import { ExclamationIcon } from './Icons'

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar ação',
  message = 'Tem certeza que deseja continuar?',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
}) {
  const btnClass = variant === 'danger' ? 'btn-danger' : 'btn-primary'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
          <ExclamationIcon className="w-7 h-7 text-rose-500" />
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{message}</p>
        <div className="flex gap-3 w-full pt-2">
          <button onClick={onClose} className="btn btn-secondary flex-1">
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`btn ${btnClass} flex-1`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
