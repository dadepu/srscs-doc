---
layout: page
title: Collaboration-Service
navigation: 7
---

## Überblick

### Kurzbeschreibung

Der Collaboration-Service ermöglicht es Nutzern bei der Erstellung eines Decks gemeinsam zu kollaborieren. Karten innerhalb eines solchen Decks werden unter allen Benutzern geteilt.

<br/>

### Verwaltung

**Github**  
*TODO*

**Docker-Image**  
*TODO*

<br/>

### Spezifikationen

- [OpenAPI](/srscs-doc/api/collaboration-service/openapi/)

<br/>

### Abhängigkeiten

#### Module

*Für eine vollständige Auflistung aller Abhängigkeiten wird auf das Gradle-Build-File verwiesen.*
- Gradle
- Spring-Boot 3.0.0-M1
    - Data-Cassandra
    - Web
    - Web-Flux
    - Kafka
    - Log4J2
        - Disruptor

#### Infrastruktur

- Cassandra *4.0.3* (https://hub.docker.com/_/cassandra)
- Confluence-Kafka *5.2.5* ([https://hub.docker.com/r/confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka))

#### Services

- User-Service
- Deck-Service

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

Der Collaboration-Service erlaubt es Nutzern bei der Erstellung eines Decks zu kollaborieren. Durch einen Benutzer erstellte Karten werden allen Teilnehmern zugänglich.

Um eine Kollaboration zu starten, läd ein Benutzer andere Teilnehmer ein. Beim Annehmen der Einladung wird für diesen automatisch ein neues Deck erstellt. Alle in diesem Deck vorgenommenen Änderungen wirken sich auf die anderen Teilnehmern aus. Davon ausgenommen ist das Löschen und Reviewen einer Karte.

Zukünftig soll es Nutzern ermöglicht werden, zwischen privaten und öffentlichen Änderungen zu unterscheiden, um private Vorgänge zu ermöglichen.

Verlässt ein Nutzer eine Kollaboration, behält er den aktuellen Zustand des gemeinsamen Decks.

<br/>

### Implementierungs Details

#### Race Conditions

**User**  
Theoretisch kann es bei der Erstellung oder Einladung zu einer Kollaboration zu einer Race Condition kommen, wenn ein User referenziert wird, der dem Service noch nicht bekannt ist, sehr wohl aber schon existiert.

**Decks / Karten**  
Es wird vorausgesetzt, dass alle Prozesse des Deck-Service in strikter Reihenfolge veröffentlicht werden.

#### Authentifizierung

Eine Authentifizierung ist zum derzeitigen Zeitpunkt nicht implementiert.

#### Kollaborations-Prinzip und gemeinsame Decks

Der Deck-Service gibt vor, dass ein Deck nur einen Eigentümer haben kann. Aus dieser Eigenschaft folgt unweigerlich, dass das Konzept des Kollaborations-Decks rein virtuell ist.

Für einen Abgleich zwischen den Decks werden Änderungen in diesen erfasst und an die anderen Teilnehmer weitergegeben.

#### Version einer Karte

Wird durch einen Benutzer in eine Kollaborations-Deck eine neue Karte erstellt, wird diese als Kopie-Vorlage für die 
anderen Decks verwendet. Für n Nutzer mit jeweils eigenen Decks ergeben sich daraus n unterschiedliche Karten mit 
jeweils individuellen IDs.

Ändert ein beliebiger Teilnehmer diese zuvor erstellte Karte, muss diese Änderung an die anderen Teilnehmer weitergegeben werden. Um die entsprechenden Karten mit der neuen Version überschreiben zu können, müssen die IDs jedoch bekannt sein.

Diese Zuordnung wird vorgenommen durch die `CollaborationCard`, die die jeweiligen Versionen und die korrelierenden Karten der Benutzer zuordnet.

<br/>

### Datenbankschema

#### Typ

Cassandra

#### Erstellung

Das Datenbankschema wird nicht automatisch erstellt, sondern muss über das `collab-service-cassandra.cql` File erstellt werden.

#### Query First

Das Datenbankschema ergibt sich aus einem Query First Ansatz. Für jeden Geschäftsprozess innerhalb des Service wird isoliert betrachtet, welche Datenbank Queries ausgeführt werden. Die Summe dieser Anfragen ergibt das Datenbankschema.

Diese Technik ist für Key-Value Datenbanken ohne Indexes das übliche Vorgehen. Für eine genauere Beschreibung wird auf die Dokumentation von Cassandra verwiesen.
[https://cassandra.apache.org/doc/latest/cassandra/data_modeling/index.html](https://cassandra.apache.org/doc/latest/cassandra/data_modeling/index.html)

**REST: Invite Users to start a new Collaboration**  
Zum Erstellen einer neuen Kollaboration werden die Benutzer mit ihrem einzigartigen Benutzernamen angegeben.  
`Find Users by username`

**REST: Invite a new User to an existing Collaboration**  
Zum Hinzufügen eines Benutzers zu einer bereits bestehenden Kollaboration muss die Kollaboration und der jeweilige 
Nutzer aufgerufen werden.  
`Find Collaboration by id`  
`Find User by username`

**REST: Accept the invitation to collaborate**  
Beim Akzeptieren einer Einladung werden Collaboration-Id und User-Id angegeben. Beide Queries wären möglich.  
`Find Collaboration by id` oder `Find Collaboration by user-id`

**REST: Decline the invitation to collaborate**  
`Find Collaboration by id` oder `Find Collaboration by user-id`

**REST: Find all Collaborations by User-Id**  
`Find all Collaborations by user-id`

**REST: Find Collaboration by Id**  
`Find Collaboration by id`

**EVENT: User created**  
kein Query

**EVENT: Deck created**  
Wurde ein neues Deck erstellt muss geprüft werden, ob die Erstellung durch den Collaboration-Service veranlasst wurde und wenn ja, zu welcher Kollaboration und welchem Nutzer es gehört.
Wenn der Collaboration-Service ein Kommando schickt zum Erstellen eines Decks, enthält dieses Kommando eine 
`correlation-id`. Das Event kann nach dem Erstellen dann über diese ID zugeordnet werden.  
Enthält das Event keine ID oder ist die ID nicht bekannt, ist das Event für den Collaboration-Service nicht relevant.  
`Find Collaboration by correlation-id`

**EVENT: Card created**  
Vergleichbar mit dem Erstellungsprozess eines Decks. Es wird geprüft, ob die Karte auf einen Befehl hin erstellt 
wurde. Wenn nicht, ob die Karte zu einem Deck gehört, das teil einer Kollaboration ist.  
`Find CollaborationCard by correlation-id`  
`Find Collaboration by deck-id`

**EVENT: Card overridden**
Es wird geprüft, ob die Karte auf einen Befehl hin erstellt wurde. Wenn nicht wird geprüft, ob die Parent-Card 
bekannt ist. Wenn ja, handelt es sich um eine neue noch nicht bekannte Version einer Karte.  
`Find CollaborationCard by correlation-id`  
`Find CollaborationCard by card-id`

#### Schema

**User**
```
CREATE TABLE user_by_id (
    user_id UUID,
    username TEXT,
    is_active BOOLEAN,
    PRIMARY KEY ( user_id )
);

CREATE TABLE user_by_username (
    username TEXT,
    user_id UUID,
    is_active BOOLEAN,
    PRIMARY KEY ( username )
);
```

**Collaboration**
```
CREATE TYPE participation_state (
    transaction_id UUID,
    status INT,
    created_at TIMESTAMP
);

CREATE TABLE collaboration_by_id (
    collaboration_id UUID,
    participant_user_id UUID,
    collaboration_name TEXT STATIC,
    participant_username TEXT,
    participant_deck_id UUID,
    participant_deck_correlation_id UUID,
    participant_status LIST<FROZEN<participation_state>>,
    PRIMARY KEY ( collaboration_id, participant_user_id )
);

CREATE TABLE collaboration_by_deckid (
    deck_id UUID,
    collaboration_id UUID,
    participant_user_id UUID,
    participant_deck_id UUID,
    participant_status LIST<FROZEN<participation_state>>,
    PRIMARY KEY ( deck_id, collaboration_id, participant_user_id )
);

CREATE TABLE collaboration_by_userid (
    user_id UUID,
    collaboration_id UUID,
    participant_user_id UUID,
    collaboration_name TEXT STATIC,
    participant_username TEXT,
    participant_deck_id UUID,
    participant_deck_correlation_id UUID,
    participant_status LIST<FROZEN<participation_state>>,
    PRIMARY KEY ( user_id, collaboration_id, participant_user_id )
);

CREATE TABLE collaboration_by_deckcorrelationid (
    deck_correlation_id UUID,
    collaboration_id UUID,
    PRIMARY KEY ( deck_correlation_id )
);
```

**Collaboration-Card**
```
CREATE TABLE collaborationcard_by_collaborationid (
    collaboration_id UUID,
    root_card_id UUID,
    PRIMARY KEY ( collaboration_id )
);

CREATE TABLE collaborationcard_by_correlationid (
    correlation_id UUID,
    root_card_id UUID,
    PRIMARY KEY ( correlation_id )
);

CREATE TABLE collaborationcard_by_rootcardid (
    root_card_id UUID,
    correlation_id UUID,
    collaboration_card_id UUID STATIC,
    collaboration_id UUID,
    deck_id UUID,
    user_id UUID,
    card_id UUID,
    PRIMARY KEY ( root_card_id, correlation_id )
);

CREATE TABLE collaborationcard_by_cardid (
    card_id UUID,
    root_card_id UUID,
    PRIMARY KEY ( card_id )
);
```

#### Persönliche Bemerkung

Der Einsatz von Cassandra stellt sich in der nachträglichen Betrachtung als wenig sinnvoll heraus. Es wurde ursprünglich von einem zu simplen Datenbankschema ausgegangen und die Anzahl der Prozesse erheblich unterschätzt.
Auch wurde fälschlicherweise angenommen, dass es zu erheblich mehr Schreib- als Leseoperationen kommen würde. Im realen Betrieb ist jedoch das genaue Gegenteil der Fall.

Ebenfalls wird die Flexibilität gegenüber neuen Anforderungen massiv eingeschränkt, weil es potentiell zu einer Vielzahl von Änderungen im Datenbank Schema kommen kann. Sollten neue Anforderungen erwachsen, wird deshalb ein Refactoring auf MongoDB in Erwägung gezogen.