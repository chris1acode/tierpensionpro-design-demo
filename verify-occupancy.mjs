import { chromium } from '@playwright/test'

const browser = await chromium.launch()
const page = await browser.newPage()
const consoleErrors = []
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
page.on('pageerror', (err) => consoleErrors.push(String(err)))

await page.goto('http://localhost:5173/occupancy')
await page.waitForSelector('.occupancy-page')

const startDateInput = page.locator('.occupancy-start-date input')
console.log('initial start date value:', await startDateInput.inputValue())

const firstHeaderBefore = await page.locator('.occupancy-day-header .occupancy-daynum').first().textContent()
console.log('first day header before nav:', firstHeaderBefore)

await page.click('button[aria-label="Eine Woche vor"]')
await page.waitForTimeout(100)
console.log('start date after +1 week:', await startDateInput.inputValue())
const firstHeaderAfterForward = await page.locator('.occupancy-day-header .occupancy-daynum').first().textContent()
console.log('first day header after +1 week:', firstHeaderAfterForward)

await page.click('button[aria-label="Eine Woche zurück"]')
await page.waitForTimeout(100)
console.log('start date after -1 week (back to start):', await startDateInput.inputValue())

// today button should be disabled when on today
const todayButton = page.locator('.occupancy-today')
console.log('today button disabled at today:', await todayButton.isDisabled())

await page.click('button[aria-label="Eine Woche vor"]')
await page.waitForTimeout(100)
console.log('today button disabled after moving forward:', await todayButton.isDisabled())
await todayButton.click()
await page.waitForTimeout(100)
console.log('start date after clicking Heute:', await startDateInput.inputValue())

// direct date input change
await startDateInput.fill('2026-09-01')
await startDateInput.dispatchEvent('change')
await page.waitForTimeout(100)
console.log('start date after manual input:', await startDateInput.inputValue())
const firstHeaderAfterManual = await page.locator('.occupancy-day-header .occupancy-daynum').first().textContent()
console.log('first day header after manual date entry:', firstHeaderAfterManual)

console.log('console errors:', consoleErrors)

await browser.close()
