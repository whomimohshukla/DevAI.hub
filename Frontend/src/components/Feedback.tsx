import type { ReactNode } from 'react'

type ErrorMessageProps = {
  message: string
  onRetry?: () => void
  className?: string
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      <span>{label}</span>
    </span>
  )
}

export function PageSpinner({ label = 'Loading page' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
        <Spinner label={label} />
      </div>
    </div>
  )
}

export function ErrorMessage({ message, onRetry, className = '' }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      className={`mb-4 flex flex-col gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-800/50 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex min-w-0 items-start gap-2">
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden />
        <p className="min-w-0">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 dark:border-red-800/60 dark:bg-red-950/20 dark:text-red-300 dark:hover:bg-red-950/40"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export function SkeletonGrid({
  count = 3,
  className = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  itemClassName = 'h-36',
}: {
  count?: number
  className?: string
  itemClassName?: string
}) {
  return (
    <div className={className} aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${itemClassName} animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800`} />
      ))}
    </div>
  )
}

export function EmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      {icon && <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">{icon}</div>}
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{title}</p>
      {description && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>}
    </div>
  )
}
