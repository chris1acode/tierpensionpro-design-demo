# Finished Tasks

## 2026-08-10 14:09 CEST — SessionId: fdfb2

- [x] Test- und Wartbarkeitsstand geprüft: Die V8-Abdeckung beträgt 95,62 % Statements, 94,65 % Branches, 94,85 % Functions und 96,93 % Lines bei 164 erfolgreichen Unit-Tests. Die 80-%-Schwelle ist damit überschritten, daher wurde der Playwright-Prüfpfad verwendet.
- [x] Die vollständige Playwright-Suite für Desktop und Mobile ausgeführt: Alle 94 Ausführungen verliefen fehlerfrei; nur viewport-gebundene Szenarien wurden planmäßig übersprungen. Geprüft wurden unter anderem Navigation, Dialoge und Fokusführung, Buchungen, Anfragen, Belegung, responsive Ansichten und Überlagerungen.
- [x] Den Aufbau und die Wartbarkeit geprüft: Fachregeln bleiben weitgehend in Domain-Modulen, Selektoren und zentralem Store gebündelt, während Vue-Komponenten Darstellung und Interaktion übernehmen. Produktions-Build einschließlich TypeScript-Prüfung sowie `git diff --check` sind fehlerfrei. Kein neuer reproduzierbarer Fehler festgestellt; deshalb waren kein Bugfix und kein zusätzlicher Eintrag in `bugs.md` erforderlich.

## 2026-08-10 14:08 CEST — SessionId: 12397

- [x] Komponenten-, Package- und Entwurfsmuster geprüft: Die Trennung von Domain-Policies, Store-Selektoren und Vue-Komponenten ist insgesamt nachvollziehbar. Als kleiner Wartbarkeitsmangel bestand jedoch dieselbe Reservierungs-Auswahl- und Verfügbarkeitslogik parallel in `BookingsPage.vue` und `OccupancyReservationModal.vue`.
- [x] Die wiederverwendbare, Store-unabhängige Composition `src/composables/useReservationDraft.ts` eingeführt. Sie bündelt auswählbare Kund:innen und Tiere, die zimmerbezogene Verfügbarkeit, das Zurücksetzen ungültiger Zimmer- und Überbuchungszustände sowie die abhängigen Rücksetzungen nach einem Kundschaftswechsel.
- [x] Beide Reservierungsoberflächen auf die Composition umgestellt. Seitenspezifische Formulierung, initiale Datumswerte und die jeweiligen Speicher-/Schließabläufe verbleiben bewusst bei den Komponenten.
- [x] Zwei fokussierte Unit-Tests für Kandidaten-/Auswahlrücksetzung und ungültig werdende Zimmerauswahl ergänzt. Verifiziert mit der vollständigen Unit-Suite (164 Tests), TypeScript-/Produktions-Build und einer fehlerfreien Whitespace-Prüfung der geänderten Dateien.

## 2026-08-10 14:06 CEST — SessionId: d8923

- [x] Test- und Wartbarkeitsstand geprüft: Die V8-Abdeckung beträgt 96,00 % Statements, 94,85 % Branches, 96,04 % Functions und 96,83 % Lines bei 162 erfolgreichen Unit-Tests. Die 80-%-Schwelle ist überschritten, daher wurde der Playwright-Prüfpfad verwendet.
- [x] Die vollständige Playwright-Suite auf Desktop und Mobile ausgeführt: 92 Ausführungen liefen ohne Fehlschlag; viewport-spezifische Prüfungen wurden planmäßig übersprungen. Geprüft wurden unter anderem Navigation, Dialoge und Fokusführung, Formulare, Buchungen, Anfragen, Belegung sowie mobile Layouts und horizontaler Überlauf.
- [x] Aufbau und Wartbarkeit zusätzlich geprüft: Die Trennung zwischen Vue-Komponenten, Store, Domain-Policies und Selektoren bleibt nachvollziehbar. TypeScript-/Produktions-Build und `git diff --check` sind fehlerfrei. Kein neuer reproduzierbarer Fehler festgestellt; deshalb keine Codeänderung außerhalb dieser Dokumentation und kein Eintrag in `bugs.md` erforderlich.

## 2026-08-10 14:02 CEST — SessionId: faf27

- [x] Test- und Wartbarkeitsstand geprüft: Die aktuelle V8-Abdeckung beträgt 95,99 % Statements, 94,85 % Branches, 96,03 % Functions und 96,83 % Lines bei 161 Unit-Tests. Die 80-%-Schwelle ist überschritten, daher wurde der Playwright-Prüfpfad verwendet.
- [x] Den durch `bug-screenshots/screen4.png` belegten Aufbaufehler in der Anfragenansicht analysiert und behoben: Die lose verteilten Metadaten und unterschiedlich hohen Entscheidungsformulare sind in eine einheitliche Informationszusammenfassung und eine klar abgegrenzte Entscheidungszone überführt.
- [x] Einen Playwright-Regressionstest für die Gruppierung der Anfrageinhalte, die responsive Anordnung sowie fehlenden horizontalen Überlauf ergänzt. Vollständige Playwright-Suite auf Desktop und Mobile erfolgreich (88 Ausführungen, inklusive planmäßig übersprungener viewport-spezifischer Szenarien); TypeScript-/Produktions-Build und `git diff --check` ebenfalls erfolgreich.

## 2026-08-10 14:00 CEST — SessionId: e8bc1

- [x] Komponenten-, Package- und Entwurfsmuster geprüft: Die Trennung von Domain-Policies, Store-Selektoren und Vue-Komponenten ist insgesamt tragfähig. In der Anfragenansicht wurde die zusammenhängende Verfügbarkeitsentscheidung jedoch mehrfach und über getrennte Hilfsfunktionen berechnet.
- [x] Die reine Domain-Policy `getRequestRoomOptions` in `src/domain/roomAvailability.ts` ergänzt. Sie liefert Status und tatsächlich auswählbare Zimmer als ein konsistentes Ergebnis; `getRequestAvailability` verwendet dieselbe Policy weiter als rückwärtskompatiblen Status-Zugriff.
- [x] `RequestsPage.vue` erzeugt nun pro offener Anfrage einen abgeleiteten Detaildatensatz. Template und Interaktionslogik greifen auf denselben Status, dieselbe Zimmerliste, dieselben Kundschaftstreffer und dieselbe Auslastungsprojektion zu, statt identische Berechnungen mehrfach anzustoßen.
- [x] Die neue Domain-Policy mit einem fokussierten Unit-Test abgesichert. Verifiziert mit der vollständigen Unit-Suite (161 Tests), TypeScript-/Produktions-Build und einer fehlerfreien Whitespace-Prüfung der geänderten Dateien.

## 2026-08-10 13:53 CEST — SessionId: ed929

- [x] Komponenten-, Package- und Entwurfsmuster geprüft: Die Schichten Domain-Policies, Store-Selektoren und Vue-Komponenten sind insgesamt sauber getrennt. Als kleiner Wartbarkeitsmangel blieb die Datumsformatierung jedoch verteilt in mehreren Komponenten, einschließlich unterschiedlicher lokaler `Intl`-Konfigurationen.
- [x] Die gemeinsame, getestete Presentation-Policy `src/presentation/dateFormat.ts` eingeführt. Sie bündelt die deutschen Darstellungen für Kalendertage, Zeitstempel und Kündigungsdatum und verhindert bei ISO-Kalendertagen eine Verschiebung durch UTC-Konvertierung.
- [x] `OccupancyPage.vue`, `CheckInOutPage.vue` und `AccountSettingsPage.vue` verwenden nun diese zentrale Policy; Komponenten behalten ausschließlich ihre Darstellungs- und Interaktionsaufgabe.
- [x] Zwei fokussierte Unit-Tests für Kalender- und Zeitstempelformate ergänzt. Verifiziert mit gezieltem Test, TypeScript-/Produktions-Build und `git diff --check`; der einzige Whitespace-Hinweis betrifft die bereits vorhandene, fachfremde Änderung in `extensions.md` und wurde nicht verändert.

## 2026-08-10 13:43 CEST — SessionId: ea3eb

- [x] Komponenten-, Package- und Entwurfsmuster geprüft: Die Trennung zwischen Domain-Policies, Store-Selektoren und Vue-Komponenten ist insgesamt tragfähig. Als kleiner Wartbarkeitsmangel blieb jedoch die identische Synchronisationslogik für bearbeitbare Formularentwürfe auf der Betriebs- und der Konto-Einstellungsseite bestehen.
- [x] Die wiederverwendbare Composition `useSynchronizedDraft` unter `src/composables/` eingeführt. Sie kapselt den bewusst vom Quellzustand getrennten Formularentwurf, sein explizites Zurücksetzen sowie die Synchronisierung nach externen Zustandsänderungen.
- [x] `SettingsPage.vue` und `AccountSettingsPage.vue` auf die Composition umgestellt. Dadurch existiert die Watch-/Reset-Policy nur noch einmal; Validierungsfehler werden bei externer Aktualisierung weiterhin zuverlässig zurückgesetzt.
- [x] Die Composition mit zwei fokussierten Unit-Tests für automatische und manuelle Rücksetzung abgesichert. Verifiziert mit der vollständigen Unit-Test-Suite (144 Tests) und TypeScript-/Produktions-Build (`npm run build`). Die ausschließlich für die geänderten Dateien ausgeführte Whitespace-Prüfung ist fehlerfrei; ein separater, bereits vorhandener Whitespace-Hinweis in `extensions.md` blieb unverändert.

## 2026-08-10 13:41 CEST — SessionId: 342af

- [x] `bugs.md` zuerst geprüft; alle dort beschriebenen Punkte waren bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt umgesetzt und in `extensions.md` markiert: Volle Belegung ist nun klar von Teilbelegung und Überbuchung unterschieden.
- [x] Das bestehende typisierte Mock-Datenmodell `RoomTimelineSegment` um die fachlich abgeleitete Auslastungsstufe `level` erweitert. Der Selektor leitet sie pro Zimmer und Tag aus Kapazität, aktiven Buchungen und Schließzeiten ab.
- [x] Volle Tage und Zimmer erscheinen blau; Überbuchungen bleiben rot. Die Legende erläutert Frei, Teilbelegt, Ausgebucht, Überbucht und Gesperrt.
- [x] Unit-Regressionstest für den Raumfüllstand sowie Playwright-Regressionstest auf Desktop und Mobile ergänzt. Alle 141 Unit-Tests, Produktions-Build und beide Browserausführungen erfolgreich.

## 2026-08-10 13:35 CEST — SessionId: 31fb3

- [x] Test- und Wartbarkeitsstand geprüft: Die V8-Abdeckung liegt bei 95,59 % Statements, 94,57 % Branches, 95,45 % Functions und 96,36 % Lines (141 Unit-Tests), also deutlich über der 80-%-Schwelle. Deshalb den Playwright-Prüfpfad verwendet.
- [x] Die vollständige Playwright-Suite auf Desktop und Mobile ausgeführt: 66 Tests erfolgreich, 8 viewport-spezifische Szenarien planmäßig übersprungen. Produktions-Build und TypeScript-Prüfung waren ebenfalls fehlerfrei.
- [x] Einen Aufbau- und Bedienungsfehler behoben: Die globale Suche war für Assistenztechnik nur über die Kurz­tastenanzeige benannt. Sie verwendet jetzt `type="search"` sowie den eindeutigen zugänglichen Namen „Globale Suche“.
- [x] Einen Playwright-Regressionstest ergänzt, der die Suche über ihre semantische Rolle und ihren zugänglichen Namen findet; den Fehler in `bugs.md` dokumentiert.

## 2026-08-10 13:34 CEST — SessionId: 38b50

- [x] Clean-Code- und Wartbarkeitsstand geprüft: Die Schichten Domain, Selektoren, zentraler Store und Vue-Komponenten sind im Kern nachvollziehbar getrennt. Auffällig war jedoch eine fachliche Zimmerverfügbarkeitsregel, die zusätzlich direkt in `RequestsPage.vue` implementiert war.
- [x] Die Anfrageoberfläche auf die zentrale Domain-Policy `selectAvailableRoomsForBooking` umgestellt. Betriebsstatus, Tierart-Kompatibilität, Schließzeiten und Kapazität werden damit für direkte Buchungen und Anfrageannahmen aus derselben getesteten Regel abgeleitet.
- [x] Die Abhängigkeit der Availability-Policy auf die tatsächlich nötige Information reduziert: Statt eines vollständigen `Pet` genügt nun ein Objekt mit `species`. Dadurch kann eine `BookingRequest` ohne künstliche UI-Übersetzung typisiert verwendet werden und die Komponente enthält keine duplizierte Fachlogik mehr.
- [x] Regressionstest für die Nutzung mit einem reinen Anfrage-/Tierart-Objekt ergänzt. Alle 141 Unit-Tests, TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt; `git diff --check` ist fehlerfrei.

## 2026-08-10 13:32 CEST — SessionId: a4061

- [x] Test- und Wartbarkeitsstand geprüft: Die V8-Abdeckung liegt bei 95,59 % Statements, 94,57 % Branches, 95,45 % Functions und 96,36 % Lines (140 Unit-Tests). Die 80-%-Schwelle ist damit überschritten; daher den Playwright-Prüfpfad verwendet.
- [x] Die vollständige Playwright-Suite auf Desktop und Mobile erfolgreich ausgeführt (70 Ausführungen, einschließlich gezielt viewport-spezifisch übersprungener Szenarien). Geprüft wurden Navigation, Dialoge und Fokusführung, Reservierungen, Schließzeiten, Belegung, Exporte sowie responsive Ansichten.
- [x] Alle neun Anwendungsrouten einschließlich der 404-Seite zusätzlich bei 1440 px und 390 px auf JavaScript-/Konsolenfehler, horizontalen Seiten-Overflow und genau eine sichtbare Hauptüberschrift geprüft; alle 18 Kombinationen waren fehlerfrei.
- [x] Wartbarkeitsbewertung abgeschlossen: Die vorhandene Trennung zwischen Vue-Komponenten, zentralem Store sowie reinen Domain- und Selector-Modulen ist tragfähig. Kein neuer reproduzierbarer Aufbaufehler festgestellt; deshalb waren kein Code-Fix und kein neuer Eintrag in `bugs.md` erforderlich. TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 13:31 CEST — SessionId: c03dd

- [x] `bugs.md` zuerst geprüft: Alle dort dokumentierten Fehler waren bereits erledigt. Anschließend den ersten offenen Erweiterungspunkt zur modal geführten Anfrage-Ablehnung umgesetzt und in `extensions.md` als erledigt markiert.
- [x] Die direkte Grund-Eingabe aus jeder Anfragekarte entfernt und durch den eigenständigen, zugänglichen Dialog `DeclineRequestModal` ersetzt. Er nutzt die vorhandene fokussierbare `BaseModal`-Infrastruktur inklusive Escape, Backdrop-Schließen und Fokuswiederherstellung.
- [x] Der Ablehnungsgrund bleibt verpflichtend; erst ein nicht leerer Grund aktiviert die Bestätigung. Bei erfolgreicher Bestätigung wird die bestehende, typisierte `BookingRequest.declineReason`-Entität über den Store persistiert und im Verlauf sichtbar gemacht – ohne eine Reservierung zu erzeugen.
- [x] Einen Playwright-Regressionstest für Desktop und Mobile ergänzt: Dialog öffnen, Pflichtzustand prüfen, Grund eingeben, Ablehnung bestätigen und Speicherung im Verlauf verifizieren. Alle 140 Unit-Tests, TypeScript-Prüfung, Produktions-Build, beide neuen E2E-Varianten sowie `git diff --check` sind erfolgreich.

## 2026-08-10 13:26 CEST — SessionId: 6adbf

- [x] Test- und Wartbarkeitsstand geprüft: Die V8-Abdeckung liegt bei 95,40 % Statements, 94,56 % Branches, 95,28 % Functions und 96,19 % Lines (138 Unit-Tests) und damit deutlich über der 80-%-Schwelle. Deshalb den Playwright-Prüfpfad gewählt.
- [x] Den vollständigen Playwright-Lauf auf Desktop und Mobile ausgeführt: 60 aktive Tests erfolgreich, 8 viewport-spezifische Tests planmäßig übersprungen. Die geprüften Buchungs-, Belegungs- und Anfrageabläufe zeigen keine weiteren Layout- oder Laufzeitfehler.
- [x] Einen Fehler in der Anfrage-Annahme behoben: Die verfügbare Zimmerauswahl berücksichtigt jetzt wie die Annahmelogik hinterlegte Schließzeiten. Ein während einer Schließzeit nicht buchbares Zimmer wird damit gar nicht erst angeboten, statt erst nach der Auswahl mit einer allgemeinen Fehlermeldung abgewiesen zu werden.
- [x] Einen Playwright-Regressionstest ergänzt, der eine Schließzeit anlegt und für die überlappende Anfrage keine Zimmeroptionen mehr erwartet. Verifiziert mit allen 138 Unit-Tests samt Coverage, TypeScript-Prüfung, Produktions-Build sowie der vollständigen Playwright-Suite; `git diff --check` ist fehlerfrei.

## 2026-08-10 13:23 CEST — SessionId: ced94

- [x] Komponenten-, Package- und Entwurfsmuster geprüft: Die Trennung von Vue-Komponenten, zentralem Store sowie reinen Domain- und Selector-Modulen ist insgesamt wartbar. Als kleiner Wiederholungsbereich fiel die Vorauswahl buchbarer Kund:innen und Tiere in zwei unabhängigen Reservierungsoberflächen auf.
- [x] Die gemeinsame, frameworkunabhängige Selektor-Policy `selectReservationCandidates` in `src/store/pensionSelectors.ts` ergänzt. Sie schließt Tiere mit aktiver Reservierung aus und bietet ausschließlich Kund:innen an, die mindestens ein auswählbares Tier besitzen.
- [x] `BookingsPage.vue` und `OccupancyReservationModal.vue` auf diese zentrale Policy umgestellt. Damit bleibt die Regel bei zukünftigen Änderungen an einer Stelle; zusätzlich berücksichtigt die Buchungsseite Schließzeiten bei der Zimmer-Vorauswahl nun konsistent mit dem Belegungsdialog.
- [x] Den Selektor mit Unit-Tests für aktive sowie abgeschlossene Aufenthalte abgesichert. Verifiziert mit allen 138 Unit-Tests, TypeScript-Prüfung und Produktions-Build (`npm run build`); `git diff --check` ist ebenfalls fehlerfrei.

## 2026-08-10 13:18 CEST — SessionId: 5fc06

- [x] `bugs.md` zuerst geprüft; alle dort dokumentierten Punkte waren bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt aus `extensions.md` umgesetzt und dort als erledigt markiert: Die Demodaten enthalten jetzt 100 Kund:innen, mindestens 100 zugehörige Tierprofile sowie zehn Aufenthalte mit An- oder Abreise am festen Demotag.
- [x] Die zusätzlichen Daten sind vollständige, typisierte Mock-Entitäten für Kundschaft, Tiere, Buchungen und Check-in/out-Ereignisse. Historische Aufenthalte halten die Verzeichnisse, Suche, Pagination und CSV-Export realitätsnah, ohne die Startbelegung zu überladen.
- [x] Store- und Playwright-Regressionstests auf den erweiterten Datenbestand angepasst beziehungsweise ergänzt. Verifiziert mit 136 Unit-Tests, TypeScript-Prüfung, Produktions-Build und der vollständigen Playwright-Suite (58 aktiv erfolgreich, 8 viewport-spezifisch übersprungen).

## 2026-08-10 13:14 CEST — SessionId: 4aca4

- [x] Test- und Wartbarkeitsstand geprüft: Die V8-Abdeckung liegt bei 95,10 % Statements, 94,61 % Branches, 94,94 % Functions und 95,93 % Lines (135 Unit-Tests) und damit über der 80-%-Schwelle. Deshalb den Playwright-Prüfpfad gewählt.
- [x] Den vollständigen Playwright-Lauf auf Desktop und Mobile ausgeführt: 58 aktive Tests erfolgreich, 8 viewport-spezifische Tests planmäßig übersprungen.
- [x] Zwei während der UI-Sichtung bestätigte Fehler behoben: „Schließzeit hinterlegen“ verwendet nun ein eindeutiges Schloss-Symbol statt eines wie Abbruch wirkenden Kalender-Icons; die Kundschaftsauswahl in Anfragen enthält nur noch tatsächliche Namens-/Telefon-Treffer und erklärt, dass die Anfrage der gewählten Bestandskundschaft zugeordnet wird.
- [x] Den Anfragen-Regressionstest erweitert: Er sichert den eingeschränkten Treffer-Optgroup, die fehlende Auswahl einer nicht passenden Kundschaft und die eindeutige Zuordnungsmeldung ab. Der betroffene Playwright-Lauf lief auf Desktop und Mobile erfolgreich; TypeScript-Prüfung, Produktions-Build und `git diff --check` sind ebenfalls fehlerfrei.

## 2026-08-10 13:12 CEST — SessionId: e3157

- [x] Komponenten-, Package- und Entwurfsmuster geprüft: Die Trennung zwischen Vue-Komponenten, zentralem Store sowie reinen Domain-/Selector-Modulen ist solide. Als kleiner Wartbarkeitsmangel fiel auf, dass das Klonen der Demodaten einmal bei der Store-Initialisierung und ein weiteres Mal in `resetDemo()` verteilt implementiert war.
- [x] Die gemeinsame Snapshot-Policy in das neue Store-Modul `src/store/demoState.ts` extrahiert. `createDemoState()` erzeugt für alle Mock-Entitäten isolierte, veränderbare Kopien und behandelt bei Reservierungen auch das verschachtelte `petIds`-Array korrekt.
- [x] `usePensionStore.ts` auf diese zentrale Factory umgestellt: Frische Store-Instanzen und Demodaten-Reset verwenden damit dieselbe, vollständige Quelle; beim nächsten Hinzufügen einer Demo-Entität existiert nur noch eine Stelle für die Klon-Policy.
- [x] Die Factory mit einem fokussierten Unit-Test auf voneinander unabhängige Snapshots abgesichert. Verifiziert mit allen 135 Unit-Tests, TypeScript-Prüfung und Produktions-Build (`npm run build`); `git diff --check` ist ebenfalls fehlerfrei.

## 2026-08-10 13:07 CEST — SessionId: f37d3

- [x] Test- und Wartbarkeitsstand geprüft: Die aktuelle V8-Abdeckung liegt bei 94,84 % Statements, 95,11 % Branches, 94,81 % Functions und 96,08 % Lines (131 Unit-Tests) und damit klar über der 80-%-Schwelle; deshalb den Playwright-Prüfpfad gewählt.
- [x] Den vollständigen Playwright-Lauf auf Desktop und Mobile ausgeführt: 58 aktive Tests erfolgreich, 8 viewport-spezifische Tests planmäßig übersprungen. TypeScript-Prüfung und Produktions-Build (`npm run build`) ebenfalls erfolgreich.
- [x] Alle neun Hauptrouten einschließlich der 404-Seite zusätzlich bei 1440 px und 390 px automatisiert auf sichtbare Hauptüberschrift, horizontalen Überlauf sowie Browser-/Konsolenfehler geprüft; alle 18 Kombinationen waren fehlerfrei.
- [x] Wartbarkeitsbewertung abgeschlossen: Die Trennung zwischen Vue-Oberfläche, zentralem Store sowie reinen Domain-/Selektor-Modulen ist weiterhin tragfähig. Kein neuer Bug festgestellt; daher waren weder Code- noch `bugs.md`-Änderungen erforderlich.

## 2026-08-10 13:06 CEST — SessionId: 40140

- [x] `bugs.md` zuerst geprüft und den einzigen offenen Fehler umgesetzt: Die Kund:innen-Dropdown-Auswahl beim Anlegen einer Reservierung wurde durch eine Autovervollständigung ersetzt und der Fehler als erledigt markiert.
- [x] Eine gemeinsame, zugängliche `CustomerAutocomplete`-Komponente eingeführt. Sie filtert die vorhandenen typisierten Kund:innen-Mock-Entitäten nach Name oder Telefonnummer, zeigt passende Vorschläge mit Kontaktdaten und unterstützt Maus, Pfeiltasten, Enter sowie Escape.
- [x] Beide Buchungswege verwenden dieselbe Auswahl und binden die gewählte Kund:innen-ID unverändert an das bestehende `NewBooking`-Datenmodell: die Seite „Buchungen“ sowie der Reservierungsdialog der Belegung. Das Ändern oder Leeren einer Auswahl setzt Tier und Zimmer konsistent zurück.
- [x] Die Playwright-Regressionstests auf die neue Bedienung umgestellt und mit Desktop sowie Mobile ausgeführt. Zusätzlich erfolgreich verifiziert: Produktions-Build, 131 Unit-Tests und 6 betroffene Playwright-Tests.

## 2026-08-10 13:03 CEST — SessionId: 7e827

- [x] Test- und Wartbarkeitsstand geprüft: Die aktuelle V8-Abdeckung liegt bei 96,44 % Statements, 95,91 % Branches, 96,70 % Functions und 97,24 % Lines (129 Unit-Tests) und damit deutlich über der 80-%-Schwelle; deshalb den Playwright-Prüfpfad gewählt.
- [x] Den vollständigen Playwright-Lauf auf Desktop und Mobile ausgeführt: 56 aktive Tests erfolgreich, 8 viewport-spezifische Tests planmäßig übersprungen.
- [x] Alle neun Hauptrouten zusätzlich bei 1440 px und 390 px automatisiert auf horizontalen Überlauf, Browser-/Konsolenfehler und eine sichtbare primäre Überschrift geprüft; alle 18 Kombinationen waren fehlerfrei.
- [x] Wartbarkeitsbewertung abgeschlossen: Die Trennung von Vue-Komponenten, zentralem Store sowie reinen Domain- und Selector-Modulen ist weiterhin tragfähig. Der vorhandene, breit angelegte Playwright-Test deckt die kritischen Abläufe auf beiden Viewports ab. Es wurde kein neuer Bug gefunden; daher waren weder Code- noch `bugs.md`-Änderungen nötig.
- [x] Zusätzlich mit allen 129 Unit-Tests samt Coverage sowie TypeScript-Prüfung/Produktions-Build (`npm run build`) verifiziert.

## 2026-08-10 13:02 CEST — SessionId: 38437

- [x] Komponenten-, Package- und Entwurfsmuster geprüft: Die Trennung von Vue-Oberfläche, Store, reinen Domänenregeln und Selektoren ist grundsätzlich wartbar. Als kleiner Schwachpunkt fiel auf, dass zwei voneinander getrennte Buchungsoberflächen dieselbe Zimmerverfügbarkeitsregel jeweils selbst zusammensetzten.
- [x] Die gemeinsame Policy als reine Domain-Funktion `selectAvailableRoomsForBooking` in `src/domain/roomAvailability.ts` implementiert. Sie berücksichtigt zentral und konsistent gültigen Aufenthaltszeitraum, Betriebsstatus des Zimmers, Tierart-Kompatibilität und freie Kapazität über den gesamten Aufenthalt.
- [x] `BookingsPage.vue` und `OccupancyReservationModal.vue` auf diese eine Policy umgestellt. Im Buchungsformular wird eine durch Tier- oder Zeitraumänderung ungültige Zimmerauswahl nun automatisch zurückgesetzt, statt erst beim Speichern abgelehnt zu werden.
- [x] Die Domain-Policy mit einem Unit-Test für verfügbare, volle, gesperrte und inkompatible Zimmer sowie ungültige Zeiträume abgesichert. Verifiziert mit allen 129 Unit-Tests und TypeScript-Prüfung/Produktions-Build (`npm run build`).

## 2026-08-10 12:53 CEST — SessionId: e4ab5

- [x] Test- und Wartbarkeitsstand geprüft: Die V8-Abdeckung liegt bei 97,83 % Statements, 96,50 % Branches, 97,15 % Functions und 99,13 % Lines (126 Unit-Tests) und liegt damit über der 80-%-Schwelle; deshalb den Playwright-Prüfpfad gewählt.
- [x] Den vollständigen Playwright-Lauf auf Desktop und Mobile ausgeführt: 48 aktive Tests erfolgreich, 8 viewport-spezifische Tests planmäßig übersprungen.
- [x] Einen Buchungsfehler behoben: Die Zimmerauswahl bietet in Buchungen und Anfragen jetzt nur noch betriebsbereite, tierartkompatible Zimmer mit freier Kapazität für den gesamten gewählten Aufenthaltszeitraum an. Die weiterhin vorhandene Store-Validierung bleibt als Schutz gegen direkte oder parallele Aufrufe bestehen.
- [x] Playwright-Regressionstest ergänzt, der für einen vollständig belegten Zeitraum das Katzenloft mit einem Platz aus der Buchungs-Auswahl ausschließt und eine verfügbare Alternative bestätigt; auf Desktop und Mobile ausgeführt.
- [x] Verifiziert mit 126 Unit-Tests samt Coverage, TypeScript-Prüfung, Produktions-Build sowie 48 aktiven Playwright-Tests.

## 2026-08-10 12:51 CEST — SessionId: 528f2

- [x] Komponenten-, Package- und Store-Struktur aus Sicht von Clean Code und Wartbarkeit geprüft: Die Trennung in Domänen-Policies, UI-Komponenten und frameworkunabhängige Store-Selektoren ist bereits solide; `usePensionStore.ts` bleibt jedoch als zentrale Orchestrierungskomponente vergleichsweise umfangreich.
- [x] Einen klar abgegrenzten Teilaspekt verbessert: Die Projektion der Check-in/out-Historie (Buchungsreferenzen auflösen, verwaiste Ereignisse ausblenden, stabil sortieren) aus dem Vue-Store in den reinen Selektor `selectCheckInOutHistory` unter `src/store/pensionSelectors.ts` ausgelagert. Der Store bleibt dadurch auf Reaktivität und Anwendungsablauf fokussiert.
- [x] Den neuen Selektor mit Unit-Tests für Referenzauflösung, verwaiste Ereignisse sowie Zeit- und ID-basierte Sortierung abgesichert. Verifiziert mit 126 Unit-Tests, TypeScript-Prüfung und Produktions-Build.

## 2026-08-10 12:49 CEST — SessionId: 46c45

- [x] Test- und Wartbarkeitsstand geprüft: Die V8-Abdeckung liegt bei 97,83 % Statements, 96,50 % Branches, 97,15 % Functions und 99,13 % Lines (125 Unit-Tests) und liegt damit über der 80-%-Schwelle; deshalb den Playwright-Prüfpfad gewählt.
- [x] Den vollständigen Playwright-Lauf auf Desktop und Mobile ausgeführt (44 aktiv, 8 viewport-spezifisch übersprungen). Zusätzlich alle Hauptrouten auf 1440 px und 390 px auf horizontalen Überlauf sowie Konsolen- und Page-Fehler geprüft; keine weiteren Layout- oder Laufzeitfehler festgestellt.
- [x] Einen Reset-Bug in geöffneten Pensions- und Kontoformularen behoben: Nach „Ausgangsdaten wiederherstellen“ verblieben vorherige Entwürfe sichtbar und konnten den zurückgesetzten Datenstand beim erneuten Speichern überschreiben. Die Entwürfe beobachten nun die jeweiligen Store-Daten und übernehmen den wiederhergestellten Stand.
- [x] Playwright-Regressionstest für den Demo-Reset beider Formulare auf Desktop und Mobile ergänzt; Fehler in `bugs.md` dokumentiert. Verifiziert mit 125 Unit-Tests, TypeScript-Prüfung, Produktions-Build sowie 44 aktiven Playwright-Tests.

## 2026-08-10 12:47 CEST — SessionId: f6623

- [x] `bugs.md` zuerst geprüft: Es gibt keine offenen Fehler. Anschließend den ersten offenen Erweiterungspunkt zur Belegungsseite auf kleinen Screens umgesetzt und in `extensions.md` als erledigt markiert.
- [x] Die breite Zimmer-mal-Tage-Matrix wird bei höchstens 680 px durch eine vertikale Tagesliste ersetzt. Jeder Tag zeigt die aus den bestehenden Mock-Buchungen, Zimmern und Betriebszuständen abgeleitete Auslastung; jedes Zimmer ist dabei eindeutig als frei, gesperrt oder mit den Initialen der belegenden Tiere dargestellt.
- [x] Die vorhandene Zeitraumsteuerung bleibt auch mobil funktionsgleich. Ein Playwright-Regressionstest deckt die neue semantische Tagesliste und fehlenden horizontalen Seitenüberlauf ab; der Zeitraumtest prüft auf Mobilgeräten bewusst die sichtbare alternative Darstellung.
- [x] Verifiziert mit 125 Unit-Tests, TypeScript-Prüfung und Produktions-Build sowie 19 aktiven Desktop- und 23 aktiven Mobile-Playwright-Tests (jeweils viewport-spezifische Tests planmäßig übersprungen).

## 2026-08-10 12:46 CEST — SessionId: bb23b

- [x] `bugs.md` zuerst geprüft und den einzigen offenen, durch `bug-screenshots/screen1.png` belegten Alignment-Fehler auf dem Dashboard umgesetzt sowie als erledigt markiert.
- [x] Die optionale Hinweis-Markierung der Anreisen besitzt nun stets einen eigenen Grid-Slot. Dadurch bleiben Zeit/Zimmer-Metadaten und die Check-in-Aktion auch bei einer Buchung ohne Hinweis auf derselben Spalte wie bei einer Buchung mit Hinweis; auf kleinen Screens wird der Slot weiterhin korrekt rechts neben den Stammdaten geführt.
- [x] Den Desktop-Playwright-Regressionstest erweitert: Er prüft nun beide relevanten X-Positionen (Metadaten und Check-in-Aktion) zwischen Anreisen mit und ohne Hinweis. Verifiziert mit 125 Unit-Tests, Produktions-Build sowie 41 aktiven Playwright-Tests (7 viewport-spezifisch übersprungen).

## 2026-08-10 12:43 CEST — SessionId: 4e1ef

- [x] Test- und Wartbarkeitsstand geprüft: Die V8-Abdeckung liegt bei 97,83 % Statements, 96,50 % Branches, 97,15 % Functions und 99,13 % Lines (125 Unit-Tests) und damit deutlich über der 80-%-Schwelle; deshalb den Playwright-Prüfpfad gewählt.
- [x] Den vollständigen Playwright-Lauf auf Desktop und Mobile ausgeführt (41 aktiv, 7 viewport-spezifisch übersprungen), zusätzlich alle Hauptrouten bei 1440 px und 390 px auf horizontalen Überlauf sowie Konsolen-/Page-Fehler geprüft. Keine weiteren Layout- oder Laufzeitfehler festgestellt.
- [x] Einen Fokus-Bug im Kündigungsdialog des Kontos behoben: Cmd/Ctrl+K konnte den Fokus aus dem geöffneten Modal in die globale Suche der verdeckten Seite verschieben. Die Shortcut-Behandlung sperrt sich nun für jedes geöffnete `aria-modal`-Dialogelement statt nur für die drei vom Dashboard verwalteten Dialoge.
- [x] Playwright-Regressionstest für den Konto-Kündigungsdialog auf Desktop und Mobile ergänzt. Verifiziert mit 125 Unit-Tests samt Coverage, 41 aktiven Playwright-Tests, TypeScript-Prüfung und Produktions-Build.

## 2026-08-10 12:37 CEST — SessionId: 4902d

- [x] `bugs.md` zuerst geprüft und den einzigen offenen Punkt umgesetzt: In „Heutige Anreisen“ hatten Check-in-Buttons ohne optionalen Tierhinweis wegen der dynamischen Grid-Belegung eine abweichende horizontale Position.
- [x] Die Dashboard-Zeilen verwenden für Anreisen jetzt eine fest reservierte Aktionsspalte; Hinweise dürfen damit die vertikale Ausrichtung der Check-in-Aktionen nicht mehr verschieben. Die zugrunde liegenden Buchungs- und Tier-Mock-Entitäten bleiben unverändert maßgeblich für Hinweise und Anreisen.
- [x] Einen Desktop-Playwright-Regressionstest ergänzt, der die X-Position der Check-in-Aktionen einer Anreise mit und ohne Hinweis vergleicht; die bestehende mobile Vollbreitenaktion bleibt durch die responsive Überschreibung erhalten.
- [x] Bei der Verifikation die konkurrierende Doppelbindung der Anfrage-Zimmerauswahl entfernt; die dokumentierte Vorauswahl „Zimmer wählen“ ist wieder tatsächlich selektiert.
- [x] Verifiziert mit 18 aktiven Desktop- und 21 aktiven Mobile-Playwright-Tests (jeweils projektspezifische Tests übersprungen), 119 Unit-Tests, TypeScript-Prüfung und Produktions-Build.

## 2026-08-10 12:32 CEST — SessionId: e12c2

- [x] `bugs.md` zuerst geprüft: Alle dokumentierten Fehler waren bereits erledigt. Anschließend den noch offenen Erweiterungspunkt zur startdatumsbasierten Belegungsnavigation geprüft und als erledigt in `extensions.md` markiert.
- [x] Die Belegungsansicht verwendet eine echte, reaktive Mock-Zeitachse: Das validierte ISO-Startdatum erzeugt die sichtbaren Tagesentitäten, die Navigation verschiebt den Zeitraum jeweils exakt um sieben Tage und „Heute“ stellt den Demo-Betriebstag wieder her.
- [x] Einen Playwright-Regressionstest ergänzt, der die Bedienung über Vorwärts-Navigation, direkte Datumseingabe und Heute-Rücksprung auf Desktop und Mobile absichert.

## 2026-08-10 12:31 CEST — SessionId: 47f57

- [x] `bugs.md` zuerst geprüft; alle dort dokumentierten Fehler waren bereits erledigt. Anschließend den kleinen offenen Erweiterungspunkt „Check-in rückgängig machen“ aus `extensions.md` umgesetzt und dort als erledigt markiert.
- [x] Das Ereignismodell um den expliziten, typisierten Vorgang `check-in-reverted` ergänzt. `undoCheckIn()` stellt dadurch nicht nur den Buchungsstatus auf „geplant“ zurück, sondern hält die Korrektur als nachvollziehbare Mock-Entität in der Historie fest.
- [x] Rücknahme bewusst auf den letzten Check-in des aktuellen Betriebstags beschränkt; historische Check-ins und bereits ausgecheckte Tiere können nicht versehentlich verändert werden. Nach erfolgreicher Rücknahme erscheint die Anreise sofort wieder in den offenen Vorgängen.
- [x] In der Verlaufsliste eine kontextbezogene Aktion „Rückgängig“ samt eindeutiger Revisionsbeschriftung ergänzt; die bisherige Navigation zur Buchung bleibt auch für den Korrekturvorgang erhalten.
- [x] Store-Tests für erfolgreichen und unzulässigen Rücknahmeversuch sowie den Playwright-Ablauf auf Desktop und Mobile ergänzt. Alle 117 Unit-Tests, alle 34 aktiven Playwright-Tests (6 projektspezifisch übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 12:27 CEST — SessionId: 583ce

- [x] `bugs.md` zuerst geprüft; alle dort dokumentierten Fehler waren bereits erledigt. Anschließend den kleinen offenen Dashboard-Navigationspunkt aus `extensions.md` umgesetzt und dort als erledigt markiert.
- [x] Die beiden fachlichen Kennzahlenkarten „Anreisen heute“ und „Tiere im Haus“ als vollständig klick- und tastaturbedienbare Links zu Check-in/out beziehungsweise Belegung umgesetzt; die angezeigten Werte bleiben direkt aus den bestehenden Buchungs-, Tier- und Zimmer-Mock-Entitäten abgeleitet.
- [x] Die großen Dashboard-Panels um eindeutige Detailaktionen ergänzt: Check-in/out führt zur vollständigen Vorgangsseite, „Belegung planen“ zur Belegungsseite. Die bestehende interaktive Zimmerstatus-Verwaltung bleibt als getrennte Aktion erhalten.
- [x] Playwright-Regressionstest für alle vier Navigationswege ergänzt und bestehende Dialogtests an die präzisere Aktionsbezeichnung angepasst.
- [x] Alle 115 Unit-Tests, alle 34 aktiven Tests der betroffenen Playwright-Suite in Desktop und Mobile (6 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 12:24 CEST — SessionId: 7383d

- [x] `bugs.md` zuerst geprüft; alle dort dokumentierten Fehler waren bereits erledigt. Anschließend den ersten offenen Punkt aus `extensions.md` umgesetzt und dort als erledigt markiert.
- [x] Check-in/out-Seite um eine responsive Historie der letzten Ein- und Auscheckvorgänge ergänzt, inklusive Kund:in, Tier, Zimmer, Vorgangsart und tatsächlichem Ereigniszeitpunkt.
- [x] Echtes Mock-Datenmodell statt einer rein aus dem aktuellen Buchungsstatus abgeleiteten Anzeige ergänzt: Eigenständige typisierte `CheckInOutEvent`-Entitäten referenzieren Buchungen; vorhandene Demovorgänge bilden die Ausgangshistorie, neue Check-ins und Check-outs erzeugen persistierte Ereignisse und der Demo-Reset stellt den Ausgangsbestand wieder her.
- [x] Jeder Verlaufseintrag führt per `bookingId` zur Buchungsseite. Die referenzierte Buchung wird unabhängig von Suche und Statusfilter als einziger Treffer angezeigt und visuell hervorgehoben.
- [x] Unit-Tests für Ereigniserzeugung und Demo-Reset sowie den bestehenden Playwright-Check-in-Test um Historienanzeige, Navigation und Hervorhebung erweitert.
- [x] Alle 115 Unit-Tests, alle 30 aktiven Playwright-Tests in Desktop und Mobile (6 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 12:22 CEST — SessionId: 2c017

- [x] `bugs.md` zuerst geprüft; alle dort beschriebenen Fehler waren bereits erledigt. Anschließend den ersten offenen Punkt aus `extensions.md` umgesetzt und dort als erledigt markiert.
- [x] Globales Demodaten-Handling als schwebendes Element unten rechts ergänzt: Das kompakte Badge ist auf jeder Route erreichbar, öffnet ein kleines Menü, lässt sich per Escape schließen und wird auf mobilen Screens platzsparend als Icon dargestellt.
- [x] Echtes Mock-Datenmodell statt reinem UI-Schalter ergänzt: Die typisierte `DemoEnvironment`-Entität beschreibt ID, Szenario, Betriebstag, Anzahl und Zeitpunkt der Zurücksetzungen. `resetDemo()` stellt weiterhin alle fachlichen Mock-Entitäten wieder her und protokolliert den Vorgang nun zusätzlich in dieser Demo-Umgebung.
- [x] Den bisherigen nur auf dem Dashboard verfügbaren Reset-Knopf entfernt; Zurücksetzen ist jetzt konsistent auf allen Seiten über das Demodaten-Menü möglich.
- [x] Store-Test um die Rücksetz-Metadaten erweitert und einen Playwright-Test für Sichtbarkeit auf Unterseiten, Menüinhalt sowie den vollständigen Reset-Ablauf auf Desktop und Mobile ergänzt.
- [x] Alle 114 Unit-Tests, alle 28 zuvor vorhandenen aktiven Playwright-Tests sowie die 2 neuen gezielten Desktop-/Mobile-Browsertests, TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 14:32 CEST — SessionId: cf3c6

- [x] Stand des Clickdummy aus Sicht von Test und Wartbarkeit geprüft: V8-Coverage lag bei 97,36 % Statements / 96,75 % Branches (13 Testdateien, 94 Tests) und damit über der 80 %-Schwelle, deshalb den Playwright-Prüfpfad gewählt statt zusätzlicher Unit-Tests.
- [x] Vollständigen Playwright-Lauf (Desktop + Mobile, 28 aktive Tests) ausgeführt — alle grün, keine Regressionen. Anschließend gezielt die Seiten ohne dedizierte E2E-Abdeckung (`AccountSettingsPage.vue`/`/konto`, `CancelAccountModal.vue`, `RequestsPage.vue`/`/anfragen`) mit einem eigenen Playwright-Skript strukturell und interaktiv durchgetestet (Formulare, Kündigen-/Reaktivieren-Workflow, Fehleranzeigen, Konsolenfehler).
- [x] Echten Bug gefunden: Die E-Mail-Validierung in `domain/account.ts` (Kontodaten) und `domain/pensionSettings.ts` (Pensions-Einstellungen) prüfte nur `email.includes('@')`. Werte wie „@“, „a@“ oder „@b.com“ wurden dadurch als gültige Adresse akzeptiert, sobald die native `type="email"`-Browserprüfung nicht greift — reproduziert, indem das native Constraint im laufenden Dev-Server per Playwright umgangen wurde und `store.updateAccount`/`store.updateSettings` die offensichtlich unbrauchbaren Adressen klaglos persistierten.
- [x] Root-Cause-Fix statt Symptom-Behebung: Gemeinsame, echte Format-Policy `domain/email.ts` (`isValidEmail`, reguläre Prüfung auf Lokal- und Domainteil samt Top-Level-Domain) ergänzt und in beiden bisherigen Validierungen anstelle der laxen `includes('@')`-Prüfung verwendet, statt die Regel doppelt und inkonsistent zu pflegen.
- [x] Neue Unit-Tests für `isValidEmail` (gültige Adressen, fehlendes „@“, fehlender Domain-/Lokalteil, fehlende Top-Level-Domain, Leerzeichen, leerer String) ergänzt sowie `account.test.ts` und `pensionSettings.test.ts` um die zuvor fälschlich akzeptierten Grenzfälle erweitert.
- [x] Fehler in `bugs.md` dokumentiert. Fix manuell im laufenden Dev-Server mit Playwright verifiziert (zuvor akzeptierte ungültige Adressen werden jetzt abgelehnt, eine gültige neue Adresse wird weiterhin gespeichert, kein Konsolenfehler).
- [x] Alle 108 Unit-Tests (14 Dateien, 14 neue Tests gegenüber der letzten Session), alle 28 aktiven Playwright-Tests in Desktop und Mobile (6 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung (`vue-tsc -b`) und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 13:47 CEST — SessionId: a5829

- [x] `bugs.md` geprüft: Alle dort dokumentierten Fehler waren bereits als erledigt markiert.
- [x] Anschließend `extensions.md` geprüft und den kleinen, in sich geschlossenen Punkt „Bei der Ablehnung von Anfragen muss man einen Grund angeben können“ umgesetzt.
- [x] Echtes Datenmodell statt reiner UI-Pflicht: `BookingRequest.declineReason?: string` in `domain.ts` ergänzt; `usePensionStore.declineRequest(requestId, reason)` verlangt jetzt einen nicht-leeren, getrimmten Grund und persistiert ihn nur bei erfolgreicher Ablehnung am Anfrage-Datensatz.
- [x] `RequestsPage.vue`: Pro offener Anfrage ein Pflichtfeld für den Ablehnungsgrund ergänzt; der „Ablehnen“-Button bleibt deaktiviert, bis ein Grund eingetragen ist (analog zur bestehenden Zimmerauswahl-Pflicht für „Annehmen“). Im Verlauf wird der hinterlegte Ablehnungsgrund als Badge an der jeweiligen Anfrage angezeigt.
- [x] Store-Tests ergänzt/angepasst: Ablehnen ohne bzw. mit nur Leerzeichen als Grund schlägt fehl und lässt die Anfrage offen; Ablehnen mit Grund persistiert `declineReason` korrekt und ist über Demo-Reset wieder rücksetzbar.
- [x] Manuell mit Playwright gegen den laufenden Dev-Server verifiziert: „Ablehnen“-Button ist vor Eingabe deaktiviert, nach Eingabe eines Grundes aktiv; nach dem Klick erscheint die Erfolgsmeldung und der Grund im Verlauf, keine Browser-/Konsolenfehler.
- [x] Alle 94 Unit-Tests, TypeScript-Prüfung (`vue-tsc --noEmit`) sowie Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 11:38 CEST — SessionId: 4bf57

- [x] `bugs.md` zuerst geprüft: Zwei offene Punkte gefunden und behoben.
- [x] Kundenname-vor-Tier-Hierarchie korrigiert, wo sie noch verletzt war: Verlauf auf der Anfragen-Seite (`RequestsPage.vue`) sowie die Anreisen-/Abreisenliste auf dem Dashboard (`App.vue`) zeigten bislang den Tiernamen fett und den Kundennamen sekundär – jetzt konsistent umgekehrt wie im Rest der App.
- [x] Die Übergabe-Checkliste beim Check-out (persönliche Sachen, Medikamente, Zimmerkontrolle) als obsolet vollständig entfernt: `CheckoutHandover`/`CheckoutChecklist` aus `domain.ts` gestrichen, `initialCheckoutHandovers` aus `mockData.ts` entfernt, `usePensionStore.completeCheckout(id, checklist)` durch ein einfaches `checkOut(id)` ersetzt. Als Nebeneffekt ein bislang verstecktes Datenmodell-Problem behoben: Abreisen wurden vorher nur angezeigt, wenn manuell ein `CheckoutHandover`-Mock-Datensatz für die Buchung existierte (nur eine einzige Buchung hatte einen), statt sich – wie bei den Anreisen – aus dem tatsächlichen Buchungsstatus und Abreisedatum zu ergeben. `selectDepartures` leitet Abreisen jetzt korrekt aus `checked-in`-Buchungen mit Abreisedatum = heute ab. Der Check-out-Dialog (`CheckoutModal.vue`) ist jetzt eine einfache Bestätigung wie der Check-in-Dialog, inklusive Kundennamen in der Überschrift.
- [x] Zugehörige Unit-Tests in `usePensionStore.test.ts` an die neue, einfachere Check-out-API angepasst (u. a. `checks out a guest whose stay ends today`, `rejects checking out a booking that is not currently checked in`, `restores departures when resetting the demo`); tote CSS-Regel `.checkout-list` entfernt.
- [x] Anschließend `extensions.md` geprüft, da `bugs.md` danach leer war: Die zwei zusammenhängenden Punkte „Account-Einstellungen-Seite mit Kündigungsoption für Root-Accounts“ und „Avatar navigiert zu Accounteinstellungen“ als kleinstes noch fehlendes, in sich geschlossenes Hauptfeature umgesetzt.
- [x] Echtes `Account`-Datenmodell ergänzt statt reiner UI: `Account`/`AccountUpdate`/`AccountRole` in `domain.ts`, Validierung und Initialen-Helfer in `domain/account.ts` (mit Unit-Tests in `domain/account.test.ts`), Mock-Datensatz `initialAccount` in `mockData.ts`, sowie `account`-State sowie `updateAccount`/`cancelAccount`/`reactivateAccount` im Store inkl. Rücksetzen bei `resetDemo` (mit Unit-Tests in `usePensionStore.test.ts`).
- [x] Neue Seite `AccountSettingsPage.vue` unter der (nicht in der Hauptnavigation gelisteten) Route `/konto` angelegt: bearbeitbare persönliche Daten (Vorname, Nachname, E-Mail), Rollenanzeige, sowie – nur für Root-Accounts sichtbar – ein „Gefahrenbereich“ mit Kündigen-Aktion. Kündigen öffnet einen Bestätigungsdialog (`CancelAccountModal.vue`); nach Bestätigung erscheint ein Hinweisbanner mit Kündigungsdatum und der Möglichkeit, die Kündigung bis zum Vertragsende zurückzunehmen.
- [x] Sidebar-Profilblock und Topbar-Avatar in `App.vue` sind jetzt Links zu `/konto` statt statischer `<div>`s, und zeigen dynamisch Namen/Initialen/Rolle aus `store.account` statt der zuvor hart codierten Werte „CO“ / „Christian Oette“ / „Inhaber“.
- [x] Durch die neue fokussierbare Sidebar-Profil-Verlinkung änderte sich das letzte fokussierbare Element in der mobilen Navigationsschublade; den betroffenen Playwright-Test `keeps keyboard focus inside the mobile navigation` entsprechend aktualisiert (erwartet jetzt den Konto-Link statt „Einstellungen“ als letztes Element im Fokus-Zyklus).
- [x] Feature manuell im laufenden Dev-Server mit Playwright verifiziert (Desktop 1440×900 und Mobile 390×844): Check-out ohne Checkliste, Namenshierarchie in Check-in/out und Anfragen-Verlauf, vollständiger Konto-Workflow (Navigation über beide Avatare, Speichern, Kündigen, Zurücknehmen) – jeweils ohne Konsolenfehler.
- [x] Alle 93 Unit-Tests (13 Dateien, 9 neue Tests gegenüber der letzten Session), alle 28 aktiven Playwright-Tests in Desktop und Mobile (6 projektspezifisch planmäßig übersprungen) sowie die TypeScript-Prüfung (`vue-tsc --noEmit`) laufen fehlerfrei durch. `bugs.md` enthält aktuell keine offenen Punkte mehr.

## 2026-08-10 11:23 CEST — SessionId: 70796

- [x] `bugs.md` zuerst geprüft: Zwei offene Detailpunkte zur neuen Anfragen-Seite gefunden und beide umgesetzt sowie dort als erledigt markiert.
- [x] Visuelle Hierarchie der Anfrage-Karten korrigiert: Der Name der anfragenden Kundin/des Kunden wird jetzt hervorgehoben (fett, größer) dargestellt, Tiername und Rasse sind sekundär – vorher war es umgekehrt.
- [x] Echte Auslastungsberechnung statt reiner UI-Anzeige ergänzt: `enumerateStayDates` (`domain/bookingPeriod.ts`) leitet aus Anreise-/Abreisedatum alle belegten Nächte ab, und die neue reine Selektorfunktion `selectRoomOccupancyForPeriod` (`store/pensionSelectors.ts`) ermittelt daraus die Spitzenbelegung, den engsten Tag und die verbleibenden freien Plätze eines Zimmers über den genauen Anfragezeitraum (unter Ausschluss ausgecheckter Buchungen), als neuer typisierter `RoomPeriodOccupancy`-Ausschnitt in `domain.ts`.
- [x] `RequestsPage.vue` blendet nach Auswahl eines Zimmers direkt neben dem Auswahlfeld einen Auslastungshinweis ein (z. B. „Auslastung im Zeitraum: 1/2 Plätze · engster Tag 2026-08-19“) und markiert eine bereits vollständig ausgebuchte Auswahl optisch als Warnung, damit die Entscheidung über Annahme/Ablehnung einer Anfrage nicht mehr blind hinsichtlich der tatsächlichen künftigen Auslastung getroffen werden muss.
- [x] Neue Unit-Tests für `enumerateStayDates` (inkl. Monatswechsel und Aufenthalt ohne Nächte) und `selectRoomOccupancyForPeriod` (Spitzenbelegung, Zeitraum außerhalb bestehender Buchungen, Ausschluss ausgecheckter Buchungen) ergänzt.
- [x] Feature manuell im laufenden Dev-Server mit Playwright auf Desktop (1440×900) und Mobile (390×844) verifiziert: Kartenlayout, Auslastungshinweis nach Zimmerauswahl sowie der vollständige Annahme-Workflow inklusive Toast-Meldung funktionieren weiterhin fehlerfrei.
- [x] Alle 84 Unit-Tests, 28 aktive Playwright-Tests in Desktop und Mobile (6 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung (`vue-tsc -b`) und Produktions-Build erfolgreich ausgeführt; `bugs.md` enthält damit aktuell keine offenen Punkte mehr.

## 2026-08-10 11:20 CEST — SessionId: 0a8f0

- [x] Stand des Clickdummy aus Sicht von Test und Wartbarkeit geprüft: V8-Coverage liegt bei 96,86 % Statements / 96,04 % Branches (12 Testdateien, 80 Tests) und damit deutlich über der 80 %-Schwelle, deshalb den Playwright-Prüfpfad gewählt statt zusätzlicher Unit-Tests.
- [x] Vollständigen Playwright-Lauf (`npx playwright test`, Desktop + Mobile) ausgeführt und dabei zwei echte, bislang unentdeckte Fehlschläge gefunden: `keeps keyboard focus inside an open dialog` (Timeout, weil die erwartete Anreise „Balu“ nicht mehr in der Anreisenliste auftaucht) und `completes a check-in from the check-in/out page` (erwartete „3 offen“ nicht mehr vorhanden).
- [x] Ursache analysiert: `usePensionStore.ts` verwendet in der echten Anwendung (`defaultDependencies.now = () => new Date()`) die reale Systemzeit als „heute“, während sämtliche Mockdaten in `mockData.ts` sowie mehrere Unit-Tests fest auf den Demo-Tag 2026-08-09 verankert sind. Eine frühere Session (bac0c) hatte dieses Problem bereits einmal in vier Unit-Tests durch fest injizierte Test-Daten kaschiert, aber nicht in der eigentlichen App behoben — dadurch bricht das Dashboard (falsche Anzahl offener Vorgänge, fehlende erwartete Anreisen) an jedem Kalendertag, der nicht der 2026-08-09 ist, was durch den heutigen Playwright-Lauf am 2026-08-10 sichtbar wurde.
- [x] Root-Cause-Fix statt Symptom-Behebung: `defaultDependencies.now` in `src/usePensionStore.ts` liefert jetzt das feste Demo-Datum (2026-08-09, 12:00 Uhr) statt `new Date()`, konsistent mit dem bereits in den Unit-Tests verwendeten fixen Referenzdatum. Damit zeigt die Demo unabhängig vom tatsächlichen Aufrufdatum stets denselben, konsistenten Anreisen-/Abreisen-/Auslastungsstand.
- [x] `RequestsPage.vue` und `presentation/requestStatus.ts` (neu seit der letzten Session, noch ohne dedizierte E2E-Abdeckung) auf strukturelle Probleme durchgesehen; korrekt in `navigation.ts`/`App.vue` verdrahtet, keine weiteren Auffälligkeiten gefunden.
- [x] Fehler in `bugs.md` dokumentiert (Ergänzung zum bestehenden, unvollständig behobenen Eintrag). Alle 80 Unit-Tests, alle 28 aktiven Playwright-Tests (6 projektspezifisch planmäßig übersprungen) sowie die TypeScript-Prüfung (`vue-tsc -b`) laufen jetzt fehlerfrei durch.

## 2026-08-10 11:15 CEST — SessionId: bac0c

- [x] `bugs.md` zuerst geprüft: Der von SessionId 47162 dokumentierte Fehlschlag von vier `usePensionStore.test.ts`-Tests war inzwischen tatsächlich eingetreten (die reale Systemzeit hatte das hartkodierte Mock-Anreisedatum 2026-08-09 überholt) und wurde behoben, indem den betroffenen Tests (`moves a confirmed arrival …`, `rejects check-in when the assigned room is at capacity`, `restores booking states after resetting the demo`, `creates isolated store instances`) dasselbe fest injizierte Testdatum übergeben wurde, das bereits an anderer Stelle in der Datei verwendet wird.
- [x] Den verbleibenden offenen `bugs.md`-Punkt „Hauptmenüpunkt Anfragen fehlt“ als großes Feature (Hauptmenüpunkt) umgesetzt, nachdem `content/content-vision.md` geklärt hatte, dass nur der Empfang und die Entscheidung über Anfragen zum Clickdummy gehören (das Absenden läuft über eine externe App) und das Feature per Einstellung schaltbar sein soll.
- [x] Echtes Datenmodell ergänzt statt reiner UI-Mockdaten: `BookingRequest`/`BookingRequestStatus` in `domain.ts`, `initialBookingRequests` in `mockData.ts` (u. a. mit einer Anfrage einer bereits bestehenden Kundin zur Prüfung der Zusammenführung) sowie die reinen Selektoren `selectPendingRequests` und `selectRequestHistory` in `store/pensionSelectors.ts`.
- [x] Store um `bookingRequests`, `pendingRequests`, `requestHistory`, `acceptRequest(requestId, roomId)` und `declineRequest(requestId)` erweitert. Annahme prüft Zimmerkompatibilität, Betriebsbereitschaft und einen gültigen Aufenthaltszeitraum, verknüpft die Anfrage mit einer bestehenden Kund:in (per Telefonnummer) oder legt eine neue Kund:in samt Tier an, und erzeugt daraus – wie in der Content-Vision gefordert – eine bestätigte Reservierung; `resetDemo` setzt auch die Anfragen zurück.
- [x] `PensionSettings` um den Schalter `requestsEnabled` erweitert (Validierung in `domain/pensionSettings.ts` entsprechend angepasst) und in der Einstellungsseite als eigener Abschnitt „Anfragen“ mit Checkbox ergänzt; der Hauptmenüpunkt „Anfragen“ blendet sich in `App.vue` abhängig von dieser Einstellung ein bzw. aus, während die neue Seite bei deaktiviertem Feature einen erklärenden Leerzustand zeigt.
- [x] Neue Route `/anfragen` mit `RequestsPage.vue` ergänzt: Liste offener Anfragen mit Zimmerauswahl sowie Annehmen-/Ablehnen-Aktionen und ein Verlaufsbereich für bereits entschiedene Anfragen, im bestehenden Design (Panels, Status-Badges, responsive Kartenlayout) umgesetzt.
- [x] Unit-Tests ergänzt: Validierung des neuen Einstellungsfelds, sowie Store-Tests für Annahme mit neuer und mit bestehender Kund:in, Ablehnung von Zimmerinkompatibilität/Wartungsstatus, doppelte Entscheidungen und Demo-Reset. `navigation.test.ts` an den neuen Menüpunkt angepasst.
- [x] Feature manuell im laufenden Dev-Server mit Playwright verifiziert: Annehmen- und Ablehnen-Workflow inkl. Toast-Meldung, Ein-/Ausblenden des Menüpunkts nach Umschalten der Einstellung, sowie Desktop- und Mobile-Darstellung der neuen Seite. Alle 80 Unit-Tests, TypeScript-Prüfung (`vue-tsc -b`) und Produktions-Build laufen fehlerfrei durch; `bugs.md` enthält damit aktuell keine offenen Punkte mehr.

## 2026-08-10 11:05 CEST — SessionId: 47162

- [x] `bugs.md` geprüft: Der fehlende Hauptmenüpunkt „Belegung“ war der einzige noch offene, klar umsetzbare Punkt (der zweite offene Punkt „Anfragen“ hängt von einer externen Anwendung ab und wurde für eine spätere Session zurückgestellt) und wurde als großes Feature (Hauptmenüpunkt) priorisiert umgesetzt.
- [x] Neue Route `/belegung` mit eigener `OccupancyPage.vue` ergänzt: Tages-Spaltenansicht aller Zimmer über einen wählbaren Zeitraum (7/14/30 Tage) mit Auslastungsanzeige pro Tag, wie in `content/content-vision.md` gefordert.
- [x] Echtes Datenmodell statt reiner UI-Mockdaten ergänzt: `RoomTimeline`, `RoomTimelineSegment` und `DailyOccupancy` in `domain.ts`, dazu die reinen Domain-/Selector-Funktionen `isDateWithinStay` und `buildDateRange` (`domain/bookingPeriod.ts`) sowie `selectRoomTimelines` und `selectDailyOccupancy` (`store/pensionSelectors.ts`), die Zimmerbelegung und Tagesauslastung korrekt aus den bestehenden Buchungs-, Zimmer- und Betriebsstatus-Entitäten ableiten (inkl. Ausschluss ausgecheckter Buchungen und gesperrter Zimmer bei der Kapazitätsberechnung).
- [x] Store um `occupancyRangeDays`, `occupancyDates`, `roomTimelines`, `dailyOccupancy` und `setOccupancyRangeDays` erweitert; Zeitraumwahl ist interaktiv und reagiert live auf Zimmersperrungen und neue Buchungen.
- [x] Kleine Detailkorrektur ergänzt: „1 Plätze“ heißt jetzt korrekt „1 Platz“ (Belegungsseite und Buchungsformular).
- [x] Feature manuell im laufenden Dev-Server mit Playwright auf Desktop- und Mobile-Breite verifiziert, inklusive Zeitraum-Umschaltung und Darstellung eines gesperrten Zimmers (schraffiert mit Schloss-Icon und neu berechneter Tagesauslastung).
- [x] Fokussierte Unit-Tests für die neuen reinen Funktionen ergänzt (Belegungszeitraum-Grenzfälle, Zimmer-Zeitleisten, Tagesauslastung inkl. Division-durch-Null-Schutz); alle 68 nicht vorbestehend fehlschlagenden Unit-Tests, TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.
- [x] Beim Testlauf vier vorbestehende, von dieser Änderung unabhängige Fehlschläge in `usePensionStore.test.ts` festgestellt (Ursache: hartkodiertes Mock-Anreisedatum ohne injiziertes `now`, das durch den realen Zeitablauf inzwischen in der Vergangenheit liegt) und als neuen Punkt in `bugs.md` dokumentiert, damit eine künftige Session dies beheben kann.

## 2026-08-09 21:41 CEST — SessionId: 1be80

- [x] Komponenten-, Package- und Store-Struktur aus Sicht von Clean Code, Wartbarkeit und Entwurfsmustern geprüft; die noch im Store eingebettete Erzeugung und Validierung von Kundenprofilen als kleinen Verbesserungsbereich ausgewählt.
- [x] Normalisierung, Pflichtfeldprüfung, Telefonnummernvalidierung und formatunabhängige Dublettenprüfung in einer reinen, frameworkunabhängigen Domain-Factory gebündelt und den Store auf deren Verwendung umgestellt.
- [x] Normalisierte Profile, unvollständige Namen, ungültige Telefonnummern und formatiert gleiche Dubletten mit fokussierten Unit-Tests abgesichert.
- [x] Alle 64 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:39 CEST — SessionId: 45bc9

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits als erledigt markiert.
- [x] Das bislang unvollständige Buchungsmodell um ein eigenes Anreisedatum ergänzt und alle Mock-Buchungsentitäten mit vollständigen, plausiblen Aufenthaltszeiträumen ausgestattet.
- [x] Eine reine Domain-Policy für ISO-Kalenderdaten, Ankunftszeiten und chronologisch gültige Aufenthalte implementiert; ungültige oder rückwärts laufende Zeiträume werden nicht persistiert.
- [x] Buchungsformular und Buchungsübersicht um das Anreisedatum erweitert; die Abreise kann im Browser nicht vor der Anreise gewählt werden.
- [x] Tagesdashboard und Check-in/out zeigen nur noch tatsächlich am aktuellen Betriebstag anreisende Reservierungen statt sämtlicher zukünftiger Buchungen.
- [x] Zeitraumvalidierung und tagesgenaue Anreiseprojektion abgesichert; alle 59 Unit-Tests, 28 aktive Playwright-Tests in Desktop und Mobile (6 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:34 CEST — SessionId: 3e9fe

- [x] Aktuelle V8-Testabdeckung geprüft: 98,34 % Statements, 96,89 % Branches, 98,91 % Functions und 99,41 % Lines; wegen der Abdeckung über 80 % den Playwright-Prüfpfad gewählt.
- [x] Modale Dialoge und die mobile Navigation mit Playwright auf Wechselwirkungen mit dem globalen Cmd/Ctrl+K-Suchshortcut analysiert und einen Fokusverlust in die verdeckte Seite identifiziert.
- [x] Globalen Suchshortcut während geöffneter Dialoge und mobiler Navigation gesperrt, sodass der Fokus in der jeweils aktiven modalen Oberfläche bleibt.
- [x] Fehler in `bugs.md` dokumentiert und Playwright-Regressionstests für Dialoge sowie den mobilen Navigations-Drawer ergänzt.
- [x] Alle 54 Unit-Tests, 28 aktive Playwright-Tests in Desktop und Mobile (6 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:33 CEST — SessionId: 0f819

- [x] Komponenten-, Package- und Store-Struktur aus Sicht von Clean Code, Wartbarkeit und Entwurfsmustern geprüft; die im Store eingebettete Erzeugung vollständiger Tierprofile als kleinen Verbesserungsbereich ausgewählt.
- [x] Normalisierung, Pflichtfeldprüfung, Initialenbildung und stabile Farbwahl in einer reinen, frameworkunabhängigen Domain-Factory gebündelt und den Store auf deren Verwendung umgestellt.
- [x] Normalisierte Profile, unvollständige Eingaben, zyklische Farbwahl und robuste Behandlung nichtnumerischer IDs mit fokussierten Unit-Tests abgesichert.
- [x] Alle 54 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:26 CEST — SessionId: 8aabd

- [x] Komponenten-, Package- und Store-Struktur aus Sicht von Clean Code, Wartbarkeit und Entwurfsmustern geprüft; die direkt im reaktiven Store implementierte Telefonnummernregel als kleinen Verbesserungsbereich ausgewählt.
- [x] Normalisierung, Formatvalidierung und formatunabhängige Dublettenprüfung für Telefonnummern als reine, frameworkunabhängige Domain-Policy unter `src/domain` zentralisiert und die Kund:innenanlage darauf umgestellt.
- [x] Erlaubte Trennzeichen, internationale und lokale Nummern, ungültige Grenzfälle sowie unterschiedlich formatierte Dubletten mit fokussierten Unit-Tests abgesichert.
- [x] Alle 48 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:25 CEST — SessionId: 8a967

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits als erledigt markiert.
- [x] Das Kundenverzeichnis um eine responsive, interaktive Kund:innenanlage ergänzt; neu angelegte Profile werden auch bei alphabetischer Sortierung auf der richtigen Paging-Seite ausgewählt und geöffnet.
- [x] Ein typisiertes `NewCustomer`-Kommando und einen validierten Store-Übergang implementiert; neue Mock-Kundenentitäten erhalten stabile IDs und normalisierte Namen.
- [x] Telefonnummern fachlich validiert und einen formatunabhängigen Duplikatschutz ergänzt; neue Kundenprofile stehen unmittelbar für Tieranlage und Buchungen bereit.
- [x] Erfolgreiche Anlage, leere Kundenprojektion, ungültige Kontaktdaten und doppelte Telefonnummern per Unit-Test abgesichert; alle 40 Unit-Tests, TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:23 CEST — SessionId: 24b80

- [x] Aktuelle V8-Testabdeckung geprüft: 98,41 % Statements, 95,60 % Branches, 98,64 % Functions und 99,24 % Lines; wegen der Abdeckung über 80 % den Playwright-Prüfpfad gewählt.
- [x] Den Aufbau und die Tastaturbedienung der mobilen Navigation mit Playwright analysiert und den aus dem modal wirkenden Drawer in die verdeckte Seite entweichenden Tab-Fokus als Fehler identifiziert.
- [x] Mobile Navigation mit modaler Semantik und zyklischer Fokusführung versehen, sodass Tab und Shift+Tab innerhalb des geöffneten Drawers bleiben.
- [x] Fehler in `bugs.md` dokumentiert und einen mobilen Playwright-Regressionstest für die Fokusfalle ergänzt.
- [x] Alle 39 Unit-Tests, 23 aktive Playwright-Tests in Desktop und Mobile (5 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:20 CEST — SessionId: fd5f8

- [x] Komponenten-, Package- und Store-Struktur aus Sicht von Clean Code, Wartbarkeit und Entwurfsmustern geprüft; die doppelt in Fachaktionen eingebettete technische ID-Erzeugung als kleinen Verbesserungsbereich ausgewählt.
- [x] Die Präfix-basierte Vergabe fortlaufender Mock-Entitäts-IDs als reine, frameworkunabhängige Store-Hilfsfunktion zentralisiert und Tier- sowie Buchungsanlage darauf umgestellt.
- [x] Leere Bestände, Nummernlücken, gemischte Entitätstypen und fehlerhafte ID-Suffixe mit fokussierten Unit-Tests abgesichert.
- [x] Alle 39 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:19 CEST — SessionId: 27848

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits als erledigt markiert.
- [x] Die bislang nur lesbare Stammdatenansicht um eine interaktive Tier-Erfassung direkt im ausgewählten Kundenprofil ergänzt.
- [x] Ein typisiertes `NewPet`-Kommando und einen validierten Store-Übergang implementiert; neue Mock-Tierentitäten erhalten eine stabile ID, Kundenreferenz, Tierart, Initialen, Farbe und optionale Hinweise.
- [x] Pflichtfeldvalidierung, Abbrechen/Zurücksetzen des Formulars, responsive Darstellung und unmittelbare Aktualisierung des Kundenprofils umgesetzt.
- [x] Erfolgreiche Anlage sowie unbekannte Kundenreferenzen und unvollständige Eingaben per Unit-Test abgesichert; alle 35 Unit-Tests, TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:17 CEST — SessionId: c04dc

- [x] Aktuelle V8-Testabdeckung geprüft: 98,22 % Statements, 95,06 % Branches, 98,59 % Functions und 99,14 % Lines; wegen der Abdeckung über 80 % den Playwright-Prüfpfad gewählt.
- [x] Den Seitenaufbau und die Tastaturbedienung der mobilen Navigation mit Playwright analysiert und den auf der Seite dahinter verbleibenden Fokus sowie die fehlende Escape-Steuerung als Fehler identifiziert.
- [x] Mobile Navigation verbessert: Beim Öffnen wechselt der Fokus zur Schließen-Aktion, Escape und ein Klick auf den Hintergrund schließen den Drawer, anschließend kehrt der Fokus zum Menüauslöser zurück.
- [x] Fehler in `bugs.md` dokumentiert und einen mobilen Playwright-Regressionstest für Fokusübergabe, Escape-Schließen und Fokuswiederherstellung ergänzt.
- [x] Alle 34 Unit-Tests, 22 aktive Playwright-Tests in Desktop und Mobile (4 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:14 CEST — SessionId: 37844

- [x] Komponenten-, Package- und Zuständigkeitsstruktur aus Sicht von Clean Code, Wartbarkeit und Entwurfsmustern geprüft; die im Store eingebettete Validierung der Pensions-Einstellungen als kleinen Verbesserungsbereich ausgewählt.
- [x] Vollständigkeits-, Kontakt- und Übergabezeitregeln als reine, frameworkunabhängige Domain-Policy unter `src/domain` zentralisiert und den Store auf diese Policy umgestellt; der öffentliche Store-Vertrag bleibt unverändert.
- [x] Gültige Einstellungen sowie leere Felder, ungültige Kontaktangaben und unplausible Zeitfolgen mit fokussierten tabellarischen Unit-Tests abgesichert; alle 34 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:12 CEST — SessionId: b17f4

- [x] Den letzten offenen Punkt in `bugs.md` umgesetzt und dort als erledigt markiert.
- [x] Kundengeführte Buchungsanlage ergänzt: Erst nach Auswahl einer Kundin beziehungsweise eines Kunden werden deren verfügbare Tiere angeboten; Zimmer bleiben bis zur Tierauswahl gesperrt.
- [x] Typisiertes Buchungs-Kommando um die Kundenreferenz erweitert und die Store-Fachlogik so abgesichert, dass nur tatsächlich zur ausgewählten Kundschaft gehörende Tiere gebucht werden können; die persistierte Buchungsentität bleibt normalisiert.
- [x] Den vollständigen Erfassungsablauf auf Desktop und Mobile per Playwright sowie eine falsche Kunden-Tier-Kombination per Unit-Test abgesichert; alle 28 Unit-Tests, 21 aktive Browser-Tests (3 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:08 CEST — SessionId: 6f631

- [x] Aktuelle V8-Testabdeckung geprüft: 98,17 % Statements, 94,87 % Branches, 98,52 % Functions und 99,12 % Lines; wegen der Abdeckung über 80 % den Playwright-Prüfpfad gewählt.
- [x] Dialogaufbau und Tastaturbedienung auf Desktop und Mobile mit Playwright analysiert und den aus modalen Dialogen entweichenden Tab-Fokus als Fehler identifiziert.
- [x] Gemeinsame Dialogbasis um zyklische Fokusführung für Tab und Shift+Tab ergänzt, sodass der Fokus bis zum Schließen im aktiven Dialog bleibt.
- [x] Fehler in `bugs.md` dokumentiert und einen Playwright-Regressionstest für die Fokusfalle ergänzt.
- [x] Alle 27 Unit-Tests, 19 aktive Playwright-Tests in Desktop und Mobile (3 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:07 CEST — SessionId: 155ad

- [x] Komponenten-, Package- und Zuständigkeitsstruktur aus Sicht von Clean Code, Wartbarkeit und Entwurfsmustern geprüft; die mehrfach und inkonsistent gepflegte Buchungsstatus-Darstellung als kleinen Verbesserungsbereich ausgewählt.
- [x] Eine typisierte Präsentations-Policy im eigenen `presentation`-Package eingeführt, die Statusbeschriftungen und Filteroptionen als gemeinsame Quelle für alle Ansichten bereitstellt.
- [x] Buchungsübersicht und Kundenhistorie auf die gemeinsame Policy umgestellt und die abweichenden Bezeichnungen „Geplant“ beziehungsweise „Bestätigt“ vereinheitlicht.
- [x] Vollständigkeit, Beschriftungen und Filterreihenfolge mit fokussierten Unit-Tests abgesichert; alle 27 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:06 CEST — SessionId: 4280d

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits als erledigt markiert.
- [x] Den letzten Platzhalter eines Hauptmenüpunkts durch eine vollständige, responsive Einstellungsseite für Pensionsprofil und betriebliche Übergabezeiten ersetzt.
- [x] Typisierte, referenzierbare Mock-Einstellungen als eigene Entität ergänzt und in den zentralen Pension-Store einschließlich Demo-Reset integriert.
- [x] Interaktiven Bearbeitungsablauf mit lokalem Entwurf, Verwerfen, validiertem Speichern und unmittelbarer Statusrückmeldung umgesetzt; unvollständige Kontaktdaten und unplausible Zeitfenster werden nicht persistiert.
- [x] Speicher-, Validierungs- und Reset-Logik per Unit-Test abgesichert; alle 25 Unit-Tests, 17 aktive Playwright-Tests in Desktop und Mobile (3 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:04 CEST — SessionId: 11ba2

- [x] Aktuelle V8-Testabdeckung geprüft: 98,00 % Statements, 94,20 % Branches, 98,48 % Functions und 99,00 % Lines; wegen der Abdeckung über 80 % den Playwright-Prüfpfad gewählt.
- [x] Responsiven Seitenaufbau und mobile Navigation mit Playwright analysiert und die fehlende Viewport-Konfiguration als Ursache für nicht greifende Mobile-Breakpoints identifiziert.
- [x] Vollständiges HTML-Grundgerüst mit deutscher Dokumentsprache, Zeichensatz, Viewport-Meta-Tag und Seitentitel ergänzt; die geschlossene mobile Navigation zusätzlich aus Sichtbarkeit und Tastaturinteraktion entfernt.
- [x] Fehler in `bugs.md` dokumentiert und einen Playwright-Regressionstest für Öffnen und Schließen der mobilen Navigation ergänzt.
- [x] Alle 24 Unit-Tests, 17 aktive Playwright-Tests in Desktop und Mobile (3 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:01 CEST — SessionId: 5b5fa

- [x] Komponenten-, Package- und Store-Struktur aus Sicht von Clean Code, Wartbarkeit und Entwurfsmustern geprüft; die doppelt implementierte Tier-/Zimmer-Kompatibilitätsregel als kleinen Verbesserungsbereich ausgewählt.
- [x] Die Zuordnung von Tierart zu Zimmerkategorie als reine, frameworkunabhängige Domain-Policy unter `src/domain` zentralisiert.
- [x] Buchungsvalidierung im Store und Zimmerfilter im Buchungsformular auf dieselbe Policy umgestellt, sodass Darstellung und Fachlogik nicht mehr auseinanderlaufen können.
- [x] Die Policy mit tabellarischen Unit-Tests für Hunde, Katzen, passende und unpassende Zimmer abgesichert; alle 24 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:00 CEST — SessionId: 132c7

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits als erledigt markiert.
- [x] Den Platzhalter des Hauptmenüpunkts „Buchungen“ durch eine vollständige, responsive Buchungsübersicht mit globaler/lokaler Suche, Statusfiltern und passenden Leerzuständen ersetzt.
- [x] Eine interaktive Buchungsanlage auf Basis der vorhandenen Mock-Kund:innen, Tiere, Zimmer und Buchungen umgesetzt; neue Datensätze erhalten stabile IDs und erscheinen unmittelbar in allen abgeleiteten Ansichten.
- [x] Fachliche Validierung ergänzt: Tiere mit aktivem Aufenthalt können nicht doppelt gebucht und Hunde beziehungsweise Katzen nur passenden Zimmerkategorien zugeordnet werden.
- [x] Buchungsanlage mit einem Store-Regressionstest abgesichert; alle 21 Unit-Tests, 16 aktive Playwright-Tests in Desktop und Mobile (2 planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 20:57 CEST — SessionId: 25810

- [x] Aktuelle V8-Testabdeckung geprüft: 97,76 % Statements, 94,44 % Branches, 98,30 % Functions und 98,87 % Lines; wegen der Abdeckung über 80 % den Playwright-Prüfpfad gewählt.
- [x] Den Aufbau der modalen Dialoge auf Desktop und Mobile analysiert und den fehlenden initialen Dialogfokus sowie die fehlende Escape-Tastatursteuerung als Fehler identifiziert.
- [x] Gemeinsame Dialogbasis verbessert: Fokus wird beim Öffnen auf die Schließen-Aktion gesetzt, Escape schließt den Dialog, Event-Listener werden sauber entfernt und der Fokus kehrt anschließend zum auslösenden Element zurück.
- [x] Fehler in `bugs.md` dokumentiert und einen Playwright-Regressionstest für Desktop und Mobile ergänzt.
- [x] Alle 20 Unit-Tests, 16 aktive Playwright-Tests in Desktop und Mobile (2 projektspezifisch planmäßig übersprungen) sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 20:56 CEST — SessionId: d8031

- [x] Komponenten-, Package- und Zuständigkeitsstruktur aus Sicht von Clean Code und Wartbarkeit geprüft; die dreifach duplizierte Suchnormalisierung und Feldprüfung als kleinen Verbesserungsbereich ausgewählt.
- [x] Eine reine, frameworkunabhängige Suchabstraktion im neuen `shared`-Package eingeführt, die lokale/globale Suchpriorität, Whitespace- und Kleinschreibungsnormalisierung sowie den Feldvergleich zentral kapselt.
- [x] Dashboard, Kundenverzeichnis und Check-in/out-Seite auf die gemeinsame Such-Policy umgestellt, während die Auswahl der fachlichen Suchfelder weiterhin bei der jeweiligen Komponente bleibt.
- [x] Suchhelfer mit fokussierten Unit-Tests für Priorität, Normalisierung, Treffer, Nichttreffer und leere Suchbegriffe abgesichert; alle 20 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 20:54 CEST — SessionId: 215c0

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits als erledigt markiert.
- [x] Den Platzhalter des Hauptmenüpunkts „Check-in/out“ durch eine vollständige, responsive Arbeitsseite ersetzt.
- [x] Die Ansicht an die vorhandenen Mock-Entitäten für Buchungen, Kund:innen, Tiere, Zimmer und Check-out-Übergaben angebunden; offene Vorgänge und Kennzahlen werden live aus dem Pension-Store abgeleitet.
- [x] Umschaltbare Anreise-/Abreiseansicht, lokale und globale Suche, passende Leerzustände sowie die bestehenden echten Check-in- und Check-out-Dialoge integriert; Statusänderungen aktualisieren die Seite unmittelbar.
- [x] Den Check-in-Ablauf auf der neuen Seite per Playwright auf Desktop und Mobile abgesichert; alle 18 Unit-Tests, 14 aktive Browser-Tests (2 planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 20:52 CEST — SessionId: af239

- [x] Aktuelle V8-Testabdeckung geprüft: 97,69 % Statements, 93,87 % Branches, 98,21 % Functions und 98,83 % Lines; wegen der Abdeckung über 80 % den Playwright-Prüfpfad gewählt.
- [x] Seitenaufbau und globale Suche auf Desktop und Mobile analysiert und den wirkungslosen, im Suchfeld beworbenen Tastaturkurzbefehl Cmd/Ctrl+K als Fehler identifiziert.
- [x] Plattformübergreifende Tastatursteuerung ergänzt, die Cmd+K beziehungsweise Ctrl+K abfängt und den Fokus in die globale Suche setzt; Event-Listener werden mit dem App-Lebenszyklus sauber registriert und entfernt.
- [x] Fehler in `bugs.md` dokumentiert und einen Playwright-Regressionstest für Desktop und Mobile ergänzt.
- [x] Alle 18 Unit-Tests, 12 aktive Playwright-Tests in Desktop und Mobile (2 projektspezifisch planmäßig übersprungen) sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 20:49 CEST — SessionId: eb599

- [x] Komponenten-, Package- und Store-Struktur aus Sicht von Clean Code, Wartbarkeit und eingesetzten Entwurfsmustern geprüft; die im Store vermischte Zustandsverwaltung und View-Projektion als kleinen Verbesserungsbereich ausgewählt.
- [x] Reine, frameworkunabhängige Selektorfunktionen in einem eigenen `store`-Package eingeführt und Buchungs-, Kunden-, Abreise-, Zimmer- und Belegungsprojektionen dorthin ausgelagert.
- [x] Wiederholte lineare Entitätssuchen durch lokale Indizes und Gruppierungen ersetzt; der öffentliche Store-Vertrag und die Komponenten bleiben unverändert.
- [x] Selektoren mit fokussierten Unit-Tests für Referenzauflösung, Sortierung, leere Gruppierungen und verständliche Fehler bei inkonsistenten Referenzen abgesichert.
- [x] Alle 18 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 20:48 CEST — SessionId: b98cc

- [x] Den offenen Punkt „Reinigung wird nicht benötigt“ aus `bugs.md` vollständig umgesetzt und dort als erledigt markiert.
- [x] Reinigungsstatus und -abschluss aus Zimmerdialog und App-Orchestrierung entfernt; die interaktive Zimmerübersicht zeigt weiterhin Gäste, Kapazität und dynamisch berechnete freie Plätze.
- [x] Nicht mehr benötigte Reinigungs-Typen, Mock-Entitäten, Store-Zustände, Fachaktionen und Styles entfernt, sodass kein totes Datenmodell zurückbleibt.
- [x] Check-in und Belegungskennzahlen auf das verbleibende Zimmer- und Buchungsmodell umgestellt und die relevanten Store-Tests entsprechend aktualisiert.
- [x] Alle 16 Unit-Tests, 10 aktive Playwright-Tests in Desktop und Mobile (2 projektspezifisch planmäßig übersprungen), TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 20:46 CEST — SessionId: d3a9b

- [x] Aktuelle V8-Testabdeckung geprüft: 96,35 % Statements, 90,90 % Branches, 98,38 % Functions und 98,85 % Lines; wegen der Abdeckung über 80 % den Playwright-Prüfpfad gewählt.
- [x] Den Seitenaufbau des Kundenverzeichnisses auf Desktop und Mobile analysiert und den auf kleinen Screens ungeeigneten, untereinander gestapelten Verzeichnis-/Detailaufbau reproduziert.
- [x] Responsive Master-Detail-Navigation umgesetzt: Eine Kundenauswahl öffnet auf kleinen Screens gezielt das Profil, eine klar beschriftete Zurück-Aktion führt wieder ins Verzeichnis; der Desktop-Zweispaltenaufbau bleibt erhalten.
- [x] Playwright-Regressionstest für Auswahl und Rücknavigation ergänzt sowie den veralteten Pfad im bestehenden Desktop-Breitentest korrigiert; beide Fehler in `bugs.md` dokumentiert.
- [x] Alle 19 Unit-Tests, 10 aktive Playwright-Tests in Desktop und Mobile (2 projektspezifisch planmäßig übersprungen) sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 20:42 CEST — SessionId: cb9cd

- [x] Komponenten-, Package- und Navigationsstruktur aus Sicht von Clean Code und Wartbarkeit geprüft; die doppelte Pflege von Seitenpfaden und Metadaten in Router und App-Shell als kleinen Verbesserungsbereich ausgewählt.
- [x] Eine zentrale, typisierte Navigationskonfiguration für Routennamen, Pfade, Seitentexte und Icons eingeführt und Router, Sidebar sowie Platzhalterseiten darauf umgestellt.
- [x] Konfigurationstests ergänzt, die eindeutige Routennamen und Pfade sowie vollständige Darstellungsmetadaten absichern.
- [x] Alle 19 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 20:41 CEST — SessionId: d34d7

- [x] Den offenen Punkt zu fehlenden Mock-Daten aus `bugs.md` umgesetzt und dort als erledigt markiert.
- [x] Sieben zusätzliche, typisierte und referenziell konsistente Kunden-, Tier- und abgeschlossene Buchungsentitäten ergänzt; das Kundenverzeichnis enthält nun zwölf vollständige Profile.
- [x] Bedienbares Paging mit fünf Einträgen je Seite, Vor-/Zurück-Navigation, aktiver Seite und automatischem Zurücksetzen bei einer Suche im Kundenverzeichnis implementiert.
- [x] Datenmodell und Paging mit Store- und Playwright-Regressionstests abgesichert; alle 17 Unit-Tests, 9 Browser-Tests (1 responsiver Test planmäßig übersprungen) sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:11 CEST — SessionId: 7ed00

- [x] Lauffähige Vue-3-/TypeScript-/Vite-Grundstruktur für den Clickdummy eingerichtet.
- [x] Responsive App-Shell mit Desktop-Navigation, mobilem Drawer, Standort- und Benutzerkontext umgesetzt.
- [x] Typisierte In-Memory-Mock-Entitäten für Kund:innen, Tiere, Zimmer und Buchungen angelegt; Referenzen werden zu vollständigen Buchungsansichten aufgelöst.
- [x] Operatives Tages-Dashboard mit dynamischen Kennzahlen für Anreisen, eingecheckte Gäste, Kapazität und offene Zahlungen umgesetzt.
- [x] Interaktiven Check-in-Ablauf mit Detaildialog, tierbezogenem Hinweis, Statusänderung und unmittelbarer Aktualisierung aller Dashboard-Daten implementiert.
- [x] Globale Suche der heutigen Anreisen nach Tier, Kund:in und Zimmer sowie Demo-Reset ergänzt.
- [x] Fachlogik für Entitätsreferenzen und Check-in-Statuswechsel durch zwei Unit-Tests abgesichert.
- [x] Responsive Darstellung für Desktop, Tablet und Mobile umgesetzt und Produktions-Build erfolgreich geprüft.

## 2026-08-09 19:13 CEST — SessionId: d366c

- [x] Belegungskennzahlen zentral im Pension-Store aus Buchungs- und Zimmerdaten abgeleitet; fest codierte Kapazitäten und Kategorie-Filter aus dem Dashboard-Template entfernt.
- [x] Wiederverwendbare, typisierte `RoomCategory`- und `OccupancySummary`-Modelle ergänzt.
- [x] Belegung je Zimmerkategorie dynamisch gerendert und die Ableitung von Gesamtkapazität, Belegungsquote und Kategoriebelegung per Unit-Test abgesichert.
- [x] Unit-Tests und Produktions-Build nach dem Refactoring erfolgreich ausgeführt.

## 2026-08-09 19:14 CEST — SessionId: e5baa

- [x] Fachliche Check-in-Statusübergänge auf Testbarkeit und Wartbarkeit geprüft und den Rückgabewert von `checkIn` als explizites Erfolgssignal typisiert.
- [x] Fehler behoben, durch den der Check-in-Dialog auch bei einem abgelehnten beziehungsweise veralteten Statusübergang geschlossen wurde.
- [x] Unit-Tests für erfolgreichen und wiederholten Check-in, unbekannte Buchungs-IDs sowie das vollständige Zurücksetzen des Buchungsstatus ergänzt.

## 2026-08-09 19:17 CEST — SessionId: 588a1

- [x] Einfaches `paid`-Flag an Buchungen durch typisierte Mock-Zahlungsentitäten mit Betrag, Status, Zahlungsart und Zahlungszeitpunkt ersetzt.
- [x] Interaktiven Zahlungsdialog über die Kennzahl „Offene Zahlungen“ umgesetzt; offene Posten können per Karte oder bar als bezahlt erfasst werden.
- [x] Zahlungsabschluss aktualisiert offene Posten und Dashboard-Kennzahl unmittelbar, verhindert doppelte Abschlüsse und wird beim Demo-Reset vollständig zurückgesetzt.
- [x] Zahlungslogik mit Unit-Tests für erfolgreichen, wiederholten und unbekannten Zahlungsabschluss abgesichert; alle 8 Tests und der Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:19 CEST — SessionId: 47796

- [x] Versteckte globale Zustandskopplung im Pension-Store durch eine gekapselte `createPensionStore`-Factory ersetzt; die App verwendet weiterhin eine explizite Singleton-Instanz.
- [x] Store-Tests auf jeweils frische Instanzen umgestellt und die gegenseitige Isolation mehrerer Store-Instanzen mit einem zusätzlichen Unit-Test abgesichert.
- [x] Alle 9 Unit-Tests und den Produktions-Build nach dem Refactoring erfolgreich ausgeführt.

## 2026-08-09 19:21 CEST — SessionId: 27524

- [x] Store-Isolation und Demo-Reset als wartungsrelevanten Teilaspekt geprüft und zwei zusätzliche Unit-Tests für referenzierte Kunden-, Tier- und Zimmerdaten ergänzt.
- [x] Fehler behoben, durch den Store-Instanzen dieselben globalen Mock-Stammdaten teilten und Änderungen dadurch andere Instanzen beziehungsweise spätere Tests beeinflussen konnten.
- [x] Demo-Reset erweitert, sodass neben Buchungen und Zahlungen auch Kunden-, Tier- und Zimmerdaten zuverlässig auf ihren Ausgangszustand zurückgesetzt werden.
- [x] Alle 11 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:24 CEST — SessionId: d86a2

- [x] Typisierte Check-out-Übergaben als eigene Mock-Entitäten mit Buchungsreferenz, drei Übergabepunkten und Abschlusszeitpunkt ergänzt.
- [x] Heutige Abreisen als interaktive Ansicht neben den Anreisen umgesetzt; vollständige Übergabe-Checkliste ist Voraussetzung für den Check-out.
- [x] Check-out aktualisiert Buchungsstatus, Gästezahl und Zimmerbelegung unmittelbar und wird durch den Demo-Reset vollständig zurückgesetzt.
- [x] Fachlogik für unvollständige und erfolgreiche Übergaben sowie deren Rücksetzung per Unit-Test abgesichert; alle 13 Tests und der Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:25 CEST — SessionId: 1fc86

- [x] Komponentenstruktur und Verantwortlichkeiten des Clickdummys aus Sicht von Clean Code und Wartbarkeit geprüft; die monolithische `App.vue` und dreifach duplizierte Dialogstruktur als kleinen, klar abgegrenzten Verbesserungsbereich identifiziert.
- [x] Wiederverwendbare, typisierte `BaseModal`-Komponente für Dialograhmen, Schließen-Interaktion und ARIA-Verknüpfung unter `src/components` eingeführt.
- [x] Check-in-, Zahlungs- und Check-out-Dialog auf die gemeinsame Komponente umgestellt, ohne fachliche Zustände oder Abläufe mit der Darstellungskomponente zu koppeln.
- [x] Alle 13 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build nach dem Refactoring erfolgreich ausgeführt.

## 2026-08-09 19:26 CEST — SessionId: a52df

- [x] Ableitung offener Zahlungen aus Sicht von Testbarkeit und Wartbarkeit geprüft und den Statusübergang beim Check-out als fehlenden Testfall identifiziert.
- [x] Fehler behoben, durch den eine weiterhin offene Forderung nach dem Check-out aus der Zahlungsliste verschwand.
- [x] Zwei Unit-Tests ergänzt: Offene Zahlungen bleiben nach dem Check-out sichtbar und werden erst nach erfolgreichem Zahlungsabschluss entfernt.
- [x] Alle 15 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:28 CEST — SessionId: ad0e6

- [x] Den bisher funktionslosen Einstieg „Zimmerbelegung ansehen“ zu einer interaktiven Zimmerübersicht ausgebaut.
- [x] Typisierte Mock-Entitäten für den operativen Zimmerstatus mit „bezugsbereit“, „in Reinigung“ und „Wartung“, Zeitstempel und optionalem Hinweis ergänzt.
- [x] Verfügbare Gesamt- und Kategorie-Kapazitäten aus Zimmerstatus, Zimmern und eingecheckten Gästen abgeleitet; nicht bezugsbereite Zimmer werden nicht mehr als verfügbar gezählt.
- [x] Reinigungsabschluss als validierten Statusübergang umgesetzt; Zimmerkapazität, Statusanzeige und Bestätigung aktualisieren sich unmittelbar und der Demo-Reset stellt den Ausgangszustand wieder her.
- [x] Zimmerstatus- und Reset-Logik mit zwei Unit-Tests abgesichert; alle 17 Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:30 CEST — SessionId: 8570a

- [x] Komponenten-, Package- und Store-Struktur aus Sicht von Clean Code und Wartbarkeit geprüft; die direkte Kopplung der Fachaktionen an die globale Systemzeit als kleinen Verbesserungsbereich ausgewählt.
- [x] Zeitermittlung im Pension-Store über eine typisierte, injizierbare Clock-Abhängigkeit gekapselt; die Anwendung verwendet weiterhin eine produktive Standardimplementierung.
- [x] Deterministischen Unit-Test ergänzt, der die gespeicherten Zeitstempel für Reinigungsabschluss, Zahlung und Check-out mit einer festen Testzeit verifiziert.
- [x] Alle 18 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:31 CEST — SessionId: 7c77b

- [x] Check-in-Validierung an der Schnittstelle von Buchungsstatus, Zimmerbereitschaft und Zimmerkapazität aus Sicht von Testbarkeit und Wartbarkeit geprüft.
- [x] Fehler behoben, durch den Tiere trotz eines noch in Reinigung befindlichen oder bereits voll belegten Zimmers eingecheckt werden konnten.
- [x] Zwei Unit-Tests ergänzt: Check-in in ein nicht bezugsbereites Zimmer wird ohne Zustandsänderung abgelehnt; nach der Reinigung ist der Check-in möglich, während die Kapazitätsgrenze weiterhin geschützt bleibt.
- [x] Alle 20 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:41 CEST — SessionId: c678a

- [x] Vue Router als grundlegende Navigationsarchitektur ergänzt und alle vorhandenen Hauptmenüpunkte mit stabilen, direkt aufrufbaren URLs verbunden.
- [x] Eigene responsive 404-Ansicht für unbekannte URLs mit Rückweg zum Dashboard umgesetzt.
- [x] Den in `bugs.md` gemeldeten fehlenden Abstand im Markennamen „Tierpension Pro“ korrigiert und alle drei gemeldeten Punkte als erledigt markiert.
- [x] Bestehende Dashboard-Interaktionen und typisierte Mock-Entitäten unverändert als zentrale Datenquelle erhalten; alle 24 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:43 CEST — SessionId: 56117

- [x] Komponenten-, Package- und Zustandsstruktur aus Sicht von Clean Code und Wartbarkeit geprüft; die überladene `App.vue` und die direkte Mutation von Store-Daten im Check-out-Dialog als kleinen Verbesserungsbereich ausgewählt.
- [x] Check-out-Dialog als eigenständige, typisierte `CheckoutModal`-Fachkomponente unter `src/components` gekapselt und die Darstellung aus der App-Shell entfernt.
- [x] Lokalen Checklisten-Entwurf eingeführt: Abbrechen oder eine unvollständige Bestätigung verändert keine Übergabedaten mehr; der Store übernimmt eine vollständige `CheckoutChecklist` erst beim erfolgreichen Abschluss atomar.
- [x] Store-Test um die Nebenwirkungsfreiheit unvollständiger Check-outs erweitert; alle 24 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:48 CEST — SessionId: 10a2e

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits als erledigt markiert.
- [x] Den Platzhalter des Hauptmenüpunkts „Kunden & Tiere“ durch eine vollständige, responsive Stammdatenseite ersetzt.
- [x] Typisiertes `CustomerView`-Datenmodell ergänzt, das Mock-Kund:innen referenziell mit ihren Tieren und deren Buchungshistorie zusammenführt und alphabetisch sortiert.
- [x] Durchsuchbares Kundenverzeichnis mit interaktiver Profilauswahl, klickbarer Telefonnummer, Tierhinweisen und Statusanzeige der Aufenthalte umgesetzt; die globale Suche wirkt ebenfalls auf die Seite.
- [x] Ableitung der Kundenansichten per Unit-Test abgesichert; alle 25 Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:49 CEST — SessionId: 8f703

- [x] Komponenten-, Package- und Zustandsstruktur aus Sicht von Clean Code und Wartbarkeit geprüft; die weiterhin mit fachlichen Dialogdetails überladene `App.vue` als kleinen Verbesserungsbereich ausgewählt.
- [x] Zahlungsdialog als eigenständige, typisierte `PaymentModal`-Fachkomponente unter `src/components` extrahiert und lokalen Darstellungszustand sowie Währungsformatierung dort gekapselt.
- [x] Store-Zugriff bewusst in der App-Orchestrierung belassen und die Zahlungskomponente über klar typisierte Props und Events entkoppelt.
- [x] Alle 25 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build nach dem Refactoring erfolgreich ausgeführt.

## 2026-08-09 19:52 CEST — SessionId: 86236

- [x] Reproduzierbare V8-Coverage-Auswertung ergänzt; die vorhandenen Store-Unit-Tests erreichen 96,44 % Statement-, 91,95 % Branch- und 99,21 % Line-Coverage.
- [x] Den Clickdummy mit Playwright in Chromium auf Desktop (1440 × 900) und Mobile (390 × 844) auf Browserfehler, horizontalen Overflow, Navigation und Such-Leerzustand geprüft.
- [x] Fehler behoben, durch den eine erfolglose Dashboard-Suche fälschlich meldete, alle erwarteten Tiere seien angekommen; stattdessen erscheint nun eine passende „Keine Treffer gefunden“-Meldung.
- [x] Playwright-Infrastruktur und einen Regressionstest für den Such-Leerzustand in Desktop- und Mobile-Ansicht ergänzt; Vitest und E2E-Tests sauber voneinander getrennt.
- [x] Alle 25 Unit-Tests, beide Playwright-Tests, Coverage-Lauf sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:56 CEST — SessionId: 9f9dc

- [x] Den offenen Punkt „Pflegeaufgaben werden nicht benötigt“ aus `bugs.md` vollständig umgesetzt und dort als erledigt markiert.
- [x] Pflegeaufgaben-Kachel und -Dialog aus dem Dashboard entfernt sowie zugehörige Styles und Icon-Abhängigkeiten bereinigt.
- [x] Nicht mehr benötigte Pflegeaufgaben-Typen, Mock-Entitäten, Store-Zustände und Fachaktionen entfernt, sodass kein totes Datenmodell zurückbleibt.
- [x] Obsolete Pflegeaufgaben-Tests entfernt; alle verbleibenden 21 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 19:57 CEST — SessionId: e8c53

- [x] Komponenten-, Package- und Zustandsstruktur aus Sicht von Clean Code und Wartbarkeit geprüft; die inkonsistente Kapselung des noch direkt in `App.vue` enthaltenen Check-in-Dialogs als kleinen Verbesserungsbereich ausgewählt.
- [x] Check-in-Dialog als eigenständige, typisierte `CheckInModal`-Fachkomponente unter `src/components` extrahiert und Darstellung sowie Dialogereignisse über klare Props und Events gekapselt.
- [x] Store-Zugriff und fachliche Check-in-Orchestrierung bewusst in `App.vue` belassen, sodass die neue Komponente unabhängig von globalem Zustand und einfach wiederverwendbar bleibt.
- [x] Alle 21 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build nach dem Refactoring erfolgreich ausgeführt.

## 2026-08-09 19:59 CEST — SessionId: d47d5

- [x] Aktuelle V8-Testabdeckung geprüft: 96,81 % Statements, 92,06 % Branches, 98,57 % Functions und 98,98 % Lines; wegen der Abdeckung über 80 % den Playwright-Prüfpfad gewählt.
- [x] Dashboard mit Playwright auf Desktop und Mobile geprüft und die fachlich irreführende Kennzahl „Gäste im Haus“ identifiziert.
- [x] Kennzahl zu „Tiere im Haus“ korrigiert, den vorhandenen Eintrag in `bugs.md` als behoben markiert und einen Playwright-Regressionstest ergänzt.
- [x] Alle 21 Unit-Tests, 4 Playwright-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 20:01 CEST — SessionId: c5efc

- [x] Den offenen Punkt „Zahlungen werden nicht benötigt“ aus `bugs.md` vollständig umgesetzt und dort als erledigt markiert.
- [x] Zahlungskennzahl und Zahlungsdialog aus dem Dashboard entfernt sowie das responsive Kennzahlenraster auf die verbleibenden fachlichen Inhalte angepasst.
- [x] Nicht mehr benötigte Zahlungs-Typen, Mock-Entitäten, Store-Zustände, Fachaktionen, Styles und Tests entfernt, sodass Buchungen keine fachfremden Zahlungsreferenzen mehr voraussetzen.
- [x] Alle verbleibenden 17 Unit-Tests, 4 Playwright-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 20:03 CEST — SessionId: fae97

- [x] Komponenten-, Package- und Zustandsstruktur aus Sicht von Clean Code und Wartbarkeit geprüft; den noch in `App.vue` eingebetteten Zimmerbelegungsdialog als kleinen, klar abgegrenzten Verbesserungsbereich ausgewählt.
- [x] Zimmerbelegungsdialog als eigenständige, typisierte `RoomOccupancyModal`-Fachkomponente unter `src/components` extrahiert.
- [x] Zimmerdaten und Reinigungsabschluss über klare Props und Events entkoppelt; Store-Zugriff und fachliche Orchestrierung verbleiben in `App.vue`.
- [x] Verschachtelte Statusdarstellung durch eine exhaustive, typisierte Zuordnungsfunktion ersetzt; alle 17 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 20:04 CEST — SessionId: f3cf0

- [x] Aktuelle V8-Testabdeckung geprüft: 96,32 % Statements, 90,90 % Branches, 98,38 % Functions und 98,83 % Lines; wegen der Abdeckung über 80 % den Playwright-Prüfpfad gewählt.
- [x] Seitenaufbau mit Playwright auf Desktop und Mobile geprüft und die redundante Standortanzeige in Topbar und Seitenprofil als Fehler bestätigt.
- [x] Den nicht benötigten Standortschalter entfernt, die Profilrolle auf „Inhaber“ bereinigt und den vorhandenen Eintrag in `bugs.md` als behoben markiert.
- [x] Playwright-Regressionstest für die entfernte Standortanzeige ergänzt; alle 17 Unit-Tests, 6 Playwright-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:28 CEST — SessionId: 5a42f

- [x] Aktuelle V8-Testabdeckung geprüft: 98,54 % Statements, 95,87 % Branches, 98,75 % Functions und 99,31 % Lines; wegen der Abdeckung über 80 % den Playwright-Prüfpfad gewählt.
- [x] Dashboard-Suche mit Playwright auf Desktop und Mobile analysiert und den inkonsistenten Seitenaufbau zwischen Anreise- und Abreise-Tab identifiziert.
- [x] Globale Suche auf Abreisen erweitert; Trefferzahl, sichtbare Einträge und Such-Leerzustand reagieren nun in beiden Dashboard-Tabs einheitlich.
- [x] Bug in `bugs.md` dokumentiert und als behoben markiert sowie einen Playwright-Regressionstest ergänzt; alle 48 Unit-Tests, 25 Playwright-Tests, TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-09 21:31 CEST — SessionId: c064b

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits als erledigt markiert.
- [x] Die fehlende betriebliche Zimmerverfügbarkeit als kleinen, fachlich abgeschlossenen Teilbereich umgesetzt: typisierte Mock-Entitäten speichern Status, Hinweis und Änderungszeitpunkt je Zimmer.
- [x] Zimmer können in der Belegungsübersicht interaktiv gesperrt und wieder freigegeben werden; belegte Zimmer sind gegen eine Sperrung geschützt.
- [x] Gesperrte Zimmer werden aus verfügbarer Kapazität und Buchungsauswahl entfernt und verhindern auch einen Check-in; der Demo-Reset stellt die Ausgangszustände wieder her.
- [x] Die Statusübergänge und Schutzregeln mit zwei Store-Tests abgesichert; alle 50 Unit-Tests, 25 ausgeführte Playwright-Tests, TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 12:25 CEST — SessionId: fd71e

- [x] Aktuelle V8-Testabdeckung geprüft: 97,82 % Statements, 96,79 % Branches, 97,46 % Functions und 99,36 % Lines; wegen der Abdeckung über 80 % den Playwright-Prüfpfad gewählt.
- [x] Alle Routen auf Desktop und Mobile mit Playwright auf Konsolenfehler, horizontales Overflow und Seitenüberschriften analysiert; dabei keine weiteren Aufbaufehler festgestellt.
- [x] Fehlerhafte Tastatur-Fokusführung des globalen Demodaten-Menüs behoben: Der Fokus wechselt beim Öffnen in das Menü und wird nach Escape zur auslösenden Schaltfläche zurückgeführt.
- [x] Playwright-Regressionstest für die Fokusführung ergänzt; alle 115 Unit-Tests, die betroffenen 4 Playwright-Tests, TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 12:36 CEST — SessionId: 8e02d

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits erledigt.
- [x] Den offenen Erweiterungspunkt zu weiteren Buchungsoperationen abgeschlossen: Noch nicht berührte Reservierungen lassen sich direkt aus der Buchungsliste über einen fokussierten Bestätigungsdialog löschen.
- [x] Das typisierte Buchungsmodell erhielt die Store-Operationen `canDeleteBooking` und `deleteBooking`; eingecheckte, ausgecheckte und bereits in der Check-in-Historie vorkommende Buchungen bleiben geschützt, damit keine Referenzen oder Betriebsereignisse verloren gehen.
- [x] Store-Tests für erfolgreiche Löschung, Statusschutz und Historienintegrität ergänzt; 118 Unit-Tests erfolgreich. Der Produktions-Build ist durch eine bestehende, nicht zu diesem Teilaspekt gehörende TypeScript-Doppelbindung in `RequestsPage.vue` blockiert (`v-model` und `:value` am selben Select).

## 2026-08-10 12:39 CEST — SessionId: aaee0

- [x] Teststand und Wartbarkeit geprüft: Die V8-Abdeckung liegt bei 97,74 % Statements, 96,20 % Branches, 97,07 % Functions und 99,10 % Lines (119 Unit-Tests erfolgreich).
- [x] Wegen der Abdeckung über 80 % den Playwright-Prüfpfad ausgeführt: die vollständige E2E-Suite ist mit 39 erfolgreichen Tests und 7 erwarteten, projektabhängig übersprungenen Tests durchgelaufen.
- [x] Alle Routen auf Desktop und Mobile zusätzlich auf Browser-/Konsolenfehler, horizontalen Overflow und eine eindeutige Hauptüberschrift geprüft; dabei keine Aufbaufehler gefunden.
- [x] TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 12:41 CEST — SessionId: dbee7

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt zur Belegungsübersicht abgeschlossen: Eine Belegungsampel zeigt für jeden Tag Auslastungsprozent, belegte und freie Plätze sowie farbliche Risikostufen von normal bis ausgebucht beziehungsweise nicht verfügbar.
- [x] Das bestehende Mock-Datenmodell `DailyOccupancy` um `availablePlaces` und die fachliche Warnstufe `OccupancyLevel` erweitert; die Zuordnung ist als reiner Selector testbar und behandelt eine Kapazität von null explizit als nicht verfügbar.
- [x] Selector-Regressionstests für freie Kapazitäten und alle Ampelstufen ergänzt; alle 120 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 12:41 CEST — SessionId: 618b7

- [x] Komponenten-, Package- und Store-Struktur auf Clean Code und Wartbarkeit geprüft: Die Trennung zwischen Domain-Policies (`src/domain`), reinen Selektoren (`src/store`) und Vue-Store ist grundsätzlich stimmig; als kleiner Schwachpunkt blieb die nicht zentralisierte Kapazitätsprüfung für neue Reservierungen.
- [x] Die neue, frameworkunabhängige Domain-Policy `hasRoomCapacityForStay` in `src/domain/roomAvailability.ts` eingeführt. Sie prüft jede belegte Nacht, berücksichtigt die Zimmerkapazität und ignoriert ausgecheckte Buchungen.
- [x] Die Policy in beide Buchungswege eingebunden: direkte Buchung sowie die Annahme einer Anfrage können keine Reservierung mehr über die maximale Zimmerbelegung hinweg anlegen.
- [x] Mit fokussierten Domain-Tests (Überlappung, Abreisetag, ausgecheckte Buchung, ungültige Eingaben) sowie einem Store-Test für die identische Regel in beiden Buchungswegen abgesichert. Alle 125 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 12:51 CEST — SessionId: 3d5d3

- [x] Den letzten offenen Fehler aus `bugs.md` zur überladenen Belegungsansicht umgesetzt und dort als erledigt markiert.
- [x] Die großflächigen Tages-Auslastungskarten entfernt; stattdessen zeigen die Tagesköpfe einen kompakten farbigen Füllstand und die belegten/gesamten Plätze.
- [x] Die Zimmermatrix und die mobile Tagesliste konsequent auf anonymisierte Kapazitätszahlen umgestellt. Tier- und Kundennamen werden in der Belegungsansicht nicht mehr ausgegeben.
- [x] Playwright-Regressionstest für die kompakte, anonyme Darstellung auf Desktop und Mobile ergänzt. Produktions-Build, alle 125 Unit-Tests sowie die betroffenen 5 Playwright-Tests erfolgreich ausgeführt.

## 2026-08-10 12:55 CEST — SessionId: 0d407

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt umgesetzt und in `extensions.md` als erledigt markiert: Direkt aus der Belegungsansicht lässt sich nun eine Reservierung anlegen.
- [x] Einen fokussierten Reservierungsdialog mit bestehenden Kund:innen-, Tier-, Zimmer- und Buchungs-Mock-Entitäten ergänzt. Die Zimmerliste verwendet die zentrale fachliche Kapazitätsprüfung für jede Nacht des gewählten Zeitraums; bei fehlender Verfügbarkeit erscheint ein unmittelbarer Ausbuchungs-Hinweis.
- [x] Explizite zugängliche Formularnamen ergänzt und die gesamte Interaktion mit einem Playwright-Regressionstest auf Desktop und Mobile abgesichert.
- [x] Alle 126 Unit-Tests, die 2 betroffenen Playwright-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 12:58 CEST — SessionId: 2dbcf

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt abgeschlossen und in `extensions.md` markiert: Alle Listen bieten nun einen CSV-Export an (Buchungen, Kunden & Tiere, Check-in/out und Verlauf, offene Anfragen und Verlauf sowie Belegung).
- [x] Eine gemeinsame, getestete CSV-Export-Policy eingeführt: Sie erzeugt semikolongetrennte, UTF-8-BOM-kodierte Dateien und maskiert Trennzeichen, Anführungszeichen sowie Zeilenumbrüche korrekt.
- [x] Jeder Export wird aus den typisierten Mock-Entitäten und den aktuellen fachlichen Filtern erzeugt, nicht aus der Darstellung; damit exportieren Suche und Statusfilter genau den sichtbaren Datenumfang.
- [x] 127 Unit-Tests, TypeScript-Prüfung, Produktions-Build sowie 2 Playwright-Regressionstests für alle Exporte auf Desktop und Mobile erfolgreich ausgeführt.

## 2026-08-10 12:59 CEST — SessionId: 43572

- [x] Teststand und Wartbarkeit geprüft: Die V8-Abdeckung liegt bei 96,39 % Statements, 95,74 % Branches, 96,66 % Functions und 97,21 % Lines (127 Unit-Tests). Damit ist die 80-%-Schwelle klar überschritten und der Playwright-Prüfpfad wurde verwendet.
- [x] Die vollständige Playwright-Suite auf Desktop und Mobile ausgeführt (54 erfolgreich, 8 bewusst projektspezifisch übersprungen) sowie den Produktions-Build erfolgreich erstellt.
- [x] Einen Aufbaufehler gefunden und behoben: Die fixierte Demodaten-Steuerung überdeckte im Desktop-Dashboard den Button „Belegung planen“. Sie ist jetzt in der Topbar verankert; ihr ausklappbares Menü bleibt dort erreichbar, ohne Seitenaktionen zu verdecken.
- [x] Einen Playwright-Regressionstest ergänzt, der überlappungsfreie Bounding-Boxes prüft und anschließend die Navigation über „Belegung planen“ ausführt.
- [x] Den Fehler in `bugs.md` als behoben dokumentiert.
## 2026-08-10 13:01 CEST — SessionId: 84dd6

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits erledigt.
- [x] Die beiden ersten offenen Anfrage-Erweiterungen aus `extensions.md` umgesetzt und als erledigt markiert: Das Annehmen einer Anfrage erfordert jetzt ausdrücklich entweder die Neuaufnahme des Anfragers oder die Zuordnung zu einer vorhandenen Kundschaft. Es werden keine Kund:innen mehr implizit erzeugt.
- [x] Bestehende Kund:innen lassen sich aus den typisierten Mock-Entitäten auswählen; mögliche Übereinstimmungen bei Name oder Telefonnummer werden direkt an der Anfrage sichtbar gemacht. Bei einer passenden Tierart und einem passenden Namen wird das vorhandene Tier wiederverwendet, andernfalls wird das angefragte Tier im ausgewählten Kundenprofil angelegt.
- [x] Store-Tests für die Pflicht zur expliziten Zuordnung, Neuaufnahme und Wiederverwendung ergänzt sowie den Workflow mit einem Playwright-Regressionstest abgesichert. Alle 128 Unit-Tests und der Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 13:06 CEST — SessionId: e3b68

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt in `extensions.md` abgeschlossen und dort markiert: Schließzeiten können jetzt mit Zeitraum und optionalem Hinweis direkt in der Belegungsansicht angelegt und wieder entfernt werden.
- [x] Ein typisiertes Mock-Datenmodell `PensionClosure` samt fachlicher Zeitbereichs-Policy eingeführt. Schließtage weisen eine Kapazität und freie Plätze von `0` aus; die Zimmeransicht zeigt sie als geschlossen, ohne bereits existierende Aufenthalte zu verfälschen.
- [x] Die zentrale Buchungsprüfung, Anfrageannahme und der Reservierungsdialog sperren Zeiträume, die eine Schließzeit überlappen. Der Demo-Reset stellt den Ausgangszustand ohne nachträglich angelegte Schließzeiten wieder her.
- [x] Selector-/Store- und Playwright-Regressionstests ergänzt; alle 131 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 13:11 CEST — SessionId: 68426

- [x] Den offenen Fehler aus `bugs.md` abgeschlossen und dort als erledigt markiert: Eine Reservierung kann jetzt mehrere Tiere derselben Kundschaft gleichzeitig enthalten.
- [x] Ein echtes Datenmodell `BookingReservation` ergänzt. Es verknüpft die gemeinsam angelegten Einzelaufenthalte über eine Reservierungs-ID und wird beim Demodaten-Reset wiederhergestellt.
- [x] Die Kapazitäts-Policy prüft die benötigten Plätze für alle ausgewählten Tiere zusammen; die Anlage validiert vollständig vor jeder Mutation und ist dadurch atomar.
- [x] Mehrfachauswahl in der Buchungsseite und im Reservierungsdialog der Belegung umgesetzt; das Demo-Profil von Lea Albrecht enthält mit Frieda und Willi zwei direkt testbare Tiere.
- [x] Store-/Domain-Tests und ein Desktop-/Mobile-Playwright-Workflow ergänzt beziehungsweise aktualisiert. 134 Unit-Tests, Produktions-Build sowie die vollständige Playwright-Suite (58 erfolgreich, 8 projektbedingt übersprungen) erfolgreich ausgeführt.

## 2026-08-10 13:18 CEST — SessionId: 52671

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt aus `extensions.md` umgesetzt und als erledigt markiert: Die Account-Mock-Entität verwendet nun Robin Muster inklusive passender Demo-E-Mail statt Christian Oette.
- [x] Die Dashboard-Begrüßung an das Account-Datenmodell gebunden, sodass sie auch nach einer Änderung des Vornamens konsistent bleibt.
- [x] Die zugehörigen Unit- und Playwright-Erwartungen auf die neue Mock-Entität aktualisiert; alle 136 Unit-Tests, 58 aktive Playwright-Tests (8 viewport-spezifisch übersprungen) sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 13:21 CEST — SessionId: 4ef9c

- [x] Teststand und Wartbarkeit geprüft: Die V8-Abdeckung liegt bei 95,26 % Statements, 94,82 % Branches, 95,04 % Functions und 96,09 % Lines (136 Unit-Tests). Die 80-%-Schwelle ist damit überschritten.
- [x] Den Playwright-Prüfpfad ausgeführt: Die vollständige Suite lief ohne Fehlschlag durch (66 Desktop-/Mobile-Ausführungen inklusive gezielt viewport-spezifisch übersprungener Szenarien). Geprüft wurden unter anderem Navigation, Dialog- und Fokusführung, Reservierung, Schließzeiten, Belegung, CSV-Exporte sowie responsive Ansichten.
- [x] Keinen neuen reproduzierbaren Aufbaufehler gefunden; deshalb waren weder ein Code-Fix noch ein neuer Eintrag in `bugs.md` erforderlich.
- [x] TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 13:22 CEST — SessionId: a3b9b

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt aus `extensions.md` umgesetzt und dort als erledigt markiert: Erfolgsmeldungen erscheinen nicht mehr innerhalb einzelner Seiten, sondern in einer globalen Toast-Region.
- [x] Ein typisiertes, kurzlebiges Datenmodell `ToastNotification` ergänzt. Der Store führt Meldungen als Queue mit ID, Text und Zeitpunkt, unterstützt gezieltes Schließen und leert beim Demo-Reset vorherige Rückmeldungen.
- [x] Die globale Toast-Region ist mit Live-Region-Semantik zugänglich, manuell schließbar und blendet Meldungen nach fünf Sekunden automatisch aus; die bisherigen Dashboard-, Einstellungen-, Konto- und Anfrage-Anzeigen wurden entfernt.
- [x] Store-Regressionstest für Queue, Zeitstempel, Schließen und Demo-Reset ergänzt. Alle 137 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 13:29 CEST — SessionId: 88756

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt aus `extensions.md` abgeschlossen und dort markiert: Die Belegungs-Demodaten zeigen über fünf aufeinanderfolgende Tage Teilbelegung, volle Kapazität und eine bewusst angelegte Überbuchung.
- [x] Das Datenmodell um die fachlich persistierte Kennzeichnung `Booking.overbooked` und die Auslastungsstufe `overbooked` erweitert. Eine gemeinsame Domain-Policy liefert freie sowie nur mit Überbuchung mögliche Zimmer, inklusive Spitzenbelegung und freier Plätze.
- [x] Buchungs- und Belegungs-Reservierungsdialog zeigen Überbuchungen eindeutig an und erlauben sie erst nach ausdrücklicher Bestätigung; der Store protokolliert sie als solche und meldet sie per Toast.
- [x] Domain-, Selector- und Store-Regressionstests ergänzt. Alle 140 Unit-Tests, Produktions-Build und die vollständige Playwright-Suite (68 Ausführungen mit projektbedingt übersprungenen Viewport-Szenarien) erfolgreich ausgeführt.
## 2026-08-10 13:33 CEST — SessionId: 62c6e

- [x] Den letzten offenen Fehler aus `bugs.md` anhand von `bug-screenshots/screen2.png` behoben und dort als erledigt markiert: Der „Heute“-Button der Belegungs-Datumsnavigation besitzt jetzt eine gut erkennbare Mindestbreite sowie eine Klickfläche von mindestens 40 × 40 px.
- [x] Die Pfeilnavigation und Datumsauswahl auf dieselbe Höhe angehoben, damit die gesamte Steuerung visuell konsistent und leichter bedienbar ist.
- [x] Playwright-Regressionstest ergänzt, der die Mindestmaße des „Heute“-Buttons prüft.
## 2026-08-10 13:38 CEST — SessionId: 98f20

- [x] `bugs.md` geprüft und den einzigen offenen Fehler vor den Erweiterungen erledigt: Auf der Konto-Seite sind die Aktionsleiste für Kontodaten und die Kündigungszone nun visuell eindeutig getrennt.
- [x] Die Kontoseite erhält dafür einen responsiven, klaren vertikalen Abstand nach dem Formular- und Aktionsbereich; die bestehende mobile Aktionsanordnung bleibt erhalten.
- [x] Einen Desktop-Playwright-Regressionstest ergänzt, der mindestens 28 px Abstand zwischen „Konto speichern“ und der Kündigungszone fordert.
- [x] Den nächsten offenen Erweiterungspunkt umgesetzt und in `extensions.md` als erledigt markiert: Buchungen können neben der Listenansicht jetzt in einer Monats-Kalenderansicht angezeigt werden.
- [x] Der Kalender leitet alle Einträge direkt aus den bestehenden typisierten Buchungsentitäten ab, zeigt Aufenthalte pro Belegungstag und übernimmt Suche sowie Statusfilter aus der Liste; Monatsnavigation ermöglicht die zeitliche Einordnung.
- [x] Playwright-Regressionstest für Ansichtwechsel, Filterwirkung und Monatsnavigation ergänzt. Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 13:41 CEST — SessionId: c923b

- [x] Testbarkeit und Wartbarkeit des aktuellen Clickdummy geprüft: Die fachliche Logik ist weitgehend in Domain-Policies, Selektoren und Store getrennt; der V8-Report weist 95,60 % Statements, 94,61 % Branches, 95,45 % Functions und 96,37 % Lines bei 141 erfolgreichen Unit-Tests aus.
- [x] Da die 80-%-Schwelle überschritten ist, den Playwright-Prüfpfad ausgeführt: Die vollständige Suite lief mit 80 Desktop-/Mobile-Ausführungen ohne Fehlschlag durch (viewport-spezifische Fälle gezielt übersprungen).
- [x] Die zentralen Buchungs- und Belegungsansichten zusätzlich in Desktop- und Mobile-Viewport visuell auf Überlagerungen, responsive Umbrüche, Lesbarkeit und erreichbare Aktionen geprüft. Kein neuer reproduzierbarer Aufbaufehler festgestellt; daher waren weder ein Fix noch ein neuer Eintrag in `bugs.md` erforderlich.
- [x] TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 13:43 CEST — SessionId: 1ec6e

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt aus `extensions.md` umgesetzt und dort markiert: Offene Anfragen zeigen nun unmittelbar, ob ihr gesamter Zeitraum frei ist.
- [x] Das neue typisierte fachliche Modell `RequestAvailability` leitet den Status aus denselben Kapazitäts-, Tierart-, Betriebsstatus- und Schließzeitenregeln ab wie der Annahme-Workflow. Es unterscheidet freie passende Optionen, Ausbuchung und eine überlappende Schließzeit.
- [x] Die Anfragekarten zeigen den Status vor der Zimmerauswahl zugänglich und farblich eindeutig an; ein grüner Status bedeutet, dass mindestens ein passendes Zimmer ohne Überbuchung für den ganzen Zeitraum verfügbar ist.
- [x] Alle 142 Unit-Tests, TypeScript-Prüfung, Produktions-Build sowie der Desktop-/Mobile-Playwright-Regressionstest erfolgreich ausgeführt.

## 2026-08-10 13:45 CEST — SessionId: c64d3

- [x] Den aktuellen Clickdummy auf Testbarkeit und Wartbarkeit geprüft: Die fachlichen Regeln liegen weiterhin überwiegend in Domain-Modulen, Selektoren und Store; die Komponenten bleiben auf Darstellung und Interaktion fokussiert.
- [x] Die Unit-Testabdeckung ermittelt: 144 Tests sind erfolgreich; V8 meldet 95,69 % Statements, 94,72 % Branches, 95,55 % Functions und 96,46 % Lines. Damit ist die 80-%-Schwelle überschritten.
- [x] Deshalb die vollständige Playwright-Prüfung für Desktop und Mobile ausgeführt. Alle anwendbaren Szenarien bestanden; nur viewport-gebundene, bewusst nicht anwendbare Fälle wurden übersprungen. Navigation, modale Fokusführung, responsive Belegung, Buchungs-/Anfrageabläufe und CSV-Exporte sind dadurch abgedeckt.
- [x] TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt. Es wurde kein neuer reproduzierbarer Aufbau- oder Funktionsfehler gefunden; daher waren weder ein Fix noch ein neuer Eintrag in `bugs.md` erforderlich.
## 2026-08-10 13:46 CEST — SessionId: ee0df

- [x] `bugs.md` geprüft; alle dort dokumentierten Fehler waren bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt aus `extensions.md` umgesetzt und als erledigt markiert: Buchungen sind jetzt unabhängig von ihrem Aufenthaltsstatus löschbar.
- [x] Den Löschvorgang fachlich konsistent gemacht: Zugehörige Check-in/out-Ereignisse werden zusammen mit der Buchung entfernt, damit das bestehende Ereignis-Datenmodell keine verwaisten Referenzen enthält.
- [x] Der Bestätigungsdialog erklärt bei allen Aufenthalten ausdrücklich, dass ein vorhandener Check-in/out-Verlauf ebenfalls entfernt wird.
- [x] Store-Regressionstests für bestätigte, eingecheckte/ausgecheckte sowie zurückgenommene Check-ins ergänzt beziehungsweise aktualisiert.
- [x] Verifiziert mit 144 erfolgreichen Unit-Tests, TypeScript-/Produktions-Build sowie der vollständigen Playwright-Suite (80 Ausführungen; viewport-gebundene Szenarien planmäßig übersprungen).
## 2026-08-10 13:47 CEST — SessionId: 3a79b

- [x] `bugs.md` zuerst geprüft: Alle dort erfassten Punkte waren bereits erledigt. Anschließend den ersten noch offenen, zusammenhängenden Erweiterungspunkt „Preislisten in den Einstellungen“ umgesetzt und in `extensions.md` als erledigt markiert.
- [x] Echtes, erweiterbares Mock-Datenmodell ergänzt: `DailyPetRate` speichert je Tierart einen Tagespreis in Euro-Cent; die Demo startet mit 35,00 € pro Hund und 24,00 € pro Katze. Die Preislisten werden beim Speichern defensiv kopiert und beim Demodaten-Reset korrekt wiederhergestellt.
- [x] Die Validierung akzeptiert ausschließlich genau einen positiven, ganzzahligen Preis für Hund und Katze. Neue Unit-Tests decken fehlende/duplizierte Tierarten, Nullbeträge und Centbruchteile ab.
- [x] In den Einstellungen eine zugängliche Preisliste mit Euro-Eingaben ergänzt; die Werte bleiben fachlich präzise als Cent im Modell gespeichert.
- [x] Verifiziert mit 148 Unit-Tests sowie TypeScript-Prüfung und Produktions-Build.

## 2026-08-10 13:50 CEST — SessionId: fc033

- [x] Testbarkeit und Wartbarkeit geprüft: Die fachliche Logik ist weiterhin überwiegend in Domain-Modulen, Selektoren und Store separiert; die Unit-Testabdeckung liegt mit 148 erfolgreichen Tests bei 95,73 % Statements, 94,82 % Branches, 95,63 % Functions und 96,51 % Lines und damit über der 80-%-Schwelle.
- [x] Daher den Playwright-Prüfpfad ausgeführt: Die vorhandene Suite bestand vollständig (82 Desktop-/Mobile-Ausführungen, viewport-spezifische Fälle planmäßig übersprungen). Zusätzlich die Kernansichten Buchungen, Belegung, Anfragen und Kunden & Tiere in Desktop- und Mobilansicht visuell auf Überläufe, Überlagerungen und Responsive-Verhalten geprüft.
- [x] Einen Aufbaufehler im mobilen Kundenverzeichnis gefunden und behoben: Bei 20 Seiten lief die vollständig gerenderte Pagination aus der Karte. Die Navigation zeigt jetzt höchstens fünf Seitennummern rund um die aktuelle Seite; Vor-/Zurück-Navigation bleibt erhalten. Ein mobiler Playwright-Regressionstest prüft, dass die Navigation nicht horizontal überläuft.
- [x] Verifiziert mit 148 Unit-Tests, dem gezielten Playwright-Regressionstest (3 bestanden, 1 projektbedingt übersprungen) sowie TypeScript-Prüfung und Produktions-Build.

## 2026-08-10 13:51 CEST — SessionId: 6b975

- [x] `bugs.md` zuerst geprüft und den noch offenen Punkt aus `Screen3.png` behoben sowie dort als erledigt markiert: Die Kund:innen-Vorschlagsliste im Formular „Neue Buchung“ wird nicht mehr am Rand ihrer Karte abgeschnitten.
- [x] Die Buchungsformular-Karte lässt bewusst nur diese überlagernde Autovervollständigung sichtbar und erhält einen Stacking-Kontext über der nachfolgenden Buchungsliste; das bestehende Kund:innen-Datenmodell und die Auswahlinteraktion bleiben unverändert nutzbar.
- [x] Einen Playwright-Regressionstest für Desktop und Mobile ergänzt. 148 Unit-Tests, TypeScript-Prüfung, Produktions-Build sowie der gezielte Browser-Test sind erfolgreich durchgelaufen.

## 2026-08-10 13:54 CEST — SessionId: d2e53

- [x] Testbarkeit und Wartbarkeit des Clickdummy geprüft: Fachregeln sind weiterhin überwiegend in Domain-Modulen, Selektoren und Store gekapselt; Komponenten konzentrieren sich auf Darstellung und Interaktion.
- [x] Die Unit-Testabdeckung ermittelt: Alle 150 Tests bestehen; V8 meldet 95,79 % Statements, 94,82 % Branches, 95,72 % Functions und 96,57 % Lines. Die 80-%-Schwelle ist damit überschritten.
- [x] Deshalb die vollständige Playwright-Suite für Desktop und Mobile ausgeführt: Alle 84 Ausführungen bestanden, mit nur den bewusst viewport-gebunden übersprungenen Szenarien.
- [x] Die Kernansichten Buchungen, Belegung, Anfragen sowie Kunden & Tiere zusätzlich in Desktop und Mobile visuell auf Überläufe, Überlagerungen und responsive Umbrüche geprüft. Kein neuer reproduzierbarer Aufbau- oder Funktionsfehler festgestellt; `bugs.md` brauchte daher keinen neuen Eintrag.
- [x] TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 13:55 CEST — SessionId: f120d

- [x] `bugs.md` zuerst geprüft und den offenen Punkt zur neuen Buchung umgesetzt sowie dort als erledigt markiert: Die Kund:innen-Autovervollständigung zeigt keine Werte mehr direkt beim Öffnen an.
- [x] Für die Buchungsmaske eine Mindestlänge von zwei Suchzeichen als explizite Komponentenkonfiguration ergänzt. Davor erscheint ein zugänglicher Hinweis zum nötigen nächsten Schritt; ab zwei Zeichen werden passende Mock-Kund:innen wieder nach Name oder Telefonnummer gefiltert.
- [x] Einen Desktop- und Mobile-Playwright-Regressionstest ergänzt, der den Leerzustand, die Ein-Zeichen-Eingabe und das Erscheinen eines Treffers ab zwei Zeichen prüft.
- [x] Produktions-Build sowie gezielte Playwright-Prüfung erfolgreich ausgeführt (4 Tests bestanden).

## 2026-08-10 13:56 CEST — SessionId: a0b36

- [x] `bugs.md` zuerst geprüft; dort sind keine offenen Punkte vorhanden.
- [x] Den ersten offenen Erweiterungspunkt abgeschlossen und in `extensions.md` als erledigt markiert: Der Check-out zeigt jetzt eine transparente Preisberechnung.
- [x] Ein typisiertes abgeleitetes Modell `StayPrice` samt fachlicher Berechnung ergänzt. Es verwendet die konfigurierten, bereits als Mock-Entitäten vorhandenen Tagespreise je Tierart und berechnet Betreuungstage von Anreise inklusive bis Abreise exklusiv.
- [x] Der Check-out-Dialog zeigt Betreuungstage × Tagespreis sowie den Gesamtbetrag im deutschen Euro-Format; bei einer ungültigen Preisgrundlage wird kein Betrag erfunden.
- [x] Drei Unit-Tests für Tageszählung, tierartspezifische Rate und ungültige Preisgrundlagen sowie TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 13:57 CEST — SessionId: 5791c

- [x] Testbarkeit und Wartbarkeit des Clickdummy geprüft: Domain-Regeln, Selektoren und zentraler Store sind weiterhin überwiegend sauber von den Vue-Darstellungskomponenten getrennt; die vorhandene Testsuite ist gut wartbar strukturiert.
- [x] Die vollständige Unit-Testabdeckung ermittelt: 153 Tests bestehen. V8 meldet 95,86 % Statements, 94,95 % Branches, 95,78 % Functions und 96,62 % Lines; die 80-%-Schwelle ist somit deutlich überschritten.
- [x] Deshalb die vollständige Playwright-Suite auf Desktop und Mobile als Seitenaufbau- und Interaktionsprüfung ausgeführt: 86 Ausführungen erfolgreich, mit ausschließlich erwarteten viewport-spezifischen Übersprüngen.
- [x] Produktions-Build inklusive TypeScript-Prüfung sowie Whitespace-Prüfung erfolgreich ausgeführt. Kein neuer reproduzierbarer Aufbau-, Laufzeit- oder Bedienungsfehler gefunden; daher waren kein Bugfix und kein neuer Eintrag in `bugs.md` erforderlich.
## 2026-08-10 13:59 CEST — SessionId: 687a7

- [x] `bugs.md` zuerst geprüft: Es gibt keine offenen Fehler. Danach den priorisierten offenen Erweiterungspunkt „Die Zimmer müssen in den Einstellungen konfigurierbar sein“ umgesetzt und in `extensions.md` als erledigt markiert.
- [x] Ein echtes, typisiertes Zimmer-Stammdatenmodell ergänzt: Zimmer lassen sich in den Einstellungen mit Name, Tierart und Kapazität anlegen, bearbeiten und — wenn sie keine Buchungsreferenz besitzen — wieder entfernen. Neue Zimmer erhalten automatisch einen betriebsbereiten operativen Mock-Status.
- [x] Die fachlichen Schutzregeln zentral im Store umgesetzt: eindeutige Zimmernamen, ganzzahlige Kapazitäten von 1 bis 20, keine Reduktion unter die bestehende aktive Spitzenbelegung sowie keine Tierartänderung oder Löschung bei bestehenden Buchungen.
- [x] Domain- und Store-Tests für gültige und ungültige Stammdaten, Anlegen, Ändern, Löschen und Referenzschutz ergänzt. Verifiziert mit 160 Unit-Tests, TypeScript-Prüfung/Produktions-Build sowie der vollständigen Playwright-Suite (86 Szenarien, erwartete viewport-spezifische Übersprünge).

## 2026-08-10 14:03 CEST — SessionId: 65695

- [x] `bugs.md` zuerst geprüft: Alle dokumentierten Fehler sind bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt aus `extensions.md` umgesetzt und als erledigt markiert: „Letzte Vorgänge“ im Check-in/out-Bereich zeigt höchstens fünf Ereignisse pro Seite.
- [x] Die Seitenansicht nutzt weiterhin die bestehenden typisierten `CheckInOutEvent`-Mock-Entitäten als Datenquelle. Sie reagiert auf neue oder entfernte Ereignisse, begrenzt Seitenwechsel sicher und zeigt den aktuellen Seitenstand zugänglich an.
- [x] Desktop- und Mobile-Playwright-Regressionstest für Seitengröße, Navigation und deaktivierte Randaktionen ergänzt; alle 161 Unit-Tests, TypeScript-Prüfung und Produktions-Build erfolgreich ausgeführt.

## 2026-08-10 14:04 CEST — SessionId: 252b3

- [x] `bugs.md` zuerst geprüft; alle dokumentierten Fehler waren bereits erledigt.
- [x] Den ersten offenen Erweiterungspunkt aus `extensions.md` umgesetzt und dort als erledigt markiert: Check-in/out besitzt nun eine tagesgenaue Datumsauswahl mit Vor-/Zurück-Navigation sowie einem Heute-Rücksprung.
- [x] Die angezeigten Anreisen und Abreisen werden fachlich für das gewählte Datum aus den bestehenden typisierten Buchungsentitäten abgeleitet. Die neue zentrale Selektor-Policy `selectArrivals` entspricht dabei der vorhandenen Abreise-Policy und vermeidet duplizierte Statuslogik in der Oberfläche.
- [x] Die Tagesauswahl aktualisiert Kennzahlen, Listeninhalt, Abholhinweis und CSV-Export; auf kleinen Viewports bricht die Steuerung ohne horizontalen Überlauf um.
- [x] Domain-/Selektor-Regressionstest sowie Desktop- und Mobile-Playwright-Test ergänzt. Gezielte Unit-Prüfung (14 Tests), TypeScript-Prüfung/Produktions-Build und die beiden Browser-Ausführungen erfolgreich ausgeführt.

## 2026-08-10 14:07 CEST — SessionId: 25987

- [x] `bugs.md` zuerst geprüft: Alle beschriebenen Punkte sind bereits erledigt. Anschließend den nächsten offenen Erweiterungspunkt „Paging bei Buchungen, max 10“ umgesetzt und in `extensions.md` als erledigt markiert.
- [x] Die gefilterte Buchungslisten-Ansicht verwendet weiterhin die vorhandenen typisierten `BookingView`-Mock-Entitäten und zeigt daraus höchstens zehn Einträge pro Seite. Der Kalender und CSV-Export bleiben bewusst auf dem vollständigen gefilterten Datenbestand, damit keine Daten durch die Darstellung verloren gehen.
- [x] Eine zugängliche Seitensteuerung mit aktuellem Seitenstand sowie deaktivierten Randaktionen ergänzt. Suche, Statusfilter und eine gezielte Buchungsreferenz setzen den Seitenstand zuverlässig zurück; nach Datenänderungen wird eine nicht mehr vorhandene Seite abgefangen.
- [x] Desktop- und Mobile-Playwright-Regressionstest für Seitengröße, Navigation und Such-Reset ergänzt. Verifiziert mit 162 Unit-Tests, TypeScript-Prüfung/Produktions-Build und beiden Browserausführungen.
