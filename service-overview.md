---
layout: page
title: Service-Überblick
navigation: 4
---

# Service-Überblick

### Microservice-Architektur

Das SRL Cloud-Backend ist als Microservice-Architektur entworfen und besteht im Kern aus dem User- und Deck-Service, die gemeinsam die Basisfunktionen der Anwendung abbilden. Es wurde sich bewusst zu einem Microservice entschieden, weil die parallele und unabhängige Entwicklung in einer OpenSource Umgebung gefördert werden soll.

<br/>

### Service-Landschaft

Im Folgenden soll ein kurzer Überblick über die einzelnen Services und deren Einordnung in den Kontext gegeben werden. Zu jedem Service findet sich eine entsprechende Detailbeschreibung verlinkt.

[***Link: Context-Map***](/ldm/context-map.png)

<br />

#### User-Service

Der User-Service ist für die Verwaltung, Erstellung und Authentifizierung von Nutzern zuständig. Es können neue Nutzer angelegt werden und bestehende lassen sich deaktivieren.  
[***Link: Detailbeschreibung***](/srscs-doc/user-service.html)

<br/>

#### Deck-Service

Der Deck-Service ist für die Verwaltung von Decks und Karten zuständig. Jede Karte besitzt einen Scheduler der definiert, wann diese zu wiederholen ist. Dieser lässt sich individuell konfigurieren. Diese Konfiguration wird als Scheduler-Preset bezeichnet und kann vom Nutzer selbst konfiguriert werden.

Karten sind in der gesamten Anwendung unveränderlich (immutable). Das bedeutet, dass beim Ändern einer Karte immer eine neue geänderte Kopie erstellt werden muss. Daher kann jeder Version einer Karte eine eindeutige ID zugeordnet werden. Diese Eigenschaft ist wichtig, damit das Konzept einer Karte für andere Services auf diese ID reduziert werden kann.  
[***Link: Detailbeschreibung***](/srscs-doc/deck-service.html)

<br/>

#### Collaboration-Service

Der Collaboration-Service ermöglicht es Nutzern bei der Erstellung eines Decks zu kollaborieren. So können bis zu 10 Nutzern gemeinsam an einem Deck arbeiten.  
[***Link: Detailbeschreibung***](/srscs-doc/collaboration-service.html)

<br/>

#### Sharing-Service (nicht implementiert)

Der Sharing-Service soll es einem Nutzer zukünftig ermöglichen, sein Deck mit anderen Nutzern über eine ID oder URL zu teilen. Empfänger erhalten daraufhin Updates, können aber private Änderungen an ihrem Deck vornehmen.

<br/>

#### Search-Service (nicht implementiert)

Nutzern soll es ermöglicht werden, nach Karten anhand von Schlagwörtern oder Bruchteilen des Inhalts der Karte zu suchen.

<br/>

#### Statistics-Service (nicht implementiert)

Nutzer sollen die Möglichkeit haben, Statistiken zu ihrer Plattformnutzung und ihren Decks abzurufen. Darüber hinaus sollen sich Karten ermitteln lassen, die besonders schlecht performen, damit Nutzer diese gezielt anpassen können.

<br/>

#### Production-Test-Service

Der Production-Test-Service simuliert die Nutzung der Plattform durch fiktive Nutzer während eines produktiven Betriebs, um mögliche Probleme frühzeitig festzustellen.  
[***Link: Detailbeschreibung***](/srscs-doc/prod-test-service.html)