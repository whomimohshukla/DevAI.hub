import { useState } from 'react'
import { motion } from 'motion/react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../contexts/AuthContext'

export default function User() {
  const { user, logout, apiKey } = useAuth()
  const [copied, setCopied] = useState(false)
  const [showKey, setShowKey] = useState(false)

  if (!user) return null

  const copyKey = async () => {
    if (!apiKey) return
    await navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const planColors: Record<string, string> = {
    free: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    pro: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    enterprise: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title="Account" subtitle="Manage your profile and preferences." />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile card */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="relative h-14 w-14 shrink-0">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {user.role === 'admin' && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-white shadow-sm">A</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-black dark:text-white">{user.name}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${planColors[user.subscriptionPlan] || planColors.free}`}>
                  {user.subscriptionPlan}
                </span>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  user.role === 'admin'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-zinc-100 pt-5 text-sm dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Credits</span>
              <span className="font-semibold text-black dark:text-white">{user.credits?.toLocaleString() ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Member since</span>
              <span className="text-zinc-700 dark:text-zinc-300">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Status</span>
              <span className={`font-medium ${user.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </Card>

        {/* Preferences card */}
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Preferences</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Theme</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Toggle between light and dark mode</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </Card>

        {/* Current API key */}
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Session API Key</h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Your current session key. Keep it secret.</p>
          {apiKey ? (
            <div className="mt-3 flex items-center gap-3">
              <code className="min-w-0 flex-1 truncate rounded-lg bg-zinc-100 px-3 py-2 font-mono text-[12px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                {showKey ? apiKey : apiKey.slice(0, 10) + '••••••••••••••••••••••'}
              </code>
              <button onClick={() => setShowKey((v) => !v)} className="shrink-0 rounded-lg border border-zinc-300 px-2 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">
                {showKey ? 'Hide' : 'Show'}
              </button>
              <button onClick={copyKey} className="shrink-0 rounded-lg bg-indigo-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-indigo-500">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ) : (
            <p className="mt-2 text-xs text-zinc-500">No active key</p>
          )}
        </Card>

        {/* Danger zone */}
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Session</h3>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
            Sign out to end your current session.
          </p>
          <button
            onClick={logout}
            className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            Sign out
          </button>
        </Card>
      </div>

      {/* Plan upgrade banner */}
      {user.subscriptionPlan === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-violet-600 p-6 text-white"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold">Upgrade to Pro</h3>
              <p className="mt-1 text-sm text-white/80">100k requests/mo, advanced models, email support.</p>
            </div>
            <a href="/billing" className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-white/95">
              View plans
            </a>
          </div>
        </motion.div>
      )}
    </div>
  )
}
