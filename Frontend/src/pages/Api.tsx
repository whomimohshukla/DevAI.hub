import PageHeader from '../components/PageHeader'
import Card from '../components/Card'

export default function Api() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Unified API"
        subtitle="Simple endpoints for text, image, and speech across providers."
      />

      {/* Endpoints overview */}
      <section className="mb-8 grid gap-4 md:grid-cols-3">
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
      </section>

      {/* Authentication */}
      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Authentication</h3>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Send your API key in the Authorization header.</p>
          <pre className="mt-3 overflow-auto rounded-lg bg-black/5 p-3 text-[12px] text-zinc-800 dark:bg-white/5 dark:text-zinc-200">{`Authorization: Bearer YOUR_API_KEY`}</pre>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Status codes</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            <li>200 OK — Success</li>
            <li>400 Bad Request — Missing/invalid params</li>
            <li>401 Unauthorized — Invalid API key</li>
            <li>429 Too Many Requests — Rate limited</li>
            <li>5xx — Provider or hub error</li>
          </ul>
        </Card>
      </section>

      {/* Examples */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">JavaScript (fetch)</h3>
          <pre className="mt-3 overflow-auto rounded-lg bg-black/5 p-3 text-[12px] text-zinc-800 dark:bg-white/5 dark:text-zinc-200">{`fetch('/api/ai/text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({ prompt: 'Summarize this...', provider: 'openai:gpt-4o-mini' })
}).then(r => r.json())`}</pre>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Python (requests)</h3>
          <pre className="mt-3 overflow-auto rounded-lg bg-black/5 p-3 text-[12px] text-zinc-800 dark:bg-white/5 dark:text-zinc-200">{`import requests
headers = {'Authorization': 'Bearer YOUR_API_KEY'}
data = {'prompt': 'Write a tweet...', 'provider': 'openai:gpt-4o-mini'}
r = requests.post('https://your-hub.com/api/ai/text', json=data, headers=headers)
print(r.json())`}</pre>
        </Card>
      </section>
    </div>
  )
}
