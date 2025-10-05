# Plan Backend МойDate avec Flow Nexus

**Date:** 2025-10-04
**Objectif:** Générer architecture backend complète via Flow Nexus
**Approche:** Hive Mind Local + Templates Gratuits (en attendant fix rUv)

---

## 🎯 STRATÉGIE DE DÉVELOPPEMENT

### Phase 1: Utiliser Ressources Gratuites (Maintenant)

**Outils disponibles sans rUv:**
1. ✅ **Hive Mind Local** - Coordination multi-agents gratuite
2. ✅ **Templates gratuits** - Claude Flow Swarm, Hive Mind
3. ✅ **Sandboxes E2B** - 602 credits disponibles
4. ✅ **Claude Code** - Génération code assistée

### Phase 2: Migration Cloud (Après fix bug rUv)

**Avec crédits rUv restaurés:**
1. 🔄 **Cloud Swarms** - Scaling et performance
2. 🔄 **Neural Training** - ML pour matching
3. 🔄 **Templates Premium** - Optimisations avancées

---

## 📋 ARCHITECTURE À GÉNÉRER

### Microservices (11 services)

#### 1. **Auth Service** (Priorité: P0)
```yaml
Fonctionnalités:
  - Phone OTP (SMS via Twilio/similar)
  - VK OAuth (PRIORITAIRE pour Russie)
  - Google OAuth
  - Apple OAuth
  - Instagram OAuth
  - JWT token management
  - Session management (Redis)

Stack:
  - Node.js 20 LTS
  - Express 4.18
  - BetterAuth (framework OAuth)
  - Redis 7 (sessions)
  - PostgreSQL 16 (users)

Endpoints:
  - POST /auth/phone/send-otp
  - POST /auth/phone/verify
  - GET /auth/oauth/:provider
  - GET /auth/oauth/:provider/callback
  - POST /auth/refresh
  - POST /auth/logout

Coût Flow Nexus:
  - Generation: Hive Mind Local (gratuit)
  - Sandbox: ~5 credits/h test
```

#### 2. **Profile Service** (Priorité: P0)
```yaml
Fonctionnalités:
  - CRUD profils utilisateurs
  - Upload photos (6 max)
  - Gestion préférences
  - Géolocalisation temps réel
  - Intégration Supabase Storage

Stack:
  - Node.js + Express
  - PostgreSQL (Supabase)
  - Supabase Storage (photos)
  - Sharp (image processing)

Endpoints:
  - GET /profile/:userId
  - PUT /profile/:userId
  - POST /profile/photos
  - DELETE /profile/photos/:photoId
  - PUT /profile/location

Coût Flow Nexus:
  - Generation: Hive Mind Local
  - Sandbox: ~3 credits/h
```

#### 3. **Matching Service** (Priorité: P0)
```yaml
Fonctionnalités:
  - Algorithme ELO
  - Swipe left/right
  - SuperLike (1/jour free, 5/jour premium)
  - Rewind (premium only)
  - Filtres (âge, distance, genre, etc.)
  - Rate limiting (50 profils/3h free)

Stack:
  - Node.js + Express
  - PostgreSQL (matches, swipes)
  - Redis (caching profils, rate limiting)

Endpoints:
  - GET /discover (avec filtres)
  - POST /swipe (left/right/superlike)
  - POST /rewind (premium)
  - GET /matches

Coût Flow Nexus:
  - Generation: Hive Mind Local
  - ML Optimization: ~50 credits (Phase 2)
```

#### 4. **Chat Service** (Priorité: P0)
```yaml
Fonctionnalités:
  - Messagerie temps réel (Socket.io)
  - Text messages
  - Emojis, reactions
  - Photos/videos
  - Voice messages
  - Stickers, memes
  - Typing indicators
  - Read receipts
  - Rate limiting (100 messages/jour free)

Stack:
  - Node.js + Express + Socket.io
  - PostgreSQL (messages historique)
  - Redis (Socket.io adapter, online status)

Endpoints WebSocket:
  - connection
  - message:send
  - message:read
  - typing:start
  - typing:stop

REST API:
  - GET /conversations
  - GET /messages/:conversationId
  - POST /messages (fallback HTTP)

Coût Flow Nexus:
  - Generation: Hive Mind Local
  - Sandbox: ~10 credits/h (WebSocket testing)
```

#### 5. **Narrative Service** (Priorité: P0 - CORE FEATURE)
```yaml
Fonctionnalités:
  - Génération narratives AI (Claude API)
  - Templates sarcastiques
  - Post automatiques (match confirmé, milestone relationnel)
  - Algorithme sélection narratives
  - Personalisation par utilisateur

Stack:
  - Node.js + Express
  - Anthropic Claude API
  - PostgreSQL (narratives, templates)
  - Redis (cache narratives populaires)

Endpoints:
  - GET /narratives (feed global)
  - GET /narratives/:narrativeId
  - POST /narratives/generate (AI)
  - GET /templates

Coût Flow Nexus:
  - Generation: Hive Mind Local
  - Claude API: Externe (payé séparément)
```

#### 6. **Social Feed Service** (Priorité: P1)
```yaml
Fonctionnalités:
  - Feed posts utilisateurs
  - Comments
  - Reactions (❤️ 😂 😮 😢 😡)
  - Sharing
  - Narratives intégration
  - Timeline algorithmique

Stack:
  - Node.js + Express
  - PostgreSQL (posts, comments, reactions)
  - Redis (feed cache)

Endpoints:
  - GET /feed
  - POST /posts
  - POST /posts/:id/comment
  - POST /posts/:id/react
  - POST /posts/:id/share

Coût Flow Nexus:
  - Generation: Hive Mind Local
```

#### 7. **Premium Service** (Priorité: P0)
```yaml
Fonctionnalités:
  - Gestion abonnements (1 week, 1 month, 3 months, 6 months)
  - Paiements Russie (MirPay, SberPay, Tinkoff, YooMoney)
  - Paiements International (Stripe, Apple Pay, Google Pay)
  - In-app purchases (SuperLikes, Boosts)
  - Webhooks paiements
  - Gestion features premium

Stack:
  - Node.js + Express
  - PostgreSQL (subscriptions, transactions)
  - YooKassa API (Russie)
  - Stripe API (International)

Endpoints:
  - POST /subscribe
  - POST /purchase (SuperLikes, Boosts)
  - POST /webhooks/yookassa
  - POST /webhooks/stripe
  - GET /subscription/status

Coût Flow Nexus:
  - Generation: Hive Mind Local
```

#### 8. **Gamification Service** (Priorité: P1)
```yaml
Fonctionnalités:
  - Badges
  - XP points
  - Leaderboard
  - Achievements
  - Daily challenges

Stack:
  - Node.js + Express
  - PostgreSQL (badges, xp, achievements)
  - Redis (leaderboard sorted sets)

Endpoints:
  - GET /badges/:userId
  - GET /leaderboard
  - GET /achievements
  - POST /achievements/claim

Coût Flow Nexus:
  - Generation: Hive Mind Local
```

#### 9. **Tracking Service** (Priorité: P1)
```yaml
Fonctionnalités:
  - Questionnaires relationnels
  - Milestones tracking
  - Relationship health score
  - Notifications milestones

Stack:
  - Node.js + Express
  - PostgreSQL (questionnaires, milestones)

Endpoints:
  - GET /questionnaires
  - POST /questionnaires/:id/answer
  - GET /milestones/:matchId
  - POST /milestones/track

Coût Flow Nexus:
  - Generation: Hive Mind Local
```

#### 10. **Notification Service** (Priorité: P1)
```yaml
Fonctionnalités:
  - Push notifications (Firebase/Supabase)
  - In-app notifications
  - Email notifications
  - SMS (pour OTP)

Stack:
  - Node.js + Express
  - RabbitMQ (message queue)
  - PostgreSQL (notifications historique)
  - Firebase Cloud Messaging / Supabase Realtime

Endpoints:
  - GET /notifications
  - PUT /notifications/:id/read
  - POST /notifications/preferences

Coût Flow Nexus:
  - Generation: Hive Mind Local
```

#### 11. **Translation Service** (Priorité: P2)
```yaml
Fonctionnalités:
  - Traduction messages (DeepL premium, Google fallback)
  - Auto-détection langue
  - Cache traductions

Stack:
  - Node.js + Express
  - DeepL API (premium users)
  - Google Translate API (free users)
  - Redis (cache traductions)

Endpoints:
  - POST /translate

Coût Flow Nexus:
  - Generation: Hive Mind Local
```

---

## 🚀 PLAN D'EXÉCUTION AVEC FLOW NEXUS

### Étape 1: Configuration Environnement (Maintenant)

**Hive Mind Local déjà configuré:**
```
.hive-mind/
├── config.json (hierarchical, 10 agents)
├── memory.json (persistence)
└── sessions/
```

**Créer structure backend:**
```bash
mkdir -p backend/{services,shared,infrastructure}
mkdir -p backend/services/{auth,profile,matching,chat,narrative,social,premium,gamification,tracking,notification,translation}
```

### Étape 2: Génération Code via Claude Code Task Tool

**Pour CHAQUE service, spawner agent spécialisé:**

```javascript
// Exemple: Auth Service
Task("Backend Developer - Auth", `
  Build Authentication Service for МойDate dating app:

  REQUIREMENTS:
  - Node.js 20 LTS + Express 4.18 + TypeScript 5.3
  - BetterAuth framework for OAuth
  - VK OAuth (PRIORITY for Russian market)
  - Phone OTP (SMS)
  - Google, Apple, Instagram OAuth
  - JWT token management
  - Redis session management
  - PostgreSQL user storage

  ENDPOINTS:
  - POST /auth/phone/send-otp
  - POST /auth/phone/verify
  - GET /auth/oauth/vk
  - GET /auth/oauth/vk/callback
  - POST /auth/refresh
  - POST /auth/logout

  DELIVERABLES:
  - Complete TypeScript implementation
  - .env.example with all required variables
  - Docker Compose config
  - Unit tests (Jest)
  - API documentation (OpenAPI/Swagger)

  Follow best practices: clean architecture, error handling, logging, validation.
`, "backend-dev");

// Spawner TOUS les services en parallèle
Task("Backend - Profile", "...", "backend-dev");
Task("Backend - Matching", "...", "backend-dev");
Task("Backend - Chat", "...", "backend-dev");
// ... etc
```

### Étape 3: Testing via Sandboxes E2B

**Créer sandbox pour chaque service:**
```javascript
// Exemple: Test Auth Service
await mcp__flow-nexus__sandbox_create({
  template: "node",
  name: "moydate-auth-test",
  env_vars: {
    DATABASE_URL: process.env.SUPABASE_URL,
    REDIS_URL: "redis://localhost:6379",
    VK_CLIENT_ID: process.env.VK_ID,
    JWT_SECRET: "test-secret"
  },
  install_packages: [
    "express", "better-auth", "jsonwebtoken",
    "ioredis", "pg", "@types/node", "typescript"
  ],
  startup_script: "npm run build && npm test"
});
```

**Coût estimé testing:**
- 11 services × 2h testing = 22h
- ~5 credits/h = **110 credits total**
- **Tu as 602 credits disponibles** ✅

### Étape 4: Intégration & Deployment

**API Gateway (optionnel):**
```javascript
Task("DevOps Engineer", `
  Setup API Gateway for МойDate microservices:
  - Nginx reverse proxy
  - Rate limiting
  - Load balancing
  - SSL/TLS termination
  - Request routing to 11 services
`, "cicd-engineer");
```

**Docker Compose:**
```yaml
# backend/docker-compose.yml
services:
  auth:
    build: ./services/auth
    ports: ["3001:3000"]
    env_file: .env

  profile:
    build: ./services/profile
    ports: ["3002:3000"]

  matching:
    build: ./services/matching
    ports: ["3003:3000"]

  # ... 8 autres services

  postgres:
    image: postgres:16

  redis:
    image: redis:7

  rabbitmq:
    image: rabbitmq:3-management
```

---

## 💰 COÛTS ESTIMÉS

### Phase 1 (Gratuit + Credits existants)

| Tâche | Outil | Coût |
|-------|-------|------|
| Génération code (11 services) | Hive Mind Local | **0 credits** ✅ |
| Testing sandboxes (22h) | E2B Sandboxes | **110 credits** |
| Documentation | Hive Mind Local | **0 credits** |
| CI/CD setup | Hive Mind Local | **0 credits** |

**TOTAL Phase 1:** 110 credits (sur 602 disponibles) ✅

### Phase 2 (Avec rUv restaurés - Optionnel)

| Tâche | Outil | Coût |
|-------|-------|------|
| ML Matching model | Neural Training | **100 credits** |
| Cloud swarms optimization | Swarms Cloud | **50 rUv** |
| Performance tuning | Advanced templates | **30 rUv** |

**TOTAL Phase 2:** 100 credits + 80 rUv (après fix bug)

---

## 📊 TIMELINE

**Semaine 1-2: Core Services (P0)**
- Auth Service ✅
- Profile Service ✅
- Matching Service ✅
- Chat Service ✅
- Narrative Service ✅
- Premium Service ✅

**Semaine 3: Secondary Services (P1)**
- Social Feed Service ✅
- Gamification Service ✅
- Tracking Service ✅
- Notification Service ✅

**Semaine 4: Integration & Testing**
- API Gateway ✅
- Docker Compose ✅
- Integration tests ✅
- Documentation ✅

**TOTAL: 4 semaines** pour backend complet!

---

## 🎯 PROCHAINES ÉTAPES IMMÉDIATES

1. ✅ Email envoyé au support Flow Nexus
2. 📁 Créer structure backend/
3. 🤖 Spawner agents via Claude Code Task tool
4. 🧪 Tester dans sandboxes E2B
5. 📦 Docker Compose pour déploiement local
6. 🚀 Déploiement cloud (Selectel/Yandex)

---

**Prêt à commencer la génération?** 🚀
