// Human-first note: the mobile share-to-play build — one full-bleed phone with a Maya/Leo toggle. Checks
// the perspective toggle and that the scripted Pulse works on the single phone. Mobile only.
import { test, expect } from '@playwright/test'
import { phone } from './helpers'

test.describe('mobile build', () => {
  test('perspective toggle + Pulse', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile build only')
    await page.goto('/')
    await expect(phone(page, 'maya')).toBeVisible() // defaults to Maya

    await page.getByRole('button', { name: "Leo's view" }).click()
    await expect(phone(page, 'leo')).toBeVisible()

    await page.getByRole('button', { name: "Maya's view" }).click()
    const maya = phone(page, 'maya')
    await maya.locator('[data-demo-action="pulse"]').click()
    await expect(maya.getByText('Checked in today')).toBeVisible()
    await expect(maya.getByText('+6 this week')).toBeVisible()
  })
})
