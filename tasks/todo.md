[x] Baue eine Anmeldeseite, verlinke auf dem Profilbild via dropdown entweder die Einstellungen oder per Logout den Anmeldescreen.
[ ] Baue die Mockup Daten so, dass man bei einem Reset pauschal angemeldet ist. Auf der Anmeldeseite kann man irgendwas eingeben und wird immer als Robin muster angemeldet. (mach einen Hinwweis: geben sie beliebige Daten ein)
[ ] Baue einen Registriersprozess. Verlinke ihn in der Anmeldung. Schritt ein, nur eine E-Mail eingabe. Nach absenden erhält man den Hinweis, dass man Eine Email zugesendet bekommt. Dann via Router weiter zu Schritt 2. Dort gibt man den Registrierungscode ein. Der kann auch per Parameter an der URL übergeben werden.
[ ] Baue den Registrierungsprozess Schritt 3: Eigener Router Link. Dort gibt man seine Benutzerdaten ein (Email wurde vorher schon gesetzt) und den Namen und die Adresse der Tierpension
[ ] Lege das neue Package src/view an, in das die Router-Haupteinstiegspunkte aus src/components verschoben werden (klare Trennung von wiederverwendbaren Komponenten).
[ ] Verschiebe IntroPage.vue (Route "/", name "intro") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[ ] Verschiebe BookingsPage.vue (Route "/bookings", name "bookings") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[ ] Verschiebe CustomersPage.vue (Route "/customers-pets", name "customers") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[ ] Verschiebe OccupancyPage.vue (Route "/occupancy", name "occupancy") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[ ] Verschiebe CheckInOutPage.vue (Route "/check-in-out", name "check-in-out") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[ ] Verschiebe RequestsPage.vue (Route "/requests", name "requests") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[ ] Verschiebe SettingsPage.vue (Routen "/settings/general", "/settings/rates", "/settings/rooms") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[ ] Verschiebe AccountSettingsPage.vue (Route "/account", name "account") von src/components nach src/view und passe den Import in App.vue entsprechend an.
[ ] Prüfe router.ts sowie alle übrigen Referenzen (z.B. Tests, weitere Importe) auf Pfade zu den verschobenen Seiten und passe sie an, sodass das Projekt nach dem Verschieben fehlerfrei baut und alle Tests grün sind.
