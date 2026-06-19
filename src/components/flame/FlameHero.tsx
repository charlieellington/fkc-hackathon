// Human-first note: the hero block — the glowing Flame with the big Love Score counting beneath it,
// the weekly trend, a soft italic "your relationship signal" line, and the two sub-scores. The number
// carries a faint warm glow so it reads like it's lit by the flame above it.
import { cn } from '@/lib/utils'
import { useDemo } from '@/context/DemoProvider'
import { useCountUp } from '@/hooks/useCountUp'
import { Flame } from './Flame'
import { signalLabel } from '@/data/demoData'

export function FlameHero({ scoreSize = 'text-[96px]' }: { scoreSize?: string }) {
  const { state } = useDemo()
  const love = useCountUp(state.score.loveScore)
  const emotional = useCountUp(state.score.emotional)

  return (
    <div className="flex flex-col items-center text-center">
      <Flame stage={state.flameStage} sizeClass="h-[114px]" />
      <div className="mt-3 flex items-end gap-2.5">
        <span className={cn('font-display font-semibold leading-none text-ink [text-shadow:0_2px_30px_rgba(255,122,60,0.35)]', scoreSize)}>
          {love}
        </span>
        <span className="mb-3 rounded-full bg-ember/15 px-2 py-0.5 text-sm font-semibold text-ember">
          +{state.score.trendThisWeek} this week
        </span>
      </div>
      <p className="mt-1.5 font-display text-[15px] italic text-ink-muted">your {signalLabel}</p>
      <p className="mt-3 text-[14px] font-medium text-ink-muted">
        Emotional {emotional} <span className="text-ink-faint">·</span> Intimate {state.score.intimate}
      </p>
    </div>
  )
}
