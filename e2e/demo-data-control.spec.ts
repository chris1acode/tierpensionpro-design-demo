import { expect, test } from '@playwright/test'

test('highlights the demo data control in blue outside the product theme', async ({ page }) => {
  await page.goto('/bookings')

  const trigger = page.getByRole('button', { name: 'Demodaten-Menü öffnen' })
  await expect(trigger).toHaveCSS('background-color', 'rgb(225, 240, 255)')
  await expect(trigger).toHaveCSS('color', 'rgb(24, 75, 124)')
})
