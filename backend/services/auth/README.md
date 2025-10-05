# МойDate - Authentication Service

Microservice d'authentification pour l'application de rencontres МойDate avec support VK OAuth, Phone OTP, et multi-providers.

## 🚀 Caractéristiques

- **Phone OTP Authentication** (SMS via SMSC.ru pour marché russe)
- **VK OAuth** (Prioritaire pour utilisateurs russes)
- **Google, Apple, Instagram OAuth**
- **JWT Token Management** (Access + Refresh tokens)
- **Redis Session Management** (Multi-device support)
- **Rate Limiting** (Protection anti-spam)
- **Audit Logging** (Conforme loi 152-FZ russe)

## 📋 Prérequis

- Node.js 20+
- PostgreSQL 16
- Redis 7
- npm/yarn

## 🔧 Installation

1. Installer les dépendances:
```bash
npm install
```

2. Copier le fichier d'environnement:
```bash
cp .env.example .env
```

3. Configurer les variables d'environnement (voir `.env.example`)

4. Créer la base de données:
```bash
psql -U postgres -c "CREATE DATABASE moydate_auth;"
```

5. Exécuter les migrations:
```bash
psql -U postgres -d moydate_auth -f migrations/001_initial_schema.sql
```

6. Lancer le serveur en développement:
```bash
npm run dev
```

## 🐳 Docker

Lancer avec Docker Compose:

```bash
docker-compose up -d
```

Cela démarre:
- Service d'authentification (port 3001)
- PostgreSQL 16 (port 5432)
- Redis 7 (port 6379)

## 📡 API Endpoints

### Phone Authentication

**Send OTP:**
```http
POST /api/v1/auth/phone/send-otp
Content-Type: application/json

{
  "phone": "+79991234567",
  "countryCode": "RU"
}
```

**Verify OTP:**
```http
POST /api/v1/auth/phone/verify
Content-Type: application/json

{
  "phone": "+79991234567",
  "code": "123456"
}
```

### OAuth

**VK OAuth:**
```http
GET /api/v1/auth/oauth/vk
```

**VK Callback:**
```http
GET /api/v1/auth/oauth/vk/callback?code=XXX
```

### Token Management

**Refresh Token:**
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

**Logout:**
```http
POST /api/v1/auth/logout
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "everywhere": false
}
```

## 🔐 Authentification avec VK OAuth

### Configuration VK App

1. Créer une application sur [vk.com/apps?act=manage](https://vk.com/apps?act=manage)
2. Activer "OAuth" dans les paramètres
3. Ajouter l'URL de callback: `http://localhost:3001/api/v1/auth/oauth/vk/callback`
4. Copier Client ID et Client Secret dans `.env`

### Flow OAuth VK

1. Redirection vers VK: `GET /api/v1/auth/oauth/vk`
2. Utilisateur autorise l'application
3. VK redirige vers callback avec `code`
4. Service échange `code` contre `access_token`
5. Récupération du profil VK
6. Création/connexion utilisateur
7. Génération JWT tokens

## 📱 SMS avec SMSC.ru (Russie)

SMSC.ru offre une meilleure délivrabilité pour les numéros russes.

Configuration dans `.env`:
```env
SMS_PROVIDER=smsc
SMSC_LOGIN=votre-login
SMSC_PASSWORD=votre-mot-de-passe
SMSC_SENDER=МойDate
```

## 🧪 Tests

```bash
# Tous les tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 📊 Monitoring

**Health Check:**
```http
GET /health
```

Réponse:
```json
{
  "status": "healthy",
  "service": "auth-service",
  "timestamp": "2025-01-05T12:00:00.000Z",
  "database": "connected",
  "redis": "connected"
}
```

## 🇷🇺 Conformité 152-FZ (Russie)

Ce service est conforme à la loi russe 152-FZ sur la protection des données personnelles:

- ✅ Audit logging de toutes les actions d'authentification
- ✅ Stockage des données en Russie (configurable)
- ✅ Journalisation des adresses IP et User Agents
- ✅ Gestion des consentements utilisateurs

Configuration dans `.env`:
```env
DATA_RESIDENCY=RU
ENABLE_AUDIT_LOGGING=true
```

## 🛡️ Sécurité

- **Rate Limiting:** 3 OTP par heure, 5 tentatives de login par heure
- **JWT Expiration:** Access token (15 min), Refresh token (30 jours)
- **Session Management:** Redis avec TTL de 30 jours
- **Input Validation:** Zod schemas
- **SQL Injection Prevention:** Requêtes paramétrées (pg)
- **CORS:** Configuré pour domaines autorisés

## 📝 Structure du Projet

```
backend/services/auth/
├── src/
│   ├── config/          # Database, Redis config
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, rate limiting, errors
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Logger, validation
│   └── index.ts         # Express server
├── migrations/          # SQL migrations
├── tests/               # Unit & integration tests
├── Dockerfile           # Docker config
├── docker-compose.yml   # Multi-container setup
└── package.json
```

## 🔄 Workflow de Développement

1. Créer une branche: `git checkout -b feature/nom-feature`
2. Développer avec TDD: `npm run test:watch`
3. Vérifier le code: `npm run lint && npm run typecheck`
4. Tester localement: `npm run dev`
5. Build production: `npm run build`
6. Créer PR pour review

## 🤝 Contribution

Voir `BACKEND_PLAN_FLOW_NEXUS.md` pour la roadmap complète du backend.

## 📄 Licence

MIT - МойDate Team 2025
