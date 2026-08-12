import { expect, test } from '@playwright/test'

test('shows the intro page as landing page and navigates to dashboard', async ({ page }) => {
  await page.goto('/')

  // Verify intro page content
  await expect(page.getByRole('heading', { name: 'Tierpension Pro' })).toBeVisible()
  await expect(page.getByText('Ein erster Blick auf Tierpension Pro')).toBeVisible()

  // Click "Demo ansehen"
  await page.getByRole('link', { name: 'Demo ansehen' }).click()

  // Verify navigation to dashboard
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { name: 'Tagesübersicht' })).toBeVisible()
})

test('redirects /intro to /', async ({ page }) => {
  await page.goto('/intro')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'Tierpension Pro' })).toBeVisible()
})
