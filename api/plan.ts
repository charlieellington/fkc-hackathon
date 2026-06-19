// Human-first note: Feature 1 — turn a real, free-text "moment" into a tiny, doable anniversary
// micro-date. Called only when someone EDITS their answer or taps "Make it cuter" (the scripted demo
// never hits this). On any error it returns { plan: null } so the app keeps its seeded line.
import { runLLM } from './_lib/llm.js'

const SYSTEM =
  'From the moment the user describes, extract the specific shared experience and turn it into a tiny, ' +
  'doable anniversary micro-date that recreates it. 2–4 short lines. Concrete: a time, a place, ' +
  'phones-away, one small sensory detail. Reuse their own words where you can. No booking promises — ' +
  "it's a local reminder, not a reservation. Return only the plan text, no preamble."

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => ({}))
    const answer: string = (body.answer ?? '').toString().slice(0, 600)
    if (!answer.trim()) return Response.json({ plan: null })

    const cuter = body.variation === 'cuter'
    const prompt = [
      `The moment: "${answer}"`,
      body.anniversaryLabel ? `Occasion: ${body.anniversaryLabel}.` : '',
      body.previousPlan ? `Previous plan was: "${body.previousPlan}".` : '',
      cuter
        ? 'Write a WARMER, cuter version from a different angle than before — same moment, fresh take.'
        : 'Write the plan.',
    ]
      .filter(Boolean)
      .join('\n')

    const plan = await runLLM({ systemPrompt: SYSTEM, prompt, maxOutputTokens: 160 })
    return Response.json({ plan: plan || null })
  } catch {
    return Response.json({ plan: null }) // client falls back to its seed
  }
}
