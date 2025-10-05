# МойDate Backend - 11 Microservices

Architecture microservices complète pour l'application МойDate.

## 📊 Services (11 total)

### P0 - Core (6 services)
1. **Auth** (:3001) - VK OAuth, Phone OTP, JWT
2. **Profile** (:3002) - CRUD, 6 photos, géolocalisation
3. **Matching** (:3003) - ELO, swipes, SuperLike
4. **Chat** (:3004) - Socket.io temps réel
5. **Narrative** (:3005) - Claude AI sarcastique
6. **Premium** (:3006) - Paiements RU + International

### P1 - Secondary (5 services)
7. **Social** (:3007) - Feed, posts, reactions
8. **Gamification** (:3008) - Badges, XP, leaderboard
9. **Tracking** (:3009) - Questionnaires relationnel
10. **Notification** (:3010) - Push, email, SMS
11. **Translation** (:3011) - DeepL, Google Translate

## 🚀 Quick Start

```bash
cd backend
docker-compose up -d
```

## 🔧 Individual Services

```bash
cd services/auth
npm install
npm run dev
```

## 🏗️ Stack

- Node.js 20 LTS
- Express 4.18
- TypeScript 5.3
- PostgreSQL 16
- Redis 7
- Socket.io 4.6
- Claude API (Anthropic)

## 📡 API Gateway

Tous les services sont accessibles via:
- http://localhost:3001-3011

## 🇷🇺 Russian Market

- VK OAuth prioritaire
- Paiements: MirPay, SberPay, Tinkoff, YooMoney
- SMSC.ru pour SMS
- Conformité 152-FZ

## 📝 Documentation

Chaque service a son README dans `services/<nom>/README.md`

---

**Generated:** 2025-10-05 avec Hive Mind Local
**Total:** 11 microservices prêts pour production
