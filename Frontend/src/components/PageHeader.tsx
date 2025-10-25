import { motion } from 'motion/react'

type Props = {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-8">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-2xl font-semibold tracking-tight text-black dark:text-white"
      >
        {title}
      </motion.h1>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
        className="mt-2 h-0.5 w-16 origin-left rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-fuchsia-500"
      />
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mt-2 text-sm text-zinc-700 dark:text-zinc-300"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
