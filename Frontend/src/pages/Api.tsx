import { useState } from 'react'
import { motion } from 'motion/react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import { aiApi, ApiError } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="relative mt-3 overflow-hidden rounded-xl bg-zinc-950 ring-1 ring-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-[11px] font-medium text-zinc-500">{language}</span>
        <button onClick={copy} className="text-[11px] font-medium text-zinc-400 hover:text-white transition">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-auto p-4 text-[12px] leading-relaxed text-zinc-200">{code}</pre>
    </div>
  )
}

const endpoints = [
  {
    method: 'POST',
    path: '/api/ai/text',
    title: 'Text Generation',
    description: 'Generate text using LLMs like GPT-4o, Claude, Llama.',
    body: `{
  "prompt": "Summarize this article in 3 bullet points.",
  "model": "gpt-4o-mini"
}`,
    response: `{
  "text": "• Point 1\\n• Point 2\\n• Point 3",
  "tokensUsed": 142,
  "latencyMs": 820,
  "model": "gpt-4o-mini",
  "provider": "openai"
}`,
    color: 'from-indigo-500 to-violet-500',
  },
  {
    method: 'POST',
    path: '/api/ai/image',
    title: 'Image Generation',
    description: 'Generate images with DALL·E, Stable Diffusion, and more.',
    body: `{
  "prompt": "A neon cyberpunk city at night, digital art",
  "model": "dall-e-3"
}`,
    response: `{
  "imageBase64": "iVBORw0KGgoAAAANS...",
  "latencyMs": 3200,
  "model": "dall-e-3",
  "provider": "openai"
}`,
    color: 'from-emerald-500 to-teal-400',
  },
  {
    method: 'POST',
    path: '/api/ai/speech',
    title: 'Speech (TTS)',
    description: 'Convert text to natural-sounding speech via multiple voices.',
    body: `{
  "text": "Hello, welcome to DevAI Hub!",
  "mode": "tts",
  "params": { "voice": "alloy" }
}`,
    response: `{
  "audioBase64": "SUQzBAAAAAAAI1RT...",
  "latencyMs": 540,
  "model": "tts-1",
  "provider": "openai"
}`,
    color: 'from-amber-400 to-rose-500',
  },
]

const jsCode = `const response = await fetch('/api/ai/text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY',
  },
  body: JSON.stringify({
    prompt: 'Explain quantum computing in simple terms.',
    model: 'gpt-4o-mini',
  }),
})
const data = await response.json()
console.log(data.text)`

const pyCode = `import requests

response = requests.post(
    'https://your-hub.com/api/ai/text',
    headers={'x-api-key': 'YOUR_API_KEY'},
    json={
        'prompt': 'Explain quantum computing in simple terms.',
        'model': 'gpt-4o-mini',
    }
)
print(response.json()['text'])`

const curlCode = `curl -X POST https://your-hub.com/api/ai/text \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "prompt": "Explain quantum computing in simple terms.",
    "model": "gpt-4o-mini"
  }'`

export default function Api() {
  const { isAuthenticated } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [testing, setTesting] = useState(false)
  const [testError, setTestError] = useState('')
  const [codeLang, setCodeLang] = useState<'js' | 'py' | 'curl'>('js')

  const handleTest = async () => {
    if (!prompt.trim() || testing) return
    setTesting(true)
    setResult('')
    setTestError('')
    try {
      const res = await aiApi.text(prompt)
      setResult(res.text)
    } catch (e) {
      setTestError(e instanceof ApiError ? e.message : 'Request failed')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Unified API"
        subtitle="One endpoint for text, image, and speech across all AI providers."
      />

      {/* Endpoint cards */}
      <section className="mb-10 grid gap-4 md:grid-cols-3">
        {endpoints.map((ep) => (
          <Card key={ep.path}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex rounded-md bg-gradient-to-r ${ep.color} px-2 py-0.5 text-[10px] font-bold text-white`}>
                {ep.method}
              </span>
              <code className="text-[12px] font-mono text-zinc-600 dark:text-zinc-400">{ep.path}</code>
            </div>
            <h3 className="text-sm font-semibold text-black dark:text-white">{ep.title}</h3>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{ep.description}</p>
            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">Request body</p>
              <pre className="overflow-auto rounded-lg bg-zinc-950 p-3 text-[11px] text-zinc-300 ring-1 ring-white/10">{ep.body}</pre>
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">Response</p>
              <pre className="overflow-auto rounded-lg bg-zinc-900 p-3 text-[11px] text-green-400 ring-1 ring-white/5">{ep.response}</pre>
            </div>
          </Card>
        ))}
      </section>

      {/* Auth + Status codes */}
      <section className="mb-10 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Authentication</h3>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
            All API requests require an <code className="rounded bg-zinc-100 px-1 py-0.5 text-[12px] dark:bg-zinc-800">x-api-key</code> header.
          </p>
          <pre className="mt-3 overflow-auto rounded-xl bg-zinc-950 p-4 text-[12px] text-zinc-200 ring-1 ring-white/10">x-api-key: dak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</pre>
          {!isAuthenticated && (
            <p className="mt-3 text-xs text-zinc-500">
              <Link to="/login" className="text-indigo-600 hover:underline dark:text-indigo-400">Sign in</Link> to get your API key.
            </p>
          )}
          {isAuthenticated && (
            <p className="mt-3 text-xs text-zinc-500">
              <Link to="/keys" className="text-indigo-600 hover:underline dark:text-indigo-400">Manage your API keys →</Link>
            </p>
          )}
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">HTTP Status codes</h3>
          <ul className="mt-3 space-y-2">
            {[
              { code: '200', label: 'OK', desc: 'Request succeeded' },
              { code: '400', label: 'Bad Request', desc: 'Missing or invalid parameters' },
              { code: '401', label: 'Unauthorized', desc: 'Invalid or missing API key' },
              { code: '403', label: 'Forbidden', desc: 'Insufficient permissions' },
              { code: '429', label: 'Too Many Requests', desc: 'Rate limit exceeded' },
              { code: '5xx', label: 'Server Error', desc: 'Hub or provider error' },
            ].map((s) => (
              <li key={s.code} className="flex items-start gap-3 text-sm">
                <code className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-bold ${
                  s.code.startsWith('2') ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                  : s.code.startsWith('4') ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                }`}>{s.code}</code>
                <div>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{s.label}</span>
                  <span className="text-zinc-500 dark:text-zinc-400"> — {s.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Code examples */}
      <section className="mb-10">
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-sm font-semibold text-black dark:text-white">Code examples</h3>
            <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
              {(['js', 'py', 'curl'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setCodeLang(l)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    codeLang === l
                      ? 'bg-white text-black shadow-sm dark:bg-zinc-700 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {l === 'js' ? 'JavaScript' : l === 'py' ? 'Python' : 'cURL'}
                </button>
              ))}
            </div>
          </div>
          <CodeBlock
            code={codeLang === 'js' ? jsCode : codeLang === 'py' ? pyCode : curlCode}
            language={codeLang === 'js' ? 'JavaScript (fetch)' : codeLang === 'py' ? 'Python (requests)' : 'cURL'}
          />
        </Card>
      </section>

      {/* Live playground */}
      <section>
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-black dark:text-white">Live playground</h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            {isAuthenticated ? 'Send a real text request using your API key.' : (
              <>
                <Link to="/login" className="text-indigo-600 hover:underline dark:text-indigo-400">Sign in</Link> to test live requests.
              </>
            )}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt, e.g. 'Explain what an API gateway does in 2 sentences'"
              rows={3}
              disabled={!isAuthenticated}
              className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-black placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 resize-none"
            />
            <button
              onClick={handleTest}
              disabled={!isAuthenticated || !prompt.trim() || testing}
              className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {testing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Running…
                </span>
              ) : 'Send →'}
            </button>
          </div>

          {testError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-800/50"
            >
              {testError}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Response</p>
              <div className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-200 whitespace-pre-wrap">
                {result}
              </div>
            </motion.div>
          )}
        </Card>
      </section>
    </div>
  )
}
