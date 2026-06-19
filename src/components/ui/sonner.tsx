// Human-first note: the toast layer for the whole app, themed warm to match Nami.
// Mounted once near the root; toasts slide in from the top so they read on a projector.
import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      duration={2600}
      toastOptions={{
        style: {
          background: 'var(--color-plum)',
          color: 'var(--color-cream)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '9999px',
          fontWeight: 600,
          fontSize: '15px',
          padding: '12px 18px',
          boxShadow: '0 12px 30px -8px rgba(36,16,50,0.55)',
        },
      }}
    />
  )
}
