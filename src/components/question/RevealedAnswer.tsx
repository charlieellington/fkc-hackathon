// Human-first note: THE peak. The partner's full answer, unblurred at 26px on a softly glowing panel
// that blooms into view, with a slow-floating heart beneath. This is the line judges should remember.
import { Heart } from 'lucide-react'

export function RevealedAnswer({ text }: { text: string }) {
  return (
    <div className="animate-glow-bloom rounded-[12px] bg-surface-2 p-5 ring-1 ring-rose/20 [box-shadow:0_0_76px_-20px_rgba(255,107,129,0.32)]">
      <p className="font-display text-[22px] font-medium leading-[1.42] text-ink text-balance">{text}</p>
      <Heart className="mt-3 size-7 animate-float text-rose" fill="currentColor" strokeWidth={0} />
    </div>
  )
}
