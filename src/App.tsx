// Root of the Nami demo. No routing, no backend — a single in-memory flow. The DemoProvider
// holds the shared relationship timeline; Stage renders it as two phones on desktop or one
// full-bleed app on mobile. Toaster is Nami's warm little voice.
import { DemoProvider } from '@/context/DemoProvider'
import { Stage } from '@/components/shell/Stage'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <DemoProvider>
      <Stage />
      <Toaster />
    </DemoProvider>
  )
}

export default App
