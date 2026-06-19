// Human-first note: the toast layer for the whole app, themed warm to match Nami. Mounted once near
// the root. Sits at the BOTTOM (so it never overlaps the wordmark) and uses a solid, opaque surface so
// it's always clearly readable on the dark stage — no see-through overlap.
import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      duration={2600}
      toastOptions={{
        style: {
          background: 'var(--color-surface-2)',
          color: 'var(--color-ink)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '12px',
          fontWeight: 600,
          fontSize: '15px',
          padding: '12px 18px',
          boxShadow: '0 18px 44px -10px rgba(0, 0, 0, 0.7)',
          opacity: 1,
        },
      }}
    />
  )
}
