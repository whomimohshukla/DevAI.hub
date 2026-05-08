import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import { EmptyState, ErrorMessage, SkeletonGrid, Spinner } from '../components/Feedback'
import { keysApi, type ApiKey, type ApiKeyCreated, ApiError } from '../lib/api'

function ScopeTag({ scope }: { scope: string }) {
  const colors: Record<string, string> = {
    text: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    image: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    speech: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${colors[scope] || 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>
      {scope}
    </span>
  )
}

export default function Keys() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newKey, setNewKey] = useState<ApiKeyCreated | null>(null)
  const [copied, setCopied] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await keysApi.list()
      setKeys(data)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load keys')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (creating) return
    setCreating(true)
    setError('')
    try {
      const created = await keysApi.create(newLabel || 'My API Key')
      setNewKey(created)
      setNewLabel('')
      setShowForm(false)
      await load()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to create key')
    } finally {
      setCreating(false)
    }
  }

  const handleRevoke = async (id: string) => {
    setRevoking(id)
    setError('')
    try {
      await keysApi.revoke(id)
      setKeys((prev) => prev.map((k) => k._id === id ? { ...k, status: 'revoked' } : k))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to revoke key')
    } finally {
      setRevoking(null)
    }
  }

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="API Keys" subtitle="Create, manage and revoke your API credentials." />
        <button
          onClick={() => setShowForm((v) => !v)}
          className="mt-0 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 sm:mt-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          New Key
        </button>
      </div>

      {/* New key revealed */}
      <AnimatePresence>
        {newKey && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-800/40 dark:bg-green-950/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">API key created — copy it now, it won't be shown again.</p>
                <code className="mt-2 block break-all rounded-lg bg-white px-3 py-2 font-mono text-[13px] text-green-900 shadow-sm ring-1 ring-green-200 dark:bg-zinc-900 dark:text-green-300 dark:ring-green-800/50">
                  {newKey.apiKey}
                </code>
              </div>
              <button
                onClick={() => copy(newKey.apiKey)}
                className="shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <button onClick={() => setNewKey(null)} className="mt-3 text-xs text-green-600 underline dark:text-green-400">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="mb-6">
              <h3 className="mb-4 text-sm font-semibold text-black dark:text-white">Create new API key</h3>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Key label (e.g. Production)"
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    disabled={creating}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                  >
                    {creating ? <Spinner label="Creating" /> : 'Create'}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <ErrorMessage message={error} onRetry={load} />

      {loading ? (
        <SkeletonGrid count={2} className="grid gap-4 sm:grid-cols-2" itemClassName="h-32" />
      ) : keys.length === 0 ? (
        <Card>
          <EmptyState
            title="No API keys yet"
            description="Create your first key to start making API calls."
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {keys.map((key) => (
            <motion.div key={key._id} layout>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-black dark:text-white">
                        {key.label || 'Unnamed key'}
                      </h3>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        key.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                      }`}>
                        {key.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {key.scopes.map((s) => <ScopeTag key={s} scope={s} />)}
                    </div>
                    <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                      Created {new Date(key.createdAt).toLocaleDateString()}
                      {key.lastUsedAt && ` · Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  {key.status === 'active' && (
                    <button
                      onClick={() => handleRevoke(key._id)}
                      disabled={revoking === key._id}
                      className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-950/20"
                    >
                      {revoking === key._id ? <Spinner label="Revoking" /> : 'Revoke'}
                    </button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Card className="mt-6">
        <h3 className="text-sm font-semibold text-black dark:text-white">Security best practices</h3>
        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2 text-sm text-zinc-700 dark:text-zinc-300">
          {[
            'Rotate keys every 90 days',
            'Use separate keys per environment',
            'Never embed keys in client-side code',
            'Store keys in environment variables',
          ].map((tip) => (
            <li key={tip} className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-indigo-500 shrink-0"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              {tip}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
