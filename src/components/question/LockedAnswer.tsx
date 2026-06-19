// Human-first note: the partner's hidden answer before the reveal. Deliberately a FROSTED SKELETON —
// the real words are not in the page at all yet (so nothing can spoil the moment). A warm shimmer
// sweeps while "sending".
import { Lock } from 'lucide-react'

export function LockedAnswer({ sending }: { sending: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[12px] bg-surface p-4 ring-1 ring-hairline">
      <div className="space-y-2.5">
        <div className="h-3.5 w-[92%] rounded-full bg-ink/10" />
        <div className="h-3.5 w-[78%] rounded-full bg-ink/10" />
        <div className="h-3.5 w-[54%] rounded-full bg-ink/10" />
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink-faint">
        <Lock className="size-3.5" strokeWidth={1.75} /> answer yours to see theirs
      </div>
      {sending && <div className="shimmer-sweep absolute inset-0" />}
    </div>
  )
}
