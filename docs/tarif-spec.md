# Spezifikation: Tariftyp „Preisstaffeltarif“

## Zweck

Ein Preisstaffeltarif berechnet den Übernachtungspreis abhängig von der Anzahl der Tiere innerhalb einer Buchung.

Eine Buchung verwendet genau einen Tarif und kann mehrere Tiere enthalten.

## Konfiguration

Der Betreiber wählt den Tariftyp „Preisstaffeltarif“ und pflegt eine oder mehrere Preisstufen.

Jede Preisstufe besteht aus:

* „Ab dem wievielten Tier gilt der Preis?“
* „Preis pro Tier und Nacht“

Beispiel:

| Preisstufe     |                     Preis |
| -------------- | ------------------------: |
| 1. Tier        |          30 EUR pro Nacht |
| Ab dem 2. Tier | 20 EUR pro Tier und Nacht |

## Berechnungsregel

Der Preis einer Stufe gilt nur für die Tiere ab der angegebenen Position. Er verändert nicht den Preis der vorherigen Tiere.

Beispiel:

| Anzahl Tiere |                   Preis pro Nacht |
| -----------: | --------------------------------: |
|            1 |                            30 EUR |
|            2 |          30 EUR + 20 EUR = 50 EUR |
|            3 | 30 EUR + 20 EUR + 20 EUR = 70 EUR |

Der Gesamtpreis der Buchung ergibt sich aus:

```text
Gesamtpreis = Preis aller Tiere pro Nacht * Anzahl Nächte
```

Beispiel für drei Tiere und fünf Nächte:

```text
Preis pro Nacht = 30 EUR + 20 EUR + 20 EUR
Preis pro Nacht = 70 EUR

Gesamtpreis = 70 EUR * 5 Nächte
Gesamtpreis = 350 EUR
```

## Mehrere Preisstufen

Der Tarif kann weitere Stufen enthalten:

| Preisstufe     |  Preis |
| -------------- | -----: |
| 1. Tier        | 30 EUR |
| Ab dem 2. Tier | 25 EUR |
| Ab dem 4. Tier | 20 EUR |

Daraus ergibt sich:

```text
1 Tier:   30 EUR
2 Tiere:  30 + 25 = 55 EUR
3 Tiere:  30 + 25 + 25 = 80 EUR
4 Tiere:  30 + 25 + 25 + 20 = 100 EUR
5 Tiere:  30 + 25 + 25 + 20 + 20 = 120 EUR
```

## Validierungsregeln

* Die erste Preisstufe muss beim ersten Tier beginnen.
* Die Tieranzahl der folgenden Preisstufen muss aufsteigend sein.
* Für dieselbe Tieranzahl darf es nicht mehrere Preisstufen geben.
* Zu jeder Preisstufe muss ein Preis angegeben werden.

## Abgrenzung

Der Preisstaffeltarif erzeugt keinen eigenständigen Rabatt. Der günstigere Preis für weitere Tiere ist unmittelbar Bestandteil der Preisstaffel.

Soll ein Rabatt ausdrücklich berechnet und als Rabatt ausgewiesen werden, ist dafür ein anderer Tariftyp erforderlich.
