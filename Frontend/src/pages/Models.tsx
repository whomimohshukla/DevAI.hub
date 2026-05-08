import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import { EmptyState, ErrorMessage, SkeletonGrid, Spinner } from '../components/Feedback'
import { modelsApi, providersApi, type ProviderModel, type Provider, ApiError } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

function ServiceBadge({ service }: { service: string }) {
  const colors: Record<string, string> = {
    text: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    image: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    speech: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  }
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${colors[service] || 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>
      {service}
    </span>
  )
}

function getProviderName(pm: ProviderModel): string {
  if (typeof pm.providerId === 'object' && pm.providerId !== null) {
    return (pm.providerId as { name: string }).name
  }
  return 'Unknown'
}

export default function Models() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [models, setModels] = useState<ProviderModel[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    providerId: '',
    modelName: '',
    service: 'text' as 'text' | 'image' | 'speech',
  })
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState<'all' | 'text' | 'image' | 'speech'>('all')
  const [workingId, setWorkingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [modelsData, providersData] = await Promise.all([
        modelsApi.list(),
        providersApi.list(),
      ])
      setModels(modelsData)
      setProviders(providersData)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load models')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (!form.providerId || !form.modelName.trim()) return
    setCreating(true)
    setError('')
    try {
      await modelsApi.create(form)
      setForm({ providerId: '', modelName: '', service: 'text' })
      setShowForm(false)
      await load()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to create model')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    setWorkingId(id)
    setError('')
    try {
      await modelsApi.delete(id)
      setModels((m) => m.filter((x) => x._id !== id))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to delete model')
    } finally {
      setWorkingId(null)
    }
  }

  const handleToggle = async (id: string, status: 'active' | 'inactive') => {
    setWorkingId(id)
    setError('')
    try {
      const updated = await modelsApi.update(id, { status })
      setModels((m) => m.map((x) => x._id === id ? { ...x, ...updated } : x))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to update model')
    } finally {
      setWorkingId(null)
    }
  }

  const filtered = filter === 'all' ? models : models.filter((m) => m.service === filter)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Provider Models" subtitle="Manage AI models and their availability." />
        {isAdmin && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="mt-0 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 sm:mt-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            Add Model
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:ring-amber-800/40">
          View-only mode. Admin role required to modify models.
        </div>
      )}

      <ErrorMessage message={error} onRetry={load} />

      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="mb-6">
              <h3 className="mb-4 text-sm font-semibold text-black dark:text-white">Add new model</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <select
                  value={form.providerId}
                  onChange={(e) => setForm((f) => ({ ...f, providerId: e.target.value }))}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="">Select provider</option>
                  {providers.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={form.modelName}
                  onChange={(e) => setForm((f) => ({ ...f, modelName: e.target.value }))}
                  placeholder="Model name (e.g. gpt-4o)"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <select
                  value={form.service}
                  onChange={(e) => setForm((f) => ({ ...f, service: e.target.value as 'text' }))}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="speech">Speech</option>
                </select>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={handleCreate} disabled={creating} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
                  {creating ? <Spinner label="Adding" /> : 'Add Model'}
                </button>
                <button onClick={() => setShowForm(false)} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  Cancel
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-zinc-100 p-1 w-fit dark:bg-zinc-800">
        {(['all', 'text', 'image', 'speech'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all capitalize ${
              filter === f
                ? 'bg-white text-black shadow-sm dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="No models found"
            description={isAdmin ? 'Add your first model to get started.' : 'No models configured yet.'}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((model) => (
            <motion.div key={model._id} layout>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-black dark:text-white">
                      {model.modelName}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{getProviderName(model)}</p>
                  </div>
                  <span className={`shrink-0 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    model.status === 'active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}>
                    {model.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <ServiceBadge service={model.service} />
                  {model.pricing?.inputPerUnitCents && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      ${(model.pricing.inputPerUnitCents / 100).toFixed(4)}/unit
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleToggle(model._id, model.status === 'active' ? 'inactive' : 'active')}
                      disabled={workingId === model._id}
                      className="rounded-lg border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      {workingId === model._id ? <Spinner label="Saving" /> : model.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDelete(model._id)}
                      disabled={workingId === model._id}
                      className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-950/20"
                    >
                      {workingId === model._id ? <Spinner label="Working" /> : 'Delete'}
                    </button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
