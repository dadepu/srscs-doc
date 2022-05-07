---
layout: page
title: Konventionen
navigation: 3
---

### Git-Commits

Um die Lesbarkeit von Commit-Messages zu gewährleisten, gelten die folgenden Regeln:

**Nachrichten Format**  
`<type>(<scope>): <subject>`

**Typ der Nachricht**  
Der Typ `<type>` muss einer der folgenden sein:
- `doc` für Dokumentationen
- `build` für Änderungen am Build-System
- `config` für Konfigurationen, bsp. Spring-Properties
- `feat` für neue Features
- `refactor` für Änderungen, die an der Funktionalität nichts ändern
- `test` für Tests
- `style` für rein semantische Änderungen
- `fix` für Bug-Fixes

**Anwendungsbereich der Nachricht**  
Der `<scope>` ist optional und definiert den Bereich, auf den sich die Commits auswirken.
Wird ein Scope angegeben, dürfen Änderungen nur in diesem stattfinden. Andernfalls darf kein Scope angegeben werden.
Der Scope muss einem der beiden folgenden Schema folgen:

- Es wird ein Ordner der obersten Ebene angegeben
    - `command`
    - `controller`
    - `events`
    - ...
- Es wird ein Domain-Aggregate angegeben
    - `deck`
    - `user`
    - `card`
    - ...

**Inhalt der Nachricht**  
Im `<subject>` wird die Änderung im Imperativ angegeben.

<br/>

### Order Struktur

Die folgende Beschreibung der Ordnerstruktur ist einzuhalten, um einen gleichmäßigen Standard zwischen alle Repositories zu gewährleisten. Neue, zu dem Zeitpunkt der Erstellung dieses Dokuments nicht vorhandene Ordner, sind entsprechend den beschriebenen Richtlinien einzuordnen.

**Root Directory**
In die Root-Directory gehören alle Dateien und Ordner, die nicht Teil der Implementierung sind oder für den Build.  

Jedes Repository enthält die folgenden Ordner
- `/logs`
- `/api`
- `/doc`

**Java Directory**  
Der Aufbau folgt dem Standard von Domain Driven Design mit der Abwandlung, dass Aggregates in einem jeweils eigenen Ordner zu gruppieren sind.

Die Domain jedes Services befindet sich in `/domain`. Jede Schnittstelle des Service, die mit der Domain interagiert, befindet sich in einem eigenen Ordner in der obersten Ebene der Hierarchie, mit Ausnahme des Data Access Layers in Form von Repositories, der Teil der Domain ist.

Für die oberste Ebene der Hierarchie ergibt sich die folgende Struktur:

- `/commands` für asynchrone Command-Messages, die der Service empfängt
- `/controller` für REST-Endpints
- `/domain` für die Domain der Anwendung
- `/events` für Events, die der Service veröffentlicht
- `/web` für http Anfragen, die der Service stellt

Data Transfer Objects sind in den jeweiligen Schnittstellen zu platzieren. Eine gemeinsame Nutzung ist aus gründen der Struktur nicht gewünscht.

Unter `/domain` liegen `/domainprimitives` und die einzelnen Aggregates. Jedes Aggregate besteht aus:

- `/application` für die Services des Aggregates
- `/domain` für die Domain
- `/repository` für die Integration mit Datenbanken

<br/>

### Code Konventionen

Um einen einheitlichen Standard zu definieren, folgt das Projekt den Philosphien von Eric Evan’s Domain Driven Design und Uncle Bob’s Ansätzen in Clean Code.

<br/>

### Code Style

Es gilt **strengstens** der IntelliJ Java Default IDE Coding Style.

<br/>

### Testing

Es darf nur working-code veröffentlicht werden. Alle Schnittstellen sind **verpflichtend** durch Integrations-Tests zu 
testen. Eine Verpflichtung für Unit-Tests existiert nicht.