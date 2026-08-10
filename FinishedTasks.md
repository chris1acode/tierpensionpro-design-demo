# Finished Tasks

## Session 02936 — 2026-08-10
- bugs.md: Dashboard-Kennzahlenkarten – Pfeil-Icon (metric-arrow) war bei umbrochenem Text auf mittleren Screens (~1024px) vertikal mittig positioniert und überlappte den umbrochenen Fließtext. Jetzt fest oben ausgerichtet (`src/styles.css`, `.metric-arrow`), sodass er bei jeder Zeilenzahl neben dem Titel bleibt.
- bugs.md: "Anzahl Kunden"-Badge in der Kopfzeile von Kunden & Tiere entfernt (`src/components/CustomersPage.vue`), inkl. Entfernen des nun ungenutzten `Users`-Icon-Imports.
- bugs.md: Dashboard-Belegungskarte – Button "Belegung planen" entfernt; Panel-Titel ist jetzt "Belegung ansehen" und selbst ein Link auf `/belegung` (`src/App.vue`, neue CSS-Klasse `.panel-title-link` in `src/styles.css`, ungenutzte `.occupancy-actions`-Regel entfernt).
- Alle Änderungen mit `vue-tsc --noEmit` und `npm run test` (227 Tests) verifiziert; Layout-Fixes zusätzlich per Playwright-Screenshot bei 1024px und 1440px Breite geprüft.
