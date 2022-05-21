---
layout: page
title: Production-Test-Service
navigation: 8
---

# Production-Test-Service

## Überblick

### Kurzbeschreibung

Der Production Test Service dient zum Testen und Ausführen der Dienste während eines produktiven Betriebs. Es werden Mock-Nutzer erstellt, die einen Betrieb simulieren.

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

Das Docker-Image wird lokal über Jib erzeugt und auf Docker-Hub gehostet.

**Jib Dokumentation**  
[https://github.com/GoogleContainerTools/jib](https://github.com/GoogleContainerTools/jib)

**Docker-Hub Image**  
[https://hub.docker.com/repository/docker/dadepu/srscs_prod_test](https://hub.docker.com/repository/docker/dadepu/srscs_prod_test)

<br/>
<br/>

## Details

### Fachliche Service-Beschreibung

Der Production-Test-Service erlaubt es, die Funktionalität während des produktiven Betriebs durch Mock-Nutzer zu testen. Störungen sollen frühzeitig festgestellt werden.

Um ein realitätsnahes Verhalten zu simulieren, greift der Service über die vorhandenen REST-Schnittstellen auf die Services zu. Dabei werden neue Nutzer erstellt, Decks angelegt und deaktiviert, neue Karten erstellt, bearbeitet und reviewed und es wird mit anderen Mock-Nutzern gemeinsam kollaboriert.

<br/>

### Datenbankschema

#### Typ

MariaDB

#### Erstellung

Das Datenbankschema wird automatisch von Spring anhand von JPA Annotationen erstellt.

<br />

### Bemerkung

#### Zustand der Entwicklung.

In seiner finalen Form wird es dem Service möglich sein, Anfragen über Mock-Nutzer zu schicken und gleichzeitig zu validieren. Fehler oder Fehlschläge während der Validierung sollen über eine Trace-ID vom Test-Service aus durch die Anwendung nachvollzogen werden können.

Ein Algorithmus für den Betrieb ist vorläufig implementiert, eine Valdierung existiert noch nicht. Durch die Ausführung von Integration-Tests lassen sich Test-Anfragen schicken, um die anderen Services der Anwendung zu debuggen.

Der Service wird fertiggestellt im Rahmen der Bachelorarbeit.
