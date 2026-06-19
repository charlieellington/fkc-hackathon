// Human-first note: the final frame — the Flame at its biggest (bigger than the open), the score, and
// the one-line north star. Stop here. Last thing on screen is always the Flame.
import { useDemo } from '@/context/DemoProvider'
import { useCountUp } from '@/hooks/useCountUp'
import { Flame } from '@/components/flame/Flame'
import { Avatar } from '@/components/ui/Avatar'
import { closing, signalLabel } from '@/data/demoData'

export function CloseScreen() {
  const { state } = useDemo()
  const love = useCountUp(state.score.loveScore)

  return (
    <div className="flex h-full flex-col items-center justify-center bg-canvas px-6 pb-10 pt-14 text-center text-ink">
      <div className="mb-1 flex -space-x-2">
        <Avatar person="maya" size="sm" />
        <Avatar person="leo" size="sm" />
      </div>
      <Flame stage={state.flameStage} sizeClass="h-[160px]" />
      <div className="mt-3 font-display text-[92px] font-semibold leading-none text-ink [text-shadow:0_2px_44px_rgba(255,122,60,0.4)]">
        {love}
      </div>
      <p className="font-display text-[14px] italic text-ink-muted">your {signalLabel}</p>
      <p className="mt-6 max-w-[300px] font-display text-xl font-medium leading-snug text-ink/90 text-balance">
        {closing}
      </p>
    </div>
  )
}
