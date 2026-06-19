// Human-first note: the phone shell. On the desktop "stage" it draws a realistic bezel with a
// dynamic island + status bar (framed). On a real phone it disappears so you just get the app
// full-bleed (the shareable build). Either way the app scrolls INSIDE here, never the page.
import type { ReactNode } from 'react'
import { StatusBar } from './StatusBar'

export function DeviceFrame({ framed = true, children }: { framed?: boolean; children: ReactNode }) {
  if (!framed) {
    return <div className="relative flex h-svh w-full flex-col overflow-hidden bg-background">{children}</div>
  }

  return (
    <div className="relative h-[844px] w-[390px] shrink-0 rounded-[3rem] bg-bezel p-[10px] shadow-[0_40px_90px_-28px_rgba(0,0,0,0.85)] ring-1 ring-white/5">
      <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] bg-background">
        <StatusBar />
        <div className="no-scrollbar h-full w-full overflow-y-auto overscroll-contain">{children}</div>
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[14px] z-20 h-[26px] w-[96px] -translate-x-1/2 rounded-full bg-black"
        />
      </div>
    </div>
  )
}
