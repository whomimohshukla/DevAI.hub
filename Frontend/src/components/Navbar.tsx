import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/5 dark:bg-black/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 blur-sm opacity-70"></span>
              <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black ring-1 ring-black/10 dark:bg-zinc-900 dark:ring-white/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-black dark:text-white">
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" className="fill-white/90" />
                </svg>
              </span>
            </div>
            <Link to="/" className="font-semibold tracking-tight text-black hover:text-black/70 dark:text-white dark:hover:text-white/80">DevAI Hub</Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            {[
              { to: '/api', label: 'API' },
              { to: '/admin/providers', label: 'Providers' },
              { to: '/admin/provider-models', label: 'Models' },
              { to: '/admin/service-routes', label: 'Routes' },
              { to: '/usage', label: 'Usage' },
            ].map((l) => (
              <Link key={l.to} className="group relative transition hover:text-black dark:hover:text-white" to={l.to}>
                <span>{l.label}</span>
                <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 md:gap-4">
            <button
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-700 ring-1 ring-inset ring-black/10 hover:bg-black/5 dark:text-zinc-200 dark:ring-white/10 dark:hover:bg-white/5 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="block">
                {open ? (
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
      {/* Mobile panel */}
      {open && (
        <div className="border-t border-black/10 bg-white/80 backdrop-blur dark:border-white/5 dark:bg-black/80 md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              {[
                { to: '/api', label: 'API' },
                { to: '/admin/providers', label: 'Providers' },
                { to: '/admin/provider-models', label: 'Models' },
                { to: '/admin/service-routes', label: 'Routes' },
                { to: '/usage', label: 'Usage' },
              ].map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-black/5 dark:hover:bg-white/5">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
