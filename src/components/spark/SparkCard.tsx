// Human-first note: the Spark — one nudge per phone, tinted by the RECEIVER's love language
// (Maya→Leo amber/Physical Touch · Leo→Maya teal/Quality Time). "Same couple, two manuals." Done gives
// XP + confetti + a flame sparkle, but never moves the score (honesty = trust).
import { useDemo } from '@/context/DemoProvider'
import type { Perspective } from '@/context/demo-types'
import { cn } from '@/lib/utils'
import { spark } from '@/data/demoData'
import { Confetti } from '@/components/fx/Confetti'
import { Check } from 'lucide-react'

export function SparkCard({ perspective }: { perspective: Perspective }) {
  const { state, completeSpark } = useDemo()
  const nudge = spark[perspective]
  const receiver = perspective === 'maya' ? 'Leo' : 'Maya'
  const accent = nudge.accent === 'amber' ? 'var(--color-amber)' : 'var(--color-teal)'

  return (
    <div className="relative flex h-full flex-col bg-canvas px-6 pb-6 pt-14 text-ink">
      <p className="text-center font-display text-[15px] italic text-ink-muted">today&rsquo;s spark</p>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div
          className="w-full rounded-[12px] bg-surface p-6 ring-1 ring-hairline"
          style={{ boxShadow: `0 26px 64px -30px ${accent}66` }}
        >
          <p className="text-base font-bold" style={{ color: accent }}>
            {nudge.header}
          </p>
          <p className="mt-4 font-display text-[26px] font-semibold leading-snug text-ink">{nudge.body}</p>
          <p className="mt-4 text-sm text-ink-muted">
            {receiver} feels loved through <span style={{ color: accent }}>{nudge.language}</span>.
          </p>
        </div>
        <button
          onClick={completeSpark}
          disabled={state.sparkDone}
          data-demo-action="spark-done"
          className={cn('raised press mt-6 flex items-center gap-2 rounded-[12px] px-12 py-3 text-lg font-semibold', state.sparkDone && 'opacity-70')}
          style={{
            background: state.sparkDone ? 'var(--color-surface-2)' : accent,
            color: state.sparkDone ? 'var(--color-ink)' : 'var(--color-canvas)',
          }}
        >
          {state.sparkDone && <Check className="size-5" strokeWidth={2.5} />}
          {state.sparkDone ? 'Saved' : 'Done'}
        </button>
      </div>
      {state.sparkDone && <Confetti />}
    </div>
  )
}
