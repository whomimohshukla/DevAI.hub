import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: Props) {
  return (
    <div
      className={
        `group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ` +
        `border-black/10 bg-white/90 backdrop-blur hover:-translate-y-0.5 hover:border-black/20 hover:bg-white ` +
        `dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-white/20 dark:hover:bg-zinc-900 ` +
        `shadow-sm hover:shadow-md ` +
        className
      }
    >
      <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20" />
      {children}
    </div>
  )
}
