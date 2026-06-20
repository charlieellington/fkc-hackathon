// Human-first note: the reciprocal Question. Each phone shows ITS person's pre-filled (read-only)
// answer and the PARTNER's hidden one. Tap Send → short shimmer → reveal. Both phones reveal in sync;
// on the desktop stage "Focus Mode" (in Phone.tsx) makes Maya the focal point. The CTA only appears
// after the ~1.2s hold so the "aww" can land.
import { useEffect, useRef, useState } from 'react'
import { useDemo } from '@/context/DemoProvider'
import type { Perspective } from '@/context/demo-types'
import { question } from '@/data/demoData'
import { Avatar } from '@/components/ui/Avatar'
import { LockedAnswer } from './LockedAnswer'
import { RevealedAnswer } from './RevealedAnswer'
import { MessageCircleHeart, Sparkles } from 'lucide-react'

export function QuestionScreen({
  perspective,
  interactive = false,
}: {
  perspective: Perspective
  interactive?: boolean
}) {
  const { state, sendQuestion, advance } = useDemo()
  const partnerKey: Perspective = perspective === 'maya' ? 'leo' : 'maya'
  const viewer = question.answers[perspective]
  const partner = question.answers[partnerKey]
  const viewerName = perspective === 'maya' ? 'Maya' : 'Leo'
  const partnerName = partnerKey === 'maya' ? 'Maya' : 'Leo'

  // The answer is genuinely editable (both the mobile build and the desktop projector now). Editing it
  // makes the plan adapt to the new words; an UNTOUCHED or BLANK answer is not "dirty", so it stays
  // network-free and falls back to the seed (no pointless Claude call, no empty bubble driving the plan).
  const [answer, setAnswer] = useState<string>(viewer.prefilled)
  const dirty = answer.trim().length > 0 && answer.trim() !== viewer.prefilled.trim()

  // Auto-grow so a long edited answer shows its START (not just the tail) — it's on the big screen now.
  const taRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px` // cap ≈ max-h-40, then scroll
  }, [answer])

  return (
    <div className="flex h-full flex-col bg-canvas px-6 pb-6 pt-14 text-ink">
      <p className="flex items-center gap-2 font-display text-[15px] italic text-ink-muted">
        <MessageCircleHeart className="size-4 text-rose" strokeWidth={1.75} /> a question for you both
      </p>
      <p className="mt-3 font-display text-[22px] font-semibold leading-snug text-ink text-balance">{question.prompt}</p>

      <p className="mt-5 text-xs font-medium text-ink-muted">
        {partnerName} answered · {partner.answeredAt}
      </p>
      <div className="mt-1.5">
        {state.questionRevealed ? (
          <RevealedAnswer text={partner.hero} />
        ) : (
          <LockedAnswer sending={state.questionSending} />
        )}
      </div>

      <p className="mt-5 text-xs font-medium text-ink-muted">{viewerName} (you)</p>
      <div className="mt-1.5 flex items-start gap-2 rounded-[12px] bg-surface p-3 ring-1 ring-hairline transition focus-within:ring-2 focus-within:ring-ember/40">
        <Avatar person={perspective} size="sm" />
        <textarea
          ref={taRef}
          readOnly={!interactive || state.questionRevealed || state.questionSending}
          inputMode={interactive ? undefined : 'none'}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          maxLength={400}
          rows={1}
          aria-label="Your answer"
          className="max-h-40 min-h-[44px] flex-1 resize-none overflow-y-auto border-0 bg-transparent text-[15px] font-medium leading-snug text-ink caret-ember focus:outline-none"
        />
      </div>

      <div className="mt-auto pt-5">
        {!state.questionRevealed ? (
          <button
            onClick={() => sendQuestion(perspective, answer, dirty)}
            disabled={state.questionSending}
            data-demo-action="send"
            className="raised press w-full rounded-[12px] bg-ember py-3.5 text-lg font-semibold text-canvas disabled:opacity-70"
          >
            {state.questionSending ? 'Sending…' : 'Send'}
          </button>
        ) : (
          !state.revealLocked && (
            <button
              onClick={advance}
              data-demo-action="use-this"
              className="press flex w-full animate-fade-rise items-center justify-center gap-2 rounded-[12px] bg-surface py-3.5 text-lg font-semibold text-ink ring-1 ring-hairline"
            >
              <Sparkles className="size-5 text-rose" strokeWidth={2} /> {question.emberCta}
            </button>
          )
        )}
      </div>
    </div>
  )
}
