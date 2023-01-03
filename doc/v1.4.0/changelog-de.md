# Änderungen in v1.4.0
## [Feature] Alben in Album Auswahl sortieren
Diese Feature erlaubt die Alben in der Album Auswahl zu sortieren.
Zur Illustration wird die folgende Ordnerstruktur angenommen:
* C:/Bilder
  * Fotos
    * **Games**: Erstellt im Januar
      * 10 Bilder
    * **Pflanzen**: Erstellt im Juni
      * 20 Bilder
    * **Selfies**: Erstellt im März
      * 15 Bilder
  * Touren
    * **April**: Erstellt im April
      * 50 Bilder
    * **Februar**: Erstellt im Februar
      * 100 Bilder
    * **Mai**: Erstellt im Mai
      * 17 Bilder

Sortieroptionen:
- **Dateipfad: A - Z** (Voreinstellung) Sortiert die Alben in alphabetischer Reihenfolge basierend auf ihrem Dateipfad: 
  > Games, Pflanzen, Selfies, April, Februar, Mai
- **Dateipfad: Z - A** Sortiert die Alben in umgekehrter alphabetischer Reihenfolge basierend auf ihrem Dateipfad:
  > Mai, Februar, April, Selfies, Pflanzen, Games
- **Name: A - Z** Sortiert die Alben in alphabetischer Reihenfolge basierend auf dem Namen ihres Ordners:
  > April, Februar, Games, Mai, Pflanzen, Selfies
- **Name: Z - A** Sortiert die Alben in umgekehrter alphabetischer Reihenfolge basierend auf dem Namen ihres Ordners:
  > Selfies, Pflanzen, Mai, Games, Februar, April
- **Datum: Neu - Alt** Sortiert die Alben basierend auf dem Erstelldatum ihres Ordners von neu nach alt:
  > Games, Februar, Selfies, April, Mai, Pflanzen
- **Datum: Alt - Neu** Sortiert die Alben basierend auf dem Erstelldatum ihres Ordners von alt nach neu:
  > Pflanzen, Mai, April, Selfies, Februar, Games
- **Größe: Klein - Groß** Sortiert die Alben basierend auf der Anzahl der enthaltenen Bilder von klein nach groß:
  > Games, Selfies, Mai, Pflanzen, April, Februar
- **Größe: Groß - Klein** Sortiert die Alben basierend auf der Anzahl der enthaltenen Bilder von groß nach klein:
  > Februar, April, Pflanzen, Mai, Selfies, Games

Wenn eine dieser Optionen ausgewählt wird, werden die Alben entsprechend sortiert.

## [Feature] Alben in Album Auswahl suchen
Es wird ein Suchfeld hinzugefügt.
Wird in diesem Suchfeld die ENTER Taste gedrückt, so werden nur Alben angezeigt, deren Name den aktuellen Inhalt des Suchfelds **enthält**.