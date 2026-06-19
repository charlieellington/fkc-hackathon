// Human-first note: the "brain" of the demo. It holds the whole relationship timeline in
// memory and drives the scripted beats — the Pulse moving the score, the flame growing, the
// Question reveal with its shimmer-and-hold. Screens stay dumb: they read state and call these
// actions. Both phones share ONE of these, so they move in lockstep. Refresh resets everything.
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import {
  couple,
  score as seedScore,
  pulse as pulseData,
  spark as sparkData,
  afterDark as afterDarkData,
  anniversary as anniversaryData,
} from '@/data/demoData'
import { emberToast } from '@/lib/ember-toast'
import {
  type DemoState,
  type Perspective,
  type Screen,
  SCREEN_ORDER,
  QUESTION_SHIMMER_MS,
  QUESTION_REVEAL_HOLD_MS,
} from './demo-types'

const initialState: DemoState = {
  currentScreen: 'today',
  score: {
    loveScore: seedScore.loveScore,
    trendThisWeek: seedScore.trendThisWeek,
    emotional: seedScore.emotional,
    intimate: seedScore.intimate,
  },
  flameStage: 'open',
  pulseAnswered: false,
  sparkDone: false,
  questionSending: false,
  questionRevealed: false,
  revealLocked: false,
  reminderSet: false,
}

function applyGoTo(s: DemoState, to: Screen): DemoState {
  return { ...s, currentScreen: to, flameStage: to === 'close' ? 'final' : s.flameStage }
}

type Person = (typeof couple)['maya' | 'leo']

interface DemoApi {
  state: DemoState
  advance: () => void
  back: () => void
  answerPulse: () => void
  completeSpark: () => void
  tapAfterDark: () => void
  sendQuestion: () => void
  setReminder: () => void
  reset: () => void
  roles: (p: Perspective) => { viewer: Person; partner: Person }
}

const DemoContext = createContext<DemoApi | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState)
  // Touched only in handlers/timers (never during render) so `advance` can guard the reveal hold.
  const revealLockedRef = useRef(false)
  const timers = useRef<number[]>([])
  // One-shot guards, set SYNCHRONOUSLY in handlers. Side-effects (toasts, timers) must not depend on
  // React running a setState updater synchronously — it doesn't reliably, which would drop the reveal.
  const fired = useRef({ pulse: false, spark: false, afterDark: false, sent: false, reminder: false })

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
  }, [])
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  // Auto-advance, but only if the presenter hasn't already moved on.
  const advanceFrom = useCallback((from: Screen, to: Screen) => {
    setState((s) => (s.currentScreen === from ? applyGoTo(s, to) : s))
  }, [])

  const advance = useCallback(() => {
    if (revealLockedRef.current) return // protect the Question "aww" hold
    clearTimers()
    setState((s) => {
      const i = SCREEN_ORDER.indexOf(s.currentScreen)
      return applyGoTo(s, SCREEN_ORDER[Math.min(i + 1, SCREEN_ORDER.length - 1)])
    })
  }, [clearTimers])

  const back = useCallback(() => {
    clearTimers()
    setState((s) => {
      const i = SCREEN_ORDER.indexOf(s.currentScreen)
      return applyGoTo(s, SCREEN_ORDER[Math.max(i - 1, 0)])
    })
  }, [clearTimers])

  const answerPulse = useCallback(() => {
    if (fired.current.pulse) return
    fired.current.pulse = true
    const af = seedScore.afterPulse
    setState((s) => ({
      ...s,
      pulseAnswered: true,
      flameStage: 'warm',
      score: { loveScore: af.loveScore, trendThisWeek: af.trendThisWeek, emotional: af.emotional, intimate: af.intimate },
    }))
    emberToast(pulseData.onAbsolutely.toast)
    schedule(() => advanceFrom('today', 'spark'), 3400)
  }, [schedule, advanceFrom])

  const completeSpark = useCallback(() => {
    if (fired.current.spark) return
    fired.current.spark = true
    setState((s) => ({ ...s, sparkDone: true }))
    emberToast(sparkData.maya.onDone)
    schedule(() => advanceFrom('spark', 'afterDark'), 2400)
  }, [schedule, advanceFrom])

  const tapAfterDark = useCallback(() => {
    emberToast(afterDarkData.toast)
    if (!fired.current.afterDark) {
      fired.current.afterDark = true
      schedule(() => advanceFrom('afterDark', 'question'), 2000)
    }
  }, [schedule, advanceFrom])

  const sendQuestion = useCallback(() => {
    if (fired.current.sent) return
    fired.current.sent = true
    setState((s) => ({ ...s, questionSending: true }))
    schedule(() => {
      revealLockedRef.current = true
      setState((s) => ({ ...s, questionSending: false, questionRevealed: true, revealLocked: true, flameStage: 'revealBloom' }))
      schedule(() => {
        revealLockedRef.current = false
        setState((s) => ({ ...s, revealLocked: false, flameStage: 'warm' }))
      }, QUESTION_REVEAL_HOLD_MS)
    }, QUESTION_SHIMMER_MS)
  }, [schedule])

  const setReminder = useCallback(() => {
    if (fired.current.reminder) return
    fired.current.reminder = true
    setState((s) => ({ ...s, reminderSet: true }))
    emberToast(anniversaryData.setReminderToast)
    schedule(() => advanceFrom('anniversary', 'close'), 2600)
  }, [schedule, advanceFrom])

  const reset = useCallback(() => {
    clearTimers()
    fired.current = { pulse: false, spark: false, afterDark: false, sent: false, reminder: false }
    revealLockedRef.current = false
    setState(initialState)
  }, [clearTimers])

  const roles = useCallback(
    (p: Perspective) => ({ viewer: couple[p], partner: p === 'maya' ? couple.leo : couple.maya }),
    [],
  )

  const api: DemoApi = {
    state,
    advance,
    back,
    answerPulse,
    completeSpark,
    tapAfterDark,
    sendQuestion,
    setReminder,
    reset,
    roles,
  }

  return <DemoContext.Provider value={api}>{children}</DemoContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used inside <DemoProvider>')
  return ctx
}
