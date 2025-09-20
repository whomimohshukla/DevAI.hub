export default function FlowDiagram() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
        <svg viewBox="0 0 800 260" className="h-56 w-full text-zinc-700 dark:text-zinc-300">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <rect x="40" y="30" width="220" height="80" rx="14" fill="url(#g1)" opacity="0.15" />
          <rect x="40" y="30" width="220" height="80" rx="14" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          <text x="150" y="75" textAnchor="middle" className="fill-current">Developer App</text>

          <rect x="290" y="30" width="220" height="80" rx="14" fill="url(#g1)" opacity="0.15" />
          <rect x="290" y="30" width="220" height="80" rx="14" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          <text x="400" y="60" textAnchor="middle" className="fill-current">DevAI Hub</text>
          <text x="400" y="82" textAnchor="middle" className="fill-current" fontSize="12">Auth • Routing • Analytics • Billing</text>

          <rect x="540" y="10" width="220" height="50" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          <text x="650" y="40" textAnchor="middle" className="fill-current" fontSize="12">OpenAI</text>
          <rect x="540" y="70" width="220" height="50" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          <text x="650" y="100" textAnchor="middle" className="fill-current" fontSize="12">Hugging Face</text>
          <rect x="540" y="130" width="220" height="50" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          <text x="650" y="160" textAnchor="middle" className="fill-current" fontSize="12">Stability AI</text>
          <rect x="540" y="190" width="220" height="50" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          <text x="650" y="220" textAnchor="middle" className="fill-current" fontSize="12">ElevenLabs</text>

          <line x1="260" y1="70" x2="290" y2="70" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="510" y1="70" x2="540" y2="35" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="510" y1="70" x2="540" y2="95" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="510" y1="70" x2="540" y2="145" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="510" y1="70" x2="540" y2="205" stroke="currentColor" strokeOpacity="0.5" />

          <circle cx="260" cy="70" r="3" fill="currentColor" />
          <circle cx="290" cy="70" r="3" fill="currentColor" />
          <circle cx="510" cy="70" r="3" fill="currentColor" />
          <circle cx="540" cy="35" r="3" fill="currentColor" />
          <circle cx="540" cy="95" r="3" fill="currentColor" />
          <circle cx="540" cy="145" r="3" fill="currentColor" />
          <circle cx="540" cy="205" r="3" fill="currentColor" />
        </svg>
      </div>
    </div>
  )
}
