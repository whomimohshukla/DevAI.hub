import FeatureCard from '../components/FeatureCard'
import Hero from '../components/Hero'
import FlowDiagram from '../components/FlowDiagram'
import ContainerScroll from '../components/ContainerScroll'
import { CardSpotlight } from '../components/ui/card-spotlight'

const features = [
  {
    title: 'Unified AI Gateway',
    desc: 'Connect to multiple AI providers through a single, consistent API surface.',
    accent: 'from-indigo-500 to-violet-500',
  },
  {
    title: 'API Keys & Usage',
    desc: 'Manage keys, track usage and costs with beautiful analytics-ready endpoints.',
    accent: 'from-emerald-500 to-teal-400',
  },
  {
    title: 'Billing & Webhooks',
    desc: 'Stripe-powered subscriptions with secure webhooks baked in.',
    accent: 'from-amber-400 to-rose-500',
  },
  {
    title: 'Admin Controls',
    desc: 'Curate providers, models and service routes with granular control.',
    accent: 'from-fuchsia-500 to-pink-500',
  },
]

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Background grid (homepage only) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 block dark:hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 42px), repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 42px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 42px), repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 42px)",
        }}
      />
      <div className="relative z-10">
        <Hero />
      </div>
      <div className="relative z-10 space-y-14 sm:space-y-16 lg:space-y-24">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-20">
          <ContainerScroll
            titleComponent={
              <>
                <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
                  How DevAI Hub fits in
                </h2>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  Your app calls a single, unified API. DevAI Hub handles authentication, routing, usage and billing,
                  then fans out to the right models across providers.
                </p>
              </>
            }
          >
            <FlowDiagram />
          </ContainerScroll>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-black dark:text-white">Core features</h2>
            <a href="#docs" className="text-sm text-zinc-600 hover:text-black transition dark:text-zinc-400 dark:hover:text-white">View docs →</a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <FeatureCard key={f.title} title={f.title} desc={f.desc} />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">How it works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { step: '1', title: 'Sign up', desc: 'Create an account and get your API key.' },
              { step: '2', title: 'Pick services', desc: 'Text, image, or speech — one API, many providers.' },
              { step: '3', title: 'Ship fast', desc: 'Use our SDKs or REST endpoints and go live.' },
            ].map((s) => (
              <CardSpotlight key={s.step} tone="black">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                    {s.step}
                  </span>
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm text-white/80">{s.desc}</p>
              </CardSpotlight>
            ))}
          </div>
        </section>

        {/* SDK examples */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-black dark:text-white">Use it your way</h2>
            <a href="/api" className="text-sm text-zinc-600 hover:text-black transition dark:text-zinc-400 dark:hover:text-white">See all endpoints →</a>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <CardSpotlight tone="black">
              <p className="text-xs font-semibold text-white/80">JavaScript (fetch)</p>
              <pre className="mt-2 overflow-auto rounded-lg bg-white/10 p-3 text-[12px] text-white/90">{`fetch('/api/ai/text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({ prompt: 'Summarize this...', provider: 'openai:gpt-4o-mini' })
}).then(r => r.json())`}</pre>
            </CardSpotlight>
            <CardSpotlight tone="black">
              <p className="text-xs font-semibold text-white/80">Python (requests)</p>
              <pre className="mt-2 overflow-auto rounded-lg bg-white/10 p-3 text-[12px] text-white/90">{`import requests
headers = {'Authorization': 'Bearer YOUR_API_KEY'}
data = {'prompt': 'Write a tweet...', 'provider': 'openai:gpt-4o-mini'}
r = requests.post('https://your-hub.com/api/ai/text', json=data, headers=headers)
print(r.json())`}</pre>
            </CardSpotlight>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-sm dark:border-white/10">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
            <h3 className="text-2xl font-bold tracking-tight">Ship AI features 10x faster</h3>
            <p className="mt-2 max-w-prose text-sm text-white/90">Integrate once, scale across providers, and get analytics, billing, and governance out of the box.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="/api" className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-white/20 hover:bg-white/15">View API</a>
              <a href="#docs" className="rounded-md bg-black/20 px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-black/20 hover:bg-black/30">Read Docs</a>
            </div>
          </div>
        </section>
      </div>

      {/* Logos */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-black/10 bg-white/80 p-6 backdrop-blur dark:border-white/10 dark:bg-zinc-900/60">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">Trusted components & infrastructure</p>
          <div className="mt-4 grid grid-cols-2 items-center justify-items-center gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {['OpenAI','Hugging Face','Stability','Stripe','Clerk','Vercel'].map((n) => (
              <div key={n} className="text-xs font-medium text-zinc-700 opacity-70 dark:text-zinc-300">{n}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">Loved by developers</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { q: 'We shipped in days instead of weeks.', a: 'The unified API and docs are excellent.', name: 'Arjun, Indie dev' },
            { q: 'One key, many providers.', a: 'We switched models without touching our app code.', name: 'Sara, CTO' },
            { q: 'Great analytics.', a: 'Usage and cost insights saved us money.', name: 'Leo, Product' },
          ].map((t) => (
            <CardSpotlight key={t.name} tone="black">
              <p className="text-sm font-medium">“{t.q}”</p>
              <p className="mt-2 text-sm text-white/80">{t.a}</p>
              <p className="mt-3 text-xs text-white/60">{t.name}</p>
            </CardSpotlight>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">Simple pricing</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[ 
            { name: 'Free', price: '$0', perks: ['100 requests/day','Basic models','Community support'], highlight: false },
            { name: 'Pro', price: '$29', perks: ['100k requests/mo','Advanced models','Email support'], highlight: true },
            { name: 'Scale', price: 'Contact', perks: ['Custom limits','SLAs','Dedicated support'], highlight: false },
          ].map((p) => (
            <CardSpotlight key={p.name} tone="black">
              {p.highlight && <span className="mb-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white">Popular</span>}
              <h3 className="text-sm font-semibold">{p.name}</h3>
              <p className="mt-1 text-2xl font-bold">{p.price}<span className="text-sm font-medium text-white/70">{p.price==='Contact' ? '' : '/mo'}</span></p>
              <ul className="mt-3 space-y-1 text-sm text-white/80">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
                    {perk}
                  </li>
                ))}
              </ul>
              <a href="/billing" className="mt-4 inline-flex rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">Get started</a>
            </CardSpotlight>
          ))}
        </div>
      </section>
    </main>
  )
}
