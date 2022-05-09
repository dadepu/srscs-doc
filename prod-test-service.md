---
layout: page
title: Production-Test-Service
navigation: 8
---

# Production-Test-Service

## Überblick

### Kurzbeschreibung

Der Production Test Service dient zum Testen und Ausführen der Dienste während eines produktiven Betriebs. Dazu werden Mock-Nutzer erstellt, die Anwendung nutzen.

<br/>

### Verwaltung

**Github**  
[https://github.com/dadepu/srscs-prod-test-service](https://github.com/dadepu/srscs-prod-test-service)

**Docker-Image**  
[https://hub.docker.com/repository/docker/dadepu/srscs_prod_test](https://hub.docker.com/repository/docker/dadepu/srscs_prod_test)

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
[https://hub.docker.com/repository/docker/dadepu/srscs_prod_test](https://hub.docker.com/repository/docker/dadepu/srscs_prod_test)

<br/>
<br/>

## Details

### Fachliche Service-Beschreibung

Der Production-Test-Service erlaubt es, die Funktionalität während des produktiven Einsatzes durch Mock-Nutzer zu testen. Störungen sollen frühzeitig festgestellt werden.

Um ein realitätsnahes Verhalten zu simulieren, greift der Service über die vorhandenen REST-Schnittstellen auf die Services zu. Dabei werden neue Nutzer erstellt, Decks angelegt und deaktiviert, neue Karten erstellt, bearbeitet und reviewed und es wird mit anderen Mock-Nutzern gemeinsam kollaboriert.

<br/>

### Implementierungs Details

#### Automatisierte Tests

In seiner momentanen Form ist es dem Service möglich die Nutzung des Systems zu simulieren, validiert diese jedoch nicht.

Dieses Feature soll in Verbindung mit einem Tracing und einer Log-Aggregation erweitert werden, sodass Störungen frühzeitig zu einer Warnung führen.

<br/>

### Datenbankschema

#### Typ

MariaDB

#### Erstellung

Das Datenbankschema wird automatisch von Spring anhand von JPA Annotationen erstellt.