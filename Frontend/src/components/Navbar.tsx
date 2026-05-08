import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'

const navLinks = [
  { to: '/api', label: 'API' },
  { to: '/admin/providers', label: 'Providers' },
  { to: '/admin/provider-models', label: 'Models' },
  { to: '/admin/service-routes', label: 'Routes' },
  { to: '/usage', label: 'Usage' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/5 dark:bg-black/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative h-8 w-8">
              <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 blur-sm opacity-70" />
              <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black ring-1 ring-black/10 dark:bg-zinc-900 dark:ring-white/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" className="fill-white/90" />
                </svg>
              </span>
            </div>
            <span className="font-semibold tracking-tight text-black dark:text-white">DevAI Hub</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 font-medium transition hover:text-black dark:hover:text-white ${
                    isActive ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white' : ''
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/user"
                  className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate">{user?.name}</span>
                </Link>
                <Link
                  to="/keys"
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500"
                >
                  API Keys
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500"
              >
                Sign in
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-700 ring-1 ring-inset ring-black/10 hover:bg-black/5 dark:text-zinc-200 dark:ring-white/10 dark:hover:bg-white/5 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                {open ? (
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-black/10 bg-white/95 backdrop-blur dark:border-white/5 dark:bg-black/90 md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5 ${
                      isActive ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-2 border-t border-zinc-200 pt-2 dark:border-zinc-800">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/keys"
                      onClick={() => setOpen(false)}
                      className="flex rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5"
                    >
                      API Keys
                    </Link>
                    <Link
                      to="/user"
                      onClick={() => setOpen(false)}
                      className="flex rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5"
                    >
                      Account ({user?.name})
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/20"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
