# МойDate - Plan d'Évolution du Projet
**Version:** 1.0.0
**Date:** 2025-10-04
**Objectif:** Roadmap complète de 0 à internationalisation + conversion mobile

---

## 📊 PHASE 1: MVP 500 USERS (Russie) - 12 Semaines

### 🎯 Objectif
Lancer une version fonctionnelle de МойDate avec les features essentielles pour valider le concept auprès de 500 early adopters en Russie.

### 📅 Timeline

#### **Semaine 1-2: Auth Service + Infrastructure**
**Développeurs backend: 2 devs**
**Tâches:**
- [ ] Setup Selectel VPS (4 vCPU, 8GB RAM)
- [ ] Docker Compose production configuré
- [ ] PostgreSQL 16 + Redis 7 + RabbitMQ 3.12 installés
- [ ] Nginx configuré comme API Gateway
- [ ] SSL Let's Encrypt configuré
- [ ] Auth Service implémenté (VK OAuth prioritaire)
- [ ] SMS OTP (SMSINT.ru) fonctionnel
- [ ] JWT token generation/validation
- [ ] Tests unitaires Auth Service (>80% coverage)

**Frontend:**
- [ ] Intégration auth backend
- [ ] Login VK fonctionnel
- [ ] Login téléphone + OTP fonctionnel

**Livrable:** Users peuvent créer compte et se connecter

---

#### **Semaine 2-3: Profile Service**
**Développeurs backend: 2 devs**
**Tâches:**
- [ ] Profile Service implémenté
- [ ] Upload photos vers Selectel S3 (Sharp resize)
- [ ] Géolocalisation temps réel (PostGIS)
- [ ] Préférences matching CRUD
- [ ] Events RabbitMQ (`profile.created`, `photo.uploaded`)
- [ ] Tests unitaires Profile Service (>80% coverage)

**Frontend:**
- [ ] Intégration profile backend
- [ ] Onboarding flow complet connecté au backend
- [ ] Upload photos fonctionnel
- [ ] Géolocalisation activée

**Livrable:** Users peuvent compléter leur profil

---

#### **Semaine 3-4: Matching Service**
**Développeurs backend: 2 devs**
**Tâches:**
- [ ] Matching Service implémenté
- [ ] Algorithme ELO + distance GPS
- [ ] Swipe left/right/superlike
- [ ] Détection matchs mutuels
- [ ] Rate limiting (50 profils/3h) avec Redis
- [ ] Cache Redis pour profils pré-calculés (TTL 15min)
- [ ] Events RabbitMQ (`match.created`, `swipe.made`)
- [ ] Tests unitaires (>80% coverage)
- [ ] Tests intégration algorithme matching

**Frontend:**
- [ ] Intégration matching backend
- [ ] Discover screen fonctionnel
- [ ] Swipe animations connectées
- [ ] Match modal connecté au backend

**Livrable:** Users peuvent swiper et matcher

---

#### **Semaine 4-5: Messaging Service (Temps Réel)**
**Développeurs backend: 2 devs**
**Tâches:**
- [ ] Messaging Service implémenté
- [ ] Socket.io configuré avec Redis adapter
- [ ] WebSocket authentication (JWT)
- [ ] Messages texte temps réel
- [ ] Upload photos/voice notes vers S3
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Online/offline status
- [ ] Rate limiting (100 messages/jour free)
- [ ] Events RabbitMQ (`message.sent`)
- [ ] Tests e2e WebSocket

**Frontend:**
- [ ] Socket.io client configuré
- [ ] Chat interface connectée
- [ ] Messages temps réel fonctionnels
- [ ] Upload media dans chat
- [ ] Typing indicators

**Livrable:** Users peuvent chatter en temps réel

---

#### **Semaine 5-6: Narrative Service ⭐ (CORE DIFFERENTIATOR)**
**Développeurs backend: 3 devs (PRIORITÉ MAXIMALE)**
**Tâches:**
- [ ] Narrative Service implémenté
- [ ] 20+ scénarios détectés et codés:
  - PICKY_SWIPER
  - INSTANT_MATCH
  - SLOW_MATCH
  - GHOSTING
  - DOUBLE_TEXT
  - FIRST_MESSAGE_FAIL
  - NO_BIO_SWIPER
  - SERIAL_SUPERLIKE
  - LATE_NIGHT_SWIPER
  - WEEKEND_WARRIOR
  - FIRST_MATCH
  - MATCH_STREAK
  - LONG_DISTANCE_LOVER
  - PHOTO_CHANGE
  - BIO_POET
  - PREMIUM_UPGRADE
  - FIRST_DATE_PLANNED
  - ... (+3 scénarios bonus)
- [ ] Templates JSON pour chaque scénario (3-5 variants chacun)
- [ ] Personnalisation avec variables (userName, swipesCount, etc.)
- [ ] Event consumers (match, swipe, message, profile)
- [ ] Tests scénarios (chaque scénario doit avoir tests)
- [ ] Tests génération narratives
- [ ] Tuning ton (sarcastique, romantique, ironique)

**Frontend:**
- [ ] Social Feed connecté
- [ ] Narratives affichées dans feed
- [ ] Réactions (❤️ 😂 😮 😢 😡) fonctionnelles
- [ ] Commentaires sur narratives

**Livrable:** Narratives automatiques générées et affichées

**🎯 Ceci est la feature #1 qui nous différencie! Investir le temps nécessaire ici.**

---

#### **Semaine 6-7: Social Feed Service + Notification Service**
**Développeurs backend: 2 devs**

**Social Feed Service:**
- [ ] CRUD posts utilisateurs
- [ ] Commentaires
- [ ] Réactions (❤️ 😂 😮 😢 😡)
- [ ] Partages
- [ ] Feed algorithm (narratives + user posts mélangés)
- [ ] Upload photos/vidéos posts
- [ ] Modération contenu basique
- [ ] Tests unitaires

**Notification Service:**
- [ ] Firebase Cloud Messaging configuré
- [ ] Push notifications (new_match, new_message, new_like, new_narrative)
- [ ] In-app notifications
- [ ] Préférences notifications
- [ ] Badge counts
- [ ] Event consumers (tous events)
- [ ] Tests push notifications

**Frontend:**
- [ ] Social Feed affiche user posts + narratives
- [ ] Create post fonctionnel
- [ ] Notifications push reçues
- [ ] Centre notifications fonctionnel
- [ ] Badge counts sur navigation

**Livrable:** Social Feed complet + Notifications fonctionnelles

---

#### **Semaine 7-8: Premium Service + Paiements**
**Développeurs backend: 2 devs**
**Tâches:**
- [ ] Premium Service implémenté
- [ ] Intégration MirPay (PRIORITAIRE)
- [ ] Intégration SberPay
- [ ] Intégration Tinkoff
- [ ] Intégration YooMoney
- [ ] Webhooks paiements sécurisés
- [ ] Abonnements (1 semaine, 1 mois, 3 mois, 6 mois)
- [ ] Achats in-app (Boosts, SuperLikes)
- [ ] Vérification statut Premium
- [ ] Auto-renewal abonnements
- [ ] Tests paiements (mode sandbox)
- [ ] Events RabbitMQ (`subscription.created`)

**Frontend:**
- [ ] Écrans Premium connectés
- [ ] Checkout MirPay fonctionnel
- [ ] Checkout autres moyens paiement
- [ ] Achat Boosts fonctionnel
- [ ] Achat SuperLikes fonctionnel
- [ ] Badge Premium affiché
- [ ] Features Premium activées (unlimited swipes, see who liked, etc.)

**Livrable:** Système monétisation fonctionnel

---

#### **Semaine 9-10: Features Secondaires (Tracker, Gamification, Translation)**
**Développeurs backend: 2 devs**

**Tracker Service:**
- [ ] Milestones détection
- [ ] Questionnaires compatibilité
- [ ] Analyse compatibilité couple
- [ ] Tests

**Gamification Service:**
- [ ] Système XP
- [ ] Badges (20+ badges)
- [ ] Leaderboards (Redis sorted sets)
- [ ] Niveaux utilisateur
- [ ] Event consumers (XP awards)
- [ ] Tests

**Translation Service:**
- [ ] DeepL API (Premium)
- [ ] Google Translate (Free)
- [ ] Cache traductions Redis
- [ ] Auto-détection langue
- [ ] Tests

**Frontend:**
- [ ] Milestones tracking UI
- [ ] Questionnaires interface
- [ ] Badges affichés sur profil
- [ ] XP bar animée
- [ ] Leaderboard screen
- [ ] Traduction messages activée

**Livrable:** Features engagement complètes

---

#### **Semaine 10-11: Tests, Optimisation, Bug Fixes**
**Toute l'équipe**
**Tâches:**
- [ ] Tests e2e complets (scénarios utilisateur)
- [ ] Load testing (JMeter/k6) - simuler 500 users concurrents
- [ ] Optimisation queries SQL (EXPLAIN ANALYZE)
- [ ] Optimisation cache Redis
- [ ] Fix bugs critiques
- [ ] Fix bugs non-critiques
- [ ] Security audit basique
- [ ] Performance audit (latence API <200ms)
- [ ] Monitoring Grafana configuré
- [ ] Logs centralisés (Winston)
- [ ] Backups automatiques PostgreSQL
- [ ] Documentation API complète (Swagger)

**Frontend:**
- [ ] Tests e2e Cypress/Playwright
- [ ] Optimisation bundle size
- [ ] Lighthouse score >90
- [ ] Fix UI/UX bugs
- [ ] Accessibilité basique (a11y)

**Livrable:** App stable et performante

---

#### **Semaine 11-12: Beta Testing + Pre-Launch**
**Toute l'équipe**
**Tâches:**

**Beta Testing (50 users):**
- [ ] Recruter 50 beta testers (amis, famille, early adopters)
- [ ] Onboarding beta testers
- [ ] Collecter feedback quotidien
- [ ] Fix bugs reportés
- [ ] Itérer sur UX

**Marketing Pre-Launch:**
- [ ] Page landing moydate.ru (Coming Soon)
- [ ] Instagram МойDate créé
- [ ] VK page МойDate créée
- [ ] Teaser video (30sec)
- [ ] Screenshots app
- [ ] Waitlist email setup

**App Store Submission:**
- [ ] App Store review (iOS) - peut prendre 7-14 jours
- [ ] Google Play review (Android) - 1-3 jours
- [ ] Préparer réponses aux questions reviewers
- [ ] Compliance 152-FZ (données personnelles Russie)

**Monitoring Final:**
- [ ] Grafana dashboards finaux
- [ ] Alertes configurées (Slack/Email)
- [ ] On-call rotation définie
- [ ] Runbooks créés (incidents communs)

**Livrable:** App prête pour le lancement public

---

### 📊 Budget Phase MVP (12 semaines)

**Infrastructure (Selectel):**
```
VPS (4 vCPU, 8GB RAM): 1,200 ₽/mois × 3 mois = 3,600 ₽
S3 Storage (50GB): 150 ₽/mois × 3 mois = 450 ₽
TOTAL Infrastructure: 4,050 ₽
```

**Services Externes:**
```
SMS OTP (SMSINT.ru): 500 ₽/mois × 3 mois = 1,500 ₽
Firebase (push notifications): 0 ₽ (gratuit)
Cloudflare (CDN/DNS): 0 ₽ (gratuit)
Let's Encrypt (SSL): 0 ₽ (gratuit)
DeepL API: 0 ₽ (500k chars/mois gratuit)
TOTAL Services: 1,500 ₽
```

**App Stores:**
```
Apple Developer: 8,250 ₽ (99$/an)
Google Play: 2,080 ₽ (25$ one-time)
TOTAL App Stores: 10,330 ₽
```

**💰 TOTAL BUDGET MVP (12 semaines): ~16,000 ₽ (~160€)**

**Équipe:** 2-3 développeurs backend + 1 développeur frontend

---

### ✅ Critères de Succès MVP

**Technique:**
- [ ] 500 users enregistrés
- [ ] >200 matchs créés
- [ ] >1,000 messages échangés
- [ ] >50 narratives générées
- [ ] Uptime >99% (3 mois)
- [ ] Latence API <200ms (P95)
- [ ] 0 bugs critiques
- [ ] <5 bugs non-critiques/semaine

**Business:**
- [ ] Taux conversion Premium >3%
- [ ] Revenus >30,000 ₽/mois
- [ ] NPS (Net Promoter Score) >50
- [ ] Retention D7 >40%
- [ ] Retention D30 >20%

**Product:**
- [ ] App Store rating >4.5⭐
- [ ] Play Store rating >4.5⭐
- [ ] User feedback narratives positif (>80%)

**🎉 Si ces critères sont atteints: GO pour Phase 2 (Scaling 10k users)**

---

---

## 🚀 PHASE 2: SCALING 10K USERS (Russie) - 16 Semaines

### 🎯 Objectif
Scaler МойDate de 500 à 10,000 utilisateurs actifs en Russie en améliorant l'infrastructure, optimisant les performances et ajoutant des features avancées.

---

### 📅 Timeline

#### **Semaine 1-4: Infrastructure Upgrade + Performance Optimization**

**Objectif:** Préparer l'infrastructure pour 10k users concurrents

**Infrastructure (Selectel):**
- [ ] Upgrade VPS: 4 vCPU 8GB → **8 vCPU 16GB RAM**
- [ ] Setup Load Balancer (HAProxy OU Nginx)
- [ ] Multi-instance deployment (2× backend instances par service critique)
- [ ] PostgreSQL upgrade (vertical scaling):
  - 2GB RAM → **8GB RAM**
  - Connection pooling (PgBouncer)
  - Replication (1 primary + 1 replica read-only)
- [ ] Redis upgrade:
  - 1GB → **4GB RAM**
  - Redis Cluster (3 nodes pour HA)
  - Sentinel pour failover automatique
- [ ] RabbitMQ cluster (3 nodes pour HA)
- [ ] S3 storage upgrade (50GB → **200GB**)

**Optimisation Database:**
- [ ] Audit toutes les queries SQL (EXPLAIN ANALYZE)
- [ ] Créer indexes manquants (colonnes WHERE, JOIN, ORDER BY)
- [ ] Partitioning tables volumineuses (messages, swipes)
  ```sql
  -- Exemple: Partitioning messages par mois
  CREATE TABLE messages_2025_10 PARTITION OF messages
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
  ```
- [ ] Archivage données anciennes (messages >6 mois → cold storage)
- [ ] Vacuum/Analyze automatique PostgreSQL

**Optimisation Cache:**
- [ ] Augmenter TTL cache profils (15min → 30min)
- [ ] Cache algorithme matching (1h)
- [ ] Cache feed (10min)
- [ ] Warm-up cache au démarrage
- [ ] Cache invalidation intelligente (events RabbitMQ)

**Optimisation API:**
- [ ] Compression gzip responses (Express compression)
- [ ] HTTP/2 enabled (Nginx)
- [ ] CDN pour assets statiques (Cloudflare)
- [ ] GraphQL pagination (cursor-based)
- [ ] Batch API calls (reduce round-trips)

**Monitoring Avancé:**
- [ ] Prometheus + Grafana setup complet
  - Dashboards: API performance, DB queries, Redis, RabbitMQ
  - Alertes: latence >500ms, error rate >1%, CPU >80%
- [ ] APM (Application Performance Monitoring): Sentry ou Datadog
- [ ] Logs centralisés: ElasticSearch + Kibana OU Grafana Loki
- [ ] Distributed tracing: Jaeger ou OpenTelemetry
- [ ] Real User Monitoring (RUM) frontend

**Budget Infrastructure Upgrade:**
```
VPS 8 vCPU 16GB RAM: 2,400 ₽/mois
PostgreSQL managed (Supabase Pro): 2,475 ₽/mois (25$)
Redis 4GB: inclus dans VPS
S3 Storage 200GB: 600 ₽/mois
Monitoring (Grafana Cloud): 0 ₽ (free tier)
TOTAL: ~5,500 ₽/mois (vs 1,950 ₽/mois Phase 1)
```

**Livrable:** Infrastructure supporte 10k users avec latence <200ms

---

#### **Semaine 4-8: Features Avancées + Growth Features**

**1. Algorithme Matching v2.0:**
- [ ] Machine Learning pour recommendations:
  - Collaborative filtering (users similaires)
  - Content-based filtering (préférences explicites)
  - Hybrid approach
- [ ] A/B testing framework (quel algo performe mieux)
- [ ] Score attractivité amélioré (ELO v2)
- [ ] Boost profils actifs (logged in <24h)
- [ ] Pénalité profils incomplets

**2. Narrative Engine v2.0:**
- [ ] 10+ nouveaux scénarios:
  - CONVERSATION_CHAMPION (user répond rapidement)
  - EMOJI_KING (user utilise 10+ emojis uniques)
  - WEEKEND_ROMANCE (matchs le weekend uniquement)
  - MORNING_PERSON (swipe avant 9h)
  - NIGHT_OWL (swipe après minuit)
  - SUPERLIKE_COLLECTOR (reçoit 5+ superlikes)
  - MATCH_MASTER (10+ matchs en 1 semaine)
  - PHOTO_UPDATE_STREAK (change photos 3 jours consécutifs)
  - BIO_UPDATER (update bio 3+ fois)
  - LOCATION_TRAVELER (change ville 2+ fois)
- [ ] Narratives personnalisées par genre (homme/femme/autre)
- [ ] Narratives localisées (Moscou vs St-Pétersbourg vs régions)
- [ ] Ton dynamique (ajusté selon réactions users)
- [ ] Narratives collaboratives (2 users dans 1 narrative)

**3. Social Features Avancées:**
- [ ] Stories (Instagram-like) - 24h puis disparaissent
  - Upload photo/video story
  - Reactions sur stories
  - View count
- [ ] Polls dans social feed
- [ ] Questions/réponses
- [ ] Trending hashtags
- [ ] User mentions (@username)
- [ ] Share profil dans feed

**4. Premium Features v2:**
- [ ] **Premium Plus** (nouveau tier):
  - 10 SuperLikes/jour (vs 5 Premium standard)
  - Unlimited Rewind
  - See who viewed your profile
  - Priority customer support (<12h)
  - Exclusive badge (💎)
  - Prix: 3,999 ₽/mois (vs 1,999 ₽ Premium standard)
- [ ] Boost amélioré:
  - Smart Boost (boost aux heures optimales)
  - Boost ciblé (âge, distance spécifique)
- [ ] Filtres Premium avancés:
  - Métier (developer, doctor, teacher, etc.)
  - Éducation (university, high school, etc.)
  - Lifestyle (sport, vegan, smoker, etc.)
  - Politique (liberal, conservative, apolitical)
  - Religion

**5. Sécurité & Trust:**
- [ ] Vérification profil améliorée:
  - Photo verification (liveness detection)
  - Phone number verification obligatoire
  - Social media verification (VK, Instagram)
  - Badge "Vérifié" bleu
- [ ] Reporting & Blocking avancé:
  - Report raisons multiples (spam, fake, harassment)
  - Auto-ban après 3 reports
  - Review team (modération manuelle)
- [ ] Safety Center page:
  - Dating safety tips
  - Block list management
  - Privacy settings
- [ ] End-to-end encryption messages (Signal Protocol)

**Budget Features Avancées:**
```
ML infrastructure (GPU instance): 1,500 ₽/mois
Moderation team (2 personnes × 40h/mois): 80,000 ₽/mois
Photo verification API: 500 ₽/mois
TOTAL: ~82,000 ₽/mois
```

---

#### **Semaine 8-12: Marketing & Growth**

**Objectif:** Acquérir 9,500 nouveaux users (500 → 10,000)

**1. Content Marketing:**
- [ ] Blog МойDate (dating tips, success stories)
- [ ] 50+ articles SEO-optimized
- [ ] YouTube channel (dating advice, app tutorials)
- [ ] TikTok account (funny dating videos)
- [ ] Instagram Reels (narrative highlights, success stories)
- [ ] Podcast interviews (dating coaches, influencers)

**2. Performance Marketing:**
- [ ] Yandex Direct ads:
  - Budget: 100,000 ₽/mois
  - CPA target: <500 ₽/user
  - Keywords: "знакомства", "dating", "app", etc.
- [ ] VK ads:
  - Budget: 50,000 ₽/mois
  - Retargeting visitors
  - Lookalike audiences
- [ ] Instagram/Facebook ads:
  - Budget: 50,000 ₽/mois
  - Story ads, Feed ads
  - Video ads (narratives highlights)

**3. Influencer Marketing:**
- [ ] 10 micro-influencers (10k-50k followers):
  - Instagram influencers
  - YouTube reviewers
  - TikTok creators
- [ ] 2 macro-influencers (100k+ followers):
  - Dating coaches
  - Lifestyle influencers
- Budget: 200,000 ₽ (sponsored posts)

**4. Referral Program:**
- [ ] Invite friends: reward 1 week Premium for both
- [ ] Share narrative: unlock 5 free SuperLikes
- [ ] Viral loops (game mechanics)

**5. PR & Media:**
- [ ] Press release: TechCrunch Russia, VC.ru, Habr
- [ ] Product Hunt launch (English + Russian)
- [ ] App Store featuring (pitch Apple/Google)
- [ ] Dating magazines/websites reviews

**6. Partnerships:**
- [ ] Dating events sponsors (speed dating)
- [ ] Bars/clubs partnerships (exclusive offers)
- [ ] Universities partnerships (student discounts)

**Budget Marketing (3 mois):**
```
Performance ads: 600,000 ₽
Influencers: 200,000 ₽
Content création: 100,000 ₽
PR/Events: 100,000 ₽
TOTAL Marketing: 1,000,000 ₽

CAC (Customer Acquisition Cost): ~105 ₽/user (9,500 users)
LTV/CAC Ratio: >3 (healthy)
```

---

#### **Semaine 12-16: Optimisation Conversions + Revenue Growth**

**Objectif:** Augmenter revenus de 30,000 ₽/mois → **300,000 ₽/mois**

**1. Optimisation Funnel Conversion:**
- [ ] A/B testing systématique:
  - Onboarding flow (7 steps → 5 steps)
  - CTA buttons (couleurs, textes)
  - Premium paywall (timing, design)
  - Pricing page (ordre des plans)
- [ ] Reduce friction:
  - Auto-fill profil from VK
  - Upload photos from VK/Instagram
  - Quick start (skip non-essential steps)
- [ ] Analytics détaillés:
  - Funnel dropoff analysis (Amplitude/Mixpanel)
  - Heatmaps (Hotjar)
  - Session recordings

**Conversions Targets:**
```
Registration → Complete Profile: 70% (+20%)
Complete Profile → First Swipe: 90% (+15%)
First Swipe → First Match: 30% (+10%)
First Match → Premium: 5% (+2%)
```

**2. Revenue Optimization:**

**Premium Subscription Optimization:**
- [ ] Free trial 7 jours (auto-renew):
  - Conversion trial → paid: 40%
  - Reduce churn
- [ ] Annual plan (économie 65%):
  - 1 year: 59,999 ₽ (vs 23,988 ₽ × 12 = 83,964 ₽ au tarif mensuel)
  - Lifetime value max
- [ ] Winback campaigns:
  - Email churned users (-50% offer)
  - Push notifications (new features)

**In-App Purchases Optimization:**
- [ ] Dynamic pricing (selon activité user):
  - Active users: prix standard
  - Inactive users: -20% discount
- [ ] Limited-time offers:
  - Weekend deals (Friday-Sunday)
  - Holiday sales (New Year, Valentine's Day)
- [ ] Bundles:
  - Premium 1 mois + 10 Boosts + 25 SuperLikes: 3,999 ₽ (économie 30%)

**Alternative Revenue Streams:**
- [ ] Ads for free users (non-intrusive):
  - Native ads dans feed (1 ad / 10 posts)
  - Revenue: ~100,000 ₽/mois (10k DAU × 30 ad views × 3.3 ₽ CPM)
- [ ] Virtual gifts (send to matches):
  - Roses, chocolates, drinks, etc.
  - Prix: 99-499 ₽
  - Revenue estimé: +50,000 ₽/mois

**3. Retention Optimization:**
- [ ] Push notifications intelligentes:
  - New match: instant
  - Daily digest (if no login 24h)
  - Re-engagement (7 days inactive)
  - Personalized (based on behavior)
- [ ] Email marketing:
  - Weekly newsletter (dating tips + narratives)
  - Win-back emails (churned users)
  - Premium upgrade nudges
- [ ] In-app engagement loops:
  - Daily login rewards (1 free SuperLike)
  - Streaks (3 days login → unlock badge)
  - Challenges (match with 3 people this week → 1 free Boost)

**Retention Targets:**
```
D1 retention: 50% (vs 40% Phase 1)
D7 retention: 30% (vs 20% Phase 1)
D30 retention: 15% (vs 10% Phase 1)
```

---

### 📊 Projections Phase 2 (10k Users)

**Users:**
- Active users: 10,000
- DAU (Daily Active Users): 3,000 (30%)
- MAU (Monthly Active Users): 8,000 (80%)

**Engagement:**
- Matchs/jour: 500
- Messages/jour: 5,000
- Narratives générées/jour: 200
- Posts social feed/jour: 300

**Revenue:**
```
Premium subscribers (5% × 10,000): 500 users
ARPU Premium: 1,999 ₽/mois (avg)
Revenue subscriptions: 999,500 ₽/mois

In-app purchases:
- Boosts (10% users × 299 ₽): 299,000 ₽/mois
- SuperLikes (15% users × 199 ₽): 298,500 ₽/mois
Revenue IAP: 597,500 ₽/mois

Ads (free users):
Revenue ads: 100,000 ₽/mois

TOTAL REVENUE: ~1,700,000 ₽/mois (~17,000€)
```

**Costs:**
```
Infrastructure: 5,500 ₽/mois
Services externes: 1,500 ₽/mois
Moderation team: 80,000 ₽/mois
Marketing: 300,000 ₽/mois (sustainable)
Salaire équipe (3 devs + 1 PM): 400,000 ₽/mois
TOTAL COSTS: ~790,000 ₽/mois

PROFIT: 1,700,000 - 790,000 = 910,000 ₽/mois (~9,100€)
Margin: 53% 🎉
```

---

### ✅ Critères de Succès Phase 2

**Technique:**
- [ ] 10,000 users actifs
- [ ] Uptime >99.5%
- [ ] Latence API <150ms (P95)
- [ ] Infrastructure auto-scale (load balancer)

**Business:**
- [ ] Revenue >1,500,000 ₽/mois
- [ ] Taux conversion Premium >5%
- [ ] CAC <150 ₽
- [ ] LTV/CAC >3
- [ ] Churn <5%/mois

**Product:**
- [ ] NPS >60
- [ ] D30 retention >15%
- [ ] App Store/Play Store rating >4.7⭐

**🎉 Si ces critères sont atteints: GO pour Phase 3 (Internationalisation)**

---

---

## 🌍 PHASE 3: INTERNATIONALISATION - 24 Semaines

### 🎯 Objectif
Lancer МойDate dans 5+ pays (Ukraine, Kazakhstan, Biélorussie, Pologne, Turquie) et atteindre 50,000 users internationaux.

---

### 📅 Timeline

#### **Semaine 1-8: Préparation Internationalisation**

**1. i18n (Internationalisation) Technique:**
- [ ] i18next configuration avancée
- [ ] Extraction toutes strings en fichiers traduction
- [ ] Traductions professionnelles:
  - Russe (ru) - déjà fait
  - Ukrainien (uk)
  - Kazakh (kk)
  - Polonais (pl)
  - Turc (tr)
  - Anglais (en) - marché international
- [ ] Format dates/heures localisé (moment.js ou day.js)
- [ ] Format currency (₽, ₴, ₸, zł, ₺, $)
- [ ] RTL support (si arabe futur)

**2. Backend Adaptation:**
- [ ] Multi-currency support (Premium Service):
  ```typescript
  export const PRICING_BY_COUNTRY = {
    RU: { currency: 'RUB', plans: { week: 599, month: 1999, ... } },
    UA: { currency: 'UAH', plans: { week: 199, month: 699, ... } },
    KZ: { currency: 'KZT', plans: { week: 2999, month: 9999, ... } },
    PL: { currency: 'PLN', plans: { week: 25, month: 85, ... } },
    TR: { currency: 'TRY', plans: { week: 120, month: 400, ... } },
    US: { currency: 'USD', plans: { week: 6.99, month: 22.99, ... } }
  };
  ```
- [ ] Multi-payment gateways:
  - Ukraine: Portmone, LiqPay
  - Kazakhstan: Kaspi.kz, Halyk Bank
  - Pologne: Przelewy24, BLIK
  - Turquie: Iyzico, PayTR
  - International: Stripe (fallback)
- [ ] Geo-detection IP (MaxMind GeoIP2)
- [ ] Timezone handling (UTC partout, affichage local)
- [ ] Legal compliance:
  - GDPR (Europe)
  - 152-FZ (Russie)
  - KVKK (Turquie)
  - Local laws par pays

**3. Infrastructure Multi-Region:**
- [ ] CDN global (Cloudflare Pro):
  - Edge caching par région
  - DDoS protection
- [ ] Database régional (optional Phase 1 international):
  - Primary DB: Russie (Selectel)
  - Replica read-only: Europe (AWS Frankfurt)
  - Replica read-only: Turkey (AWS Istanbul)
- [ ] S3 multi-region:
  - Photos Europe → AWS S3 EU
  - Photos Turkey → AWS S3 TR
  - Photos Kazakhstan → Yandex Object Storage
- [ ] API Gateway régional (latence optimisée)

**4. Narrative Engine Localisation:**
- [ ] Scénarios adaptés culturellement:
  - Russie: humour sarcastique OK
  - Pologne: plus conservateur
  - Turquie: éviter références alcool
  - Ukraine: similaire Russie
  - Kazakhstan: respecter traditions
- [ ] Templates narratives traduits (pas Google Translate, humain)
- [ ] Ton ajusté par culture
- [ ] Emojis universels (éviter 🍺 en Turquie, etc.)

**5. Marketing Localisation:**
- [ ] Landing pages par pays:
  - moydate.ru (Russie)
  - moydate.ua (Ukraine)
  - moydate.kz (Kazakhstan)
  - moydate.pl (Pologne)
  - moydate.com.tr (Turquie)
  - moydate.com (International)
- [ ] App Store localisation:
  - Screenshots localisés
  - Descriptions traduites
  - Keywords locaux
- [ ] Social media par pays:
  - Instagram global
  - VK (Russie/Ukraine/Kazakhstan)
  - Facebook (Pologne/Turquie)
  - Local influencers par pays

**Budget Internationalisation Prep:**
```
Traductions professionnelles (5 langues): 50,000 ₽
Infrastructure multi-region: +100,000 ₽/mois
Payment gateways setup: 20,000 ₽
Legal compliance: 80,000 ₽
TOTAL: 250,000 ₽ one-time + 100,000 ₽/mois recurring
```

---

#### **Semaine 8-16: Lancement Ukraine, Kazakhstan, Biélorussie**

**Priorité:** Pays russophones (marché naturel)

**Ukraine:**
- Population: 40M (15M urbains actifs)
- Dating market: mature
- Concurrents: Tinder, Badoo, Mamba
- Différenciateur: Narratives en ukrainien (local touch)

**Kazakhstan:**
- Population: 19M (10M urbains actifs)
- Dating market: en croissance
- Concurrents: Tinder, Badoo, local apps
- Différenciateur: Narratives bilingues (kazakh + russe)

**Biélorussie:**
- Population: 9M (5M urbains actifs)
- Dating market: petit mais engagé
- Concurrents: Tinder, Badoo
- Différenciateur: Narratives russes (95% parlent russe)

**Stratégie Lancement:**
1. Soft launch (beta 500 users par pays)
2. Collect feedback, iterate
3. Public launch (paid ads + influencers)
4. Monitor metrics, optimize

**Marketing Budget (3 pays × 3 mois):**
```
Performance ads: 300,000 ₽ (100k par pays)
Influencers: 150,000 ₽ (50k par pays)
PR: 50,000 ₽
TOTAL: 500,000 ₽

Target: 15,000 users (5k par pays)
CAC: ~33 ₽/user (très bon)
```

---

#### **Semaine 16-24: Lancement Pologne, Turquie + Autres**

**Pologne:**
- Population: 38M (20M urbains actifs)
- Dating market: très mature (EU)
- Concurrents: Tinder, Bumble, Badoo
- Différenciateur: Narratives humoristiques (polonais aime humour)

**Turquie:**
- Population: 85M (50M urbains actifs)
- Dating market: croissance rapide (jeune population)
- Concurrents: Tinder, Badoo, local apps (Sevimli, etc.)
- Différenciateur: Narratives respectueuses culture locale

**Autres marchés potentiels (soft launch):**
- Lettonie, Lituanie, Estonie (pays baltes)
- Géorgie, Arménie (Caucase)
- Roumanie, Bulgarie (Europe Est)

**Marketing Budget (2 pays principaux × 3 mois):**
```
Performance ads: 600,000 ₽ (300k par pays)
Influencers: 300,000 ₽ (150k par pays)
Content localisé: 100,000 ₽
PR: 100,000 ₽
TOTAL: 1,100,000 ₽

Target: 35,000 users (Pologne 20k, Turquie 15k)
CAC: ~31 ₽/user
```

---

### 📊 Projections Phase 3 (50k Users International)

**Répartition Users:**
- Russie: 20,000 (40%)
- Ukraine: 8,000 (16%)
- Kazakhstan: 5,000 (10%)
- Pologne: 10,000 (20%)
- Turquie: 5,000 (10%)
- Autres: 2,000 (4%)
**TOTAL: 50,000 users**

**Revenue:**
```
Russie (20k × 5% Premium × 1,999 ₽): 1,999,000 ₽/mois
Ukraine (8k × 4% Premium × 699 UAH ≈ 583 ₽): 186,560 ₽/mois
Kazakhstan (5k × 4% Premium × 9,999 KZT ≈ 1,750 ₽): 350,000 ₽/mois
Pologne (10k × 6% Premium × 85 PLN ≈ 1,870 ₽): 1,122,000 ₽/mois
Turquie (5k × 3% Premium × 400 TRY ≈ 660 ₽): 99,000 ₽/mois

Subscriptions: ~3,750,000 ₽/mois
In-App Purchases: ~1,500,000 ₽/mois
Ads: ~300,000 ₽/mois

TOTAL REVENUE: ~5,550,000 ₽/mois (~55,500€)
```

**Costs:**
```
Infrastructure: 200,000 ₽/mois (multi-region)
Services: 50,000 ₽/mois
Moderation (5 personnes): 200,000 ₽/mois
Marketing: 500,000 ₽/mois
Équipe (8 personnes): 800,000 ₽/mois
Legal/compliance: 50,000 ₽/mois
TOTAL COSTS: ~1,800,000 ₽/mois

PROFIT: 5,550,000 - 1,800,000 = 3,750,000 ₽/mois (~37,500€)
Margin: 67% 🎉🎉
```

---

### ✅ Critères de Succès Phase 3

**Technique:**
- [ ] 50,000 users actifs (multi-pays)
- [ ] Latence API <200ms (toutes régions)
- [ ] Uptime >99.9%
- [ ] Support 6+ langues

**Business:**
- [ ] Revenue >5,000,000 ₽/mois
- [ ] Présence dans 5+ pays
- [ ] CAC <100 ₽ (tous pays)
- [ ] LTV/CAC >4

**Product:**
- [ ] NPS >65 (tous pays)
- [ ] App Store rating >4.8⭐ (tous pays)
- [ ] D30 retention >20%

**🎉 Si ces critères sont atteints: Entreprise profitable et scalable!**

---

---

## 📱 PHASE 4: CONVERSION MOBILE (React Native)

### 🎯 Objectif
Convertir l'application web React en application mobile native React Native pour iOS et Android, optimisée pour l'expérience mobile.

**Pourquoi React Native?**
- ✅ 1 codebase pour iOS + Android (vs 2 codebases Swift + Kotlin)
- ✅ Réutilisation logic business frontend existant (70-80%)
- ✅ Performance proche du natif
- ✅ Hot reload (dev rapide)
- ✅ Large communauté + libs
- ✅ Équipe frontend React peut contribuer

---

### 📅 Timeline

#### **Semaine 1-2: Setup & Architecture**

**1. Environnement React Native:**
- [ ] Init projet React Native:
  ```bash
  npx react-native init МойDateMobile --template react-native-template-typescript
  ```
- [ ] Setup Expo (optional, mais recommandé pour rapid prototyping):
  ```bash
  npx create-expo-app МойDateMobile --template
  ```
- [ ] Configuration TypeScript
- [ ] ESLint + Prettier (same rules as web)
- [ ] Git repository (moydate-mobile)

**2. Navigation Setup:**
- [ ] React Navigation v6:
  ```bash
  npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
  ```
- [ ] Stack Navigator (onboarding, auth, profile setup)
- [ ] Bottom Tab Navigator (discover, matches, messages, social, profile)
- [ ] Deep linking configuration

**3. State Management:**
- [ ] Zustand OU Redux Toolkit (same as web)
- [ ] Persist state (AsyncStorage)
- [ ] API client (Axios avec interceptors)

**4. UI Framework:**
- [ ] React Native Paper OU NativeBase
- [ ] Custom components (Button, Input, Card, etc.)
- [ ] Theme provider (light/dark mode)
- [ ] Design system tokens (colors, spacing, typography)

---

#### **Semaine 3-6: Core Features Implementation**

**1. Authentication:**
- [ ] Phone number input (react-native-phone-number-input)
- [ ] OTP verification screen
- [ ] OAuth VK (react-native-vkontakte-login)
- [ ] OAuth Google (react-native-google-signin)
- [ ] OAuth Apple (react-native-apple-authentication)
- [ ] Token storage (react-native-keychain)
- [ ] Biometric auth (Face ID, Touch ID)

**2. Onboarding:**
- [ ] Intro slides (react-native-app-intro-slider)
- [ ] Birthday picker (react-native-date-picker)
- [ ] Gender selector
- [ ] Photo upload (react-native-image-picker):
  ```typescript
  import ImagePicker from 'react-native-image-picker';

  const selectPhoto = () => {
    ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200
    }, (response) => {
      if (response.assets) {
        uploadPhoto(response.assets[0]);
      }
    });
  };
  ```
- [ ] Location permission (react-native-geolocation-service)
- [ ] Notification permission (react-native-firebase)
- [ ] Preferences setup

**3. Discover/Swipe:**
- [ ] Swipe cards (react-native-deck-swiper):
  ```typescript
  import Swiper from 'react-native-deck-swiper';

  <Swiper
    cards={profiles}
    renderCard={(profile) => <ProfileCard profile={profile} />}
    onSwipedLeft={(index) => handleSwipe(profiles[index].id, 'left')}
    onSwipedRight={(index) => handleSwipe(profiles[index].id, 'right')}
    onSwipedTop={(index) => handleSuperLike(profiles[index].id)}
    backgroundColor="transparent"
    stackSize={3}
    stackSeparation={15}
    animateCardOpacity
  />
  ```
- [ ] Profile card avec photo carousel
- [ ] Action buttons (❌ ⭐ ❤️)
- [ ] Filters bottom sheet
- [ ] Match modal (Lottie animations)

**4. Messaging:**
- [ ] Socket.io client:
  ```typescript
  import io from 'socket.io-client';

  const socket = io('https://api.moydate.ru', {
    auth: { token: accessToken },
    transports: ['websocket']
  });

  socket.on('message:new', (message) => {
    addMessageToConversation(message);
    showNotification(message);
  });
  ```
- [ ] Chat UI (react-native-gifted-chat):
  ```typescript
  import { GiftedChat } from 'react-native-gifted-chat';

  <GiftedChat
    messages={messages}
    onSend={(newMessages) => sendMessage(newMessages[0])}
    user={{ _id: currentUserId }}
    renderBubble={renderBubble}
    renderInputToolbar={renderInputToolbar}
  />
  ```
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Image sharing (react-native-image-picker)
- [ ] Voice messages (react-native-audio-recorder-player)

**5. Social Feed:**
- [ ] Infinite scroll (FlatList avec pagination)
- [ ] Post card (narratives + user posts)
- [ ] Reactions (animated buttons)
- [ ] Comments
- [ ] Share functionality

**6. Profile:**
- [ ] Profile view
- [ ] Edit profile
- [ ] Photo gallery (react-native-image-viewing)
- [ ] Settings
- [ ] Badges & XP display
- [ ] Premium card

---

#### **Semaine 7-10: Platform-Specific Features**

**1. iOS Specific:**
- [ ] Haptic feedback (react-native-haptic-feedback)
- [ ] App Clips (lightweight version)
- [ ] Widgets (Today extension)
- [ ] Siri Shortcuts
- [ ] Push notifications (APNs)
- [ ] In-App Purchases (react-native-iap):
  ```typescript
  import * as RNIap from 'react-native-iap';

  const purchasePremium = async (productId) => {
    try {
      await RNIap.requestPurchase(productId);
      // Handle purchase success
    } catch (err) {
      // Handle error
    }
  };
  ```

**2. Android Specific:**
- [ ] Material Design components
- [ ] Android App Bundles (.aab)
- [ ] Push notifications (FCM)
- [ ] In-App Billing (react-native-iap)
- [ ] Widgets (Home screen)
- [ ] Share sheet

**3. Permissions:**
- [ ] Camera (react-native-permissions)
- [ ] Location (background location tracking)
- [ ] Notifications
- [ ] Contacts (optional)
- [ ] Microphone (voice messages)

**4. Offline Support:**
- [ ] AsyncStorage pour cache
- [ ] Offline queue (messages to send)
- [ ] Sync when back online
- [ ] Network state detection

**5. Performance:**
- [ ] Image optimization (react-native-fast-image)
- [ ] Lazy loading
- [ ] Memoization (React.memo, useMemo)
- [ ] FlatList optimization (getItemLayout)
- [ ] Hermes JavaScript engine (faster startup)

---

#### **Semaine 11-12: Testing & Polish**

**1. Tests:**
- [ ] Unit tests (Jest)
- [ ] Component tests (React Native Testing Library)
- [ ] E2E tests (Detox):
  ```typescript
  describe('Login flow', () => {
    it('should login successfully', async () => {
      await element(by.id('phone-input')).typeText('+79991234567');
      await element(by.id('send-otp-button')).tap();
      await element(by.id('otp-input')).typeText('123456');
      await element(by.id('verify-button')).tap();
      await expect(element(by.id('discover-screen'))).toBeVisible();
    });
  });
  ```
- [ ] Performance tests (Flashlight)

**2. Animations:**
- [ ] Lottie animations (react-native-lottie)
- [ ] Reanimated 2 (smooth 60fps animations)
- [ ] Gesture Handler (swipe gestures)

**3. Accessibility:**
- [ ] Screen reader support (VoiceOver, TalkBack)
- [ ] High contrast mode
- [ ] Font scaling
- [ ] Accessibility labels

**4. Polish:**
- [ ] Splash screen (react-native-splash-screen)
- [ ] App icon (all sizes)
- [ ] Launch screens (iOS, Android)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states

---

#### **Semaine 13-14: Beta Testing & Deployment**

**1. Beta Testing:**
- [ ] TestFlight (iOS) - 50 beta testers
- [ ] Google Play Internal Testing (Android) - 50 testers
- [ ] Collect feedback via Firebase Crashlytics
- [ ] Fix critical bugs
- [ ] Iterate UX

**2. App Store Submission:**

**iOS (App Store):**
- [ ] Screenshots (all device sizes)
- [ ] App Preview video
- [ ] Descriptions (6 langues)
- [ ] Privacy policy URL
- [ ] Age rating (17+)
- [ ] App Review submission
- [ ] Wait 3-7 days review

**Android (Google Play):**
- [ ] Screenshots (all device sizes)
- [ ] Promo video (YouTube)
- [ ] Descriptions (6 langues)
- [ ] Privacy policy URL
- [ ] Content rating (Mature 17+)
- [ ] App Bundle (.aab) upload
- [ ] Wait 1-3 days review

**3. Monitoring Post-Launch:**
- [ ] Firebase Crashlytics (crash reporting)
- [ ] Firebase Analytics (user behavior)
- [ ] Sentry (error tracking)
- [ ] App Store Connect Analytics
- [ ] Google Play Console Analytics

---

### 📦 React Native Tech Stack

**Core:**
```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "react-navigation": "^6.0.0",
    "zustand": "^4.4.0",
    "axios": "^1.5.0",
    "socket.io-client": "^4.6.0",
    "react-native-paper": "^5.10.0",
    "react-native-vector-icons": "^10.0.0",
    "react-native-reanimated": "^3.5.0",
    "react-native-gesture-handler": "^2.13.0",
    "react-native-safe-area-context": "^4.7.0",
    "react-native-screens": "^3.25.0"
  }
}
```

**Features:**
```json
{
  "dependencies": {
    "react-native-image-picker": "^5.6.0",
    "react-native-permissions": "^3.9.0",
    "react-native-geolocation-service": "^5.3.0",
    "react-native-firebase": "^18.4.0",
    "react-native-keychain": "^8.1.0",
    "react-native-iap": "^12.10.0",
    "react-native-deck-swiper": "^2.0.0",
    "react-native-gifted-chat": "^2.4.0",
    "react-native-fast-image": "^8.6.0",
    "react-native-lottie": "^6.3.0",
    "react-native-haptic-feedback": "^2.2.0",
    "@react-native-community/netinfo": "^9.4.0"
  }
}
```

---

### 💰 Budget React Native Conversion

**Développement (12-14 semaines):**
```
2 développeurs React Native (seniors): 600,000 ₽
1 designer mobile (UI/UX): 200,000 ₽
1 QA tester: 150,000 ₽
TOTAL Équipe: 950,000 ₽
```

**Services:**
```
Apple Developer Program: 8,250 ₽/an (99$)
Google Play Developer: 2,080 ₽ one-time (25$)
Firebase (Crashlytics, Analytics): 0 ₽ (free tier)
TestFlight + Beta testing: 0 ₽ (inclus Apple)
TOTAL Services: ~10,500 ₽
```

**TOTAL BUDGET MOBILE: ~1,000,000 ₽ (~10,000€)**

---

### 📊 Timeline & Priorités

**Ordre d'implémentation recommandé:**

1. **Semaine 1-2:** Setup + Auth (login fonctionne)
2. **Semaine 3-4:** Onboarding + Profile setup
3. **Semaine 5-6:** Discover/Swipe (feature #1 prioritaire)
4. **Semaine 7-8:** Messaging (feature #2 prioritaire)
5. **Semaine 9:** Social Feed + Narratives
6. **Semaine 10:** Premium + In-App Purchases
7. **Semaine 11-12:** Polish + Tests
8. **Semaine 13-14:** Beta + App Store submission

---

### 🎯 Avantages Mobile vs Web

**Pourquoi mobile est ESSENTIEL pour dating app:**

1. **Notifications Push:** 10× plus engageant que web
2. **Location tracking:** Géolocalisation temps réel en background
3. **Camera intégrée:** Upload photos instantané
4. **Offline support:** App fonctionne sans internet (partiellement)
5. **Home screen icon:** Visibilité permanente
6. **Gestures natives:** Swipe feels natural (touch screen)
7. **Biometric auth:** Face ID/Touch ID (frictionless login)
8. **App Store presence:** Discoverability (ASO)
9. **Performance:** 60fps animations smooth
10. **User behavior:** 95% des users dating apps utilisent mobile

**Statistiques Dating Apps:**
- **Mobile traffic:** 98% (vs 2% web)
- **Engagement mobile:** 5× supérieur au web
- **Time in app:** 30min/jour (mobile) vs 5min/jour (web)
- **Conversion rate:** 2× meilleur sur mobile

**💡 Conclusion: Mobile n'est pas optionnel, c'est OBLIGATOIRE pour une dating app!**

---

### ✅ Critères de Succès Mobile

**Technique:**
- [ ] App iOS + Android publiées sur stores
- [ ] Performance 60fps (Reanimated 2)
- [ ] Crash rate <0.5% (Crashlytics)
- [ ] App size <50MB (download)
- [ ] Startup time <2s (cold start)

**Business:**
- [ ] 80% des users sur mobile (vs 20% web)
- [ ] App Store rating >4.7⭐
- [ ] Play Store rating >4.7⭐
- [ ] Downloads >100k (3 mois post-launch)
- [ ] DAU/MAU >50% (engagement)

**Product:**
- [ ] NPS >70 (mobile users)
- [ ] D1 retention >60%
- [ ] D7 retention >40%
- [ ] D30 retention >25%

---

**🎉 Avec l'app mobile, МойDate est complète et prête à dominer le marché dating en Russie et au-delà!**

---

## 📝 Résumé des 4 Phases

| Phase | Durée | Users Target | Revenue Target | Budget | Équipe |
|-------|-------|--------------|----------------|--------|---------|
| **Phase 1: MVP** | 12 semaines | 500 (Russie) | 30,000 ₽/mois | 16,000 ₽ | 2-3 backend + 1 frontend |
| **Phase 2: Scaling** | 16 semaines | 10,000 (Russie) | 1,700,000 ₽/mois | 3,000,000 ₽ | 3 backend + 1 frontend + 1 PM |
| **Phase 3: International** | 24 semaines | 50,000 (multi-pays) | 5,550,000 ₽/mois | 4,000,000 ₽ | 5 backend + 2 frontend + 1 PM |
| **Phase 4: Mobile** | 14 semaines | - (même users) | +30% revenue | 1,000,000 ₽ | 2 RN + 1 designer + 1 QA |

**🎯 Timeline Total: ~66 semaines (16 mois) de MVP à app mobile internationale**

**💰 Revenue Final Estimé: ~7,000,000 ₽/mois (~70,000€/mois)**

**🚀 Profitable dès Phase 2 (Semaine 28), puis hyper-croissance Phase 3-4!**

---

**Bonne chance pour bâtir le nouveau Tinder russe! 🇷🇺❤️**
