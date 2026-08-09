# Framework-Auswahl

## Landingpage

### Nuxt

- Basis fuer die statische Landingpage
- Static Site Generation
- Dateibasiertes Routing
- Layout-System
- SEO-Metadaten
- Sitemap
- Strukturierte Daten
- Asset-Optimierung
- Code Splitting
- Fehlerseiten
- Vue 3 und Vite sind bereits integriert

### PrimeVue

- UI-Komponenten fuer die Landingpage
- Nutzung des definierten Themes
- Responsive Layouts
- Formulare und Dialoge bei Bedarf
- Einheitliche Buttons, Inputs und Oberflaechen

### Vue I18n

- Uebersetzungen
- Sprachumschaltung
- Formatierung von Datum und Zahlen
- Zentrale Verwaltung sichtbarer Texte

### Zod

- Validierung von Kontaktformularen
- Validierung von Anfrageformularen
- Validierung von Konfigurationen
- Typisierte Formulardaten

### Vitest

- Unit Tests
- Tests fuer Hilfsfunktionen
- Tests fuer Validierungslogik

### Vue Test Utils

- Tests fuer Vue-Komponenten
- Tests fuer Formulare
- Tests fuer Interaktionen

### ESLint

- Statische Codeanalyse
- Vue- und TypeScript-Regeln
- Vermeidung typischer Fehler

### Prettier

- Einheitliche Codeformatierung
- Automatische Formatierung von Vue-, TypeScript- und CSS-Dateien

### Sentry oder vergleichbares Monitoring

- Erfassung von Laufzeitfehlern
- Fehleranalyse in Produktion
- Performance-Monitoring
- Zuordnung von Fehlern zu Releases

---

## SaaS-Frontend

### Vue 3

- Komponentenmodell
- Composition API
- Reaktivitaet
- Single File Components
- Script Setup

### TypeScript

- Strikte Typisierung
- Typisierte Komponenten
- Typisierte Composables
- Typisierte Routen
- Typisierte API-Zugriffe

### Vite

- Entwicklungsserver
- Produktions-Build
- Code Splitting
- Lazy Loading
- Umgebungsvariablen
- Bundle-Optimierung

### PrimeVue

- Technische UI-Komponentenbasis
- App Shell
- Navigation Drawer (Sidebar, Drawer)
- App Bar (Menubar, Toolbar)
- Tabellen (DataTable)
- Formulare (InputText, Dropdown, etc.)
- Dialoge (Dialog, ConfirmDialog)
- Side Panels (Sidebar)
- Snackbars (Toast)
- Skeletons (Skeleton)
- Theme-System (Designer & Styled/Unstyled mode)
- Responsive Breakpoints
- Dichtevarianten

### Vue Router

- URL-basierte Navigation
- Verschachtelte Routen
- Detailrouten
- Tab-Routen
- Filter und Sortierung in der URL
- Navigation Guards
- Rollen- und Zugriffspruefungen
- Schutz vor Verlust ungespeicherter Aenderungen

### Pinia

- Globaler Client-State
- Benutzerkontext
- Mandanten- oder Standortauswahl
- Benutzerpraeferenzen
- Navigationseinstellungen
- Feature Flags
- Globale UI-Zustaende

### TanStack Query

- Server-State
- API-Caching
- Hintergrundaktualisierung
- Query-Invalidierung
- Mutationen
- Optimistische Updates
- Retry
- Request-Deduplizierung
- Abbruch veralteter Requests
- Pagination
- Infinite Queries bei Bedarf

### OpenAPI-generierter API-Client

- Generierte TypeScript-Modelle
- Typisierte API-Funktionen
- Konsistente Request- und Response-Typen
- Automatische Anpassung bei API-Aenderungen
- Integration mit TanStack Query
- Generierung mit Orval oder OpenAPI Generator

### VeeValidate

- Formularzustand
- Feldvalidierung
- Fehleranzeige
- Dirty State
- Submit-Handling
- Integration mit PrimeVue

### Zod

- Validierungsschemas
- Typisierte Formulardaten
- Validierung von API-Eingaben
- Wiederverwendbare Fachregeln
- Integration mit VeeValidate

### Vue I18n

- Uebersetzungen
- Produktsprache
- Pluralisierung
- Datumsformatierung
- Zahlenformatierung
- Waehrungsformatierung
- Sprachabhaengige Fehlermeldungen

### Vitest

- Unit Tests
- Tests fuer Composables
- Tests fuer Stores
- Tests fuer Berechtigungen
- Tests fuer Validierung
- Tests fuer Fachlogik

### Vue Test Utils

- Komponententests
- Tests fuer Formulare
- Tests fuer Tabellen
- Tests fuer Lade-, Fehler- und Leerzustaende
- Tests fuer Benutzerinteraktionen

### ESLint

- Statische Codeanalyse
- Vue-Regeln
- TypeScript-Regeln
- Importregeln
- Architekturregeln
- Vermeidung ungenutzten Codes

### Prettier

- Einheitliche Formatierung
- Automatische Formatierung von Vue-, TypeScript-, JSON- und CSS-Dateien

### Sentry oder vergleichbares Monitoring

- Laufzeitfehler
- API-Fehler
- Performance-Probleme
- Source Maps
- Release-Zuordnung
- Benutzer- und Sitzungsanalyse unter Beachtung des Datenschutzes