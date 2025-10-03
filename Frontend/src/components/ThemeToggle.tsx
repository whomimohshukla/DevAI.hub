import { useEffect, useState } from 'react'

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
  if (stored) return stored
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme())

  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    if (theme === 'dark') {
      root.classList.add('dark')
      body.classList.add('dark')
    } else {
      root.classList.remove('dark')
      body.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }))
  }, [theme])

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition
      bg-black/5 text-black ring-1 ring-inset ring-black/10 hover:bg-black/10
      dark:bg-white/5 dark:text-white dark:ring-white/10 dark:hover:bg-white/10"
    >
      <span className="relative">
        {theme === 'dark' ? 'Dark' : 'Light'} mode
      </span>
      <span className="pointer-events-none inline-flex h-4 w-4 items-center justify-center">
        {theme === 'dark' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="currentColor" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
          </svg>
        )}
      </span>
    </button>
  )
}
