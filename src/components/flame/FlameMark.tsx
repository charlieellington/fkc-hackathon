// Human-first note: Nami's custom brand mark — a hand-built flame drawn as an SVG with a warm
// gradient (deep rose edge → ember body → glowing amber core). This replaces the old emoji 🔥 so
// the hero reads as a designed light source. Gradient IDs are made unique per instance (useId) so
// multiple flames on screen (two phones + the wordmark) don't collide and vanish.
import { useId } from 'react'
import { cn } from '@/lib/utils'

export function FlameMark({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const bodyId = `flame-body-${uid}`
  const coreId = `flame-core-${uid}`
  return (
    <svg viewBox="0 0 64 88" fill="none" role="img" aria-label="Nami flame" className={cn('w-auto', className)}>
      <defs>
        <linearGradient id={bodyId} x1="32" y1="2" x2="32" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF8A4C" />
          <stop offset="0.46" stopColor="#FF6B3C" />
          <stop offset="1" stopColor="#E23B5B" />
        </linearGradient>
        <linearGradient id={coreId} x1="32" y1="34" x2="32" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE6A6" />
          <stop offset="0.6" stopColor="#FFB454" />
          <stop offset="1" stopColor="#FF7A3C" />
        </linearGradient>
      </defs>
      <path
        d="M34 3 C 40 20 56 30 51 52 C 47 72 37 86 24 83 C 11 80 6 66 12 53 C 16 44 23 46 24 37 C 25 28 27 16 34 3 Z"
        fill={`url(#${bodyId})`}
      />
      <path
        d="M33 38 C 38 48 41 57 35 68 C 31 75 22 73 22 63 C 22 54 28 49 33 38 Z"
        fill={`url(#${coreId})`}
      />
    </svg>
  )
}
