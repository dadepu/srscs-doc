---
layout: page
title: Lokale Ausführung
navigation: 2
---

### Voraussetzungen

1. Docker (https://www.docker.com/)
2. IntelliJ Ultimate ([https://www.jetbrains.com/de-de/idea/](https://www.jetbrains.com/de-de/idea/))

<br/>

### Download

[https://github.com/dadepu/srscs-local-dev-env.git](https://github.com/dadepu/srscs-local-dev-env.git)

<br/>

### Starten der Anwendung

In der Root-Directory des Repositories befinden sich die beiden Docker-Compose-Dateien, um die Anwendung zu starten. Die erste Datei startet die Services der Umgebung, die zweite die der Anwendung. 

**Start der Umgebung**  
Im ersten Schritt müssen die Services der Umgebung gestartet werden. Das kann über den folgenden Befehl im Terminal 
oder in IntelliJ erfolgen:

```
docker-compose -f ... up -d
```

**Datenbankschema erstellen**
Das Datenbankschema für MariaDB und MongoDB wird durch die jeweiligen Spring Services initialisiert. Für Cassandra muss das Schema über ein CQL Skript erstellt werden. Die Datei befindet sich im gleichen Ordner unter dem Namen `cassandra-build.cql`.

Um das Schema zu laden, muss über IntelliJ (oder DataGrip) eine Verbindung zu Cassandra hergestellt werden.

`Address:`  
`User:`  
`Password:`

Die Login Daten werden als Umgebungsvariablen über das Compose-File gesetzt und können angepasst werden.

Wenn die Verbindung erfolgreich hergestellt wurde, kann `cassandra-build.cql` über IntelliJ (oder DataGrip) ausgeführt werden. Wenn dieser Schritt erfolgreich war, müsste Cassandra die initialisierten Tabellen aufführen können.

**Starten der Services**  
Die Services der Anwendung werden nach dem gleichen Ablauf, wie der Umgebung, gestartet. 
```
docker-compose -f ... up -d
```

<br/>

### Prüfen der Umgebung

**MariaDB**  
Um zu prüfen, ob sich eine Verbindung zu MariaDB herstellt lässt, kann phpMyAdmin aufgerufen werden.  
`http://localhost:8100`

**MongoDB**  
MongoDB lässt sich durch MongoExpress unter folgender Adresse prüfen  
`http://localhost:8081`

**Cassandra**  
Über eine Verbindung in IntelliJ oder DataGrip.

**Anwendungs-Services**  
Die Services der Anwendung lassen sich durch REST-Calls prüfen.