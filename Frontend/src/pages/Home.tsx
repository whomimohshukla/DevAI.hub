import { useState, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'motion/react'

/* ─── Animation helpers ─── */
function FadeUp({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Section label ─── */
function Label({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
      {children}
    </span>
  )
}

/* ─── Feature data ─── */
const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    label: 'Gateway',
    title: 'Unified AI Gateway',
    desc: 'One consistent API surface for every provider—OpenAI, Hugging Face, Stability, ElevenLabs and more. Swap models without changing code.',
    gradient: 'from-indigo-500 via-violet-500 to-purple-600',
    glow: 'rgba(99,102,241,0.15)',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    label: 'Keys',
    title: 'API Key Management',
    desc: 'Create, rotate and revoke keys per environment. Per-key scopes, expiry dates, and last-used tracking keep you in full control.',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    label: 'Analytics',
    title: 'Usage & Analytics',
    desc: 'Real-time request logs, per-service breakdowns, token usage and latency metrics. Know exactly what is running and how much it costs.',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.15)',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor"/></svg>
    ),
    label: 'Billing',
    title: 'Stripe Billing',
    desc: 'Built-in subscription management with Stripe. Free, Pro, and Scale tiers with usage-based overages, invoices and webhook events.',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'rgba(244,63,94,0.15)',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    label: 'Routing',
    title: 'Smart Routing',
    desc: 'Configure service routes with priority-based or round-robin failover policies. Route traffic to the right model, every time.',
    gradient: 'from-sky-500 to-blue-600',
    glow: 'rgba(14,165,233,0.15)',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    label: 'Security',
    title: 'Enterprise Security',
    desc: 'Rate limiting, request logging, admin role guards, and CORS control. Your data never leaves your infrastructure.',
    gradient: 'from-fuchsia-500 to-violet-600',
    glow: 'rgba(217,70,239,0.15)',
  },
]

/* ─── Steps ─── */
const steps = [
  { n: '01', title: 'Register & get your key', desc: 'Create a free account in seconds. Your first API key is generated automatically—no credit card required.' },
  { n: '02', title: 'Call any AI service', desc: 'Send requests to /api/ai/text, /image or /speech with your key. We route to the right provider and model.' },
  { n: '03', title: 'Monitor & scale', desc: 'Watch usage and latency in real-time. Upgrade your plan as you grow—no code changes needed.' },
]

/* ─── Testimonials ─── */
const testimonials = [
  { quote: 'We cut our AI integration work from 3 weeks to 2 days. One key, every provider.', name: 'Arjun M.', role: 'Indie Developer', avatar: 'AM' },
  { quote: 'Switched from GPT-3.5 to GPT-4o without touching a single line of our app code.', name: 'Sara K.', role: 'CTO, Fintech startup', avatar: 'SK' },
  { quote: 'The usage dashboard showed we were 40% over-budget on image generation. Fixed it the same day.', name: 'Leo T.', role: 'Head of Product', avatar: 'LT' },
]

/* ─── Pricing ─── */
const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    desc: 'Perfect to get started',
    perks: ['100 requests / day', 'Basic models', '1 API key', 'Community support'],
    cta: 'Get started free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    desc: 'For growing products',
    perks: ['100k requests / month', 'All advanced models', '10 API keys', 'Email support', 'Usage analytics'],
    cta: 'Start Pro trial',
    featured: true,
  },
  {
    name: 'Scale',
    price: 'Custom',
    period: '',
    desc: 'For high-volume teams',
    perks: ['Unlimited requests', 'SLA guarantees', 'Dedicated support', 'Custom rate limits', 'SSO & SAML'],
    cta: 'Contact sales',
    featured: false,
  },
]

/* ─── Code snippets ─── */
const snippets = {
  js: `const res = await fetch('/api/ai/text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'dak_your_api_key',
  },
  body: JSON.stringify({
    prompt: 'Summarize this in 3 bullet points.',
    model: 'gpt-4o-mini',
  }),
})

const { text, tokensUsed, latencyMs } = await res.json()
console.log(text)`,

  python: `import requests

r = requests.post(
    "https://your-hub.com/api/ai/text",
    headers={"x-api-key": "dak_your_api_key"},
    json={
        "prompt": "Summarize this in 3 bullet points.",
        "model": "gpt-4o-mini",
    },
)

data = r.json()
print(data["text"])`,

  curl: `curl -X POST https://your-hub.com/api/ai/text \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: dak_your_api_key" \\
  -d '{
    "prompt": "Summarize this in 3 bullet points.",
    "model": "gpt-4o-mini"
  }'`,
}

/* ─── Color token for code syntax ─── */
function Token({ color, children }: { color: string; children: ReactNode }) {
  return <span style={{ color }}>{children}</span>
}

function HighlightedCode({ lang }: { lang: 'js' | 'python' | 'curl' }) {
  if (lang === 'js') return (
    <pre className="text-[13px] leading-[1.75] text-zinc-300 overflow-auto">
      <Token color="#9ca3af">{'const '}</Token>
      <Token color="#e2e8f0">{'res = '}</Token>
      <Token color="#a78bfa">{'await '}</Token>
      <Token color="#60a5fa">{'fetch'}</Token>
      <Token color="#e2e8f0">{"('/api/ai/text', {"}</Token>{'\n'}
      <Token color="#e2e8f0">{'  method: '}</Token>
      <Token color="#86efac">{`'POST',`}</Token>{'\n'}
      <Token color="#e2e8f0">{'  headers: {'}</Token>{'\n'}
      <Token color="#e2e8f0">{"    'Content-Type': "}</Token>
      <Token color="#86efac">{"'application/json',"}</Token>{'\n'}
      <Token color="#e2e8f0">{"    'x-api-key': "}</Token>
      <Token color="#fbbf24">{"'dak_your_api_key',"}</Token>{'\n'}
      <Token color="#e2e8f0">{'  },'}</Token>{'\n'}
      <Token color="#e2e8f0">{'  body: '}</Token>
      <Token color="#60a5fa">{'JSON.stringify'}</Token>
      <Token color="#e2e8f0">{'({'}</Token>{'\n'}
      <Token color="#e2e8f0">{'    prompt: '}</Token>
      <Token color="#86efac">{"'Summarize this in 3 bullet points.',"}</Token>{'\n'}
      <Token color="#e2e8f0">{'    model: '}</Token>
      <Token color="#86efac">{"'gpt-4o-mini',"}</Token>{'\n'}
      <Token color="#e2e8f0">{'  }),'}</Token>{'\n'}
      <Token color="#e2e8f0">{'})'}</Token>{'\n\n'}
      <Token color="#9ca3af">{'const '}</Token>
      <Token color="#e2e8f0">{'{ text, tokensUsed, latencyMs } = '}</Token>
      <Token color="#a78bfa">{'await '}</Token>
      <Token color="#e2e8f0">{'res.'}</Token>
      <Token color="#60a5fa">{'json'}</Token>
      <Token color="#e2e8f0">{'()'}</Token>{'\n'}
      <Token color="#60a5fa">{'console'}</Token>
      <Token color="#e2e8f0">{'.log(text)'}
      </Token>
    </pre>
  )
  return <pre className="text-[13px] leading-[1.75] text-zinc-300 overflow-auto whitespace-pre">{snippets[lang]}</pre>
}

/* ─── Main component ─── */
export default function Home() {
  const [codeLang, setCodeLang] = useState<'js' | 'python' | 'curl'>('js')
  const [copiedCode, setCopiedCode] = useState(false)

  const copyCode = async () => {
    await navigator.clipboard.writeText(snippets[codeLang])
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 1600)
  }

  return (
    <div className="relative overflow-hidden bg-[#fafafa] text-zinc-900 dark:bg-[#030303] dark:text-zinc-100">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative isolate min-h-[92vh] flex flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">

        {/* Background blobs — light */}
        <div aria-hidden className="pointer-events-none absolute inset-0 dark:hidden">
          <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/60 to-violet-200/40 blur-[120px]" />
          <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-gradient-to-tl from-sky-200/50 to-emerald-200/30 blur-[100px]" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)',
            }}
          />
        </div>

        {/* Background blobs — dark */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden dark:block">
          <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[130px]" />
          <div className="absolute right-1/4 bottom-10 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-violet-600/8 blur-[110px]" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-400">
              <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Now supporting 4+ AI providers · Free to start
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="gradient-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
              One API
            </span>
            {' '}
            <span className="text-zinc-900 dark:text-white">for all</span>
            <br />
            <span className="text-zinc-900 dark:text-white">AI providers</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400"
          >
            DevAI Hub routes your AI requests to OpenAI, Hugging Face, Stability AI and more
            through a single, consistent endpoint. Unified auth, analytics, billing and failover—built in.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/40 hover:-translate-y-0.5 dark:shadow-indigo-600/20"
            >
              Get started free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition group-hover:translate-x-0.5">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              to="/api"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-7 py-3.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              View API docs
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-xs text-zinc-500 dark:text-zinc-500"
          >
            No credit card required · Deploy in minutes · Open source friendly
          </motion.p>
        </div>

        {/* Floating hero code card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto mt-16 w-full max-w-2xl"
        >
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 text-[11px] text-zinc-500 dark:text-zinc-500">POST /api/ai/text</span>
            </div>
            <div className="p-5">
              <pre className="text-[13px] leading-[1.8] text-zinc-800 dark:text-zinc-300 overflow-auto">{`{
  `}<span className="text-indigo-600 dark:text-indigo-400">"prompt"</span>{`: `}<span className="text-emerald-600 dark:text-emerald-400">"Summarize in 3 bullet points."</span>{`,
  `}<span className="text-indigo-600 dark:text-indigo-400">"model"</span>{`:  `}<span className="text-emerald-600 dark:text-emerald-400">"gpt-4o-mini"</span>{`
}`}</pre>
              <div className="mt-3 flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <pre className="text-[12px] leading-[1.7] text-zinc-600 dark:text-zinc-400 overflow-auto">{`{ "text": "• AI is transforming software...\\n• DevAI Hub unifies...",
  "tokensUsed": 142, "latencyMs": 820 }`}</pre>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════ */}
      <FadeUp>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-zinc-200 bg-white px-8 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-4">
            {[
              { value: '4+', label: 'AI Providers' },
              { value: '10+', label: 'Models' },
              { value: '3', label: 'Service Types' },
              { value: '99.9%', label: 'Uptime' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 text-center">
                <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">{s.value}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      </FadeUp>

      {/* ═══════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" id="features">
        <FadeUp>
          <div className="mb-14 text-center">
            <Label>Features</Label>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Everything you need to build AI apps
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-500 dark:text-zinc-400">
              From a single request to enterprise-scale routing—DevAI Hub handles the infrastructure so you can focus on building.
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.06}>
              <FeatureCard {...f} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="mb-14 text-center">
            <Label>How it works</Label>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Up and running in minutes
            </h2>
          </div>
        </FadeUp>

        <div className="relative mx-auto max-w-3xl">
          {/* Vertical line */}
          <div className="absolute left-7 top-0 hidden h-full w-px bg-gradient-to-b from-indigo-500/60 via-violet-500/40 to-transparent sm:block" />

          <div className="space-y-8">
            {steps.map((s, i) => (
              <FadeUp key={s.n} delay={i * 0.1}>
                <div className="flex gap-6">
                  <div className="relative shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10">
                      <span className="text-lg font-black text-white">{s.n}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{s.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ARCHITECTURE FLOW
      ═══════════════════════════════════════════ */}
      <FadeUp>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {/* Header */}
            <div className="border-b border-zinc-100 px-8 py-5 dark:border-zinc-800">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">How DevAI Hub fits in your stack</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Your app talks to one endpoint. We handle routing, auth and failover to every provider.</p>
            </div>

            {/* Flow */}
            <div className="overflow-x-auto px-8 py-10">
              <div className="flex min-w-[600px] items-center justify-between gap-4">
                {/* Your App */}
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-16 w-36 items-center justify-center rounded-2xl border-2 border-indigo-200 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                    <div className="text-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mx-auto text-indigo-600 dark:text-indigo-400"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      <p className="mt-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Your App</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400">Single API key</span>
                </div>

                {/* Arrow */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex-1 h-px bg-gradient-to-r from-indigo-300 to-indigo-300 dark:from-indigo-600/50 dark:to-indigo-600/50" />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-indigo-400 mx-1 shrink-0"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>

                {/* DevAI Hub */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative flex h-16 w-44 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20">
                    <div className="text-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mx-auto text-white"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" className="fill-white/80"/></svg>
                      <p className="mt-0.5 text-[11px] font-bold text-white">DevAI Hub</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 max-w-[180px]">
                    {['Auth', 'Routing', 'Rate limit', 'Analytics'].map((t) => (
                      <span key={t} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex-1 h-px bg-gradient-to-r from-violet-300 to-violet-300 dark:from-violet-600/50 dark:to-violet-600/50" />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-violet-400 mx-1 shrink-0"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>

                {/* Providers */}
                <div className="flex flex-col gap-2">
                  {['OpenAI', 'Hugging Face', 'Stability', 'ElevenLabs'].map((p, i) => {
                    const colors = [
                      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400',
                      'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-600/25 dark:bg-orange-500/10 dark:text-orange-400',
                      'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-600/25 dark:bg-sky-500/10 dark:text-sky-400',
                      'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-600/25 dark:bg-rose-500/10 dark:text-rose-400',
                    ]
                    return (
                      <div key={p} className={`flex h-8 w-28 items-center justify-center rounded-xl border text-[10px] font-semibold ${colors[i]}`}>
                        {p}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ═══════════════════════════════════════════
          CODE DEMO
      ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text side */}
          <FadeUp>
            <div>
              <Label>Developer experience</Label>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                Integrate in minutes,<br />not weeks
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
                A single POST request is all you need. Send your prompt, get structured responses with usage metadata. Switch models by changing one field.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Consistent response schema across all providers',
                  'Automatic failover when a provider is down',
                  'Per-request latency and token tracking',
                  'Rate limiting and quota management built in',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-indigo-500"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/api" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Explore the full API reference
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </FadeUp>

          {/* Code side */}
          <FadeUp delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 shadow-2xl dark:border-zinc-700">
              {/* Tabs + copy */}
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <div className="flex gap-0.5 rounded-lg bg-zinc-900 p-1">
                  {(['js', 'python', 'curl'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setCodeLang(l)}
                      className={`rounded-md px-3 py-1 text-[11px] font-semibold transition ${
                        codeLang === l
                          ? 'bg-zinc-700 text-white'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {l === 'js' ? 'JavaScript' : l === 'python' ? 'Python' : 'cURL'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium text-zinc-400 ring-1 ring-zinc-700 hover:text-white transition"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M8 7a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V7z" fill="currentColor"/><path d="M5 8a2 2 0 0 1 2-2h8v2H7v8H5V8z" fill="currentColor"/></svg>
                  {copiedCode ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Code */}
              <div className="p-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={codeLang}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                  >
                    <HighlightedCode lang={codeLang} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUSTED BY
      ═══════════════════════════════════════════ */}
      <FadeUp>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-zinc-200 bg-white px-8 py-8 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Built with industry-leading tools
            </p>
            <div className="mt-6 grid grid-cols-3 items-center justify-items-center gap-6 sm:grid-cols-6">
              {[
                { name: 'OpenAI', color: 'text-zinc-800 dark:text-zinc-200' },
                { name: 'MongoDB', color: 'text-green-700 dark:text-green-400' },
                { name: 'Stripe', color: 'text-indigo-600 dark:text-indigo-400' },
                { name: 'TypeScript', color: 'text-blue-600 dark:text-blue-400' },
                { name: 'React', color: 'text-sky-600 dark:text-sky-400' },
                { name: 'Tailwind', color: 'text-teal-600 dark:text-teal-400' },
              ].map((b) => (
                <div key={b.name} className={`text-sm font-bold opacity-60 transition hover:opacity-100 ${b.color}`}>
                  {b.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="mb-12 text-center">
            <Label>Testimonials</Label>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Loved by developers
            </h2>
          </div>
        </FadeUp>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.08}>
              <TestimonialCard {...t} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" id="pricing">
        <FadeUp>
          <div className="mb-14 text-center">
            <Label>Pricing</Label>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400">
              Start free. Scale as you grow. No surprise bills.
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan, i) => (
            <FadeUp key={plan.name} delay={i * 0.07}>
              <PricingCard plan={plan} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════ */}
      <FadeUp>
        <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-8 py-16 text-center shadow-2xl shadow-indigo-500/20">
            {/* Background elements */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/8 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ship AI features<br className="hidden sm:block" /> 10× faster
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
                Integrate once. Route to any model. Get analytics, billing, and governance out of the box.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-white/95 hover:-translate-y-0.5"
                >
                  Start for free →
                </Link>
                <Link
                  to="/api"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  View API docs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>
    </div>
  )
}

/* ─── Feature Card ─── */
function FeatureCard({ icon, label, title, desc, gradient, glow }: {
  icon: ReactNode; label: string; title: string; desc: string; gradient: string; glow: string
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
    >
      {/* Hover glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(400px circle at 50% 0%, ${glow}, transparent 70%)` }}
      />

      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}>
        {icon}
      </div>

      <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{label}</span>
      <h3 className="mt-1 text-base font-bold text-zinc-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{desc}</p>
    </div>
  )
}

/* ─── Testimonial Card ─── */
function TestimonialCard({ quote, name, role, avatar }: { quote: string; name: string; role: string; avatar: string }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {[1,2,3,4,5].map((i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        ))}
      </div>

      <p className="flex-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">"{quote}"</p>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
          {avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{name}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{role}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Pricing Card ─── */
function PricingCard({ plan }: { plan: typeof plans[number] }) {
  return (
    <div className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 ${
      plan.featured
        ? 'bg-gradient-to-b from-indigo-600 to-violet-700 text-white shadow-2xl shadow-indigo-500/25 scale-[1.02]'
        : 'border border-zinc-200 bg-white shadow-sm hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900'
    }`}>
      {plan.featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-amber-400 px-4 py-1 text-[11px] font-bold text-amber-900 shadow-sm">
            Most popular
          </span>
        </div>
      )}

      <div>
        <h3 className={`text-base font-bold ${plan.featured ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
          {plan.name}
        </h3>
        <p className={`mt-0.5 text-xs ${plan.featured ? 'text-white/70' : 'text-zinc-500 dark:text-zinc-400'}`}>
          {plan.desc}
        </p>
      </div>

      <div className="mt-5">
        <span className={`text-4xl font-extrabold tracking-tight ${plan.featured ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
          {plan.price}
        </span>
        {plan.period && (
          <span className={`text-sm font-medium ${plan.featured ? 'text-white/60' : 'text-zinc-500 dark:text-zinc-400'}`}>
            {plan.period}
          </span>
        )}
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2.5 text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`shrink-0 ${plan.featured ? 'text-white/80' : 'text-indigo-500'}`}>
              <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className={plan.featured ? 'text-white/90' : 'text-zinc-600 dark:text-zinc-400'}>{perk}</span>
          </li>
        ))}
      </ul>

      <Link
        to="/login"
        className={`mt-8 block rounded-xl py-3 text-center text-sm font-bold transition hover:-translate-y-0.5 ${
          plan.featured
            ? 'bg-white text-indigo-700 shadow-lg hover:bg-white/95'
            : 'border border-zinc-300 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
        }`}
      >
        {plan.cta}
      </Link>
    </div>
  )
}
