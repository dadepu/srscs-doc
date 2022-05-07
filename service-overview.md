---
layout: page
title: Service-Überblick
navigation: 4
---

## Microservice

Das SRL Cloud-Backend ist als Microservice entworfen und besteht im Kern aus dem User- und Deck-Service, die 
gemeinsam die Basisfunktionen der Anwendung abbilden.  
Es wurde sich bewusst zu einem Microservice entscheiden, weil die parallele und unabhängige Entwicklung in einer 
Open Source Umgebung gefördert werden soll.

<br/>

### Service-Landschaft

Im Folgenden soll ein kurzer Überblick über die einzelnen Services und deren Einordnung in den Kontext gegeben werden. Zu jedem Service findet sich eine entsprechende Detailbeschreibung verlinkt.

#### User-Service

Der User-Service ist für die Verwaltung, Erstellung und Authentifizierung von Nutzern zuständig. Es können neue Nutzer angelegt werden und bestehende lassen sich deaktivieren.

#### Deck-Service

Der Deck-Service ist für die Verwaltung von Decks und Karten zuständig. Jede Karte besitzt einen Scheduler der definiert, wann diese zu wiederholen ist. Dieser lässt sich individuell konfigurieren. Diese Konfiguration wird als Scheduler-Preset bezeichnet und kann vom Nutzer individuell angelegt werden.

Karten sind in der gesamten Anwendung immutable. Das bedeutet, dass wenn eine Karte geändert wird, eine neue Version dieser erzeugt werden muss. Somit kann jeder Version einer Karte eine eindeutige ID zugeordnet werden. Diese Eigenschaft ist wichtig, damit das Konzept einer Karte für andere Services auf genau diese ID reduziert werden kann.

#### Collaboration-Service

Der Collaboration-Service ermöglicht es Nutzern bei der Erstellung eines Decks zu kollaborieren. So können bis zu 10 Nutzern gemeinsam an einem Deck arbeiten.

#### Sharing-Service (nicht implementiert)

Der Sharing-Service soll es ermöglichen, dass ein Nutzer sein Deck über eine URL oder ID mit anderen Nutzern teilen kann, sodass diese Updates erhalten, gleichzeitig aber private Änderungen an diesem Deck vornehmen können, die nur für sie sichtbar sind.

#### Search-Service (nicht implementiert)

Nutzer sollen die Möglichkeit haben ihre Decks nach Karten anhand von Schlagwörtern oder Bestandteilen ihres Inhalts zu durchsuchen.

#### Statistics-Service (nicht implementiert)

Nutzer sollen die Möglichkeit haben Statistiken zu ihrer Plattformnutzung und ihren Decks abrufen zu können. Außerdem sollen sich Karten ermitteln lassen die schlecht performen, sodass der Nutzer diese gezielt anpassen kann.

#### Production-Test-Service

Der Production-Test-Service simuliert die Nutzung der Plattform durch fiktive Nutzer, um während dem produktiven Betrieb sicher zu stellen, dass die Anwendung fehlerfrei funktioniert.