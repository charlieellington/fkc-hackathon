# Nami — Real AI Integration Brief (for the Nami build agents)

> **For non-coders:** Nami's "AI" is currently scripted (pre-written copy + a shimmer). This doc is
> the recipe to make **three** of those beats *genuinely* AI — real Claude calls that read what the
> user types and respond live, so a judge can throw any input at it and watch it adapt. It tells you
> exactly which three features, how to wire Claude into this Vite app on Vercel, **where the API key
> lives and how to load it without ever exposing it** (this repo is open-source — no secrets in code,
> chat, or git), and how to keep it bulletproof on stage.
>
> Read alongside `nami-brief.md` (constraints + demo data), `nami-product-brief-v3.md` (strategy), and
> `nami-journey-wireframes-v2.md` (screens). This doc *adds* a real-AI layer; it does not change the
> demo spine or the order of beats.

---

## 0. The one rule that overrides everything: **stage-safety**

The original brief bans network/LLM calls because a live stage demo must never break. We are relaxing
that **only** behind a hard safety net. Every real Claude call MUST follow this pattern:

1. **Optimistic seed first.** Render the existing canned line from `demoData.ts` immediately.
2. **Fire the Claude call in the background** with a **short timeout (~2.5s)** and the existing
   **≤800ms shimmer** over the spot that will update.
3. **If Claude returns in time → swap in the real text.** If it errors, times out, or the venue wifi
   dies → **keep the seeded line.** No spinner-of-death, no dead-click, ever.

Result: judges get "throw anything at it, it's really thinking" credibility, and a dead network still
gives a flawless scripted run. **This safety net is non-negotiable.** Prefetch on screen-entry where
you can so the swap feels instant.

---

## 1. Architecture (Vite SPA + Vercel Serverless Functions)

Nami is a **front-end-only Vite + React SPA**. You **cannot** call Claude from the browser — it would
leak the API key and CORS blocks it. The smallest correct addition:

- Add a top-level **`/api`** directory to this repo. Vercel auto-deploys each file there as a
  **serverless function** — no framework migration, no Next.js needed.
- The functions hold the key (server-side env var) and call Claude; the SPA `fetch()`es them.
- Because the functions and the SPA ship in **the same Vercel project (same origin)**, there is
  **no CORS to configure.** The browser calls `fetch('/api/plan')` directly.

**Local dev gotcha:** `npm run dev` (plain `vite`) does **not** serve `/api`. For full-stack local
dev run **`vercel dev`** (serves Vite + functions together), or point `fetch` at a deployed preview URL.

> ⚠️ Vercel function handler signatures and AI SDK APIs change often. **Before writing code, read the
> current docs:** Vercel Functions (https://vercel.com/docs/functions) and AI SDK
> (https://sdk.vercel.ai/docs). Treat the code below as a known-good *shape*, but verify the exact
> handler signature and AI SDK v6 method names against the live docs.

---

## 2. API keys — where they are & how to load them safely

**This repo is open-source. No API key may ever appear in code, committed files, chat, or logs.**
The key already exists in two places we control:

- **Locally:** `~/.claude/.env.anthropic` → `ANTHROPIC_API_KEY=...`
- **On the `zebra-design` Vercel project** (same Vercel team), set 50 days ago for Prod/Preview/Dev.

We transfer it into **this** project (`fkc-hackathon`,
https://vercel.com/charlie-ellingtons-projects/fkc-hackathon) using Vercel CLI. The value is piped via
stdin and **never printed**.

### Step A — make sure secrets can't be committed (do this FIRST)

This repo's `.gitignore` ignores `.vercel` but **not `.env*`**. Add it before pulling anything:

```bash
cd <this repo>
printf '\n# Local env (never commit — contains secrets)\n.env*\n!.env.example\n' >> .gitignore
```

### Step B — link this repo to the Vercel project (one-time)

```bash
vercel link --yes --project fkc-hackathon
# Project: charlie-ellingtons-projects/fkc-hackathon
# projectId: prj_Y9E0KALJCRGVlsUVrZHHpHGDfoIF   orgId: team_1SVXkYaz4jsQ0I9TkPBqPEt5
```

### Step C — push `ANTHROPIC_API_KEY` to the project (value never echoed)

```bash
# Load the key from the local secret file into the shell WITHOUT printing it:
set -a; source ~/.claude/.env.anthropic; set +a

# Push to all three Vercel environments — value comes from stdin, never shown on screen:
for ENVIRON in production preview development; do
  printf '%s' "$ANTHROPIC_API_KEY" | vercel env add ANTHROPIC_API_KEY "$ENVIRON"
done

# Verify — names only; values stay "Encrypted". The key value never prints.
vercel env ls
```

> If `~/.claude/.env.anthropic` is missing, the key is also on the `zebra-design` project: from that
> repo run `vercel env pull` into a temp gitignored file, copy the value into the shell var, then run
> Step C. Prefer the local file — fewer secret-on-disk moments.

### Step D — pull the key for local dev (gitignored)

```bash
vercel env pull .env.local      # writes ANTHROPIC_API_KEY into .env.local (already gitignored via Step A)
vercel dev                      # runs Vite + /api functions locally
```

**Never** `cat`, `echo`, or paste the key. **Never** add it to `demoData.ts`, a committed `.env`, or any
doc. The only place the literal value lives is the local secret file, `.env.local` (gitignored), and
Vercel's encrypted env store.

---

## 3. Dependencies to install

The AI SDK is **not** in this repo yet:

```bash
npm install ai @ai-sdk/anthropic
```

(Same stack the `zebra-design` repo uses successfully: `ai` v6 + `@ai-sdk/anthropic`.)

---

## 4. Shared LLM wrapper (proven pattern to copy)

Create `src/lib/llm.ts`. This is the working wrapper from the `zebra-design` repo, trimmed for Nami —
verify method names against current AI SDK docs:

```ts
// src/lib/llm.ts — thin Anthropic wrapper (AI SDK v6 + @ai-sdk/anthropic). Server-side only.
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'

// Cheap model for the demo — Sonnet 4.6. Do NOT use Opus (expensive, no benefit for short copy).
// Haiku 4.5 ('claude-haiku-4-5-20251001') is cheaper/faster still if you need lower latency.
const DEFAULT_MODEL = 'claude-sonnet-4-6'

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
    maxOutputTokens: opts.maxOutputTokens ?? 220, // keep outputs short → fast + on-brand
  })
  return text.trim()
}
```

**Model guidance:** default to **Haiku 4.5** (`claude-haiku-4-5-20251001`) — fastest, best for the
≤2.5s budget. Use **Sonnet 4.6** (`claude-sonnet-4-6`) if a feature's copy feels thin. Keep
`maxOutputTokens` low (≤~220) — short answers are faster *and* more on-brand.

**Voice (put in every system prompt):** warm, specific, a little cheeky; never clinical. Outputs are
"signals/nudges," never "grades." Never generic ("communicate more") — always concrete and tied to
*this* couple. British-ish warmth, no therapy jargon, no emoji unless the seed line uses them.

---

## 5. The three features (build these — and only these — with real AI)

Seed/context data lives in `src/data/demoData.ts` (`couple`, `score`, `spark`, `question`,
`anniversaryPlan`). Pass the relevant slice as JSON context to each call. Keep Leo's verbatim answer
verbatim — AI consumes it, never rewrites it.

### 🥇 Feature 1 — Anniversary plan from the real answer (screen [6]) — HERO

Turn the partner's free-text Question answer into a specific micro-date plan. **"Make it cuter"
becomes real regeneration** (a fresh call with a "make it warmer/cuter, different angle" instruction),
not a canned cycle.

- **Route:** `POST /api/plan`
- **Request:** `{ "answer": "<Leo's free-text answer>", "couple": {names, child, anniversary}, "variation": "default" | "cuter" }`
- **Response:** `{ "plan": "<2–4 short lines>" }`
- **System prompt sketch:** *"You are Nami. From the partner's answer, extract the specific shared
  moment and turn it into a tiny, doable anniversary micro-date that recreates it. 2–4 short lines.
  Concrete (time, place, no-phones, a small detail). Reuse their own words. No booking promises —
  it's a local reminder."*
- **Seed/fallback:** `anniversaryPlan.body` ("Recreate Sunday coffee…").
- **Why real AI wins:** a judge edits the answer box → the plan genuinely adapts. This is Nami's
  "one amazing thing" (emotion → specific action) made real.

### 🥈 Feature 2 — Spark translator: "two operating manuals" (screens [3a/3b])

Generate the two *specific, contrasting* nudges from each partner's love language + the week's context.

- **Route:** `POST /api/spark`
- **Request:** `{ "couple": { maya:{loves}, leo:{loves} }, "context": { intimate: 71, lastDate: "5 weeks ago" } }`
- **Response:** `{ "mayasNudge": { "body": "...", "language": "..." }, "leosNudge": { "body": "...", "language": "..." } }`
  (one action **for** the partner, named by the *receiver's* love language)
- **System prompt sketch:** *"Two nudges, one per partner. Each is a specific physical action the
  giver does for the receiver this week, ≤18 words, matched to the RECEIVER's love language. Never
  'be romantic' — concrete (e.g. '20-second hello hug'). Return strict JSON."*
- **Seed/fallback:** `spark.mayasNudge` / `spark.leosNudge`.
- **Why real AI wins:** swap the love languages and the two nudges genuinely diverge → proves "it
  understands each of us, differently."

### 🥉 Feature 3 — "Ask Nami" coach (the literal "tips from user input")

A free-text box → a warm, specific tip grounded in the couple's profile. Doubles as the **Nami+
Coach** tier tease.

- **Route:** `POST /api/coach`
- **Request:** `{ "message": "<what the user types>", "couple": {names, loves, score, gaps} }`
- **Response:** `{ "tip": "<2–4 sentences, specific, warm>" }`
- **System prompt sketch:** *"You are Nami's relationship coach for Maya & Leo (6 yrs, toddler Theo,
  5 weeks since a date, intimacy drifting at 71). Given what they type, give ONE specific, warm,
  doable suggestion tied to their love languages and the date-night gap. Never generic. 2–4
  sentences. A signal, not a grade."*
- **Seed/fallback:** a single safe canned tip in `demoData.ts` if the call fails.
- **Placement:** a new optional surface (e.g. a sheet off Today or a Nami+ teaser) — **do not** insert
  it into the locked 80–85s run-of-show; it's an "extra" judges can poke at during Q&A.

---

## 6. Frontend wiring notes

- Each beat reads its seed from `demoData.ts` (instant), then calls its endpoint and swaps on success.
- Wrap each `fetch` in the **§0 safety pattern**: ~2.5s timeout, shimmer, fall back to seed on any error.
- **Prefetch** Feature 1 when the Question reveals (you already have the answer), and Feature 2 on app
  load, so the swap is invisible.
- Keep all existing animations, the verbatim Leo answer, "only the Pulse moves the score," and the
  beat order exactly as `nami-journey-wireframes-v2.md` specifies.

---

## 7. Definition of done

- [ ] `.gitignore` ignores `.env*`; **no key in any committed file, code, or log** (grep the diff for `sk-`).
- [ ] `ANTHROPIC_API_KEY` set on `fkc-hackathon` for Production + Preview + Development (`vercel env ls`).
- [ ] `ai` + `@ai-sdk/anthropic` installed; `src/lib/llm.ts` added.
- [ ] `/api/plan`, `/api/spark`, `/api/coach` deployed and returning real Claude output.
- [ ] Every real call falls back to the seeded line on timeout/error — **a full offline run still works**.
- [ ] Demo spine, beat order, verbatim answer, and "Pulse-only score move" unchanged.
- [ ] Verified with `vercel dev` locally and on a Vercel preview deployment.
```