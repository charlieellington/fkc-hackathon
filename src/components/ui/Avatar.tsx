// Human-first note: a round avatar for Maya or Leo. Shows the bundled photo, and if that ever
// fails to load it falls back to the person's initial — so a face is always there on stage.
import { cn } from '@/lib/utils'
import { couple, type PersonKey } from '@/data/demoData'

const sizes = {
  sm: 'size-8 text-sm',
  md: 'size-11 text-base',
  lg: 'size-16 text-2xl',
  xl: 'size-24 text-4xl',
} as const

const ringByAccent: Record<string, string> = {
  teal: 'ring-[color:var(--color-teal)]',
  amber: 'ring-[color:var(--color-amber)]',
}

export function Avatar({
  person,
  size = 'md',
  ring = false,
  className,
}: {
  person: PersonKey
  size?: keyof typeof sizes
  ring?: boolean
  className?: string
}) {
  const p = couple[person]
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface font-semibold text-ink',
        sizes[size],
        ring && 'ring-2 ring-offset-2 ring-offset-canvas',
        ring && ringByAccent[p.accent],
        className,
      )}
    >
      <span aria-hidden>{p.initial}</span>
      <img
        src={p.photo}
        alt={p.name}
        loading="eager"
        className="absolute inset-0 size-full object-cover [filter:saturate(0.82)_contrast(1.02)_brightness(0.95)]"
      />
      {/* Warm overlay so the bright photos settle into the candlelit palette. */}
      <span aria-hidden className="absolute inset-0 bg-ember/20 mix-blend-overlay" />
    </span>
  )
}
