import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../contexts/AuthContext'
import { ApiError } from '../lib/api'
import { ErrorMessage, Spinner } from '../components/Feedback'

export default function Login() {
  const navigate = useNavigate()
  const { login, register, loginWithGoogle } = useAuth()
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return

    const renderButton = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return
      googleButtonRef.current.innerHTML = ''
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          if (!credential) return
          setError('')
          setLoading(true)
          try {
            await loginWithGoogle(credential)
            navigate('/')
          } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Google sign-in failed')
          } finally {
            setLoading(false)
          }
        },
      })
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: mode === 'login' ? 'signin_with' : 'signup_with',
        shape: 'rectangular',
        width: 352,
      })
    }

    if (window.google?.accounts?.id) {
      renderButton()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]')
    if (existing) {
      existing.addEventListener('load', renderButton, { once: true })
      return () => existing.removeEventListener('load', renderButton)
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = renderButton
    document.head.appendChild(script)
  }, [googleClientId, loginWithGoogle, mode, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(99,102,241,0.08),transparent_34%),linear-gradient(90deg,rgba(14,165,233,0.08),transparent_42%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 blur-sm opacity-70" />
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black ring-1 ring-black/10 dark:bg-zinc-900 dark:ring-white/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" className="fill-white/90" />
                </svg>
              </span>
            </div>
            <span className="text-lg font-semibold text-black dark:text-white">DevAI Hub</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {mode === 'login'
              ? 'Sign in to manage your API keys and usage'
              : 'Start building with unified AI APIs'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Tab switcher */}
          <div className="mb-6 flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                  mode === m
                    ? 'bg-white text-black shadow-sm dark:bg-zinc-700 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {m === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {googleClientId ? (
            <div className="mb-5">
              <div ref={googleButtonRef} className="flex min-h-11 justify-center" />
            </div>
          ) : (
            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
              Add <code>VITE_GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_ID</code> to enable Google sign-in.
            </div>
          )}

          <div className="mb-5 flex items-center gap-3 text-xs text-zinc-400">
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            <span>Email and password</span>
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-indigo-400"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-indigo-400"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ErrorMessage message={error} className="mb-0" />
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Spinner label={mode === 'login' ? 'Signing in' : 'Creating account'} />
              ) : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-black dark:hover:text-white">Terms</a> and{' '}
          <a href="#" className="underline hover:text-black dark:hover:text-white">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  )
}
