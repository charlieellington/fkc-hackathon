// Human-first note: the two calendar nudges on Today (date-night gap + anniversary), as quiet pills
// with line icons. Both pay off later in the run, so nothing here is decoration.
import { Wine, CalendarHeart } from 'lucide-react'
import { nudgeChips } from '@/data/demoData'

const icons = { wine: Wine, anniversary: CalendarHeart } as const

export function NudgeChips() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {nudgeChips.map((chip) => {
        const Icon = icons[chip.icon]
        return (
          <span
            key={chip.label}
            className="animate-fade-rise flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink-muted ring-1 ring-hairline"
          >
            <Icon className="size-3.5 text-ember/80" strokeWidth={1.75} />
            {chip.label}
          </span>
        )
      })}
    </div>
  )
}
