type Props = {
  onExplore?: () => void
}

export default function Hero({ onExplore }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="mx-auto mt-10 h-64 w-[80%] max-w-5xl rounded-[32px] bg-gradient-to-r from-indigo-500/20 via-violet-500/10 to-transparent blur-3xl"></div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-br from-black to-zinc-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-white dark:to-zinc-400 sm:text-5xl">
            One API for all AI providers
          </h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            DevAI Hub is a gateway between your app and providers like OpenAI, Hugging Face, Stability, and ElevenLabs.
            Get one API key, call unified endpoints for text, image and speech, and manage usage, billing and analytics.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#api"
              onClick={(e) => { if (onExplore) { e.preventDefault(); onExplore() } }}
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-violet-400"
            >
              Explore API
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition group-hover:translate-x-0.5">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#docs"
              className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-5 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/10 transition hover:bg-white/10"
            >
              Read Docs
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
