import { useApp } from '../../context/AppContext'
import { CheckIcon, XIcon, ExclamationIcon, InfoIcon } from './Icons'

const TOAST_CONFIG = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-700',
    icon: CheckIcon,
    iconColor: 'text-emerald-500',
  },
  error: {
    bg: 'bg-rose-50 dark:bg-rose-900/30',
    border: 'border-rose-200 dark:border-rose-700',
    icon: XIcon,
    iconColor: 'text-rose-500',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-700',
    icon: ExclamationIcon,
    iconColor: 'text-amber-500',
  },
  info: {
    bg: 'bg-brand-50 dark:bg-brand-900/30',
    border: 'border-brand-200 dark:border-brand-700',
    icon: InfoIcon,
    iconColor: 'text-brand-500',
  },
}

function ToastItem({ toast, onRemove }) {
  const config = TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.info
  const IconComponent = config.icon

  return (
    <div
      className={`flex items-start gap-3 w-80 p-4 rounded-xl border shadow-card-md
        ${config.bg} ${config.border} animate-slide-in-right`}
    >
      <IconComponent className={`w-5 h-5 mt-0.5 shrink-0 ${config.iconColor}`} />
      <p className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useApp()

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  )
}
