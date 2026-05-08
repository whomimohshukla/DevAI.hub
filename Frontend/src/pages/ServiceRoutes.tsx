import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import { EmptyState, ErrorMessage, SkeletonGrid, Spinner } from '../components/Feedback'
import { serviceRoutesApi, modelsApi, type ServiceRoute, type ProviderModel, ApiError } from '../lib/api'
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

function getModelName(route: ServiceRoute): string {
  if (typeof route.defaultProviderModelId === 'object' && route.defaultProviderModelId !== null) {
    return (route.defaultProviderModelId as { modelName: string }).modelName
  }
  return 'Unknown model'
}

export default function ServiceRoutes() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [routes, setRoutes] = useState<ServiceRoute[]>([])
  const [models, setModels] = useState<ProviderModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    service: 'text' as 'text' | 'image' | 'speech',
    routeName: '',
    defaultProviderModelId: '',
    fallbackPolicy: 'priority' as 'priority' | 'round_robin',
  })
  const [creating, setCreating] = useState(false)
  const [workingId, setWorkingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [routesData, modelsData] = await Promise.all([
        serviceRoutesApi.list(),
        modelsApi.list(),
      ])
      setRoutes(routesData)
      setModels(modelsData)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load service routes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (!form.routeName.trim() || !form.defaultProviderModelId) return
    setCreating(true)
    setError('')
    try {
      await serviceRoutesApi.create(form)
      setForm({ service: 'text', routeName: '', defaultProviderModelId: '', fallbackPolicy: 'priority' })
      setShowForm(false)
      await load()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to create route')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    setWorkingId(id)
    setError('')
    try {
      await serviceRoutesApi.delete(id)
      setRoutes((r) => r.filter((x) => x._id !== id))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to delete route')
    } finally {
      setWorkingId(null)
    }
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    setWorkingId(id)
    setError('')
    try {
      const updated = await serviceRoutesApi.update(id, { enabled })
      setRoutes((r) => r.map((x) => x._id === id ? { ...x, ...updated } : x))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to update route')
    } finally {
      setWorkingId(null)
    }
  }

  const modelsForService = models.filter((m) => m.service === form.service)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Service Routes" subtitle="Configure routing to providers and models." />
        {isAdmin && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="mt-0 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 sm:mt-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            Add Route
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:ring-amber-800/40">
          View-only mode. Admin role required to modify routes.
        </div>
      )}

      <ErrorMessage message={error} onRetry={load} />

      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="mb-6">
              <h3 className="mb-4 text-sm font-semibold text-black dark:text-white">Add new service route</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <select
                  value={form.service}
                  onChange={(e) => setForm((f) => ({ ...f, service: e.target.value as 'text', defaultProviderModelId: '' }))}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="speech">Speech</option>
                </select>
                <input
                  type="text"
                  value={form.routeName}
                  onChange={(e) => setForm((f) => ({ ...f, routeName: e.target.value }))}
                  placeholder="Route name (e.g. completion)"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <select
                  value={form.defaultProviderModelId}
                  onChange={(e) => setForm((f) => ({ ...f, defaultProviderModelId: e.target.value }))}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="">Select default model</option>
                  {modelsForService.map((m) => (
                    <option key={m._id} value={m._id}>{m.modelName}</option>
                  ))}
                </select>
                <select
                  value={form.fallbackPolicy}
                  onChange={(e) => setForm((f) => ({ ...f, fallbackPolicy: e.target.value as 'priority' }))}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="priority">Priority fallback</option>
                  <option value="round_robin">Round robin</option>
                </select>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={handleCreate} disabled={creating} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
                  {creating ? <Spinner label="Creating" /> : 'Create Route'}
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
        <SkeletonGrid itemClassName="h-40" />
      ) : routes.length === 0 ? (
        <Card>
          <EmptyState
            title="No service routes configured"
            description={isAdmin ? 'Create a route to enable AI endpoints.' : 'No routes have been configured yet.'}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <motion.div key={route._id} layout>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <ServiceBadge service={route.service} />
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        route.enabled
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                          : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {route.enabled ? 'enabled' : 'disabled'}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-black dark:text-white">
                      {route.routeName}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Default: {getModelName(route)}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                      Policy: {route.fallbackPolicy?.replace('_', ' ')}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">v{route.version}</span>
                </div>
                {isAdmin && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleToggle(route._id, !route.enabled)}
                      disabled={workingId === route._id}
                      className="rounded-lg border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      {workingId === route._id ? <Spinner label="Saving" /> : route.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDelete(route._id)}
                      disabled={workingId === route._id}
                      className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-950/20"
                    >
                      {workingId === route._id ? <Spinner label="Working" /> : 'Delete'}
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
