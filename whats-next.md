---
layout: page
title: What's next?
navigation: 9
---

## Allgemein

**Log Aggregation**
Ein zentrales System zum aggregieren und analysieren von Logs.

**Distributed Tracing**
Ein zentrales System zum Verfolgen und Analysieren von Geschäftsprozessen und Bottlenecks.

**Atomic Messaging**
Eine Transaktionssicherheit beim Verarbeiten und Erzeugen von Events.

**Production-Hosting**
Ein produktiver Betrieb der Anwendung.

**CI und CD Pipelines**
CI und CD Pipelines mit Test Stages.

**Authentifizierung von Events**
Eine Authentifizierung um das Injecten invalider Events zu verhindern.

**Authentifizierung von Nutzern**
Eine Authentifizierung von Nutzern mit der Anwendung. Derzeit müssen Nutzer kein Passwort hinterlegen - das soll sich ändern. Auch sollen authentifizierungen über Git und Google ermöglicht werden.


## Services

### Production-Test-Service
**Validierung und Alerting**
Der Production-Test-Service soll während eines Live-Betriebs die Funktionfähigkeit des Systems prüfen.
Dazu ist eine Erweiterung des Services nötig, sodass alle gestarteten Prozesse anschließend verifiziert werden. Im Falle einer Abweichung müsste das System Alarm schlagen und es ließe sich durch das Aggregieren von Logs nachvollziehen, wie der Vorfall sich zusammen gesetzt hat.

### Sharing-Service
Vollständige Implementierung

### Searching-Service
Vollständige Implementierung

### Statistics-Service
Vollständige Implementierung