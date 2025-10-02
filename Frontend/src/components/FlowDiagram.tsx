export default function FlowDiagram() {
  const providers = [
    { name: 'OpenAI', models: ['GPT‑4o', 'GPT‑3.5', 'Whisper'] },
    { name: 'Hugging Face', models: ['Flan‑T5', 'Llama', 'CLIP'] },
    { name: 'Stability AI', models: ['SDXL', 'SD3', 'Core'] },
    { name: 'ElevenLabs', models: ['Multilingual‑V2', 'Voice‑Cloning'] },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1.4fr] md:items-start">
          {/* Left: Developer */}
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Developer App</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Your product</li>
              <li>Single API key</li>
            </ul>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center pt-6 text-zinc-500">→</div>

          {/* Middle: Hub */}
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">DevAI Hub</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Auth & key management</li>
              <li>Routing & failover</li>
              <li>Usage & rate limits</li>
              <li>Billing & webhooks</li>
            </ul>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center pt-6 text-zinc-500">→</div>

          {/* Right: Providers */}
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">AI Providers & Models</h3>
            <div className="mt-2 grid gap-3">
              {providers.map((p) => (
                <div key={p.name} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                  <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{p.name}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {p.models.map((m) => (
                      <span key={m} className="rounded-md border border-zinc-200 px-2 py-0.5 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile arrows */}
        <div className="mt-4 grid gap-3 md:hidden">
          <div className="flex items-center justify-center text-zinc-500">↓</div>
          <div className="flex items-center justify-center text-zinc-500">↓</div>
        </div>
      </div>
    </div>
  )
}
