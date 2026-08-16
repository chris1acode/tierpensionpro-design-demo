# Erledigte Aufgaben

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
