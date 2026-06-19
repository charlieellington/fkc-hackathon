// Human-first note: the Pulse — the one tap on Today and the ONLY thing that moves the Love Score.
// "Absolutely" is the single ember primary; the other three are muted face options. After answering it
// collapses to a quiet confirmation.
import { useDemo } from '@/context/DemoProvider'
import { pulse } from '@/data/demoData'
import { Smile, Meh, Frown, Check } from 'lucide-react'

const restFaces = [Smile, Meh, Frown]

export function PulseInline() {
  const { state, answerPulse } = useDemo()

  if (state.pulseAnswered) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-[12px] bg-surface px-4 py-4 text-ink ring-1 ring-hairline">
        <Check className="size-5 text-ember" strokeWidth={2.5} />
        <span className="text-base font-semibold">{pulse.onAbsolutely.collapsedLabel}</span>
      </div>
    )
  }

  const [primary, ...rest] = pulse.options
  return (
    <div className="rounded-[12px] bg-surface p-4 ring-1 ring-hairline">
      <p className="mb-3 text-center text-base font-semibold text-ink">{pulse.question}</p>
      <button
        onClick={answerPulse}
        data-demo-action="pulse"
        className="raised press flex w-full items-center justify-center gap-2 rounded-[12px] bg-ember py-3 text-lg font-semibold text-canvas"
      >
        <Smile className="size-5" strokeWidth={2} /> {primary}
      </button>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {rest.map((option, i) => {
          const Face = restFaces[i]
          return (
            <button
              key={option}
              onClick={answerPulse}
              className="press flex flex-col items-center gap-1 rounded-[12px] bg-surface-2 py-2 text-xs font-medium text-ink/85 ring-1 ring-hairline"
            >
              <Face className="size-4 text-ink/70" strokeWidth={2} /> {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
