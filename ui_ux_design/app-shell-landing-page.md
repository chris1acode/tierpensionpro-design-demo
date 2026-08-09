# App Shell: Landing Page

Gilt fuer oeffentliche Marketing- und Landing-Page-Bereiche (nicht eingeloggter Bereich). Ergaenzt die allgemeinen Prinzipien aus `design-allgemein.md`.

## 1. Grundstruktur

Die Landing Page besteht aus drei Zonen:

* **Header** — globale Navigation und primaere CTA, bleibt beim Scrollen sichtbar (sticky)
* **Sektionen** — vertikal gestapelte, thematisch abgeschlossene Inhaltsbereiche
* **Footer** — sekundaere Links, rechtliche Pflichtinhalte, Kontakt

Es gibt keinen persistenten App-Shell-Seitenbereich. Jede Sektion ist eigenstaendig.

## 2. Header-Navigation

* Sticky Header: bleibt beim Scrollen am oberen Rand sichtbar.
* Enthalte: Logo links, Hauptnavigationspunkte zentriert oder rechts, CTA-Button ganz rechts.
* Zeige maximal 5 bis 7 Navigationspunkte — weitere Punkte unter einem "Mehr"-Menue.
* Hebe den CTA-Button visuell klar als Primaeraktion ab (andere Farbe, gefuellt).
* Nutze einen transparenten oder halbtransparenten Header im Hero-Bereich, der beim Scrollen undurchsichtig wird.

Nicht tun:

* Keine Navigation, die beim Scrollen verschwindet (ohne Sticky-Verhalten).
* Kein Header ohne erkennbaren CTA.
* Keine ueberladene Navigation mit zu vielen Punkten auf erster Ebene.

## 3. Hero-Sektion

* Die Hero-Sektion ist der erste Eindruck — sie muss innerhalb von 3 Sekunden klarmachen:
  * Was das Produkt ist.
  * Fuer wen es ist.
  * Was der naechste Schritt ist.
* Enthalte: Headline, Subheadline, primaerer CTA-Button, optional sekundaerer CTA.
* Verwende eine visuelle Unterstuetzung: Screenshot, Illustration oder kurzes Video.
* Halte die Hero-Sektion hoch, aber nicht vollbild — der Nutzer soll sehen, dass es weiteres Scrollen gibt.
* Verwende die groessten Typografie-Werte der Seite nur in der Hero-Sektion.

Nicht tun:

* Keine Fullscreen-Hero ohne Hinweis auf Folgeinhalt.
* Keine generischen Stockfotos ohne Produktbezug.
* Keinen CTA-Text wie "Loslegen" ohne Kontext — konkret benennen: "Kostenlos testen", "Demo anfordern".

## 4. Inhalts-Sektionen

* Jede Sektion hat eine klar erkennbare Aufgabe (Problem, Loesung, Feature, Social Proof, Preise, CTA).
* Setze visuelle Abgrenzungen zwischen Sektionen: Hintergrundwechsel, grosse Abstaende oder dezente Trennlinien.
* Beschraenke jede Sektion auf eine Kernaussage.
* Biete in langen Seiten mehrfach CTAs an — nicht nur am Ende.
* Nutze abwechselnde Layout-Muster (Text links/Bild rechts, zentriert, Grid), um visuelle Monotonie zu vermeiden.

Nicht tun:

* Keine Sektionen ohne erkennbare Funktion im Kaufentscheidungsprozess.
* Keine endlose Textwueste ohne visuelle Auflockerung.
* Kein einzelner CTA am Seitenende als einzige Handlungsoption.

## 5. Social Proof und Vertrauen

* Zeige Kundenstimmen, Logos, Bewertungen oder Fallstudien nah am CTA.
* Nutze echte Namen, Fotos und konkrete Ergebnisse — keine anonymen Aussagen.
* Platziere Vertrauenselemente (Zertifikate, Datenschutz, Testberichte) in der Naehe von Kaufentscheidungspunkten.

## 6. Preissektion

* Stelle Preisplaene klar vergleichbar dar.
* Hebe den empfohlenen Plan visuell hervor.
* Zeige den Preis inklusive aller relevanten Informationen (pro Monat, pro Jahr, pro Nutzer).
* Erklaere Unterschiede in einfacher Sprache.
* Platziere je einen CTA direkt bei jedem Plan.

## 7. Footer

* Enthalte: Logo, Navigationsgruppen, rechtliche Links (Impressum, Datenschutz, AGB), ggf. Social Links.
* Gliedere den Footer in logische Spaltengruppen.
* Nutze den Footer nicht als Hauptnavigation — er ergaenzt, nicht ersetzt.
* Verwende kleinere Typografie und gedaempfte Farben gegenueber dem Hauptinhalt.

Nicht tun:

* Keinen Footer ohne rechtlich notwendige Links.
* Kein ueberladener Footer mit zu vielen Navigationspunkten.

## 8. Mobile Navigation

* Ersetze auf kleinen Screens die horizontale Navigation durch ein Hamburger-Menue oder ein Drawer-Panel.
* Das Menue soll als Overlay oder Side Drawer erscheinen, nicht als Dropdown in der Header-Leiste.
* Halte den CTA-Button auch auf Mobile im Header sichtbar.
* Schliesse das Menue automatisch nach Klick auf einen Navigationspunkt.

Nicht tun:

* Keine Navigation, die auf Mobile komplett verschwindet.
* Kein horizontales Scrollen der Header-Navigation auf kleinen Screens.

## 9. Performance und Ladezeit

* Rendere die Hero-Sektion sofort — kein Warten auf JavaScript.
* Optimiere alle Bilder (WebP, korrekte Groessen, Lazy Loading ausserhalb des Viewports).
* Vermeide schwere Animationen im Hero-Bereich, die das Rendering blockieren.
* Messe und optimiere Core Web Vitals: LCP, CLS, INP.

Nicht tun:

* Keine grossen unkomprimierten Bilder im Hero.
* Keine blockierenden Skripte im Head.
* Kein Layout Shift durch nachladende Inhalte im sichtbaren Bereich.

## 10. Animationen auf der Landing Page

* Nutze Scroll-Animationen sparsam — nur zur Aufmerksamkeitslenkung, nicht als Dekoration.
* Vermeide Parallax-Effekte auf grossen Bildflaechenm — sie verursachen Layout-Probleme und sind auf Mobile unbrauchbar.
* Halte Einblend-Animationen kurz (max. 400 ms) und dezent.
* Unterstuetze reduced motion.

Nicht tun:

* Keine permanenten Bewegungseffekte auf der Seite.
* Kein Parallax auf dem Hero-Hintergrund.
* Keine Animationen, die den Lesefluss unterbrechen oder Inhalte verzoegert zeigen.

## 11. Qualitaetskontrolle

Pruefe jeden Seitenabschnitt anhand dieser Fragen:

* Ist das Wertversprechen nach 3 Sekunden klar?
* Gibt es an jeder sinnvollen Stelle einen CTA?
* Sind Vertrauenselemente nah an Kaufentscheidungspunkten?
* Ist die Seite auf Mobile vollstaendig nutzbar?
* Laedt die Seite schnell — insbesondere der Hero-Bereich?
* Sind alle Animationen dezent und unterstuetzen reduced motion?
* Sind rechtliche Pflichtinhalte vorhanden und erreichbar?
