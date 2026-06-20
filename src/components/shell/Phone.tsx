// Human-first note: one phone on the stage — a labelled device frame running the flow from a single
// person's perspective. `primary`/`recede` implement the Question "Focus Mode". On the Today screen an
// OVERSIZED team photo sits behind the phone (the comedic reveal) and peeks out to the side; it fades
// out once the demo advances so it never competes with the emotional beats.
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
  showBigAvatar = false,
  frameHidden = false,
  interactive = false,
}: {
  perspective: Perspective
  framed?: boolean
  primary?: boolean
  recede?: boolean
  showBigAvatar?: boolean
  // Intro reveal (desktop stage only): hide just the phone label + device frame while the big photo
  // stays visible behind, so the photos can bloom in first and the phones drop in 3s later.
  frameHidden?: boolean
  // When true (the mobile share-to-play build only), screens enable real-AI editing/regenerate.
  // The desktop projector stage leaves this false, so it stays the flawless scripted presentation.
  interactive?: boolean
}) {
  if (!framed) {
    return (
      <div className="h-svh w-full" data-perspective={perspective}>
        <DeviceFrame framed={false}>
          <StageView perspective={perspective} interactive={interactive} />
        </DeviceFrame>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3" data-perspective={perspective}>
      <div
        className={cn(
          'flex items-center gap-2 text-ink/85 transition-all duration-700 ease-out',
          frameHidden && 'pointer-events-none translate-y-2 opacity-0',
        )}
      >
        <Avatar person={perspective} size="sm" ring />
        <span className="text-sm font-semibold">{couple[perspective].name}&rsquo;s phone</span>
      </div>
      <div
        className={cn(
          'relative origin-center transition-all duration-500 ease-out',
          primary && 'z-10 scale-[1.04]',
          recede && 'scale-[0.99] opacity-65',
        )}
      >
        {/* Oversized team photo behind the phone — peeks out to the side (Maya left, Leo right).
            Only on Today; fades out as the demo advances. */}
        <img
          src={couple[perspective].largePhoto}
          alt=""
          aria-hidden
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 z-0 h-[1000px] w-[740px] max-w-none -translate-y-1/2 rounded-[36px] object-cover shadow-2xl shadow-black/70 ring-1 ring-white/10 transition-opacity duration-700 ease-out',
            perspective === 'maya' ? '-translate-x-[72%]' : '-translate-x-[28%]',
            showBigAvatar ? 'opacity-90' : 'opacity-0',
          )}
        />
        <div
          className={cn(
            'relative z-10 transition-all duration-700 ease-out',
            frameHidden && 'pointer-events-none translate-y-2 opacity-0',
          )}
        >
          <DeviceFrame framed>
            <StageView perspective={perspective} interactive={interactive} />
          </DeviceFrame>
        </div>
      </div>
    </div>
  )
}
