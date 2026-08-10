[x] There is no router implemented
[x] 404 page is missing
[x] A missing space between Tierpension and Pro
[x] Wenn man sucht und ein Treffer nicht vorhanden ist, steht da "Alle erwarteten Tiere sind angekommen." statt "Keine Treffer gefunden." — behoben in SessionId 86236
[x] Pflegeaufgaben werden nicht benötigt, kann weg — entfernt in SessionId 9f9dc
[x] Zahlungen werden nicht benötigt, kann weg — entfernt in SessionId c5efc
[x] Gäste im Haus muss Tiere im Haus sein — behoben in SessionId d47d5
[x] So viele Mock Daten erzeugen, dass auch Paging funktioniert — umgesetzt in SessionId d34d7
[x] Hauptstandort wird nicht benötigt, kann weg — behoben in SessionId f3cf0
[x] Kundenverzeichnis ist zu gequetscht, sollte 2/3 des Contents einnehmen — behoben in SessionId a2e84
[x] Kundenverzeichnis mit Details funktioniert nicht gut in kleiner Dimension. Untereinander macht keinen Sinn. Das muss dann anders gelöst werden. — durch responsive Master-Detail-Navigation behoben in SessionId d3a9b
[x] Playwright-Test für die Desktop-Breite des Kundenverzeichnisses verwendete den veralteten Pfad `/kunden` und lief in einen Timeout — auf `/kunden-tiere` korrigiert in SessionId d3a9b
[x] Reinigung wird nicht benötigt, Funktion weg! — entfernt in SessionId b98cc
[x] Der im globalen Suchfeld beworbene Tastaturkurzbefehl Cmd/Ctrl+K fokussiert die Suche nicht — behoben in SessionId af239
[x] Modale Dialoge übernehmen beim Öffnen nicht den Tastaturfokus und lassen sich nicht mit Escape schließen — behoben in SessionId 25810
[x] Fehlender Viewport-Meta-Tag verhindert auf echten mobilen Browsern die vorgesehenen Responsive-Breakpoints; die geschlossene Seitennavigation bleibt dadurch sichtbar beziehungsweise fokussierbar — behoben in SessionId 11ba2
[x] Der Tastaturfokus kann mit Tab beziehungsweise Shift+Tab aus einem als modal ausgezeichneten Dialog in die Seite dahinter wechseln — behoben in SessionId 6f631
[x] Buchungen müssen in Kombination mit Kunde geschehen. — kundengeführte Buchungsanlage mit validierter Kunden-Tier-Zuordnung umgesetzt in SessionId b17f4
[x] Beim Öffnen der mobilen Navigation bleibt der Tastaturfokus auf der Seite dahinter und der Drawer lässt sich nicht mit Escape schließen — Fokusübergabe, Escape-Schließen und Fokuswiederherstellung umgesetzt in SessionId c04dc
[x] Der Tastaturfokus kann mit Tab beziehungsweise Shift+Tab aus der geöffneten mobilen Navigation in die verdeckte Seite wechseln — modale Semantik und zyklische Fokusführung umgesetzt in SessionId 24b80
[x] Die globale Dashboard-Suche filtert nur Anreisen; im Tab „Abreisen“ bleiben trotz Suchbegriff alle Einträge sichtbar — einheitliche Filterung und Such-Leerzustand umgesetzt in SessionId 5a42f
[x] Cmd/Ctrl+K verschiebt den Tastaturfokus trotz geöffnetem Dialog beziehungsweise mobiler Navigation in das Suchfeld der verdeckten Seite — globalen Suchshortcut während modaler Oberflächen gesperrt in SessionId 3e9fe
[ ] Hauptmenupunkt Anfragen fehlt
[ ] Hauptmenupunkt Belegung fehlt
