// Human-first note: the shared Flame = the relationship, and the single light source in the dark
// "candlelit" room. It breathes gently, throws a warm glow that lights nearby UI, drifts a few embers
// upward, grows when the Pulse is answered, flares at the Question reveal, and is biggest on the Close.
import { cn } from '@/lib/utils'
import type { FlameStage } from '@/context/demo-types'
import { FlameMark } from './FlameMark'

const scaleByStage: Record<FlameStage, string> = {
  open: 'scale-100',
  warm: 'scale-110',
  revealBloom: 'scale-125',
  final: 'scale-[1.35]',
}

const glowByStage: Record<FlameStage, string> = {
  open: 'opacity-45',
  warm: 'opacity-70',
  revealBloom: 'opacity-95',
  final: 'opacity-100',
}

export function Flame({
  stage,
  sizeClass = 'h-[120px]',
  className,
}: {
  stage: FlameStage
  sizeClass?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center transition-transform duration-700 ease-out',
        scaleByStage[stage],
        className,
      )}
    >
      {/* Warm glow — the candlelight that lifts the surrounding UI out of the dark. */}
      <div
        aria-hidden
        className={cn(
          'absolute size-60 rounded-full blur-3xl transition-opacity duration-700',
          'bg-[radial-gradient(circle,var(--color-amber),var(--color-ember)_38%,transparent_70%)]',
          glowByStage[stage],
        )}
      />
      {/* Embers drifting up. */}
      <div aria-hidden className="absolute inset-0">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute left-1/2 top-[56%] size-1 rounded-full bg-amber"
            style={{ marginLeft: (i - 1.5) * 11, animation: `nami-ember-rise ${2600 + i * 520}ms ease-out ${i * 430}ms infinite` }}
          />
        ))}
      </div>
      <FlameMark className={cn('relative animate-breathe drop-shadow-[0_6px_26px_rgba(255,122,60,0.45)]', sizeClass)} />
    </div>
  )
}
