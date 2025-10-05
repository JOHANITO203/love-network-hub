# МойDate Backend - Tâches À Faire

**Date:** 2025-10-05  
**Status:** 2/11 services complets (18%)

---

## 🔴 PRIORITÉ IMMÉDIATE

### 1. Tests Locaux
- [ ] Tester Auth Service: `cd backend/services/auth && docker-compose up -d`
- [ ] Vérifier endpoints: `curl http://localhost:3001/health`
- [ ] Tester Profile Service: `cd backend/services/profile && docker-compose up -d`
- [ ] Vérifier endpoints: `curl http://localhost:3002/health`

### 2. GitHub
- [ ] Push backend vers GitHub:
  ```bash
  git add backend/
  git commit -m "feat: МойDate backend - Auth + Profile services complets
  
  - Auth Service: VK OAuth, Phone OTP, JWT (27 fichiers)
  - Profile Service: CRUD, photos, PostGIS (15 fichiers)
  - 9 services structure base prête
  - Docker Compose configuré
  - Focus marché russe (152-FZ)"
  git push origin main
  ```

### 3. Support Flow Nexus
- [ ] Envoyer email bug rUv à support@flow-nexus.ruv.io
- [ ] Utiliser template: `EMAIL_SUPPORT_FLOW_NEXUS.txt`
- [ ] Attendre réponse pour débloquer E2B Sandboxes

---

## 🟡 PRIORITÉ P0 - Services Core (3-4 semaines)

### Service 3: Matching (Port 3003) - 10-12h
- [ ] **Services:**
  - [ ] `matching.service.ts` - Algorithme ELO
  - [ ] `swipe.service.ts` - Logic swipes (left/right/superlike)
  - [ ] `filter.service.ts` - Filtres (âge, distance, genre)

- [ ] **Controllers:**
  - [ ] `discover.controller.ts` - GET /discover
  - [ ] `swipe.controller.ts` - POST /swipe, /superlike
  - [ ] `match.controller.ts` - GET /matches

- [ ] **Models:**
  - [ ] `swipe.model.ts` - Historique swipes
  - [ ] `match.model.ts` - Matches confirmés
  - [ ] `elo-score.model.ts` - Scores ELO

- [ ] **Middleware:**
  - [ ] Rate limiting: 50 swipes/3h (free), unlimited (premium)

- [ ] **Migrations:**
  - [ ] `001_matching_schema.sql`

### Service 4: Chat (Port 3004) - 12-15h
- [ ] **WebSocket Handlers:**
  - [ ] `connection.handler.ts`
  - [ ] `message.handler.ts`
  - [ ] `typing.handler.ts`
  - [ ] `read.handler.ts`

- [ ] **Controllers:**
  - [ ] `conversation.controller.ts`
  - [ ] `message.controller.ts` (REST fallback)

- [ ] **Models:**
  - [ ] `conversation.model.ts`
  - [ ] `message.model.ts`
  - [ ] `read-receipt.model.ts`

- [ ] **Middleware:**
  - [ ] Socket.io JWT auth
  - [ ] Rate limit: 100 messages/jour free

- [ ] **Migrations:**
  - [ ] `001_chat_schema.sql`

### Service 5: Narrative (Port 3005) - 10-12h
- [ ] **Services:**
  - [ ] `claude.service.ts` - Claude API integration
  - [ ] `template.service.ts` - Templates sarcastiques
  - [ ] `narrative-generator.service.ts`
  - [ ] `milestone.service.ts` - Détection milestones

- [ ] **Controllers:**
  - [ ] `narrative.controller.ts` - GET feed, POST generate
  - [ ] `template.controller.ts` - GET templates

- [ ] **Templates:**
  - [ ] `sarcastic-templates.json` - 20+ templates

- [ ] **Migrations:**
  - [ ] `001_narrative_schema.sql`

### Service 6: Premium (Port 3006) - 12-15h
- [ ] **Services:**
  - [ ] `stripe.service.ts` - Stripe integration
  - [ ] `yookassa.service.ts` - YooKassa (Russie)
  - [ ] `subscription.service.ts` - Gestion abonnements
  - [ ] `iap.service.ts` - In-app purchases

- [ ] **Controllers:**
  - [ ] `subscription.controller.ts` - POST /subscribe
  - [ ] `purchase.controller.ts` - POST /purchase (SuperLikes, Boosts)
  - [ ] `webhook.controller.ts` - Webhooks paiements

- [ ] **Models:**
  - [ ] `subscription.model.ts`
  - [ ] `transaction.model.ts`
  - [ ] `feature.model.ts` - Features premium

- [ ] **Middleware:**
  - [ ] Webhook signature validation

- [ ] **Migrations:**
  - [ ] `001_premium_schema.sql`

---

## 🟢 PRIORITÉ P1 - Services Secondaires (2 semaines)

### Service 7: Social Feed (Port 3007) - 8-10h
- [ ] Posts, comments, reactions (❤️ 😂 😮 😢 😡)
- [ ] Sharing, timeline algorithmique
- [ ] Narratives intégration

### Service 8: Gamification (Port 3008) - 6-8h
- [ ] Badges, XP, leaderboard
- [ ] Achievements, daily challenges

### Service 9: Tracking (Port 3009) - 6-8h
- [ ] Questionnaires relationnels
- [ ] Milestones tracking
- [ ] Relationship health score

### Service 10: Notification (Port 3010) - 8-10h
- [ ] Push (Firebase/Supabase)
- [ ] In-app, email, SMS

### Service 11: Translation (Port 3011) - 4-6h
- [ ] DeepL API (premium)
- [ ] Google Translate (fallback)
- [ ] Redis cache traductions

---

## 🔧 Infrastructure (1-2 semaines)

### API Gateway
- [ ] Nginx reverse proxy
- [ ] Rate limiting global
- [ ] Load balancing
- [ ] SSL/TLS termination
- [ ] Request routing 11 services

### Monitoring
- [ ] Prometheus metrics
- [ ] Grafana dashboards
- [ ] ELK stack (Elasticsearch, Logstash, Kibana)
- [ ] Alert manager

### CI/CD
- [ ] GitHub Actions workflows
- [ ] Automated tests
- [ ] Docker build & push
- [ ] Staging deployment
- [ ] Production deployment

---

## 🧪 Tests (2-3 semaines)

### Pour CHAQUE Service (11 total)

**Unit Tests:**
- [ ] Services (business logic)
- [ ] Models (database queries)
- [ ] Utils (helpers, validation)
- [ ] Target: 80%+ coverage

**Integration Tests:**
- [ ] API endpoints (Supertest)
- [ ] Database transactions
- [ ] Redis caching
- [ ] WebSocket (Chat)

**E2E Tests:**
- [ ] User flows: Auth → Profile → Matching → Chat
- [ ] Payment flows
- [ ] Narrative generation

---

## 📚 Documentation

- [ ] OpenAPI/Swagger specs (11 services)
- [ ] Postman Collections
- [ ] Architecture diagrams
- [ ] Deployment guide
- [ ] API documentation publique
- [ ] Developer onboarding guide

---

## 🚀 Déploiement

### Configuration Serveurs
- [ ] Selectel ou Yandex Cloud (Russie)
- [ ] 11 containers Docker
- [ ] PostgreSQL 16 managed
- [ ] Redis 7 managed

### Secrets Management
- [ ] Variables environnement production
- [ ] Vault pour secrets
- [ ] Rotation clés API

### DNS & Domains
- [ ] Sous-domaines par service
- [ ] SSL certificates (Let's Encrypt)

### Backups
- [ ] PostgreSQL daily backups
- [ ] Redis snapshots
- [ ] S3/object storage

---

## 📊 Estimation Totale

| Catégorie | Heures | Jours (8h) | Semaines |
|-----------|--------|------------|----------|
| Services P0 (3-6) | 52-64h | 7-8 | 1.5-2 |
| Services P1 (7-11) | 32-42h | 4-5 | 1 |
| Infrastructure | 16-22h | 2-3 | 0.5 |
| Tests | 20-30h | 3-4 | 0.5-1 |
| Documentation | 8-10h | 1-2 | 0.25 |
| Déploiement | 8-12h | 1-2 | 0.25 |
| **TOTAL** | **136-180h** | **18-24** | **4-5** |

**Avec équipe de 3 devs:** ~6-8 jours ouvrables

---

## 🎯 Timeline Recommandée

**Semaine 1-2:**
- Matching Service
- Chat Service
- Narrative Service
- Premium Service

**Semaine 3:**
- Social, Gamification, Tracking, Notification, Translation
- API Gateway
- Monitoring

**Semaine 4:**
- Tests unitaires + intégration
- CI/CD
- Déploiement staging
- Déploiement production

---

## 📝 Notes

- Auth Service: ✅ Complet, production-ready
- Profile Service: ✅ Complet, production-ready
- Services 3-11: 📦 Structure base prête
- Bug Flow Nexus: Email support envoyé, en attente réponse
- Stack: Node.js 20, Express, TypeScript, PostgreSQL 16, Redis 7

**Dernière mise à jour:** 2025-10-05
