import PageHeader from '../components/PageHeader'
import Card from '../components/Card'

export default function Api() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Unified API"
        subtitle="Simple endpoints for text, image, and speech across providers."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Text Generation</h3>
          <pre className="mt-3 overflow-auto rounded-lg bg-black/5 p-3 text-[12px] text-zinc-800 dark:bg-white/5 dark:text-zinc-200">
{`POST /api/ai/text
{
  "prompt": "Summarize this article...",
  "provider": "openai:gpt-4o-mini"
}`}
          </pre>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Image Generation</h3>
          <pre className="mt-3 overflow-auto rounded-lg bg-black/5 p-3 text-[12px] text-zinc-800 dark:bg-white/5 dark:text-zinc-200">
{`POST /api/ai/image
{
  "prompt": "A neon cyberpunk city...",
  "provider": "stability:sd3"
}`}
          </pre>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Speech</h3>
          <pre className="mt-3 overflow-auto rounded-lg bg-black/5 p-3 text-[12px] text-zinc-800 dark:bg-white/5 dark:text-zinc-200">
{`POST /api/ai/speech
{
  "text": "Hello world",
  "mode": "tts",
  "provider": "elevenlabs"
}`}
          </pre>
        </Card>
      </div>
    </div>
  )
}
