import { expect, test } from '@playwright/test'

test('opens the global demo data menu and restores its mock scenario', async ({ page }) => {
  await page.goto('/buchungen')

  const trigger = page.getByRole('button', { name: 'Demodaten-Menü öffnen' })
  await expect(trigger).toBeVisible()
  await trigger.click()

  await expect(page.getByRole('complementary', { name: 'Demodaten-Steuerung' })).toContainText('Tierpension Sonnenhof')
  await expect(page.getByText('Zurücksetzungen').locator('..')).toContainText('0')
  await page.getByRole('button', { name: 'Ausgangsdaten wiederherstellen' }).click()
  await expect(page.getByText('Zurücksetzungen').locator('..')).toContainText('1')
})

test('keeps the demo data control clear of dashboard actions', async ({ page }) => {
  await page.goto('/')

  const demoControl = page.getByRole('button', { name: 'Demodaten-Menü öffnen' })
  const occupancyAction = page.getByRole('link', { name: /Belegung planen/ })
  const [demoBox, actionBox] = await Promise.all([demoControl.boundingBox(), occupancyAction.boundingBox()])

  expect(demoBox).not.toBeNull()
  expect(actionBox).not.toBeNull()
  expect(demoBox!.x + demoBox!.width <= actionBox!.x || actionBox!.x + actionBox!.width <= demoBox!.x
    || demoBox!.y + demoBox!.height <= actionBox!.y || actionBox!.y + actionBox!.height <= demoBox!.y).toBeTruthy()

  await occupancyAction.click()
  await expect(page).toHaveURL(/\/belegung$/)
})

test('keeps the booking customer suggestions above the booking panel instead of clipping them', async ({ page }) => {
  await page.goto('/buchungen')
  await page.getByRole('button', { name: 'Neue Buchung' }).click()

  const customerSearch = page.getByRole('combobox', { name: 'Kund:in' })
  await customerSearch.fill('Lea')

  const suggestions = page.getByRole('listbox', { name: 'Kund:in-Vorschläge' })
  await expect(suggestions).toBeVisible()
  await expect(suggestions.getByRole('option', { name: /Lea Albrecht/ })).toBeVisible()
  await expect(page.locator('.booking-form-panel')).toHaveCSS('overflow-y', 'visible')
})

test('waits for two characters before showing customer suggestions in a new booking', async ({ page }) => {
  await page.goto('/buchungen')
  await page.getByRole('button', { name: 'Neue Buchung' }).click()

  const customerSearch = page.getByRole('combobox', { name: 'Kund:in' })
  const suggestions = page.getByRole('listbox', { name: 'Kund:in-Vorschläge' })
  await customerSearch.focus()
  await expect(suggestions).toContainText('2 Zeichen eingeben, um Kundschaft zu suchen.')
  await expect(suggestions.getByRole('option')).toHaveCount(0)

  await customerSearch.fill('L')
  await expect(suggestions).toContainText('2 Zeichen eingeben, um Kundschaft zu suchen.')
  await expect(suggestions.getByRole('option')).toHaveCount(0)

  await customerSearch.fill('Le')
  await expect(suggestions.getByRole('option', { name: /Lea Albrecht/ })).toBeVisible()
})

test('exports the data behind every list as CSV', async ({ page }) => {
  const exports = [
    ['/buchungen', 'Buchungen als CSV exportieren', 'buchungen.csv'],
    ['/kunden-tiere', 'Kunden und Tiere als CSV exportieren', 'kunden-und-tiere.csv'],
    ['/check-in-out', 'Aktuelle Vorgänge als CSV exportieren', 'anreisen.csv'],
    ['/check-in-out', 'Check-in-out-Verlauf als CSV exportieren', 'check-in-out-verlauf.csv'],
    ['/anfragen', 'Offene Anfragen als CSV exportieren', 'offene-anfragen.csv'],
    ['/anfragen', 'Anfragenverlauf als CSV exportieren', 'anfragen-verlauf.csv'],
    ['/belegung', 'Belegung als CSV exportieren', 'belegung-2026-08-09.csv']
  ] as const

  for (const [path, buttonName, fileName] of exports) {
    await page.goto(path)
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: buttonName }).click()
    await expect((await downloadPromise).suggestedFilename()).toBe(fileName)
  }
})

test('moves focus into the demo data menu and restores it after Escape', async ({ page }) => {
  await page.goto('/')

  const trigger = page.getByRole('button', { name: 'Demodaten-Menü öffnen' })
  await trigger.click()

  const closeButton = page.getByRole('button', { name: 'Demodaten-Menü schließen' })
  await expect(closeButton).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(closeButton).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('resets open settings and account form drafts with the demo data', async ({ page }) => {
  await page.goto('/einstellungen')

  const businessName = page.getByLabel('Name der Pension')
  await businessName.fill('Zwischenstand Pension')
  await page.getByRole('button', { name: 'Einstellungen speichern' }).click()
  await expect(businessName).toHaveValue('Zwischenstand Pension')

  await page.getByRole('button', { name: 'Demodaten-Menü öffnen' }).click()
  await page.getByRole('button', { name: 'Ausgangsdaten wiederherstellen' }).click()
  await expect(businessName).toHaveValue('Tierpension Pro')

  await page.goto('/konto')
  const firstName = page.getByLabel('Vorname')
  await firstName.fill('Zwischenstand')
  await page.getByRole('button', { name: 'Konto speichern' }).click()
  await expect(firstName).toHaveValue('Zwischenstand')

  await page.getByRole('button', { name: 'Demodaten-Menü öffnen' }).click()
  await page.getByRole('button', { name: 'Ausgangsdaten wiederherstellen' }).click()
  await expect(firstName).toHaveValue('Robin')
})

test('shows a search-specific empty state when no arrival matches', async ({ page }) => {
  await page.goto('/')

  await page.getByPlaceholder('Tiere, Kunden oder Zimmer suchen …').fill('nichtvorhanden')

  const emptyState = page.locator('.arrivals-panel .empty-state')
  await expect(emptyState).toContainText('Keine Treffer gefunden.')
  await expect(emptyState).not.toContainText('Alle erwarteten Tiere sind angekommen.')
})

test('exposes the global search with a meaningful accessible name', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('searchbox', { name: 'Globale Suche' })).toBeVisible()
})

test('aligns arrival metadata and check-in actions despite optional arrival notes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Mobile actions intentionally span the complete row.')
  await page.goto('/')

  const baluAction = page.locator('.arrival-row').filter({ hasText: 'Balu' }).getByRole('button', { name: 'Einchecken' })
  const miloAction = page.locator('.arrival-row').filter({ hasText: 'Milo' }).getByRole('button', { name: 'Einchecken' })

  await expect(baluAction).toBeVisible()
  await expect(miloAction).toBeVisible()

  const baluMeta = page.locator('.arrival-row').filter({ hasText: 'Balu' }).locator('.arrival-meta')
  const miloMeta = page.locator('.arrival-row').filter({ hasText: 'Milo' }).locator('.arrival-meta')
  const [baluBox, miloBox, baluMetaBox, miloMetaBox] = await Promise.all([
    baluAction.boundingBox(), miloAction.boundingBox(), baluMeta.boundingBox(), miloMeta.boundingBox()
  ])
  expect(baluBox?.x).toBe(miloBox?.x)
  expect(baluMetaBox?.x).toBe(miloMetaBox?.x)
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

test('navigates from dashboard category widgets to their detail pages', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Anreisen heute in Check-in und Check-out öffnen' }).click()
  await expect(page).toHaveURL(/\/check-in-out$/)
  await expect(page.getByRole('heading', { name: 'Check-in/out' })).toBeVisible()

  await page.goto('/')
  await page.getByRole('link', { name: 'Tiere im Haus in der Belegung öffnen' }).click()
  await expect(page).toHaveURL(/\/belegung$/)
  await expect(page.getByRole('heading', { name: 'Belegung' })).toBeVisible()

  await page.goto('/')
  await page.getByRole('link', { name: 'Alle Check-ins und Check-outs' }).click()
  await expect(page).toHaveURL(/\/check-in-out$/)

  await page.goto('/')
  await page.getByRole('link', { name: 'Belegung planen' }).click()
  await expect(page).toHaveURL(/\/belegung$/)
})

test('navigates the occupancy period from an explicit start date', async ({ page }, testInfo) => {
  await page.goto('/belegung')

  const startDate = page.getByRole('textbox', { name: 'Start' })
  await expect(startDate).toHaveValue('2026-08-09')
  const visibleWeekday = testInfo.project.name === 'mobile'
    ? page.getByRole('region', { name: 'Zimmer pro Tag' }).getByText('So · 09.08.', { exact: true })
    : page.getByText('So', { exact: true }).first()
  await expect(visibleWeekday).toBeVisible()

  await page.getByRole('button', { name: 'Eine Woche vor' }).click()
  await expect(startDate).toHaveValue('2026-08-16')

  await startDate.fill('2026-09-01')
  await startDate.press('Tab')
  await expect(startDate).toHaveValue('2026-09-01')
  const visibleTuesday = testInfo.project.name === 'mobile'
    ? page.getByRole('region', { name: 'Zimmer pro Tag' }).getByText('Di · 01.09.', { exact: true })
    : page.getByText('Di', { exact: true }).first()
  await expect(visibleTuesday).toBeVisible()

  await page.getByRole('button', { name: 'Heute' }).click()
  await expect(startDate).toHaveValue('2026-08-09')
})

test('provides an adequately sized today action in occupancy date navigation', async ({ page }) => {
  await page.goto('/belegung')

  const todayButton = page.getByRole('button', { name: 'Heute' })
  const box = await todayButton.boundingBox()

  expect(box).not.toBeNull()
  expect(box!.width).toBeGreaterThanOrEqual(92)
  expect(box!.height).toBeGreaterThanOrEqual(40)
})

test('records closure periods and removes all capacity for their dates', async ({ page }, testInfo) => {
  await page.goto('/belegung')

  await page.getByLabel('Schließzeit von').fill('2026-08-10')
  await page.getByLabel('Schließzeit bis').fill('2026-08-10')
  await page.getByLabel('Hinweis zur Schließzeit').fill('Betriebsferien')
  await page.getByRole('button', { name: 'Schließzeit hinterlegen' }).click()

  await expect(page.getByText('Betriebsferien', { exact: true })).toBeVisible()
  const occupancyView = testInfo.project.name === 'mobile'
    ? page.getByRole('region', { name: 'Zimmer pro Tag' })
    : page.locator('.occupancy-panel-wide')
  await expect(occupancyView).toContainText(testInfo.project.name === 'mobile' ? 'Geschlossen' : 'Zu')

  await page.getByRole('button', { name: /Schließzeit 10\.08\. entfernen/ }).click()
  await expect(page.getByText('Betriebsferien', { exact: true })).toHaveCount(0)
})

test('does not offer rooms for requests that overlap a closure', async ({ page }) => {
  await page.goto('/belegung')

  await page.getByLabel('Schließzeit von').fill('2026-08-17')
  await page.getByLabel('Schließzeit bis').fill('2026-08-20')
  await page.getByRole('button', { name: 'Schließzeit hinterlegen' }).click()

  await page.getByRole('link', { name: 'Anfragen', exact: true }).click()
  await expect(page).toHaveURL(/\/anfragen$/)
  const request = page.locator('.request-card').filter({ hasText: 'Hannah Wolf' })
  const roomSelection = request.getByRole('combobox', { name: 'Zimmer für Anfrage von Hannah Wolf' })
  await expect(roomSelection.locator('option')).toHaveCount(1)
  await expect(roomSelection).toContainText('Zimmer wählen')
})

test('uses a vertically readable occupancy list on small screens', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'The room-by-day matrix remains the desktop presentation.')
  await page.goto('/belegung')

  const mobileOccupancy = page.getByRole('region', { name: 'Zimmer pro Tag' })
  await expect(mobileOccupancy).toBeVisible()
  await expect(mobileOccupancy.getByText('So · 09.08.', { exact: true })).toBeVisible()
  await expect(mobileOccupancy.getByText('Waldzimmer 1', { exact: true }).first()).toBeVisible()
  await expect(page.locator('.occupancy-panel-wide')).toBeHidden()

  const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width)
})

test('creates a reservation from the occupancy view after checking its period capacity', async ({ page }) => {
  await page.goto('/belegung')

  await page.getByRole('button', { name: 'Reservierung anlegen' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { name: 'Reservierung anlegen' })).toBeVisible()
  await expect(dialog).toContainText('Wähle mindestens ein Tier und den Zeitraum, um freie Zimmer zu prüfen.')

  await dialog.getByRole('combobox', { name: 'Kund:in' }).fill('Lea')
  await dialog.getByRole('option', { name: /Lea Albrecht/ }).click()
  await dialog.getByText('Frieda · Havaneser', { exact: true }).click()
  await dialog.getByText('Willi · Havaneser', { exact: true }).click()
  await dialog.getByLabel('Anreise').fill('2026-08-15')
  await dialog.getByLabel('Abreise').fill('2026-08-18')
  await expect(dialog).toContainText(/passende Zimmer sind im gesamten Zeitraum frei\./)

  await dialog.getByLabel('Zimmer').selectOption('r-2')
  await dialog.getByRole('button', { name: 'Reservieren' }).click()
  await expect(dialog).toHaveCount(0)
})

test('shows occupancy as compact capacities without animal identities', async ({ page }, testInfo) => {
  await page.goto('/belegung')

  await expect(page.locator('.occupancy-capacity-summary')).toHaveCount(0)
  const occupancyView = testInfo.project.name === 'mobile'
    ? page.getByRole('region', { name: 'Zimmer pro Tag' })
    : page.locator('.occupancy-panel-wide')
  await expect(occupancyView).toContainText(/\d+\/\d+/)
  await expect(occupancyView.getByText('Balu', { exact: true })).toHaveCount(0)
})

test('marks fully occupied days and rooms with their own capacity colour', async ({ page }, testInfo) => {
  await page.goto('/belegung')

  const fullDay = testInfo.project.name === 'mobile'
    ? page.locator('.mobile-occupancy-day[data-date="2026-08-10"]')
    : page.locator('.occupancy-day-header[data-date="2026-08-10"]')
  await expect(fullDay).toHaveAttribute('data-occupancy-level', 'full')
  await expect(fullDay).toHaveClass(/full/)

  if (testInfo.project.name !== 'mobile') {
    const fullRoom = page.locator('.occupancy-cell[data-date="2026-08-10"][data-occupancy-level="full"]').first()
    await expect(fullRoom).toHaveClass(/full/)
    await expect(fullRoom).toHaveCSS('background-color', 'rgb(238, 241, 250)')
  }
})

test('does not show a redundant main-location control', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Hauptstandort', { exact: false })).toHaveCount(0)
  await expect(page.getByText('Inhaber', { exact: true })).toHaveCount(1)
})

test('focuses the global search with the advertised keyboard shortcut', async ({ page }) => {
  await page.goto('/')

  const search = page.getByPlaceholder('Tiere, Kunden oder Zimmer suchen …')
  await page.keyboard.press('Control+K')

  await expect(search).toBeFocused()
})

test('moves focus into dialogs and closes them with Escape', async ({ page }) => {
  await page.goto('/')

  const trigger = page.getByRole('button', { name: 'Zimmerstatus verwalten' })
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

  await page.getByRole('button', { name: 'Zimmerstatus verwalten' }).click()
  const closeButton = page.getByRole('dialog').getByRole('button', { name: 'Dialog schließen' })
  await expect(closeButton).toBeFocused()

  await page.keyboard.press('Control+K')

  await expect(closeButton).toBeFocused()
})

test('does not move focus behind the account cancellation dialog with the global search shortcut', async ({ page }) => {
  await page.goto('/konto')

  await page.getByRole('button', { name: 'Pension kündigen' }).click()
  const closeButton = page.getByRole('dialog').getByRole('button', { name: 'Dialog schließen' })
  await expect(closeButton).toBeFocused()

  await page.keyboard.press('Control+K')

  await expect(closeButton).toBeFocused()
})

test('separates account actions clearly from the cancellation area', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'The desktop spacing is covered by this layout regression test.')
  await page.goto('/konto')

  const saveButton = page.getByRole('button', { name: 'Konto speichern' })
  const cancellationPanel = page.locator('.account-page .danger-zone')
  const [saveBox, panelBox] = await Promise.all([saveButton.boundingBox(), cancellationPanel.boundingBox()])

  expect(saveBox).not.toBeNull()
  expect(panelBox).not.toBeNull()
  expect(panelBox!.y - (saveBox!.y + saveBox!.height)).toBeGreaterThanOrEqual(28)
})

test('shows bookings in a filterable monthly calendar alongside the list', async ({ page }) => {
  await page.goto('/buchungen')

  await page.getByRole('button', { name: 'Kalenderansicht' }).click()
  const calendar = page.getByLabel('Buchungskalender')
  await expect(calendar).toBeVisible()
  await expect(calendar).toContainText('Balu')

  await page.getByRole('button', { name: 'Eingecheckt' }).click()
  await expect(calendar).toContainText('Rocky')
  await expect(calendar).not.toContainText('Balu')

  await page.getByRole('button', { name: 'Nächster Monat' }).click()
  await expect(page.locator('.booking-calendar-navigation')).toContainText('September 2026')
  await expect(page.getByRole('button', { name: 'Listenansicht' })).toBeVisible()
})

test('pages the booking list in groups of ten and resets for a search', async ({ page }) => {
  await page.goto('/buchungen')

  const bookings = page.locator('.booking-table article')
  const pagination = page.getByRole('navigation', { name: 'Seiten in der Buchungsliste' })
  await expect(bookings).toHaveCount(10)
  await expect(pagination).toContainText('Seite 1 von')
  await expect(pagination.getByRole('button', { name: 'Vorherige Seite' })).toBeDisabled()
  const firstPageContent = await bookings.allTextContents()

  await pagination.getByRole('button', { name: 'Nächste Seite' }).click()
  await expect(bookings).toHaveCount(10)
  expect(await bookings.first().innerText()).not.toBe(firstPageContent[0])
  await expect(pagination).toContainText('Seite 2 von')

  await page.getByPlaceholder('Tier, Kunde oder Zimmer suchen …').fill('Balu')
  await expect(bookings).toHaveCount(1)
  await expect(bookings).toContainText('Balu')
  await expect(pagination).toHaveCount(0)
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
  const lastLink = drawer.getByRole('link', { name: 'Zu den Kontoeinstellungen' })
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

  await expect(page.getByText('100 Kund:innen', { exact: true })).toBeVisible()
  await expect(page.locator('.customer-list button')).toHaveCount(5)
  await page.getByRole('button', { name: 'Nächste Seite' }).click()
  await expect(page.getByRole('button', { name: '2', exact: true })).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.customer-list button')).toHaveCount(5)

  await page.getByPlaceholder('Name, Tier oder Rasse suchen …').fill('Minou')
  await expect(page.getByText('1 Treffer', { exact: true })).toBeVisible()
  await expect(page.locator('.customer-list')).toContainText('Clara Vogel')
  await expect(page.getByRole('navigation', { name: 'Seiten im Kundenverzeichnis' })).toHaveCount(0)
})

test('keeps customer pagination within the directory on small screens', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'The pagination only needs compaction on small screens.')
  await page.goto('/kunden-tiere')

  const pagination = page.getByRole('navigation', { name: 'Seiten im Kundenverzeichnis' })
  await expect(pagination).toBeVisible()
  await expect(pagination.locator('button')).toHaveCount(7)

  const dimensions = await pagination.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
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
  await expect(page.getByText('6 offen', { exact: true })).toBeVisible()
  await page.locator('.operation-row').filter({ hasText: 'Balu' }).getByRole('button', { name: 'Einchecken' }).click()
  await expect(page.getByRole('dialog')).toContainText('Balu')
  await page.getByRole('dialog').getByRole('button', { name: 'Jetzt einchecken' }).click()

  await expect(page.locator('.operation-row').filter({ hasText: 'Balu' })).toHaveCount(0)
  await expect(page.getByText('5 offen', { exact: true })).toBeVisible()
  const latestEvent = page.locator('.history-rows article').first()
  await expect(latestEvent).toContainText('Sofia Berger')
  await expect(latestEvent).toContainText('Balu · Waldzimmer 1')
  await expect(latestEvent).toContainText('Eingecheckt')
  await latestEvent.getByRole('button', { name: 'Rückgängig' }).click()

  await expect(page.locator('.operation-row').filter({ hasText: 'Balu' })).toHaveCount(1)
  await expect(page.getByText('6 offen', { exact: true })).toBeVisible()
  await expect(page.locator('.history-rows article').first()).toContainText('Check-in zurückgenommen')

  await page.locator('.history-rows article').first().getByRole('link', { name: 'Zur Buchung' }).click()
  await expect(page).toHaveURL(/\/buchungen\?bookingId=b-1/)
  await expect(page.locator('#booking-b-1')).toHaveClass(/focused-booking/)
  await expect(page.locator('.booking-table article')).toHaveCount(1)
})

test('selects the operational day for check-in and check-out tasks', async ({ page }) => {
  await page.goto('/check-in-out')

  const date = page.getByRole('textbox', { name: 'Datum für Check-in und Check-out' })
  await expect(date).toHaveValue('2026-08-09')
  await expect(page.locator('.operation-row').filter({ hasText: 'Balu' })).toBeVisible()

  await page.getByRole('button', { name: 'Einen Tag vor' }).click()
  await expect(date).toHaveValue('2026-08-10')
  await expect(page.locator('.operation-row').filter({ hasText: 'Balu' })).toHaveCount(0)
  await expect(page.locator('.operation-row')).not.toHaveCount(0)

  await date.fill('2026-08-09')
  await date.press('Tab')
  await expect(page.locator('.operation-row').filter({ hasText: 'Balu' })).toBeVisible()

  await page.getByRole('button', { name: 'Einen Tag zurück' }).click()
  await expect(date).toHaveValue('2026-08-08')
  await page.getByRole('button', { name: 'Heute' }).click()
  await expect(date).toHaveValue('2026-08-09')
})

test('pages the check-in/out history in groups of five entries', async ({ page }) => {
  await page.goto('/check-in-out')

  const history = page.locator('.history-rows')
  const pagination = page.getByRole('navigation', { name: 'Seiten im Check-in-out-Verlauf' })
  await expect(history.locator('article')).toHaveCount(5)
  const firstPageContent = await history.innerText()
  await expect(pagination).toContainText('Seite 1 von 3')
  await expect(pagination.getByRole('button', { name: 'Vorherige Seite' })).toBeDisabled()

  await pagination.getByRole('button', { name: 'Nächste Seite' }).click()
  await expect(history.locator('article')).toHaveCount(5)
  await expect(history).not.toHaveText(firstPageContent)
  await expect(pagination).toContainText('Seite 2 von 3')

  await pagination.getByRole('button', { name: 'Nächste Seite' }).click()
  await expect(history.locator('article')).toHaveCount(3)
  await expect(pagination.getByRole('button', { name: 'Nächste Seite' })).toBeDisabled()
})

test('creates a booking through its customer and pet relationship', async ({ page }) => {
  await page.goto('/buchungen')
  await page.getByRole('button', { name: 'Neue Buchung' }).click()

  const form = page.locator('.booking-form')
  await expect(form.getByRole('group', { name: 'Tiere' })).toContainText('Zuerst Kund:in wählen')

  await form.getByRole('combobox', { name: 'Kund:in' }).fill('Lea')
  await expect(form.getByRole('option', { name: /Lea Albrecht/ })).toBeVisible()
  await form.getByRole('combobox', { name: 'Kund:in' }).press('Enter')
  const friedasChoice = form.getByRole('checkbox', { name: 'Frieda · Havaneser' })
  await expect(friedasChoice).toBeEnabled()
  await expect(form.getByRole('checkbox', { name: 'Willi · Havaneser' })).toBeVisible()
  await friedasChoice.check()
  await form.getByLabel('Zimmer').selectOption({ label: 'Gartenzimmer 2 · 2 Plätze' })
  await form.getByLabel('Abreise').fill('2026-08-18')
  await form.getByRole('button', { name: 'Buchung anlegen' }).click()

  const booking = page.locator('.booking-table article').filter({ hasText: 'Frieda' }).filter({ hasText: '2026-08-18' })
  await expect(booking).toContainText('Lea Albrecht')
  await expect(booking).toContainText('Gartenzimmer 2')
})

test('only offers rooms with free capacity for the selected stay', async ({ page }) => {
  await page.goto('/buchungen')
  await page.getByRole('button', { name: 'Neue Buchung' }).click()

  const form = page.locator('.booking-form')
  await form.getByRole('combobox', { name: 'Kund:in' }).fill('Tobias')
  await form.getByRole('option', { name: /Tobias Bauer/ }).click()
  await form.getByRole('checkbox', { name: 'Simba · Maine Coon' }).check()
  await form.getByLabel('Anreisedatum').fill('2026-08-10')
  await form.getByLabel('Abreise').fill('2026-08-14')

  const roomSelect = form.getByLabel('Zimmer')
  await expect(roomSelect.locator('option[value="r-4"]')).toHaveCount(0)
  await expect(roomSelect.locator('option[value="r-3"]')).toHaveCount(1)
})

test('shows the room-selection prompt for pending requests', async ({ page }) => {
  await page.goto('/anfragen')

  const hannahRequest = page.locator('.request-card').filter({ hasText: 'Hannah Wolf' })
  await expect(hannahRequest.getByLabel('Verfügbarkeit: frei')).toContainText('Zeitraum frei')

  const customerSelect = page.getByLabel('Kundschaft für Anfrage von Hannah Wolf')
  await expect(customerSelect).toHaveValue('')
  await expect(customerSelect.locator('option:checked')).toHaveText('Kundschaft wählen')

  const roomSelect = page.getByLabel('Zimmer für Anfrage von Hannah Wolf')
  await expect(roomSelect).toHaveValue('')
  await expect(roomSelect).toHaveJSProperty('selectedIndex', 0)
  await expect(roomSelect.locator('option:checked')).toHaveText('Zimmer wählen')

  await expect(page.getByRole('button', { name: 'Annehmen' }).first()).toBeDisabled()
})

test('groups request details separately from the decision controls', async ({ page }) => {
  await page.goto('/anfragen')

  const request = page.locator('.request-card').filter({ hasText: 'Emilia Fischer' })
  const summary = request.locator('.request-summary')
  const actions = request.locator('.request-actions')
  await expect(summary).toBeVisible()
  await expect(actions).toBeVisible()
  await expect(actions).toHaveCSS('background-color', 'rgb(250, 250, 248)')

  const [summaryBox, actionsBox] = await Promise.all([summary.boundingBox(), actions.boundingBox()])
  expect(summaryBox).not.toBeNull()
  expect(actionsBox).not.toBeNull()
  if ((page.viewportSize()?.width ?? 0) > 900) {
    expect(actionsBox!.x).toBeGreaterThanOrEqual(summaryBox!.x + summaryBox!.width)
  } else {
    expect(actionsBox!.y).toBeGreaterThanOrEqual(summaryBox!.y + summaryBox!.height)
  }
  expect(await page.locator('body').evaluate((body) => body.scrollWidth <= window.innerWidth)).toBeTruthy()
})

test('requires an explicit customer choice when accepting a request and highlights a matching contact', async ({ page }) => {
  await page.goto('/anfragen')

  const emiliaRequest = page.getByLabel('Kundschaft für Anfrage von Emilia Fischer').locator('xpath=ancestor::article')
  const customerSelect = emiliaRequest.getByLabel('Kundschaft für Anfrage von Emilia Fischer')
  await expect(emiliaRequest).toContainText('Passende Kundschaft: Emilia Fischer · gleiche Telefonnummer. Mit der Auswahl wird die Anfrage dieser Kundschaft zugeordnet.')
  await expect(customerSelect.locator('optgroup')).toHaveAttribute('label', 'Passende bestehende Kundschaft')
  await expect(customerSelect.locator('option[value="c-8"]')).toHaveCount(1)
  await expect(customerSelect.locator('option[value="c-1"]')).toHaveCount(0)

  await customerSelect.selectOption('c-8')
  await emiliaRequest.getByLabel('Zimmer für Anfrage von Emilia Fischer').selectOption('r-1')
  await emiliaRequest.getByRole('button', { name: 'Annehmen' }).click()

  await expect(emiliaRequest).toHaveCount(0)
  await expect(page.locator('.request-history').filter({ hasText: 'Emilia Fischer' })).toContainText('Angenommen')
})

test('declines a request in a modal and records its reason', async ({ page }) => {
  await page.goto('/anfragen')

  const request = page.locator('.request-card').filter({ hasText: 'Hannah Wolf' })
  await request.getByRole('button', { name: 'Ablehnen' }).click()

  const dialog = page.getByRole('dialog', { name: 'Anfrage von Hannah Wolf ablehnen?' })
  const reason = dialog.getByLabel('Ablehnungsgrund')
  const confirm = dialog.getByRole('button', { name: 'Anfrage ablehnen' })
  await expect(reason).toBeVisible()
  await expect(confirm).toBeDisabled()

  await reason.fill('Zeitraum bereits ausgebucht')
  await confirm.click()

  await expect(dialog).toHaveCount(0)
  await expect(request).toHaveCount(0)
  await expect(page.locator('.request-history').filter({ hasText: 'Hannah Wolf' })).toContainText('Grund: Zeitraum bereits ausgebucht')
})
