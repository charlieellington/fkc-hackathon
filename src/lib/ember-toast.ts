// Human-first note: "Ember" is Nami's warm little voice. Every nudge/confirmation on screen
// is a toast routed through here so they all sound and look the same. (The presenter never
// says "Ember" aloud — on stage these are just "Nami" talking.)
import { toast } from 'sonner'

export function emberToast(message: string) {
  toast(message)
}
