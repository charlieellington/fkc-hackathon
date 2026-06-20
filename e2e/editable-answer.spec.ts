// Human-first note: the editable-answer UX guards surfaced by the verification pass — a long answer must
// grow (so its START is visible, not just the tail), a long paste is capped, and a blank answer falls
// back to the seed plan instead of driving a blank one.
import { test, expect } from '@playwright/test'
import { gotoQuestion, stepOf, HERO, SEED_ANNIVERSARY } from './helpers'

test('long answer grows the field (start stays visible)', async ({ page }) => {
  const ph = await gotoQuestion(page)
  const ta = ph.getByLabel('Your answer')
  const before = await ta.evaluate((el) => (el as HTMLTextAreaElement).clientHeight)

  await ta.fill(
    'The slow Sunday morning when the rain held off, coffee going cold in both our hands, ' +
      'Theo still asleep, and neither of us reached for a phone — just us, talking like before.',
  )
  const after = await ta.evaluate((el) => (el as HTMLTextAreaElement).clientHeight)
  expect(after).toBeGreaterThan(before) // it auto-grew rather than hiding the start in a 44px box
})

test('answer is capped by maxLength', async ({ page }) => {
  const ph = await gotoQuestion(page)
  const ta = ph.getByLabel('Your answer')
  await ta.click()
  await ta.fill('')
  await ta.pressSequentially('x'.repeat(420), { delay: 0 }) // real typing respects maxLength
  const len = (await ta.inputValue()).length
  expect(len).toBe(400)
})

test('a blank answer reveals and reaches the anniversary on the seed plan', async ({ page }) => {
  const ph = await gotoQuestion(page)
  await ph.getByLabel('Your answer').fill('') // cleared → not "dirty" → no AI call, no blank plan
  await ph.locator('[data-demo-action="send"]').click()
  await expect(ph.getByText(HERO.leo)).toBeVisible() // partner answer still reveals
  await ph.locator('[data-demo-action="use-this"]').click()
  await expect(stepOf(ph)).toHaveAttribute('data-demo-step', 'anniversary')
  await expect(ph.getByText(SEED_ANNIVERSARY)).toBeVisible()
})
