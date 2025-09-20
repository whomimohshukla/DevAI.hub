import PageHeader from '../components/PageHeader'
import Card from '../components/Card'

export default function Webhooks() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title="Webhooks" subtitle="Receive billing and event notifications from the hub." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Stripe</h3>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Endpoint: <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/5">/webhooks/stripe</code></p>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Send signed events for subscription updates and invoices.</p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Security</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            <li>Use secret signing keys</li>
            <li>Validate payload signatures</li>
            <li>Retry on 5xx errors</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
