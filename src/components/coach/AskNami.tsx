// Human-first note: Feature 3 — "Ask Nami", the interactive play surface (the Nami+ Coach tease).
// A free-text box → one warm, specific tip from Claude, grounded in Maya & Leo's profile. It lives
// OUTSIDE the scripted run: mounted at the app root, shown only on mobile and only once the demo has
// landed on the closing screen, so a judge can poke it during Q&A without ever touching the live beats.
import { useEffect, useState } from 'react'
import { useDemo } from '@/context/DemoProvider'
import { aiSwap } from '@/lib/aiSwap'
import { couple, score, coach } from '@/data/demoData'
import { MessageCircleHeart, Sparkles, X } from 'lucide-react'

export function AskNami() {
  const { state } = useDemo()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [tip, setTip] = useState<string | null>(null)

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function ask() {
    if (!message.trim() || loading) return
    setLoading(true)
    setTip(null)
    const res = await aiSwap<{ tip: string | null }>('/api/coach', {
      message,
      couple: {
        names: `${couple.maya.name} & ${couple.leo.name}`,
        loves: { maya: couple.maya.language, leo: couple.leo.language },
        score: score.loveScore,
        gaps: 'intimacy drifting at 71, ~5 weeks since a date',
      },
    })
    setTip(res?.tip ?? coach.fallbackTip) // never a dead box
    setLoading(false)
  }

  // Mobile-only (md:hidden), and only on the closing screen so it never intrudes on the scripted run.
  if (state.currentScreen !== 'close') return null

  return (
    <div className="md:hidden">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="raised press fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ember px-5 py-3 text-base font-semibold text-canvas shadow-lg"
        >
          <MessageCircleHeart className="size-5" strokeWidth={2} /> {coach.triggerLabel}
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ask Nami"
          className="fixed inset-0 z-50 flex flex-col justify-end"
        >
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="animate-fade-rise relative max-h-[85svh] overflow-y-auto rounded-t-[20px] bg-canvas p-6 text-ink ring-1 ring-hairline">
            <div className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-2 font-display text-lg font-semibold text-ember">
                  <Sparkles className="size-5" strokeWidth={2} /> {coach.triggerLabel}
                </p>
                <p className="mt-1 text-sm text-ink-muted">{coach.intro}</p>
              </div>
              <button aria-label="Close" onClick={() => setOpen(false)} className="press p-1 text-ink-muted">
                <X className="size-5" strokeWidth={2} />
              </button>
            </div>

            <textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={coach.placeholder}
              aria-label="Your message to Nami"
              className="mt-4 h-24 w-full resize-none rounded-[12px] bg-surface p-3 text-[15px] text-ink ring-1 ring-hairline focus:outline-none focus:ring-2 focus:ring-ember/40"
            />

            <button
              onClick={ask}
              disabled={loading || !message.trim()}
              data-demo-action="ask-nami"
              className="raised press mt-3 w-full rounded-[12px] bg-ember py-3.5 text-lg font-semibold text-canvas disabled:opacity-60"
            >
              {loading ? 'Nami’s thinking…' : 'Ask Nami'}
            </button>

            {tip && (
              <div className="animate-glow-bloom mt-4 rounded-[12px] bg-surface-2 p-4 text-[15px] leading-relaxed text-ink ring-1 ring-rose/20">
                {tip}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
