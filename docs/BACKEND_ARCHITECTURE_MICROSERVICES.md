# Architecture Backend Microservices - МойDate
**Version:** 1.0.0
**Date:** 2025-10-04
**Statut:** Proposition Phase 1 (MVP)

---

## 📋 Table des Matières

1. [Vue d'ensemble Architecture](#1-vue-densemble-architecture)
2. [Tableau Priorisation Fonctionnalités](#2-tableau-priorisation-fonctionnalités)
3. [Architecture Microservices Détaillée](#3-architecture-microservices-détaillée)
4. [Stack Technique par Service](#4-stack-technique-par-service)
5. [Infrastructure & Déploiement](#5-infrastructure--déploiement)
6. [Stratégie de Migration](#6-stratégie-de-migration)

---

## 1. Vue d'ensemble Architecture

### 1.1 Philosophie Microservices

**Principes:**
- ✅ **1 Service = 1 Responsabilité** (Single Responsibility)
- ✅ **Communication asynchrone** (Event-driven avec RabbitMQ/Kafka)
- ✅ **Base de données dédiée** par service (Database per Service)
- ✅ **Scalabilité indépendante** (horizontal scaling)
- ✅ **Déploiement indépendant** (CI/CD par service)
- ✅ **Résilience** (Circuit breaker, retry patterns)

### 1.2 Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React PWA)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API GATEWAY   │ (Kong/NGINX)
                    │  + Load Balancer │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
│  Auth Service │   │ Profile Service│   │ Matching Svc  │
│  (JWT/OAuth)  │   │ (User Data)    │   │ (Algorithm)   │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                    │                    │
┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
│ Messaging Svc │   │Social Feed Svc│   │Notification Svc│
│ (Real-time)   │   │(Feed Algo)    │   │(Push/Email)   │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  MESSAGE BROKER │ (RabbitMQ/Redis)
                    │   Event Bus     │
                    └─────────────────┘
```

---

## 2. Tableau Priorisation Fonctionnalités

### 2.1 Phase 1 - MVP (Fonctionnalités Basiques) 🎯

| # | Module | Fonctionnalité | Priorité | Complexité | Temps Estimé |
|---|--------|---------------|----------|-----------|-------------|
| **AUTHENTIFICATION & PROFILS** |
| 1.1 | Auth | Inscription/Connexion (Email + Google OAuth) | 🔴 P0 | Moyenne | 3j |
| 1.2 | Auth | JWT token + refresh token | 🔴 P0 | Faible | 2j |
| 1.3 | Auth | Gestion sessions (Redis) | 🔴 P0 | Faible | 1j |
| 1.4 | Profile | CRUD profils (nom, bio, photos) | 🔴 P0 | Moyenne | 4j |
| 1.5 | Profile | Upload photos (max 6, S3/CDN) | 🔴 P0 | Moyenne | 3j |
| 1.6 | Profile | Préférences matching (âge, distance, genre) | 🔴 P0 | Faible | 2j |
| 1.7 | Profile | Localisation GPS (ville actuelle) | 🟡 P1 | Moyenne | 2j |
| **MATCHING & DÉCOUVERTE** |
| 2.1 | Matching | Algorithme de base (distance + âge + genre) | 🔴 P0 | Élevée | 5j |
| 2.2 | Matching | Swipe (like/pass/superlike) | 🔴 P0 | Moyenne | 3j |
| 2.3 | Matching | Détection match mutuel | 🔴 P0 | Moyenne | 2j |
| 2.4 | Matching | Pile de découverte (20 profils/jour gratuit) | 🔴 P0 | Moyenne | 3j |
| 2.5 | Matching | Biais interculturel (55%) | 🟢 P2 | Moyenne | 4j |
| 2.6 | Matching | Compatibilité astrologique | 🟢 P2 | Faible | 2j |
| **MESSAGERIE TEMPS RÉEL** |
| 3.1 | Messages | WebSocket connexion (Socket.io) | 🔴 P0 | Élevée | 5j |
| 3.2 | Messages | Messages texte en temps réel | 🔴 P0 | Moyenne | 4j |
| 3.3 | Messages | Indicateur "en train d'écrire..." | 🟡 P1 | Faible | 1j |
| 3.4 | Messages | Support emojis (Unicode) | 🔴 P0 | Faible | 1j |
| 3.5 | Messages | Envoi photos/vidéos (upload + CDN) | 🟡 P1 | Moyenne | 4j |
| 3.6 | Messages | Messages vocaux (enregistrement + stockage) | 🟡 P1 | Élevée | 5j |
| 3.7 | Messages | Stickers & memes (bibliothèque) | 🟢 P2 | Moyenne | 3j |
| 3.8 | Messages | Historique conversations (pagination) | 🔴 P0 | Moyenne | 2j |
| 3.9 | Messages | Statut de lecture (lu/non lu) | 🟡 P1 | Faible | 2j |
| **SOCIAL FEED** |
| 4.1 | Social | Timeline posts utilisateurs | 🟡 P1 | Moyenne | 4j |
| 4.2 | Social | Création posts (texte + photos) | 🟡 P1 | Moyenne | 3j |
| 4.3 | Social | Réactions (❤️ 😂 😮 😢 😡) | 🟡 P1 | Faible | 2j |
| 4.4 | Social | Commentaires sur posts | 🟡 P1 | Moyenne | 3j |
| 4.5 | Social | Partage posts (interne) | 🟢 P2 | Faible | 2j |
| 4.6 | Social | Feed algorithmique (tri chronologique) | 🟡 P1 | Moyenne | 3j |
| **NOTIFICATIONS** |
| 5.1 | Notif | Push notifications (Firebase/OneSignal) | 🔴 P0 | Moyenne | 3j |
| 5.2 | Notif | Notifications in-app | 🔴 P0 | Faible | 2j |
| 5.3 | Notif | Email notifications (nouveaux matchs) | 🟡 P1 | Faible | 2j |
| 5.4 | Notif | Préférences notifications | 🟢 P2 | Faible | 1j |
| **PREMIUM & GESTION TRAFIC** |
| 6.1 | Premium | Système tiers (Free/Premium) | 🟡 P1 | Moyenne | 3j |
| 6.2 | Premium | Rate limiting (Free: 20 profils/jour) | 🟡 P1 | Moyenne | 2j |
| 6.3 | Premium | Paiements (Stripe/PayPal) | 🟢 P2 | Élevée | 5j |
| 6.4 | Premium | Avantages Premium (illimité, boost, rewind) | 🟢 P2 | Moyenne | 4j |
| **MODÉRATION & SÉCURITÉ** |
| 7.1 | Moderation | Signalement profils/messages | 🟡 P1 | Moyenne | 3j |
| 7.2 | Moderation | Blocage utilisateurs | 🔴 P0 | Faible | 2j |
| 7.3 | Moderation | Auto-modération texte (keywords) | 🟡 P1 | Moyenne | 3j |
| 7.4 | Moderation | Vérification photo (anti-fake) | 🟢 P2 | Élevée | 5j |
| **LOCALISATION & TRADUCTION** |
| 8.1 | Location | Géolocalisation temps réel | 🟡 P1 | Moyenne | 3j |
| 8.2 | Location | Calcul distance entre utilisateurs | 🔴 P0 | Faible | 2j |
| 8.3 | Translation | Traduction auto DeepL (Premium) | 🟢 P2 | Moyenne | 4j |
| 8.4 | Translation | Détection langue auto | 🟢 P2 | Faible | 2j |

**Légende Priorité:**
- 🔴 **P0** = Critique (Blocker MVP)
- 🟡 **P1** = Important (MVP souhaitable)
- 🟢 **P2** = Nice to have (Post-MVP)

**Total Phase 1:** ~120-140 jours de développement (4-5 mois avec 1 dev fullstack)

---

### 2.2 Phase 2 - Fonctionnalités Avancées 🚀

| # | Module | Fonctionnalité | Dépendances Phase 1 | Complexité | Temps Estimé |
|---|--------|---------------|---------------------|-----------|-------------|
| **IA & AUTOMATISATION** |
| 9.1 | AI | Intégration GPT-4o (conseils dating) | Messaging, Profile | Élevée | 7j |
| 9.2 | AI | Analyse compatibilité avancée (ML) | Matching algo | Très élevée | 10j |
| 9.3 | AI | Suggestion messages intelligents | Messaging | Moyenne | 5j |
| 9.4 | AI | Modération contenu (images NSFW) | Moderation | Élevée | 6j |
| **NARRATIVES ALGORITHMIQUES** |
| 10.1 | Narrative | Générateur narratives sarcastiques | Social Feed, Matching | Très élevée | 12j |
| 10.2 | Narrative | Templates (110+ scénarios) | 10.1 | Élevée | 8j |
| 10.3 | Narrative | Analyse comportementale users | Matching, Messages | Très élevée | 10j |
| 10.4 | Narrative | Feed narratives en temps réel | 10.1, 10.3 | Élevée | 7j |
| **GAMIFICATION** |
| 11.1 | Game | Système badges/achievements | Social Feed | Moyenne | 5j |
| 11.2 | Game | Leaderboard global | 11.1 | Faible | 3j |
| 11.3 | Game | Récompenses quotidiennes | Premium | Moyenne | 4j |
| **TRACKING RELATIONS** |
| 12.1 | Tracker | Questionnaires progressifs | Matching | Élevée | 6j |
| 12.2 | Tracker | Statistiques couple | Messages | Moyenne | 4j |
| 12.3 | Tracker | Milestones relationnels | 12.1 | Faible | 3j |
| **SOCIAL AVANCÉ** |
| 13.1 | Social | Stories (24h) | Social Feed | Moyenne | 5j |
| 13.2 | Social | Live streaming | Social Feed | Très élevée | 12j |
| 13.3 | Social | Partage externe (Instagram, TikTok) | Social Feed | Moyenne | 4j |
| **PREMIUM+** |
| 14.1 | Premium | Mode invisible | Premium | Faible | 2j |
| 14.2 | Premium | Boost profil (priorité dans pile) | Matching | Moyenne | 3j |
| 14.3 | Premium | Rewind (annuler swipe) | Matching | Faible | 2j |
| 14.4 | Premium | Filtres avancés (métier, éducation) | Profile | Moyenne | 3j |

**Total Phase 2:** ~110-130 jours de développement additionnels

---

## 3. Architecture Microservices Détaillée

### 3.1 Service #1: Auth Service 🔐

**Responsabilité:** Authentification et autorisation

**Endpoints:**
```
POST   /api/auth/register          # Inscription
POST   /api/auth/login             # Connexion
POST   /api/auth/refresh-token     # Renouvellement token
POST   /api/auth/logout            # Déconnexion
GET    /api/auth/oauth/google      # OAuth Google
POST   /api/auth/reset-password    # Réinitialisation MDP
POST   /api/auth/verify-email      # Vérification email
```

**Technologies:**
- Node.js + Express
- PostgreSQL (users, sessions)
- Redis (tokens, sessions)
- JWT (jsonwebtoken)
- bcrypt (hashing)
- Passport.js (OAuth)

**Base de données:**
```sql
TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  refresh_token VARCHAR(500),
  expires_at TIMESTAMP,
  ip_address VARCHAR(50),
  user_agent TEXT
)
```

---

### 3.2 Service #2: Profile Service 👤

**Responsabilité:** Gestion profils utilisateurs

**Endpoints:**
```
GET    /api/profiles/:userId       # Récupérer profil
PUT    /api/profiles/:userId       # Mettre à jour profil
POST   /api/profiles/:userId/photos # Upload photos
DELETE /api/profiles/:userId/photos/:photoId # Supprimer photo
GET    /api/profiles/:userId/preferences # Préférences matching
PUT    /api/profiles/:userId/preferences # Modifier préférences
PUT    /api/profiles/:userId/location    # Mettre à jour localisation
```

**Technologies:**
- Node.js + Express
- PostgreSQL (profils)
- AWS S3 / Cloudinary (stockage images)
- Sharp (optimisation images)
- Redis (cache profils)

**Base de données:**
```sql
TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id),
  display_name VARCHAR(100),
  birth_date DATE,
  gender VARCHAR(20),
  bio TEXT,
  location_lat DECIMAL(10,8),
  location_lon DECIMAL(11,8),
  city VARCHAR(100),
  zodiac_sign VARCHAR(20),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP
)

TABLE profile_photos (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  url VARCHAR(500),
  is_main BOOLEAN DEFAULT false,
  position INT,
  created_at TIMESTAMP
)

TABLE preferences (
  id UUID PRIMARY KEY,
  profile_id UUID UNIQUE REFERENCES profiles(id),
  gender_preference VARCHAR(20),
  min_age INT,
  max_age INT,
  max_distance INT,
  show_verified_only BOOLEAN DEFAULT false
)
```

---

### 3.3 Service #3: Matching Service 💕

**Responsabilité:** Algorithme matching + swipes

**Endpoints:**
```
GET    /api/matching/discover      # Pile de profils à découvrir
POST   /api/matching/swipe         # Like/Pass/SuperLike
GET    /api/matching/matches       # Liste des matchs
DELETE /api/matching/matches/:id   # Unmatch
POST   /api/matching/rewind        # Annuler dernier swipe (Premium)
```

**Technologies:**
- Node.js + Express
- PostgreSQL (swipes, matches)
- Redis (cache pile discovery)
- Algorithme de scoring (custom)

**Algorithme Scoring (Phase 1 - Basique):**
```javascript
function calculateCompatibilityScore(user, candidate) {
  let score = 100;

  // Distance (40 points max)
  const distance = calculateDistance(user.location, candidate.location);
  if (distance <= 10) score += 40;
  else if (distance <= 50) score += 30;
  else if (distance <= 100) score += 20;
  else score += 10;

  // Âge compatible (30 points max)
  const ageGap = Math.abs(user.age - candidate.age);
  if (ageGap <= 3) score += 30;
  else if (ageGap <= 5) score += 20;
  else if (ageGap <= 10) score += 10;

  // Préférences de genre (30 points)
  if (matchesGenderPreference(user, candidate)) score += 30;

  // Biais interculturel (Phase 2)
  // if (differentCultures(user, candidate)) score *= 1.55;

  return score;
}
```

**Base de données:**
```sql
TABLE swipes (
  id UUID PRIMARY KEY,
  swiper_id UUID REFERENCES profiles(id),
  swiped_id UUID REFERENCES profiles(id),
  action VARCHAR(20), -- 'like', 'pass', 'superlike'
  created_at TIMESTAMP,
  UNIQUE(swiper_id, swiped_id)
)

TABLE matches (
  id UUID PRIMARY KEY,
  user1_id UUID REFERENCES profiles(id),
  user2_id UUID REFERENCES profiles(id),
  matched_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user1_id, user2_id)
)
```

---

### 3.4 Service #4: Messaging Service 💬

**Responsabilité:** Messagerie temps réel

**Endpoints REST:**
```
GET    /api/messages/conversations        # Liste conversations
GET    /api/messages/conversations/:id    # Historique messages
POST   /api/messages/upload               # Upload média (photo/vidéo/vocal)
DELETE /api/messages/:messageId           # Supprimer message
```

**WebSocket Events (Socket.io):**
```javascript
// Client → Server
socket.emit('message:send', { conversationId, content, type })
socket.emit('typing:start', { conversationId })
socket.emit('typing:stop', { conversationId })
socket.emit('message:read', { messageId })

// Server → Client
socket.on('message:received', { message })
socket.on('typing:indicator', { userId, conversationId })
socket.on('message:read:confirm', { messageId })
```

**Technologies:**
- Node.js + Socket.io
- PostgreSQL (messages, conversations)
- Redis (Socket.io adapter pour clustering)
- AWS S3 (stockage médias)
- FFmpeg (compression audio/vidéo)

**Base de données:**
```sql
TABLE conversations (
  id UUID PRIMARY KEY,
  match_id UUID REFERENCES matches(id),
  created_at TIMESTAMP,
  last_message_at TIMESTAMP
)

TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES profiles(id),
  content TEXT,
  type VARCHAR(20), -- 'text', 'photo', 'video', 'voice', 'emoji', 'sticker'
  media_url VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  INDEX(conversation_id, created_at)
)
```

**Gestion Trafic Free vs Premium:**
```javascript
// Middleware rate limiting
const messageRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24h
  max: async (req) => {
    const user = await getUser(req.userId);
    return user.tier === 'premium' ? 1000 : 100; // 100 msg/jour (free)
  }
});
```

---

### 3.5 Service #5: Social Feed Service 📺

**Responsabilité:** Feed social + narratives (Phase 2)

**Endpoints Phase 1:**
```
GET    /api/feed                   # Timeline posts
POST   /api/feed/posts             # Créer post
GET    /api/feed/posts/:id         # Détails post
DELETE /api/feed/posts/:id         # Supprimer post
POST   /api/feed/posts/:id/reactions  # Réagir
POST   /api/feed/posts/:id/comments   # Commenter
POST   /api/feed/posts/:id/share      # Partager
```

**Technologies:**
- Node.js + Express
- PostgreSQL (posts, comments, reactions)
- Redis (cache feed)
- CDN (images/vidéos posts)

**Base de données:**
```sql
TABLE posts (
  id UUID PRIMARY KEY,
  author_id UUID REFERENCES profiles(id),
  content TEXT,
  media_urls TEXT[], -- Array d'URLs
  type VARCHAR(20), -- 'user_post', 'narrative' (Phase 2)
  created_at TIMESTAMP,
  INDEX(created_at DESC)
)

TABLE reactions (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  user_id UUID REFERENCES profiles(id),
  reaction_type VARCHAR(10), -- 'love', 'laugh', 'wow', 'sad', 'angry'
  created_at TIMESTAMP,
  UNIQUE(post_id, user_id)
)

TABLE comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  author_id UUID REFERENCES profiles(id),
  content TEXT,
  created_at TIMESTAMP
)
```

---

### 3.6 Service #6: Notification Service 🔔

**Responsabilité:** Push notifications + email

**Endpoints:**
```
GET    /api/notifications           # Liste notifications
PUT    /api/notifications/:id/read  # Marquer lue
POST   /api/notifications/preferences # Préférences
```

**Technologies:**
- Node.js + Express
- PostgreSQL (notifications)
- Firebase Cloud Messaging (push mobile)
- OneSignal (alternative push)
- SendGrid (emails)

**Types de notifications:**
```javascript
const NOTIFICATION_TYPES = {
  NEW_MATCH: 'new_match',          // "Vous avez un nouveau match !"
  NEW_MESSAGE: 'new_message',      // "Nouveau message de Julie"
  PROFILE_VIEW: 'profile_view',    // "Marie a visité votre profil"
  SUPER_LIKE: 'super_like',        // "Alex vous a super liké !"
  NEW_COMMENT: 'new_comment',      // "Nouveau commentaire sur votre post"
  NEW_REACTION: 'new_reaction'     // "15 personnes ont réagi à votre post"
};
```

---

### 3.7 Service #7: Premium Service 💎

**Responsabilité:** Gestion abonnements + paiements

**Endpoints:**
```
GET    /api/premium/plans          # Plans disponibles
POST   /api/premium/subscribe      # Souscrire
POST   /api/premium/cancel         # Annuler
GET    /api/premium/status         # Statut abonnement
POST   /api/premium/payment/webhook # Webhook Stripe
```

**Technologies:**
- Node.js + Express
- PostgreSQL (subscriptions)
- Stripe / PayPal (paiements)
- Webhooks (gestion événements paiement)

**Tiers:**
```javascript
const TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    limits: {
      dailySwipes: 20,
      dailyMessages: 100,
      superLikes: 1,
      rewind: false,
      translation: false
    }
  },
  PREMIUM: {
    name: 'Premium',
    price: 9.99, // €/mois
    limits: {
      dailySwipes: Infinity,
      dailyMessages: Infinity,
      superLikes: 5,
      rewind: true,
      translation: true
    }
  }
};
```

---

## 4. Stack Technique par Service

### 4.1 Backend Services

| Service | Runtime | Framework | Database | Cache | Storage |
|---------|---------|-----------|----------|-------|---------|
| Auth | Node.js 20 | Express | PostgreSQL 16 | Redis | - |
| Profile | Node.js 20 | Express | PostgreSQL 16 | Redis | S3/Cloudinary |
| Matching | Node.js 20 | Express | PostgreSQL 16 | Redis | - |
| Messaging | Node.js 20 | Socket.io | PostgreSQL 16 | Redis | S3 (médias) |
| Social Feed | Node.js 20 | Express | PostgreSQL 16 | Redis | CDN |
| Notification | Node.js 20 | Express | PostgreSQL 16 | - | - |
| Premium | Node.js 20 | Express | PostgreSQL 16 | - | - |

**Pourquoi Node.js?**
- Performance I/O non-bloquant (WebSocket)
- Écosystème riche (NPM)
- JavaScript full-stack (même langage frontend)
- Excellent pour real-time

### 4.2 Infrastructure Partagée

**API Gateway:**
- Kong / NGINX
- Rate limiting global
- Load balancing
- SSL/TLS termination
- CORS handling

**Message Broker:**
- RabbitMQ / Apache Kafka
- Event-driven communication
- Async processing
- Service decoupling

**Monitoring:**
- Prometheus (metrics)
- Grafana (dashboards)
- ELK Stack (logs)
- Sentry (error tracking)

**CI/CD:**
- GitHub Actions
- Docker + Docker Compose
- Kubernetes (production)

---

## 5. Infrastructure & Déploiement

### 5.1 Architecture Cloud (AWS)

```
┌─────────────────────────────────────────────────────┐
│                  Route 53 (DNS)                     │
└────────────────────┬────────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │  CloudFront (CDN)   │
          │  + WAF (Firewall)   │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │  Application Load   │
          │     Balancer        │
          └──────────┬──────────┘
                     │
     ┌───────────────┼───────────────┐
     │               │               │
┌────▼────┐    ┌────▼────┐    ┌────▼────┐
│ ECS     │    │ ECS     │    │ ECS     │
│Cluster  │    │Cluster  │    │Cluster  │
│(Auth)   │    │(Profile)│    │(Message)│
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     └──────────────┼──────────────┘
                    │
          ┌─────────▼─────────┐
          │   RDS PostgreSQL  │
          │   Multi-AZ        │
          └───────────────────┘

          ┌───────────────────┐
          │ ElastiCache Redis │
          │   Cluster         │
          └───────────────────┘

          ┌───────────────────┐
          │  S3 Buckets       │
          │  (Images/Videos)  │
          └───────────────────┘
```

### 5.2 Environnements

**Development:**
- Docker Compose local
- PostgreSQL + Redis containers
- Hot reload (nodemon)

**Staging:**
- AWS ECS (1 instance/service)
- RDS PostgreSQL (t3.medium)
- ElastiCache Redis (t3.small)

**Production:**
- AWS ECS (auto-scaling 2-10 instances)
- RDS PostgreSQL (r6g.xlarge, Multi-AZ)
- ElastiCache Redis (r6g.large, Cluster)
- CloudFront CDN
- Route 53 DNS

### 5.3 Coûts Estimés (AWS)

**Phase 1 MVP (100-1000 utilisateurs actifs):**
- ECS Services (7 services × $30/mois): **$210/mois**
- RDS PostgreSQL (db.t3.medium): **$80/mois**
- ElastiCache Redis (cache.t3.small): **$40/mois**
- S3 + CloudFront (10GB storage + 100GB trafic): **$30/mois**
- Load Balancer: **$20/mois**
- **Total: ~$380/mois**

**Phase 2 (10,000+ utilisateurs):**
- Auto-scaling instances: **$800/mois**
- RDS (db.r6g.large): **$300/mois**
- Redis Cluster: **$150/mois**
- S3 + CDN (100GB + 1TB): **$200/mois**
- **Total: ~$1,450/mois**

---

## 6. Stratégie de Migration

### 6.1 Roadmap Développement

**Mois 1-2: Services Core**
- ✅ Auth Service (inscription, login, JWT)
- ✅ Profile Service (CRUD profils, photos)
- ✅ Infrastructure de base (Docker, PostgreSQL, Redis)

**Mois 3: Matching**
- ✅ Matching Service (algorithme basique, swipes)
- ✅ Discovery pipeline (pile profils)
- ✅ Tests E2E matching flow

**Mois 4-5: Messagerie**
- ✅ Messaging Service (WebSocket, temps réel)
- ✅ Upload médias (photos, vidéos, vocal)
- ✅ Rate limiting Free/Premium

**Mois 6: Social & Finitions**
- ✅ Social Feed Service (posts, reactions, comments)
- ✅ Notification Service (push, email)
- ✅ Premium Service (paiements, tiers)
- ✅ Tests performance & sécurité

**Mois 7+: Phase 2**
- 🚀 GPT-4o integration
- 🚀 Narratives algorithmiques
- 🚀 Gamification
- 🚀 Features avancées

### 6.2 Ordre d'Implémentation Services

1. **Auth Service** (bloquant tout le reste)
2. **Profile Service** (dépend de Auth)
3. **Matching Service** (dépend de Profile)
4. **Messaging Service** (dépend de Matching)
5. **Notification Service** (dépend de Messaging + Matching)
6. **Social Feed Service** (parallèle à Messaging)
7. **Premium Service** (dernière étape Phase 1)

### 6.3 Testing Strategy

**Par Service:**
- Unit tests (Jest) - Coverage > 80%
- Integration tests (Supertest)
- E2E tests (Cypress)

**Performance:**
- Load testing (k6, Artillery)
- WebSocket stress tests (1000+ connexions simultanées)
- Database query optimization (EXPLAIN ANALYZE)

**Sécurité:**
- OWASP ZAP scanning
- Dependency vulnerability checks (npm audit)
- Penetration testing avant production

---

## 7. Annexes

### 7.1 Glossaire

- **P0/P1/P2**: Niveaux de priorité (Critique, Important, Nice-to-have)
- **MVP**: Minimum Viable Product
- **ECS**: Elastic Container Service (AWS)
- **RDS**: Relational Database Service (AWS)
- **CDN**: Content Delivery Network
- **WebSocket**: Protocole bidirectionnel temps réel

### 7.2 Références

- [Architecture Microservices (Martin Fowler)](https://martinfowler.com/articles/microservices.html)
- [AWS Best Practices](https://aws.amazon.com/architecture/well-architected/)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)

---

**Note:** Ce document est un guide stratégique. Les détails d'implémentation seront affinés durant le développement avec des spécifications techniques par service (OpenAPI, diagrammes de séquence, etc.).
