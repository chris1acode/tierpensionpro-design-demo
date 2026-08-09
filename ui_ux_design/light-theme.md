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

```css
--primary: #DF6420;
--primary-hover: #B94B12;
--primary-active: #9F3F0D;
--primary-soft: #FBE8DD;
--primary-subtle: #FFF5EF;
--on-primary: #21160F;
```

Verwendung:

- `primary`: Logo, markante Akzente, aktive Navigation, Fokus auf Marke
- `primary-hover`: Hover fuer primaere Buttons
- `primary-active`: gedrueckter Button oder aktiver Zustand
- `primary-soft`: Badge-Hintergruende, ausgewaehlte Flaechen, dezente Markierung
- `primary-subtle`: Hero-Flaechen, sehr leichte Markenflaechen
- `on-primary`: Text und Icons auf helleren Orangeflaechen

Verwende weissen Text auf Orange nur, wenn der Kontrast fuer Groesse und Gewicht ausreicht. Fuer kleine Button-Texte ist dunkler Text zu bevorzugen oder ein dunklerer Orange-Ton zu verwenden.

### 3.2 Sekundaerfarbe

```css
--secondary: #2F5D62;
--secondary-hover: #244A4E;
--secondary-active: #1C3C40;
--secondary-soft: #E4EFF0;
--on-secondary: #FFFFFF;
```

Verwendung:

- sekundare Buttons
- Links
- Navigationselemente
- Informationsbereiche
- alternative Diagrammserie
- ruhige Hervorhebungen

Petrol darf nicht mit Orange um Aufmerksamkeit konkurrieren. Orange bleibt die primaere Markenfarbe.

### 3.3 Semantische Farben

```css
--success: #3F7A5C;
--success-soft: #E7F2EB;

--warning: #C58A24;
--warning-soft: #FAF0D9;

--error: #B94A48;
--error-soft: #F8E5E4;

--info: #46718A;
--info-soft: #E6EFF4;
```

Verwendung:

- Erfolg: bestaetigte Buchungen, erledigte Aufgaben, erfolgreicher Check-in
- Warnung: bald faellige Aufgaben, fehlende Dokumente, hohe Auslastung
- Fehler: medizinische Risiken, fehlgeschlagene Aktionen, kritische Pflichtangaben
- Information: neutrale Hinweise, Systeminformationen, Hintergrundprozesse

Status darf nie nur durch Farbe vermittelt werden. Verwende immer zusaetzlich Text, Icon oder Form.

### 3.4 Neutrale Farben

```css
--background: #F7F6F3;
--surface: #FFFFFF;
--surface-muted: #F1EFEB;
--surface-elevated: #FFFFFF;
--overlay: rgba(36, 33, 31, 0.48);

--text-primary: #24211F;
--text-secondary: #6D6762;
--text-muted: #918A84;
--text-disabled: #AAA39C;

--border: #DED9D3;
--border-strong: #C8C1BA;
--divider: #E8E4DF;
```

Verwende warme Neutrale statt kuehler Grauwerte. Die Anwendung soll freundlich und ruhig wirken.

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

```css
background: #F7F6F3;
```

Verwendung:

- gesamte App
- Seitenhintergrund
- ruhige freie Flaechen

### Surface

```css
background: #FFFFFF;
border: 1px solid #DED9D3;
```

Verwendung:

- Tabellen
- Karten
- Formulare
- Inhaltsmodule

### Muted Surface

```css
background: #F1EFEB;
```

Verwendung:

- Filterbereiche
- Sekundarbereiche
- Gruppen
- inaktive oder vorbereitende Inhalte

### Elevated Surface

```css
background: #FFFFFF;
box-shadow: 0 8px 24px rgba(36, 33, 31, 0.10);
```

Verwendung:

- Side Panels
- Dropdowns
- Popovers
- schwebende Toolbars

### Modal

```css
background: #FFFFFF;
box-shadow: 0 20px 60px rgba(36, 33, 31, 0.18);
```

Verwendung:

- Dialoge
- Command Palette
- fokussierte Workflows

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