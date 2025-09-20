import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6 lg:px-8">
      <div className="relative">
        <span className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-2xl" />
        <h1 className="text-6xl font-extrabold tracking-tight text-black dark:text-white">404</h1>
      </div>
      <p className="mt-3 text-lg text-zinc-700 dark:text-zinc-300">Page not found</p>
      <p className="mt-1 max-w-prose text-sm text-zinc-600 dark:text-zinc-400">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="mt-6">
        <Link to="/" className="rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-indigo-400 hover:to-violet-400">
          Go back home
        </Link>
      </div>
    </div>
  )
}
