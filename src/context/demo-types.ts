// Human-first note: the shape of the demo's in-memory state and the fixed order of the
// seven scripted beats. Kept tiny and separate so screens and the provider share one vocabulary.

export type Screen = 'today' | 'spark' | 'afterDark' | 'question' | 'anniversary' | 'close'
export type Perspective = 'maya' | 'leo'

// open = at rest · warm = grew on the Pulse · revealBloom = transient flare at the Question
// reveal · final = the biggest, persistent flame on the Close screen.
export type FlameStage = 'open' | 'warm' | 'revealBloom' | 'final'

export interface ScoreState {
  loveScore: number
  trendThisWeek: number
  emotional: number
  intimate: number
}

export interface DemoState {
  currentScreen: Screen
  score: ScoreState
  flameStage: FlameStage
  pulseAnswered: boolean
  sparkDone: boolean
  questionSending: boolean
  questionRevealed: boolean
  revealLocked: boolean
  reminderSet: boolean
}

export const SCREEN_ORDER: Screen[] = ['today', 'spark', 'afterDark', 'question', 'anniversary', 'close']

// Deterministic stage constants (no Date.now()/random in render — keeps beats repeatable).
export const QUESTION_SHIMMER_MS = 700 // ≤ 800
export const QUESTION_REVEAL_HOLD_MS = 1200 // CTA hidden + taps ignored during the hold
