import { useEffect, type ReactNode } from 'react'

function applyThemeClass() {
  try {
    const ls = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = ls ?? (prefersDark ? 'dark' : 'light')
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  } catch (_) {
    // ignore
  }
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyThemeClass()

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeClass()
    media.addEventListener?.('change', onChange)

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme') applyThemeClass()
    }
    window.addEventListener('storage', onStorage)

    return () => {
      media.removeEventListener?.('change', onChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return <>{children}</>
}
