# Nami — Engineering & Context Brief (companion doc)

> **For non-coders:** the other two docs say *what* Nami is (`nami-product-brief-v3.md`) and *what the
> screens look like* (`nami-journey-wireframes-v2.md`). This doc is the **connective tissue a coding
> agent needs to build it in one shot** — the tech rules, the exact demo data (single source of truth),
> and the design system. Read all three together. This one does **not** repeat the product or wireframe
> content; it fills the gaps.

---

## 1. Project context

- **What:** "Nami — Duolingo for relationships." A hackathon **demo prototype**, not a production app. The deliverable is a **flawless ~80–85s live stage demo** (hard cap 90s). The demo *is* the product — polish and the scripted tap-flow matter more than feature breadth.
- **The one amazing thing:** one tiny daily action warms a shared **Flame**, unlocks your partner's hidden answer, and turns that moment into a specific next loving action. The emotional peak is **The Question reveal**; never sacrifice it.
- **Audience:** hackathon judges + a room, watching a phone-frame on a projector in a lit room. Everything load-bearing must read from the back.
- **Heritage:** this follows the established Nami front-end (Vite + React + TS + Tailwind + shadcn, mobile-first, Lovable-import-ready). If the new repo's stack differs, adapt these rules but keep the constraints in §2.

---

## 2. Tech stack & hard constraints (the guardrails)

**Assumed stack (confirm against the new repo):** Vite + React + TypeScript + Tailwind + shadcn/ui, mobile-first. `sonner` for toasts.

**Non-negotiable — do NOT add any of these:**
- ❌ No backend, database, auth, or login. ❌ No API/network calls of any kind. ❌ No env vars. ❌ No Supabase. ❌ No LLM/OpenAI calls — the "AI" is **pre-written copy + a ≤800ms shimmer**.
- ❌ No external image services (Unsplash, Dicebear, remote URLs) — they break on stage. Use **emoji, inline SVG, CSS gradients, and initial-circle avatars** only.
- ❌ No required typing. The Question answer is **pre-filled and editable**; suppress the keyboard in the flow.

**Do:**
- ✅ **All state in-memory** via a React context, seeded from a single **`src/data/demoData.ts`** (see §4). 
- ✅ **Refresh resets to seed.** Either keep zero persistence, or add a hidden reset (a `?reset` URL param or a long-press on the logo) so rehearsals start clean. No visible "demo mode" toggle.
- ✅ **Every visible control responds** — selected/done/toast/sheet state. **Locked things show a toast or tiny sheet. Never a dead-click.**
- ✅ **Force animations on regardless of OS `prefers-reduced-motion`** in the demo (a phone accessibility setting must not silently kill a beat). This is a deliberate stage-robustness choice for a throwaway prototype — fine here, would not ship to production.
- ✅ **Audio is optional and OFF by default** — never depend on sound for a beat (stage audio is unreliable). Rely on visuals.

---

## 3. App structure & navigation

- **A single guided linear flow** of ~7 screens (Today → Pulse react → Spark → After Dark → Question → Anniversary plan → Close), advanced by the scripted taps. One viewport; minimize scrolling.
- **No persistent bottom tab bar for the demo.** (The flow is the navigation. A bottom nav is only acceptable if *every* tab routes to something real — and it doesn't here, so drop it.) The v1 wireframes showed a tab bar; **v2 intentionally removes it.**
- Model screens as a simple view-state machine in context (`currentScreen`) or lightweight client routes — implementer's choice; keep it trivial and instant (no route loaders, no async).
- Back/again affordances (`‹`) are fine but optional; the presenter drives forward.

---

## 4. Demo data — single source of truth (`src/data/demoData.ts`)

Everything below is canonical. The wireframes embed most of this copy; this is the consolidated, authoritative version (since `nami-product-brief-v2.md` won't be shared). **Leo's answer is verbatim — do not paraphrase.**

```ts
export const couple = {
  names: { her: "Maya", him: "Leo" },
  togetherYears: 6,
  livesTogether: true,
  child: { name: "Theo", age: 2 },
  relationshipType: "monogamous",
  lastDate: "5 weeks ago",
  anniversary: "next Tuesday (6 years)",
  leoBirthdayInDays: 9,
  archetype: "Slow-Burn Hearth",        // 🔥🏡
  chaosElement: "Scorpio × Gemini",
  matchPercent: 87,
  maya: { zodiac: "Scorpio", loves: ["Quality Time", "Words of Affirmation"], avatar: "M" },
  leo:  { zodiac: "Gemini",  loves: ["Physical Touch", "Acts of Service"],    avatar: "L" },
};

export const score = {
  loveScore: 82, trendThisWeek: +4,     // label it "your relationship signal" — never "grade"
  emotional: 88, intimate: 71,
  streakDays: 47, level: 6, levelName: "Warm Hearth", points: 2480,
  afterPulse: { loveScore: 84, emotional: 90, intimate: 71 }, // ONLY the Pulse moves the score
};

export const nudgeChips = [
  "🍷 5 weeks since your last date",
  "💍 Anniversary Tuesday",
  "🎂 Leo's birthday · 9 days",
];

export const pulse = {
  question: "Do you feel loved this week?",
  options: ["Absolutely 🥰", "Mostly 🙂", "A little distant 😕", "Not today 🫥"],
  onAbsolutely: { toast: "+2. Flame's happy — date-night gap still open.", collapsedLabel: "✓ Checked in today" },
};

// Spark = ONE card, TWO tabs. Accent follows the RECEIVER's love language.
export const spark = {
  mayasNudge: { // Maya does this, FOR Leo
    accent: "amber", header: "so Leo feels loved",
    body: "When Leo walks in, give him a 20-second hello hug.",
    language: "Leo feels love through Physical Touch.",
    onDone: "+20 XP · streak protected",   // confetti + flame sparkle, NO score jump
  },
  leosNudge: {  // Leo does this, FOR Maya
    accent: "teal", header: "so Maya feels loved",
    body: "After Theo sleeps, give Maya 20 phones-down minutes.",
    language: "Maya feels love through Quality Time.",
  },
};

export const afterDark = {
  tileForecast: 78,
  sheetLine: "78% chance of a spark — if Theo actually sleeps.",
  lockedPreview: "Preview: 2-min eye-gazing",   // locked row only
  unlockCta: "Unlock Nami+",                      // → paywall-stub toast
};

export const question = {
  prompt: "What's one moment this week you felt closest to me?",
  leoAnsweredAt: "8:12am",
  mayaPrefilled: "Sunday coffee before Theo woke up.",   // editable
  // VERBATIM — render at 22–26px, heart-pulse on reveal:
  leoAnswer: "Sunday morning — coffee, both of us, Theo still asleep. No phones. I felt like us again.",
  // restrained alternative ending (pick in rehearsal): "…No phones. That."
  emberCta: "✨ Use this for Tuesday?",
};

export const anniversaryPlan = {
  title: "Tuesday · your anniversary",
  cardTitle: "🥂 Anniversary micro-date",
  body: "Recreate Sunday coffee. Phones in the drawer. Decaf + dessert. 20 min, once Theo's down.",
  setReminderToast: "✓ Reminder set in Nami",
  makeItCuterAlternates: [   // "Make it cuter" cycles these locally
    "Sunrise version: coffee on the balcony before Theo's up — the morning you both named.",
    "Add the playlist from your first trip. Same coffee, more you.",
  ],
};

export const closing = "Tiny daily reps for the relationship — so the spark never becomes an emergency.";

export const badges = {
  earned: ["First Spark 🔥", "7-Day Flame 🗓️", "Smooth Talker 💬", "Chore Whisperer 🧹"],
  locked: ["Century Flame 💯", "Date-Night Devotee 🍷", "After Dark 🌶️"],
};
```

---

## 5. Visual design system

- **Brand:** **Nami** (波 = "wave" in Japanese — the ebb & flow of long love). Warm, cosy, a little cheeky; sunset-into-night. Mascot **Ember** = the flame, and the voice of all toasts — but **the presenter never says "Ember" aloud on stage** (the toasts are just "Nami" talking).
- **Palette:** ember orange `#FF6B35` · coral/pink `#FF4D6D` · gold `#FFB347` · night plum `#241032` · deep indigo `#160B2A` (After Dark) · cream `#FFF6EE` · warm-grey text `#3A2A35`. Signature gradient: **orange → pink → plum** (Flame, hero number, primary CTAs).
- **Love-language accents (load-bearing):** Maya = **Quality Time teal** (`#14B8A6`, soft teal tint bg) · Leo = **Physical Touch amber** (`#F59E0B`, warm amber tint bg). The Spark card is tinted by the **receiver's** language.
- **Type:** display = **Fraunces** (or Clash Display); body = **Inter**. Google Fonts. Big, warm, generous.
- **Surfaces:** rounded-2xl cards, soft shadows, pill buttons, shadcn primitives, emoji iconography (🔥 💬 🌶️ 🫶 ☀️ 💛).
- **Phone frame:** on desktop, centre the app in a sleek device frame (~390×844, rounded, soft shadow); full-screen on a real phone. **Stage theme = high contrast**: huge near-white Love Score, Leo's answer 22–26px, **heavy unmistakable locked-blur (opacity *and* blur, with a lock icon)**.
- **Motion (CSS transforms only — no WebGL/video; correct end-state even if a frame drops):**
  - **Flame**: gentle idle flicker/pulse; **grows visibly on the Pulse** and is **biggest at the close**.
  - **Love Score**: count-up (82→84). The *Flame flare* (bloom +~20%, settle +~10%) carries "alive," not the digits.
  - **Spark Done**: small confetti/hearts + flame sparkle (no score change).
  - **Question reveal**: blur→clear + soft heart-pulse on the container (text stays readable); then **UI ignores the next tap ~1.2s** so the presenter can't rush the "aww."
  - **"Thinking"**: ≤800ms shimmer/typing-dots, used sparingly; the presenter talks over it.

---

## 6. Definition of done (live-demo acceptance)

- [ ] Full scripted run completes in **< 90s** with **zero typing**, **fully offline**, **no dead screens**.
- [ ] Order: Today → Pulse → Spark (Maya/Leo tabs) → After Dark wink → **Question reveal** → Anniversary plan → **close on the Flame**.
- [ ] **Only the Pulse moves the Love Score** (Sparks give XP + sparkle only).
- [ ] The **Flame is the final frame** and is **visibly bigger** than at the open.
- [ ] One **laugh** (After Dark) and one **"aww"** (the Question). Leo's answer renders **verbatim** at 22–26px.
- [ ] Every control responds; locked tiles show a toast/sheet; **never a dead-click**.
- [ ] **Refresh → clean seed.** Animations fire regardless of OS reduced-motion.
- [ ] Legible on a projector in a lit room (huge score, heavy blur, high contrast).

---

## 7. Decisions to confirm in planning mode

1. **Repo stack** — is the new repo Vite + React + TS + Tailwind + shadcn (assumed)? If not, keep §2's constraints and adapt.
2. **Leo's answer ending** — ship *"…No phones. I felt like us again."* (default, demo-legible + powers the anniversary callback) or the restrained *"…No phones. That."*?
3. **Bottom nav** — confirm dropping it for the demo (recommended) vs building real tabs.
4. **Audio** — keep OFF for stage safety (recommended) unless you'll test the room's sound.
