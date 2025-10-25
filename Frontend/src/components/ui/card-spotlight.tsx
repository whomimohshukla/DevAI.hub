import React from 'react'
import Card from '../Card'

type Props = {
  className?: string
  children: React.ReactNode
  tone?: 'black' | 'white'
}

export function CardSpotlight({ className = '', children, tone = 'black' }: Props) {
  const inner =
    tone === 'black'
      ? 'bg-black text-white dark:bg-black dark:text-white ring-1 ring-white/10 hover:ring-white/20'
      : 'bg-white text-black dark:bg-zinc-900 dark:text-white ring-1 ring-black/5 hover:ring-black/10 dark:ring-white/10 dark:hover:ring-white/20'

  return (
    <Card
      className={className}
      contentClassName={
        inner +
        ' transition-colors duration-300 hover:shadow-lg ' +
        'selection:bg-white/20 selection:text-white'
      }
    >
      {/* gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(236,72,153,0.18), rgba(14,165,233,0.14))',
        }}
      />
      {children}
    </Card>
  )
}
