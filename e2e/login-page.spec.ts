import { expect, test } from '@playwright/test'

test('shows the login page as landing page with prefilled demo credentials', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Anmelden' })).toBeVisible()
  await expect(page.getByLabel('E-Mail-Adresse')).toHaveValue('robin@muster.de')
  await expect(page.getByLabel('Passwort')).toHaveValue('123')

  await page.getByRole('button', { name: 'Anmelden' }).click()

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { name: 'Tagesübersicht' })).toBeVisible()
})

test('redirects /intro and /login to /', async ({ page }) => {
  await page.goto('/intro')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'Anmelden' })).toBeVisible()

  await page.goto('/login')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'Anmelden' })).toBeVisible()
})
