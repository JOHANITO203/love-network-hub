# Architecture Backend Microservices - МойDate (Version Révisée)
**Version:** 2.0.0 (Mise à jour majeure)
**Date:** 2025-10-04
**Statut:** Architecture Phase 1 avec priorités marché russe

---

## 🚨 CHANGEMENTS MAJEURS vs V1

### ✅ Ajouts Critiques Phase 1
1. **Narratives Algorithmiques** → ⬆️ PRIORITÉ P0 (cœur du produit)
2. **Tracking Relationnel** → ⬆️ PRIORITÉ P0
3. **Gamification** → ⬆️ PRIORITÉ P0
4. **Traduction** → ⬆️ PRIORITÉ P1 (DeepL + fallback Google)
5. **OAuth Russe** → VK prioritaire (marché principal)
6. **Paiements Russes** → Mir, Sberbank, Tinkoff, YooMoney prioritaires
7. **Rate Limiting** → 50 profils / 3h (4x mieux que prévu)

---

## 📋 Table des Matières

1. [Architecture Globale Révisée](#1-architecture-globale-révisée)
2. [Tableau Priorisation FINAL](#2-tableau-priorisation-final)
3. [Service #1: Auth Service (BetterAuth)](#3-service-1-auth-service-betterauth)
4. [Service #2: Profile Service](#4-service-2-profile-service)
5. [Service #3: Matching Service](#5-service-3-matching-service)
6. [Service #4: Messaging Service](#6-service-4-messaging-service)
7. [Service #5: Narrative Engine Service ⭐](#7-service-5-narrative-engine-service-)
8. [Service #6: Relationship Tracker Service](#8-service-6-relationship-tracker-service)
9. [Service #7: Gamification Service](#9-service-7-gamification-service)
10. [Service #8: Social Feed Service](#10-service-8-social-feed-service)
11. [Service #9: Notification Service (Supabase vs Firebase)](#11-service-9-notification-service-supabase-vs-firebase)
12. [Service #10: Premium & Payment Service](#12-service-10-premium--payment-service)
13. [Service #11: Translation Service](#13-service-11-translation-service)
14. [Stack Technique Complète](#14-stack-technique-complète)
15. [Infrastructure & Déploiement](#15-infrastructure--déploiement)

---

## 1. Architecture Globale Révisée

### 1.1 Vue d'ensemble 11 Microservices

```
┌──────────────────────────────────────────────────────┐
│              CLIENT (React PWA + Mobile)              │
│    FR, EN, RU, PT (i18n) + Traduction auto           │
└──────────────────────┬───────────────────────────────┘
                       │
              ┌────────▼────────┐
              │  API GATEWAY    │ (Kong + Rate Limiter)
              │  + Auth Proxy   │
              └────────┬────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
┌───▼────┐   ┌────────▼────────┐   ┌────▼──────┐
│ Auth   │   │   Profile       │   │ Matching  │
│BetterAuth│  │   Service       │   │  Service  │
└───┬────┘   └────────┬────────┘   └────┬──────┘
    │                 │                  │
┌───▼────┐   ┌────────▼────────┐   ┌────▼──────┐
│Message │   │  NARRATIVE      │   │ Tracking  │
│Service │   │  ENGINE ⭐      │   │Relationship│
└───┬────┘   └────────┬────────┘   └────┬──────┘
    │                 │                  │
┌───▼────┐   ┌────────▼────────┐   ┌────▼──────┐
│Social  │   │ Gamification    │   │Translation│
│Feed    │   │   Service       │   │DeepL/Goog │
└───┬────┘   └────────┬────────┘   └────┬──────┘
    │                 │                  │
    └─────────────────┼──────────────────┘
                      │
         ┌────────────▼────────────┐
         │ Notification Service    │
         │ (Supabase Realtime)     │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   Premium & Payment     │
         │ Mir, Sber, Tinkoff, Yoo │
         └─────────────────────────┘

         ┌─────────────────────────┐
         │   MESSAGE BROKER        │
         │   RabbitMQ + Redis      │
         └─────────────────────────┘
```

---

## 2. Tableau Priorisation FINAL

### 2.1 Phase 1 - MVP Core (6-8 mois) 🎯

| # | Service | Fonctionnalité | Priorité | Complexité | Temps | Notes |
|---|---------|---------------|----------|-----------|-------|-------|
| **AUTHENTIFICATION (BetterAuth)** |
| 1.1 | Auth | Configuration BetterAuth | 🔴 P0 | Faible | 1j | Framework intégré |
| 1.2 | Auth | OAuth VK (prioritaire marché RU) | 🔴 P0 | Moyenne | 3j | VK ID API |
| 1.3 | Auth | OAuth Google | 🔴 P0 | Faible | 1j | BetterAuth plugin |
| 1.4 | Auth | OAuth Apple | 🟡 P1 | Moyenne | 2j | Sign in with Apple |
| 1.5 | Auth | OAuth Instagram | 🟡 P1 | Moyenne | 2j | Meta OAuth |
| 1.6 | Auth | Sessions Redis + JWT | 🔴 P0 | Faible | 1j | BetterAuth auto |
| **PROFILS** |
| 2.1 | Profile | CRUD profils basiques | 🔴 P0 | Moyenne | 3j | |
| 2.2 | Profile | Upload 6 photos (S3/Cloudinary) | 🔴 P0 | Moyenne | 3j | Compression auto |
| 2.3 | Profile | Géolocalisation temps réel | 🔴 P0 | Moyenne | 2j | GPS + ville |
| 2.4 | Profile | Préférences matching | 🔴 P0 | Faible | 2j | |
| **MATCHING** |
| 3.1 | Matching | Algorithme scoring basique | 🔴 P0 | Élevée | 5j | Distance + âge |
| 3.2 | Matching | Biais interculturel 55% | 🔴 P0 | Moyenne | 3j | Boost cultures différentes |
| 3.3 | Matching | Compatibilité astrologique | 🟡 P1 | Faible | 2j | Signes zodiaque |
| 3.4 | Matching | Swipe (like/pass/superlike) | 🔴 P0 | Moyenne | 3j | |
| 3.5 | Matching | Détection match mutuel | 🔴 P0 | Moyenne | 2j | |
| 3.6 | Matching | Rate limiting: 50 profils/3h | 🔴 P0 | Moyenne | 2j | 400 profils/24h max |
| **MESSAGERIE TEMPS RÉEL** |
| 4.1 | Messages | WebSocket (Socket.io) | 🔴 P0 | Élevée | 5j | Clustering Redis |
| 4.2 | Messages | Messages texte | 🔴 P0 | Moyenne | 3j | |
| 4.3 | Messages | Emojis Unicode | 🔴 P0 | Faible | 1j | Support natif |
| 4.4 | Messages | Envoi photos/vidéos | 🔴 P0 | Moyenne | 4j | Compression FFmpeg |
| 4.5 | Messages | Messages vocaux | 🔴 P0 | Élevée | 5j | Enregistrement audio |
| 4.6 | Messages | Stickers & mèmes | 🟡 P1 | Moyenne | 3j | Bibliothèque 100+ |
| 4.7 | Messages | Indicateur "typing..." | 🟡 P1 | Faible | 1j | |
| 4.8 | Messages | Statut lu/non lu | 🟡 P1 | Faible | 2j | |
| 4.9 | Messages | Traduction auto (DeepL) | 🟡 P1 | Moyenne | 4j | Fallback Google |
| **NARRATIVES ALGORITHMIQUES ⭐ CŒUR DU PRODUIT** |
| 5.1 | Narrative | Event Listener (swipes, messages) | 🔴 P0 | Élevée | 6j | RabbitMQ events |
| 5.2 | Narrative | Analyseur comportemental | 🔴 P0 | Très élevée | 10j | Pattern matching |
| 5.3 | Narrative | Templates narratives (110+) | 🔴 P0 | Élevée | 8j | JSON templates |
| 5.4 | Narrative | Générateur texte sarcastique | 🔴 P0 | Très élevée | 12j | NLP + règles |
| 5.5 | Narrative | Calibrateur de ton | 🔴 P0 | Élevée | 5j | Sarcastique/Drôle/Sage |
| 5.6 | Narrative | Feed temps réel narratives | 🔴 P0 | Moyenne | 4j | WebSocket publish |
| 5.7 | Narrative | Détection scénarios clés | 🔴 P0 | Élevée | 7j | 20+ scénarios |
| **TRACKING RELATIONNEL** |
| 6.1 | Tracking | Questionnaires progressifs (J1, J7, J30) | 🔴 P0 | Élevée | 6j | 3 questionnaires |
| 6.2 | Tracking | Score progression couple | 🔴 P0 | Moyenne | 4j | Algorithme scoring |
| 6.3 | Tracking | Milestones (1er msg, 1 semaine, etc.) | 🔴 P0 | Moyenne | 3j | 15+ milestones |
| 6.4 | Tracking | Graphiques évolution | 🟡 P1 | Moyenne | 3j | Charts.js |
| 6.5 | Tracking | Conseils personnalisés | 🟡 P1 | Élevée | 5j | Basé sur réponses |
| **GAMIFICATION** |
| 7.1 | Game | Système badges (50+) | 🔴 P0 | Moyenne | 5j | Achievements |
| 7.2 | Game | Leaderboard global/hebdo | 🔴 P0 | Moyenne | 4j | Redis sorted sets |
| 7.3 | Game | Points d'expérience (XP) | 🔴 P0 | Faible | 2j | Actions → XP |
| 7.4 | Game | Niveaux utilisateurs (1-50) | 🔴 P0 | Faible | 2j | XP → Level |
| 7.5 | Game | Récompenses quotidiennes | 🟡 P1 | Moyenne | 3j | Daily login bonus |
| 7.6 | Game | Défis hebdomadaires | 🟡 P1 | Moyenne | 4j | 10+ challenges |
| **SOCIAL FEED** |
| 8.1 | Social | Timeline posts utilisateurs | 🟡 P1 | Moyenne | 4j | |
| 8.2 | Social | Création posts (texte + photos) | 🟡 P1 | Moyenne | 3j | |
| 8.3 | Social | Réactions (❤️ 😂 😮 😢 😡) | 🟡 P1 | Faible | 2j | |
| 8.4 | Social | Commentaires | 🟡 P1 | Moyenne | 3j | |
| 8.5 | Social | Partage posts interne | 🟢 P2 | Faible | 2j | |
| 8.6 | Social | Partage externe (Instagram, VK) | 🟢 P2 | Moyenne | 4j | Avec consentement |
| **NOTIFICATIONS** |
| 9.1 | Notif | Push notifications (Supabase) | 🔴 P0 | Moyenne | 3j | Realtime subscriptions |
| 9.2 | Notif | Notifications in-app | 🔴 P0 | Faible | 2j | |
| 9.3 | Notif | Email (nouveaux matchs) | 🟡 P1 | Faible | 2j | SendGrid |
| 9.4 | Notif | Préférences notifications | 🟡 P1 | Faible | 1j | |
| **PREMIUM & PAIEMENTS** |
| 10.1 | Premium | Système Free/Premium | 🔴 P0 | Moyenne | 3j | |
| 10.2 | Premium | Paiement MirPay (priorité RU) | 🔴 P0 | Élevée | 5j | API Mir |
| 10.3 | Premium | Paiement SberPay | 🔴 P0 | Élevée | 5j | Sberbank API |
| 10.4 | Premium | Paiement Tinkoff | 🔴 P0 | Moyenne | 4j | Tinkoff Acquiring |
| 10.5 | Premium | Paiement YooMoney | 🔴 P0 | Moyenne | 4j | YooKassa |
| 10.6 | Premium | Apple Pay | 🟡 P1 | Moyenne | 3j | PassKit |
| 10.7 | Premium | Google Pay | 🟡 P1 | Moyenne | 3j | |
| 10.8 | Premium | Stripe (international) | 🟡 P1 | Moyenne | 3j | Backup paiements |
| 10.9 | Premium | Webhooks paiements | 🔴 P0 | Moyenne | 3j | Gestion callbacks |
| **TRADUCTION** |
| 11.1 | Translation | Intégration DeepL API | 🟡 P1 | Moyenne | 3j | Premium users |
| 11.2 | Translation | Fallback Google Translate | 🟡 P1 | Faible | 2j | Free users |
| 11.3 | Translation | Détection langue auto | 🟡 P1 | Faible | 2j | langdetect |
| 11.4 | Translation | Cache traductions | 🟡 P1 | Faible | 1j | Redis |

**Total Phase 1:** ~180-220 jours (6-8 mois avec équipe 2-3 devs)

**Légende:**
- 🔴 **P0** = Critique (MVP Blocker)
- 🟡 **P1** = Important (MVP souhaitable)
- 🟢 **P2** = Nice to have (Post-MVP)

---

## 3. Service #1: Auth Service (BetterAuth)

### 3.1 Pourquoi BetterAuth?

**Avantages:**
- ✅ Framework tout-en-un (OAuth + JWT + Sessions)
- ✅ Support natif VK, Google, Apple, Instagram
- ✅ Gestion sessions Redis intégrée
- ✅ Sécurité OWASP par défaut
- ✅ TypeScript native
- ✅ Moins de code à maintenir

### 3.2 Configuration BetterAuth

```typescript
// services/auth/src/config/betterauth.config.ts
import { BetterAuth } from 'better-auth';
import { redisAdapter } from 'better-auth/adapters/redis';
import { postgresAdapter } from 'better-auth/adapters/postgres';

export const auth = new BetterAuth({
  database: postgresAdapter({
    connectionString: process.env.DATABASE_URL
  }),

  session: {
    adapter: redisAdapter({
      client: redisClient,
      prefix: 'moydate:session:'
    }),
    expiresIn: 7 * 24 * 60 * 60, // 7 jours
    updateAge: 24 * 60 * 60 // Renouvellement quotidien
  },

  providers: [
    // 🔴 PRIORITÉ 1: VK (marché russe)
    {
      type: 'oauth',
      provider: 'vk',
      clientId: process.env.VK_CLIENT_ID,
      clientSecret: process.env.VK_CLIENT_SECRET,
      scope: 'email,photos',
      callbackURL: '/api/auth/callback/vk'
    },

    // 🔴 PRIORITÉ 2: Google
    {
      type: 'oauth',
      provider: 'google',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: 'email profile',
      callbackURL: '/api/auth/callback/google'
    },

    // 🟡 Apple
    {
      type: 'oauth',
      provider: 'apple',
      clientId: process.env.APPLE_CLIENT_ID,
      teamId: process.env.APPLE_TEAM_ID,
      keyId: process.env.APPLE_KEY_ID,
      privateKey: process.env.APPLE_PRIVATE_KEY,
      callbackURL: '/api/auth/callback/apple'
    },

    // 🟡 Instagram
    {
      type: 'oauth',
      provider: 'instagram',
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      scope: 'user_profile,user_media',
      callbackURL: '/api/auth/callback/instagram'
    }
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Créer profil МойDate après OAuth
      await createMoydateProfile(user, profile);
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.tier = user.tier; // free/premium
      }
      return token;
    }
  },

  security: {
    csrf: true,
    rateLimit: {
      max: 5, // 5 tentatives
      windowMs: 15 * 60 * 1000 // 15 minutes
    }
  }
});
```

### 3.3 Endpoints Auth

```typescript
// services/auth/src/routes/auth.routes.ts

// OAuth flows (BetterAuth auto-gère)
GET  /api/auth/signin/vk         → Redirect vers VK OAuth
GET  /api/auth/signin/google     → Redirect vers Google
GET  /api/auth/signin/apple      → Redirect vers Apple
GET  /api/auth/signin/instagram  → Redirect vers Instagram

// Callbacks (BetterAuth auto-gère)
GET  /api/auth/callback/vk
GET  /api/auth/callback/google
GET  /api/auth/callback/apple
GET  /api/auth/callback/instagram

// Session management
POST /api/auth/signout           → Déconnexion
POST /api/auth/refresh           → Renouveler token
GET  /api/auth/session           → Récupérer session actuelle

// Email/Password (backup)
POST /api/auth/register          → Inscription classique
POST /api/auth/login             → Connexion email/mdp
POST /api/auth/reset-password    → Réinitialisation MDP
```

### 3.4 Base de Données Auth

```sql
-- BetterAuth génère automatiquement ces tables

TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

TABLE accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50), -- 'oauth'
  provider VARCHAR(50), -- 'vk', 'google', 'apple', 'instagram'
  provider_account_id VARCHAR(255),
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(50),
  scope TEXT,
  UNIQUE(provider, provider_account_id)
)

TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL,
  session_token VARCHAR(500) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)

TABLE verification_tokens (
  identifier VARCHAR(255),
  token VARCHAR(500) UNIQUE,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
)
```

---

## 4. Service #2: Profile Service

*(Identique à V1, pas de changements majeurs)*

---

## 5. Service #3: Matching Service

### 5.1 Rate Limiting: 50 profils / 3h

```typescript
// services/matching/src/middleware/rateLimiter.ts

import { RateLimiterRedis } from 'rate-limiter-flexible';

const swipeRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'swipe_limit',
  points: 50, // 50 profils
  duration: 3 * 60 * 60, // 3 heures (10800 secondes)
  blockDuration: 3 * 60 * 60, // Bloquer 3h si dépassé
});

export const checkSwipeLimit = async (req, res, next) => {
  const userId = req.user.id;
  const userTier = req.user.tier;

  // Premium = illimité
  if (userTier === 'premium') {
    return next();
  }

  try {
    await swipeRateLimiter.consume(userId, 1);

    // Récupérer profils restants
    const rateLimiterRes = await swipeRateLimiter.get(userId);
    const remaining = 50 - rateLimiterRes.consumedPoints;

    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext));

    next();
  } catch (rejRes) {
    // Limite atteinte
    const resetTime = new Date(Date.now() + rejRes.msBeforeNext);

    return res.status(429).json({
      error: 'SWIPE_LIMIT_EXCEEDED',
      message: 'Vous avez atteint votre limite de 50 profils pour 3h',
      resetAt: resetTime,
      upgradeUrl: '/premium',
      remainingTime: Math.ceil(rejRes.msBeforeNext / 1000 / 60) + ' minutes'
    });
  }
};

// Route discovery
router.get('/discover',
  authenticateJWT,
  checkSwipeLimit, // ← Middleware rate limit
  async (req, res) => {
    const profiles = await getDiscoveryProfiles(req.user.id, 20);
    res.json({ profiles });
  }
);
```

**Calcul capacité quotidienne Free:**
- 24h = 8 périodes de 3h
- 50 profils × 8 = **400 profils/jour maximum** (vs 20 initialement prévu)
- Très généreux pour tester l'app !

---

## 6. Service #4: Messaging Service

*(Identique à V1 + ajout traduction, voir section 13)*

---

## 7. Service #5: Narrative Engine Service ⭐

### 7.1 Responsabilité

**LE CŒUR DU PRODUIT** - Génération narratives algorithmiques sarcastiques/drôles/romantiques

### 7.2 Architecture Narrative Engine

```
┌────────────────────────────────────────────────────┐
│              EVENT LISTENERS                        │
│  (RabbitMQ Subscribe)                              │
│  - user.swiped                                     │
│  - match.created                                   │
│  - message.sent                                    │
│  - profile.updated                                 │
│  - relationship.milestone                          │
└─────────────────┬──────────────────────────────────┘
                  │
        ┌─────────▼─────────┐
        │  BEHAVIOR ANALYZER │
        │  (Pattern Matching)│
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │ SCENARIO DETECTOR  │
        │ (20+ scénarios)    │
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │ TEMPLATE SELECTOR  │
        │ (110+ templates)   │
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │  TEXT GENERATOR    │
        │ (Variable injection)│
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │  TONE CALIBRATOR   │
        │ (Sarcastique/Drôle)│
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │  PUBLISH NARRATIVE │
        │  (Feed + WebSocket)│
        └───────────────────┘
```

### 7.3 Scénarios Détectés (20+ exemples)

```typescript
// services/narrative/src/scenarios/scenarios.ts

export const SCENARIOS = {
  // 1. Swipe behaviors
  PICKY_SWIPER: {
    trigger: 'user passé 50 profils sans like',
    template: 'templates/picky_swiper.json',
    tone: 'sarcastique'
  },

  GENEROUS_SWIPER: {
    trigger: 'user liké 90% des profils',
    template: 'templates/generous_swiper.json',
    tone: 'drôle'
  },

  SUPERLIKE_SPAMMER: {
    trigger: 'user utilisé 3 superlikes en 1h',
    template: 'templates/superlike_spammer.json',
    tone: 'sarcastique'
  },

  // 2. Matching patterns
  MUTUAL_MATCH_INSTANT: {
    trigger: 'match créé en <1min après like',
    template: 'templates/instant_match.json',
    tone: 'romantique'
  },

  LATE_NIGHT_MATCH: {
    trigger: 'match créé entre 23h-4h',
    template: 'templates/late_night_match.json',
    tone: 'drôle'
  },

  SAME_ZODIAC_MATCH: {
    trigger: 'match avec même signe astrologique',
    template: 'templates/zodiac_match.json',
    tone: 'romantique'
  },

  // 3. Messaging behaviors
  SLOW_RESPONDER: {
    trigger: 'réponse après >24h',
    template: 'templates/slow_responder.json',
    tone: 'sarcastique'
  },

  DOUBLE_TEXTER: {
    trigger: '3+ messages consécutifs sans réponse',
    template: 'templates/double_texter.json',
    tone: 'sage'
  },

  EMOJI_OVERLOAD: {
    trigger: 'message avec 10+ emojis',
    template: 'templates/emoji_overload.json',
    tone: 'drôle'
  },

  VOICE_MESSAGE_FIRST: {
    trigger: 'premier message est un vocal',
    template: 'templates/voice_first.json',
    tone: 'drôle'
  },

  // 4. Profile updates
  PHOTO_PERFECTIONIST: {
    trigger: 'changé photo principale 5x en 1 semaine',
    template: 'templates/photo_perfectionist.json',
    tone: 'sarcastique'
  },

  BIO_NOVELIST: {
    trigger: 'bio >500 caractères',
    template: 'templates/bio_novelist.json',
    tone: 'drôle'
  },

  // 5. Relationship milestones
  FIRST_MESSAGE_MILESTONE: {
    trigger: 'premier message dans conversation',
    template: 'templates/first_message.json',
    tone: 'romantique'
  },

  ONE_WEEK_CHATTING: {
    trigger: '7 jours de conversation active',
    template: 'templates/one_week.json',
    tone: 'romantique'
  },

  HUNDRED_MESSAGES: {
    trigger: '100ème message dans conversation',
    template: 'templates/hundred_messages.json',
    tone: 'romantique'
  },

  // 6. Intercultural connections
  DIFFERENT_CULTURES: {
    trigger: 'match entre 2 pays différents',
    template: 'templates/intercultural.json',
    tone: 'bienveillant'
  },

  // 7. Time-based
  WEEKEND_WARRIOR: {
    trigger: 'actif uniquement samedi/dimanche',
    template: 'templates/weekend_warrior.json',
    tone: 'drôle'
  },

  // ... 10+ autres scénarios
};
```

### 7.4 Templates Narratives (Exemples)

```json
// services/narrative/src/data/templates/picky_swiper.json
{
  "id": "picky_swiper",
  "scenario": "PICKY_SWIPER",
  "tone": "sarcastique",
  "variants": [
    {
      "text_fr": "{{userName}} vient de passer 50 profils sans un seul like. On cherche la perfection ou on attend Brad Pitt ? 😏",
      "text_en": "{{userName}} just passed 50 profiles without a single like. Looking for perfection or waiting for Brad Pitt? 😏",
      "text_ru": "{{userName}} только что пропустил 50 профилей без единого лайка. Ищем идеал или ждём Брэда Питта? 😏",
      "text_pt": "{{userName}} acabou de passar por 50 perfis sem um único like. Procurando perfeição ou esperando Brad Pitt? 😏"
    },
    {
      "text_fr": "Breaking News : {{userName}} a découvert que personne n'est assez bien. Stay tuned! 📰",
      "text_en": "Breaking News: {{userName}} discovered that nobody is good enough. Stay tuned! 📰",
      "text_ru": "Срочная новость: {{userName}} выяснил, что никто не достаточно хорош. Следите за новостями! 📰",
      "text_pt": "Notícia de última hora: {{userName}} descobriu que ninguém é bom o suficiente. Fique ligado! 📰"
    }
  ],
  "metadata": {
    "category": "swipe_behavior",
    "visibility": "public",
    "reactions_enabled": true
  }
}
```

```json
// services/narrative/src/data/templates/instant_match.json
{
  "id": "instant_match",
  "scenario": "MUTUAL_MATCH_INSTANT",
  "tone": "romantique",
  "variants": [
    {
      "text_fr": "⚡ COUP DE FOUDRE DÉTECTÉ ! {{user1}} et {{user2}} se sont likés en moins d'une minute. L'algorithme sent les papillons d'ici ! 🦋💕",
      "text_en": "⚡ LOVE AT FIRST SWIPE DETECTED! {{user1}} and {{user2}} liked each other in less than a minute. The algorithm can feel the butterflies from here! 🦋💕",
      "text_ru": "⚡ ОБНАРУЖЕНА ЛЮБОВЬ С ПЕРВОГО СВАЙПА! {{user1}} и {{user2}} лайкнули друг друга менее чем за минуту. Алгоритм чувствует бабочек! 🦋💕",
      "text_pt": "⚡ AMOR À PRIMEIRA DESLIZADA DETECTADO! {{user1}} e {{user2}} curtiram um ao outro em menos de um minuto. O algoritmo sente as borboletas! 🦋💕"
    }
  ]
}
```

### 7.5 Event Listeners (RabbitMQ)

```typescript
// services/narrative/src/listeners/eventListener.ts

import amqp from 'amqplib';
import { analyzeAndGenerateNarrative } from './narrativeGenerator';

const EXCHANGES = {
  SWIPE: 'moydate.swipe',
  MATCH: 'moydate.match',
  MESSAGE: 'moydate.message',
  PROFILE: 'moydate.profile'
};

export async function startEventListeners() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  // Écouter les swipes
  await channel.assertExchange(EXCHANGES.SWIPE, 'fanout');
  const { queue: swipeQueue } = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(swipeQueue, EXCHANGES.SWIPE, '');

  channel.consume(swipeQueue, async (msg) => {
    const event = JSON.parse(msg.content.toString());
    // { userId, targetId, action: 'like'|'pass'|'superlike', timestamp }

    await analyzeSwipeBehavior(event);
    channel.ack(msg);
  });

  // Écouter les matchs
  await channel.assertExchange(EXCHANGES.MATCH, 'fanout');
  const { queue: matchQueue } = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(matchQueue, EXCHANGES.MATCH, '');

  channel.consume(matchQueue, async (msg) => {
    const event = JSON.parse(msg.content.toString());
    // { matchId, user1Id, user2Id, timestamp }

    await analyzeMatchPattern(event);
    channel.ack(msg);
  });

  // Écouter les messages
  await channel.assertExchange(EXCHANGES.MESSAGE, 'fanout');
  const { queue: msgQueue } = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(msgQueue, EXCHANGES.MESSAGE, '');

  channel.consume(msgQueue, async (msg) => {
    const event = JSON.parse(msg.content.toString());
    // { messageId, senderId, conversationId, type, content, timestamp }

    await analyzeMessagingBehavior(event);
    channel.ack(msg);
  });

  console.log('📡 Narrative Engine listening to events...');
}
```

### 7.6 Behavior Analyzer

```typescript
// services/narrative/src/analyzer/behaviorAnalyzer.ts

export async function analyzeSwipeBehavior(event) {
  const { userId, action } = event;

  // Récupérer historique swipes dernières 24h
  const recentSwipes = await getRecentSwipes(userId, 24 * 60 * 60 * 1000);

  const stats = {
    totalSwipes: recentSwipes.length,
    likes: recentSwipes.filter(s => s.action === 'like').length,
    passes: recentSwipes.filter(s => s.action === 'pass').length,
    superlikes: recentSwipes.filter(s => s.action === 'superlike').length,
    likeRate: 0
  };

  stats.likeRate = stats.totalSwipes > 0
    ? (stats.likes / stats.totalSwipes) * 100
    : 0;

  // Détecter scénarios

  // Scénario: Picky Swiper
  if (stats.totalSwipes >= 50 && stats.likes === 0) {
    await generateNarrative('PICKY_SWIPER', { userId, stats });
  }

  // Scénario: Generous Swiper
  if (stats.likeRate >= 90 && stats.totalSwipes >= 20) {
    await generateNarrative('GENEROUS_SWIPER', { userId, stats });
  }

  // Scénario: Superlike Spammer
  const recentSuperlikes = recentSwipes.filter(s =>
    s.action === 'superlike' &&
    Date.now() - s.timestamp < 60 * 60 * 1000 // dernière heure
  );

  if (recentSuperlikes.length >= 3) {
    await generateNarrative('SUPERLIKE_SPAMMER', { userId, stats });
  }
}

export async function analyzeMatchPattern(event) {
  const { matchId, user1Id, user2Id, timestamp } = event;

  // Récupérer derniers swipes
  const user1LastSwipe = await getLastSwipe(user1Id, user2Id);
  const user2LastSwipe = await getLastSwipe(user2Id, user1Id);

  // Scénario: Instant Match (< 1 min entre les 2 likes)
  const timeDiff = Math.abs(user1LastSwipe.timestamp - user2LastSwipe.timestamp);
  if (timeDiff < 60 * 1000) {
    await generateNarrative('MUTUAL_MATCH_INSTANT', {
      user1: await getUser(user1Id),
      user2: await getUser(user2Id),
      timeDiff
    });
  }

  // Scénario: Late Night Match (23h-4h)
  const hour = new Date(timestamp).getHours();
  if (hour >= 23 || hour <= 4) {
    await generateNarrative('LATE_NIGHT_MATCH', {
      user1: await getUser(user1Id),
      user2: await getUser(user2Id),
      hour
    });
  }

  // Scénario: Zodiac Match
  const user1Profile = await getProfile(user1Id);
  const user2Profile = await getProfile(user2Id);

  if (user1Profile.zodiacSign === user2Profile.zodiacSign) {
    await generateNarrative('SAME_ZODIAC_MATCH', {
      user1: user1Profile,
      user2: user2Profile,
      zodiac: user1Profile.zodiacSign
    });
  }
}
```

### 7.7 Narrative Generator

```typescript
// services/narrative/src/generator/narrativeGenerator.ts

import templates from '../data/templates';

export async function generateNarrative(scenarioKey, data) {
  const scenario = SCENARIOS[scenarioKey];
  const template = templates[scenario.template];

  // Sélectionner variant aléatoire
  const variant = template.variants[Math.floor(Math.random() * template.variants.length)];

  // Détecter langue utilisateur (fallback FR)
  const userLang = data.user?.preferredLanguage || 'fr';
  const textKey = `text_${userLang}`;

  // Injecter variables
  let narrative = variant[textKey];

  // Remplacer {{variables}}
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    narrative = narrative.replace(regex, data[key]);
  });

  // Sauvegarder narrative en DB
  const narrativeDoc = await db.narratives.insert({
    id: generateUUID(),
    scenario: scenarioKey,
    tone: scenario.tone,
    text: narrative,
    language: userLang,
    relatedUsers: extractUserIds(data),
    metadata: template.metadata,
    createdAt: new Date()
  });

  // Publier dans Social Feed via RabbitMQ
  await publishToFeed(narrativeDoc);

  // Envoyer WebSocket aux utilisateurs concernés
  await notifyUsers(narrativeDoc.relatedUsers, narrativeDoc);

  console.log(`✨ Narrative generated: ${scenarioKey}`);
  return narrativeDoc;
}
```

### 7.8 Base de Données Narratives

```sql
TABLE narratives (
  id UUID PRIMARY KEY,
  scenario VARCHAR(100), -- 'PICKY_SWIPER', 'INSTANT_MATCH', etc.
  tone VARCHAR(50), -- 'sarcastique', 'drôle', 'romantique', 'sage'
  text TEXT NOT NULL,
  language VARCHAR(5), -- 'fr', 'en', 'ru', 'pt'
  related_users UUID[], -- Array d'IDs users concernés
  metadata JSONB, -- { category, visibility, reactions_enabled }
  reactions_count JSONB DEFAULT '{}', -- { "love": 10, "laugh": 25, ... }
  comments_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX(created_at DESC),
  INDEX(scenario),
  INDEX USING GIN(related_users) -- Pour requêtes "mes narratives"
)

TABLE narrative_reactions (
  id UUID PRIMARY KEY,
  narrative_id UUID REFERENCES narratives(id),
  user_id UUID REFERENCES profiles(id),
  reaction_type VARCHAR(10), -- 'love', 'laugh', 'wow', 'sad', 'angry'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(narrative_id, user_id)
)

TABLE narrative_comments (
  id UUID PRIMARY KEY,
  narrative_id UUID REFERENCES narratives(id),
  author_id UUID REFERENCES profiles(id),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)
```

---

## 8. Service #6: Relationship Tracker Service

### 8.1 Questionnaires Progressifs

```typescript
// services/tracker/src/questionnaires/questions.ts

export const QUESTIONNAIRES = {
  DAY_1: {
    id: 'day_1',
    title: 'Premier Contact',
    description: 'Après votre premier message',
    trigger: 'first_message_sent',
    questions: [
      {
        id: 'q1_impression',
        type: 'rating',
        text_fr: 'Première impression du profil (1-5 étoiles)',
        text_ru: 'Первое впечатление от профиля (1-5 звезд)',
        scale: [1, 2, 3, 4, 5]
      },
      {
        id: 'q1_attraction',
        type: 'multiple_choice',
        text_fr: 'Qu\'est-ce qui vous a attiré ?',
        text_ru: 'Что вас привлекло?',
        options: [
          { value: 'photos', label_fr: 'Photos', label_ru: 'Фотографии' },
          { value: 'bio', label_fr: 'Bio', label_ru: 'Описание' },
          { value: 'interests', label_fr: 'Centres d\'intérêt', label_ru: 'Интересы' },
          { value: 'zodiac', label_fr: 'Signe astrologique', label_ru: 'Знак зодиака' }
        ],
        multi_select: true
      },
      {
        id: 'q1_expectations',
        type: 'text',
        text_fr: 'Qu\'attendez-vous de cette rencontre ?',
        text_ru: 'Чего вы ждете от этого знакомства?',
        maxLength: 200
      }
    ]
  },

  DAY_7: {
    id: 'day_7',
    title: 'Après 1 Semaine',
    description: 'Une semaine de conversation',
    trigger: 'one_week_active',
    questions: [
      {
        id: 'q7_communication',
        type: 'rating',
        text_fr: 'Qualité de la communication (1-5)',
        text_ru: 'Качество общения (1-5)',
        scale: [1, 2, 3, 4, 5]
      },
      {
        id: 'q7_compatibility',
        type: 'rating',
        text_fr: 'Niveau de compatibilité ressenti (1-5)',
        text_ru: 'Ощущаемый уровень совместимости (1-5)',
        scale: [1, 2, 3, 4, 5]
      },
      {
        id: 'q7_meeting',
        type: 'yes_no',
        text_fr: 'Envisagez-vous une rencontre IRL ?',
        text_ru: 'Вы планируете встретиться в реальной жизни?'
      },
      {
        id: 'q7_challenges',
        type: 'multiple_choice',
        text_fr: 'Difficultés rencontrées ?',
        text_ru: 'Встреченные трудности?',
        options: [
          { value: 'language', label_fr: 'Barrière de langue', label_ru: 'Языковой барьер' },
          { value: 'timezone', label_fr: 'Fuseau horaire', label_ru: 'Часовой пояс' },
          { value: 'interests', label_fr: 'Intérêts différents', label_ru: 'Разные интересы' },
          { value: 'pace', label_fr: 'Rythme de conversation', label_ru: 'Темп общения' }
        ],
        multi_select: true
      }
    ]
  },

  DAY_30: {
    id: 'day_30',
    title: 'Après 1 Mois',
    description: 'Bilan du premier mois',
    trigger: 'one_month_active',
    questions: [
      {
        id: 'q30_relationship_status',
        type: 'single_choice',
        text_fr: 'Statut actuel de votre relation ?',
        text_ru: 'Текущий статус ваших отношений?',
        options: [
          { value: 'talking', label_fr: 'On discute', label_ru: 'Общаемся' },
          { value: 'dating', label_fr: 'On se voit', label_ru: 'Встречаемся' },
          { value: 'exclusive', label_fr: 'Relation exclusive', label_ru: 'Эксклюзивные отношения' },
          { value: 'friends', label_fr: 'Amis', label_ru: 'Друзья' },
          { value: 'ended', label_fr: 'Terminé', label_ru: 'Закончилось' }
        ]
      },
      {
        id: 'q30_happiness',
        type: 'rating',
        text_fr: 'Niveau de bonheur dans cette relation (1-10)',
        text_ru: 'Уровень счастья в этих отношениях (1-10)',
        scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      },
      {
        id: 'q30_future',
        type: 'rating',
        text_fr: 'Voyez-vous un futur ensemble ? (1-10)',
        text_ru: 'Видите ли вы будущее вместе? (1-10)',
        scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      },
      {
        id: 'q30_advice',
        type: 'text',
        text_fr: 'Un conseil pour les autres couples МойDate ?',
        text_ru: 'Совет для других пар МойDate?',
        maxLength: 300
      }
    ]
  }
};
```

### 8.2 Milestones Relationnels

```typescript
// services/tracker/src/milestones/milestones.ts

export const MILESTONES = {
  // Messages
  FIRST_MESSAGE: {
    id: 'first_message',
    trigger: 'messages_count >= 1',
    title_fr: 'Premier Message 💬',
    title_ru: 'Первое сообщение 💬',
    badge: 'badge_first_message',
    xp: 10
  },

  TEN_MESSAGES: {
    id: 'ten_messages',
    trigger: 'messages_count >= 10',
    title_fr: '10 Messages Échangés 🎉',
    title_ru: '10 сообщений обменяно 🎉',
    badge: 'badge_chatty',
    xp: 20
  },

  HUNDRED_MESSAGES: {
    id: 'hundred_messages',
    trigger: 'messages_count >= 100',
    title_fr: '100 Messages ! 💯',
    title_ru: '100 сообщений! 💯',
    badge: 'badge_super_chatty',
    xp: 50
  },

  // Temps
  ONE_DAY: {
    id: 'one_day',
    trigger: 'days_active >= 1',
    title_fr: 'Premier Jour Ensemble ☀️',
    title_ru: 'Первый день вместе ☀️',
    badge: 'badge_one_day',
    xp: 15
  },

  ONE_WEEK: {
    id: 'one_week',
    trigger: 'days_active >= 7',
    title_fr: 'Une Semaine de Conversation 📅',
    title_ru: 'Неделя общения 📅',
    badge: 'badge_one_week',
    xp: 30
  },

  ONE_MONTH: {
    id: 'one_month',
    trigger: 'days_active >= 30',
    title_fr: 'Premier Mois ! 🎊',
    title_ru: 'Первый месяц! 🎊',
    badge: 'badge_one_month',
    xp: 100
  },

  // Médias
  FIRST_PHOTO_SHARED: {
    id: 'first_photo',
    trigger: 'photos_shared >= 1',
    title_fr: 'Première Photo Partagée 📸',
    title_ru: 'Первое фото отправлено 📸',
    badge: 'badge_photographer',
    xp: 25
  },

  FIRST_VOICE_MESSAGE: {
    id: 'first_voice',
    trigger: 'voice_messages >= 1',
    title_fr: 'Premier Message Vocal 🎙️',
    title_ru: 'Первое голосовое сообщение 🎙️',
    badge: 'badge_voice',
    xp: 30
  },

  // Interculturel
  DIFFERENT_COUNTRIES: {
    id: 'intercultural',
    trigger: 'user1.country !== user2.country',
    title_fr: 'Connexion Interculturelle 🌍',
    title_ru: 'Межкультурная связь 🌍',
    badge: 'badge_global_lover',
    xp: 50
  },

  // Questionnaires
  QUESTIONNAIRE_DAY_1_COMPLETED: {
    id: 'q_day1',
    trigger: 'questionnaire_day1_completed',
    title_fr: 'Questionnaire Jour 1 Complété ✅',
    title_ru: 'Анкета день 1 завершена ✅',
    badge: 'badge_reflective',
    xp: 20
  }
};
```

### 8.3 Score Progression Couple

```typescript
// services/tracker/src/scoring/relationshipScore.ts

export function calculateRelationshipScore(relationship) {
  let score = 0;
  let maxScore = 0;

  // 1. Messages (30 points max)
  const messageScore = Math.min(30, relationship.messagesCount * 0.3);
  score += messageScore;
  maxScore += 30;

  // 2. Durée (25 points max)
  const daysActive = relationship.daysActive;
  let durationScore = 0;
  if (daysActive >= 30) durationScore = 25;
  else if (daysActive >= 14) durationScore = 20;
  else if (daysActive >= 7) durationScore = 15;
  else if (daysActive >= 3) durationScore = 10;
  else if (daysActive >= 1) durationScore = 5;
  score += durationScore;
  maxScore += 25;

  // 3. Variété médias (15 points max)
  let mediaScore = 0;
  if (relationship.photosShared > 0) mediaScore += 5;
  if (relationship.voiceMessages > 0) mediaScore += 5;
  if (relationship.videosShared > 0) mediaScore += 5;
  score += mediaScore;
  maxScore += 15;

  // 4. Questionnaires complétés (20 points max)
  let questionnaireScore = 0;
  if (relationship.questionnaires.day1Completed) questionnaireScore += 5;
  if (relationship.questionnaires.day7Completed) questionnaireScore += 7;
  if (relationship.questionnaires.day30Completed) questionnaireScore += 8;
  score += questionnaireScore;
  maxScore += 20;

  // 5. Compatibilité questionnaire (10 points max)
  // Moyenne des ratings de compatibilité
  const compatibilityRatings = [
    relationship.questionnaires.day7?.compatibility,
    relationship.questionnaires.day30?.happiness,
    relationship.questionnaires.day30?.future
  ].filter(Boolean);

  if (compatibilityRatings.length > 0) {
    const avgRating = compatibilityRatings.reduce((a, b) => a + b, 0) / compatibilityRatings.length;
    score += avgRating; // 1-10 points
    maxScore += 10;
  }

  return {
    score: Math.round(score),
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    level: getRelationshipLevel(score)
  };
}

function getRelationshipLevel(score) {
  if (score >= 80) return { name: 'Soul Mates', icon: '💖', color: '#FF1493' };
  if (score >= 60) return { name: 'Love Birds', icon: '🦢', color: '#FF69B4' };
  if (score >= 40) return { name: 'Growing Together', icon: '🌱', color: '#90EE90' };
  if (score >= 20) return { name: 'Getting to Know', icon: '👋', color: '#87CEEB' };
  return { name: 'Just Started', icon: '✨', color: '#DDA0DD' };
}
```

---

## 9. Service #7: Gamification Service

### 9.1 Système de Badges (50+)

```typescript
// services/gamification/src/badges/badges.ts

export const BADGES = {
  // Swipe Badges
  FIRST_SWIPE: {
    id: 'first_swipe',
    name_fr: 'Premier Swipe',
    name_ru: 'Первый свайп',
    icon: '👆',
    condition: 'swipes_count >= 1',
    xp: 5,
    rarity: 'common'
  },

  HUNDRED_SWIPES: {
    id: 'hundred_swipes',
    name_fr: 'Swipe Master',
    name_ru: 'Мастер свайпов',
    icon: '🎯',
    condition: 'swipes_count >= 100',
    xp: 50,
    rarity: 'rare'
  },

  GENEROUS_HEART: {
    id: 'generous_heart',
    name_fr: 'Cœur Généreux',
    name_ru: 'Щедрое сердце',
    icon: '💝',
    condition: 'like_rate >= 80',
    xp: 30,
    rarity: 'uncommon'
  },

  // Match Badges
  FIRST_MATCH: {
    id: 'first_match',
    name_fr: 'Premier Match',
    name_ru: 'Первый мэтч',
    icon: '💕',
    condition: 'matches_count >= 1',
    xp: 20,
    rarity: 'common'
  },

  TEN_MATCHES: {
    id: 'ten_matches',
    name_fr: 'Populaire',
    name_ru: 'Популярный',
    icon: '⭐',
    condition: 'matches_count >= 10',
    xp: 100,
    rarity: 'rare'
  },

  INSTANT_CHEMISTRY: {
    id: 'instant_chemistry',
    name_fr: 'Alchimie Instantanée',
    name_ru: 'Мгновенная химия',
    icon: '⚡',
    condition: 'instant_matches >= 1', // match <1min
    xp: 50,
    rarity: 'epic'
  },

  // Messaging Badges
  FIRST_MESSAGE: {
    id: 'first_message',
    name_fr: 'Brise-Glace',
    name_ru: 'Ледокол',
    icon: '💬',
    condition: 'messages_sent >= 1',
    xp: 10,
    rarity: 'common'
  },

  CHATTERBOX: {
    id: 'chatterbox',
    name_fr: 'Moulin à Paroles',
    name_ru: 'Болтун',
    icon: '🗣️',
    condition: 'messages_sent >= 500',
    xp: 150,
    rarity: 'epic'
  },

  VOICE_ARTIST: {
    id: 'voice_artist',
    name_fr: 'Artiste Vocal',
    name_ru: 'Голосовой артист',
    icon: '🎙️',
    condition: 'voice_messages_sent >= 10',
    xp: 40,
    rarity: 'uncommon'
  },

  // Intercultural Badges
  GLOBAL_CITIZEN: {
    id: 'global_citizen',
    name_fr: 'Citoyen du Monde',
    name_ru: 'Гражданин мира',
    icon: '🌍',
    condition: 'matches_different_countries >= 5',
    xp: 100,
    rarity: 'legendary'
  },

  POLYGLOT: {
    id: 'polyglot',
    name_fr: 'Polyglotte',
    name_ru: 'Полиглот',
    icon: '🗣️🌐',
    condition: 'conversations_in_3_languages',
    xp: 200,
    rarity: 'legendary'
  },

  // Time-based Badges
  EARLY_BIRD: {
    id: 'early_bird',
    name_fr: 'Lève-Tôt',
    name_ru: 'Жаворонок',
    icon: '🐦',
    condition: 'active_before_7am >= 5_days',
    xp: 30,
    rarity: 'uncommon'
  },

  NIGHT_OWL: {
    id: 'night_owl',
    name_fr: 'Oiseau de Nuit',
    name_ru: 'Сова',
    icon: '🦉',
    condition: 'active_after_11pm >= 5_days',
    xp: 30,
    rarity: 'uncommon'
  },

  LOYAL_USER: {
    id: 'loyal_user',
    name_fr: 'Fidèle',
    name_ru: 'Верный пользователь',
    icon: '🏆',
    condition: 'days_active >= 30',
    xp: 150,
    rarity: 'epic'
  },

  // Social Feed Badges
  INFLUENCER: {
    id: 'influencer',
    name_fr: 'Influenceur',
    name_ru: 'Инфлюенсер',
    icon: '📸',
    condition: 'posts_reactions >= 100',
    xp: 100,
    rarity: 'rare'
  },

  COMMUNITY_SPIRIT: {
    id: 'community_spirit',
    name_fr: 'Esprit Communautaire',
    name_ru: 'Дух сообщества',
    icon: '🤝',
    condition: 'comments_posted >= 50',
    xp: 75,
    rarity: 'rare'
  },

  // ... 30+ autres badges
};
```

### 9.2 Leaderboard Global

```typescript
// services/gamification/src/leaderboard/leaderboard.ts

import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Utiliser Redis Sorted Sets pour performance
export async function updateLeaderboard(userId, xp) {
  // Leaderboard global (all-time)
  await redis.zadd('leaderboard:global', xp, userId);

  // Leaderboard hebdomadaire
  const weekKey = `leaderboard:weekly:${getWeekNumber()}`;
  await redis.zadd(weekKey, xp, userId);
  await redis.expire(weekKey, 7 * 24 * 60 * 60); // Expirer après 7 jours

  // Leaderboard mensuel
  const monthKey = `leaderboard:monthly:${new Date().toISOString().slice(0, 7)}`;
  await redis.zadd(monthKey, xp, userId);
  await redis.expire(monthKey, 30 * 24 * 60 * 60);
}

export async function getLeaderboard(type = 'global', limit = 100) {
  let key = 'leaderboard:global';

  if (type === 'weekly') {
    key = `leaderboard:weekly:${getWeekNumber()}`;
  } else if (type === 'monthly') {
    key = `leaderboard:monthly:${new Date().toISOString().slice(0, 7)}`;
  }

  // Récupérer top users (ordre décroissant)
  const results = await redis.zrevrange(key, 0, limit - 1, 'WITHSCORES');

  // Format: [userId1, score1, userId2, score2, ...]
  const leaderboard = [];
  for (let i = 0; i < results.length; i += 2) {
    const userId = results[i];
    const xp = parseInt(results[i + 1]);
    const rank = Math.floor(i / 2) + 1;

    const user = await getUserProfile(userId);

    leaderboard.push({
      rank,
      userId,
      displayName: user.displayName,
      avatar: user.photos[0]?.url,
      xp,
      level: calculateLevel(xp),
      badges: user.badges.slice(0, 3) // Top 3 badges
    });
  }

  return leaderboard;
}

export async function getUserRank(userId, type = 'global') {
  let key = 'leaderboard:global';

  if (type === 'weekly') {
    key = `leaderboard:weekly:${getWeekNumber()}`;
  } else if (type === 'monthly') {
    key = `leaderboard:monthly:${new Date().toISOString().slice(0, 7)}`;
  }

  const rank = await redis.zrevrank(key, userId);
  return rank !== null ? rank + 1 : null;
}
```

---

## 10. Service #8: Social Feed Service

*(Intègre narratives algorithmiques + posts users)*

```typescript
// services/social-feed/src/controllers/feedController.ts

export async function getFeed(req, res) {
  const userId = req.user.id;
  const { page = 1, limit = 20 } = req.query;

  // Récupérer mix de posts users + narratives
  const posts = await db.posts.find({
    $or: [
      { type: 'user_post' },
      { type: 'narrative', relatedUsers: userId } // Narratives qui me concernent
    ]
  })
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit)
  .populate('author', 'displayName photos');

  return res.json({ posts, page, hasMore: posts.length === limit });
}
```

---

## 11. Service #9: Notification Service (Supabase vs Firebase)

### 11.1 Comparaison Supabase vs Firebase

| Critère | Supabase | Firebase | Recommandation |
|---------|----------|----------|----------------|
| **Realtime** | PostgreSQL Realtime (WebSocket) | Firestore Realtime Listeners | ⚖️ Égalité |
| **Push Notifications** | Via webhooks + OneSignal/FCM | Firebase Cloud Messaging natif | ✅ **Firebase** |
| **Tarification** | Généreux (500K requêtes/mois gratuit) | Gratuit jusqu'à 10K utilisateurs | ✅ **Supabase** |
| **TypeScript** | Support natif TypeScript | Support TypeScript | ⚖️ Égalité |
| **Backend** | PostgreSQL (on contrôle) | Firestore NoSQL (vendor lock-in) | ✅ **Supabase** |
| **Auth** | Intégré (mais on utilise BetterAuth) | Firebase Auth (mais on utilise BetterAuth) | ⚖️ Égalité |
| **Learning Curve** | Moyenne (SQL familier) | Facile (abstraction) | ⚖️ Égalité |
| **Vendor Lock-in** | Faible (PostgreSQL standard) | Élevé (propriétaire Google) | ✅ **Supabase** |

### 11.2 Recommandation: **Supabase + Firebase Cloud Messaging**

**Architecture hybride:**
1. **Supabase** pour realtime in-app (WebSocket PostgreSQL)
2. **Firebase Cloud Messaging** pour push notifications mobile

**Pourquoi?**
- ✅ Meilleure intégration avec PostgreSQL (déjà utilisé)
- ✅ Moins de vendor lock-in
- ✅ Tarification plus avantageuse
- ✅ FCM reste le meilleur pour push mobile (gratuit, fiable)

### 11.3 Configuration Supabase Realtime

```typescript
// services/notification/src/config/supabase.ts

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Écouter nouvelles notifications
export function subscribeToNotifications(userId, callback) {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
}
```

### 11.4 Configuration Firebase Cloud Messaging (Push)

```typescript
// services/notification/src/config/fcm.ts

import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FCM_PROJECT_ID,
    clientEmail: process.env.FCM_CLIENT_EMAIL,
    privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

export async function sendPushNotification(fcmToken, notification) {
  const message = {
    token: fcmToken,
    notification: {
      title: notification.title,
      body: notification.message,
      imageUrl: notification.imageUrl
    },
    data: {
      type: notification.type,
      action: notification.action,
      matchId: notification.matchId?.toString()
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: notification.badge
        }
      }
    },
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'moydate_notifications'
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('📨 Push sent:', response);
    return response;
  } catch (error) {
    console.error('Push error:', error);
    throw error;
  }
}
```

---

## 12. Service #10: Premium & Payment Service

### 12.1 Paiements Russes (Prioritaires)

#### 12.1.1 MirPay (Priorité #1)

```typescript
// services/premium/src/payments/mirpay.ts

import axios from 'axios';

const MIR_PAY_API = 'https://api.nspk.ru/acquiring/v1';

export async function createMirPayment(userId, amount, currency = 'RUB') {
  const response = await axios.post(
    `${MIR_PAY_API}/payment/init`,
    {
      amount: amount * 100, // Копейки
      currency,
      orderId: generateOrderId(userId),
      description: 'МойDate Premium Subscription',
      returnUrl: `${process.env.FRONTEND_URL}/payment/success`,
      failUrl: `${process.env.FRONTEND_URL}/payment/fail`,
      callbackUrl: `${process.env.BACKEND_URL}/api/payments/webhook/mirpay`
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.MIRPAY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    paymentId: response.data.paymentId,
    paymentUrl: response.data.formUrl
  };
}

export async function handleMirPayWebhook(req, res) {
  const { paymentId, status, orderId } = req.body;

  // Vérifier signature
  const isValid = verifyMirPaySignature(req.body, req.headers['x-mir-signature']);
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (status === 'CONFIRMED') {
    // Activer Premium
    await activatePremium(getUserIdFromOrder(orderId));
  }

  res.json({ received: true });
}
```

#### 12.1.2 SberPay (Priorité #2)

```typescript
// services/premium/src/payments/sberpay.ts

import axios from 'axios';

const SBER_API = 'https://securepayments.sberbank.ru/payment/rest';

export async function createSberPayment(userId, amount) {
  const response = await axios.post(
    `${SBER_API}/register.do`,
    {
      userName: process.env.SBER_USERNAME,
      password: process.env.SBER_PASSWORD,
      orderNumber: generateOrderId(userId),
      amount: amount * 100, // Копейки
      currency: '643', // RUB code
      returnUrl: `${process.env.FRONTEND_URL}/payment/success`,
      failUrl: `${process.env.FRONTEND_URL}/payment/fail`,
      description: 'МойDate Premium',
      features: {
        auto_payment: 'true' // Abonnement récurrent
      }
    }
  );

  return {
    orderId: response.data.orderId,
    formUrl: response.data.formUrl
  };
}
```

#### 12.1.3 Tinkoff (Priorité #3)

```typescript
// services/premium/src/payments/tinkoff.ts

import crypto from 'crypto';
import axios from 'axios';

const TINKOFF_API = 'https://securepay.tinkoff.ru/v2';

export async function createTinkoffPayment(userId, amount) {
  const params = {
    TerminalKey: process.env.TINKOFF_TERMINAL_KEY,
    Amount: amount * 100,
    OrderId: generateOrderId(userId),
    Description: 'МойDate Premium',
    NotificationURL: `${process.env.BACKEND_URL}/api/payments/webhook/tinkoff`,
    SuccessURL: `${process.env.FRONTEND_URL}/payment/success`,
    FailURL: `${process.env.FRONTEND_URL}/payment/fail`
  };

  // Générer token signature
  params.Token = generateTinkoffToken(params, process.env.TINKOFF_SECRET_KEY);

  const response = await axios.post(`${TINKOFF_API}/Init`, params);

  return {
    paymentId: response.data.PaymentId,
    paymentUrl: response.data.PaymentURL
  };
}

function generateTinkoffToken(params, secretKey) {
  const values = Object.keys(params)
    .filter(key => key !== 'Token')
    .sort()
    .map(key => params[key]);

  values.push(secretKey);

  const concatenated = values.join('');
  return crypto.createHash('sha256').update(concatenated).digest('hex');
}
```

#### 12.1.4 YooMoney (Priorité #4)

```typescript
// services/premium/src/payments/yoomoney.ts

import axios from 'axios';

const YOOMONEY_API = 'https://yookassa.ru/api/v3';

export async function createYooMoneyPayment(userId, amount) {
  const response = await axios.post(
    `${YOOMONEY_API}/payments`,
    {
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB'
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.FRONTEND_URL}/payment/success`
      },
      capture: true,
      description: 'МойDate Premium Subscription',
      metadata: {
        userId,
        orderId: generateOrderId(userId)
      }
    },
    {
      auth: {
        username: process.env.YOOMONEY_SHOP_ID,
        password: process.env.YOOMONEY_SECRET_KEY
      },
      headers: {
        'Idempotence-Key': crypto.randomUUID(),
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    paymentId: response.data.id,
    confirmationUrl: response.data.confirmation.confirmation_url
  };
}
```

### 12.2 Plans Tarifaires

```typescript
// services/premium/src/plans/plans.ts

export const PREMIUM_PLANS = {
  RU: [
    {
      id: 'premium_1m_ru',
      duration: '1_month',
      price: 599, // RUB
      currency: 'RUB',
      features: [
        'Swipes illimités',
        'Messages illimités',
        '5 SuperLikes/jour',
        'Rewind (annuler swipe)',
        'Traduction auto DeepL',
        'Mode invisible',
        'Boost profil 1x/mois',
        'Voir qui vous a liké'
      ]
    },
    {
      id: 'premium_3m_ru',
      duration: '3_months',
      price: 1499, // RUB (-16%)
      currency: 'RUB',
      savings: 298
    },
    {
      id: 'premium_12m_ru',
      duration: '12_months',
      price: 4999, // RUB (-30%)
      currency: 'RUB',
      savings: 2189
    }
  ],

  INTERNATIONAL: [
    {
      id: 'premium_1m_intl',
      duration: '1_month',
      price: 9.99, // USD/EUR
      currency: 'USD',
      paymentMethods: ['stripe', 'apple_pay', 'google_pay']
    }
  ]
};
```

---

## 13. Service #11: Translation Service

### 13.1 DeepL API (Premium) + Fallback Google

```typescript
// services/translation/src/translator.ts

import axios from 'axios';
import { Translate } from '@google-cloud/translate/build/src/v2';

const deepl = axios.create({
  baseURL: 'https://api-free.deepl.com/v2',
  headers: {
    'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`
  }
});

const googleTranslate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY
});

export async function translateMessage(text, targetLang, userTier = 'free') {
  try {
    // Premium users → DeepL (meilleure qualité)
    if (userTier === 'premium') {
      const response = await deepl.post('/translate', {
        text: [text],
        target_lang: targetLang.toUpperCase(),
        formality: 'default'
      });

      return {
        translated: response.data.translations[0].text,
        detectedLanguage: response.data.translations[0].detected_source_language,
        service: 'deepl'
      };
    }

    // Free users → Google Translate (gratuit)
    const [translation] = await googleTranslate.translate(text, targetLang);

    return {
      translated: translation,
      detectedLanguage: null, // Google ne retourne pas toujours
      service: 'google'
    };

  } catch (error) {
    // Fallback sur Google si DeepL fail
    if (userTier === 'premium') {
      console.warn('DeepL failed, falling back to Google');
      const [translation] = await googleTranslate.translate(text, targetLang);
      return {
        translated: translation,
        service: 'google_fallback'
      };
    }

    throw error;
  }
}

// Auto-traduction dans conversation
export async function autoTranslateIfNeeded(message, senderLang, recipientLang, recipientTier) {
  if (senderLang === recipientLang) {
    return null; // Pas besoin de traduire
  }

  const translation = await translateMessage(message.content, recipientLang, recipientTier);

  // Sauvegarder traduction en cache
  await redis.setex(
    `translation:${message.id}:${recipientLang}`,
    7 * 24 * 60 * 60, // 7 jours
    JSON.stringify(translation)
  );

  return translation;
}
```

### 13.2 Détection Langue Automatique

```typescript
// services/translation/src/languageDetector.ts

import LanguageDetect from 'languagedetect';

const lngDetector = new LanguageDetect();

export function detectLanguage(text) {
  const results = lngDetector.detect(text, 1);

  if (results.length === 0) {
    return 'en'; // Fallback
  }

  const [language, confidence] = results[0];

  // Map vers codes ISO
  const langMap = {
    'russian': 'ru',
    'french': 'fr',
    'english': 'en',
    'portuguese': 'pt'
  };

  return langMap[language] || 'en';
}
```

---

## 14. Stack Technique Complète

### 14.1 Backend Services

| Service | Runtime | Framework | Database | Cache | Queue | Storage |
|---------|---------|-----------|----------|-------|-------|---------|
| Auth | Node.js 20 | BetterAuth | PostgreSQL 16 | Redis | - | - |
| Profile | Node.js 20 | Express | PostgreSQL 16 | Redis | - | S3 |
| Matching | Node.js 20 | Express | PostgreSQL 16 | Redis | - | - |
| Messaging | Node.js 20 | Socket.io | PostgreSQL 16 | Redis | - | S3 |
| Narrative | Node.js 20 | Express | PostgreSQL 16 | Redis | RabbitMQ | - |
| Tracker | Node.js 20 | Express | PostgreSQL 16 | - | RabbitMQ | - |
| Gamification | Node.js 20 | Express | PostgreSQL 16 | Redis | - | - |
| Social Feed | Node.js 20 | Express | PostgreSQL 16 | Redis | RabbitMQ | CDN |
| Notification | Node.js 20 | Express | PostgreSQL 16 | - | - | - |
| Premium | Node.js 20 | Express | PostgreSQL 16 | - | - | - |
| Translation | Node.js 20 | Express | - | Redis | - | - |

### 14.2 Infrastructure

**Cloud Provider:** AWS (ou Yandex Cloud pour marché russe)

**Orchestration:**
- Docker + Docker Compose (dev)
- Kubernetes (production)

**Database:**
- PostgreSQL 16 (1 instance par service)
- Redis 7 (cache + sessions + Socket.io adapter + leaderboards)

**Message Broker:**
- RabbitMQ 3.12 (events narratives, milestones)

**Storage:**
- AWS S3 / Yandex Object Storage (images, vidéos, vocals)
- CloudFront / Yandex CDN

**Monitoring:**
- Prometheus + Grafana
- Sentry (errors)
- ELK Stack (logs)

**CI/CD:**
- GitHub Actions
- Docker Registry

---

## 15. Infrastructure & Déploiement

### 15.1 Coûts Révisés (Marché Russe)

**Option 1: AWS (International)**
- Phase 1 MVP: ~$600/mois
- Phase 2 Scale: ~$2,000/mois

**Option 2: Yandex Cloud (Russie) 🇷🇺**
- Phase 1 MVP: ~₽40,000/mois (~$450)
- Phase 2 Scale: ~₽120,000/mois (~$1,300)
- **Avantage:** Meilleure latence Russie, conformité RGPD russe

### 15.2 Timeline Phase 1 Révisée

**Mois 1-2: Foundation**
- Auth Service (BetterAuth + VK OAuth)
- Profile Service
- Infrastructure (Docker, PostgreSQL, Redis, RabbitMQ)

**Mois 3: Matching + Gamification**
- Matching Service (algorithme + rate limiting 50/3h)
- Gamification Service (badges, XP, leaderboard)

**Mois 4-5: Messaging + Translation**
- Messaging Service (WebSocket + médias)
- Translation Service (DeepL + Google fallback)

**Mois 6-7: CORE - Narratives + Tracking**
- ⭐ **Narrative Engine** (templates, analyzer, generator)
- Relationship Tracker (questionnaires, milestones)

**Mois 8: Social + Premium + Launch**
- Social Feed Service
- Premium Service (paiements russes)
- Notification Service (Supabase + FCM)
- Tests finaux, optimisations
- **LANCEMENT MVP**

---

## 📊 Récapitulatif des Changements

| Feature | V1 Status | V2 Status | Justification |
|---------|-----------|-----------|---------------|
| **Narratives** | Phase 2 | ⬆️ **Phase 1 P0** | Cœur du produit différenciant |
| **Tracking** | Phase 2 | ⬆️ **Phase 1 P0** | Questionnaires essentiels MVP |
| **Gamification** | Phase 2 | ⬆️ **Phase 1 P0** | Engagement users critiques |
| **Traduction** | Phase 2 | ⬆️ **Phase 1 P1** | Marché multilingue (RU/FR/EN) |
| **Rate Limiting** | 20/jour | ⬆️ **50/3h** | 400 profils/jour (vs 20) |
| **OAuth** | Google only | **VK prioritaire** | Marché russe principal |
| **Paiements** | Stripe | **Mir/Sber/Tinkoff/Yoo** | Paiements russes prioritaires |
| **Notifications** | Firebase | **Supabase + FCM** | Moins de vendor lock-in |

---

**Total services:** 11 microservices
**Temps estimé Phase 1:** 6-8 mois (équipe 2-3 devs)
**Budget infrastructure:** $450-600/mois (MVP)

**Prêt pour implémentation!** 🚀
