// Human-first note: the stage anchor. Header (the couple + their streak), the hero Flame + Love Score,
// two calendar nudges, and the inline Pulse — all on the dark candlelit canvas.
import { Flame as FlameIcon } from 'lucide-react'
import { FlameHero } from '@/components/flame/FlameHero'
import { NudgeChips } from '@/components/nudge/NudgeChips'
import { PulseInline } from '@/components/pulse/PulseInline'
import { Avatar } from '@/components/ui/Avatar'
import { score } from '@/data/demoData'

function Header() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          <Avatar person="maya" size="sm" />
          <Avatar person="leo" size="sm" />
        </div>
        <span className="text-sm font-semibold text-ink">Maya &amp; Leo</span>
      </div>
      <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
        <FlameIcon className="size-3.5 text-ember" strokeWidth={2} /> {score.streakDays} days
      </span>
    </div>
  )
}

export function TodayScreen() {
  return (
    <div className="flex h-full flex-col bg-canvas px-6 pb-6 pt-12 text-ink">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center">
        <FlameHero />
      </div>
      <NudgeChips />
      <div className="mt-4">
        <PulseInline />
      </div>
    </div>
  )
}
