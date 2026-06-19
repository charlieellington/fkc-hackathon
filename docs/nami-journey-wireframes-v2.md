# Nami — User Journey, Wireframes & Flow (**v2 build spec**)

> **For non-coders:** this is the build picture-book for the Nami hackathon demo — the exact screens,
> the tap-by-tap stage script, and the gotchas to avoid. Each box is one phone screen (ASCII sketch,
> not final art). It supersedes `nami-journey-wireframes.md` (v1) after the GPT-5.5 Pro priority pass.
> Strategy: `nami-product-brief-v3.md`. Decisions: `nami-design-refine/nami-user-journey-refined.md`.

Product: **Nami — "Duolingo for relationships."** Front-end-only, pre-seeded, offline Lovable prototype. Couple: **Maya & Leo** — 6 years, toddler Theo (2), 5 weeks since a date, anniversary Tuesday. **Love Score 82 (+4) · Emotional 88 · Intimate 71 · streak 47 · Level 6 Warm Hearth.**

---

## 0. What changed vs the v1 wireframes

1. **After Dark now comes *before* the Question** (laugh mid-show; aww at the end).
2. **Anniversary micro-plan is back** — it reuses Leo's revealed answer ("recreate Sunday coffee") and only sets a *local* reminder, so it reads smart, not fake.
3. **No landing screen / no $72 strip in the run** — open straight on Today.
4. **Spark = "Nudge for Maya / Nudge for Leo" tabs** in one card (not a "viewing as" avatar switch) — kills the "which person am I?" confusion.
5. **Leo's answer copy** ends *"…No phones. I felt like us again."* and **Maya also names Sunday coffee** — they independently land on the same morning, which powers the anniversary plan. *(Restrained alternative: "…No phones. That." — pick in rehearsal.)*
6. **"Signal, not grade"** language for the Love Score.

---

## 1. Screen-flow map (the journey)

```
 [1] TODAY ──tap Pulse──► [2] PULSE REACTS ──► [3a] SPARK · Maya ──tab──► [3b] SPARK · Leo
   (82 + Flame + chips)     (82→84, flame ↑)     (hug · Physical Touch)    (phones-down · Quality Time)
                                                                                   │
        ┌───────────────────────────────────────────────────────────────────────────┘
        ▼
 [4] AFTER DARK 🔒 ──► [5a] QUESTION (locked) ──answer/Send──► [5b] QUESTION REVEALED ──"Use this?"──►
   (Forecast 78% · laugh)   (Leo answered · 8:12am)            (un-blur · THE PEAK · 💛)
                                                                                   │
                                                                                   ▼
                                                            [6] ANNIVERSARY MICRO-PLAN ──► [7] CLOSE on FLAME
                                                              (recreate Sunday coffee)        (biggest · final frame)

 Backup, Q&A only:  quiz result card · Us profile
```

**Order is the product:** the joke is in the middle; the *aww* and the *clever* land last; the final frame is always the Flame. **Target 80–85s · hard cap 90s.**

---

## 2. Global UI (every screen)

- **One device, one phone-frame**, centred on a projector / full-screen on a phone. No second phone, ever.
- **Demo shell:** seeded Maya/Leo on load · **refresh resets to seed** · hidden dev reset (URL param), **no visible "demo mode"** · every visible button responds (toast/sheet/selected state) — **never a dead-click**.
- **Stage theme (high contrast):** huge near-white Love Score; **Leo's answer at 22–26px**; heavy unmistakable locked-blur (opacity *and* blur). Test on a real projector in a lit room.
- **The Flame** = the relationship, on-screen above the fold throughout; it **grows on the Pulse** and is **biggest at the close**. CSS transforms only; animations have a correct end-state even if a frame drops.
- **Love language colour accents:** Maya's language (Quality Time) = **teal**; Leo's language (Physical Touch) = **amber**. The accent follows the *receiver*.
- **"Signal, not grade"** voice everywhere; sub-scores stay visible so it reads diagnostic.
- **Only the Pulse moves the Love Score.** Sparks give XP + flame sparkle, never a score jump. (Honesty = trust.)
- **Fake AI ≤800ms** with a shimmer; the presenter talks over every delay. **Zero live typing** (pre-filled, editable).

---

## 3. Wireframes (in run order)

### [1] Today — the stage anchor

```
┌────────────────────────────────┐
│  Maya & Leo            🔥 47 days│  ← streak, quiet
│                                │
│            (  🔥  )            │  ← FLAME — hero, ~38% height
│           ~~~~~~~~~~           │
│                                │
│        8 2   ▲ +4 this week     │  ← Love Score, HUGE + trend
│      your relationship signal   │  ← "signal," never "grade"
│                                │
│    Emotional 88 · Intimate 71   │  ← sub-scores (diagnostic)
│       Level 6 · Warm Hearth     │
│                                │
│  🍷 5 wks no date  💍 Anniv Tue  │  ← nudge chips (calendar, merged)
│  🎂 Leo's birthday · 9 days      │
│  ┌──────────────────────────┐  │
│  │ Do you feel loved this wk?│  │  ← the Pulse, INLINE (no screen)
│  │ (Absolutely🥰)(Mostly🙂)  │  │
│  │ (A little distant😕)(Not🫥)│  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
```
**Hero:** Love Score + Flame ≈ 70% of weight. Chips merge "calendar" into one glance. Pulse is the only thing to tap. *Premium polish lives here.*

---

### [2] Pulse reacts

```
┌────────────────────────────────┐
│  Maya & Leo            🔥 47 days│
│                                │
│           (   🔥   )  ✨        │  ← FLAME GROWS + glows
│          ~~~~~~~~~~~~~          │
│                                │
│        8 4 ▲    +4 → +6         │  ← counts 82→84 (generous, visible)
│      your relationship signal   │
│                  ┌────────────┐ │
│   Emotional 90 ▲ │ +2. Flame's│ │  ← Ember toast (warm + honest)
│   Intimate 71    │ happy —    │ │
│                  │ date gap   │ │
│  ┌────────────┐  │ still open.│ │
│  │ ✓ Checked  │  └────────────┘ │
│  │   in today │                │  ← Pulse card collapses
│  └────────────┘                │
└────────────────────────────────┘
```
**The "alive" beat.** Flame carries it (not the digits). Honest toast — *one tap doesn't fix everything*. Instant (no 800ms here).

---

### [3a] Spark · Nudge for Maya  ·  *translation 1 of 2*

```
┌────────────────────────────────┐
│  ‹            Today's spark      │
│  ┌─────────────┬──────────────┐ │
│  │●Maya's nudge │ Leo's nudge  │ │  ← TABS (not a phone-switch)
│  └─────────────┴──────────────┘ │
│  ┌──────────────────────────┐  │
│  │ 🧡 so Leo feels loved      │  │  ╮ AMBER (Leo's language)
│  │                          │  │  │
│  │ When Leo walks in, give   │  │  │ ← specific, not "be romantic"
│  │ him a 20-second hello hug.│  │  │
│  │                          │  │  │
│  │ Leo feels love through    │  │  │ ← persistent love-language label
│  │ Physical Touch.           │  │  ╯
│  └──────────────────────────┘  │
│         (   Done   )           │
└────────────────────────────────┘
```
**On Done:** small confetti/hearts · *"+20 XP · streak protected"* · Flame sparkles **but score does not jump**. Each tab always names *who does what, for whom*.

---

### [3b] Spark · Nudge for Leo  ·  *translation 2 of 2*

```
┌────────────────────────────────┐
│  ‹            Today's spark      │
│  ┌─────────────┬──────────────┐ │
│  │ ✓ Maya done  │●Leo's nudge  │ │  ← switched tab (instant)
│  └─────────────┴──────────────┘ │
│  ┌──────────────────────────┐  │
│  │ 💚 so Maya feels loved     │  │  ╮ TEAL (Maya's language)
│  │                          │  │  │
│  │ After Theo sleeps, give   │  │  │ ← COMPLETELY different action
│  │ Maya 20 phones-down min.  │  │  │
│  │                          │  │  │
│  │ Maya feels love through   │  │  │
│  │ Quality Time.             │  │  ╯
│  └──────────────────────────┘  │
└────────────────────────────────┘
```
**The wow:** *"Same couple, two operating manuals."* Amber→teal, opposite action. Pure client-side tab flip, pre-rendered both ways.

---

### [4] After Dark — the locked wink (the laugh)  ·  *before the Question*

```
┌────────────────────────────────┐  (deep saturated plum)
│  🌶️ After Dark              🔒   │
│        Tonight's Forecast       │
│              78%               │  ← big, pure-white heavy text
│  ┌──────────────────────────┐  │
│  │ "78% chance of a spark —  │  │  ← tiny sheet on tap (parent-safe)
│  │  if Theo actually sleeps."│  │
│  │                          │  │
│  │ 🔒 Preview: 2-min eye-     │  │  ← locked row only, no depth
│  │    gazing                │  │
│  │ (  Unlock Nami+  )        │  │  ← paywall stub → toast
│  └──────────────────────────┘  │
└────────────────────────────────┘
```
**~4–5s, then move on.** The laugh + the monetisation tease. If the room feels conservative or time's tight, **don't tap it — leave the tile visible.**

---

### [5a] The Question — locked  ·  *setup for the peak*

```
┌────────────────────────────────┐
│  💬 A question for you both      │
│                                │
│   "What's one moment this       │  ← prompt
│    week you felt closest        │
│    to me?"                     │
│                                │
│   Leo answered · 8:12am         │  ← timestamp = reciprocal feel
│  ┌──────────────────────────┐  │
│  │ 🔒 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  │  ╮ heavy frosted lock
│  │    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │  │  │ (opacity + blur)
│  │   answer yours to see his │  │  ╯
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ Sunday coffee before Theo │  │  ← Maya's pre-filled, editable
│  │ woke up.                 │  │
│  └──────────────────────────┘  │
│           (   Send   )         │
└────────────────────────────────┘
```
**No copying, no performing** — Leo's reply is genuinely hidden until Maya sends. Tap Send → ≤800ms shimmer (speak over it) → reveal.

---

### [5b] The Question — revealed  ·  **THE PEAK**

```
┌────────────────────────────────┐
│  💬 A question for you both      │
│   You                          │
│  ┌──────────────────────────┐  │
│  │ Sunday coffee before Theo │  │  ← they named the SAME morning
│  │ woke up.                 │  │
│  └──────────────────────────┘  │
│   Leo · 8:12am                  │
│  ┌──────────────────────────┐  │
│  │ Sunday morning — coffee,  │  │  ╮ UN-BLURRED · 22–26px · soft
│  │ both of us, Theo still    │  │  │ heart-pulse on the container
│  │ asleep. No phones.        │  │  │
│  │ I felt like us again.     │  │  ╯ PRESERVE VERBATIM
│  └──────────────────────────┘  │
│              💛                │  ← hold silence ~1.2s, say nothing
│  ┌──────────────────────────┐  │
│  │ ✨ Use this for Tuesday?  │  │  ← Ember CTA → anniversary plan
│  └──────────────────────────┘  │
└────────────────────────────────┘
```
**The "aww."** Flame takes its biggest growth as it lands. Gated by opacity *and* blur (a blur-render failure still hides the line). The "both named Sunday coffee" symmetry is its own tiny beat — the presenter can point it out.

---

### [6] Anniversary micro-plan  ·  *emotion → action*

```
┌────────────────────────────────┐
│  ‹    Tuesday · your anniversary │
│  ┌──────────────────────────┐  │
│  │ 🥂 Anniversary micro-date  │  │
│  │                          │  │
│  │ Recreate Sunday coffee.   │  │  ← REUSES the revealed answer
│  │ Phones in the drawer.     │  │     (feels intelligent, not fake)
│  │ Decaf + dessert.          │  │
│  │ 20 min, once Theo's down. │  │
│  └──────────────────────────┘  │
│  ( Set reminder )  ( Make it    │
│                      cuter )    │
│   ✓ Reminder set in Nami        │  ← local toast (honest: no booking)
└────────────────────────────────┘
```
**"Set reminder"** → toast only. **"Make it cuter"** → cycles one alternate local suggestion. Nami turns the moment they *both named* into a tiny plan. → *"that's smart."*

---

### [7] Close on the Flame  ·  *final frame*

```
┌────────────────────────────────┐
│  Maya & Leo            🔥 47 days│
│                                │
│          (    🔥    )          │  ← FLAME at its BIGGEST
│         ~~~~~~~~~~~~~~~         │
│        ~~~~~~~~~~~~~~~~~        │
│             8 4                │
│      your relationship signal   │
│                                │
│  "Tiny daily reps for the       │  ← closing line
│   relationship — so the spark   │
│   never becomes an emergency."  │
│                                │
└────────────────────────────────┘
```
**Stop here.** No feature-dump. Last thing on screen = the Flame, bigger than the open.

---

## 4. Tap-by-tap run-of-show (80–85s · cap 90s)

| t | Screen | Tap | Presenter says | Reaction |
|---|---|---|---|---|
| 0–5s | Today | *(none, already open)* | "Meet Maya & Leo — 6 years, toddler Theo, 5 weeks since their last date. Nami is Duolingo for keeping the spark alive." | orient |
| 5–13s | Today | *(point)* | "One signal for the relationship: Love Score 82. Emotional's strong at 88, intimacy's drifting at 71 — Nami already sees the date-night gap." | — |
| 13–23s | Pulse | **Absolutely 🥰** | "Maya answers one Pulse. Small bump, the flame warms — but Nami doesn't pretend one tap fixes everything." | "oh, it moved" |
| 23–36s | Spark | **Done**, then **Leo's nudge** | "Her nudge isn't 'be romantic' — it's *give Leo a 20-second hug, he feels love through touch.* Leo gets a different mission: phones-down time, because Maya feels love through quality time. Same couple, two manuals." | recognition / small laugh |
| 36–42s | After Dark | **tap tile** | "And yes — the spicy tier's safely locked behind bedtime." | **laugh** |
| 42–65s | Question | **Send** | "But the heart of Nami is reciprocal: Leo already answered, and Maya can't see it until she answers too — no copying, no performing." | lean in |
| ~58s | Question reveal | *(silence)* | *(say nothing for one beat)* | **aww** |
| 65–80s | Anniversary plan | **Use this for Tuesday?** | "Nami turns the moment they both named into a tiny anniversary plan — recreate Sunday coffee." | "that's smart" |
| 80–85s | Flame | *(focus on Flame)* | "That's Nami — tiny daily reps, so the spark never becomes an emergency." *(stop)* | — |

*Kiosk checklist beforehand: DND on, auto-lock off, Guided Access on, keyboard suppressed, animations forced on, refresh → seed, rehearse the exact tap order 10+ times.*

---

## 5. Component inventory

| Component | Screens | Notes |
|---|---|---|
| `FlameHero` | 1, 2, 7 | Animated flame + count-up Love Score + trend; `grow()`; CSS-only; "signal" label |
| `NudgeChips` | 1 | Calendar merged into 3 chips (date gap / anniversary / birthday) |
| `PulseInline` | 1→2 | 4-option one-tap; collapses to "✓ checked in"; only thing that moves the score |
| `SparkTabs` | 3a/3b | "Maya's nudge / Leo's nudge" tabs, one card; teal/amber by receiver; `Done` → XP + sparkle, no score jump |
| `AfterDarkSheet` | 4 | Plum, Forecast 78%, parent-safe line, locked preview row, paywall-stub toast |
| `QuestionReveal` | 5a/5b | "Leo answered · 8:12am"; opacity+blur lock; editable prefilled answer; ≤800ms shimmer; 22–26px reveal + heart-pulse; hold ~1.2s |
| `AnniversaryPlanCard` | 6 | Reuses revealed answer; "Set reminder" → toast; "Make it cuter" → cycles local copy |
| `EmberToast` | 2, 3 | Warm, honest one-liners; never "grade" |
| *(`Quiz`, `UsProfile`)* | backup | Q&A only — static/seeded |

---

## 6. Traps & de-risks (rehearse against these)

- **Feels like static Figma** → the score *must* animate, the flame *must* visibly grow, the blur *must* genuinely reveal, tabs *must* switch, every button shows a selected/done/toast state.
- **Love Score feels cold/cringe** → "signal / early-warning light," never "grade"; keep sub-scores visible.
- **After Dark undercuts the peak** → it's *before* the Question; copy parent-safe; skip the tap if the room's tight.
- **Maya/Leo confusion** → never switch phones; "Nudge for Maya / for Leo" tabs; always say who does what for whom.
- **Wrong live state from rehearsals** → refresh resets to seed; hidden reset; avoid raw localStorage without a reset.
- **Fake-AI delay = dead air** → ≤800ms, shimmer, *speak over it*.
- **Can't read the emotional text** → Question modal huge, Leo's answer 22–26px, no tiny details on that beat.
- **Demoing past the peak** → after the anniversary plan, **stop**. Roadmap is a Q&A slide.

---

## 7. Build order (ship top-down; if time collapses, cut bottom-up)

1. **Today: Love Score + Flame** — most polish.
2. **The Question reveal** — never sacrifice.
3. **The Pulse** (one tap → score move + flame grow).
4. **Spark translation** (Maya/Leo tabs, Done → confetti).
5. **Anniversary micro-plan**.
6. **After Dark wink**.

Everything else is a locked tile, a static badge, or not built. Seed data per `nami-product-brief-v2.md`; **Leo's Sunday-morning answer stays verbatim.**
