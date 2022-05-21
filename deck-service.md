---
layout: page
title: Deck-Service
navigation: 6
---

# Deck-Service

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

### Spezifikationen

- [Context-Map](/ldm/context-map.png)
- [Logisches Datenmodell](/srscs-doc/ldm/ldm-deck-service.png)
- [OpenAPI](/srscs-doc/api/deck-service/openapi/)
- [AsyncAPI](/srscs-doc/api/deck-service/asyncapi/)

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

- MongoDB *5.0.8* https://hub.docker.com/_/mongo?tab=tags
- Confluence-Kafka *5.2.5* [https://hub.docker.com/r/confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka)

#### Services

- User-Service

<br/>

### Containerization

Das Docker-Image wird lokal über Jib erzeugt und auf Docker-Hub gehostet.

**Jib Dokumentation**  
[https://github.com/GoogleContainerTools/jib](https://github.com/GoogleContainerTools/jib)

**Docker-Hub Image**  
[https://hub.docker.com/r/dadepu/srscs_deck](https://hub.docker.com/r/dadepu/srscs_deck)

<br/>
<br/>

## Details

### Fachliche Service-Beschreibung

Der Deck-Service ist für die Verwaltung von Decks, Karten, dem Scheduler einer Karte und der Konfiguration des Schedulers, dem SchedulerPreset, zuständig.

In der Analogie zu physischen Karteikarten ist das Deck die Ablage, in der die Karten gruppiert werden. Eine digitale Karte besteht immer aus einem Inhalt und einem Scheduler, der die Lernintervalle definiert.

Die Standard-Karte besitzt eine Vor- und Rückseite mit Frage und Antwort. Zusätzlich kann ein Tipp auf die richtige Antwort hinterlegt werden. Ein weiterer Kartentyp ist die *Typing-Card*, bei der die Lösung eingetippt werden muss, die sich besonders für Vokabeln eignet. Weitere Kartentypen sind möglich.

Beim Reviewen einer Karte gibt der Benutzer der Anwendung Feedback, wie schwer es für ihn war, sich an den Inhalt der Karte zu erinnern. Basierend auf diesem berechnet der Scheduler der Karte das Folge-Interval, das den nächsten Review-Zeitpunkt definiert. Eine genaue Beschreibung des Algorithmus findet sich im Anschluss.

<br/>

### Fachliche Details

#### Review Algorithmus

Der Algorithmus einer Karte besteht aus drei Phasen: Der *Learning Phase*, der *Review Phase* und der *Lapsing Phase*.

Bei jeder Review stehen dem Benutzer vier Feedback-Auswahlen zur verfügung: *Easy, Normal, Hard* und *Bad*. Mit *Easy, Normal* und *Hard* gibt der Benutzer an, wie schwer es für ihn war, sich an den Inhalt der Karte zu erinnern. Konnte der Inhalt nicht wiedergegeben werden, ist das Feedback *Bad*. Den Einfluss, den das Feedback nimmt, hängt von der jeweiligen Phase ab.

**Review Phase**

Die *Review Phase*  einer Karte beginnt, wenn sie ihre *Learning Phase* verlassen hat. Ist das Feedback *Normal*, wird das aktuelle Intervall mit dem `ease-factor` multipliziert. Ein Standardwert ist 2,2.

Der `ease-factor` drückt aus, wie anspruchsvoll die Karte für den Benutzer ist. Damit dieser sich dem realen Schwierigkeitsgrad annähern kann, steigert oder reduziert er sich durch das gewählte Feedback. Während *Normal* bei korrekter konfiguration praktisch keine Änderung verursachen sollte, muss das Vergessen einer Karte zu einem deutlichen Penalty führen. Diese Modifikationen werden als `factor-modifier` bezeichnet.

Zusätzlich kann das Feedback zu einer direkten Änderung des Intervals führen. Bei *Easy* kann beispielsweise zu dem `ease-factor` ein weiterer Faktor aufgeschlagen werden. Diese Faktoren werden als `interval-modifier` bezeichnet.

Das Vergessen einer Karte führt zu dem Verlassen der *Review Phase*. Der Scheduler tritt dann in die *Lapsing Phase* ein.

**Lapsing Phase**

Die *Lapsing Phase* dient der Auffrischung und beginnt, wenn sich in der *Review Phase* nicht mehr an den Inhalt der Karte erinnert werden konnte.

Es können Steps definiert werden, so genannte `lapse-steps`, die Intervalle definieren, in denen die Karte wiederholt werden muss. Erst nach dem erfolgreichen Durchlaufen aller Schritte wird aus der *Lapsing Phase* zurück in die *Review Phase* gewechselt.

Bei dem Wechsel in die *Review Phase* wird das reguläre Intervall fortgeführt.

Das Vergessen einer Karte führt jedoch zu zwei deutlichen Penalties. Zum einen muss der `ease-factor` erheblich reduziert werden. Dies geschieht durch den `lapse-factor-modifier`. Zum anderen muss das reguläre Intervall gekürzt werden, dies geschieht durch den `lapse-interval-modifier`.

**Learning Phase**

Die *Learning Phase* ist eine Phase zum Eingewohnen der Karte, in der das Vergessen nicht zu langfristigen Penalties führt.

Die Phase wird definiert durch die `learning-steps`, Schritte, die feste Intervalle definieren, in denen die Karte wiederholt werden muss. Nach dem erfolgreichen Durchlaufen aller Schritte wechselt die Karte in die *Review Phase.*

Wird jedoch in der *Learning Phase* eine Karte vergessen, wird wieder mit dem ersten Schritt begonnen. Weitere Penalties oder ein Wechsel in die *Lapsing Phase* sind nicht möglich.

<br/>

### Implementierungs Details

#### Race Conditions
 
Bei der Erstellung eines Decks kann es zu Race-Conditions kommen, wenn ein Deck für einen Benutzer erstellt wird, der dem Service noch nicht bekannt ist, im User-Service jedoch bereits existiert.

Eine mögliche Lösung wäre das Arbeiten mit temporären Daten. Es ließe sich ein temporäres Deck für einen temporären Nutzer erstellen, die beim Empfang des entsprechenden Events aufgewertet würden.

#### Authentifizierung

Eine Authentifizierung ist zum derzeitigen Zeitpunkt nicht implementiert.

#### Cards

**Einzigartigkeit einer Karte**  
Jede Karte ist einzigartig, besitzt nur **einen** Scheduler und kann in nur **einem** Deck platziert werden.

Diese Auslegung begründet sich in der Wahl der Datenbank und leitet sich aus dem gewählten Datenbankschema ab. Durch den Einsatz von MongoDB kann eine Karte vollständig mit ihren Abhängigkeiten in einem einzigen Dokument gespeichert werden. Das Abfragen ist mit einer einzigen Lese-Operation möglich.

Beim Kopieren einer Karte in ein weiteres Deck oder an einen anderen Benutzer kommt es jedoch zu einer Duplizierung, denn bei inhaltlich identischen Karten müsste nur der Scheduler einzigartig sein.

Hier ist deutlich, wie die Wahl der Datenbank Einfluss auf das Datenmodell genommen hat:
1. In relationalen Datenbanken sind Duplizierungen zu vermeiden, Daten sollten normalisiert werden.
2. In nicht-relationalen Datenbanken sind Duplizierungen normal führen bei der korrekten Umsetzung zu einer erheblichen Performance-Steigerung.

**Unveränderliche Karten**  
Eine weitere wichtige Eigenschaft ist die Unveränderlichkeit (immutability) einer Karte. Eine Karte **muss** bezüglich ihres Typs und Inhalts unveränderlich sein. Ausgenommen ist der Scheduler.  
Wird eine der beiden Eigenschaften verändert, muss eine neue Version der Karte erzeugt werden. Aus dieser Eigenschaft leitet sich ab, dass jeder inhaltlichen Version einer Karte eine einzigartige ID zugeordnet werden kann.

Hierbei handelt es sich um eine Anforderung der Downstream-Services, die zu einer erheblichen Vereinfachung der Kommunikation innerhalb der gesamten Anwendung führen.

Downstream-Services wird es ermöglicht, Karten auf ihre ID zu reduzieren. Wird der Deck-Service angewiesen eine Karte zu kopieren, muss für diesen Vorgang der Inhalt der Karte nicht bekannt sein. Es reicht die zu kopierende Karte zu referenzieren. Der Inhalt einer Karte wird daher zu einem Konzept, das nur für den Deck-Service relevant ist.

#### Topic Struktur

Alle Events zu Decks und Karten befinden sich in einem gemeinsamen Topic, um die Integrität der Reihenfolge zu gewährleisten. Downstream-Services wird es ermöglicht, auf den Einsatz von temporären Daten zu verzichten.

<br/>

### Datenbankschema

#### Typ 

MongoDb 

#### Erstellung

Das Datenbankschema wird durch Spring automatisch erstellt.

#### Embedded Entities

Um über den Prozess des Einbettens in MongoDB mehr Kontrolle zu erlangen und zu verhindern, dass Entities vollständig eingebettet werden oder es zu einem Anwendungsseitigen Join kommt, werden referenzierte Entities mit allen notwendigen Informationen als Value-Object eingebettet. Diese Value-Objects haben als Namingpattern das Prefix `Embedded*`.

#### Embedded Preset in Scheduler

Jeder `Scheduler` bestitzt ein `EmbeddedSchedulerPreset`, eine Kopie des `SchedulerPresets`.

Auf diese Weise kann eine Karte vollständig mit allen notwendigen Informationen mit nur einer Leseoperation geladen werden. Für n Karten ergibt sich ein Aufwand von n Zugriffen.

Wird jedoch das `SchedulerPreset` eines Decks geändert, muss für alle aktiven Karten des Decks das `EmbeddedSchedulerPreset` aktualisiert werden. Es ergeben sich n Schreibzugriffe für n Karten.

Hierbei handelt es sich um eine Abwägung zwischen aktuellen- und in der Zukunft möglichen Anforderungen. Das aktuelle Datenschema sieht vor, dass Karten individuelle Presets haben werden.

Sollte diese Anforderung jedoch nicht umgesetzt werden, sollte das `EmbeddedSchedulerPreset` aus dem `Scheduler` ins `Deck` ausgelagert werden oder der `Scheduler` sollte das `SchedulerPreset` direkt referenzieren.