---
layout: page
title: Production-Test-Service
navigation: 8
---

## Überblick

### Kurzbeschreibung

Der Production Test Service dient zum Testen und Ausführen der Dienste während eines produktiven Betriebs. Dazu werden Mock-Nutzer erstellt, die Anwendung nutzen.

<br/>

### Verwaltung

**Github**  
[https://github.com/dadepu/srscs-prod-test-service](https://github.com/dadepu/srscs-prod-test-service)

**Docker-Image**  
*TODO*

<br/>

### Abhängigkeiten

#### Module

*Für eine vollständige Auflistung aller Abhängigkeiten wird auf das Gradle-Build-File verwiesen.*
- Gradle
- Spring-Boot 2.5.6
    - Data-JPA
    - Web
    - Web-Flux
    - Kafka
    - Log4J2
        - Disruptor

#### Infrastruktur

- Cassandra *4.0.3* https://hub.docker.com/_/cassandra)
- Confluence-Kafka *5.2.5* ([https://hub.docker.com/r/confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka))

#### Services

- User-Service
- Deck-Service
- Collaboration-Service

<br/>

### Containerization

Das Docker-Image wird lokal über Jib erzeugt und auf Docker-Hub gehostet. Eine automatisierte Build-Pipeline existiert noch nicht.

**Jib Dokumentation**  
[https://github.com/GoogleContainerTools/jib](https://github.com/GoogleContainerTools/jib)

**Docker-Hub Image**  
*TODO*

<br/>
<br/>

## Details

### Fachliche Service-Beschreibung

Der Production-Test-Service erlaubt es, das System während eines produktiven Zustands durch den Einsatz von Mock-Nutzern zu testen.

Um ein realitätsnahes Verhalten zu simulieren, greift der Service über die vorhandenen REST-Schnittstellen auf die Services zu. Dabei werden neue Nutzer erstellt, Decks angelegt und deaktiviert, neue Karten erstellt, bearbeitet und reviewed und es wird mit anderen Mock-Nutzern aktiv kollaboriert.

<br/>

### Implementierungs Details

#### Automatisierte Tests

In seiner momentanen Form simuliert der Service die Nutzung des Systems, validiert diese jedoch nicht. Eine 
Validierung erfolgt derzeit nur von Hand.  
Dieses Feature wird ein Verbindung mit einer Log Aggregation und einem Tracing von Geschäftsprozessen umgesetzt werden.

<br/>

### Datenbankschema

#### Typ

MariaDB

#### Erstellung

Das Datenbankschema wird automatisch von Spring anhand von JPA Annotationen erstellt.