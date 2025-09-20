import PageHeader from '../components/PageHeader'
import Card from '../components/Card'

export default function Billing() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title="Billing" subtitle="Manage your plan and payment methods." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Current Plan</h3>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Free • 100 requests/day</p>
          <button className="mt-4 rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-xs font-semibold text-white shadow hover:from-indigo-400 hover:to-violet-400">Upgrade</button>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Payment Method</h3>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Visa •••• 4242</p>
          <button className="mt-4 rounded-md bg-black/5 px-4 py-2 text-xs text-black ring-1 ring-black/10 hover:bg-black/10 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:hover:bg-white/10">Update</button>
        </Card>
      </div>
    </div>
  )
}
