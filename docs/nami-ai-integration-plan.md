# Nami — Real-AI Integration **Implementation Plan**

> **For non-coders:** this is the build recipe that turns three of Nami's currently-scripted "AI"
> moments into *real* Claude calls, while guaranteeing the live stage demo still runs flawlessly
> with no network. It is the execution spec for `nami-ai-integration-brief.md`, but **corrected and
> mapped onto the code as it actually exists today** (the brief was written against an older data
> shape). Read the brief for the *why*; read this for the *exactly-what-and-where*.

**Status:** plan only — nothing has been changed yet. Approve to execute.

---

## 0. TL;DR — what we're building

Three real-Claude features, each behind a hard **stage-safety net** (seed shows instantly → live text
swaps in only if Claude answers within ~2.5s → otherwise the seed stays, forever, silently):

| # | Feature | Surface | Trigger | Real-AI payoff |
|---|---------|---------|---------|----------------|
| 🥇 1 | **Anniversary micro-date** from the revealed answer | `AnniversaryPlanCard` (beat 5) | prefetch on Question reveal; **"Make it cuter" = a real fresh call** | the headline "emotion → specific action," and a *new* plan every tap |
| 🥈 2 | **Spark translator** — the two contrasting nudges | `SparkCard` (beat 2) | prefetch on app load | swap love languages → the two nudges genuinely diverge |
| 🥉 3 | **"Ask Nami" coach** — free-text → a warm tip | **new** root-level `<AskNami/>` overlay (Q&A only) | user types anything | the literal "throw anything at it" box; the Nami+ Coach tease |

Three serverless functions (`/api/plan`, `/api/spark`, `/api/coach`) hold the key and call Claude;
the SPA `fetch()`es them on the same origin (no CORS). The Question reveal text stays **100% verbatim
seed** — AI *consumes* Leo's/Maya's answer, never rewrites it.

---

## 1. Corrections to the brief (verified against the live repo + current docs)

These are the deltas a faithful reading of the brief would get wrong. **The brief's request/response
JSON uses field names from a previous `demoData.ts` that no longer exist.**

| Brief says… | Reality in this repo | What the plan uses |
|---|---|---|
| `spark.mayasNudge` / `spark.leosNudge`, fields `{body, language}` | actual: `spark.maya` / `spark.leo`, fields `{header, accent, body, language, onDone}` | swap **only `body`**, keyed `spark[perspective]` |
| `anniversaryPlan.body`, with a `makeItCuterAlternates` array | actual: `anniversary.body`; **no alternates array, no "make it cuter" button exists at all** | fall back to `anniversary.body`; **add** the cuter button as new UI |
| `question.leoAnswer` / `mayaPrefilled` | actual: `question.answers.{maya,leo}.{prefilled, hero, answeredAt}` | feed the **partner's** `.hero` into `/api/plan` |
| `couple.{names, child, anniversary}` | actual: `couple.{maya,leo}.{name, language, accent}`; no structured `child`/`anniversary` | build the context object on the client from real fields + copy |
| "Step B: `vercel link`" (one-time) | **already linked** — `.vercel/project.json` → `fkc-hackathon` (`prj_Y9E0KALJCRGVlsUVrZHHpHGDfoIF`) | **skip linking**, verify only |
| "`.gitignore` ignores `.vercel` but not `.env*`" | confirmed still true (only `*.local` is present) | **must add `.env*` first** — repo is public (`github.com/charlieellington/fkc-hackathon`) |
| llm.ts default model `claude-sonnet-4-6` | brief's prose says default to Haiku for the ≤2.5s budget | **default Haiku 4.5**, Sonnet as upgrade |
| Vercel handler signature "verify it" | current docs lead with the **Web handler** | use `export async function POST(request: Request): Promise<Response>` (not legacy `(req,res)`) |

**Verified correct in the brief (no change):** `generateText({ model, system, prompt, maxOutputTokens })`
is the current AI SDK v6 API (`maxOutputTokens`, not `maxTokens`); `anthropic()` from `@ai-sdk/anthropic`
auto-reads `ANTHROPIC_API_KEY`; model IDs `claude-sonnet-4-6` and `claude-haiku-4-5-20251001` are both
valid current Anthropic IDs; same-origin functions need no CORS; `vite` alone won't serve `/api` (need
`vercel dev`).

---

## 1.5 Provider choice: **direct Anthropic provider** (chosen) vs AI Gateway (alternative)

> A tooling validator flags this plan because it expects the **Vercel AI Gateway**. We are deliberately
> *not* using the Gateway. This is a recorded, intentional decision — not an oversight.

**Why direct `@ai-sdk/anthropic` + `ANTHROPIC_API_KEY`:** the brief mandates it; the key is already
provisioned and the §3 recipe transfers it; this is a **single-provider hackathon prototype**, which the
AI-SDK guidance and the AI-Gateway skill's own decision tree both classify as *"direct provider works
fine."* No failover, cost-attribution, per-user rate-limiting, or audit-logging needs here — those are
the reasons to reach for the Gateway, and none apply to an 80-second stage demo.

**Model-ID format depends on the path — do not "fix" ours to dotted slugs:**
- Direct provider (**ours**): `anthropic('claude-sonnet-4-6')` / `anthropic('claude-haiku-4-5-20251001')`
  — **hyphens**, verified against the Anthropic models overview. Rewriting these to dots **breaks** the call.
- Gateway slugs (only if you switch): `'anthropic/claude-sonnet-4.6'` — **dots**, `provider/model` form.

**If you later prefer the Gateway** (e.g. to avoid a raw key on disk via OIDC, or to add failover):
swap `anthropic('claude-…')` for the plain string `'anthropic/claude-sonnet-4.6'` (auto-routes — no
wrapper needed), drop `@ai-sdk/anthropic` + the `ANTHROPIC_API_KEY` push (§3.3), enable AI Gateway in the
`fkc-hackathon` dashboard, and `vercel env pull` to provision a short-lived `VERCEL_OIDC_TOKEN` instead.
Everything else in this plan (the safety net, prefetch seams, screen reads) is unchanged. Not recommended
for the demo — it adds setup for benefits the demo doesn't need.

---

## 2. Architecture decision — how live text reaches the screens

The codebase already has a clean seam, and the plan leans into it instead of fighting `as const`:

- **Seeds stay in `demoData.ts`** (single source of truth, untouched, still the offline fallback).
- **Live text is overlaid in context state**, never by mutating the frozen seed objects. Every text
  screen already calls both `useDemo()` *and* imports its seed slice, so each render becomes:
  `const body = state.ai.<feature>[perspective] ?? <seed>` — seed first, live wins if present.
- **Fetches fire once, in `DemoProvider`** (not in leaf components). Because the desktop stage mounts
  **two** `<Phone>`s sharing one provider, firing in a component would double-call. The provider owns
  the calls and stores results keyed by perspective `{ maya, leo }`; both phones read their slice.
- **Perspective is a parameter, not state** (`roles(p)` selector). Spark and Plan are therefore
  generated **per perspective** (Maya's plan from Leo's answer; Leo's from Maya's), matching the
  two-phone model.
- **The stage-safety net is one tiny client helper** (`aiSwap`, §4.3): AbortController + 2.5s timeout,
  returns `null` on any timeout/error so the caller keeps the seed. No spinner-of-death possible.
- **The existing `.shimmer-sweep` class** (700ms, already ≤800ms, used by `LockedAnswer`) is reused
  for the only user-initiated swap ("Make it cuter"). Prefetched swaps are silent (seed already shown).

This is additive: `SCREEN_ORDER`, `advance`, the beat timers, the Question reveal, and "only the Pulse
moves the score" are all **unchanged**.

---

## 3. Phase 0 — Secrets, infra, dependencies (do this first, in order)

### 3.1 Make secrets uncommittable (FIRST — repo is public)
Append to `.gitignore`:
```
# Local env (never commit — contains secrets)
.env*
!.env.example
```
(`.vercel` is already ignored; `*.local` alone does **not** cover a plain `.env`/`.env.production`.)

### 3.2 Confirm the Vercel link (already done)
`.vercel/project.json` exists → project `fkc-hackathon`. Just verify with `vercel link --yes
--project fkc-hackathon` (idempotent) — do **not** re-create.

### 3.3 Push `ANTHROPIC_API_KEY` to the project (value never printed)
```bash
vercel env ls                                   # check if already set; skip envs that exist
set -a; source ~/.claude/.env.anthropic; set +a # load WITHOUT echoing
for E in production preview development; do
  printf '%s' "$ANTHROPIC_API_KEY" | vercel env add ANTHROPIC_API_KEY "$E"
done
vercel env ls                                   # names only; values stay "Encrypted"
```
Fallback source if the local file is missing: `vercel env pull` from the `zebra-design` project into a
gitignored temp file, copy the value into the shell var, then run the loop. **Never** `cat`/`echo`/paste
the key.

### 3.4 Pull for local dev + install deps
```bash
vercel env pull .env.local        # gitignored via 3.1
npm install ai @ai-sdk/anthropic  # runtime deps (Vercel bundles them into the functions)
```

---

## 4. Phase 1 — Serverless functions (`/api`) + the LLM wrapper

New top-level `/api` directory. Web-handler signature. Node runtime (default — the Anthropic provider
needs Node). Each function: parse JSON body → call Claude via the shared wrapper → return JSON. If
Claude throws, return a 200 with the seed fallback (so the client's safety net is belt-and-braces).

### 4.1 `src/lib/llm.ts` — shared wrapper (server-side only)
```ts
// Human-first note: the one place we talk to Claude. Server-side only — never imported by the SPA.
// Keeps outputs short (fast + on-brand). Default model is Haiku 4.5 for the ≤2.5s stage budget.
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001' // Sonnet 4.6 ('claude-sonnet-4-6') if copy feels thin

export async function runLLM(opts: {
  prompt: string
  systemPrompt: string
  model?: string
  maxOutputTokens?: number
}): Promise<string> {
  const { text } = await generateText({
    model: anthropic(opts.model ?? DEFAULT_MODEL),
    system: opts.systemPrompt,
    prompt: opts.prompt,
    maxOutputTokens: opts.maxOutputTokens ?? 220,
  })
  return text.trim()
}
```

**Voice (in every system prompt):** warm, specific, a little cheeky; never clinical. Outputs are
"signals/nudges," never "grades." Always concrete and tied to *this* couple (Maya, Leo, toddler Theo,
6 years, 5 weeks since a date, Maya = Quality Time, Leo = Physical Touch). No therapy jargon, no emoji
unless the seed used one.

### 4.2 The three endpoints (handler shape + grounded prompts)

Shared handler skeleton:
```ts
// api/plan.ts
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json()
    const text = await runLLM({ systemPrompt: SYSTEM, prompt: buildPrompt(body), maxOutputTokens: 160 })
    return Response.json({ plan: text })
  } catch {
    return Response.json({ plan: null }, { status: 200 }) // client falls back to its seed
  }
}
```
> `runLLM`/`SYSTEM`/`buildPrompt` live in the `/api` file or a sibling — `/api` files can import from
> `src/lib/llm.ts`. (Optional: `export const config = { maxDuration: 30 }`.)

**`POST /api/plan`** — Feature 1.
- Request: `{ answer: string, viewerName, partnerName, anniversaryLabel: "Tuesday · your anniversary", contextNote: "6 years, toddler Theo, ~5 weeks since a date", variation: "default" | "cuter" }`
- Response: `{ plan: string | null }` (2–4 short lines)
- System: *"You are Nami. From the partner's answer, extract the specific shared moment and turn it into
  a tiny, doable anniversary micro-date that recreates it. 2–4 short lines. Concrete (time, place,
  no-phones, one small detail). Reuse their own words. No booking promises — it's a local reminder."*
  When `variation:"cuter"`, append: *"Make this warmer and cuter, a different angle from before."*
- Client fallback: `anniversary.body`.

**`POST /api/spark`** — Feature 2.
- Request: `{ maya: { loves: "Quality Time" }, leo: { loves: "Physical Touch" }, context: { intimate: 71, lastDate: "5 weeks ago" } }`
- Response: `{ mayasNudge: string | null, leosNudge: string | null }` (one specific physical action the
  *giver* does *for* the receiver this week, ≤18 words, matched to the **receiver's** love language)
- System: *"Two nudges, one per partner. Each is a specific action the giver does FOR the receiver this
  week, ≤18 words, matched to the RECEIVER's love language. Never 'be romantic' — concrete (e.g. a
  '20-second hello hug'). Return strict JSON {mayasNudge, leosNudge}."*
- Client maps `mayasNudge → ai.spark.maya`, `leosNudge → ai.spark.leo`; **accent/header/tint stay
  seed-driven** (load-bearing visual — only the body text changes). Fallback: `spark.{p}.body`.

**`POST /api/coach`** — Feature 3.
- Request: `{ message: string, couple: { names: "Maya & Leo", loves: {...}, score: 82, gaps: "intimacy 71, 5 weeks since a date" } }`
- Response: `{ tip: string | null }` (2–4 sentences)
- System: *"You are Nami's relationship coach for Maya & Leo (6 yrs, toddler Theo, 5 weeks since a date,
  intimacy drifting at 71). Given what they type, give ONE specific, warm, doable suggestion tied to
  their love languages and the date-night gap. Never generic. 2–4 sentences. A signal, not a grade."*
- Client fallback: one safe canned tip (add `coach.fallbackTip` to `demoData.ts`).

---

## 5. Phase 2 — Frontend wiring

### 5.1 State additions (`src/context/demo-types.ts`)
```ts
export interface AiState {
  spark: { maya: string | null; leo: string | null }       // live nudge bodies
  plan:  { maya: string | null; leo: string | null }        // live anniversary plans
  planRegenerating: { maya: boolean; leo: boolean }         // "make it cuter" in-flight → shimmer
}
// add to DemoState:  ai: AiState
```
`initialState.ai` = all `null` / `false`. `reset()` must restore it (and abort any in-flight fetch).

### 5.2 Provider plumbing (`src/context/DemoProvider.tsx`)
- **`src/lib/aiSwap.ts`** (new) — the safety net:
```ts
// Human-first note: calls a Claude endpoint but can never hang the demo. Returns null on any
// timeout/error so the caller keeps its seeded line. 2.5s budget per the stage-safety rule.
export async function aiSwap<T>(path: string, body: unknown, timeoutMs = 2500): Promise<T | null> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(path, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body), signal: ctrl.signal,
    })
    return res.ok ? ((await res.json()) as T) : null
  } catch { return null } finally { clearTimeout(t) }
}
```
- **Prefetch Spark on mount:** `useEffect(() => { aiSwap('/api/spark', {...}).then(r => { if (r?.mayasNudge) setState(s => ({...s, ai:{...s.ai, spark:{maya:r.mayasNudge, leo:r.leosNudge}}})) }) }, [])`.
- **Prefetch Plans inside `sendQuestion`:** when the reveal `setState` fires (the existing 700ms point),
  kick off **two** `aiSwap('/api/plan', { answer: <partner's hero>, variation:'default', ... })` calls —
  Leo's hero → `ai.plan.maya`, Maya's hero → `ai.plan.leo`. The ~1.9s reveal-hold + screen-switch covers
  the latency, so the Anniversary card paints live on arrival (or seed if not back yet).
- **New action `regeneratePlan(perspective)`** (NOT a one-shot `fired` guard — it's repeatable; gate on
  the `planRegenerating[p]` flag): set flag → `aiSwap('/api/plan', { variation:'cuter', ... })` → on a
  non-null result set `ai.plan[p]`, else keep current → clear flag. Expose on `DemoApi`.
- Use the existing tracked `schedule()`/`clearTimers()` so any timeout is cleared on `reset()`/`advance()`.

### 5.3 Feature 2 — `SparkCard.tsx`
One-line read change: `const body = state.ai.spark[perspective] ?? nudge.body`, render `{body}`.
Everything else (accent, header, `language`, Done button, confetti) unchanged.

### 5.4 Feature 1 — `AnniversaryPlanCard.tsx` (+ `StageView.tsx`)
- Add a `perspective: Perspective` prop; pass it from `StageView` (which already has perspective). Read
  `const body = state.ai.plan[perspective] ?? anniversary.body`.
- Wrap the body paragraph in `relative overflow-hidden`; when `state.ai.planRegenerating[perspective]`,
  render `<div className="shimmer-sweep absolute inset-0" />` over it.
- Add a subtle **"✨ Make it cuter"** text button near the body (Maeda-restrained — small, secondary),
  `onClick={() => regeneratePlan(perspective)}`, disabled while regenerating. The scripted action
  ("Set reminder" → auto-advance) is untouched; the cuter button is an optional extra.

### 5.5 Feature 3 — `src/components/nudge/AskNami.tsx` (new) + `App.tsx`
- Mount `<AskNami/>` as a **sibling of `<Stage/>`** inside `DemoProvider` in `App.tsx` — so it lives on
  *top* of every beat, is reachable on the terminal `close` screen (where Q&A happens), and is **never**
  in `SCREEN_ORDER`.
- A small fixed "Ask Nami / Nami+ Coach" pill trigger → opens a `radix-ui` `Dialog` (already installed;
  import `{ Dialog } from 'radix-ui'`, matching `button.tsx`'s style) containing a real `<textarea>`, a
  Send `Button`, and the rendered tip. On send: `aiSwap('/api/coach', { message, couple })`; show the
  ≤800ms shimmer/typing-dots while waiting; render the tip, or `coach.fallbackTip` on null. Reuse
  `Button`, `emberToast`, `cn`, and the `couple`/`score` seeds. Keep < 250 lines.
- Open-state is **local `useState`**, never `currentScreen`. (Optional: only render the *trigger* once
  `state.currentScreen === 'close'` so it stays invisible during the scripted run.)

---

## 6. Phase 3 — Verification & Definition of Done

Run locally with `vercel dev` (serves Vite + `/api` together; plain `npm run dev` will 404 `/api`).
If `vercel dev` struggles with Vite 8 locally, deploy a preview and test there — a preview pass is
required by the DoD regardless.

- [ ] `.gitignore` ignores `.env*`; **no key in any committed file, code, or log** (`git diff | grep -nE 'sk-|ANTHROPIC'` is clean).
- [ ] `ANTHROPIC_API_KEY` set on `fkc-hackathon` for Production + Preview + Development (`vercel env ls`).
- [ ] `ai` + `@ai-sdk/anthropic` installed; `src/lib/llm.ts` + `src/lib/aiSwap.ts` added.
- [ ] `/api/plan`, `/api/spark`, `/api/coach` deployed and returning real Claude output on a preview URL.
- [ ] **Offline test passes:** kill the network (or block `/api`) → full scripted run still completes,
      every beat shows its seed, zero dead-clicks, zero console errors. *(This is the non-negotiable gate.)*
- [ ] "Make it cuter" produces a genuinely different plan each tap; Spark nudges visibly change if love
      languages are swapped in `demoData.ts`; "Ask Nami" returns a specific tip to arbitrary input.
- [ ] Demo spine, beat order (`today→spark→afterDark→question→anniversary→close`), Leo's **verbatim**
      answer, the 700ms shimmer / 1200ms reveal-hold, and "only the Pulse moves the score" all unchanged.
- [ ] `npm run build` ✓ · `npm run lint` ✓ · mobile (full-bleed) and desktop (two framed phones) both fine.

---

## 7. File-by-file change list

**New**
- `api/plan.ts`, `api/spark.ts`, `api/coach.ts` — serverless functions (Web POST handlers)
- `src/lib/llm.ts` — Claude wrapper (server-side)
- `src/lib/aiSwap.ts` — client safety-net fetch
- `src/components/nudge/AskNami.tsx` — Feature 3 overlay

**Edited**
- `.gitignore` — add `.env*` / `!.env.example`
- `package.json` — add `ai`, `@ai-sdk/anthropic` (via `npm install`)
- `src/context/demo-types.ts` — add `AiState` + `ai` on `DemoState`
- `src/context/DemoProvider.tsx` — `ai` in initial state; mount-prefetch Spark; reveal-prefetch Plans;
  `regeneratePlan` action; extend `reset()`
- `src/components/spark/SparkCard.tsx` — read `ai.spark[perspective] ?? nudge.body`
- `src/components/anniversary/AnniversaryPlanCard.tsx` — `perspective` prop, live read, shimmer, cuter button
- `src/components/shell/StageView.tsx` — pass `perspective` to `AnniversaryPlanCard`
- `src/App.tsx` — mount `<AskNami/>` inside `DemoProvider`
- `src/data/demoData.ts` — add `coach.fallbackTip` (and optional Ask-Nami trigger copy)

---

## 8. Open decisions (please confirm)

1. **Editable Question answer?** The brief's "a judge edits the answer box → the plan adapts" needs an
   editable answer, but the box is currently `readOnly` and the *revealed* text is the partner's
   **verbatim** answer (must not change). **Recommendation:** ship Feature 1's adaptivity via **"Make it
   cuter" (real regeneration)** — solid and safe. Treat "edit the answer to re-plan" as an optional
   stretch (make the *viewer's own prefilled* answer editable), only if there's time. *Default: skip the
   editable box.*
2. **Coach trigger visibility** — always visible (subtle pill) vs only on the `close` screen.
   **Recommendation:** render the trigger only on `close`, so it never distracts during the scripted run
   but is right there for Q&A.
3. **Model** — default **Haiku 4.5** for latency; bump a specific endpoint to **Sonnet 4.6** only if its
   copy feels thin in rehearsal. *Default: Haiku everywhere.*
4. **Local dev** — `vercel dev` as primary; if Vite 8 + `vercel dev` misbehave, develop against a Vercel
   **preview URL** (and point `fetch` at it). *Default: try `vercel dev` first.*

---

## 9. Risks & mitigations

- **Public repo leaks the key** → `.gitignore` `.env*` first, key only via stdin, grep the diff for `sk-`
  before any commit. *(Highest-priority item.)*
- **Venue wifi dies mid-demo** → the §2 safety net means every beat already shows its seed; live text is
  pure upside. The offline run is the acceptance gate, tested explicitly.
- **Two phones double-call** → all fetches fire once in the provider, keyed by perspective; leaf
  components only read.
- **A slow call lands *after* the beat passed** → harmless: it writes to `ai.<feature>[p]`; if the user
  already moved on, the seed was shown and nothing janks. The reveal-hold (~1.9s) covers the Plan path.
- **Claude returns malformed JSON for `/api/spark`** → the function catches and returns `{...: null}`;
  client keeps seeds. (Consider `generateObject` with a schema as a hardening upgrade.)
- **Scope creep into the demo spine** → only `SparkCard` / `AnniversaryPlanCard` body reads change; beat
  order, timers, score logic, and the verbatim reveal are untouched.
