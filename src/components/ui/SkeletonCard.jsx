export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-6 animate-pulse ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-2" />
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        </div>
      </div>
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-3 w-1/2" />
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <tr className="animate-pulse border-t border-slate-100 dark:border-slate-700/50">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        </td>
      ))}
    </tr>
  )
}
