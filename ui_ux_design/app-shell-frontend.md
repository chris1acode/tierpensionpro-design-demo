# App Shell: SaaS Frontend

Gilt fuer die produktive Anwendung (eingeloggter Bereich). Ergaenzt die allgemeinen Prinzipien aus `design-allgemein.md`.

## 1. Grundstruktur

Die App Shell besteht aus drei stabilen Zonen:

* **Hauptnavigation** — persistent, links oder oben, immer sichtbar
* **Kontextbereich** — optionaler sekundaerer Bereich (z.B. Sub-Navigation, Filter-Panel)
* **Inhaltsbereich** — flexibel, wechselt je nach Route

Die App Shell bleibt beim Seitenwechsel stabil. Nur der Inhaltsbereich wird ausgetauscht.

## 2. Inhaltsbereich: Breite und Zentrierung

* Der Inhaltsbereich hat eine maximale Breite von 1280 px (Token: `--content-max-width`).
* Ueberschreitet der Viewport diese Breite, wird der Inhalt horizontal zentriert.
* Der Inhaltsbereich liegt niemals direkt am Viewport-Rand — verwende konsistentes horizontales Padding (Empfehlung: mindestens 24 px links und rechts).
* Navigation, Header und Sidebar sind von dieser Breitenbegrenzung ausgenommen und koennen sich ueber die volle Breite erstrecken.

Nicht tun:

* Keine unbegrenzte Ausdehnung des Inhaltsbereichs auf sehr breiten Bildschirmen.
* Kein Inhaltsbereich, der linksseitig am Viewport-Rand klebt, wenn genug Platz vorhanden ist.

## 3. Hauptnavigation

* Zeige alle Hauptbereiche der Anwendung dauerhaft sichtbar.
* Kennzeichne den aktiven Bereich eindeutig (Farbe, Gewicht, Indikator).
* Nutze Icons mit Textlabels — niemals nur Icons ohne Label.
* Gruppiere verwandte Navigationspunkte visuell.
* Trenne Hauptnavigation, Seitentitel und Hauptaktionen optisch voneinander.
* Zeige Nutzer-Account und globale Einstellungen als festen Bestandteil der Navigation (z.B. unten oder in der Header-Leiste).

Nicht tun:

* Keine versteckte Hauptnavigation auf grossen Screens.
* Keine Navigation, die bei jedem Seitenwechsel ihre Position veraendert.
* Keine unklaren Zurueck-Wege ohne Breadcrumb oder Kontextanzeige.

## 3. Breadcrumbs

* Verwende Breadcrumbs nur bei echter hierarchischer Tiefe (3 oder mehr Ebenen).
* Zeige immer den aktuellen Kontext, nicht nur den Pfad.
* Erlaube direkte Navigation zu jeder Ebene per Klick.

## 4. Command Palette

* Integriere eine globale Command Palette (Shortcut: Cmd+K / Ctrl+K).
* Erlaube darueber:
  * Navigation zu beliebigen Bereichen
  * Suche ueber alle Inhalte
  * Erstellen neuer Objekte
  * Oeffnen zuletzt verwendeter Bereiche
  * Ausfuehren globaler Aktionen
  * Aufrufen von Einstellungen
* Zeige Keyboard Shortcuts sichtbar an (in der Palette und bei relevanten Aktionen).
* Halte die Palette leicht erreichbar und reaktionsschnell.

## 5. Navigation zwischen Liste und Detail

* Zeige beim Wechsel von Liste zu Detail, woher der Nutzer kommt.
* Biete einen klar erkennbaren Weg zurueck (Back-Button, Breadcrumb oder List-Detail-Layout).
* Verwende Motion, um die raeumliche Beziehung zwischen Liste und Detail zu vermitteln.

## 6. Keyboard und Power-User-Unterstuetzung

* Halte alle wichtigen Funktionen per Tastatur erreichbar.
* Unterstuetze schnelle Workflows ohne Maus.
* Biete zuletzt verwendete Bereiche und haeufige Aktionen schnell erreichbar an.
* Zeige relevante Shortcuts dort, wo die Aktion angeboten wird.

## 7. Loading und Navigation

* Rendere die App Shell sofort — Inhaltsbereich laedt nach.
* Halte Navigation und App Shell waehrend des Ladens voll nutzbar.
* Lade wahrscheinliche naechste Ansichten vor (Prefetching).
* Nutze Route-basiertes Code Splitting fuer schwere Bereiche.
* Blockiere niemals die Navigation durch lokale Ladezustaende.

## 8. Responsive Verhalten der App Shell

* Auf kleinen Screens: Hauptnavigation als Bottom Navigation oder ausklappbares Drawer-Menue.
* Kontextpanels: Verwende auf Mobile Bottom Sheets oder Fullscreen Panels statt Side Panels.
* Informationsdichte anpassen — nicht nur verkleinern.
* Tabellen auf Mobile durch alternative Listendarstellungen ersetzen.
* Touch-Ziele mindestens 44 px gross halten.

Nicht tun:

* Keine einfache Verkleinerung der Desktop-Ansicht fuer Mobile.
* Keine Desktop-Hover-Interaktionen als einzigen Zugangspunkt auf Touchgeraeten.
