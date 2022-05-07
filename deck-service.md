---
layout: page
title: Deck-Service
navigation: 6
---

## Überblick

### Kurzbeschreibung

Der Deck-Service ist für die Verwaltung von Decks, Karten, Presets und das Reviewen von Karten zuständig.

<br/>

### Verwaltung

**Github**  
[https://github.com/dadepu/srscs-deck-service](https://github.com/dadepu/srscs-deck-service)

**Docker-Image**  
[https://hub.docker.com/r/dadepu/srscs_deck](https://hub.docker.com/r/dadepu/srscs_deck)

<br/>

### Abhängigkeiten

#### Module

*Für eine vollständige Auflistung aller Abhängigkeiten wird auf das Gradle-Build-File verwiesen.*
- Gradle
- Spring-Boot 3.0.0-M1
    - Data-MongoDB
    - Web
    - Web-Flux
    - Kafka
    - Log4J2
        - Disruptor

#### Infrastruktur

- MongoDB *5.0.8* ([https://hub.docker.com/_/mongo?tab=tags](https://hub.docker.com/_/mongo?tab=tags))
- Confluence-Kafka *5.2.5* ([https://hub.docker.com/r/confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka))

#### Services

- **User-Service**

<br/>

### Containerization

Das Docker-Image wird lokal über Jib erzeugt und auf Docker-Hub gehostet. Eine automatisierte Build-Pipeline existiert noch nicht.

**Jib Dokumentation**  
[https://github.com/GoogleContainerTools/jib](https://github.com/GoogleContainerTools/jib)

**Docker-Hub Image**  
[https://hub.docker.com/r/dadepu/srscs_deck](https://hub.docker.com/r/dadepu/srscs_deck)

<br/>
<br/>

## Details

### Fachliche Service-Beschreibung

Der Deck-Service ist für die Verwaltung von Decks, Karten, dem Scheduler einer Karte und der Konfiguration des Scheduler, dem SchedulerPreset, zuständig.

In der Analogie zu physischen Karteikarten ist ein Deck der Kasten, in dem man seine Karteikarten gruppiert. Diesen Decks können Karten hinzugefügt werden. Eine Karte enthält immer einen Inhalt und einen Scheduler, der die Lernintervalle definiert.

Die Standard-Karte besteht aus einer Vor- und Rückseite mit Frage und Antwort und einem optionalen Hinweis, der bei Schwierigkeiten betrachtet werden kann.
Ein weiterer Typ Karte ist die so genannte *Typing-Card*, bei der die Lösung eingetippt werden muss. Sinnvoll für Vokabeln. Weitere Karten-Typen müssen möglich sein.

Für das Reviewen einer Karte stehen dem Benutzer verschiedene Schwierigkeitsgrade zur Auswahl, die Einfluss auf das berechnete Folge-Interval nehmen.
Der Scheduler berechnet die Intervalle nach einer Konfiguration, dem SchedulerPreset. Dieses Preset kann von dem Benutzer individuell erstellt und konfiguriert werden.

<br/>

### Fachliche Details

#### Review Algorithmus

Der Algorithmus besteht aus drei Phasen, der *Learning Phase*, der *Review Phase* und der *Lapsing Phase*.

Bei jeder Review stehen dem Benutzer vier Feedback-Optionen zur verfügung: *Easy, Normal, Hard* und *Bad*. Mit *Easy, Normal* und *Hard* gibt der Benutzer an, wie schwer es für ihn war, sich an den Inhalt der Karte zu erinnern. Konnte der Inhalt nicht wiedergegeben werden, ist das Feedback *Bad*. Der Einfluss des Feedbacks hängt von der jeweiligen Phase ab.

**Review Phase**

Die Review Phase beginnt, wenn die Learning Phase verlassen wird. Ist das Feedback *Normal*, wird das bestehende Intervall multipliziert mit einem `ease-factor`. Ein Standardwert ist 2,2.

Der `ease-factor` drückt aus, wie anspruchsvoll die Karte ist. Damit der Faktor zum Ausdruck des Schwierigkeitsgrades werden kann, steigert oder reduziert er sich durch das gewählte Feedback. Während *Normal* praktisch keine Änderung verursachen sollte, muss das Vergessen einer Karte zu einem deutlichen Penalty führen. Diese Einflüsse werden als `factor-modifier` bezeichnet.

Zusätzlich kann das Feedback zu einer direkten Änderung des Intervals führen. Bei *Easy* kann beispielsweise zu dem `ease-factor` ein weiterer Faktor aufgeschlagen werden. Diese Faktoren werden als `interval-modifier` bezeichnet.

Das Vergessen einer Karte führt zu dem Verlassen der *Review Phase*. Der Scheduler tritt dann in die *Lapsing Phase* ein.

**Lapsing Phase**

Die Lapsing Phase ist zur Auffrischung gedacht und beginnt, wenn in der *Review Phase* eine Karte vergessen wird.

Es können Steps definiert werden, so genannte `lapse-steps`, die Intervalle definieren, in denen die Karte wiederholt werden muss. Erst nach dem erfolgreichen Durchlaufen aller Schritte wird aus der *Lapsing Phase* zurück in die *Review Phase* gewechselt.

Bei dem Wechsel in die *Review Phase* wird das reguläre Intervall fortgeführt.

Das Vergessen einer Karte führt jedoch zu zwei deutlichen Penalties. Zum muss der `ease-factor` erheblich reduziert werden. Dies geschieht durch den `lapse-factor-modifier`. Zum anderen muss das reguläre Intervall gekürzt werden, dies geschieht durch den `lapse-interval-modifier`.

**Learning Phase**

Die *Learning Phase* ist eine Phase zum Eingewohnen der Karte, in der das Vergessen nicht zu langfristigen Penalties führt.

Die Phase wird definiert durch die `learning-steps`, Schritte, die feste Intervalle definieren, in denen die Karte wiederholt werden muss. Nach dem erfolgreichen Durchlaufen aller Schritte wechselt die Karte in die *Review Phase.*

Wird jedoch in *Learning Phase* eine Karte vergessen, wird wieder mit dem ersten Schritt begonnen. Weitere Penalties oder ein Wechsel in die *Lapsing Phase* sind nicht möglich.

<br/>

### Implementierungs Details

#### Race Conditions

**Neues Deck erstellen**  
Bei der Erstellung eines neuen Decks kann es derzeit zu einer Race Condition kommen. Das Erstellen ist nur für Benutzer möglich, die bereits vom Service durch ein Event erfasst wurden.

Es ist zu überlegen, ob nicht ein temporäres Deck für einen temporären Benutzer erstellt werden sollte, wenn der Benutzer zum Zeitpunkt der Erstellung noch nicht bekannt ist. Das Empfangen des Benutzers könnte dann zu einer Aufwertung der temporären Datensätze führen.

#### Authentifizierung

Eine Authentifizierung ist zum derzeitigen Zeitpunkt nicht implementiert.

#### Immutable Cards

Eine Karte **muss** bezüglich ihres Typs und Inhalts unveränderlich sein. Wird eine der beiden Eigenschaften verändert, 
muss eine neue Karte erzeugt werden. Ausgenommen ist der Scheduler.

Durch diese Eigenschaft kann jeder Version einer Karte eine eindeutige ID zugeordnet werden.

Hierbei handelt es sich um eine Anforderung der Downstream-Services, die zu einer erheblichen Vereinfachung der Kommunikation unterhalb der Services führt.

Downstream-Services wird es ermöglicht, Karten auf ihre ID zu reduzieren. Wird der Deck-Service angewiesen eine Karte zu kopieren, muss für diesen Vorgang der Inhalt der Karte nicht bekannt sein. Es reicht die zu kopierende Karte zu referenzieren. Der Inhalt einer Karte wird daher zu einem Konzept, das nur der Deck-Service kennen muss.

#### Topic Struktur

Alle Events zu Decks und Karten befinden sich in einem gemeinsamen Topic, um die Integrität der Reihenfolge zu gewährleisten. Downstream-Services wird es ermöglicht, auf den Einsatz von temporären Daten zu verzichten.

<br/>

### Datenbankschema

#### Typ 

MongoDb 

#### Erstellung

Das Datenbankschema wird durch Spring automatisch erstellt.

#### Embedded Entities

Um über den Prozess des Einbettens in MongoDB mehr Kontrolle zu erlangen und zu verhindern, dass Entities 
vollständig eingebettet werden oder es zu einem Anwendungsseitigen Join kommt, werden referenzierte Entities mit 
allen notwendigen Informationen als Value-Object eingebettet.  
Diese Value-Objects haben als Namingpattern das Prefix `Embedded*`.

#### Embedded Preset in Scheduler

Jeder `Scheduler` bestitzt ein `EmbeddedSchedulerPreset`, eine Kopie des `SchedulerPresets`.

Auf diese Weise kann eine Karte vollständig mit allen notwendigen Informationen mit nur einer Leseoperation geladen werden. Für $n$ Karten ergibt sich ein Aufwand von $n$ Zugriffen.

Wird jedoch das `SchedulerPreset` eines Decks geändert, muss für alle Karten des Decks das `EmbeddedSchedulerPreset` aktualisiert werden. Es ergeben sich $n$ Schreibzugriffe für $n$ Karten.

Hierbei handelt es sich um eine Abwägung von aktuellen und in der Zukunft möglichen Anforderungen. Das aktuelle Datenschema sieht vor, dass Karten individuelle Presets haben werden.

Sollte diese Anforderung jedoch nicht umgesetzt werden, sollte das `EmbeddedSchedulerPreset` aus dem `Scheduler` ins `Deck` ausgelagert werden oder der `Scheduler` sollte das `SchedulerPreset` direkt referenzieren.