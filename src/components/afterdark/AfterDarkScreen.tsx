// Human-first note: the locked, parent-safe "After Dark" wink — the mid-show laugh + the paywall tease.
// A static beat: a big rose forecast number, one cheeky line, a locked Unlock button. Tapping anything
// responds with a toast (never a dead-click) and moves on.
import { Lock, Sparkles } from 'lucide-react'
import { useDemo } from '@/context/DemoProvider'
import { afterDark } from '@/data/demoData'

export function AfterDarkScreen() {
  const { tapAfterDark } = useDemo()

  return (
    <div className="flex h-full flex-col items-center justify-center bg-canvas px-6 pb-8 pt-14 text-center text-ink">
      <div className="flex items-center gap-2 font-display text-[15px] italic text-ink-muted">
        <Sparkles className="size-4 text-rose" strokeWidth={1.75} /> after dark <Lock className="size-3.5" strokeWidth={1.75} />
      </div>

      <p className="mt-10 text-sm text-ink-muted">tonight&rsquo;s forecast</p>
      <button
        onClick={tapAfterDark}
        data-demo-action="afterdark"
        className="press my-1 font-display text-[118px] font-semibold leading-none text-ink [text-shadow:0_2px_44px_rgba(255,107,129,0.45)]"
      >
        {afterDark.forecast}
        <span className="text-rose">%</span>
      </button>
      <p className="mt-2 max-w-[260px] text-base text-ink-muted">{afterDark.line}</p>

      <button
        onClick={tapAfterDark}
        className="press mt-12 flex items-center gap-2 rounded-[12px] bg-surface px-8 py-3 text-base font-semibold text-ink ring-1 ring-hairline"
      >
        <Lock className="size-4" strokeWidth={2} /> {afterDark.unlockCta}
      </button>
    </div>
  )
}
