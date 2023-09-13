# Einleitung

Der Slideshow Viewer ist eine Anwendung zum Präsentieren von Bildern aus Verzeichnissen.  
Er stellt Optionen zum Einstellen der Präsentationsart bereit.  

Desweiteren vereinfacht er den Zugriff auf Verzeichnisse die Bilder enthalten.

# Album öffnen

Es gibt verschiedene Möglichkeiten ein [Album] zu öffnen.

## Direkt

Das Tastenkürzel für diese Funktion ist `Strg+O`.  
Die Funktion kann auch über den Menüpfad `Datei > Öffnen` aufgerufen werden.  
In beiden Fällen öffnet sich ein Verzeichnis-Auswahldialog.  
Wird die Auswahl mit `Ordner auswählen` bestätigt, so wird der ausgewählt Ordner als [Album] geöffnet.

Wird die Auswahl mittels `Abbrechen` geschlossen, so wird das aktuell geladene [Album] geschlossen.  
Daraufhin wird der Startbildschirm der Anwendung angezeigt.

## Album Auswahl

[Album-Auswahl]: #album-auswahl

Das Ziel dieser Funktion ist es das Wechseln zwischen [Alben] zu erleichtern.  

Das Tastenkürzel für diese Funktion ist `Alt+A`.  
Die Funktion kann auch über den Menüpfad `Datei > Album Auswahl` aufgerufen werden.  
In beiden Fällen öffnet sich ein Verzeichnis-Auswahldialog.  
Dieser erlaubt die Auswahl mehrerer Verzeichnisse.

Nachdem die Auswahl mittels `Ordner öffnen` bestätigt wurde, wird das [Album-Auswahl-Fenster] angezeigt.  
Dieses Fenster zeigt alle in den ausgewählten Verzeichnissen enthaltenen [Alben] an.  
Enthält bespielsweise eines der ausgewählten Verzeichnisse mehrere Unterverzeichnisse mit Bildern, so wird jedes dieser Unterverzeichnisse als [Album] angezeigt.  

### Album Auswahl Fenster

[Album-Auswahl-Fenster]: #album-auswahl-fenster

![Album-Auswahl Fenter](./screenshots/album-selection.png)

Durch einen Klick auf ein [Album] wird dieses im [Diashow-Fenster] geladen.  

Jedes [Album] wird durch ein [Cover] und den Name seines Verzeichnisses dargestellt.  
Wird der Mauszeiger über auf ein [Album] bewegt, so werden weitere Information zum [Album] angezeigt.  

Weitere [Alben] können hinzugefügt werden, indem die Funktion per Menüpunkt oder Tastenkürzel erneut aufgerufen wird.  
Um die Auswahl zu leeren, muss das [Album-Auswahl-Fenster] geschlossen werden. 
Es werden maximal 20 [Alben] auf einmal angezeigt.  
Um auf weitere [Alben] zuzugreifen kann die Seitennavigation am unteren Rand genutzt werden. 

### Sortieren und Suchen

Die angezeigten [Alben] können mittels des Drop-Down-Auswahl oben links umsortiert werden.  
Das Suchen nach bestimmten [Alben] ist durch das Suchfeld oben rechts möglich.  
Wird ein Text in das Suchfeld eingegeben und mit `Enter` bestätigt, so werden nur noch [Alben] deren Name den angegebenen Text enthält, angezeigt.  
Um die Suchbeschränkung zu entfernen, kann das `x` am Ende des Suchfeld genutzt werden.  
Alternativ kann das Suchfelds geleert und die Leerung anschließend mit `Enter` bestätigt werden.

### Cover

[Cover]: #cover

Ein Bild, dass ein [Album] repräsentiert.  
Für [Alben] ohne festgelegtes [Cover] wird das erste Bild genutzt.  
Im [Album-Auswahl-Fenster] kann mit einem `Rechtsklick` auf ein [Album] kann dessen [Cover] geändert werden.  
Befindet sich das [Cover] im Verzeichnis des [Album]s, so bleibt diese Einstellung erhalten auch wenn das Verzeichnis (als Ganzes) verschoben wird.  
Existiert das ausgewählte [Cover] Bild nicht (mehr), so wird das erste Bild des Verzeichnisses verwendet.

**Technische Details** 
> Im Verzeichnis des [Album]s wird eine .json Datei angelegt, die diese Einstellung beinhaltet.  
> Das Löschen, dieser Datei ist unbedenklich, es sorgt lediglich dafür, dass das erste Bild im Verzeichnis wieder als [Cover] genutzt wird.  
> Diese Datei kann auch auf andere Rechner übernommen werden.  

# Diashow Fenster

[Diashow-Fenster]: #diashow-fenster

Das [Diashow-Fenster] ist das Hauptfenster der Anwendung.  
Beim Start der Anwendung wird der Startbildschirm angezeigt.  
Seine Funktion ist es die Bilder aus [Alben] als [Diashow] anzuzeigen.
Desweiteren erlaubt es die [Diashow] zu [steuern](#Diashow-steuerung).

## Diashow Steuerung

[Diashow-Steuerung]: #diashow-steuerung

Wird die Maus an den unteren Rand des [Diashow-Fenster]s bewegt, so wird die [Diashow-Steuerung] angezeigt.  

![Diashow Steuerung](./screenshots/slideshow-controls.png)

Von links nach rechts haben die Schaltflächen die folgenden Funktionen:

- Springt zum vorheriges Bild des [Album]s.  
Das Tastenkürzel ist `Pfeiltaste nach links`.
- Startet bzw. stoppt die [Diashow].  
Das Tastenkürzel ist `Leertaste`.
- Sprint zum nächsten Bild des [Album]s.  
Das Tastenkürzel ist `Pfeiltaste nach rechts`.

Durch das Starten der [Diashow], wird nach einer [konfigurierbaren](#diashow-einstellungen) Zeit automatisch das Bild des [Album]s angezeigt.  

# Diashow Einstellungen

Diese Funktion stellt ein Konfigurationsfenster bereit.
In diesem können die Einstellung der [Diashow] angepasst werden.

![Diashow Einstellung](./screenshots/slideshow-configuration.png)

## Diashow Parameter

| Parameter | Wertebereich | Beschreibung |
| --- | --- | --- |
| Übergangsart | "Linear", "Fließend", "Ausklingend", "Nachhall", "Ausklingend und Nachhall" | Bestimmt die Art des Übergangs zwischen zwei Bildern. Siehe [Diashow-Übergänge]. |
| Anzeigedauer (s) | Alle positiven Zahl (inklusive 0) | Die Zeit in Sekunden, die ein Bild während dem Abspielen der [Diashow] angezeigt wird. |
| Übergangszeit (s) | Alle positiven Zahl (inklusive 0) | Die Zeit in Sekunden, die der Übergang von einem Bild zum nächsten dauert. |

## Diashow Übergänge

[Diashow-Übergänge]: #diashow-übergänge

Alle Übergangsarten basieren darauf, dass das nächste Bild hinter das aktuelle gelegt wird.  
Das aktuelle Bild wird nach und nach ausgeblendet.  
Die Übergangsart legt fest welchen Verlauf die Geschwindigkeit des Ausblendens nimmt.

| Name | Beschreibung |
| --- | --- |
| Linear | Erzeugt eine gleichbleibende Übergangsgeschwindigkeit. |
| Fließend | Der Übergang beginnt langsam, wird dann schneller und verlangsamt sich zum Ende hin wieder. |
| Ausklingend | Ein langsam beginnender Übergang. |
| Nachhall | Ein langsam endender Übergang. |
| Ausklinged und Nachhall | Ein Übergang, der langsam beginnt und endet. |

# Glossar

## Album

[Album]: #album
[Alben]: #album

Generell wird der Begriff "[Album]" im Kontext dieser Anwendung als eine Sammlung von Bilder verstanden.  
Da diese aus Verzeichnisse geladen werden, wird der Begriff auch für diese Verzeichnisse verwendet.

## Diashow

[Diashow]: #diashow

Im Kontext dieser Anwendung wird der Begriff "[Diashow]" als Abfolge von Bildern verstanden.  