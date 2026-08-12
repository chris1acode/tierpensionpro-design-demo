import { expect, test } from '@playwright/test'

test('shows persisted stay instructions before confirming a check-in', async ({ page }) => {
  await page.goto('/dashboard')

  await page.locator('.arrival-row').filter({ hasText: 'Balu' }).getByRole('button', { name: 'Einchecken' }).click()

  const modal = page.getByRole('dialog', { name: /Check-in für Sofia Berger/ })
  await expect(modal.getByLabel('Operative Hinweise')).toContainText('Hinweis zum Tier')
  await expect(modal.getByLabel('Operative Hinweise')).toContainText('Bitte mit dem gewohnten Futter füttern.')
  await expect(modal.getByLabel('Operative Hinweise')).toContainText('Hinweis zum Aufenthalt')
  await expect(modal.getByLabel('Operative Hinweise')).toContainText('Futterportion liegt beschriftet im Kühlschrank.')
  await expect(modal.getByLabel('Operative Hinweise')).toContainText('Schilddrüsenmedikament: 1 Tablette täglich um 18 Uhr mit dem Abendfutter.')
})
