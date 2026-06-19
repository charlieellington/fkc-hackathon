// Human-first note: the ONE place Nami talks to Claude. It lives under api/_lib so Vercel never
// turns it into a public endpoint, and so the browser bundle never imports it (the API key is
// server-only). Outputs are kept short — faster on stage, and on-brand (warm, specific, never preachy).
// The `_` prefix in the folder name tells Vercel "this is shared code, not a route".
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'

// Haiku 4.5 is the default: fastest, best for the ≤2.5s interactive budget. Bump a single call to
// Sonnet 4.6 ('claude-sonnet-4-6') only if its copy ever feels thin. anthropic() auto-reads
// ANTHROPIC_API_KEY from the environment, so no key is ever referenced here.
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001'

// Shared voice — prepended to every feature's own system prompt.
export const NAMI_VOICE =
  'You are Nami, a warm relationship companion — specific, a little cheeky, never clinical and never ' +
  'preachy. You speak to Maya & Leo: together 6 years, a toddler named Theo, ~5 weeks since their last ' +
  'date, intimacy drifting. Maya feels loved through Quality Time; Leo through Physical Touch. Outputs ' +
  'are signals and nudges, never grades. Always concrete and tied to THIS couple. No therapy jargon, ' +
  'no hashtags, no emoji unless asked.'

export async function runLLM(opts: {
  prompt: string
  systemPrompt: string
  maxOutputTokens?: number
}): Promise<string> {
  const { text } = await generateText({
    model: anthropic(DEFAULT_MODEL),
    system: `${NAMI_VOICE}\n\n${opts.systemPrompt}`,
    prompt: opts.prompt,
    maxOutputTokens: opts.maxOutputTokens ?? 200,
  })
  return text.trim()
}
