// Human-first note: emotion → action. Nami turns the moment they BOTH just named into a tiny
// anniversary plan ("recreate Sunday coffee"). One card, one honest action: Set reminder → a local
// toast (no real booking). The "that's clever" beat.
import { useDemo } from '@/context/DemoProvider'
import { cn } from '@/lib/utils'
import { anniversary } from '@/data/demoData'
import { Coffee, Check } from 'lucide-react'

export function AnniversaryPlanCard() {
  const { state, setReminder } = useDemo()

  return (
    <div className="flex h-full flex-col bg-canvas px-6 pb-6 pt-14 text-ink">
      <p className="font-display text-[15px] italic text-ink-muted">{anniversary.title}</p>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full rounded-[18px] bg-surface p-6 ring-1 ring-hairline [box-shadow:0_26px_64px_-32px_rgba(255,122,60,0.4)]">
          <p className="flex items-center gap-2 text-base font-bold text-ember">
            <Coffee className="size-5" strokeWidth={2} /> {anniversary.cardTitle}
          </p>
          <p className="mt-4 font-display text-[24px] font-semibold leading-snug text-ink">{anniversary.body}</p>
        </div>
        <button
          onClick={setReminder}
          disabled={state.reminderSet}
          data-demo-action="set-reminder"
          className={cn(
            'raised press mt-6 flex items-center gap-2 rounded-full px-10 py-3 text-lg font-semibold',
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
