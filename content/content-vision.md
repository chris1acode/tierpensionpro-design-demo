# Idee 

Die Software erlaubt Tierpensionen zu verwalten. Die Besitzer der Tierpensionen können sich einloggen
und Termine und Buchungen verwalten. Tiere sind fest vorgegeben im System hinterlegt als Katze oder Hund

Diese Software soll zunächst nur eine Exploration von Design Ideen sein. Wie würde eine SAAS Software aussehen?
Dazu soll ein internes In-Memory Mock Datenmodell erstellt werden, so dass jede Seite auch eine Interaktion erlaubt.
Die Daten sollen sich korrekt gegenseitig referenzieren.

Bei der Gestaltung soll auf angenehme visuelle Darstellung geachtet werden. 100% Responsive Design ist wichtig.
Und gute Usability ist ebenfalls wichtig.

## Menupunkte

Dashboard
Kunden (Tiere als Unterseite von Kunden)
Check-in/Check-out
Buchungen
Belegung
Anfragen
Einstellungen

## Anmeldung

Eine Anmeldeseite kann erstmal weggelassen werden. 
Aber der Avatar soll bereits sichtbar sein als eingeloggter Benutzer.

## Unterpunkte

Unter Einstellungen soll es die Möglichkeit geben folgendes zu konfigurieren:
- Tierkategorien (z.b. großer Hund, kleiner Hund)
- Zimmer & Plätze (Kapazität)

## Buchungen

Buchungen sind zunächst erstmal nur Termine mit Status. 
Man stellt zuerst eine Reservierung ein. Und erst mit dem Check-In wird daraus eine echte Buchung erstellt.
Jede Buchung nimmt einen freien Platz ein.

Die Buchungen sollten eine Liste haben
Die Buchungen sollten auch eine visuelle Planung erlauben mit einer Tages-Spaltenansicht und Auslastungsanzeige

## Kunden

Kunden sind der Hauptfokus bei Reservierungen und Buchungen.
Sie besitzen in der Regel 1-5 Tiere. In der Unterseite der Kunde soll man die Tiere konfigurieren können.

# Anfragen

Anfragen ist ein Feature, dass über Einstellung freigeschaltet werden kann.
Das Senden der Anfragen läuft über eine andere Anwendung. ABer im ClickDummy wird das Ergebnis angezeigt
Falls eine Anfrage angenommen wird, dann wird sie als Reservierung gespeichert.