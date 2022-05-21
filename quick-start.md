---
layout: page
title: Lokale Ausführung
navigation: 2
---

# Lokale Ausführung

### Voraussetzungen

1. Docker (https://www.docker.com/)
2. IntelliJ Ultimate ([https://www.jetbrains.com/de-de/idea/](https://www.jetbrains.com/de-de/idea/))

<br/>

### Download

[https://github.com/dadepu/srscs-local-dev-env](https://github.com/dadepu/srscs-local-dev-env)

<br/>

### Starten der Anwendung

In der Root-Directory des Repositories befinden sich die beiden Dateien um Umgebung und Anwendung zu starten.


#### Umgebung
 
Zuallererst müssen die Services der Umgebung gestartet werden, bevor sich die Anwendung starten lässt. Das kann über das Terminal oder IntelliJ geschehen. 

```
docker-compose -f compose-env.yml up -d
```

**Datenbankschema erstellen**  
Das Datenbankschema für MariaDb und MongoDb wird automatisch durch die entsprechenden Services erstellt. Für Cassandra muss das Schema über ein .cql Skript erstellt werden. Das Skript befindet sich in der Root-Dir mit dem Namen `cassandra-build.cql`. 

Zuerst muss Cassandra als Data-Source in IntelliJ hinzugefügt werden. Die Daten lauten wie folgt, können aber auch dem Compose-File entnommen werden:  
`host: localhost`  
`user: root`  
`password: root`

Dann muss dem .cql-File eine Session mit Cassandra hinzugefügt werden. Daraufhin lässt sich das Skript ausführen und das Datenbank-Schema wird initialisiert.

#### Anwendung

Die Anwendung wird nach dem gleichen Verfahren mit dem folgenden Befehl gestartet. Allerdings müssen **alle** Umgebungs-Services betriebsbereit sein. Insbesondere der Kafkabroker.

```
docker-compose -f compose-app.yml up -d
```

<br/>

### Prüfen der Umgebung

**MariaDB**  
Um zu prüfen, ob sich eine Verbindung zu MariaDB herstellt lässt, kann phpMyAdmin aufgerufen werden:  
`http://localhost:8100`

**MongoDB**  
MongoDB lässt sich durch MongoExpress unter folgender Adresse prüfen:  
`http://localhost:8081`

**Cassandra**  
Über eine Verbindung in IntelliJ oder DataGrip.

**Anwendungs-Services**  
Die Services der Anwendung lassen sich mit Postman durch REST-Calls prüfen.

<br/>

[***Weiter: Konventionen***](/srscs-doc/conventions.html)