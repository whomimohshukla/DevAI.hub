import { motion } from 'motion/react'
type Props = {
  onExplore?: () => void
}


// this the hero section at the top of the homepage
export default function Hero({ onExplore }: Props) {
  return (
    <section className="relative overflow-hidden">
      {/* Animated grid background */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 block dark:hidden"
        animate={{ x: [0, 18, 0], y: [0, 10, 0] }}
        transition={{ duration: 22, ease: 'easeInOut', repeat: Infinity }}
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 40px)",
          maskImage:
            "radial-gradient(closest-side, rgba(0,0,0,0.9), rgba(0,0,0,0.7), rgba(0,0,0,0.2) 70%, transparent)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
        animate={{ x: [0, 18, 0], y: [0, 10, 0] }}
        transition={{ duration: 22, ease: 'easeInOut', repeat: Infinity }}
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 40px)",
          maskImage:
            "radial-gradient(closest-side, rgba(0,0,0,0.9), rgba(0,0,0,0.7), rgba(0,0,0,0.2) 70%, transparent)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
          >
            <motion.h1
              className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-indigo-500 via-sky-500 to-fuchsia-500 bg-clip-text text-transparent"
              style={{ backgroundSize: '200% 200%' }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
              transition={{ repeat: Infinity, repeatType: 'mirror', duration: 6, ease: 'linear' }}
            >
              {"One API for all AI providers".split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  className="inline-block"
                >
                  {word}{' '}
                </motion.span>
              ))}
            </motion.h1>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mx-auto mt-3 h-px w-40 origin-left bg-zinc-300 dark:bg-zinc-700"
          />
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-4 text-zinc-700 dark:text-zinc-300"
          >
            DevAI Hub is a gateway between your app and providers like OpenAI, Hugging Face, Stability, and ElevenLabs.
            Get one API key, call unified endpoints for text, image and speech, and manage usage, billing and analytics.
          </motion.p>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6">
            <a
              href="/api"
              onClick={(e) => { if (onExplore) { e.preventDefault(); onExplore() } }}
              className="group inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-900 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Explore API
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition group-hover:translate-x-0.5">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#docs"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-3.5 text-sm font-semibold text-black hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
            >
              Read Docs
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
