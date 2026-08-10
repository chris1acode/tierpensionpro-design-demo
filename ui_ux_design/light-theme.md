# Theme-Design-Dokument: Tierpension Pro Light Theme

## Zweck

Dieses Dokument beschreibt das visuelle Theme fuer eine moderne SaaS-Anwendung zur Verwaltung von Tierpensionen. Es ist als verbindlicher Design-Prompt fuer eine KI gedacht, die UI-Screens, Komponenten oder komplette Anwendungsansichten erzeugt.

Das Theme baut auf einem ruhigen, professionellen SaaS-Design auf und konkretisiert es fuer den Arbeitsalltag von Hunde- und Katzenpensionen. Die Anwendung soll freundlich, verlaesslich und modern wirken, ohne verspielt, kindlich oder wie ein Online-Shop fuer Tierbedarf auszusehen.

---

## 1. Markencharakter

Gestalte die Anwendung mit diesen Eigenschaften:

- freundlich
- warm
- professionell
- ruhig
- verlaesslich
- effizient
- modern
- nahbar
- tierbezogen, aber nicht verspielt
- hochwertig, aber nicht luxurioes

Die Anwendung ist ein taegliches Arbeitswerkzeug fuer Betreiber und Mitarbeitende von Tierpensionen. Sie muss bei hoher Informationsdichte klar und schnell erfassbar bleiben.

Vermeide:

- Comic-Optik
- Pfotenmuster als dekorativen Hintergrund
- uebertriebene Illustrationen
- niedliche oder kindliche UI-Sprache
- zu viele Tierbilder
- verspielte Schriftarten
- starke Verlaeufe
- Neonfarben
- Glassmorphism
- harte schwarze Schatten
- austauschbare Standard-SaaS-Optik

---

## 2. Visuelle Leitidee

Die visuelle Identitaet entsteht aus der Kombination von:

1. warmem Orange als klarer Markenfarbe
2. tiefem Petrol als ruhiger Gegenfarbe
3. warmen neutralen Flaechen
4. funktionalen Tierprofilbildern
5. klaren Tabellen, Listen und Planungsansichten
6. sanften Rundungen
7. reduzierten, praezisen Icons
8. deutlicher Statuskommunikation

Orange ist die Markenfarbe, aber nicht die Farbe fuer jede Hervorhebung. Es wird gezielt fuer Marke, Hauptaktionen und aktive Zustande eingesetzt.

Petrol wird fuer Navigation, Links, sekundare Interaktionen und Informationsbereiche verwendet.

Semantische Farben werden ausschliesslich fuer Status und Rueckmeldung genutzt.

---

## 3. Farbpalette

### 3.1 Markenfarben

Diese Farben definieren die visuelle Identitaet. Die konkreten Hex-Werte sind im `color-concept.md` hinterlegt.

- **Primary**: Die Haupt-Markenfarbe (Orange). Verwendung: Logo, markante Akzente, aktive Navigation, Fokus auf Marke.
- **Secondary**: Die ruhige Gegenfarbe (Petrol). Verwendung: Sekundaere Buttons, Links, Navigationselemente, Informationsbereiche.

Verwende fuer Text auf farbigen Hintergruenden immer die entsprechenden `on-primary` oder `on-secondary` Varianten, um den Kontrast sicherzustellen.

### 3.2 Semantische Farben

Statusfarben werden ausschliesslich fuer funktionale Rueckmeldungen genutzt. Sie muessen immer durch Text oder Icons ergaenzt werden.

- **Success**: Bestaetigte Buchungen, erledigte Aufgaben, erfolgreicher Check-in.
- **Warning**: Bald faellige Aufgaben, fehlende Dokumente, hohe Auslastung.
- **Error**: Medizinische Risiken, fehlgeschlagene Aktionen, kritische Pflichtangaben.
- **Info**: Neutrale Hinweise, Systeminformationen, Hintergrundprozesse.

Die genauen Abstufungen (z.B. Soft-Varianten fuer Hintergruende) werden im Farbkonzept definiert.

### 3.3 Neutrale Farben

Verwende warme Neutrale statt kuehler Grauwerte, um eine freundliche Atmosphaere zu schaffen.

- **Background**: Haupthintergrund der Anwendung.
- **Surface**: Ebenen fuer Karten, Tabellen und Formulare.
- **Text**: Abstufungen fuer Haupttext, Sekundaertext und Metadaten.
- **Border/Divider**: Subtile Abgrenzung von Elementen.

---

## 4. Farbverteilung

Nutze die Farben ungefaehr in dieser visuellen Gewichtung:

- 70 bis 80 Prozent warme neutrale Flaechen
- 10 bis 15 Prozent Orange
- 5 bis 10 Prozent Petrol
- semantische Farben nur bei funktionalem Bedarf

Orange wird verwendet fuer:

- primaere Hauptaktion
- aktiven Navigationspunkt
- Fokus auf Marke
- einzelne wichtige Kennzahlen
- kleine Fortschrittsanzeigen
- ausgewahlte Elemente

Orange wird nicht gleichzeitig fuer:

- alle Ueberschriften
- alle Icons
- alle Links
- alle Charts
- alle Badges
- alle Hintergruende

---

## 5. Oberflaechen und Tiefe

Definiere diese Oberflaechenebenen:

### Canvas

Die unterste Ebene der Anwendung.

Verwendung:
- Gesamte App
- Seitenhintergrund

### Surface

Die Standard-Ebene fuer Inhalte.

Verwendung:
- Tabellen
- Karten
- Formulare

### Muted Surface

Subtile Abgrenzung fuer untergeordnete Bereiche.

Verwendung:
- Filterbereiche
- Sekundarbereiche
- Gruppen

### Elevated Surface / Modal

Ebenen mit Schatten zur Darstellung von Hierarchie und Fokus.

Verwendung:
- Side Panels
- Dropdowns
- Dialoge

Vermeide starke Schatten. Nutze Border und Flaechenkontrast als primaere Mittel zur Abgrenzung.

---

## 6. Typografie

Verwende eine moderne, klare Sans-Serif-Schrift.

Empfohlene Richtung:

- Inter
- Manrope
- Source Sans 3
- IBM Plex Sans
- systemnahe UI-Schriften

Keine verspielte Headline-Schrift.

Typografie-Skala:

```css
--font-display: 48px;
--font-page-title: 36px;
--font-section-title: 24px;
--font-card-title: 17px;
--font-body: 15px;
--font-small: 13px;
--font-meta: 12px;
```

Empfohlene Gewichte:

- 700 fuer Seitentitel
- 600 fuer Abschnittstitel und Buttons
- 500 fuer Labels und aktive Navigation
- 400 fuer Fliesstext und Metadaten

Textfarben:

- Haupttext: `#24211F`
- Sekundartext: `#6D6762`
- Metadaten: `#918A84`

UI-Texte sind kurz, konkret und handlungsorientiert.

Beispiele:

- Neue Buchung
- Tier einchecken
- Aufenthalt verlaengern
- Medikament dokumentieren
- Buchung bestaetigen
- Rechnung senden

Vermeide:

- OK
- Weiter
- Aktion
- Bestaetigen
- Mehr erfahren innerhalb produktiver Workflows

---

## 7. Abstaende

Verwende ein 4-Pixel-System:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
```

Regeln:

- 8 bis 12 px innerhalb kompakter Komponenten
- 16 bis 24 px zwischen verwandten Elementen
- 32 bis 48 px zwischen Inhaltsgruppen
- 48 bis 64 px zwischen Hauptbereichen

Keine zufaelligen Zwischenwerte verwenden.

---

## 8. Radien

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 18px;
--radius-xl: 24px;
--radius-round: 999px;
```

Verwendung:

- Inputs, Tabellenzellen, kompakte Controls: 8 px
- Buttons, kleine Cards: 10 bis 12 px
- grosse Panels und Module: 16 bis 18 px
- Dialoge und grosse Overlays: 18 bis 24 px
- Status-Chips und Avatare: rund

Keine extremen Pill-Buttons fuer alle Aktionen.