import { expect, test } from '@playwright/test'

test('only enables account actions for an unsaved account draft', async ({ page }) => {
  await page.goto('/account')

  const save = page.getByRole('button', { name: 'Konto speichern' })
  const discard = page.getByRole('button', { name: 'Änderungen verwerfen' })
  const firstName = page.getByLabel('Vorname')

  await expect(save).toBeDisabled()
  await expect(discard).toBeDisabled()

  await firstName.fill('Alex')
  await expect(save).toBeEnabled()
  await expect(discard).toBeEnabled()

  await discard.click()
  await expect(firstName).toHaveValue('Robin')
  await expect(save).toBeDisabled()
  await expect(discard).toBeDisabled()
})
