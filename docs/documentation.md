# TierpensionPro - Dokumentation

## Vision & Konzept
TierpensionPro ist eine SAAS-Software zur Verwaltung von Tierpensionen. Sie ermöglicht es Besitzern, den täglichen Betrieb effizient zu organisieren, Buchungen zu verwalten und die Auslastung im Blick zu behalten.

Die Anwendung wurde als interaktiver Clickdummy mit einem internen In-Memory Mock-Datenmodell entwickelt. Dies erlaubt eine vollständige Exploration der Design-Ideen und eine reale Interaktion auf allen Seiten, wobei die Daten fachlich korrekt referenziert werden.

### Kernziele
- **Angenehme visuelle Darstellung**: Modernes UI/UX-Design mit einem klaren Fokus auf Usability.
- **100% Responsive Design**: Optimale Bedienbarkeit auf Desktop, Tablet und Smartphone.
- **Robustes Mock-System**: Deterministische Demodaten für Tests und Präsentationen.

---

## Hauptfunktionen & Features

### 1. Dashboard & Navigation
Das Dashboard dient als zentrale Tagesübersicht und bietet schnellen Zugriff auf die wichtigsten operativen Kennzahlen.

- **Kennzahlen (Widgets)**: Direkte Links zu "Heutigen Anreisen", "Heutigen Abreisen" und "Tieren im Haus".
- **Globale Navigation**: Eine responsive Sidebar (Desktop) bzw. ein Drawer (Mobile) führt zu allen Hauptbereichen.
- **Demodaten-Steuerung**: Ein speziell hervorgehobenes Steuerelement in der Topbar erlaubt das Zurücksetzen und Wechseln der Demo-Umgebungen.
- **Benutzerprofil**: Zugriff auf Kontoeinstellungen über den Avatar.

### 2. Kunden & Tierverwaltung
Kunden stehen im Mittelpunkt der Software. Ein Kunde kann mehrere Tiere (Hunde oder Katzen) besitzen.

- **Kundenverzeichnis**: Eine tabellarische Übersicht mit Suche und Paging. Auf kleinen Bildschirmen wird eine responsive Master-Detail-Navigation verwendet.
- **Tierprofile**: Detaillierte Profile pro Tier mit:
    - Rasse und Tierart (Icon-gestützt).
    - Medikationsplan, Fütterungsplan, Allergien und Impfstatus.
    - Notfallkontakt und Tierarzt-Informationen.
- **CRUD-Operationen**: Anlegen, Bearbeiten und sicheres Löschen von Kunden und Tieren (mit Referenzprüfung).
- **Cross-Referenzen**: Direkte Navigation vom Kundenprofil zur Buchungsanlage.

### 3. Buchungssystem & Kalender
Buchungen durchlaufen einen Lebenszyklus von der Reservierung bis zum Check-out.

- **Reservierung & Buchung**: Anlage von Einzel- oder Mehrtier-Reservierungen mit atomarer Kapazitätsprüfung.
- **Zimmer-Zeitachse**: Eine visuelle Darstellung der Buchungen über 7 Tage, gruppiert nach Zimmern. Zusammenhängende Balken zeigen den Aufenthalt an; Buchungen ohne Zimmer werden in einem separaten Slot geführt.
- **Monatskalender**: Alternative Ansicht zur Übersicht über den Buchungsstatus.
- **CSV-Export**: Alle Buchungsdaten können inklusive Preis-Snapshots exportiert werden.

### 4. Check-in & Check-out
Der operative Kern für den täglichen Empfang und die Verabschiedung der Tiere.

- **Tageslisten**: Klare Trennung zwischen geplanten Anreisen und Abreisen für das gewählte Datum.
- **Check-in Workflow**: Anzeige wichtiger Tierinfos (Medikation, Allergien, Notfallkontakt) direkt beim Check-in.
- **Check-out Workflow**: Automatische Preisberechnung basierend auf den hinterlegten Tagespreisen (Abreisetag kostenfrei). Der Preis wird nach dem Check-out als unveränderlicher Snapshot gespeichert.
- **Historie & Verlauf**: Protokollierung aller Vorgänge mit der Möglichkeit, Aktionen (wie Check-in) innerhalb desselben Tages rückgängig zu machen.
- **Tiere im Haus**: Ein separater Bereich listet alle aktuell eingecheckten Tiere auf und erlaubt den direkten Check-out.

### 5. Belegungsplanung & Kapazität
Dieses Modul verhindert Überbuchungen und visualisiert die Auslastung der Pension.

- **Belegungsampel**: Farbliche Kennzeichnung der Auslastung (Normal, Erhöht, Knapp, Voll/Ausgebucht, Überbucht).
- **Zimmer- & Kapazitätsverwaltung**: Konfiguration von Zimmern mit spezifischen Kapazitäten und Tierart-Kompatibilität.
- **Schließzeiten**: Hinterlegung von Zeiträumen, in denen Plätze blockiert sind.
- **Überbuchungsschutz**: Warnmeldungen bei Kapazitätsüberschreitung, wobei Überbuchungen durch explizite Bestätigung möglich bleiben.

### 6. Anfrage-Management
Ein optionales Feature zum Empfang externer Anfragen.

- **Postfach**: Übersicht eingegangener Anfragen mit Status (Offen, Angenommen, Abgelehnt).
- **Verfügbarkeitsprüfung**: Automatische Anzeige, ob der angefragte Zeitraum basierend auf Zimmerkapazitäten und Schließzeiten frei ist.
- **Workflow**: 
    - **Annehmen**: Zuordnung zu Bestandskunden (per E-Mail/Namens-Match) oder Neuaufnahme, Zimmerwahl und Umwandlung in eine Reservierung.
    - **Ablehnen**: Angabe eines Grundes und automatische Vormerkung einer Benachrichtigung.

### 7. Einstellungen & Konto
Zentrale Konfiguration der Pension und des Benutzerkontos.

- **Pensions-Einstellungen**:
    - Konfiguration von Tierkategorien und Zimmern.
    - Preislisten (Tagespreise pro Tierart).
    - Sicherung der Entwürfe: "Speichern" und "Verwerfen" sind nur bei tatsächlichen Änderungen aktiv.
- **Kontoverwaltung**:
    - Verwaltung von Profilinformationen.
    - Kündigungs-Workflow für Root-Accounts.

---

## Technische Umsetzung & Qualitätsmerkmale

### UX & Barrierefreiheit (Accessibility)
- **Fokus-Management**: Modale Dialoge und mobile Navigation fangen den Fokus ein (Trap) und stellen ihn nach dem Schließen wieder her. Escape-Taste wird konsequent unterstützt.
- **Semantik**: Einsatz von ARIA-Labels und korrekten HTML5-Elementen (z.B. `type="search"`, `aria-modal`).
- **Shortcuts**: Globaler Such-Shortcut (Cmd/Ctrl+K), der in modalen Zuständen sicher gesperrt wird.

### Datenintegrität & Validierung
- **Deterministische Mocks**: 100 Kunden und über 100 Tierprofile ermöglichen realistische Szenarien.
- **E-Mail-Validierung**: Echte Format-Policy statt einfacher Zeichenprüfung.
- **Preissicherheit**: Preise werden in Euro-Cent als Ganzzahlen geführt, um Rundungsfehler zu vermeiden.
- **Schutz vor Datenverlust**: Synchronisierung von Formular-Entwürfen mit dem Store nach einem Demo-Reset.

### Responsive Design
- **Grid-Layouts**: Stabilisierte Ausrichtung von Aktionen und Metadaten (z.B. im Check-in), um unruhige Layouts zu vermeiden.
- **Mobile Navigation**: Kompakte Paging-Logik und responsive Tabellen/Listen, die horizontalen Überlauf verhindern.
- **Touch-Optimierung**: Ausreichend große Klickflächen (z.B. 40px Höhe bei Navigations-Buttons).
