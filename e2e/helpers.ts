// Human-first note: shared Playwright helpers. The Nami app has no router and renders the SAME phone
// markup more than once (two phones on desktop; a hidden copy of the other breakpoint) — so we always
// target the VISIBLE phone for a perspective, and we click through the desktop "Tap to begin" curtain
// when it's present (mobile never shows it).
import { expect, type Page, type Locator } from '@playwright/test'

// Distinctive substrings of each person's verbatim hero answer (shown on the PARTNER's phone).
export const HERO = {
  leo: 'I felt like us again', // Leo's hero → revealed on Maya's phone
  maya: 'your hand in mine', //   Maya's hero → revealed on Leo's phone
}
export const SEED_ANNIVERSARY = 'Recreate Sunday coffee' // the seed plan (used when offline / not edited)

// The visible phone for a perspective — works on desktop (two phones) and mobile (one phone).
export function phone(page: Page, perspective: 'maya' | 'leo' = 'maya'): Locator {
  return page.locator(`[data-perspective="${perspective}"]:visible`).first()
}

export function stepOf(ph: Locator): Locator {
  return ph.locator('[data-demo-step]')
}

// Desktop opens on a "Tap to begin" curtain (then the phones drop in ~3s later); mobile skips it.
export async function begin(page: Page) {
  const b = page.getByRole('button', { name: 'Begin the presentation' })
  if (await b.isVisible().catch(() => false)) await b.click()
}

// Drive the scripted flow from a fresh load to the Question beat (auto-advances carry us between beats;
// clicking the next action auto-waits for it, so no fixed sleeps are needed).
export async function gotoQuestion(page: Page, perspective: 'maya' | 'leo' = 'maya') {
  await page.goto('/')
  await begin(page)
  const ph = phone(page, perspective)
  await ph.locator('[data-demo-action="pulse"]').click()
  await ph.locator('[data-demo-action="spark-done"]').click()
  await ph.locator('[data-demo-action="afterdark"]').click()
  await expect(stepOf(ph)).toHaveAttribute('data-demo-step', 'question')
  return ph
}
