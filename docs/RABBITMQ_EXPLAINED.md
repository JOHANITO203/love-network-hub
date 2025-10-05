# RabbitMQ Expliqué - Pour МойDate
**Version:** 1.0.0
**Date:** 2025-10-04

---

## 🐰 Qu'est-ce que RabbitMQ ?

### Définition Simple

**RabbitMQ = Un facteur ultra-rapide pour vos microservices**

Imaginez:
- Vous avez 11 services différents (Auth, Profile, Matching, Messages, Narratives, etc.)
- Ils doivent se parler entre eux EN PERMANENCE
- Mais ils ne peuvent pas s'appeler directement (sinon chaos total)

**RabbitMQ est le "bureau de poste" qui gère tous les messages entre vos services.**

---

## 🎯 Analogie: La Boîte aux Lettres Magique

### Sans RabbitMQ (❌ Mauvais)

```
Service Matching: "HÉ SERVICE NARRATIVES ! UN NOUVEAU MATCH !"
Service Narratives: *occupé* "Attends 2 secondes..."
Service Matching: *bloqué en attendant* 😴
```

**Problème:** Si un service est lent ou planté, TOUT se bloque.

### Avec RabbitMQ (✅ Bon)

```
Service Matching: "RabbitMQ, nouveau match créé. Distribue ça."
RabbitMQ: "OK, j'envoie à qui veut bien écouter."
Service Matching: *continue son travail* 🚀

RabbitMQ → Service Narratives: "Psst, nouveau match."
RabbitMQ → Service Notification: "Psst, nouveau match."
RabbitMQ → Service Gamification: "Psst, nouveau match."

Chaque service traite quand IL PEUT, sans bloquer les autres.
```

---

## 📬 Comment ça Marche ?

### Architecture RabbitMQ

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   SERVICE    │        │   RABBITMQ   │        │   SERVICE    │
│   MATCHING   │───────▶│   EXCHANGE   │───────▶│  NARRATIVES  │
│  (Producer)  │ publier│  (facteur)   │livrer  │  (Consumer)  │
└──────────────┘        └──────────────┘        └──────────────┘
                               │
                               │ aussi livrer à:
                               │
                        ┌──────▼──────────┐
                        │   NOTIFICATION  │
                        │     SERVICE     │
                        └─────────────────┘
```

**3 Composants:**

1. **Producer (Émetteur):** Service qui envoie un message
   - Ex: Service Matching envoie "nouveau match créé"

2. **Exchange (Bureau de tri):** Reçoit les messages et décide où les envoyer
   - Comme le facteur qui trie le courrier par quartier

3. **Consumer (Récepteur):** Service qui reçoit et traite le message
   - Ex: Service Narratives reçoit l'info et génère une narrative

---

## 🎬 Exemple Concret: Nouveau Match dans МойDate

### Scénario: Alice like Bob, Bob like Alice → MATCH! 💕

**Étape 1:** Service Matching détecte le match

```typescript
// services/matching/src/controllers/swipeController.ts

async function handleSwipe(userId, targetId, action) {
  // User swipe...

  if (action === 'like' && targetAlreadyLikedMe(targetId, userId)) {
    // C'est un MATCH!
    const match = await createMatch(userId, targetId);

    // 🐰 PUBLIER ÉVÉNEMENT RABBITMQ
    await rabbitMQ.publish('moydate.match', {
      event: 'match.created',
      matchId: match.id,
      user1Id: userId,
      user2Id: targetId,
      timestamp: Date.now()
    });

    // Service Matching continue sans attendre
    return { success: true, match };
  }
}
```

**Étape 2:** RabbitMQ distribue à TOUS les services intéressés

```
RabbitMQ reçoit le message "match.created"

RabbitMQ dit:
  "Qui veut savoir qu'un match a été créé ?"

Services qui lèvent la main 🙋:
  ✅ Service Narratives (pour générer narrative)
  ✅ Service Notification (pour push notification)
  ✅ Service Gamification (pour donner badge)
  ✅ Service Tracking (pour créer questionnaire J1)
```

**Étape 3:** Chaque service réagit indépendamment

```typescript
// Service Narratives écoute
channel.consume('match.created', async (msg) => {
  const { user1Id, user2Id, timestamp } = JSON.parse(msg.content);

  // Analyser si c'est un instant match (<1min)
  if (isInstantMatch(timestamp)) {
    await generateNarrative('INSTANT_MATCH', { user1Id, user2Id });
  }

  // Analyser si c'est un late night match (23h-4h)
  if (isLateNight(timestamp)) {
    await generateNarrative('LATE_NIGHT_MATCH', { user1Id, user2Id });
  }
});

// Service Notification écoute (EN PARALLÈLE)
channel.consume('match.created', async (msg) => {
  const { user1Id, user2Id } = JSON.parse(msg.content);

  await sendPushNotification(user1Id, {
    title: "Nouveau match! 💕",
    message: "Vous avez un nouveau match! Envoyez un message."
  });

  await sendPushNotification(user2Id, { /* ... */ });
});

// Service Gamification écoute (EN PARALLÈLE)
channel.consume('match.created', async (msg) => {
  const { user1Id, user2Id } = JSON.parse(msg.content);

  // Donner +20 XP à chacun
  await addXP(user1Id, 20);
  await addXP(user2Id, 20);

  // Vérifier si débloquer badge "10 Matches"
  await checkBadges(user1Id);
  await checkBadges(user2Id);
});

// Service Tracking écoute (EN PARALLÈLE)
channel.consume('match.created', async (msg) => {
  const { matchId, user1Id, user2Id } = JSON.parse(msg.content);

  // Créer questionnaire "Jour 1" pour dans 24h
  await scheduleQuestionnaire(matchId, 'day_1', Date.now() + 86400000);
});
```

**RÉSULTAT:**
- ✅ Service Matching n'a PAS attendu (ultra rapide)
- ✅ 4 services ont traité l'événement EN PARALLÈLE
- ✅ Si Service Narratives plante, les autres continuent
- ✅ Si on ajoute un nouveau service demain, il peut écouter sans rien casser

---

## 🔥 Pourquoi RabbitMQ pour МойDate ?

### Avantages Critiques

**1. Découplage (Services Indépendants)**
```
❌ Sans RabbitMQ:
Service Matching appelle directement Service Narratives
→ Si Narratives plante, Matching plante aussi

✅ Avec RabbitMQ:
Service Matching publie un événement
→ Si Narratives plante, Matching ne le sait même pas
```

**2. Scalabilité Horizontale**
```
Vous avez 10,000 matchs simultanés ?

Sans RabbitMQ:
Service Narratives EXPLOSE (10,000 requêtes directes)

Avec RabbitMQ:
RabbitMQ met les 10,000 messages dans une file
Service Narratives les traite un par un, à son rythme
Vous pouvez lancer 5 instances de Narratives en parallèle
→ Chacune prend des messages de la file
```

**3. Retry Automatique**
```
Service Narratives plante en traitant un message ?

RabbitMQ dit: "OK, je vais réessayer dans 5 secondes"
3 tentatives ratées ?
RabbitMQ: "Je mets ce message dans une 'Dead Letter Queue' pour enquête"
```

**4. Garantie de Livraison**
```
Même si le serveur redémarre, les messages ne sont PAS PERDUS
RabbitMQ stocke sur disque
Quand le serveur revient, il retraite tout
```

---

## 📋 Événements RabbitMQ dans МойDate

### Events Critiques

| Exchange | Événement | Producteur | Consommateurs |
|----------|-----------|------------|---------------|
| **moydate.swipe** | swipe.like | Matching | Narratives |
| | swipe.pass | Matching | Narratives |
| | swipe.superlike | Matching | Narratives, Gamification |
| **moydate.match** | match.created | Matching | Narratives, Notification, Gamification, Tracking |
| | match.deleted | Matching | Narratives, Notification |
| **moydate.message** | message.sent | Messaging | Narratives, Notification |
| | message.voice | Messaging | Narratives, Gamification |
| | message.photo | Messaging | Narratives |
| **moydate.profile** | profile.updated | Profile | Narratives |
| | profile.photo_changed | Profile | Narratives |
| **moydate.milestone** | milestone.achieved | Tracking | Gamification, Social Feed |
| | questionnaire.completed | Tracking | Narratives, Gamification |

---

## 💻 Code Complet d'Implémentation

### 1. Configuration RabbitMQ

```typescript
// shared/rabbitmq/connection.ts

import amqp from 'amqplib';

let connection: amqp.Connection;
let channel: amqp.Channel;

export async function connectRabbitMQ() {
  connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();

  console.log('🐰 RabbitMQ connected');
  return channel;
}

export function getChannel() {
  if (!channel) {
    throw new Error('RabbitMQ not connected');
  }
  return channel;
}
```

### 2. Publier un Événement (Producer)

```typescript
// services/matching/src/utils/publishEvent.ts

import { getChannel } from '@shared/rabbitmq/connection';

export async function publishMatchCreated(match: Match) {
  const channel = getChannel();

  const exchange = 'moydate.match';
  const event = {
    type: 'match.created',
    matchId: match.id,
    user1Id: match.user1Id,
    user2Id: match.user2Id,
    timestamp: Date.now(),
    metadata: {
      timeSinceFirstSwipe: match.timeSinceFirstSwipe,
      isInstant: match.timeSinceFirstSwipe < 60000, // <1min
      hourOfDay: new Date().getHours()
    }
  };

  // Déclarer exchange (fanout = broadcast à tous)
  await channel.assertExchange(exchange, 'fanout', { durable: true });

  // Publier
  channel.publish(
    exchange,
    '', // routing key (pas utilisé avec fanout)
    Buffer.from(JSON.stringify(event)),
    { persistent: true } // Survivre aux redémarrages
  );

  console.log(`📤 Published event: ${event.type}`);
}
```

### 3. Écouter des Événements (Consumer)

```typescript
// services/narrative/src/listeners/matchListener.ts

import { getChannel } from '@shared/rabbitmq/connection';
import { generateNarrative } from '../generator/narrativeGenerator';

export async function startMatchListener() {
  const channel = getChannel();

  const exchange = 'moydate.match';
  const queue = 'narrative-service-match-queue';

  // Déclarer exchange
  await channel.assertExchange(exchange, 'fanout', { durable: true });

  // Créer queue pour ce service
  await channel.assertQueue(queue, { durable: true });

  // Lier queue à exchange
  await channel.bindQueue(queue, exchange, '');

  // Consommer messages
  channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());
      console.log(`📥 Received event: ${event.type}`);

      // Traiter selon le type
      switch (event.type) {
        case 'match.created':
          await handleMatchCreated(event);
          break;
        case 'match.deleted':
          await handleMatchDeleted(event);
          break;
      }

      // Acquitter (confirmer traitement réussi)
      channel.ack(msg);

    } catch (error) {
      console.error('Error processing event:', error);

      // Rejeter et remettre dans la queue (retry)
      channel.nack(msg, false, true);
    }
  }, {
    noAck: false // Acquittement manuel
  });

  console.log('🎧 Narrative Service listening to match events...');
}

async function handleMatchCreated(event) {
  // Instant match ?
  if (event.metadata.isInstant) {
    await generateNarrative('INSTANT_MATCH', {
      user1Id: event.user1Id,
      user2Id: event.user2Id
    });
  }

  // Late night match ?
  const hour = event.metadata.hourOfDay;
  if (hour >= 23 || hour <= 4) {
    await generateNarrative('LATE_NIGHT_MATCH', {
      user1Id: event.user1Id,
      user2Id: event.user2Id,
      hour
    });
  }
}
```

### 4. Lancer au Démarrage du Service

```typescript
// services/narrative/src/index.ts

import { connectRabbitMQ } from '@shared/rabbitmq/connection';
import { startMatchListener } from './listeners/matchListener';
import { startSwipeListener } from './listeners/swipeListener';
import { startMessageListener } from './listeners/messageListener';

async function startServer() {
  // Connexion RabbitMQ
  await connectRabbitMQ();

  // Lancer tous les listeners
  await startMatchListener();
  await startSwipeListener();
  await startMessageListener();

  // Lancer serveur Express
  app.listen(3000, () => {
    console.log('🚀 Narrative Service running on port 3000');
  });
}

startServer();
```

---

## 🆚 Alternatives à RabbitMQ

| Solution | Avantages | Inconvénients | Recommandation |
|----------|-----------|---------------|----------------|
| **RabbitMQ** | Simple, fiable, facile | Moins rapide que Kafka | ✅ **OPTIMAL pour МойDate** |
| **Apache Kafka** | Ultra rapide, gros volumes | Complexe, overkill | ⚠️ Si >100K events/seconde |
| **Redis Pub/Sub** | Ultra simple, déjà installé | Messages perdus si crash | ⚠️ Pour événements non-critiques |
| **AWS SQS** | Managed, zero maintenance | Coûts, vendor lock-in | ⚠️ Si déjà sur AWS |
| **Google Pub/Sub** | Managed, scalable | Coûts, vendor lock-in | ⚠️ Si déjà sur GCP |

### Pourquoi RabbitMQ pour МойDate ?

✅ **Parfait équilibre simplicité/performance**
- Gérer 10K-50K events/seconde (largement suffisant)
- Configuration simple
- Garantie de livraison
- Retry automatique
- Open source (pas de vendor lock-in)

✅ **Communauté massive**
- Documentation excellente
- Librairies pour tous les langages
- Monitoring avec UI (RabbitMQ Management)

✅ **Coût faible**
- Self-hosted: gratuit
- Managed (CloudAMQP): $19/mois (MVP)

---

## 🎯 Installation & Setup

### Docker Compose (Développement)

```yaml
# docker-compose.yml

version: '3.8'

services:
  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    container_name: moydate-rabbitmq
    ports:
      - "5672:5672"   # RabbitMQ server
      - "15672:15672" # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: moydate
      RABBITMQ_DEFAULT_PASS: moydate123
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - moydate-network

volumes:
  rabbitmq_data:

networks:
  moydate-network:
    driver: bridge
```

**Lancer:**
```bash
docker-compose up -d rabbitmq

# Accéder Management UI: http://localhost:15672
# Username: moydate
# Password: moydate123
```

### Production (AWS / Yandex Cloud)

**Option 1: Self-hosted (EC2/VM)**
- Instance t3.medium (2 vCPU, 4GB RAM)
- RabbitMQ installé via apt/yum
- Coût: ~$30/mois

**Option 2: Managed (CloudAMQP)**
- Plan "Lemur" (partagé)
- 1M messages/mois inclus
- Coût: $19/mois (MVP)
- URL: https://customer.cloudamqp.com

---

## 📊 Monitoring RabbitMQ

### Management UI

Accéder: `http://localhost:15672`

**Métriques importantes:**
- **Queue depth:** Nombre de messages en attente
  - Si >1000: service consommateur trop lent
  - Solution: scaler horizontalement (plus d'instances)

- **Message rate:** Messages/seconde
  - Publier: combien envoyés
  - Consommer: combien traités
  - Objectif: consommer ≥ publier

- **Connections:** Nombre de services connectés
  - Vérifier tous les services sont bien connectés

### Alertes Importantes

```typescript
// Vérifier queue depth toutes les 5 minutes
setInterval(async () => {
  const queueInfo = await channel.checkQueue('narrative-service-match-queue');

  if (queueInfo.messageCount > 1000) {
    console.warn(`⚠️ Queue depth high: ${queueInfo.messageCount} messages`);
    // Envoyer alerte Slack/Email
    await sendAlert('RabbitMQ queue depth > 1000');
  }
}, 5 * 60 * 1000);
```

---

## 🎓 Résumé pour Débutants

### En 3 Points

1. **RabbitMQ = Facteur entre vos services**
   - Service A envoie un message
   - RabbitMQ le distribue à Service B, C, D
   - Chacun traite à son rythme

2. **Pourquoi c'est génial ?**
   - Services indépendants (si un plante, les autres continuent)
   - Scalable (ajouter des workers facile)
   - Garantie de livraison (aucun message perdu)

3. **Cas d'usage МойDate**
   - Nouveau match → notify 4 services différents
   - Nouveau message → générer narrative + notification
   - Photo uploadée → analyser + générer narrative

### Première Étape

```bash
# 1. Installer Docker
# 2. Lancer RabbitMQ
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management

# 3. Accéder UI
http://localhost:15672
Login: guest / guest

# 4. Tester avec code Node.js
npm install amqplib
# Copier exemples ci-dessus
```

---

## 📚 Ressources

- **Documentation officielle:** https://www.rabbitmq.com/documentation.html
- **Tutoriels interactifs:** https://www.rabbitmq.com/getstarted.html
- **CloudAMQP (managed):** https://www.cloudamqp.com
- **Monitoring:** RabbitMQ Prometheus + Grafana

---

**TL;DR:** RabbitMQ est un "bus de messages" qui permet à vos microservices de communiquer de manière asynchrone, fiable et scalable. Essentiel pour МойDate avec 11 services qui doivent collaborer. 🐰✉️
