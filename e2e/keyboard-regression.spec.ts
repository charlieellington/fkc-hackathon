// Human-first note: the guard for the reported mobile bug — typing in the answer box used to eat spaces
// and "auto-advance" (Space drove the demo; 'r' reset it). This proves typing now stays in the field.
import { test, expect } from '@playwright/test'
import { gotoQuestion, stepOf } from './helpers'

test('typing in the answer keeps spaces and never drives the demo', async ({ page }) => {
  const ph = await gotoQuestion(page)
  const ta = ph.getByLabel('Your answer')

  await ta.click()
  await ta.fill('') // start clean, then type key-by-key (what triggered the bug)
  await ta.pressSequentially('hello world test', { delay: 15 })

  // spaces survived AND the demo did not skip a beat
  await expect(ta).toHaveValue('hello world test')
  await expect(stepOf(ph)).toHaveAttribute('data-demo-step', 'question')

  // a word with 'r' must not reset to the opening beat
  await ta.pressSequentially(' more radiant words', { delay: 15 })
  await expect(ta).toHaveValue('hello world test more radiant words')
  await expect(stepOf(ph)).toHaveAttribute('data-demo-step', 'question')
})
