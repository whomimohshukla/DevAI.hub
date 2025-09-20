import PageHeader from '../components/PageHeader'
import Card from '../components/Card'

export default function ServiceRoutes() {
  const items = [
    { path: '/api/ai/text', desc: 'Text generation pipeline' },
    { path: '/api/ai/image', desc: 'Image generation pipeline' },
    { path: '/api/ai/speech', desc: 'Speech to text / TTS pipeline' },
  ]
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title="Service Routes" subtitle="Configure routing to providers and models." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <Card key={it.path}>
            <h3 className="text-sm font-semibold text-black dark:text-white">{it.path}</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{it.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
