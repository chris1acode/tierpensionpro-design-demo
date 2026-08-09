# Modernes SaaS-Usability-Konzept

## Grundlage

Entwickle die Anwendung als zustandsorientierte Single Page Application mit:

* stabiler App Shell
* URL-basierter Navigation
* klaren Arbeitsbereichen
* schnellen Listen-Detail-Workflows
* kontextbezogenen Aktionen
* progressiver Offenlegung komplexer Funktionen
* optimistischen Interaktionen
* durchgaengiger Tastaturbedienung
* responsiven, aufgabenspezifischen Layouts

Die Anwendung soll sich wie ein zusammenhaengendes Arbeitswerkzeug anfuehlen, nicht wie eine Folge einzelner Webseiten.

---

# 1. Grundstruktur der Anwendung

## 1.1 App Shell

Verwende eine dauerhaft sichtbare App Shell aus:

1. Primaerer Navigation
2. Globaler Kopfleiste
3. Kontextkopf der aktuellen Ansicht
4. Hauptinhaltsbereich
5. Optionalem Detail- oder Inspector-Panel
6. Globalen Overlay-Komponenten

Empfohlene Vuetify-Struktur:

```vue
<v-app>
  <v-navigation-drawer />

  <v-app-bar />

  <v-main>
    <router-view />
  </v-main>

  <app-command-palette />
  <app-dialog-host />
  <app-notification-host />
</v-app>
```

Nutze `v-app` als zentrale Layout- und Theme-Basis.

Nutze `v-navigation-drawer` fuer die primaere Navigation.

Nutze `v-app-bar` fuer globale Aktionen, Suche, Workspace-Auswahl und Benutzerfunktionen.

Nutze `v-main` ausschliesslich fuer den wechselnden Anwendungsinhalt.

Platziere globale Dialoge, Benachrichtigungen und die Command Palette ausserhalb einzelner Views.

---

## 1.2 Stabile und wechselnde Bereiche

Folgende Bereiche bleiben waehrend der Navigation stabil:

* Hauptnavigation
* Workspace- oder Mandantenauswahl
* globale Suche
* Benutzerprofil
* Benachrichtigungen
* globale Erstellung
* globale Hilfe

Folgende Bereiche wechseln mit der Route:

* Seitentitel
* lokale Navigation
* Filter
* Hauptinhalt
* Detailansicht
* kontextbezogene Aktionen

Vermeide ein vollstaendiges Neurendern oder sichtbares Flackern der App Shell bei Routenwechseln.

---

# 2. Navigationsmodell

## 2.1 Primaere Navigation

Verwende fuer Desktop einen permanenten oder einklappbaren Navigation Drawer.

Die Navigation enthaelt nur die wichtigsten Produktbereiche:

* Uebersicht
* zentrale Arbeitsobjekte
* Automatisierungen
* Analysen
* Team oder Organisation
* Einstellungen

Nutze:

* ein Icon
* ein sichtbares Textlabel
* einen klaren aktiven Zustand
* optional einen kleinen Status oder Zaehler

Beschraenke die erste Navigationsebene auf etwa fuenf bis sieben Hauptbereiche.

Ordne selten benoetigte Funktionen in einen separaten unteren Bereich ein.

Verwende keine tief verschachtelten Navigationsbaeume als Standard.

---

## 2.2 Navigation Drawer auf Desktop

Der Drawer besitzt drei Modi:

### Expanded

Zeige Icons, Labels, Gruppierungen und den Workspace-Kontext.

Verwende diesen Modus standardmaessig bei grossen Viewports.

### Rail

Zeige eine schmale Icon-Navigation.

Verwende diesen Modus bei mittleren Viewports oder auf Nutzerwunsch.

Zeige bei Hover oder Fokus ein Label.

### Temporary

Zeige den Drawer als Overlay.

Verwende diesen Modus auf kleinen Viewports.

Schliesse ihn nach erfolgreicher Navigation.

---

## 2.3 Globale App Bar

Die globale App Bar enthaelt nur anwendungsweite Funktionen:

Links:

* mobile Menue-Schaltflaeche
* Workspace- oder Projektauswahl
* optional Breadcrumb fuer uebergeordnete Kontexte

Mitte:

* globale Suche oder Command-Palette-Trigger

Rechts:

* globale Erstellen-Aktion
* Benachrichtigungen
* Hilfe
* Nutzerprofil

Platziere keine seitenspezifischen Aktionsleisten dauerhaft in der globalen App Bar.

Die App Bar bleibt kompakt und stabil.

---

## 2.4 Kontextkopf

Jede Hauptansicht beginnt mit einem Kontextkopf.

Er enthaelt:

* Seitentitel
* kurze optionale Beschreibung
* Objektstatus oder Kontext
* eine primaere Aktion
* maximal zwei sekundaere Aktionen
* optionale Tabs oder lokale Navigation

Beispiel:

```text
Projekte                                  Neues Projekt
Verwalte aktive und archivierte Projekte  Importieren
```

Auf Detailseiten:

```text
Zurueck zu Projekte

Website Relaunch              Aktiv
Kunde: Beispiel GmbH

Bearbeiten    Weitere Aktionen
```

Die wichtigste Aktion steht rechts oder direkt beim Titel.

Auf kleinen Screens darf die Hauptaktion als Floating Action Button oder feste untere Aktionsleiste erscheinen.

---

## 2.5 URL als Produktzustand

Speichere navigationsrelevanten Zustand in der URL:

* aktuelle Hauptansicht
* geoeffnetes Objekt
* aktiver Tab
* Suchbegriff
* Filter
* Sortierung
* Seitenzahl
* optional geoeffnetes Detail-Panel

Beispiel:

```text
/projects
/projects/42
/projects/42/activity
/projects?status=active&owner=me&sort=updated
```

Vorteile:

* Browser-Zurueck funktioniert erwartbar
* Ansichten koennen geteilt werden
* Reload stellt den relevanten Zustand wieder her
* mehrere Tabs funktionieren unabhaengig
* Navigation bleibt nachvollziehbar

Speichere rein visuelle Kurzzeitzustaende nicht zwingend in der URL:

* Tooltip
* temporaeres Menue
* Hover
* lokaler Accordion-Zustand
* kurzlebige Bestaetigung

---

# 3. Kernmuster fuer SPA-Ansichten

## 3.1 Dashboard Pattern

Verwende ein Dashboard als handlungsorientierte Uebersicht.

Struktur:

1. Begruessung oder Kontext
2. wichtige offene Aufgaben
3. zentrale Kennzahlen
4. aktuelle Aktivitaet
5. haeufig verwendete Aktionen

Priorisiere:

* Handlungsbedarf
* Abweichungen
* Fristen
* Risiken
* aktuelle Veraenderungen

Jede Kennzahl benoetigt mindestens einen Kontext:

* Vergleich
* Ziel
* Trend
* Zeitraum
* Status

Verwende `v-card` nur fuer eigenstaendige Informationsmodule.

Nutze `v-sheet`, offene Sections oder Grid-Flaechen fuer rein strukturelle Gruppierungen.

---

## 3.2 List-Detail Pattern

Verwende List-Detail als Standard fuer verwaltbare Objekte:

* Kunden
* Projekte
* Benutzer
* Bestellungen
* Rechnungen
* Aufgaben
* Dokumente

### Desktop

Nutze wahlweise:

* Vollbreite Liste mit eigener Detailroute
* Liste links und Inspector rechts
* Tabelle mit Side Panel fuer schnelle Details

### Mobile

Nutze:

* Liste als eigene Ansicht
* Detail als neue Route
* Browser-Zurueck oder sichtbaren Zurueck-Button

Ein Detail-Panel darf die URL aktualisieren, damit ein Objekt direkt teilbar bleibt.

Beispiel:

```text
/projects?selected=42
```

oder:

```text
/projects/42
```

Verwende ein Side Panel fuer:

* schnelle Einsicht
* kleine Bearbeitungen
* Kontextinformationen
* Aktivitaetsverlauf
* Metadaten

Verwende eine vollstaendige Detailseite fuer:

* komplexe Bearbeitung
* umfangreiche Unterbereiche
* mehrere Tabs
* lange Inhalte
* eigenstaendige Workflows

---

## 3.3 Master-Detail mit Inspector

Der Inspector erscheint rechts und belegt etwa 360 bis 480 px.

Er besitzt:

* klaren Titel
* Schliessen-Aktion
* optional Vorheriges- und Naechstes-Objekt
* kompakte Objektaktionen
* scrollbaren Inhalt
* festen Aktionsbereich bei Bedarf

Verwende `v-navigation-drawer` mit rechter Position oder eine eigene ueberlagerte `v-sheet`-Struktur.

Oeffne den Inspector ohne Verlust von:

* Scrollposition
* Filtern
* Sortierung
* Auswahl
* Tabellenzustand

---

## 3.4 Tabbed Detail Pattern

Verwende Tabs nur fuer gleichrangige Unterbereiche desselben Objekts.

Beispiel:

* Uebersicht
* Aktivitaet
* Dateien
* Mitglieder
* Einstellungen

Jeder wichtige Tab erhaelt eine eigene Child Route:

```text
/projects/42/overview
/projects/42/activity
/projects/42/files
```

Verwende `v-tabs` als sichtbare Navigation und nicht als rein lokalen versteckten Zustand.

Bei wenigen Inhalten ist eine lange, gut strukturierte Detailseite besser als viele kleine Tabs.

---

## 3.5 Workflow Pattern

Verwende einen mehrstufigen Workflow nur fuer Prozesse, die:

* eine feste Reihenfolge haben
* wichtige Abhaengigkeiten besitzen
* komplexe Entscheidungen enthalten
* eine abschliessende Pruefung benoetigen

Beispiele:

* Onboarding
* Datenimport
* Abrechnung einrichten
* Veroeffentlichung
* komplexe Konfiguration

Struktur:

1. Ziel und Umfang
2. Eingabe
3. Konfiguration
4. Pruefung
5. Abschluss

Zeige:

* aktuellen Schritt
* Gesamtfortschritt
* bereits abgeschlossene Schritte
* gespeicherten Zwischenstand
* klare Abbruch- oder Zurueck-Option

Verwende keinen Wizard fuer einfache Formulare.

---

# 4. Seitenaufbau

## 4.1 Standardseitenlayout

Jede Ansicht folgt dieser Struktur:

```text
Kontextkopf
Lokale Navigation oder Tabs
Filter- und Aktionsleiste
Hauptinhalt
Pagination oder weitere Ergebnisse
```

Empfohlene Hierarchie:

```vue
<page-shell>
  <page-header />

  <page-tabs v-if="needed" />

  <page-toolbar v-if="needed" />

  <page-content>
    <router-view />
  </page-content>
</page-shell>
```

Nutze eine zentrale `PageShell`-Komponente, damit alle Ansichten konsistente:

* Breiten
* Innenabstaende
* Titelpositionen
* Ladezustaende
* Fehlerzustaende
* Breakpoints

verwenden.

---

## 4.2 Inhaltsbreite

Verwende unterschiedliche Inhaltsbreiten je nach Aufgabe.

### Narrow

Etwa 640 bis 800 px.

Fuer:

* Formulare
* Einstellungen
* leselastige Inhalte
* Onboarding

### Standard

Etwa 960 bis 1280 px.

Fuer:

* Dashboards
* Kartenraster
* allgemeine Uebersichten

### Wide

Bis zur verfuegbaren Breite.

Fuer:

* Tabellen
* Zeitachsen
* Planungsansichten
* Datenvisualisierung
* Split Views

Verwende nicht fuer jede Ansicht dieselbe maximale Breite.

---

# 5. Aktionsmodell

## 5.1 Aktionshierarchie

Definiere vier Ebenen:

### Primaer

Die wichtigste naechste Aktion.

Beispiele:

* Projekt erstellen
* Einladung senden
* Aenderungen speichern
* Import starten

Darstellung:

* gefuellter `v-btn`
* Markenfarbe
* sichtbares Label
* optional Icon

### Sekundaer

Eine relevante Alternative.

Darstellung:

* tonal oder outlined
* sichtbares Label

### Tertiaer

Unterstuetzende Aktion.

Darstellung:

* text oder ghost
* geringere visuelle Gewichtung

### Kontextaktion

Aktion fuer ein bestimmtes Objekt.

Darstellung:

* Zeilenaktion
* Icon Button
* Kontextmenue
* Inspector-Aktion

Pro sichtbarem Arbeitsbereich gibt es nur eine dominante Primaeraktion.

---

## 5.2 Erstellen-Aktion

Nutze fuer zentrale Objekte ein konsistentes Erstellen-Muster.

Desktop:

* Button im Kontextkopf
* optional globale Erstellen-Aktion in der App Bar

Mobile:

* Floating Action Button
* oder feste untere Aktionsleiste

Oeffne kleine Erstellvorgaenge in einem Dialog oder Side Panel.

Oeffne komplexe Erstellvorgaenge als eigene Route.

Kriterium:

* bis etwa vier einfache Felder: Dialog
* mittlerer Umfang: Side Panel
* komplex oder mehrstufig: eigene View

---

## 5.3 Kontextmenues

Verwende ein `v-menu` fuer seltene oder sekundare Aktionen.

Ordne Menuepunkte:

1. haeufige neutrale Aktionen
2. Verwaltungsaktionen
3. Separator
4. destruktive Aktion

Benenne jede Aktion konkret.

Verwende:

* Duplizieren
* Archivieren
* Exportieren
* Projekt loeschen

Nicht:

* Aktion
* Mehr
* Ausfuehren
* Bestaetigen

Das Drei-Punkte-Menue darf nicht die einzige Moeglichkeit enthalten, die wichtigste Aufgabe auszufuehren.

---

# 6. Suche und Filter

## 6.1 Globale Suche

Die globale Suche durchsucht mehrere Objektarten.

Oeffne sie:

* ueber ein Suchfeld in der App Bar
* mit `Ctrl+K` oder `Cmd+K`
* optional ueber `/`

Zeige:

* zuletzt geoeffnete Objekte
* vorgeschlagene Aktionen
* gruppierte Suchergebnisse
* Keyboard-Navigation
* Trefferkontext
* Objektart

Nutze `v-dialog`, `v-command-palette` falls in der eingesetzten Version vorhanden, oder eine eigene Kombination aus:

* `v-dialog`
* `v-card`
* `v-text-field`
* `v-list`

---

## 6.2 Lokale Suche

Lokale Suche filtert nur den aktuellen Datenbestand.

Platziere sie direkt oberhalb von:

* Tabelle
* Liste
* Galerie
* Auswahlansicht

Verwende einen kurzen Placeholder:

```text
Projekte durchsuchen
```

Synchronisiere den Suchbegriff bei relevanten Listen mit der URL.

Verwende Debouncing bei serverseitiger Suche.

Zeige einen klaren Zustand fuer:

* keine vorhandenen Daten
* keine Suchtreffer

---

## 6.3 Filter

Zeige die wichtigsten ein bis drei Filter direkt.

Platziere weitere Filter in einem Filter-Panel oder Menue.

Verwende Chips fuer aktive Filter.

Beispiel:

```text
Status: Aktiv x
Verantwortlich: Ich x
Zeitraum: 30 Tage x
Alle zuruecksetzen
```

Zeige die Anzahl aktiver Filter.

Erhalte Filter beim Oeffnen eines Details und beim Zurueckkehren zur Liste.

Speichere Filter optional als gespeicherte Ansichten.

---

## 6.4 Gespeicherte Ansichten

Ermoegliche bei datenintensiven Bereichen:

* persoenliche Ansichten
* Team-Ansichten
* Standardansicht
* gespeicherte Filter
* gespeicherte Sortierung
* sichtbare Spalten
* Informationsdichte

Beispiele:

* Meine offenen Projekte
* Kritische Kunden
* Diese Woche faellig
* Archivierte Eintraege

Gespeicherte Ansichten verbessern wiederkehrende Arbeitsablaeufe staerker als immer komplexere Filterdialoge.

---

# 7. Tabellenkonzept

Vuetifys Data Tables unterstuetzen unter anderem Sortierung, Suche, Pagination und Auswahl. Fuer API-basierte Daten steht ein Server-Side-Pattern bereit; virtuelle Tabellen setzen laut Dokumentation voraus, dass die Daten lokal vorliegen.

## 7.1 Einsatz

Verwende `v-data-table` fuer:

* strukturierte Objekte
* vergleichbare Attribute
* Sortierung
* Auswahl
* Bulk-Aktionen

Verwende `v-data-table-server` fuer:

* serverseitige Pagination
* grosse Datenmengen
* API-basierte Filterung
* serverseitige Sortierung

Verwende virtuelle Tabellen nur, wenn die Daten lokal verfuegbar sind und viele sichtbare Zeilen performant dargestellt werden muessen.

---

## 7.2 Tabellenaufbau

Die Tabellen-Toolbar enthaelt:

Links:

* Titel oder Ergebnisanzahl
* Suche
* wichtige Filter

Rechts:

* Dichte
* Spaltenauswahl
* Export
* Ansichtseinstellungen

Die Tabelle enthaelt:

* optionale Auswahlspalte
* primaere Identifikationsspalte
* wichtigste Attribute
* Status
* letzte Aenderung
* kontextbezogene Aktion

Die primaere Identifikationsspalte bleibt nach Moeglichkeit sichtbar.

Nutze Status-Chips sparsam.

Verwende Farbe nur zusaetzlich zu lesbarem Statustext.

---

## 7.3 Zeileninteraktion

Eine Tabellenzeile darf klickbar sein, wenn ein klarer Detailbereich existiert.

Stelle sicher:

* Hover hebt die Zeile dezent hervor
* Fokus ist sichtbar
* Enter oeffnet das Detail
* eingebettete Buttons loesen nicht gleichzeitig den Zeilenklick aus
* Kontextaktionen bleiben separat erreichbar

Nutze Doppelklick nicht fuer notwendige Aktionen.

---

## 7.4 Bulk-Aktionen

Zeige Bulk-Aktionen erst, sobald mindestens ein Objekt ausgewaehlt ist.

Ersetze oder ergaenze die Tabellen-Toolbar durch:

```text
3 ausgewaehlt

Status aendern
Zuweisen
Exportieren
Archivieren
Auswahl aufheben
```

Zeige destruktive Bulk-Aktionen getrennt.

Behalte die Auswahl nicht unbemerkt ueber inkompatible Filterwechsel hinweg.

---

## 7.5 Tabellenzustand

Gestalte explizit:

* Initial Loading
* Refresh Loading
* Empty State
* No Search Results
* API Error
* Partial Data
* Selection
* Pagination
* End of Results

Beim Refresh bleibt der vorhandene Inhalt sichtbar.

Zeige eine lokale Ladeanzeige statt eines Fullscreen-Spinners.

---

# 8. Formularkonzept

## 8.1 Formularaufbau

Verwende eine schmale Inhaltsbreite.

Struktur:

1. Titel und Zweck
2. logisch gruppierte Sections
3. Felder
4. optionale erweiterte Einstellungen
5. feste oder klar sichtbare Aktionszeile

Nutze:

* `v-form`
* `v-text-field`
* `v-textarea`
* `v-select`
* `v-autocomplete`
* `v-checkbox`
* `v-switch`
* `v-radio-group`
* `v-date-input` oder projektspezifische Datumsauswahl

Jedes Feld besitzt:

* sichtbares Label
* optional Hilfetext
* klaren Fehlertext
* passenden Eingabetyp
* konsistenten Zustand

---

## 8.2 Pflichtfelder

Kennzeichne vorzugsweise optionale Felder statt jedes Pflichtfeld mit einem Stern zu versehen, wenn die Mehrheit der Felder erforderlich ist.

Beispiel:

```text
Projektname
Beschreibung - optional
Startdatum
```

Erklaere Sonderregeln direkt am Feld.

---

## 8.3 Validierung

Validiere:

* nach Verlassen eines Feldes
* beim Speichern
* unmittelbar bei der Korrektur eines bereits sichtbaren Fehlers

Zeige Fehler lokal am Feld.

Zeige eine globale Zusammenfassung nur, wenn mehrere Fehler ueber eine lange Seite verteilt sind.

Fokussiere beim fehlgeschlagenen Speichern das erste ungueltige Feld.

---

## 8.4 Speichern

Verwende fuer Einstellungen und Formulare eines der folgenden Muster:

### Explizites Speichern

Fuer wichtige oder zusammenhaengende Aenderungen.

Zeige:

* Speichern
* Verwerfen
* ungespeicherten Zustand

### Auto-Save

Fuer kleine, unabhaengige Einstellungen.

Zeige:

* Wird gespeichert
* Gespeichert
* Speichern fehlgeschlagen

Verwende nicht gleichzeitig unklar Auto-Save und einen dominanten Speichern-Button.

---

## 8.5 Ungespeicherte Aenderungen

Verhindere versehentlichen Datenverlust.

Bei Navigation mit ungespeicherten Aenderungen:

* Navigation unterbrechen
* Konsequenz konkret benennen
* Optionen anbieten

```text
Aenderungen verwerfen
Weiter bearbeiten
```

Nutze Vue-Router-Navigation-Guards fuer solche Faelle. Navigation Guards koennen Navigationen abbrechen oder umleiten und global, pro Route oder innerhalb von Komponenten eingesetzt werden.

---

# 9. Dialoge, Panels und Overlays

## 9.1 Dialog

Nutze `v-dialog` fuer:

* kurze Entscheidungen
* Bestaetigungen
* kleine Formulare
* fokussierte Unteraufgaben

Ein Dialog besitzt:

* eindeutigen Titel
* kurze Erklaerung
* fokussierten Inhalt
* klare Hauptaktion
* Abbrechen-Aktion

Verwende keine Dialoge fuer komplexe Langform-Inhalte.

---

## 9.2 Destruktiver Dialog

Beschreibe konkret:

* welches Objekt betroffen ist
* welche Daten verloren gehen
* ob die Aktion rueckgaengig ist
* was anschliessend passiert

Beispiel:

```text
Projekt "Website Relaunch" loeschen?

Alle Aufgaben, Dateien und Aktivitaeten dieses Projekts werden
dauerhaft geloescht. Diese Aktion kann nicht rueckgaengig gemacht werden.

Abbrechen
Projekt loeschen
```

Verwende die destruktive Farbe nur fuer die finale Aktion.

---

## 9.3 Side Panel

Nutze ein Side Panel fuer kontextbezogene Arbeit ohne Verlust der Hauptansicht.

Geeignet fuer:

* Details
* schnelle Bearbeitung
* Filter
* Aktivitaet
* Kommentare
* Einstellungen eines einzelnen Objekts

Nicht geeignet fuer:

* sehr lange Formulare
* mehrere Navigationsebenen
* komplexe Tabellen
* umfangreiche Workflows

---

## 9.4 Bottom Sheet

Verwende auf Mobile ein Bottom Sheet fuer:

* Aktionsauswahl
* Filter
* kurze Objektdetails
* kompakte Auswahl

Verwende eine Vollbildansicht fuer komplexere Inhalte.

---

# 10. Feedback und Status

## 10.1 Lokales Feedback

Zeige Feedback so nah wie moeglich an der Aktion.

Beispiele:

* Status-Chip aendert sich
* Tabellenzeile wird aktualisiert
* Feld zeigt gespeicherten Zustand
* Button zeigt Loading
* neuer Eintrag erscheint sofort

Lokales Feedback hat Vorrang vor globalen Toasts.

---

## 10.2 Snackbar

Nutze `v-snackbar` fuer:

* globale Erfolgsmeldung
* Hintergrundaktion
* Undo
* nicht lokal sichtbare Information

Beispiele:

```text
Projekt archiviert. Rueckgaengig
```

```text
Export wird im Hintergrund erstellt.
```

Verwende keine Snackbar als einzige Darstellung eines kritischen Fehlers.

---

## 10.3 Fehlermeldungen

Unterscheide:

### Feldfehler

Direkt am Eingabefeld.

### Bereichsfehler

Innerhalb der betroffenen Card, Tabelle oder Section.

### Seitenfehler

Im Hauptbereich der View.

### Globaler Systemfehler

Als persistente globale Meldung oder Statusleiste.

Jeder Fehler benoetigt nach Moeglichkeit:

* Problem
* Auswirkung
* naechste Aktion
* Wiederholen-Funktion

Beispiel:

```text
Die Projekte konnten nicht geladen werden.

Deine Filter wurden beibehalten.

Erneut versuchen
```

---

## 10.4 Optimistische Updates

Nutze optimistische Updates fuer:

* Statuswechsel
* Favorisieren
* Zuweisungen
* einfache Einstellungen
* Sortierung
* Archivierung mit Undo

Zeige die Aenderung sofort.

Sende die Anfrage im Hintergrund.

Bei einem Fehler:

* Zustand zuruecksetzen
* Fehler erklaeren
* erneutes Ausfuehren anbieten

Nutze keine optimistischen Updates fuer irreversible oder finanziell relevante Aktionen.

---

# 11. Ladeverhalten

## 11.1 Erster Seitenaufruf

Zeige sofort:

* App Shell
* Seitentitel
* grobe Inhaltsstruktur
* Skeletons fuer dynamische Inhalte

Blockiere nicht die gesamte Anwendung.

---

## 11.2 Routenwechsel

Beim Wechsel zwischen Hauptansichten:

* Navigation sofort aktualisieren
* Titel zeitnah darstellen
* alten Inhalt kontrolliert ersetzen
* Skeleton nur fuer den betroffenen Bereich zeigen
* App Shell stabil halten

Bei schnellen Routenwechseln darf kein auffaelliges Ladeflackern entstehen.

---

## 11.3 Hintergrundaktualisierung

Beim Refresh bereits geladener Daten:

* vorhandene Inhalte sichtbar lassen
* kleine Ladeanzeige an der Tabelle oder Toolbar zeigen
* aktualisierte Werte weich ersetzen
* Scrollposition bewahren

---

## 11.4 Lazy Loading

Lade selten benoetigte Bereiche erst beim Aufruf:

* Analyse-Module
* komplexe Editoren
* grosse Diagrammbibliotheken
* Admin-Bereiche
* Exportfunktionen

Definiere fuer jede Lazy Route einen passenden Ladezustand.

---

# 12. Responsive Konzept

## 12.1 Desktop

Nutze:

* permanenten Navigation Drawer
* globale App Bar
* breite Tabellen
* Split Views
* Side Panels
* sichtbare Toolbar-Aktionen

Desktop ist auf Effizienz und Parallelitaet optimiert.

---

## 12.2 Tablet

Nutze:

* Rail Navigation oder temporaeren Drawer
* reduzierte Aktionsanzahl
* kompakte Tabellen
* Side Panels als Overlay
* groessere Touch-Ziele

Tablet darf nicht nur eine kleinere Desktop-Version sein.

---

## 12.3 Mobile

Nutze:

* temporaeren Navigation Drawer
* kompakte App Bar
* klare Einspaltenstruktur
* Detailseiten statt permanenter Split Views
* Bottom Sheets
* feste untere Hauptaktionen
* Listen statt breiter Tabellen

Priorisiere pro Ansicht:

1. Titel
2. wichtigste Information
3. Hauptaktion
4. relevante Inhalte
5. sekundaere Aktionen

Verschiebe seltene Aktionen in Kontextmenues.

---

## 12.4 Mobile Navigation

Bei komplexen SaaS-Produkten bleibt der Navigation Drawer oft geeigneter als eine Bottom Navigation, wenn mehr als vier oder fuenf Hauptbereiche existieren.

Nutze eine Bottom Navigation nur, wenn:

* hoechstens drei bis fuenf gleichrangige Hauptbereiche bestehen
* diese Bereiche sehr haeufig gewechselt werden
* alle Bereiche leicht mit einem Icon und kurzem Label darstellbar sind

Mische nicht permanent Drawer und Bottom Navigation fuer dieselben Ziele.

---

# 13. Tastatur- und Power-User-Konzept

Unterstuetze mindestens:

```text
Cmd/Ctrl + K    Command Palette
/               Lokale Suche fokussieren
Esc             Dialog, Panel oder Menue schliessen
Enter           Aktives Objekt oeffnen
Cmd/Ctrl + S    Speichern
N               Neues Objekt, wenn kontextuell eindeutig
?               Shortcut-Uebersicht
```

Innerhalb von Listen:

```text
Pfeil hoch      Vorheriges Objekt
Pfeil runter    Naechstes Objekt
Enter           Detail oeffnen
Space           Auswahl umschalten
```

Aktiviere Einzelbuchstaben-Shortcuts nicht waehrend der Texteingabe.

Zeige Shortcuts:

* in Tooltips
* in Menues
* in der Command Palette
* in einer Shortcut-Uebersicht

---

# 14. Rollen und Berechtigungen

Verstecke Funktionen, die fuer einen Nutzer grundsaetzlich nicht verfuegbar sind.

Deaktiviere Funktionen, wenn der Nutzer verstehen soll, dass sie existieren, aktuell aber nicht ausgefuehrt werden koennen.

Erklaere bei deaktivierten Aktionen den Grund:

```text
Nur Administratoren koennen Teammitglieder entfernen.
```

Verwende Routen-Metadaten und Navigation Guards fuer:

* Authentifizierung
* Rollenpruefung
* Feature Flags
* Workspace-Zugriff
* Onboarding-Status

Die UI-Pruefung ersetzt keine serverseitige Berechtigungspruefung.

---

# 15. Designsystem auf Basis von Vuetify

## 15.1 Vuetify nicht unveraendert verwenden

Nutze Vuetify als technische Komponentenbasis, aber definiere eine eigene Produktschicht.

Erstelle Wrapper-Komponenten:

```text
AppButton
AppIconButton
AppPage
AppPageHeader
AppDataTable
AppEmptyState
AppStatus
AppDialog
AppSidePanel
AppFormSection
AppFilterBar
AppSkeleton
```

Die Wrapper kapseln:

* Standardvarianten
* Abstaende
* Radien
* Farben
* States
* Accessibility
* Produktsprache
* responsive Verhalten

Vermeide direkte individuelle Konfiguration derselben Vuetify-Komponente in jeder View.

---

## 15.2 Theme

Definiere mindestens:

* Light Theme
* Dark Theme
* semantische Farben
* Oberflaechenebenen
* Textfarben
* Borderfarben
* Fokusfarbe

Beispielhafte Rollen:

```text
background
surface
surface-variant
surface-elevated
primary
secondary
success
warning
error
info
on-background
on-surface
outline
```

Nutze semantische Namen statt konkreter Farbnamen innerhalb der Anwendung.

---

## 15.3 Density

Definiere drei Dichten:

### Comfortable

Fuer:

* Onboarding
* Marketingnahe Produktbereiche
* einfache Einstellungen
* Mobile

### Default

Fuer:

* allgemeine Produktansichten
* Dashboards
* Formulare

### Compact

Fuer:

* Tabellen
* Admin-Bereiche
* datenintensive Listen
* Power-User-Ansichten

Erlaube bei datenintensiven Bereichen optional eine nutzerspezifische Dichte.

---

## 15.4 Component Defaults

Definiere globale Vuetify Defaults fuer:

* Button-Hoehen
* Input-Varianten
* Rundungen
* Elevation
* Density
* Ripple-Verhalten
* Dialogbreiten
* Tabellenzeilen
* Icon-Groessen

Beispielhafte Richtung:

```text
Buttons:
- keine extremen Pill-Formen fuer alle Buttons
- klare Textlabels
- konsistente Hoehen
- wenige Varianten

Inputs:
- konsistente outlined oder filled Variante
- sichtbare Labels
- klare Fokusdarstellung
- begrenzte Dichte

Cards:
- geringe oder keine Standard-Elevation
- Border oder Flaechenkontrast
- grosse Radien nur bei grossen Modulen

Dialogs:
- deutliche Oberflaechenebene
- feste Titel- und Aktionsstruktur
- responsive Maximalbreite
```

---

# 16. Standardzustand jeder View

Jede Route muss folgende Zustaende definieren:

1. Initial Loading
2. Loaded
3. Empty
4. Search Empty
5. Permission Denied
6. Recoverable Error
7. Fatal Error
8. Offline oder Connection Lost
9. Partial Data
10. Saving oder Updating

Eine View gilt nicht als abgeschlossen, solange nur der Idealzustand gestaltet ist.

---

# 17. Empfohlene Komponenten-Matrix

| Anwendungsfall            | Primaere Vuetify-Komponente           |
| ------------------------- | ------------------------------------- |
| App Shell                 | `v-app`, `v-main`                     |
| Primaere Navigation       | `v-navigation-drawer`, `v-list`       |
| Globale Kopfleiste        | `v-app-bar`, `v-toolbar`              |
| Seitenspezifische Toolbar | `v-toolbar`                           |
| Tabs                      | `v-tabs`, `v-window` oder Router View |
| Kartenmodul               | `v-card`                              |
| Strukturelle Flaeche      | `v-sheet`                             |
| Tabelle                   | `v-data-table`                        |
| Serverseitige Tabelle     | `v-data-table-server`                 |
| Lange lokale Tabelle      | `v-data-table-virtual`                |
| Formular                  | `v-form` und Input-Komponenten        |
| Kurze Auswahl             | `v-menu`                              |
| Kurze fokussierte Aufgabe | `v-dialog`                            |
| Mobile Aktionsauswahl     | `v-bottom-sheet`                      |
| Statusmeldung             | `v-alert`                             |
| Kurzzeitiges Feedback     | `v-snackbar`                          |
| Aktive Filter             | `v-chip`                              |
| Fortschritt               | `v-progress-linear`                   |
| Lokaler Ladevorgang       | `v-progress-circular` oder Skeleton   |
| Akkordeon                 | `v-expansion-panels`                  |
| Globale Suche             | Dialog, Text Field und List           |
| Tooltip                   | `v-tooltip`                           |
| Datum                     | passender Date Input oder Picker      |
| Auswahl vieler Optionen   | `v-autocomplete`                      |

---

# 18. Referenzablauf: Objektverwaltung

## Liste

Der Nutzer oeffnet den Bereich "Projekte".

Die View zeigt:

* Titel "Projekte"
* Button "Neues Projekt"
* Suchfeld
* direkte Filter
* gespeicherte Ansicht
* Tabelle
* Ergebnisanzahl

## Auswahl

Der Nutzer klickt eine Zeile.

Auf Desktop:

* Inspector oeffnet sich
* URL aktualisiert sich
* Tabelle bleibt sichtbar
* Scrollposition bleibt erhalten

Auf Mobile:

* Detailroute oeffnet sich

## Bearbeitung

Kleine Aenderungen erfolgen direkt im Inspector.

Komplexe Bearbeitung oeffnet eine eigene Edit-Route.

## Speichern

Die Anwendung zeigt den Status direkt im betroffenen Bereich.

Bei Erfolg:

* Daten werden aktualisiert
* kurzer lokaler Erfolgszustand erscheint
* Inspector bleibt geoeffnet

Bei Fehler:

* Eingaben bleiben erhalten
* betroffener Bereich zeigt den Fehler
* Wiederholen ist moeglich

## Zurueck

Der Nutzer kehrt zur Liste zurueck.

Erhalten bleiben:

* Suchbegriff
* Filter
* Sortierung
* Seitenzahl
* Scrollposition
* Tabellenansicht

Dieses Verhalten ist ein zentraler Bestandteil der wahrgenommenen Produktqualitaet.

---

# 19. Referenzablauf: Erstellen eines Objekts

1. Nutzer aktiviert "Neues Projekt".
2. Eine eigene Route oder ein Side Panel oeffnet sich.
3. Das erste sinnvolle Feld erhaelt Fokus.
4. Das Formular zeigt nur notwendige Felder.
5. Erweiterte Felder bleiben eingeklappt.
6. Validierung erfolgt nach Interaktion.
7. Die Hauptaktion benennt das Ergebnis: "Projekt erstellen".
8. Nach Erfolg wird das neue Projekt angezeigt.
9. Eine Snackbar bietet bei Bedarf eine Folgeaktion.
10. Browser-Zurueck fuehrt zur vorherigen Liste mit erhaltenem Zustand.

---

# 20. Usability-Prinzipien

## Orientierung vor Dekoration

Der Nutzer erkennt jederzeit:

* aktuellen Bereich
* aktuelles Objekt
* aktuellen Zustand
* naechste Aktion
* Rueckweg

## Kontext vor globaler Aktion

Zeige Aktionen moeglichst dort, wo sie wirken.

## Zustand vor Seite

Denke in:

* Listenstatus
* Auswahlstatus
* Ladezustand
* Bearbeitungszustand
* Fehlerzustand
* Berechtigungszustand

Nicht nur in statischen Screens.

## Direkte Manipulation vor Dialogketten

Erlaube kleine Aenderungen direkt im Kontext.

## Erhaltung vor Reset

Bewahre Filter, Scrollposition und Auswahl, wenn Nutzer zwischen Liste und Detail wechseln.

## Progressive Disclosure vor Ueberladung

Zeige Standardfunktionen sofort und Expertenfunktionen bei Bedarf.

## Rueckgaengig vor Bestaetigen

Nutze bei reversiblen Aktionen Undo statt zusaetzlicher Dialoge.

## Geschwindigkeit vor visueller Inszenierung

Jede Interaktion soll direkt reagieren.

---

# 21. Verbindliche Regeln fuer die AI

Beim Erstellen einer View:

1. Bestimme zuerst die Hauptaufgabe der View.
2. Bestimme die primaere Aktion.
3. Waehle das passende SPA-Pattern.
4. Definiere URL und Routenstruktur.
5. Lege App-Shell- und Seitenbereiche fest.
6. Definiere Desktop-, Tablet- und Mobile-Verhalten.
7. Waehle passende Vuetify-Komponenten.
8. Definiere Loading, Empty, Error und Permission States.
9. Definiere Keyboard- und Fokusverhalten.
10. Definiere, welcher Zustand beim Navigieren erhalten bleibt.
11. Verwende Design Tokens und zentrale Wrapper-Komponenten.
12. Nutze Cards nur fuer eigenstaendige Module.
13. Platziere Aktionen nahe am betroffenen Inhalt.
14. Begrenze jeden Bereich auf eine primaere Aktion.
15. Speichere navigationsrelevanten Zustand in der URL.
16. Verhindere Layout Shifts und unnoetige Fullscreen-Loader.
17. Nutze Side Panels nur fuer kontextbezogene, begrenzte Aufgaben.
18. Nutze eigene Routen fuer komplexe Workflows.
19. Halte Browser-Zurueck und Deep Links funktionsfaehig.
20. Priorisiere Arbeitsgeschwindigkeit, Klarheit und Zustandserhaltung.

---

# 22. Zu vermeidende Muster

* Vollstaendiger Reload bei interner Navigation
* Verlust von Filtern beim Oeffnen eines Details
* Verlust der Scrollposition beim Zurueckkehren
* globale Spinner fuer lokale Ladevorgaenge
* Dialoge fuer komplexe Seiten
* Side Panels mit eigener tiefer Navigation
* Tabellen auf Mobile nur horizontal verkleinern
* wichtige Zustaende nur durch Farbe anzeigen
* mehrere dominante Buttons im selben Bereich
* dauerhaft sichtbare Toolbars ohne relevante Aktionen
* unklare Icon-Buttons ohne Tooltip oder Label
* nicht teilbare Ansichten durch rein lokalen Navigationszustand
* Tabs ohne URL-Abbildung bei wichtigen Unterbereichen
* generische Fehler ohne Wiederholungsmoeglichkeit
* direkte destruktive Aktionen ohne Undo oder Bestaetigung
* ungespeicherte Aenderungen ohne Navigationsschutz
* uneinheitlich konfigurierte Vuetify-Komponenten
* uebermaessige Verwendung von Cards, Elevation und Ripple-Effekten
* ungefilterte Darstellung der gesamten Vuetify-Designsprache ohne eigene Produktidentitaet

---

# 23. Zielbild

Das Endergebnis ist eine schnelle, ruhige und leistungsfaehige SaaS-Anwendung.

Die App Shell vermittelt Stabilitaet.

Die URL bildet den relevanten Arbeitszustand ab.

Listen und Details greifen ohne Kontextverlust ineinander.

Vuetify sorgt fuer konsistente Grundkomponenten.

Eine eigene Designsystem-Schicht sorgt fuer Markencharakter, Dichte, Hierarchie und einheitliches Verhalten.

Die Anwendung funktioniert gleichermassen fuer:

* neue Nutzer
* regelmaessige Nutzer
* Power User
* Mausbedienung
* Tastaturbedienung
* Desktop
* Tablet
* Mobile
* Light Mode
* Dark Mode
