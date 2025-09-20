import PageHeader from '../components/PageHeader'
import Card from '../components/Card'

export default function Models() {
  const items = [
    { name: 'gpt-4o-mini', provider: 'OpenAI', desc: 'Fast multimodal text generation' },
    { name: 'sd3', provider: 'Stability', desc: 'High-quality image generation' },
    { name: 'whisper-large', provider: 'OpenAI', desc: 'Accurate speech-to-text' },
  ]
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title="Models" subtitle="Manage provider models and availability." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <Card key={it.name}>
            <h3 className="text-sm font-semibold text-black dark:text-white">{it.name}</h3>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{it.provider}</p>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{it.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
