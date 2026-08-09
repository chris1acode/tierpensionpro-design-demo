# Allgemeine UI Design Prinzipien

Gilt fuer alle Oberflaechentypen: SaaS-Applikation, Landing Page, Marketing-Seiten.

## 0. Markenname

* Der Produktname lautet **Tierpension Pro** — mit Leerzeichen zwischen „Tierpension" und „Pro".
* „Tierpension" wird in der Standardtextfarbe (Schwarz bzw. Dark Mode Equivalent) gesetzt.
* „Pro" wird in der primaeren Markenfarbe (`--color-primary`) gesetzt.
* Diese Schreibweise gilt fuer alle sichtbaren Nennungen des Produktnamens: Logotype, Seitentitel, Onboarding, Marketing.
* Niemals zusammengeschrieben: ~~TierpensionPro~~ oder ~~tierpensionpro~~.

## 1. Visuelle Richtung

* Verwende einen klaren, konsistenten Designstil.
* Kombiniere ruhigen Minimalismus mit wenigen markanten visuellen Elementen.
* Entwickle eine erkennbare visuelle Identitaet, die auch ohne Logo funktioniert.
* Nutze eine charakteristische Akzentfarbe, Typografie, Formensprache oder ein wiederkehrendes grafisches Motiv.
* Gestalte jede Oberflaeche wie ein professionelles Produkt, nicht wie eine beliebige Template-Seite.
* Bevorzuge Praezision, Klarheit und Charakter gegenueber dekorativer Komplexitaet.

Nicht tun:

* Keine beliebige Mischung aus Glassmorphism, Brutalismus, Neon, Retro, 3D und anderen Trends.
* Keine austauschbare Optik ohne eigenen Charakter.
* Keine dekorativen Elemente ohne funktionalen oder visuellen Zweck.

## 2. Informationshierarchie

* Mache innerhalb weniger Sekunden deutlich:
  * Wo sich der Nutzer befindet.
  * Was auf der Seite wichtig ist.
  * Welche Aktion als Naechstes moeglich ist.
* Verwende pro View eine dominante Seitenueberschrift.
* Definiere pro Bereich eine klare Hauptaktion.
* Ordne Inhalte in klar erkennbare Gruppen.
* Nutze grosszuegige Abstaende zwischen Bereichen und kleinere Abstaende innerhalb zusammengehoeriger Gruppen.
* Verwende ein konsistentes Raster.
* Nutze offene Flaechen, Spalten, Hintergrundwechsel und Separatoren zur Strukturierung.

Nicht tun:

* Nicht jedes Element in eine Card setzen.
* Keine mehrfach verschachtelten Cards.
* Keine gleichzeitige visuelle Betonung aller Inhalte.
* Keine zufaelligen oder uneinheitlichen Abstaende.

## 3. Spacing und Groessen

* Verwende ein 4-Pixel-basiertes Spacing-System.
* Nutze bevorzugt diese Abstaende:
  * 4 px
  * 8 px
  * 12 px
  * 16 px
  * 24 px
  * 32 px
  * 48 px
  * 64 px
* Verwende kleine Abstaende innerhalb von Komponenten.
* Verwende mittlere Abstaende zwischen verwandten Elementen.
* Verwende grosse Abstaende zwischen Inhaltsgruppen.
* Verwende sehr grosse Abstaende zwischen Hauptbereichen.
* Lege feste Groessen fuer Controls, Inputs, Buttons und Navigationselemente fest.
* Definiere eine maximale Inhaltsbreite (Empfehlung: 1280 bis 1440 px).
* Zentriere Inhaltsbereiche horizontal, wenn der Viewport diese Breite ueberschreitet.
* Stelle sicher, dass der Inhaltsbereich bei schmalen Viewports durch konsistentes horizontales Padding vom Rand abgesetzt bleibt.

## 4. Typografie

* Verwende eine klare, moderne UI-Schrift.
* Verwende optional eine zweite charakterstarke Schrift nur fuer grosse Headlines.
* Nutze eine feste Typografie-Skala.
* Empfohlene Groessen:
  * Display: 48 bis 64 px
  * Seitentitel: 32 bis 40 px
  * Abschnittstitel: 22 bis 28 px
  * Card-Titel: 16 bis 18 px
  * Fliesstext: 14 bis 16 px
  * Metadaten: 12 bis 13 px
* Nutze Schriftgroesse, Gewicht, Farbe und Abstand zur Darstellung von Hierarchie.
* Verwende gut lesbare Zeilenhoehen.
* Halte Textspalten ausreichend schmal fuer angenehmes Lesen.
* Schreibe kurze, konkrete und aktive UI-Texte.

Nicht tun:

* Keine zufaelligen Schriftgroessen.
* Keine extrem duennen Schriftschnitte fuer kleine Texte.
* Keine unklaren Button-Texte wie "OK", "Weiter" oder "Bestaetigen", wenn eine konkrete Aktion benannt werden kann.

## 5. Farben

* Verwende eine neutrale Grundpalette.
* Definiere eine primaere Markenfarbe.
* Definiere eine zusaetzliche Akzentfarbe nur bei echtem Bedarf.
* Definiere semantische Farben fuer:
  * Erfolg
  * Warnung
  * Fehler
  * Information
* Verwende die Markenfarbe gezielt fuer Aktionen, Auswahl, Fokus und Fortschritt.
* Verwende leicht getoente Flaechen statt ausschliesslich reinem Weiss oder Schwarz.
* Stelle ausreichenden Kontrast zwischen Text, Controls und Hintergruenden sicher.
* Passe Farben fuer Light Mode und Dark Mode separat an.

Nicht tun:

* Die Markenfarbe nicht gleichzeitig fuer Ueberschriften, Icons, Buttons, Charts und Hintergruende verwenden.
* Keine schwachen Textkontraste.
* Kein einfaches Invertieren der Farben fuer Dark Mode.
* Keine rein dekorative Farbvielfalt.

## 6. Oberflaechen und Tiefe

* Definiere klare Oberflaechenebenen:
  * Canvas
  * Surface
  * Elevated Surface
  * Overlay
  * Modal
* Weise jeder Ebene feste Werte fuer Hintergrund, Border, Schatten und Blur zu.
* Nutze leichte Schatten, subtile Transparenz und kontrollierte Ueberlagerungen.
* Verwende Tiefe zur Verdeutlichung von Hierarchie und Interaktion.
* Nutze groessere Radien fuer Modals, Panels und grosse Flaechen.
* Nutze kleinere Radien fuer Inputs, Tabellen und kompakte Controls.
* Verwende eine kleine feste Radius-Skala.

Nicht tun:

* Kein Blur auf allen Elementen.
* Keine starken schwarzen Schatten.
* Keine Transparenz, wenn dadurch Lesbarkeit oder Kontrast sinkt.
* Keine uneinheitlichen Radien.

## 7. Komponenten

* Erstelle ein konsistentes Komponentensystem.
* Definiere fuer jede Komponente alle wichtigen Zustaende:
  * Default
  * Hover
  * Active
  * Focus
  * Loading
  * Disabled
  * Error
* Definiere fuer Buttons:
  * Primary
  * Secondary
  * Tertiary oder Ghost
  * Destructive
  * Icon Button
* Verwende pro Bereich hoechstens eine dominante Primaeraktion.
* Nutze eine einheitliche Icon-Familie.
* Verwende Icons mit konsistenter Strichstaerke und optischer Groesse.
* Kombiniere unbekannte Icons mit Textlabels.
* Halte zwischen Icon und begleitendem Text einen Mindestabstand von 8 px ein.
* Verwende niemals direkt angrenzende Icons und Textelemente ohne Zwischenraum.

Nicht tun:

* Keine gleichwertige Darstellung vieler konkurrierender Aktionen.
* Keine Mischung verschiedener Icon-Stile.
* Keine wichtigen Aktionen ausschliesslich hinter Hover verstecken.
* Keine Tooltips als Ersatz fuer notwendige Labels verwenden.

## 8. Interaktion und Feedback

* Gib nach jeder Nutzeraktion sofort sichtbares Feedback.
* Aktualisiere Inhalte bei geeigneten Aktionen optimistisch.
* Zeige Lade-, Erfolgs- und Fehlerzustaende direkt am betroffenen Element.
* Verwende Toasts nur fuer globale oder nicht lokal darstellbare Rueckmeldungen.
* Zeige deutlich, wenn Daten gespeichert, synchronisiert oder verarbeitet werden.
* Mache reversible Aktionen rueckgaengig.
* Zeige bei destruktiven Aktionen klare Konsequenzen.
* Nutze Inline-Bestaetigungen, Statuswechsel und hervorgehobene Zeilen.

Nicht tun:

* Hover nicht als einziges Feedback verwenden.
* Keine Aktion ohne sichtbare Reaktion.
* Keine generischen Fehlermeldungen.
* Keine bestaetigenden Dialoge fuer harmlose, leicht rueckgaengig machbare Aktionen.

## 9. Motion und Animation

* Nutze Animationen zur Erklaerung von Zustandswechseln.
* Zeige durch Bewegung, woher ein Element kommt und wohin es verschwindet.
* Verwende Motion fuer:
  * Panels
  * Modals
  * Tabs
  * Expand- und Collapse-Zustaende
  * Sortierungen
  * Listenveraenderungen
* Verwende kurze, konsistente Animationszeiten:
  * Hover: 100 bis 160 ms
  * Kleine Zustaende: 160 bis 220 ms
  * Panels und Modals: 220 bis 320 ms
  * View Transitions: 300 bis 450 ms
* Verwende wenige zentrale Easing-Kurven.
* Unterstuetze reduced motion.

Nicht tun:

* Keine Animation nur zur Selbstdarstellung.
* Keine langen oder blockierenden Uebergaenge.
* Keine permanenten Bewegungseffekte.
* Keine dramatischen Marketinganimationen innerhalb produktiver Arbeitsbereiche.

## 10. Formulare

* Verwende immer sichtbare Labels.
* Gruppiere zusammengehoerige Felder.
* Platziere Hilfetexte direkt am zugehoerigen Feld.
* Verwende sinnvolle Standardwerte.
* Blende selten benoetigte Optionen unter erweiterten Einstellungen ein.
* Zeige Fehler direkt am Feld.
* Erklaere konkret, wie ein Fehler behoben werden kann.
* Bewahre eingegebene Werte bei Fehlern.
* Verwende passende Eingabetypen und Formatierungen.
* Zeige Speichern, Laden und Validieren klar an.

Nicht tun:

* Placeholder nicht als Ersatz fuer Labels verwenden.
* Keine Fehlertexte wie "Ungueltige Eingabe".
* Keine Validierung, die beim ersten Tastendruck stoert.
* Keine unnoetig langen Formulare ohne Gruppierung.

## 11. Tabellen und datenreiche Ansichten

* Verwende Sticky Header.
* Richte Zahlen rechtsbuendig aus.
* Richte Text linksbuendig aus.
* Zeige Sortierung, Filter und Auswahl deutlich.
* Unterstuetze Mehrfachauswahl.
* Biete kontextbezogene Zeilenaktionen.
* Erlaube eine kompakte Darstellung fuer Power User.
* Verwende klare Spaltenbezeichnungen.
* Formatiere Datum, Zeit, Waehrungen und Zahlen konsistent.
* Zeige leere Werte eindeutig.
* Erhalte Spaltenbreiten und wichtige Informationen auch bei kleineren Viewports.
* Nutze auf Mobile alternative Listendarstellungen statt unbrauchbarer Tabellen.

Nicht tun:

* Keine bedeutungslosen Tabellen mit zu vielen sichtbaren Spalten.
* Keine wichtigen Aktionen ausschliesslich in versteckten Menues.
* Keine horizontalen Scrollbereiche ohne klare Orientierung.
* Keine uneinheitliche Zahlenformatierung.

## 12. Dashboards und Datenvisualisierung

* Zeige nur Kennzahlen, die eine Entscheidung unterstuetzen.
* Ergaenze jede wichtige Kennzahl um Kontext:
  * Vergleich zur Vorperiode
  * Zielwert
  * Trend
  * Status
  * Ursache
  * moegliche Aktion
* Verwende Diagramme nur, wenn sie eine Frage schneller beantworten als Text oder Zahlen.
* Nutze wenige, semantisch klare Diagrammfarben.
* Hebe relevante Abweichungen hervor.
* Erklaere ungewoehnliche Werte.
* Zeige Filterzeitraum und Datengrundlage sichtbar.

Nicht tun:

* Keine dekorativen Diagramme ohne Aussage.
* Keine Kennzahlen ohne Kontext.
* Keine ueberladenen Dashboards.
* Keine zu vielen Farben innerhalb eines Charts.

## 13. Progressive Disclosure

* Zeige zuerst nur die fuer die aktuelle Aufgabe relevanten Informationen.
* Verstecke selten verwendete Optionen hinter:
  * Details Panels
  * Expand-Bereichen
  * Popovers
  * Advanced Settings
  * Kontextmenues
* Erhalte dennoch schnellen Zugriff fuer erfahrene Nutzer.
* Zeige komplexe Informationen schrittweise.
* Nutze klare Standardwerte.

Nicht tun:

* Nicht alle Funktionen gleichzeitig sichtbar machen.
* Keine wichtigen Kernfunktionen tief verstecken.
* Keine unnoetige Wizard-Schritte fuer einfache Aufgaben.

## 14. Empty States

* Gestalte jeden leeren Zustand als hilfreichen Einstieg.
* Erklaere:
  * Was in diesem Bereich spaeter erscheint.
  * Warum dieser Bereich nuetzlich ist.
  * Welche erste Aktion moeglich ist.
* Platziere eine klare primaere Aktion.
* Nutze optional eine dezente Illustration oder ein markentypisches grafisches Element.
* Passe Empty States an Ursache und Kontext an.

Nicht tun:

* Nicht nur "Keine Daten vorhanden" anzeigen.
* Keine dekorative Illustration ohne konkrete Handlungsoption.
* Keine Sackgassen ohne naechsten Schritt.

## 15. Loading States

* Verwende Skeletons, die der spaeteren Inhaltsstruktur entsprechen.
* Reserviere vorab Platz fuer dynamische Inhalte.
* Verwende optimistische Updates bei schnellen und sicheren Aktionen.
* Zeige bei laengeren Vorgaengen Fortschritt oder aktuellen Status.
* Verhindere Layout Shifts.

Nicht tun:

* Keine zufaelligen grauen Balken.
* Keine blockierenden Fullscreen-Loader fuer lokale Aktionen.
* Keine springenden Layouts nach dem Laden.
* Keine endlosen Spinner ohne Erklaerung.

## 16. Responsive Design

* Gestalte Komponenten fuer unterschiedliche Containerbreiten.
* Passe nicht nur Groessen, sondern auch Struktur und Prioritaet an.
* Veraendere auf kleineren Screens:
  * Navigation
  * Aktionspositionen
  * Informationsdichte
  * Tabellen
  * Panels
  * Eingabemethoden
* Halte Touch-Ziele ausreichend gross.
* Verwende Container Queries, wenn Komponenten in verschiedenen Layoutkontexten vorkommen.

Nicht tun:

* Keine einfache Verkleinerung der Desktop-Ansicht.
* Nicht alle Inhalte auf Mobile nur untereinander stapeln.
* Keine kleinen Touch-Ziele.
* Keine Desktop-Hover-Interaktionen als Voraussetzung auf Touchgeraeten.

## 17. Accessibility

* Stelle ausreichende Farbkontraste sicher.
* Verwende sichtbare Fokuszustaende.
* Halte alle wichtigen Funktionen per Tastatur erreichbar.
* Verwende semantisch korrekte Controls.
* Nutze Labels und Beschreibungen fuer Formulare und Icons.
* Unterstuetze reduced motion.
* Kommuniziere Statusaenderungen auch ohne Farbe.
* Vermeide, dass Overlays fokussierte Elemente verdecken.
* Stelle ausreichende Touch- und Klickflaechen bereit.

Nicht tun:

* Fokusindikatoren niemals entfernen.
* Informationen nicht nur durch Farbe vermitteln.
* Keine Interaktionen, die ausschliesslich mit Maus oder Hover funktionieren.
* Keine unbeschrifteten Controls.

## 18. Dark Mode

* Entwickle Dark Mode als eigenes Oberflaechensystem.
* Definiere mehrere dunkle Flaechenebenen.
* Passe Textkontraste, Borders, Schatten und Diagrammfarben separat an.
* Reduziere zu starke Saettigung heller Akzentfarben.
* Teste alle Interaktionszustaende in beiden Modi.
* Erhalte die gleiche visuelle Hierarchie wie im Light Mode.

Nicht tun:

* Keine einfache Farbinvertierung.
* Kein reines Schwarz als Standardhintergrund fuer alle Ebenen.
* Keine leuchtenden Neonfarben fuer grosse Flaechen.
* Keine verlorenen Borders oder Fokuszustaende.

## 19. Micro-Delight

* Nutze kleine besondere Momente an relevanten Stellen.
* Verwende dezente Animationen fuer:
  * Erfolgreiches Onboarding
  * Erreichte Ziele
  * Abgeschlossene Prozesse
  * Besondere Meilensteine
* Halte Micro-Delight kurz, optional und nicht blockierend.
* Passe diese Momente an die Markenidentitaet an.

Nicht tun:

* Kein Konfetti fuer alltaegliche Aktionen.
* Keine Sounds ohne Kontrolle durch den Nutzer.
* Keine verspielten Effekte in kritischen Workflows.

## 20. Performance

* Lade schwere Bereiche nur bei Bedarf.
* Nutze Lazy Loading und Code Splitting.
* Halte Filter, Suche und Navigation lokal und direkt reaktiv.
* Vermeide unnoetige Layout-Neuberechnungen.
* Nutze optimistische Updates.
* Halte Animationen fluessig.
* Begrenze komplexe Blur-, Shadow- und 3D-Effekte.
* Gestalte Ladezustaende als Teil des Designs.

Nicht tun:

* Keine schwere Animation im Hauptworkflow.
* Keine visuellen Effekte auf Kosten der Reaktionsgeschwindigkeit.
* Keine unnoetig grossen Medien oder Bibliotheken.

## 21. Design Tokens

Definiere zentrale Tokens fuer:

* Farben
* Typografie
* Abstaende
* Radien
* Schatten
* Borders
* Animationen
* Z-Index
* Komponentenhoehen
* Responsive Breakpoints
* Informationsdichte

Verwende keine frei erfundenen Einzelwerte innerhalb von Komponenten.

Beispiel:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;

--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 18px;
--radius-xl: 24px;

--motion-fast: 140ms;
--motion-normal: 220ms;
--motion-slow: 360ms;

--content-max-width: 1280px;
--gap-icon-text: 8px;
```

## 22. Qualitaetskontrolle

Pruefe jeden Screen anhand dieser Fragen:

* Ist die wichtigste Information sofort sichtbar?
* Ist die primaere Aktion eindeutig?
* Sind verwandte Inhalte klar gruppiert?
* Ist das Interface auch ohne Farbe verstaendlich?
* Sind alle wichtigen Zustaende gestaltet?
* Funktioniert der Screen mit langen, kurzen, fehlenden und fehlerhaften Daten?
* Funktioniert der Screen per Tastatur?
* Funktioniert der Screen auf kleinen und grossen Breiten?
* Bleibt das Layout beim Laden stabil?
* Ist jedes dekorative Element funktional oder markenbildend?
* Ist die Anwendung schnell und direkt reaktiv?
* Ist die visuelle Sprache auf allen Screens konsistent?

## 23. Abschliessende Gestaltungsregel

Jedes sichtbare Element muss mindestens eine dieser Aufgaben erfuellen:

* Hierarchie verbessern.
* Orientierung geben.
* Interaktion erklaeren.
* Markencharakter erzeugen.
* Vertrauen schaffen.
* Eine Entscheidung erleichtern.

Entferne Elemente, die keine dieser Aufgaben erfuellen.
