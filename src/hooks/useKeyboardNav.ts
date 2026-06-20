// Human-first note: presenter keyboard shortcuts for the desktop stage —
// → / Space advance the flow, R resets to the seed. (Mobile play uses taps only.)
// IMPORTANT: while someone is typing in an editable field (the answer box, Ask Nami) we must IGNORE
// these keys — otherwise Space would eat itself + skip a beat, and 'r' would reset the demo mid-word.
import { useEffect } from 'react'

// Is the keystroke coming from a place where the user is actually typing?
function isEditableTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable === true
}

export function useKeyboardNav(onAdvance: () => void, onReset: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return // let the field have the keystroke
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        onAdvance()
      } else if (e.key === 'r' || e.key === 'R') {
        onReset()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onAdvance, onReset])
}
