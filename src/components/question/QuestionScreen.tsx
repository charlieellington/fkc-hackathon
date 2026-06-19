// Human-first note: the reciprocal Question. Each phone shows ITS person's pre-filled (read-only)
// answer and the PARTNER's hidden one. Tap Send → short shimmer → reveal. Both phones reveal in sync;
// on the desktop stage "Focus Mode" (in Phone.tsx) makes Maya the focal point. The CTA only appears
// after the ~1.2s hold so the "aww" can land.
import { useState } from 'react'
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

  // Interactive mode (mobile): the answer is genuinely editable, and the plan adapts to the new words.
  // Untouched (or on the desktop stage) it behaves exactly as before — seed text, no Claude call.
  const [answer, setAnswer] = useState<string>(viewer.prefilled)
  const dirty = answer.trim() !== viewer.prefilled.trim()

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
      <div className="mt-1.5 flex items-start gap-2 rounded-[12px] bg-surface p-3 ring-1 ring-hairline">
        <Avatar person={perspective} size="sm" />
        <textarea
          readOnly={!interactive || state.questionRevealed}
          inputMode={interactive ? undefined : 'none'}
          value={interactive ? answer : viewer.prefilled}
          onChange={interactive ? (e) => setAnswer(e.target.value) : undefined}
          aria-label="Your answer"
          className="h-11 flex-1 resize-none border-0 bg-transparent text-[15px] font-medium text-ink focus:outline-none"
        />
      </div>

      <div className="mt-auto pt-5">
        {!state.questionRevealed ? (
          <button
            onClick={() => (interactive ? sendQuestion(perspective, answer, dirty) : sendQuestion())}
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
