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
        `hover:border-transparent hover:ring-0 ` +
        `dark:border-zinc-800 ` +
        className
      }
    >
      {/* Gradient border halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(135deg, rgba(236,72,153,0.45), rgba(79,70,229,0.35), rgba(14,165,233,0.35))',
          WebkitMask:
            'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />
      <div
        ref={ref}
        className={
          `relative overflow-hidden rounded-2xl p-6 ` +
          `bg-white shadow-sm hover:shadow-lg ` +
          `dark:bg-zinc-900 ` +
          `transition-transform duration-300 group-hover:-translate-y-1 ` +
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
