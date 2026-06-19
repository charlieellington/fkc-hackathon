// Human-first note: the desktop "stage" — a warm landscape backdrop holding BOTH phones
// (Maya left, Leo right) for the projector demo. On a real phone it instead shows ONLY the app,
// full-bleed (the shareable build), with a tiny Maya/Leo toggle. The two fixed 390×844 phones are
// scaled as one unit to fit any projector without page scroll.
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useDemo } from '@/context/DemoProvider'
import { useKeyboardNav } from '@/hooks/useKeyboardNav'
import type { Perspective } from '@/context/demo-types'
import { Phone } from './Phone'
import { Wordmark } from './Wordmark'
import { Avatar } from '@/components/ui/Avatar'
import { captions } from '@/data/demoData'

function useStageScale() {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const compute = () => {
      const s = Math.min(1, (window.innerWidth - 80) / 840, (window.innerHeight - 170) / 900)
      setScale(Math.max(0.4, s))
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])
  return scale
}

function MobilePerspectiveToggle({
  value,
  onChange,
}: {
  value: Perspective
  onChange: (p: Perspective) => void
}) {
  return (
    <div className="absolute right-3 top-3 z-30 flex items-center gap-1 rounded-full bg-surface/90 p-1 shadow-lg ring-1 ring-hairline backdrop-blur">
      {(['maya', 'leo'] as Perspective[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-label={`${p === 'maya' ? 'Maya' : 'Leo'}'s view`}
          className={cn('rounded-full p-0.5 transition', value === p ? 'ring-2 ring-ink' : 'opacity-50')}
        >
          <Avatar person={p} size="sm" />
        </button>
      ))}
    </div>
  )
}

export function Stage() {
  const { state, advance, reset } = useDemo()
  useKeyboardNav(advance, reset)
  const scale = useStageScale()
  const [mobilePerspective, setMobilePerspective] = useState<Perspective>('maya')

  // Question "Focus Mode": during the reveal hold, Maya is the focal point and Leo recedes.
  const focus = state.currentScreen === 'question' && state.revealLocked

  return (
    <>
      {/* DESKTOP / PROJECTOR — the two-phone candlelit stage */}
      <div className="relative hidden min-h-svh w-full flex-col items-center justify-center gap-5 overflow-hidden bg-room px-6 py-6 md:flex">
        {/* Warm candlelight from above + a soft vignette so the phones read as glowing windows. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_30%,rgba(255,122,60,0.12),transparent_62%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(140%_120%_at_50%_50%,transparent_52%,rgba(0,0,0,0.55))]" />
        <Wordmark className="relative" />
        <div
          className="relative flex items-start justify-center gap-10"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          <Phone perspective="maya" framed primary={focus} showBigAvatar={state.currentScreen === 'today'} />
          <Phone perspective="leo" framed recede={focus} showBigAvatar={state.currentScreen === 'today'} />
        </div>
        <div className="relative flex flex-col items-center gap-1">
          <p
            key={state.currentScreen}
            className="animate-fade-rise font-display text-[15px] italic text-ink-muted"
          >
            {captions[state.currentScreen]}
          </p>
          <p className="text-sm font-medium text-ink/35">Tap a phone · → to advance · R to reset</p>
        </div>
      </div>

      {/* MOBILE — just the app, full-bleed: instantly shareable + playable. `interactive` turns on the
          real-AI editing/regenerate paths here only; the desktop stage above stays scripted/seed. */}
      <div className="relative md:hidden">
        <Phone perspective={mobilePerspective} framed={false} interactive />
        <MobilePerspectiveToggle value={mobilePerspective} onChange={setMobilePerspective} />
      </div>
    </>
  )
}
