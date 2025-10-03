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
      ? 'bg-black text-white dark:bg-black dark:text-white'
      : 'bg-white text-black dark:bg-zinc-900 dark:text-white'

  return (
    <Card
      className={className}
      contentClassName={
        inner +
        ' transition-colors duration-300 hover:shadow-lg ' +
        'selection:bg-white/20 selection:text-white'
      }
    >
      {children}
    </Card>
  )
}
