// Human-first note: one phone on the stage — a labelled device frame running the flow from a
// single person's perspective. `primary`/`recede` implement the Question "Focus Mode" so the
// emotional reveal has one focal point even with two phones on screen.
import { cn } from '@/lib/utils'
import type { Perspective } from '@/context/demo-types'
import { DeviceFrame } from './DeviceFrame'
import { StageView } from './StageView'
import { Avatar } from '@/components/ui/Avatar'
import { couple } from '@/data/demoData'

export function Phone({
  perspective,
  framed = true,
  primary = false,
  recede = false,
}: {
  perspective: Perspective
  framed?: boolean
  primary?: boolean
  recede?: boolean
}) {
  if (!framed) {
    return (
      <div className="h-svh w-full" data-perspective={perspective}>
        <DeviceFrame framed={false}>
          <StageView perspective={perspective} />
        </DeviceFrame>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3" data-perspective={perspective}>
      <div className="flex items-center gap-2 text-ink/85">
        <Avatar person={perspective} size="sm" ring />
        <span className="text-sm font-semibold">{couple[perspective].name}&rsquo;s phone</span>
      </div>
      <div
        className={cn(
          'origin-center transition-all duration-500 ease-out',
          primary && 'z-10 scale-[1.04]',
          recede && 'scale-[0.99] opacity-65',
        )}
      >
        <DeviceFrame framed>
          <StageView perspective={perspective} />
        </DeviceFrame>
      </div>
    </div>
  )
}
