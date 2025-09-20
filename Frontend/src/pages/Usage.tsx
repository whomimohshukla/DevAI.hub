import PageHeader from '../components/PageHeader'
import Card from '../components/Card'

export default function Usage() {
  const stats = [
    { label: 'Requests (24h)', value: '1,284' },
    { label: 'Requests (30d)', value: '28,930' },
    { label: 'Spend (30d)', value: '$142.80' },
  ]
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title="Usage" subtitle="Track your request counts and spending." />
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{s.label}</p>
            <p className="mt-1 text-lg font-semibold text-black dark:text-white">{s.value}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
