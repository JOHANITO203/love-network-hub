# Cahier de charge – МойDate

## 1. Vision produit et positionnement
- **Objectif** : lancer une application de rencontres inclusive, sécurisée et moderne pour le marché russe, positionnée face à VK Dating avec une expérience supérieure (traduction en temps réel, double feed swipe/social, tarification 10 % moins chère).
- **Valeurs clés** : confidentialité, diversité, sécurité émotionnelle, expérience inspirée des réseaux sociaux (TikTok/Instagram), accessibilité multilingue (FR/EN/RU/PT).

## 2. Périmètre fonctionnel détaillé
### 2.1 Authentification et identité
- Connexions VK, TikTok, email/mot de passe, téléphone (OTP SMS ou lien email), biométrie optionnelle.
- Gestion des appareils de confiance, sessions multi-devices, consentement explicite RGPD/RU.

### 2.2 Profils & inclusivité
- Fiche profil : photos, vidéos, interests, bio, occupation, tags personnalisés.
- Orientation supportée : hétéro, gay, lesbienne, avec préférences claires.
- **Discrétion LGBTQ+** : sélection de symboles 🌈/🦄/⚖ dans un module « valeurs & symboles » (stockage privé, non visible publiquement). 
- Paramètres premium : masquer âge/distance, mode incognito, planification boosts.

### 2.3 Géolocalisation et découverte
- Mise à jour temps réel (intervalle configurable, consentement), stockage PostGIS.
- Swipe deck (TikTok-like) + feed social (Instagram-like).
- Distance-based matching avec fallback ville si précision faible.
- Filtres avancés premium (âge, distance, intérêts, valeurs).

### 2.4 Algorithme de matching
- Fusion des données profil, symboles, préférences orientation, distance, activité.
- Scoring multi-phase : base (compatibilité), orientation, persona matching, boosters.
- Symboles LGBTQ+ utilisés pour prioriser les connexions compatibles sans exposition.

### 2.5 Messagerie & traduction
- Chat temps réel (WebSocket), indicateurs (typing, seen), réactions.
- Traduction instantanée FR/EN/RU/PT via microservice (cache + bouton afficher texte original).
- Modération automatique (toxicity scoring) + report manuel.

### 2.6 Social feed
- Publication photos/vidéos, reels, stories, mentions.
- Filtrage chronologique/algorithme, commentaires traduisibles.
- Section « moments » (rencontres IRL) optionnelle.

### 2.7 Premium & monétisation
- Offres : illimité likes, rewind, filtres avancés, superlikes hebdo (x5), boost hebdo, badge, traduction illimitée, cadeaux/boosts supplémentaires selon plan.
- Plans : 1 semaine, 1 mois, 3 mois, 6 mois, 12 mois. Prix toujours 10 % < VK Dating (ex. VK 799 ₽ → 719 ₽). Promo lancement −20 % 3 premiers mois.
- Packs à la carte : boosts, superlikes, cadeaux virtuels.

## 3. Architecture technique cible
### 3.1 Frontend
- React Native + TypeScript (mobile iOS/Android), Expo pour prototypage, support web (Next.js) pour marketing.
- Internationalisation via `react-intl` + détection langue appareil + override.
- Gestion état : Zustand/Redux Toolkit + React Query.

### 3.2 Backend & services
- Backend API existant Supabase : à enrichir (tables, policies, RPC). Long terme : NestJS microservices (Auth, Matching, Feed, Chat, Payment) connectés à la base Supabase/PostgreSQL.
- Communication temps réel : Supabase Realtime ou Socket.IO via passerelle Node.
- Traduction : microservice (Node ou Python) proxy vers AWS Translate / Yandex Translate avec cache Redis.
- OTP : fournisseurs SMS (Nexmo/Infobip) + fallback email.
- Paiements : YooKassa + Stripe (export), pricing engine avec tâche cron.

### 3.3 Données & stockage
- PostgreSQL/PostGIS (Supabase) : tables principales `users`, `profiles`, `locations`, `matches`, `chats`, `messages`, `feed_posts`, `subscriptions`, `plans`, `purchases`, `symbols`, `audit_logs`.
- Stockage média : bucket Supabase Storage ou S3 compatible (chiffrement, signed URLs).
- Cache : Redis pour sessions, translations, matching queue.
- Observabilité : Prometheus/Grafana, Sentry, OpenTelemetry.

### 3.4 Sécurité & conformité
- Hash OTP (HMAC), throttling, monitoring abus.
- Chiffrement PII (Postgres TDE + AES applicatif). Localisation data en Russie (Yandex Cloud/Supabase RU). 
- Politique d’accès rôle-based (Supabase RLS), audit logs, journal `security_events`.
- Filtrage contenu + signalements => pipeline modération (modèles ML + humains).
- Sauvegardes chiffrées, plan DRP, tests pénétration.

## 4. Feuille de route (phases)
### Phase 0 – Alignement & recherche (Semaine 0-2)
- Ateliers produit/UX (positionnement vs VK Dating, besoins inclusifs LGBTQ+).
- Audit Supabase existant (schéma, policies, limitations).
- Définition KPI (MAU, conversion premium, taux traduction).

### Phase 1 – Fondations techniques (Semaine 3-8)
- Refactor typage (TypeScript strict, suppression `any`).
- Mise en place i18n global + gestion langues app.
- Extension Supabase : nouvelles tables (`matches`, `locations`, `subscriptions`, `persona_symbols`).
- Sécurité OTP + session (throttling, device trust).
- Documentation API (OpenAPI/GraphQL schema).

### Phase 2 – Fonctionnalités cœur (Semaine 9-16)
- Refonte ProfileSetup (orientations, symboles, pronoms, privacy).
- Implémentation matching service (supabase functions + worker Node).
- Swipe deck (UI/UX), feed social (MVP), chat en temps réel.
- Traduction chat (intégration service + UI).
- Géolocalisation temps réel (service + UI).

### Phase 3 – Premium & monétisation (Semaine 17-24)
- Plans abonnements + paiements, tarification dynamique vs VK.
- Perks premium (illimité likes, filtrage avancé, rewind, superlike/boost hebdo, badge).
- Gifts/boosts banker (ledger tables + transactions).
- Upsell flows, paywalls localisés.

### Phase 4 – Social & croissance (Semaine 25-32)
- Feed amélioré (stories, reels, commentaires traduits).
- Moments / événements, gamification (succès, streaks).
- Referral programme, promotions (-20 % lancement).
- Modération automatisée, outils support agents.

### Phase 5 – Lancement & itérations (Semaine 33-40)
- Beta fermée RU + QA, tests charge.
- Corrections, features qualité (analytics, A/B testing).
- Go-live + campagne marketing (TikTok, influenceurs).
- Préparation expansion PT, nouveaux symboles, live video.

## 5. Mise à jour Supabase et GitHub
1. **Schema** : créer migrations SQL pour nouvelles tables/colonnes (`persona_symbols`, `matches`, `subscriptions`, `plans`, etc.).
2. **Policies** : définir RLS pour protéger symboles et données sensibles (vue limitée aux services matching). 
3. **Functions & triggers** : matching scores, translation caching, pricing engine.
4. **Seed data** : plans premium, symboles par défaut, prix VK de référence.
5. **CI/CD** : script deploy (Supabase CLI) + GitHub Actions pour synchroniser migrations et seeding.
6. **Documentation** : README/`docs/` pour instructions de déploiement, mapping API ↔ app.

## 6. Plan de livraison
- Utiliser branches par feature (`feature/matching-service`, `feature/chat-translation`, etc.).
- Code review obligatoire, tests unitaires & end-to-end (Jest, Detox, React Testing Library, Supabase tests).
- Déploiement staging via Supabase preview branches, production via approbation manuelle.
- Rétro hebdomadaire, suivi burndown, mise à jour cahier.

## 7. ProChaines actions
1. Valider ce cahier avec stakeholders.
2. Planifier Phase 0 ateliers + audit Supabase (1 sprint).
3. Préparer backlog détaillé (Jira/Linear) aligné sur roadmap.
4. Configurer pipeline Supabase CLI & GitHub Actions.
5. Démarrer internationalisation et refactor typage (stories techniques). 

