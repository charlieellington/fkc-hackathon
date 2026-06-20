// Human-first note: emotion → action. Nami turns the two answers into one tiny anniversary plan —
// the kitesurf–coffee treaty (Leo's dawn surf, then home for Maya's coffee). One card, one honest
// action: Set reminder → a local toast (no real booking). The "that's clever" beat.
import { useDemo } from '@/context/DemoProvider'
import type { Perspective } from '@/context/demo-types'
import { cn } from '@/lib/utils'
import { anniversary } from '@/data/demoData'
import { Coffee, Check, Sparkles } from 'lucide-react'

export function AnniversaryPlanCard({
  perspective = 'maya',
  interactive = false,
}: {
  perspective?: Perspective
  interactive?: boolean
}) {
  const { state, setReminder, regeneratePlan } = useDemo()
  // Live plan if the answer was edited / "Make it cuter" was tapped, else the seed (presentation).
  const body = state.ai.plan[perspective] ?? anniversary.body
  const busy = state.ai.planBusy[perspective]

  return (
    <div className="flex h-full flex-col bg-canvas px-6 pb-6 pt-14 text-ink">
      <p className="font-display text-[15px] italic text-ink-muted">{anniversary.title}</p>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full rounded-[12px] bg-surface p-6 ring-1 ring-hairline [box-shadow:0_26px_64px_-32px_rgba(255,122,60,0.4)]">
          <p className="flex items-center gap-2 text-base font-bold text-ember">
            <Coffee className="size-5" strokeWidth={2} /> {anniversary.cardTitle}
          </p>
          <div className="relative overflow-hidden">
            <p className="mt-4 font-display text-[24px] font-semibold leading-snug text-ink">{body}</p>
            {busy && <div className="shimmer-sweep absolute inset-0" />}
          </div>
          {interactive && (
            <button
              onClick={() => regeneratePlan(perspective, body)}
              disabled={busy}
              data-demo-action="make-cuter"
              className="press mt-4 flex items-center gap-1.5 text-sm font-medium text-ember disabled:opacity-50"
            >
              <Sparkles className="size-4" strokeWidth={2} /> {busy ? 'thinking…' : 'Make it cuter'}
            </button>
          )}
        </div>
        <button
          onClick={setReminder}
          disabled={state.reminderSet}
          data-demo-action="set-reminder"
          className={cn(
            'raised press mt-6 flex items-center gap-2 rounded-[12px] px-10 py-3 text-lg font-semibold',
            state.reminderSet ? 'bg-surface-2 text-ink' : 'bg-ember text-canvas',
          )}
        >
          {state.reminderSet && <Check className="size-5" strokeWidth={2.5} />}
          {state.reminderSet ? 'Reminder set' : 'Set reminder'}
        </button>
      </div>
    </div>
  )
}
