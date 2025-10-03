export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white/80 backdrop-blur dark:border-white/5 dark:bg-black/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7">
                <span className="absolute inset-0 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 blur-sm opacity-70"></span>
                <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-black ring-1 ring-black/10 dark:bg-zinc-900 dark:ring-white/10">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" className="fill-white/90" />
                  </svg>
                </span>
              </div>
              <span className="text-sm font-semibold text-black dark:text-white">DevAI Hub</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-zinc-700 dark:text-zinc-300">One API for all AI providers—text, image, and speech with unified auth, routing, and analytics.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:col-span-2 sm:grid-cols-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Product</h4>
              <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                <li><a className="hover:underline" href="/api">API</a></li>
                <li><a className="hover:underline" href="/usage">Usage</a></li>
                <li><a className="hover:underline" href="/billing">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Admin</h4>
              <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                <li><a className="hover:underline" href="/admin/providers">Providers</a></li>
                <li><a className="hover:underline" href="/admin/provider-models">Models</a></li>
                <li><a className="hover:underline" href="/admin/service-routes">Routes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Company</h4>
              <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                <li><a className="hover:underline" href="#about">About</a></li>
                <li><a className="hover:underline" href="#careers">Careers</a></li>
                <li><a className="hover:underline" href="#contact">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Legal</h4>
              <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                <li><a className="hover:underline" href="#privacy">Privacy</a></li>
                <li><a className="hover:underline" href="#terms">Terms</a></li>
                <li><a className="hover:underline" href="#security">Security</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 text-xs text-zinc-600 dark:border-white/5 dark:text-zinc-400 sm:flex-row">
          <p>© {new Date().getFullYear()} DevAI Hub. All rights reserved.</p>
          <p>Made with ♥ for developers</p>
        </div>
      </div>
    </footer>
  )
}
