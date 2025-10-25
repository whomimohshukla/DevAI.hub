import { CardSpotlight } from './ui/card-spotlight'
import type { ReactNode } from 'react'

type Props = {
  title: string
  desc: string
  accent?: string // e.g. "from-indigo-500 to-violet-500"
  icon?: ReactNode
}

export default function FeatureCard({ title, desc, accent = 'from-zinc-200 to-zinc-400', icon }: Props) {
  return (
    <CardSpotlight>
      <div className="flex items-start gap-3">
        {/* Icon badge */}
        <div className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white ring-1 ring-white/20 shadow-sm`}>
          {icon ?? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
              <path d="M12 2a1 1 0 0 1 .94.66l1.5 4.12 4.35.33a1 1 0 0 1 .56 1.76l-3.33 2.7 1.06 4.23a1 1 0 0 1-1.47 1.12L12 15.89l-3.61 2.03a1 1 0 0 1-1.47-1.12l1.06-4.23-3.33-2.7a1 1 0 0 1 .56-1.76l4.35-.33 1.5-4.12A1 1 0 0 1 12 2z" />
            </svg>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-black dark:text-white">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{desc}</p>
          <div className="mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-zinc-300 to-transparent dark:from-zinc-600" />
        </div>
      </div>
    </CardSpotlight>
  )
}
