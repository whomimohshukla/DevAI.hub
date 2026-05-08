import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import { CardSpotlight } from '../components/ui/card-spotlight'
import { useAuth } from '../contexts/AuthContext'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    perks: [
      '100 requests/day',
      'Basic models (GPT-3.5, SD)',
      'Community support',
      '1 API key',
    ],
    cta: 'Current plan',
    ctaVariant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    perks: [
      '100,000 requests/month',
      'All advanced models',
      'Email support',
      '10 API keys',
      'Usage analytics',
    ],
    cta: 'Upgrade to Pro',
    ctaVariant: 'primary' as const,
    popular: true,
  },
  {
    name: 'Scale',
    price: 'Custom',
    period: '',
    perks: [
      'Unlimited requests',
      'SLA guarantees',
      'Dedicated support',
      'Custom rate limits',
      'SSO & SAML',
    ],
    cta: 'Contact sales',
    ctaVariant: 'outline' as const,
  },
]

export default function Billing() {
  const { user } = useAuth()
  const currentPlan = user?.subscriptionPlan || 'free'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title="Billing" subtitle="Manage your plan, usage limits and payment methods." />

      {/* Plan cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-10">
        {plans.map((plan) => {
          const isCurrent = plan.name.toLowerCase() === currentPlan
          return (
            <div key={plan.name} className="relative">
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-0.5 text-[11px] font-bold text-white shadow-sm">
                    Most popular
                  </span>
                </div>
              )}
              <CardSpotlight tone="black" className={plan.popular ? 'ring-2 ring-indigo-500/50' : ''}>
                {isCurrent && (
                  <span className="mb-2 inline-flex rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                    Current plan
                  </span>
                )}
                <h3 className="text-base font-bold text-white">{plan.name}</h3>
                <p className="mt-1 text-3xl font-bold text-white">
                  {plan.price}
                  <span className="text-sm font-medium text-white/60">{plan.period}</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-white/80">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-green-400 shrink-0">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {perk}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {isCurrent ? (
                    <span className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white/60 cursor-default">
                      Active
                    </span>
                  ) : plan.ctaVariant === 'primary' ? (
                    <button className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-white/95 transition">
                      {plan.cta}
                    </button>
                  ) : (
                    <button className="w-full rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition">
                      {plan.cta}
                    </button>
                  )}
                </div>
              </CardSpotlight>
            </div>
          )
        })}
      </div>

      {/* Billing details */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Payment Method</h3>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <svg viewBox="0 0 38 24" width="28" height="18" role="img" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#1565C0"/>
                <text x="5" y="16" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">VISA</text>
              </svg>
            </div>
            <div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">Visa •••• 4242</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Expires 12/26</p>
            </div>
          </div>
          <button className="mt-4 rounded-lg border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Update payment method
          </button>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-black dark:text-white">Billing History</h3>
          <div className="mt-3 space-y-2">
            {[
              { date: 'May 1, 2026', amount: '$0.00', status: 'paid', plan: 'Free' },
              { date: 'Apr 1, 2026', amount: '$0.00', status: 'paid', plan: 'Free' },
            ].map((invoice) => (
              <div key={invoice.date} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800/50">
                <div>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">{invoice.date}</p>
                  <p className="text-xs text-zinc-500">{invoice.plan} plan</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-zinc-900 dark:text-white">{invoice.amount}</p>
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upgrade CTA */}
      {currentPlan === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-violet-600 p-8 text-white shadow-lg ring-1 ring-white/10 dark:border-white/10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold">Ready to scale?</h3>
              <p className="mt-1 text-white/80">Get 100k requests/month, advanced models, and priority support.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 shadow-sm hover:bg-white/95 transition">
                Upgrade to Pro — $29/mo
              </button>
              <Link to="/usage" className="rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition">
                View usage
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
