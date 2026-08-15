import { test } from '@playwright/test'

const pages = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Kunden_Tiere', path: '/customers-pets' },
  { name: 'Check-in-out', path: '/check-in-out' },
  { name: 'Buchungen', path: '/bookings' },
  { name: 'Belegung', path: '/occupancy' },
  { name: 'Anfragen', path: '/requests' },
  { name: 'Einstellungen_Allgemein', path: '/settings/general' },
  { name: 'Einstellungen_Tarife', path: '/settings/rates' },
  { name: 'Einstellungen_Zimmer', path: '/settings/rooms' },
  { name: 'Konto', path: '/account' }
]

test.describe('Capture Screenshots', () => {
  for (const pageInfo of pages) {
    test(`Screenshot for ${pageInfo.name}`, async ({ page }, testInfo) => {
      await page.goto(pageInfo.path)
      
      // Wait for a bit to ensure animations or data loading are finished
      await page.waitForTimeout(1000)
      
      const projectName = testInfo.project.name
      const screenshotPath = `screenshots/${projectName}/${pageInfo.name.toLowerCase()}.png`
      
      // fullPage: false -> Screenshot in exakter Viewport-Größe
      // (desktop 1280x720 = 16:9, mobile 390x844, tablet 768x1024)
      await page.screenshot({
        path: screenshotPath,
        fullPage: false
      })
    })
  }
})
