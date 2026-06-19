// Human-first note: Feature 3 — "Ask Nami". A free-text box → one warm, specific tip grounded in the
// couple's profile. This is the always-interactive play surface (the Nami+ Coach tease), poked during
// Q&A. On any error it returns { tip: null } and the UI shows a safe canned line.
import { runLLM } from './_lib/llm.js'

const SYSTEM =
  'Given what they type, give ONE specific, warm, doable suggestion tied to their love languages and ' +
  'the date-night gap. Never generic ("communicate more" is banned). 2–4 sentences. A signal, not a ' +
  'grade. Return only the tip.'

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => ({}))
    const message: string = (body.message ?? '').toString().slice(0, 800)
    if (!message.trim()) return Response.json({ tip: null })

    const c = body.couple ?? {}
    const prompt =
      `They asked: "${message}"\n` +
      `Context: ${c.names ?? 'Maya & Leo'}; ` +
      `Maya loves ${c?.loves?.maya ?? 'Quality Time'}, Leo loves ${c?.loves?.leo ?? 'Physical Touch'}; ` +
      `signal ${c.score ?? 82}; ${c.gaps ?? 'intimacy drifting, ~5 weeks since a date'}.`

    const tip = await runLLM({ systemPrompt: SYSTEM, prompt, maxOutputTokens: 200 })
    return Response.json({ tip: tip || null })
  } catch {
    return Response.json({ tip: null })
  }
}
