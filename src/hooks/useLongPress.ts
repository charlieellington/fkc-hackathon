// Human-first note: a hidden press-and-hold gesture (used on the Nami wordmark) so a
// presenter can reset the demo to a clean seed mid-rehearsal without any visible button.
import { useCallback, useRef } from 'react'

export function useLongPress(onLongPress: () => void, ms = 700) {
  const timer = useRef<number | null>(null)

  const start = useCallback(() => {
    timer.current = window.setTimeout(onLongPress, ms)
  }, [onLongPress, ms])

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  return { onPointerDown: start, onPointerUp: clear, onPointerLeave: clear, onPointerCancel: clear }
}
