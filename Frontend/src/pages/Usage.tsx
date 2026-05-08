import { useState, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import { usageApi, type UsageSummaryItem, type RequestLog, ApiError } from '../lib/api'

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-black dark:text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{sub}</p>}
    </Card>
  )
}

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

function StatusDot({ status }: { status: string }) {
  return (
    <span className={`inline-flex h-2 w-2 rounded-full ${status === 'success' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-amber-500'}`} />
  )
}

export default function Usage() {
  const [summary, setSummary] = useState<UsageSummaryItem[]>([])
  const [logs, setLogs] = useState<RequestLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'overview' | 'logs'>('overview')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [summaryData, logsData] = await Promise.all([
        usageApi.summary(),
        usageApi.logs(50),
      ])
      setSummary(summaryData.items)
      setLogs(logsData)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load usage data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const totalRequests = summary.reduce((acc, s) => acc + s.requests, 0)
  const totalTokens = summary.reduce((acc, s) => acc + (s.tokensUsed || 0), 0)
  const totalErrors = summary.reduce((acc, s) => acc + (s.errors || 0), 0)
  const avgLatency = summary.length
    ? Math.round(summary.reduce((acc, s) => acc + s.avgLatencyMs, 0) / summary.length)
    : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between">
        <PageHeader title="Usage" subtitle="Monitor your request counts, tokens and latency." />
        <button
          onClick={load}
          className="mt-2 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-800/50">
          {error}
        </div>
      )}

      {/* Stats row */}
      {loading ? (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total requests" value={totalRequests.toLocaleString()} />
          <StatCard label="Total tokens" value={totalTokens.toLocaleString()} />
          <StatCard label="Avg latency" value={avgLatency ? `${avgLatency}ms` : '—'} />
          <StatCard
            label="Error rate"
            value={totalRequests > 0 ? `${((totalErrors / totalRequests) * 100).toFixed(1)}%` : '0%'}
            sub={`${totalErrors} errors`}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-zinc-100 p-1 w-fit dark:bg-zinc-800">
        {(['overview', 'logs'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all capitalize ${
              tab === t
                ? 'bg-white text-black shadow-sm dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
            ))}
          </div>
        ) : summary.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-zinc-400"><path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No usage data yet</p>
              <p className="mt-1 text-xs text-zinc-500">Make some API calls to see your usage stats here.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summary.map((item) => (
              <motion.div key={`${item.service}-${item.routeName}`} layout>
                <Card>
                  <div className="flex items-center justify-between">
                    <ServiceBadge service={item.service} />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{item.routeName}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Requests</p>
                      <p className="mt-0.5 text-lg font-bold text-black dark:text-white">{item.requests.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Tokens</p>
                      <p className="mt-0.5 text-lg font-bold text-black dark:text-white">{(item.tokensUsed || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Avg latency</p>
                      <p className="mt-0.5 text-sm font-semibold text-black dark:text-white">{item.avgLatencyMs}ms</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Errors</p>
                      <p className={`mt-0.5 text-sm font-semibold ${item.errors > 0 ? 'text-red-600 dark:text-red-400' : 'text-black dark:text-white'}`}>
                        {item.errors}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )
      )}

      {tab === 'logs' && (
        loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center py-10 text-center">
              <p className="text-sm text-zinc-500">No request logs yet.</p>
            </div>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    {['Status', 'Service', 'Route', 'Latency', 'Tokens', 'Time'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={log._id} className={`border-b border-zinc-100 transition hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30 ${i % 2 === 0 ? '' : 'bg-zinc-50/50 dark:bg-zinc-900/20'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <StatusDot status={log.status} />
                          <span className="text-xs text-zinc-600 dark:text-zinc-400">{log.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><ServiceBadge service={log.service} /></td>
                      <td className="px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400">{log.routeName}</td>
                      <td className="px-4 py-3 text-xs text-zinc-700 dark:text-zinc-300">{log.latencyMs ? `${log.latencyMs}ms` : '—'}</td>
                      <td className="px-4 py-3 text-xs text-zinc-700 dark:text-zinc-300">{log.tokensUsed ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  )
}
