// Human-first note: this file is the SINGLE source of truth for everything the Nami demo
// shows on screen — the couple, their relationship "signal" numbers, and every line of copy.
// Nothing here is fetched or generated; the whole demo is seeded from these values and resets
// on refresh. Copy was put through a Maeda "reduce" pass: one focal point per screen, less text.

import mayaPhoto from '@/assets/avatars/maya.jpg'
import leoPhoto from '@/assets/avatars/leo.jpg'
// Larger versions for the oversized "funny photo" reveal behind the phones on the Today screen.
import mayaLarge from '@/assets/avatars/maya-large.jpg'
import leoLarge from '@/assets/avatars/leo-large.jpg'
import type { Screen } from '@/context/demo-types'

export type PersonKey = 'maya' | 'leo'

// The two sides of the relationship. `accent` is each person's own love-language colour
// (used for their avatar ring / perspective). Maya = Quality Time (teal), Leo = Physical Touch (amber).
export const couple = {
  maya: { key: 'maya', name: 'Maya', initial: 'M', photo: mayaPhoto, largePhoto: mayaLarge, language: 'Quality Time', accent: 'teal' },
  leo: { key: 'leo', name: 'Leo', initial: 'L', photo: leoPhoto, largePhoto: leoLarge, language: 'Physical Touch', accent: 'amber' },
} as const

// The hero metric. Only the Pulse moves this (82 → 84). `afterPulse` is the post-check-in state.
export const score = {
  loveScore: 82,
  trendThisWeek: 4,
  emotional: 88,
  intimate: 71,
  streakDays: 47,
  afterPulse: { loveScore: 84, trendThisWeek: 6, emotional: 90, intimate: 71 },
}

export const signalLabel = 'relationship signal'

// Calendar context, merged to two glanceable chips (both pay off later in the run).
// Icons are rendered in the component (Lucide), not baked into the copy.
export const nudgeChips = [
  { icon: 'wine', label: '5 weeks, no date' },
  { icon: 'anniversary', label: 'Anniversary Tuesday' },
] as const

// The Pulse — the one tap on Today. "Absolutely" is the single primary; the rest are muted.
export const pulse = {
  question: 'Do you feel loved this week?',
  options: ['Absolutely', 'Mostly', 'A little distant', 'Not today'],
  onAbsolutely: {
    toast: '+2. Flame warmed — date-night gap still open.',
    collapsedLabel: 'Checked in today',
  },
} as const

// Spark — one nudge card per phone, tinted by the RECEIVER's love language.
// Maya's nudge is for Leo (amber / Physical Touch); Leo's nudge is for Maya (teal / Quality Time).
export const spark = {
  maya: {
    header: 'Maya → Leo',
    accent: 'amber',
    body: 'When Leo walks in: 20-second hug.',
    language: 'Physical Touch',
    onDone: '+20 XP · streak protected',
  },
  leo: {
    header: 'Leo → Maya',
    accent: 'teal',
    body: 'After Theo sleeps: 20 phones-down minutes.',
    language: 'Quality Time',
    onDone: '+20 XP · streak protected',
  },
} as const

// After Dark — the locked, parent-safe wink (the laugh + the paywall tease).
export const afterDark = {
  forecast: 78,
  line: '78% chance of a spark — if Theo sleeps.',
  unlockCta: 'Unlock Nami+',
  toast: 'Nami+ unlocks the spicy tier — after bedtime.',
} as const

// The Question — the emotional peak. Each person has a short prefilled answer and a full
// "hero" answer that the partner unlocks. Both land on the same Sunday morning.
// Leo's hero is VERBATIM from the brief — do not edit.
export const question = {
  prompt: 'When did you feel closest to me this week?',
  emberCta: 'Use this for Tuesday?',
  answers: {
    maya: {
      prefilled: 'Sunday coffee before Theo woke.',
      hero: 'Sunday before Theo woke — coffee going cold, your hand in mine. No phones. Just us.',
      answeredAt: '8:09am',
    },
    leo: {
      prefilled: 'Coffee before Theo woke.',
      hero: 'Sunday morning — coffee, both of us, Theo still asleep. No phones. I felt like us again.',
      answeredAt: '8:12am',
    },
  },
} as const

// Anniversary — reuses the just-revealed answer. One card, one action.
export const anniversary = {
  title: 'Tuesday · your anniversary',
  cardTitle: 'Sunday coffee micro-date',
  body: 'Recreate Sunday coffee: phones away, 20 min after Theo sleeps.',
  setReminderToast: 'Reminder set in Nami',
} as const

export const closing = 'Tiny daily reps keep the spark from becoming an emergency.'

// One short line per beat, shown only on the desktop projector stage (never on mobile) —
// tells the audience what they're seeing / can do on each slide. Tiny, peripheral chrome.
export const captions: Record<Screen, string> = {
  today: 'A daily relationship score — tap Pulse to check in',
  spark: 'A nudge for each partner, in their love language',
  afterDark: 'A playful after-dark forecast — teased behind Nami+',
  question: "Both answer one question, then reveal each other's",
  anniversary: 'Turn the moment into a planned micro-date',
  close: 'Tiny daily reps keep the spark alive',
}

// Kept for Q&A only — NOT rendered in the live run.
export const badges = {
  earned: ['First Spark', '7-Day Flame', 'Smooth Talker'],
  locked: ['Century Flame', 'Date-Night Devotee', 'After Dark'],
}
