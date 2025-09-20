import FeatureCard from '../components/FeatureCard'
import Hero from '../components/Hero'
import FlowDiagram from '../components/FlowDiagram'

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
    <main>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FlowDiagram />
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-black dark:text-white">Core features</h2>
          <a href="#docs" className="text-sm text-zinc-600 hover:text-black transition dark:text-zinc-400 dark:hover:text-white">View docs →</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <FeatureCard key={f.title} title={f.title} desc={f.desc} accent={f.accent} />
          ))}
        </div>
      </section>
    </main>
  )
}
