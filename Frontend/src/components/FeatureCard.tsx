import Card from './Card'

type Props = {
  title: string
  desc: string
  accent: string // tailwind gradient colors e.g. "from-indigo-500 to-violet-500"
}

export default function FeatureCard({ title, desc, accent }: Props) {
  return (
    <Card>
      <span className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-2xl transition group-hover:opacity-20`} />
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
        Learn more
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition group-hover:translate-x-0.5">
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Card>
  )
}
