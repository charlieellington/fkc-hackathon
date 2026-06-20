// Human-first note: the projected demo — the two-phone desktop stage. Runs the whole scripted flow and
// checks each tap produces a visible result (a dead click would fail the next assertion). Desktop only.
import { test, expect } from '@playwright/test'
import { phone, stepOf, begin, HERO } from './helpers'

test.describe('desktop presentation', () => {
  test('runs the scripted flow end to end', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'desktop stage only')
    await page.goto('/')
    await begin(page)
    const maya = phone(page, 'maya')
    const leo = phone(page, 'leo')
    await expect(maya).toBeVisible()
    await expect(leo).toBeVisible()
    await expect(stepOf(maya)).toHaveAttribute('data-demo-step', 'today')

    // Pulse — the only thing that moves the score (trend +4 → +6), collapses to a confirmation.
    await maya.locator('[data-demo-action="pulse"]').click()
    await expect(maya.getByText('Checked in today')).toBeVisible()
    await expect(maya.getByText('+6 this week')).toBeVisible()

    // Spark → After Dark → Question (beats auto-advance; the next click auto-waits).
    await maya.locator('[data-demo-action="spark-done"]').click()
    await maya.locator('[data-demo-action="afterdark"]').click()
    await expect(stepOf(maya)).toHaveAttribute('data-demo-step', 'question')

    // The answer is now editable on the projector too.
    await expect(maya.getByLabel('Your answer')).toBeEditable()

    // Send → reveal the partner's verbatim answer (Leo's, on Maya's phone).
    await maya.locator('[data-demo-action="send"]').click()
    await expect(maya.getByText(HERO.leo)).toBeVisible()

    // Through the reveal hold to the anniversary, then close on the grown flame + final score.
    await maya.locator('[data-demo-action="use-this"]').click()
    await maya.locator('[data-demo-action="set-reminder"]').click()
    await expect(stepOf(maya)).toHaveAttribute('data-demo-step', 'close')
    await expect(maya.getByText('84')).toBeVisible()
  })
})
