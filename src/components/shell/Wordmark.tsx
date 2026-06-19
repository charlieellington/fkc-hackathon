// Human-first note: the "Nami 🔥" logo shown on the desktop stage. Press-and-hold it to
// secretly reset the demo to a clean seed mid-rehearsal (no visible reset button on stage).
import { cn } from '@/lib/utils'
import { useDemo } from '@/context/DemoProvider'
import { useLongPress } from '@/hooks/useLongPress'
import { FlameMark } from '@/components/flame/FlameMark'

export function Wordmark({ className }: { className?: string }) {
  const { reset } = useDemo()
  const longPress = useLongPress(reset)
  return (
    <button
      {...longPress}
      aria-label="Nami"
      className={cn('inline-flex select-none items-center gap-2 text-3xl text-ink', className)}
    >
      <FlameMark className="h-7" />
      <span className="font-display font-semibold tracking-tight">Nami</span>
    </button>
  )
}
