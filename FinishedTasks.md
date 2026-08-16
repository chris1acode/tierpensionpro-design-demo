# Erledigte Aufgaben

- 2026-08-16 18:01 | Session 5ed26 | Neues Preisstaffeltarifmodell in Buchungen umgesetzt: Neue Einzel- und Sammelbuchungen speichern den ausgewählten Tarif als Mock-Entitätsreferenz. Die Buchungsmaske bietet die Tarifwahl und berechnet die Vorschau positionsgerecht für alle Tiere und Nächte. Beim Check-out werden tarifbasierte Einzelanteile als unveränderlicher Snapshot gespeichert; historische Mock-Buchungen bleiben über den bisherigen Tagespreis kompatibel.

- 2026-08-16 17:58 | Session ebdfb | Preisstaffeltarife in den Einstellungen implementiert: eigenständige Mock-Entitäten mit Namen und Preisstufen, inklusive Demotarifen „Einzelzimmer“ und „Standardzimmer“. Die Tarifverwaltung erlaubt Anlegen, Umbenennen sowie Hinzufügen und Entfernen von Preisstufen. Die Domänenvalidierung erzwingt die erste Stufe ab Tier 1, strikt aufsteigende Tierpositionen und positive Cent-Beträge; die Berechnung bildet Staffelpreise pro Nacht und über mehrere Nächte ab. Buchungen bleiben entsprechend der Aufgabenabgrenzung unverändert. Produktionsbuild sowie 221 Tests erfolgreich.

- 2026-08-16 16:07 | Session abaeb | Anfrageannahme um eine explizite Tierzuordnung erweitert: Mitarbeitende können nun für jedes angefragte Tier ein passendes bestehendes Tierprofil des gewählten Kunden wählen oder ein neues Mock-Tierprofil anlegen. Die Store-Logik validiert Besitzer und Tierart, verhindert Doppelzuordnungen und erzeugt für mehrere neue Tiere eindeutige Entitäten samt gemeinsamer Reservierung. Die öffentliche Anfrageseite persistiert ihre validierten `NewBookingRequest`-Mock-Entitäten bereits in derselben Warteschlange; beide offenen Aufgaben in `tasks/todo.md` sind als erledigt markiert. Produktionsbuild erfolgreich; die Tests enthalten einen bereits bestehenden, unabhängigen Erwartungsfehler beim Namen der Demopension.

- 2026-08-16 16:03 | Session e8e3c | Öffentliche Anfrageseite für mehrere Tiere erweitert: Das Formular verwaltet dynamische Tier-Entitäten; Validierung, Zimmerverfügbarkeit und Kapazitätsprüfung berücksichtigen die gesamte Gruppe. Beim Annehmen entstehen einzelne Aufenthalte in einer gemeinsamen Mock-Reservierung. Die Anfragenübersicht, Zuordnung und der CSV-Export zeigen alle Tiere.
- 2026-08-16 16:03 | Session e8e3c | Kopfbereich der öffentlichen Anfrageseite bereinigt: Das nicht benötigte Tier-Badge wurde entfernt.

- 2026-08-16 15:53 | Session ffdb0 | Check-in-/out-Verlauf stabilisiert: Für die optionale Rückgängig-Aktion bleibt nun in jeder Verlaufszeile ein fester Aktionsslot reserviert; der Buchungslink verschiebt das Layout nicht mehr.
- 2026-08-16 15:53 | Session ffdb0 | Dashboard-Kennzahlen für mittlere Auflösungen angepasst: Die Symbolfläche steht jetzt bis zur großen Breakpoint-Stufe in einer eigenen Zeile und die Karten bleiben lesbar.
- 2026-08-16 15:53 | Session ffdb0 | Öffentliche Anfragenseite unter `/request-demo` umgesetzt: Das einbettbare, eigenständige Formular erfasst Kontakt-, Tier- und Termindaten und speichert validierte `NewBookingRequest`-Mock-Entitäten in der bestehenden Anfrage-Warteschlange. In den Einstellungen ist der persönliche Link neben der Aktivierung hinterlegt. Build und 214 Tests erfolgreich.

- 2026-08-16 15:39 | Session 638cb | Architektur der gerouteten Hauptseiten umgesetzt: `src/view` angelegt und Intro, Buchungen, Kunden, Belegung, Check-in/-out, Anfragen, Einstellungen sowie Konto aus `src/components` dorthin verschoben. Alle App- und Komponentenimporte angepasst; Router und Referenzen geprüft. Build sowie 214 Tests erfolgreich.

- 2026-08-16 16:05 | Session b45cc | Registrierungsprozess Schritt 3 umgesetzt: Route `/register/pension`, Validierung und Abschlussseite für Benutzer- sowie Pensionsdaten ergänzt. Der eigenständige Mock-Onboarding-Datensatz speichert Namen, Pensionsadresse und Abschlusszeitpunkt, ohne das bestehende Demokonto zu verändern.

- 2026-08-16 16:00 | Session f1f8e | Registrierungsprozess für E-Mail und Bestätigungscode umgesetzt: eigene Mock-Registrierungsentität mit Reset-Verhalten, Anmeldelink sowie Routen `/register` und `/register/verify`; E-Mail und Code können über URL-Parameter vorausgefüllt werden.

- 2026-08-16 15:36 | Session 2a340 | Demo-Anmeldung mit eigenem Mock-Sitzungsmodell umgesetzt: Start und Daten-Reset melden automatisch Robin Muster an; beliebige Login-Eingaben führen als Robin Muster zum Dashboard, inklusive Hinweis und Logout-Zustand.

- 2026-08-16 15:34 | Session a38f5 | Anmeldeseite und Profilmenü umgesetzt: Das Profilbild öffnet nun ein Menü zu den Kontoeinstellungen oder zur Abmeldung; Abmelden führt zur neuen Anmeldeseite.

- 2026-08-16 15:33 | Session fa763 | Dashboard-Kennzahlen für kleine Auflösungen angepasst: Das Symbol steht nun in einer eigenen Zeile oberhalb der Kartendetails.
- 2026-08-16 15:33 | Session f9231 | Mobile Navigation auf kleinen Auflösungen repariert: Der geöffnete Drawer überschreibt seine ausgeblendeten Responsive-Standardwerte wieder korrekt.
