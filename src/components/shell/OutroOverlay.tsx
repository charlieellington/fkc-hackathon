// Human-first note: the closing handoff slide. After the demo lands on the final Close screen, the
// presenter taps the projector once and this full-stage card crossfades in: the Flame, a "Try it on
// mobile" headline, a huge QR code, and the link. The audience scans it to open Nami on their own
// phones. Desktop/projector only (the mobile build is what they land on, so it never renders this).
import { QRCodeSVG } from 'qrcode.react'
import { cn } from '@/lib/utils'
import { Flame } from '@/components/flame/Flame'

// One source of truth for both the QR payload and the on-screen link.
const SHARE_URL = 'https://fkc.ellington.design/'
const SHARE_LABEL = 'fkc.ellington.design'

export function OutroOverlay({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden={!active}
      className={cn(
        'absolute inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-room px-6 transition-opacity duration-700 ease-out',
        active ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      {/* Warm candlelight so the slide reads as part of the same room, not a hard cut. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_35%,rgba(255,122,60,0.14),transparent_64%)]"
      />

      <Flame stage="open" sizeClass="h-[180px]" />

      <h2 className="relative font-display text-5xl font-semibold text-ink">Try it on mobile</h2>

      {/* QR needs a light background + quiet-zone padding to scan reliably. */}
      <div className="relative rounded-3xl bg-white p-6 shadow-2xl">
        <QRCodeSVG value={SHARE_URL} size={360} bgColor="#ffffff" fgColor="#1a0f0a" level="M" />
      </div>

      <a
        href={SHARE_URL}
        target="_blank"
        rel="noreferrer"
        className="relative font-display text-3xl font-medium text-ember underline-offset-4 hover:underline"
      >
        {SHARE_LABEL}
      </a>

      <p className="relative text-sm font-medium text-ink/35">Press R to restart</p>
    </div>
  )
}
