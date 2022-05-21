---
layout: page
title: User-Service
navigation: 5
---

# User-Service

## Überblick

### Kurzbeschreibung

Der User-Service ist für die Verwaltung von Nutzern und allen mit ihren verbundenen Daten verantwortlich.

<br/>

### Verwaltung

**Github**  
[https://github.com/dadepu/srscs-user-service.git](https://github.com/dadepu/srscs-user-service.git)

**Docker Image**  
[https://hub.docker.com/repository/docker/dadepu/srscs_user](https://hub.docker.com/repository/docker/dadepu/srscs_user)

<br/>

### Spezifikationen

- [Context-Map](/ldm/context-map.png)
- [Logisches Datenmodell](/srscs-doc/ldm/ldm-user-service.png)
- [OpenAPI](/srscs-doc/api/user-service/openapi/)
- [AsyncAPI](/srscs-doc/api/user-service/asyncapi/)

<br/>

### Abhängigkeiten

#### Module

*Für eine vollständige Auflistung aller Abhängigkeiten wird auf das Gradle-Build-File verwiesen.*
- Gradle
- Spring-Boot 2.7.0-RC1
  - Data-JPA
  - Web
  - Web-Flux
  - Data-Rest
  - Kafka
  - Log4J2
    - Disruptor

#### Infrastruktur

- MariaDB *10.8.2-rc* https://hub.docker.com/_/mariadb
- Confluence-Kafka *5.2.5* [https://hub.docker.com/r/confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka)

#### Services

- keine

<br/>

### Containerization

Das Docker-Image wird lokal über Jib erzeugt und auf Docker-Hub gehostet.

**Jib Dokumentation**  
[https://github.com/GoogleContainerTools/jib](https://github.com/GoogleContainerTools/jib)

**Docker-Hub Image**  
[https://hub.docker.com/repository/docker/dadepu/srscs_user](https://hub.docker.com/repository/docker/dadepu/srscs_user)

<br/>
<br/>

## Details

### Fachliche Service-Beschreibung

Der User-Service ist für die Verwaltung von Nutzern innerhalb der Anwendung zuständig. Es lassen sich neue Benutzer anlegen, abrufen und bestehende deaktivieren. Die angebotenen Endpunkte und Events können den beiden APIs entnommen werden.

<br/>

### Implementierungs Details

#### Authentifizierung

Eine Authentifizierung ist zum derzeitigen Zeitpunkt nicht implementiert. Neue Benutzer werden ohne Passwort erstellt und können im System nur durch angabe ihrer ID verändert werden.

#### Soft- over Hard-Delete

Benutzer werden bei einem Löschvorgang lediglich deaktiviert, um die Integrität innerhalb der Anwendung nicht zu beeinflussen.  
Mögliche wäre auch ein Szenario aus datenschutzrechtlichen Gründen, in dem alle nutzer-relevanten Informationen, bis auf die `user-id`, gelöscht werden.

<br/>

### Datenbankschema

#### Erstellung

Das Datenbankschema wird von Spring automatisch durch JPA Annotationen erzeugt.

<br/>
<br/>
<br/>