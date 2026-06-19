// The single placeholder screen for the Nami scaffold.
// It exists so `npm run dev` shows something on-brand. The team builds the real
// screens (Today, the Pulse, Sparks, the Question, Us, After Dark...) on top of
// this canvas — add new files in src/pages and routes in src/App.tsx.
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="text-6xl" aria-hidden>🔥</div>

      <div className="space-y-1.5">
        <h1 className="text-4xl font-semibold tracking-tight text-plum">Nami</h1>
        <p className="text-lg text-foreground/80">Keep the spark, daily.</p>
        <p className="text-sm text-muted-foreground">Duolingo for relationships.</p>
      </div>

      <Button className="bg-ember text-white hover:bg-ember/90">Start building →</Button>

      <p className="max-w-xs text-xs text-muted-foreground">
        Scaffold ready. Build your screens in <code className="rounded bg-muted px-1 py-0.5">src/pages</code>,
        wire routes in <code className="rounded bg-muted px-1 py-0.5">src/App.tsx</code>.
      </p>
    </main>
  )
}
