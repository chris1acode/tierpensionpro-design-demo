import { expect, test } from '@playwright/test'

test('shows a search-specific empty state when no arrival matches', async ({ page }) => {
  await page.goto('/')

  await page.getByPlaceholder('Tiere, Kunden oder Zimmer suchen …').fill('nichtvorhanden')

  const emptyState = page.locator('.arrivals-panel .empty-state')
  await expect(emptyState).toContainText('Keine Treffer gefunden.')
  await expect(emptyState).not.toContainText('Alle erwarteten Tiere sind angekommen.')
})

test('applies the global dashboard search to departures as well', async ({ page }) => {
  await page.goto('/')

  await page.getByPlaceholder('Tiere, Kunden oder Zimmer suchen …').fill('nichtvorhanden')
  await page.getByRole('button', { name: 'Abreisen' }).click()

  const departures = page.locator('.arrivals-panel')
  await expect(departures.getByText('0 Tiere sind abholbereit')).toBeVisible()
  await expect(departures.locator('.departure-row')).toHaveCount(0)
  await expect(departures.locator('.empty-state')).toContainText('Keine Treffer gefunden.')
})

test('labels the current occupancy as animals in the house', async ({ page }) => {
  await page.goto('/')

  const metrics = page.getByRole('region', { name: 'Tageskennzahlen' })
  await expect(metrics.getByText('Tiere im Haus', { exact: true })).toBeVisible()
  await expect(metrics.getByText('Gäste im Haus', { exact: true })).toHaveCount(0)
})

test('does not show a redundant main-location control', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Hauptstandort', { exact: false })).toHaveCount(0)
  await expect(page.getByText('Inhaberin', { exact: true })).toHaveCount(1)
})

test('focuses the global search with the advertised keyboard shortcut', async ({ page }) => {
  await page.goto('/')

  const search = page.getByPlaceholder('Tiere, Kunden oder Zimmer suchen …')
  await page.keyboard.press('Control+K')

  await expect(search).toBeFocused()
})

test('moves focus into dialogs and closes them with Escape', async ({ page }) => {
  await page.goto('/')

  const trigger = page.getByRole('button', { name: 'Zimmerbelegung ansehen' })
  await trigger.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Dialog schließen' })).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('keeps keyboard focus inside an open dialog', async ({ page }) => {
  await page.goto('/')

  await page.locator('.arrival-row').filter({ hasText: 'Balu' }).getByRole('button', { name: 'Einchecken' }).click()

  const dialog = page.getByRole('dialog')
  const closeButton = dialog.getByRole('button', { name: 'Dialog schließen' })
  const confirmButton = dialog.getByRole('button', { name: 'Jetzt einchecken' })
  await expect(closeButton).toBeFocused()

  await page.keyboard.press('Shift+Tab')
  await expect(confirmButton).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(closeButton).toBeFocused()
})

test('does not move focus behind an open dialog with the global search shortcut', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Zimmerbelegung ansehen' }).click()
  const closeButton = page.getByRole('dialog').getByRole('button', { name: 'Dialog schließen' })
  await expect(closeButton).toBeFocused()

  await page.keyboard.press('Control+K')

  await expect(closeButton).toBeFocused()
})

test('only exposes the mobile navigation while its drawer is open', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'The desktop navigation is permanently visible.')
  await page.goto('/')

  const navigation = page.getByRole('navigation', { name: 'Hauptnavigation' })
  await expect(navigation).toBeHidden()

  await page.getByRole('button', { name: 'Navigation öffnen' }).click()
  await expect(navigation).toBeVisible()

  await page.getByRole('button', { name: 'Navigation schließen' }).click()
  await expect(navigation).toBeHidden()
})

test('moves focus into the mobile navigation and closes it with Escape', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'The desktop navigation is permanently visible.')
  await page.goto('/')

  const trigger = page.getByRole('button', { name: 'Navigation öffnen' })
  await trigger.click()

  const closeButton = page.getByRole('button', { name: 'Navigation schließen' })
  await expect(closeButton).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('keeps keyboard focus inside the mobile navigation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'The desktop navigation is not a modal drawer.')
  await page.goto('/')

  await page.getByRole('button', { name: 'Navigation öffnen' }).click()

  const drawer = page.getByRole('dialog', { name: 'Seitennavigation' })
  const closeButton = drawer.getByRole('button', { name: 'Navigation schließen' })
  const firstLink = drawer.getByRole('link', { name: 'Tierpension Pro' })
  const lastLink = drawer.getByRole('link', { name: 'Einstellungen' })
  await expect(closeButton).toBeFocused()

  await page.keyboard.press('Shift+Tab')
  await expect(firstLink).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(lastLink).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(firstLink).toBeFocused()
})

test('does not move focus behind the mobile navigation with the global search shortcut', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'The desktop navigation is not a modal drawer.')
  await page.goto('/')

  await page.getByRole('button', { name: 'Navigation öffnen' }).click()
  const closeButton = page.getByRole('button', { name: 'Navigation schließen' })
  await expect(closeButton).toBeFocused()

  await page.keyboard.press('Control+K')

  await expect(closeButton).toBeFocused()
})

test('gives the customer directory two thirds of the desktop content width', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'The customer page stacks both panels on mobile.')
  await page.goto('/kunden-tiere')

  const directory = await page.locator('.customer-directory').boundingBox()
  const details = await page.locator('.customer-details').boundingBox()

  expect(directory).not.toBeNull()
  expect(details).not.toBeNull()
  expect(directory!.width / details!.width).toBeGreaterThan(1.9)
  expect(directory!.width / details!.width).toBeLessThan(2.1)
})

test('pages through the complete customer mock data', async ({ page }) => {
  await page.goto('/kunden-tiere')

  await expect(page.getByText('12 Kund:innen', { exact: true })).toBeVisible()
  await expect(page.locator('.customer-list button')).toHaveCount(5)
  await page.getByRole('button', { name: 'Nächste Seite' }).click()
  await expect(page.getByRole('button', { name: '2', exact: true })).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.customer-list')).toContainText('Johanna Neumann')

  await page.getByPlaceholder('Name, Tier oder Rasse suchen …').fill('Minou')
  await expect(page.getByText('1 Treffer', { exact: true })).toBeVisible()
  await expect(page.locator('.customer-list')).toContainText('Clara Vogel')
  await expect(page.getByRole('navigation', { name: 'Seiten im Kundenverzeichnis' })).toHaveCount(0)
})

test('uses a master-detail flow for customers on small screens', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'The desktop layout shows directory and details side by side.')
  await page.goto('/kunden-tiere')

  await expect(page.locator('.customer-directory')).toBeVisible()
  await expect(page.locator('.customer-details')).toBeHidden()

  await page.getByRole('button', { name: /Sofia Berger/ }).click()

  await expect(page.locator('.customer-directory')).toBeHidden()
  await expect(page.locator('.customer-details')).toBeVisible()
  await expect(page.locator('.customer-details')).toContainText('Sofia Berger')

  await page.getByRole('button', { name: 'Zurück zum Kundenverzeichnis' }).click()
  await expect(page.locator('.customer-directory')).toBeVisible()
  await expect(page.locator('.customer-details')).toBeHidden()
})

test('completes a check-in from the check-in/out page', async ({ page }) => {
  await page.goto('/check-in-out')

  await expect(page.getByRole('heading', { name: 'Check-in/out' })).toBeVisible()
  await expect(page.getByText('3 offen', { exact: true })).toBeVisible()
  await page.locator('.operation-row').filter({ hasText: 'Balu' }).getByRole('button', { name: 'Einchecken' }).click()
  await expect(page.getByRole('dialog')).toContainText('Balu')
  await page.getByRole('dialog').getByRole('button', { name: 'Jetzt einchecken' }).click()

  await expect(page.locator('.operation-row').filter({ hasText: 'Balu' })).toHaveCount(0)
  await expect(page.getByText('2 offen', { exact: true })).toBeVisible()
})

test('creates a booking through its customer and pet relationship', async ({ page }) => {
  await page.goto('/buchungen')
  await page.getByRole('button', { name: 'Neue Buchung' }).click()

  const form = page.locator('.booking-form')
  const petSelect = form.getByLabel('Tier')
  await expect(petSelect).toBeDisabled()

  await form.getByLabel('Kund:in').selectOption({ label: 'Lea Albrecht' })
  await expect(petSelect).toBeEnabled()
  await expect(petSelect.locator('option')).toHaveText(['Tier auswählen', 'Frieda · Havaneser'])
  await petSelect.selectOption({ label: 'Frieda · Havaneser' })
  await form.getByLabel('Zimmer').selectOption({ label: 'Gartenzimmer 2 · 2 Plätze' })
  await form.getByLabel('Abreise').fill('2026-08-18')
  await form.getByRole('button', { name: 'Buchung anlegen' }).click()

  const booking = page.locator('.booking-table article').filter({ hasText: 'Frieda' }).filter({ hasText: '2026-08-18' })
  await expect(booking).toContainText('Lea Albrecht')
  await expect(booking).toContainText('Gartenzimmer 2')
})
