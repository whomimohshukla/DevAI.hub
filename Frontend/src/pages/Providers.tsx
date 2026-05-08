import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import { EmptyState, ErrorMessage, SkeletonGrid, Spinner } from '../components/Feedback'
import { providersApi, type Provider, ApiError } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const PROVIDER_ICONS: Record<string, string> = {
  openai: '🤖',
  'hugging face': '🤗',
  stability: '🎨',
  elevenlabs: '🎙️',
  anthropic: '🧠',
  google: '🔍',
  cohere: '💎',
}

function ProviderCard({
  provider,
  onDelete,
  onToggle,
  isAdmin,
  working,
}: {
  provider: Provider
  onDelete: (id: string) => void
  onToggle: (id: string, status: 'active' | 'inactive') => void
  isAdmin: boolean
  working?: boolean
}) {
  const icon = PROVIDER_ICONS[provider.name.toLowerCase()] || '⚡'
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-xl dark:bg-zinc-800">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white">{provider.name}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">{provider.authType} auth</p>
          </div>
        </div>
        <span className={`shrink-0 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
          provider.status === 'active'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
        }`}>
          {provider.status}
        </span>
      </div>
      {provider.baseUrl && (
        <p className="mt-3 truncate text-xs text-zinc-500 dark:text-zinc-400">{provider.baseUrl}</p>
      )}
      {isAdmin && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onToggle(provider._id, provider.status === 'active' ? 'inactive' : 'active')}
            disabled={working}
            className="rounded-lg border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {working ? <Spinner label="Saving" /> : provider.status === 'active' ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={() => onDelete(provider._id)}
            disabled={working}
            className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            {working ? <Spinner label="Working" /> : 'Delete'}
          </button>
        </div>
      )}
    </Card>
  )
}

export default function Providers() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', baseUrl: '', authType: 'apiKey' as const })
  const [creating, setCreating] = useState(false)
  const [workingId, setWorkingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await providersApi.list()
      setProviders(data)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load providers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (!form.name.trim()) return
    setCreating(true)
    setError('')
    try {
      await providersApi.create(form)
      setForm({ name: '', baseUrl: '', authType: 'apiKey' })
      setShowForm(false)
      await load()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to create provider')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    setWorkingId(id)
    setError('')
    try {
      await providersApi.delete(id)
      setProviders((p) => p.filter((x) => x._id !== id))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to delete provider')
    } finally {
      setWorkingId(null)
    }
  }

  const handleToggle = async (id: string, status: 'active' | 'inactive') => {
    setWorkingId(id)
    setError('')
    try {
      const updated = await providersApi.update(id, { status })
      setProviders((p) => p.map((x) => x._id === id ? { ...x, ...updated } : x))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to update provider')
    } finally {
      setWorkingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Providers" subtitle="Manage AI provider integrations." />
        {isAdmin && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="mt-0 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 sm:mt-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            Add Provider
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:ring-amber-800/40">
          View-only mode. Admin role required to modify providers.
        </div>
      )}

      <ErrorMessage message={error} onRetry={load} />

      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="mb-6">
              <h3 className="mb-4 text-sm font-semibold text-black dark:text-white">Add new provider</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Provider name (e.g. openai)"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <input
                  type="text"
                  value={form.baseUrl}
                  onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))}
                  placeholder="Base URL (optional)"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <select
                  value={form.authType}
                  onChange={(e) => setForm((f) => ({ ...f, authType: e.target.value as 'apiKey' }))}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="apiKey">API Key</option>
                  <option value="oauth">OAuth</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={handleCreate} disabled={creating} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
                  {creating ? <Spinner label="Adding" /> : 'Add Provider'}
                </button>
                <button onClick={() => setShowForm(false)} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  Cancel
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <SkeletonGrid />
      ) : providers.length === 0 ? (
        <Card>
          <EmptyState
            title="No providers configured"
            description={isAdmin ? 'Add your first provider to get started.' : 'No providers have been added yet.'}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p) => (
            <motion.div key={p._id} layout>
              <ProviderCard provider={p} onDelete={handleDelete} onToggle={handleToggle} isAdmin={isAdmin} working={workingId === p._id} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
