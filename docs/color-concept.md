# Farbkonzept - Tierpension Pro

Dieses Dokument definiert die verbindlichen Farbwerte für die Tierpension Pro Anwendung. Es konkretisiert die visuellen Leitlinien aus den UI/UX Design Guidelines (`ui_ux_design/`).

## 1. Markenfarben

Die Markenfarben dienen der Identifikation und heben primäre Aktionen hervor.

| Token | Hex | Verwendung |
| :--- | :--- | :--- |
| `--primary` | `#DF6420` | Primäre Markenfarbe (Orange), Hauptaktionen |
| `--primary-dark` | `#B94B12` | Hover-Zustände, dunklere Akzente |
| `--secondary` | `#2F5D62` | Sekundäre Farbe (Petrol), Navigation, Info |

## 2. Semantische Statusfarben

Statusfarben werden für Rückmeldungen, Badges und Systemzustände verwendet. Sie sollten immer durch Icons oder Text ergänzt werden.

| Status | Farbe | Hex (Text) | Hex (Background) | Verwendung |
| :--- | :--- | :--- | :--- | :--- |
| **Erfolg** | Grün | `#315F48` | `#E7F2EB` | Erfolgreicher Check-In, abgeschlossene Aktionen |
| **Warnung** | Gold/Bernstein | `#84601C` | `#FAF0D9` | Hohe Auslastung, fehlende Daten, anstehende Aufgaben |
| **Fehler** | Rot | `#9B4444` | `#F6E5E5` | Überbuchung, medizinische Risiken, Fehler-Toasts |
| **Info** | Blau/Teal | `#2F5D62` | `#E4EFF0` | Neutrale Hinweise, sekundäre Informationen |
| **Demo-Daten** | Hell-Lila | `#6B21A8` | `#F3E8FF` | Demo-Modus Aktionen, Beispiel-Daten Markierung |

## 3. Belegungs- und Kapazitätsfarben

Speziell für die Belegungsübersicht (Occupancy Grid) definierte Farben zur Darstellung der Auslastung.

| Zustand | Hintergrund | Text/Icon | Beschreibung |
| :--- | :--- | :--- | :--- |
| **Frei** | `#F3F0EC` | `--muted` | Ausreichend Kapazität vorhanden |
| **Teilbelegt** | `#D2A13C` (Bar) | `#84601C` | Mittlere Auslastung (in UI oft gelb/gold) |
| **Hoch ausgelastet**| `#C77742` (Bar) | `#9B5A31` | Nur noch wenige Plätze frei |
| **Ausgebucht** | `#4C5F99` | `#344677` | Keine Kapazität mehr verfügbar (Blau-Ton) |
| **Überbucht** | `#8F2F3C` | `#7A1F2C` | Kapazität überschritten (Dunkelrot) |
| **Gesperrt** | `#E7E2DC` | `#8B847E` | Zimmer wartet auf Wartung oder Pension geschlossen |

## 4. Check-In / Check-Out Logik

Die Zustände im Tagesgeschäft nutzen die semantischen Farben zur schnellen Unterscheidung.

*   **Geplante Anreise:** Nutzt Orange (`orange` Klasse in Metrics) zur Signalisierung von anstehender Arbeit.
*   **Eingecheckt:** Nutzt Grün (`success` bzw. `check-in` Icons) für den aktiven Aufenthalt.
*   **Abgereist / Ausgecheckt:** Nutzt neutrale Grau/Braun-Töne (`#eeeae6`) zur Kennzeichnung abgeschlossener Vorgänge.

## 5. Neutrale Farben & Oberflächen

Warme Töne für eine freundliche Atmosphäre.

| Ebene | Hex (Background) | Hex (Border) | Verwendung |
| :--- | :--- | :--- | :--- |
| **Canvas** | `#F7F6F3` | - | Seitenhintergrund |
| **Surface** | `#FFFFFF` | `#DED9D3` | Cards, Tabellen, Formulare |
| **Muted Surface**| `#F1EFEB` | - | Filterleisten, Gruppen |
| **Overlay** | `rgba(36,33,31,0.48)` | - | Modale Hintergründe |

---

## Beobachtete Inkonsistenzen (Review)

Bei der Analyse der aktuellen Implementierung sind folgende Punkte aufgefallen, die bereinigt werden sollten:

1.  **Benennung in der Belegungsübersicht:** In `OccupancyPage.vue` wird die Klasse `mid` für den Status `medium` verwendet. In den CSS-Variablen oder im globalen Konzept sollte eine einheitliche Benennung (z.B. `low`, `medium`, `high`, `full`) angestrebt werden.
2.  **Status-Badges:** Die Klasse `.status-badge.full` wird in der Zimmerliste für "Ausgebucht" verwendet (Gelb/Gold), aber in der Belegungsübersicht steht "Full" für Blau (`#4C5F99`). Hier droht Verwechslungsgefahr zwischen "Zimmer voll belegt" und "Pension voll belegt".
3.  **Anfragen-Status:** In `RequestsPage.vue` wird für akzeptierte Anfragen die Klasse `.checked-in` (Grün) zweckentfremdet. Dies ist semantisch ungenau, da das Tier noch nicht physisch eingecheckt sein muss. Ein Status `accepted` sollte eine eigene (evtl. ähnliche) Farbe haben.
4.  **Farbwerte im CSS:** Viele Farben sind als Hardcoded Hex-Werte in der `styles.css` verteilt, anstatt die im `:root` definierten Variablen (oder neue Variablen wie `--success`, `--warning`) konsequent zu nutzen.
5.  **Gesperrt vs. Geschlossen:** In der Belegungsansicht wird zwischen "Maintenance" (Gesperrt) und "Closed" (Schließzeit) unterschieden, beide nutzen jedoch sehr ähnliche visuelle Muster (Diagonalstreifen vs. Icons). Hier sollte die Farbwahl (Grau vs. leichtes Rot/Beige) klarer definiert werden.
