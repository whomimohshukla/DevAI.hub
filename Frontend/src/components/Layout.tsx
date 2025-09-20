import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black antialiased dark:bg-black dark:text-zinc-200">
      {children}
    </div>
  )
}
