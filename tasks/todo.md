[x] Baue eine Anmeldeseite, verlinke auf dem Profilbild via dropdown entweder die Einstellungen oder per Logout den Anmeldescreen.
[x] Baue die Mockup Daten so, dass man bei einem Reset pauschal angemeldet ist. Auf der Anmeldeseite kann man irgendwas eingeben und wird immer als Robin Muster angemeldet. (Mach einen Hinweis: Geben Sie beliebige Daten ein.)
[x] Baue einen Registrierungsprozess. Verlinke ihn in der Anmeldung. Schritt eins: nur eine E-Mail-Eingabe. Nach Absenden erhält man den Hinweis, dass eine E-Mail zugesendet wird. Dann via Router weiter zu Schritt 2. Dort gibt man den Registrierungscode ein. Der kann auch per Parameter an der URL übergeben werden.
[x] Baue den Registrierungsprozess Schritt 3: Eigener Router-Link. Dort gibt man seine Benutzerdaten ein (E-Mail wurde vorher schon gesetzt) sowie Namen und Adresse der Tierpension.
[x] Lege das neue Package src/view an, in das die Router-Haupteinstiegspunkte aus src/components verschoben werden (klare Trennung von wiederverwendbaren Komponenten).
[x] Verschiebe IntroPage.vue (Route "/", name "intro") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[x] Verschiebe BookingsPage.vue (Route "/bookings", name "bookings") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[x] Verschiebe CustomersPage.vue (Route "/customers-pets", name "customers") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[x] Verschiebe OccupancyPage.vue (Route "/occupancy", name "occupancy") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[x] Verschiebe CheckInOutPage.vue (Route "/check-in-out", name "check-in-out") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[x] Verschiebe RequestsPage.vue (Route "/requests", name "requests") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[x] Verschiebe SettingsPage.vue (Routen "/settings/general", "/settings/rates", "/settings/rooms") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[x] Verschiebe AccountSettingsPage.vue (Route "/account", name "account") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[x] Prüfe router.ts sowie alle übrigen Referenzen (z. B. Tests, weitere Importe) auf Pfade zu den verschobenen Seiten und passe sie an, sodass das Projekt nach dem Verschieben fehlerfrei baut und alle Tests grün sind.
