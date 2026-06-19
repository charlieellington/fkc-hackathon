// Human-first note: presenter keyboard shortcuts for the desktop stage —
// → / Space advance the flow, R resets to the seed. (Mobile play uses taps only.)
import { useEffect } from 'react'

export function useKeyboardNav(onAdvance: () => void, onReset: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
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
