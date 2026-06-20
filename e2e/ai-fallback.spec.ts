// Human-first note: under plain `npm run dev` the /api routes don't exist, so an EDITED answer's live
// plan can't load — the aiSwap safety net must catch that and fall back to the seed without ever throwing
// or breaking the flow. (Live AI is verified separately under `vercel dev` — see the note at the bottom.)
import { test, expect } from '@playwright/test'
import { gotoQuestion, stepOf, HERO, SEED_ANNIVERSARY } from './helpers'

test('edited answer falls back to the seed plan with no uncaught errors', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (e) => pageErrors.push(String(e)))

  const ph = await gotoQuestion(page)
  await ph.getByLabel('Your answer').fill('We watched the storm roll in from the balcony with cocoa.')
  await ph.locator('[data-demo-action="send"]').click()

  await expect(ph.getByText(HERO.leo)).toBeVisible() // reveal still happens
  await ph.locator('[data-demo-action="use-this"]').click()
  await expect(stepOf(ph)).toHaveAttribute('data-demo-step', 'anniversary')
  await expect(ph.getByText(SEED_ANNIVERSARY)).toBeVisible() // /api 404 → seed kept

  await ph.locator('[data-demo-action="set-reminder"]').click()
  await expect(stepOf(ph)).toHaveAttribute('data-demo-step', 'close')

  expect(pageErrors).toEqual([]) // the failed fetch is swallowed; nothing crashes the app
})

// LIVE-AI VARIANT (not run by default): start the app with `vercel dev` (serves /api with a real
// ANTHROPIC_API_KEY), point baseURL at it, gate with `test.skip(!process.env.LIVE_AI)`, edit the answer,
// Send, and assert the anniversary body is NOT `SEED_ANNIVERSARY` (the live plan swapped in within ~2.5s).
