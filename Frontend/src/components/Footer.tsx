export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} DevAI Hub. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <a className="hover:text-white transition" href="#privacy">Privacy</a>
            <a className="hover:text-white transition" href="#terms">Terms</a>
            <a className="hover:text-white transition" href="#security">Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
