// Human-first note: a fake iPhone status bar (time + signal/wifi/battery) drawn at the top of
// the device frame, purely for realism on the projector. It never intercepts taps.
import { BatteryFull, SignalHigh, Wifi } from 'lucide-react'

export function StatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-9 items-center justify-between px-7 text-ink/65">
      <span className="text-[13px] font-semibold tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        <SignalHigh className="size-4" strokeWidth={2.5} />
        <Wifi className="size-4" strokeWidth={2.5} />
        <BatteryFull className="size-5" strokeWidth={2} />
      </div>
    </div>
  )
}
