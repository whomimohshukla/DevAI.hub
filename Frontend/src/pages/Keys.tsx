import PageHeader from '../components/PageHeader'
import Card from '../components/Card'

export default function Keys() {
  const apiKey = 'sk_live_********************************'
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title="API Keys" subtitle="Manage and rotate your API credentials." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Your API Key</h3>
          <div className="mt-3 flex items-center gap-3">
            <code className="rounded-md bg-black/5 px-3 py-2 text-sm text-zinc-800 dark:bg-white/5 dark:text-zinc-200">{apiKey}</code>
            <button className="rounded-md bg-black/5 px-3 py-2 text-xs text-black ring-1 ring-black/10 hover:bg-black/10 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:hover:bg-white/10">Copy</button>
          </div>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">Keep your key secret. You can rotate at any time.</p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Rotation & Security</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            <li>Rotate keys regularly</li>
            <li>Use separate keys per environment</li>
            <li>Never embed keys in client apps</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
