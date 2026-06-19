// Human-first note: Feature 2 — the "two manuals" spark. Generates one specific physical action per
// partner, each matched to the RECEIVER's love language. Called only when someone taps "✨ regenerate"
// (mobile). On any error / unparseable output it returns nulls so the app keeps its seeded nudges.
import { runLLM } from './_lib/llm.js'

const SYSTEM =
  'Return TWO nudges as STRICT JSON: {"mayasNudge":"...","leosNudge":"..."}. Each nudge is a single ' +
  'specific action the GIVER does FOR the receiver this week, matched to the RECEIVER\'s love language, ' +
  '≤16 words, concrete and physical (e.g. "When Leo walks in, a 20-second hug"). mayasNudge is what ' +
  'Maya does for Leo; leosNudge is what Leo does for Maya. Never "be romantic". JSON only, no prose.'

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => ({}))
    const mayaLoves = body?.maya?.loves ?? 'Quality Time'
    const leoLoves = body?.leo?.loves ?? 'Physical Touch'
    const intimate = body?.context?.intimate ?? 71
    const lastDate = body?.context?.lastDate ?? '5 weeks ago'

    const prompt =
      `Maya feels loved through ${mayaLoves}. Leo feels loved through ${leoLoves}. ` +
      `Their intimacy signal is ${intimate} and their last date was ${lastDate}. ` +
      `So leosNudge (for Maya) matches ${mayaLoves}; mayasNudge (for Leo) matches ${leoLoves}.`

    const raw = await runLLM({ systemPrompt: SYSTEM, prompt, maxOutputTokens: 160 })
    const match = raw.match(/\{[\s\S]*\}/)
    const parsed = match ? JSON.parse(match[0]) : {}
    return Response.json({
      mayasNudge: typeof parsed.mayasNudge === 'string' ? parsed.mayasNudge : null,
      leosNudge: typeof parsed.leosNudge === 'string' ? parsed.leosNudge : null,
    })
  } catch {
    return Response.json({ mayasNudge: null, leosNudge: null })
  }
}
