# 📋 МойDate - Backend TODO List

## 🎯 Social Feed Module

### 📝 Commentaires (Comments)
- [ ] **API Endpoint: POST `/api/feed/posts/:postId/comments`**
  - Créer un commentaire sur un post (utilisateur ou narratif)
  - Validation: contenu max 500 caractères, sanitization XSS
  - Rate limit: 20 commentaires/minute par utilisateur
  - Retourne: commentaire créé avec metadata

- [ ] **API Endpoint: GET `/api/feed/posts/:postId/comments`**
  - Récupérer tous les commentaires d'un post
  - Pagination: 50 commentaires par page
  - Tri: par date (DESC) ou likes (DESC)
  - Retourne: liste paginée avec auteurs

- [ ] **API Endpoint: DELETE `/api/feed/comments/:commentId`**
  - Supprimer son propre commentaire
  - Authorization: owner ou admin
  - Soft delete pour modération
  - Retourne: 204 No Content

- [ ] **API Endpoint: PUT `/api/feed/comments/:commentId`**
  - Modifier son commentaire
  - Validation: 15 minutes max après création
  - Sanitization obligatoire
  - Retourne: commentaire mis à jour

- [ ] **API Endpoint: POST `/api/feed/comments/:commentId/like`**
  - Liker un commentaire
  - Toggle like/unlike
  - Mise à jour compteur en temps réel
  - Retourne: nouveau statut

- [ ] **WebSocket: Commentaires temps réel**
  - Event `comment:new` sur un post
  - Event `comment:deleted`
  - Event `comment:updated`
  - Broadcast aux utilisateurs connectés

---

### ❤️ Likes & Réactions

- [ ] **API Endpoint: POST `/api/feed/posts/:postId/like`**
  - Liker/Unliker un post
  - Toggle automatique
  - Mise à jour compteur atomique
  - Retourne: nouveau statut + count

- [ ] **API Endpoint: POST `/api/feed/posts/:postId/react`**
  - Réaction rapide avec emoji (❤️😂👍😮😢🔥)
  - Body: `{ "emoji": "❤️" }`
  - Validation: emoji autorisé seulement
  - Retourne: liste réactions mises à jour

- [ ] **API Endpoint: GET `/api/feed/posts/:postId/reactions`**
  - Récupérer toutes les réactions d'un post
  - Groupées par type emoji
  - Avec détails utilisateurs (si public)
  - Retourne: `{ "❤️": 234, "😂": 89, ... }`

- [ ] **API Endpoint: POST `/api/feed/narratives/:narrativeId/react`**
  - Like/Dislike pour narratifs algorithme
  - Body: `{ "reaction": "like" | "dislike" }`
  - Toggle si même réaction
  - Retourne: nouveau statut + counts

---

### 📤 Partage (Share)

- [ ] **API Endpoint: POST `/api/feed/posts/:postId/share`**
  - Partager un post en story
  - Body: `{ "type": "story", "caption": "..." }`
  - Génère nouvelle story avec post embeded
  - Increment compteur shares
  - Retourne: story créée

- [ ] **API Endpoint: POST `/api/feed/posts/:postId/share/external`**
  - Générer lien de partage externe
  - Créé deeplink vers l'app
  - Preview card avec og:tags
  - Tracking du partage
  - Retourne: URL partageable

- [ ] **API Endpoint: POST `/api/feed/narratives/:narrativeId/share`**
  - Partager un narratif algorithme
  - Même logique que posts utilisateurs
  - Génère image preview dynamique
  - Retourne: URL ou story

---

### 🚩 Signalement & Modération

- [ ] **API Endpoint: POST `/api/feed/posts/:postId/report`**
  - Signaler un post inapproprié
  - Body: `{ "reason": "spam|harassment|...", "details": "..." }`
  - Validation: raisons prédéfinies
  - Alerte modérateurs si seuil atteint
  - Retourne: confirmation

- [ ] **API Endpoint: POST `/api/feed/comments/:commentId/report`**
  - Signaler un commentaire
  - Même logique que posts
  - Auto-hide si 5+ reports
  - Retourne: confirmation

- [ ] **API Endpoint: GET `/api/moderation/reports`** (ADMIN)
  - Liste tous les signalements
  - Filtres: pending, reviewed, dismissed
  - Pagination + tri
  - Retourne: liste paginée

- [ ] **API Endpoint: PUT `/api/moderation/reports/:reportId`** (ADMIN)
  - Traiter un signalement
  - Actions: approve_delete, dismiss, warn_user
  - Journalisation des actions
  - Retourne: rapport mis à jour

---

### 🔖 Sauvegarde & Favoris

- [ ] **API Endpoint: POST `/api/feed/posts/:postId/save`**
  - Sauvegarder/Unsave un post
  - Toggle automatique
  - Collection privée utilisateur
  - Retourne: nouveau statut

- [ ] **API Endpoint: GET `/api/feed/saved`**
  - Récupérer tous les posts sauvegardés
  - Pagination: 20 par page
  - Tri: par date sauvegarde DESC
  - Retourne: liste posts avec metadata

- [ ] **API Endpoint: DELETE `/api/feed/saved/:postId`**
  - Retirer des favoris
  - Alternative à toggle
  - Retourne: 204 No Content

---

### 📊 Feed Personnalisé & Algorithme

- [ ] **API Endpoint: GET `/api/feed`**
  - Récupérer le feed personnalisé
  - Query params: `filter=all|following|popular`, `page=1`, `limit=20`
  - Algorithme ML pour ordre posts
  - Mix posts utilisateurs + narratifs (ratio 70/30)
  - Retourne: liste posts paginée

- [ ] **API Endpoint: GET `/api/feed/narratives`**
  - Récupérer seulement les narratifs
  - Génération dynamique basée sur stats utilisateur
  - Variables remplies avec vraies données
  - Catégorie basée sur mood/heure/stats
  - Retourne: liste narratifs personnalisés

- [ ] **API Endpoint: POST `/api/feed/refresh`**
  - Forcer refresh du feed
  - Génère nouveaux narratifs
  - Récupère nouveaux posts
  - Retourne: feed mis à jour

- [ ] **Service: Narrative Generator**
  - Service backend pour génération narratifs
  - Lit templates depuis feed-narratives.json
  - Remplace variables par vraies données utilisateur
  - Logique catégorie (temps, stats, événements)
  - Cache narratifs générés 5 minutes

---

### 🎭 Stories & Activités

- [ ] **API Endpoint: GET `/api/feed/stories`**
  - Récupérer stories actives (< 24h)
  - Inclut narratifs en format story
  - Ordre: non vues en premier
  - Retourne: liste stories avec metadata

- [ ] **API Endpoint: POST `/api/feed/stories/:storyId/view`**
  - Marquer story comme vue
  - Timestamp de vue
  - Stats pour créateur
  - Retourne: 204 No Content

- [ ] **API Endpoint: POST `/api/feed/stories`**
  - Créer nouvelle story
  - Upload: image/video
  - Caption max 200 caractères
  - Expiration auto 24h
  - Retourne: story créée

---

### 🔔 Notifications Feed

- [ ] **API Endpoint: GET `/api/feed/notifications`**
  - Notifications liées au feed
  - Types: like, comment, share, mention
  - Pagination + marquer comme lu
  - Retourne: liste notifications

- [ ] **WebSocket: Notifications temps réel**
  - Event `notification:feed`
  - Push pour like/comment/share
  - Badge count mis à jour
  - Broadcast personnalisé

---

### 📈 Analytics & Stats

- [ ] **API Endpoint: GET `/api/feed/posts/:postId/stats`**
  - Stats détaillées d'un post
  - Vues, likes, comments, shares, reach
  - Démographie (si suffisant)
  - Graphiques évolution temporelle
  - Retourne: objet stats complet

- [ ] **API Endpoint: GET `/api/feed/analytics/user`**
  - Analytics perso utilisateur
  - Posts performants
  - Engagement moyen
  - Meilleurs moments post
  - Retourne: dashboard data

- [ ] **Service: Analytics Tracking**
  - Track vues posts (unique par user)
  - Track temps lecture
  - Track interactions
  - Agrégation données en batch
  - Export vers analytics DB

---

### 🔐 Sécurité & Validation

- [ ] **Middleware: Content Sanitization**
  - DOMPurify pour HTML/XSS
  - Détection injection SQL dans commentaires
  - Validation regex pour liens
  - Détection spam/bot patterns
  - Reject avec 400 Bad Request

- [ ] **Middleware: Rate Limiting**
  - Posts: 10/jour par user
  - Comments: 50/heure par user
  - Likes: 500/heure par user
  - Shares: 20/jour par user
  - Retourne: 429 Too Many Requests

- [ ] **Middleware: Authentication Required**
  - Vérification JWT token
  - Refresh si expiré
  - Blacklist tokens révoqués
  - Retourne: 401 Unauthorized

- [ ] **Service: Content Moderation AI**
  - Détection contenu NSFW (images)
  - Détection discours haineux (text)
  - Détection informations personnelles (regex)
  - Auto-flag pour review
  - Queue modération

- [ ] **Middleware: Spam Detection**
  - Détection posts dupliqués
  - Détection liens suspicieux
  - Pattern matching comportement bot
  - Auto-ban si score > seuil
  - Alert sécurité

---

### 💾 Database Schema

- [ ] **Table: `feed_posts`**
  ```sql
  - id (UUID, PK)
  - user_id (UUID, FK -> users)
  - type (ENUM: user_post, narrative)
  - content (TEXT, nullable)
  - media_urls (JSONB, nullable)
  - location (VARCHAR, nullable)
  - likes_count (INT, default 0)
  - comments_count (INT, default 0)
  - shares_count (INT, default 0)
  - views_count (INT, default 0)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
  - deleted_at (TIMESTAMP, nullable)
  - INDEX (user_id, created_at)
  - INDEX (type, created_at)
  ```

- [ ] **Table: `feed_comments`**
  ```sql
  - id (UUID, PK)
  - post_id (UUID, FK -> feed_posts)
  - user_id (UUID, FK -> users)
  - content (TEXT)
  - likes_count (INT, default 0)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
  - deleted_at (TIMESTAMP, nullable)
  - INDEX (post_id, created_at)
  ```

- [ ] **Table: `feed_likes`**
  ```sql
  - id (UUID, PK)
  - post_id (UUID, FK -> feed_posts, nullable)
  - comment_id (UUID, FK -> feed_comments, nullable)
  - user_id (UUID, FK -> users)
  - created_at (TIMESTAMP)
  - UNIQUE (post_id, user_id)
  - UNIQUE (comment_id, user_id)
  ```

- [ ] **Table: `feed_reactions`**
  ```sql
  - id (UUID, PK)
  - post_id (UUID, FK -> feed_posts)
  - user_id (UUID, FK -> users)
  - emoji (VARCHAR(10))
  - created_at (TIMESTAMP)
  - UNIQUE (post_id, user_id)
  ```

- [ ] **Table: `feed_saves`**
  ```sql
  - id (UUID, PK)
  - post_id (UUID, FK -> feed_posts)
  - user_id (UUID, FK -> users)
  - created_at (TIMESTAMP)
  - UNIQUE (post_id, user_id)
  ```

- [ ] **Table: `feed_reports`**
  ```sql
  - id (UUID, PK)
  - post_id (UUID, FK -> feed_posts, nullable)
  - comment_id (UUID, FK -> feed_comments, nullable)
  - reporter_id (UUID, FK -> users)
  - reason (ENUM: spam, harassment, nsfw, ...)
  - details (TEXT, nullable)
  - status (ENUM: pending, reviewed, dismissed)
  - reviewed_by (UUID, FK -> users, nullable)
  - created_at (TIMESTAMP)
  - reviewed_at (TIMESTAMP, nullable)
  ```

- [ ] **Table: `feed_narratives_generated`**
  ```sql
  - id (UUID, PK)
  - template_id (VARCHAR)
  - category (ENUM: sarcastic, funny, romantic, wisdom, special)
  - content (TEXT)
  - variables (JSONB)
  - user_id (UUID, FK -> users, nullable) -- si personnalisé
  - likes_count (INT, default 0)
  - dislikes_count (INT, default 0)
  - shares_count (INT, default 0)
  - created_at (TIMESTAMP)
  - expires_at (TIMESTAMP) -- cache 5 min
  ```

---

### 🧪 Tests à Implémenter

- [ ] **Unit Tests: Feed Service**
  - Test génération narratifs
  - Test remplacement variables
  - Test sélection catégorie
  - Test mocking données utilisateur

- [ ] **Integration Tests: Feed API**
  - Test CRUD posts
  - Test CRUD comments
  - Test likes/reactions
  - Test pagination
  - Test filtres

- [ ] **E2E Tests: Feed Workflow**
  - Test création post + like + comment
  - Test partage post en story
  - Test signalement + modération
  - Test feed personnalisé

- [ ] **Security Tests: Penetration**
  - Test XSS dans commentaires
  - Test SQL injection
  - Test CSRF sur likes
  - Test rate limiting bypass
  - Test broken access control

- [ ] **Performance Tests: Load**
  - Test 1000 req/s sur feed endpoint
  - Test pagination lourde
  - Test génération narratifs en masse
  - Test WebSocket scaling

---

### 🚀 Optimisations Performance

- [ ] **Redis Cache**
  - Cache feed utilisateur (5 min)
  - Cache narratifs générés (5 min)
  - Cache stats posts (1 min)
  - Cache compteurs (real-time)
  - Invalidation intelligente

- [ ] **Database Indexing**
  - Index composites (user_id, created_at)
  - Index full-text search (content)
  - Partitioning par date
  - Archivage posts > 1 an

- [ ] **CDN & Media**
  - Upload images vers S3/CloudFlare
  - Resize automatique (thumbnails)
  - Lazy loading feed infini
  - Video streaming optimisé

- [ ] **Background Jobs**
  - Queue génération narratifs (Bull/BullMQ)
  - Queue modération AI
  - Queue analytics aggregation
  - Queue cleanup posts expirés

---

### 📚 Documentation API

- [ ] **OpenAPI/Swagger Spec**
  - Tous les endpoints documentés
  - Exemples request/response
  - Codes erreurs expliqués
  - Rate limits indiqués

- [ ] **Postman Collection**
  - Collection complète endpoints
  - Environnements (dev, staging, prod)
  - Tests automatisés
  - Variables partagées

---

## 🎯 Priorités de Développement

### Phase 1 (MVP) - Semaine 1-2
1. ✅ CRUD posts basique
2. ✅ Likes toggle
3. ✅ Feed GET paginé
4. ✅ Service génération narratifs
5. ✅ Auth middleware

### Phase 2 (Core Features) - Semaine 3-4
1. ⚠️ Commentaires complets
2. ⚠️ Réactions emoji
3. ⚠️ Partage en story
4. ⚠️ Sauvegarde favoris
5. ⚠️ WebSocket temps réel

### Phase 3 (Advanced) - Semaine 5-6
1. 🔜 Signalement & modération
2. 🔜 Analytics détaillés
3. 🔜 Stories complètes
4. 🔜 Notifications push
5. 🔜 Content moderation AI

### Phase 4 (Security & Scale) - Semaine 7-8
1. 🔒 Security hardening complet
2. 🔒 Pentest OWASP Top 10
3. 🚀 Optimisations performance
4. 🚀 Load testing
5. 📊 Monitoring & alerting

---

## 🛡️ Checklist Sécurité OWASP Top 10

- [ ] **A01:2021 – Broken Access Control**
  - Authorization checks sur TOUS les endpoints
  - Vérification ownership posts/comments
  - RBAC pour admin/modérateurs
  - Test avec différents rôles

- [ ] **A02:2021 – Cryptographic Failures**
  - HTTPS obligatoire (force redirect)
  - Tokens JWT sécurisés (RS256)
  - Secrets en variables d'environnement
  - Pas de données sensibles en logs

- [ ] **A03:2021 – Injection**
  - Sanitization DOMPurify côté frontend
  - Parameterized queries (ORM)
  - Validation zod/joi sur inputs
  - WAF contre injections

- [ ] **A04:2021 – Insecure Design**
  - Architecture review sécurité
  - Threat modeling
  - Principe moindre privilège
  - Design patterns sécurisés

- [ ] **A05:2021 – Security Misconfiguration**
  - Désactiver stack traces en prod
  - Headers sécurité (HSTS, CSP, etc.)
  - CORS restrictif
  - Logs d'erreurs sécurisés

- [ ] **A06:2021 – Vulnerable Components**
  - Scan dépendances (npm audit)
  - Updates réguliers packages
  - Snyk/Dependabot activé
  - Vérification licences

- [ ] **A07:2021 – Authentication Failures**
  - Rate limiting login (5 tentatives/15min)
  - MFA optionnel
  - Session timeout (30min)
  - Rotation tokens

- [ ] **A08:2021 – Software and Data Integrity**
  - Signature packages npm
  - Vérification checksums
  - CI/CD pipeline sécurisé
  - Code signing

- [ ] **A09:2021 – Security Logging Failures**
  - Logging toutes actions sensibles
  - SIEM intégration
  - Alertes anomalies
  - Retention logs (90 jours)

- [ ] **A10:2021 – Server-Side Request Forgery**
  - Validation URLs externes
  - Whitelist domaines autorisés
  - Pas de redirect non validés
  - Timeout requests externes

---

**Dernière mise à jour:** 2025-01-03
**Responsable Backend:** [À définir]
**Reviewed by:** [À définir]
