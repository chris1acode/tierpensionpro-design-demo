[x] Umbau "Kund:in anlegen" von Inline-Formular auf Modal in CustomersPage.vue (inkl. Bearbeiten via Modal)
[x] Umbau "Tier anlegen" von Inline-Formular auf Modal in CustomersPage.vue (inkl. Bearbeiten via Modal)
[x] Umbau "Notfallkontakt hinterlegen". Die Funktion kann weg.
[x] Umbau "Neue Buchung" von Inline-Formular auf Modal in BookingsPage.vue (inkl. Bearbeiten via Modal)
[ ] Umbau "Schließzeit anlegen" von Inline-Formular auf Modal in OccupancyPage.vue (inkl. Bearbeiten via Modal)
[ ] Umbau Offene Anfragen. Kein Inline Formular mehr. Zuordnung über Modal.
[ ] Gleiche color-concept.md mit den tatsächlichen Farben ab und fixe sie ggf.
[ ] Zimmer Einstellungen sieht visuell kacke aus. Geht das nicht übersichtlicher? Außerdem Modal verwenden für Create und Edit.
[ ] Schriftarten in AccountSettingsPage.vue prüfen und vergrößern
[ ] Schriftarten in BookingsPage.vue prüfen und vergrößern
[ ] Kunden & Tiere Aufteilung von verzeichnis und card daneben 50/50
[ ] Schriftarten in CheckInOutPage.vue prüfen und vergrößern
[ ] Schriftarten in CustomersPage.vue prüfen und vergrößern
[ ] Schriftarten in OccupancyPage.vue prüfen und vergrößern
[ ] Schriftarten in RequestsPage.vue prüfen und vergrößern
[ ] Schriftarten in SettingsPage.vue prüfen und vergrößern
[ ] Besonderes Futter als Checkbox bei Tieren ermöglichen
[ ] Verwende das richtige logo.svg
[ ] Logo ist bei zusammengeklapptem Men gequetscht. Fixe das!
[ ] Tier kachel bei Kunden & Tiere soll volle Breite der Card haben
[ ] Kunden & Tiere Kundenprofil. Die Aktionen sind viel zu sehr verstreut. Pack die zusammen nach oben.
[ ] Kunden & Tiere Kunde anlegen als Hauptaktion nach oben und primary
[ ] src/components/BookingsPage.vue: "Kund:in" -> "Kunde" (Labels, Fehlermeldungen, Spaltenüberschriften), src/components/OccupancyReservationModal.vue: "Kund:in" -> "Kunde", src/components/CustomerFormModal.vue: "Kund:in anlegen" -> "Kunden anlegen", src/components/CheckInOutPage.vue: "Kund:in" -> "Kunde"
[ ] src/components/RequestsPage.vue: "Kund:in" -> "Kunde", src/components/CustomerAutocomplete.vue: "Kund:in suchen" -> "Kunden suchen", src/components/CustomersPage.vue: "Kund:innen", "Kund:in anlegen" -> "Kunden", "Kunden anlegen", e2e/dashboard-search.spec.ts: Alle Vorkommen von "Kund:in" und "Kund:innen" in Tests anpassen , docs/documentation.md und andere Dokumente prüfen
[ ] Dashboard: Router-Link auf englischen Bezeichner umstellen (z.B. /dashboard statt / falls gewünscht, aktuell /)
[ ] Kunden & Tiere: Router-Link auf englischen Bezeichner umstellen (/customers-pets statt /kunden-tiere)
[ ] Check-in/out: Router-Link prüfen/umstellen auf englischen Bezeichner (/check-in-out ist bereits englisch)
[ ] Buchungen: Router-Link auf englischen Bezeichner umstellen (/bookings statt /buchungen)
[ ] Belegung: Router-Link auf englischen Bezeichner umstellen (/occupancy statt /belegung)
[ ] Anfragen: Router-Link auf englischen Bezeichner umstellen (/requests statt /anfragen)
[ ] Einstellungen: Router-Link auf englischen Bezeichner umstellen (/settings statt /einstellungen)
[ ] Konto: Router-Link auf englischen Bezeichner umstellen (/account statt /konto)
[ ] Kundenprofil. Badge weg.
[ ] Kundenprofil: Tiersymbol viel zu dominant. Als kleines Mini Symbol ok, aber nicht mehr.
[ ] Check-in/out: Das kleine Badge mit z.b. 6 offen kann weg.
[ ] Buchungsliste soll nach Zeitstempel sortiert sein. Zuletzt angelegt oben.
[ ] Gib seiten mit Zeitachsenansichten eine Mindesthöhe, damit sie bei der navigation nicht springen.
[ ] Buchungen braucht in der Liste einen Datumsfilter (url parameter). Und von der der Belegung soll man zu den aktuellen Buchungen gelangen können über Datumsklick  