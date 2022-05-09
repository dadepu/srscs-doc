---
layout: page
title: What's next
navigation: 9
---

# What's next

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
Eine Authentifizierung von Nutzern mit der Anwendung. Derzeit müssen Nutzer kein Passwort hinterlegen - das soll sich ändern. Auch sollen Authentifizierungen über Git und Google möglich werden.


## Services

### Production-Test-Service
**Validierung und Alerting**  
Der Production-Test-Service soll während des produktiven Betriebs die Funktionalität des Systems prüfen. Für dieses Feature ist eine Erweiterung des Services nötig, sodass alle gestarteten Prozesse anschließend evaluiert werden und mögliche Fehler Alarm schlagen.  
Mit Hilfe von Tracing und einer Log Aggregation soll forensisch nachvollziehbar werden, wie es zu dem Fehler gekomme ist.

### Sharing-Service
Vollständige Implementierung


### Searching-Service
Vollständige Implementierung

### Statistics-Service
Vollständige Implementierung