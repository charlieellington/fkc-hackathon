// Human-first note: the curtain before the show. On the desktop/projector stage the demo opens on
// just the big breathing Flame in the dark room — click it to "light up" the presentation. Once the
// reveal begins this overlay crossfades away (it stays mounted but goes transparent + click-through)
// so the two photos can bloom in underneath. Desktop-only; the mobile build never renders this.
import { cn } from '@/lib/utils'
import { Flame } from '@/components/flame/Flame'

export function IntroOverlay({ active, onBegin }: { active: boolean; onBegin: () => void }) {
  return (
    <button
      type="button"
      onClick={active ? onBegin : undefined}
      aria-hidden={!active}
      tabIndex={active ? 0 : -1}
      aria-label="Begin the presentation"
      className={cn(
        'absolute inset-0 z-40 flex flex-col items-center justify-center gap-8 transition-opacity duration-700 ease-out',
        active ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <Flame stage="open" sizeClass="h-[300px]" />
      <span className="font-display text-lg italic text-ink-muted">Tap to begin</span>
    </button>
  )
}
