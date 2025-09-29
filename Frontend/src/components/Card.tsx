import type { ReactNode } from 'react'
import { useRef, useState } from 'react'

type Props = {
  children: ReactNode
  className?: string
  contentClassName?: string
}

export default function Card({ children, className = '', contentClassName = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
  const onLeave = () => setSpot(null)
  return (
    <div
      className={
        `relative group rounded-2xl border border-zinc-200 transition-all duration-300 ` +
        `hover:border-zinc-300 hover:ring-1 hover:ring-black/10 ` +
        `dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:ring-white/10 ` +
        className
      }
    >
      <div
        ref={ref}
        className={
          `relative overflow-hidden rounded-2xl p-6 ` +
          `bg-white shadow-sm hover:shadow-md ` +
          `dark:bg-zinc-900 ` +
          `transition-all duration-300 group-hover:-translate-y-0.5 ` +
          contentClassName
        }
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* spotlight overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: spot
              ? `radial-gradient(180px circle at ${spot.x}px ${spot.y}px, rgba(255,255,255,0.18), transparent 60%)`
              : 'transparent',
            transition: 'background 120ms ease-out',
            mixBlendMode: 'overlay',
          }}
        />
        {children}
      </div>
    </div>
  )
}
