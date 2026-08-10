import { expect, test } from '@playwright/test'

test('only enables settings actions for changed persistent data', async ({ page }) => {
  await page.goto('/einstellungen')

  const save = page.getByRole('button', { name: 'Einstellungen speichern' })
  const discard = page.getByRole('button', { name: 'Änderungen verwerfen' })
  const businessName = page.getByLabel('Name der Pension')

  await expect(save).toBeDisabled()
  await expect(discard).toBeDisabled()

  await businessName.fill('Tierpension Pro am See')
  await expect(save).toBeEnabled()
  await expect(discard).toBeEnabled()

  await discard.click()
  await expect(businessName).toHaveValue('Tierpension Pro')
  await expect(save).toBeDisabled()
  await expect(discard).toBeDisabled()
})
