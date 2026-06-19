// Human-first note: a tiny celebratory burst of hearts + sparkles for the Spark "Done" moment, in the
// brand's ember/rose. Pure CSS transforms, self-removes after the animation. Needs a `relative` parent.
import type { CSSProperties } from 'react'
import { Heart, Sparkle } from 'lucide-react'

const PARTICLES = [Heart, Sparkle, Heart, Sparkle, Heart, Sparkle]

export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {Array.from({ length: 16 }).map((_, i) => {
        const Icon = PARTICLES[i % PARTICLES.length]
        const left = (i * 37) % 100
        const drift = ((i % 5) - 2) * 26
        const rot = 140 + (i % 5) * 60
        const delay = (i % 6) * 55
        const dur = 900 + (i % 4) * 220
        const isHeart = i % 2 === 0
        return (
          <Icon
            key={i}
            className="absolute top-1/3 size-5"
            strokeWidth={isHeart ? 0 : 2}
            style={
              {
                left: `${left}%`,
                color: isHeart ? 'var(--color-rose)' : 'var(--color-amber)',
                fill: isHeart ? 'currentColor' : 'none',
                animation: `nami-confetti ${dur}ms ease-out ${delay}ms forwards`,
                ['--cx']: `${drift}px`,
                ['--cr']: `${rot}deg`,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}
