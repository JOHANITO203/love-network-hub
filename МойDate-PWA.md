**Cahier des charges МойDate – PWA v1.0**

0. **Résumé exécutif**
- Type : application Web progressive installable (Android, desktop, iOS ≥ 16.4 via « Ajouter à l’écran d’accueil ») avec notifications Web Push (limites iOS cf. § 6). (Source : MDN Web Docs, 2024)
- Public cible : russophones (priorité russe) ainsi que résidents locaux et expatriés en Russie.
- Périmètre MVP : onboarding, profils, matching, messagerie temps réel, traduction in-app, localisation, paiements premium, vérification 18+ non punitive, modération média, web push.
- Conformité Russie : 152-FZ (données personnelles), 242-FZ (localisation), 436-FZ (protection des mineurs), règles 2023 sur transferts transfrontaliers (notification Roskomnadzor). Hébergement primaire en Russie. (Source : DLA Piper Data Protection, 2023)

1. **Expérience & parcours utilisateur (Web)**
1.1 **Parcours MVP**
- Onboarding : email/VK ID*, mot de passe, préférences (genre/orientation, tranche d’âge, distance, centres d’intérêt, signe astro, langue).
- Localisation : opt-in (navigator.geolocation, consentement HTTPS) ou saisie ville (fallback). (Source : MDN Web Docs, 2024)
- *VK ID : SSO courant Russie (OAuth2). (Source : Auth.js, 2024)
- Feed cartes : Like / Super-like / Pass → double-match → chat.
- Chat temps réel avec traduction à la demande RU↔EN.
- Vérification 18+ post-création (bannière + carte profil), incitative, boost léger.
- Boutique premium web : boosts, super-likes, abonnements via moyens de paiement locaux (SBP, MIR, SberPay, YooKassa/CloudPayments). (Sources : YooKassa 2024, Sberbank eCom 2024)

1.2 **PWA installable**
- Manifest, Service Worker, HTTPS → installation (« Installer l’app »). iOS : installation via Safari > Ajouter à l’écran d’accueil. (Sources : web.dev 2024, MDN Web Docs 2024)
- Mode hors-ligne léger via Workbox : shell + derniers profils en cache.

1.3 **Accessibilité & i18n**
- Objectif WCAG 2.1 AA (contraste, navigation clavier, aria-live sur événements match/like). (Source : W3C, 2018)
- Langues RU/EN avec bascule instantanée.

2. **Fonctionnalités MVP**
2.1 **Onboarding & Auth**
- Email + mot de passe ou VK ID OAuth ; 2FA email.
- Gestion consentements 152-FZ (horodatage, finalités, traçabilité). (Source : DLA Piper Data Protection, 2023)

2.2 **Profils**
- Informations : bio, photos (≤ 9), astro, intérêts, langues, ville/rayon (opt-in).
- Modération média : pré-filtrage client NSFWJS (TensorFlow.js) + contrôles serveur. (Source : GitHub NSFWJS, 2023)
- Vérification 18+ (selfie + doc via SDK tiers) incitative, badge + boost ~3 %, conforme 436-FZ. (Source : Wikipedia – Federal Law 436, 2024)

2.3 **Matching**
- Score pondéré : distance (PostGIS ST_DWithin), co-présence, intérêts, langues, astro optionnel, objectifs relationnels, signaux comportementaux (dwell, retours).
- Pondérations évolutives (apprentissage léger) selon logique produit existante.
- Distance via PostGIS geography + index GiST. (Source : PostGIS Docs, 2024)

2.4 **Messagerie temps réel**
- WebSocket natif (fallback SSE).
- Statuts en ligne, saisie, lecture.
- Traduction message par message RU↔EN (Marian/OPUS-MT serveur ou Bergamot WASM pour résidence données). (Source : GitHub Marian MT, 2024)

2.5 **Notifications**
- Web Push VAPID (Chrome/Firefox/Edge desktop & Android).
- iOS ≥ 16.4 : uniquement pour PWA installée via APNs (Safari) ; aucune notification pour site non installé. (Source : Apple Developer, 2024)
- Fallback email en cas de refus push.

2.6 **Paiements web**
- Intégration YooKassa et/ou CloudPayments (SBP, MIR, cartes locales, SberPay, 3DS). (Sources : YooKassa Docs, 2024 ; CloudPayments Docs, 2024)
- Produits : abonnements, super-likes, boosts.

2.7 **Conformité & sécurité**
- Respect 152-FZ, 242-FZ, 436-FZ, notification transferts transfrontaliers (Roskomnadzor).
- Suppression de compte/données en libre-service (retrait consentement). (Source : DLA Piper Data Protection, 2023)

3. **Architecture web**
3.1 **Frontend**
- Stack recommandée : Next.js 14+/TypeScript, React Query, Zustand/Redux, PWA installable.
- Service Worker Workbox : cache-first shell/assets, network-first feed/chat, Background Sync pour likes/messages offline.
- Localisation RU/EN, prêt RTL, lazy-loading images (`loading="lazy"`, largeur/hauteur fixes). (Source : web.dev, 2024)

3.2 **Backend & données**
- API REST/GraphQL (Node.js / NestJS ou Go).
- PostgreSQL 15+, PostGIS pour géo, pgvector pour embeddings. (Source : GitHub pgvector, 2024)
- Redis pour cache/sessions.
- Temps réel : WebSocket (Socket.IO ou ws).
- Traduction : microservice Marian/OPUS-MT (CPU) ou Bergamot WASM.
- Stockage médias : Object storage S3-compatible hébergé en Russie (ex. Yandex Object Storage ru-central1). (Source : Yandex Cloud Docs, 2024)

3.3 **Hébergement & résidence**
- Compute, DB, objets situés en Russie (Yandex Cloud ru-central1 ou VK Cloud).
- Politique de réplication vers l’UE uniquement après notification Roskomnadzor.

4. **Sécurité Web**
- Sessions : cookies HttpOnly, Secure, SameSite=Lax/Strict + CSRF token. (Source : OWASP Cheat Sheet Series, 2023)
- CSP restrictive, SRI sur bundles, protections XSS.
- TLS 1.2+ obligatoire ; mots de passe hashés Argon2id/bcrypt cost élevé.
- Modération : filtres client + serveur, reporting in-app.
- E2EE chat possible post-MVP (libsignal web à étudier). (Source : GitHub signalapp/libsignal, 2024)

5. **Performance & qualité**
- Cibles Core Web Vitals : LCP < 2,5 s, CLS < 0,1, INP < 200 ms. (Source : web.dev Core Web Vitals, 2024)
- Optimisations : images responsives, HTTP/2, preconnect, code splitting, lazy-loading.

6. **Notifications Web – limites iOS**
- iOS/iPadOS ≥ 16.4 : push autorisé uniquement via PWA installée (APNs). (Source : Apple Developer, 2024)
- Android/Desktop : Web Push standard via Service Worker.

7. **Paiements – Russie**
- Méthodes prioritaires : SBP (СБП), MIR, SberPay, cartes locales via agrégateurs. (Sources : YooKassa Docs, 2024 ; CloudPayments Docs, 2024)
- Abonnements récurrents si support PSP, 3DS géré par l’acquéreur.

8. **Conformité Russie (checklist)**
- 152-FZ : consentement explicite, droits d’accès/retrait, journalisation. (Source : DLA Piper Data Protection, 2023)
- 242-FZ : stockage primaire en Russie, éventuelle réplication après notification.
- Transferts transfrontaliers (depuis 01/03/2023) : notification préalable Roskomnadzor + évaluation garanties.
- 436-FZ : contenus adaptés > 18 ans ; vérification incitative maintenue.

9. **Spécifications techniques (MVP)**
9.1 **Front-end**
- Next.js PWA, manifest.json, Service Worker Workbox.
- Géolocalisation via `navigator.geolocation` (gestion refus). (Source : MDN Web Docs, 2024)
- Gestion médias : lazy-loading, contraintes dimensions.

9.2 **Back-end**
- Endpoints REST/GraphQL + WebSocket `/ws` (chat/presence).
- Matching : jobs planifiés + recalcul incrémental sur événements.
- PostGIS ST_DWithin, index GiST. (Source : PostGIS Docs, 2024)
- pgvector pour similarité cosinus. (Source : GitHub pgvector, 2024)
- Traduction : microservice Marian/OPUS-MT (latence cible < 300 ms intra-RU).
- Web Push : stockage clés VAPID, envoi via `web-push` Node. (Source : GitHub web-push, 2024)
- Upload médias : pré-signé vers S3-compatible (Yandex Object Storage). (Source : Yandex Cloud Docs, 2024)

9.3 **Sécurité**
- CSRF par token synchronizer ou double-submit + SameSite. (Source : OWASP Cheat Sheet Series, 2023)
- CSP, rate limiting, device fingerprint léger anti-fraude.
- Logs pseudonymisés (accès/erreurs).

10. **KPI & qualité**
- Installations PWA / visiteurs.
- Opt-in géolocalisation, opt-in push.
- Messages livrés < 1 s (objectif ≥ 99,5 %) ; taux erreurs < 0,5 %.
- Core Web Vitals dans zone verte (LCP/CLS/INP).

11. **Roadmap indicative**
- **Sprint 1–2 (4–6 sem.)** : design system, Next.js PWA (SW), onboarding/profils, modération client (NSFWJS), distance PostGIS, matching règles.
- **Sprint 3–4** : chat WebSocket, traduction (Marian/Bergamot), Web Push (desktop/Android), paiements SBP via YooKassa/CloudPayments. (Source : YooKassa Docs, 2024)
- **Sprint 5–6** : vérification 18+, boost vérifié, tuning pondérations, optim INP/LCP, exports consentements.

12. **Décisions à trancher**
- Activer VK ID SSO dès MVP ? (Source : Auth.js, 2024)
- Choix traduction : service serveur Marian (CPU) vs WASM local Bergamot (confidentialité, support navigateurs). (Source : GitHub Bergamot, 2024)
- Agrégateur paiement principal : YooKassa vs CloudPayments (couverture SBP/abonnements). (Sources : YooKassa Docs 2024, CloudPayments Docs 2024)
- E2EE chat : à planifier post-MVP (libsignal web). (Source : GitHub signalapp/libsignal, 2024)

**Annexe A – Références**
- MDN Web Docs, 2024 – PWA installables, géolocalisation, lazy-loading.
- web.dev, 2024 – PWA, Service Worker, Core Web Vitals.
- Apple Developer, 2024 – Web Push iOS 16.4+.
- W3C WCAG 2.1, 2018 – Accessibilité.
- Auth.js, 2024 – VK ID OAuth.
- PostGIS Docs, 2024 – ST_DWithin, indexation.
- GitHub (Marian MT, Bergamot, pgvector, NSFWJS, web-push, libsignal), 2023-2024.
- Yandex Cloud Docs, 2024 – Object Storage ru-central1.
- YooKassa & CloudPayments Docs, 2024 – SBP, MIR, SberPay.
- Sberbank eCom, 2024 – SberPay Web.
- DLA Piper Data Protection, 2023 – 152-FZ, 242-FZ, transferts transfrontaliers.
- Wikipedia – Federal Law 436-FZ, 2024.
- OWASP Cheat Sheet Series, 2023 – CSRF/SameSite.
**Cahier des charges МойDate – PWA v1.1**

## 0. Résumé exécutif
- Application Web progressive installable (Android, Desktop, iOS ≥ 16.4) avec notifications Web Push et mode offline léger. [R]
- Cible prioritaire : russophones résidant en Russie ou expatriés ; russe langue par défaut, anglais secondaire. [R]
- MVP Web : onboarding (email + VK ID + OTP), profils, matching pondéré, messagerie temps réel, traduction RU↔EN, localisation, paiements premium locaux, vérification 18+ incitative, modération média, notifications Web Push conformes Safari iOS. [R/F]
- Conformité Russie : 152‑FZ (données perso), 242‑FZ (résidence), 436‑FZ (mineurs), notification Roskomnadzor pour transferts transfrontaliers 2023. Hébergement primaire en Russie. [F]

## 1. Approche multi-rôle (exigences consolidées)

### Rôle Produit
- Segment utilisateur confirmé : résidents russophones, étudiants/expats, voyageurs longue durée ; priorité RU, EN option. [R]
- Parcours MVP : onboarding email/password + OTP serveur, VK ID OAuth2, capture préférences, localisation opt-in ou code ville, feed cartes (Like/Pass/Superlike), double-match → chat, traduction en ligne, vérification 18+ incitative (badge + bonus), boutique premium (boosts, superlikes, abonnements). [R]
- Vérification 18+ : Sumsub RU (selfie + document), conservation 30 j, badge + bonus visibilité plafonné, aucun malus. [F/R]
- Paiements : YooKassa ou CloudPayments (SBP, MIR, SberPay, cartes locales, 3DS). Abonnements et achats ponctuels. [F]
- Post-MVP : fil social, badges/jeux, boutique premium élargie (hors MVP). [R]

### Rôle UX & Accessibilité
- Design responsive desktop/mobile, navigation clavier, aria-live pour évènements, contraste WCAG 2.1 AA. [F/R]
- i18n : rafraîchissement RU/EN (UTF-8), bascule instantanée avec fallback RU, stockage locale. [R]
- Gestion offline : bannière état réseau, queue des actions (likes/messages) via Background Sync, messages d’erreur contextualisés. [R]
- Consentements explicites : écrans dédiés (données perso, biométrie, localisation, push), double opt-in, historique consultable. [F]
- Auth UX : OTP server-side (non mocké), feedback temps réel, support VK ID, flows d’erreur contextualisés. [R]

### Rôle Tech Front (PWA)
- Stack recommandée : Next.js 15 / TypeScript (App Router) pour SSR marketing + SPA authentifiée. Alternative (Vite + `vite-plugin-pwa`) documentée si Next non retenu. [R]
- `manifest.webmanifest` complet (nom localisé, icônes multi-résolution, `scope`, `start_url`, `display`). [R]
- Service Worker Workbox : cache-first (shell/assets), network-first (feed/chat), Background Sync (likes/messages), précache marketing. [R]
- Notifications Web Push : abonnement SW (VAPID), backend push orchestrator, compatibilité iOS ≥ 16.4 (APNs via Safari) + fallback email. [F/R]
- Assets : fonts auto-hébergées (fin Google Fonts), images responsive (`<Image/>` Next ou équivalent), lazy-loading avec dimensions pour CLS. [R]

### Rôle Backend & Infra
- Hébergement en Russie : Yandex Cloud ru-central1 ou VK Cloud (PostgreSQL 15 + PostGIS + pgvector, Redis, Object Storage S3-compatible). [F/R]
- Backend : API NestJS (Node) ou Go modulaire, WebSocket Gateway (chat), microservice traduction Marian/OPUS-MT (CPU/GPU RU), job matching (batch + incrémental). [R]
- Abandon Supabase global : migration données vers infra RU ; plan de transition (export, nettoyage clés, rotation tokens). [F/R]
- Géolocalisation : suppression BigDataCloud, adoption service interne ou Yandex Geocoder, stockage géohash 7 + anonymisation rayon. [F/R]
- Stockage média : S3-compatible RU, traitement NSFW (client + serveur) + modération humaine sur signalement. [F/R]

### Rôle Sécurité & Conformité
- 152‑FZ : consentements granulaires, droits accès/retrait/export, registre audit. [F]
- 242‑FZ : données citoyens RU stockées en Russie ; transferts transfrontaliers soumis à notification préalable Roskomnadzor (post-migration). [F]
- 436‑FZ : contenu 18+, vérification incitative, filtres mineurs et bandeaux avertissement. [F]
- RGPD Art.9 (orientation sexuelle) si utilisateurs UE : consentement explicite, finalités documentées. [F]
- Sécurité : cookies HttpOnly/Secure/SameSite, CSRF double soumission, TLS 1.2+, hash Argon2id, secrets hors dépôt, rotation clés KMS. [R]
- Processus incidents : notification Roskomnadzor 24h/72h, playbooks response, journalisation immuable (WORM). [F/R]

### Rôle Data & Performance
- Matching : pondération distance (PostGIS), intérêts (overlap tags), similarité bio (pgvector cosinus), comportement (RR24, reports), astro (poids faible), co-présence, boost interculturel conditionnel. [R]
- Contrôles diversité : ≥ 30 % de profils d’un cluster différent par lot de 20, clamp scores 0..1, bonus vérifié +8 % (cap 12 %) ajusté si déséquilibre RR24 > 5 %. [R]
- Monitoring : OpenTelemetry (traces/logs/metrics) + dashboards SLO (TTI feed < 1,2 s, envoi message < 300 ms P50, uptime backend ≥ 99,9 %). [R]
- Core Web Vitals : LCP < 2,5 s, INP < 200 ms, CLS < 0,1 (prefetch, compression Brotli, optimisation images). [R]
- Analytics hebdo : RR24, Double Match Rate, CTR Like, Chat→10 messages, opt-in push/géo, signalements/1000 impressions. [R]

### Rôle Ops & Fiabilité
- CI/CD (GitHub Actions) : lint/test/build, génération SW/manifest, scan sécurité (SAST). [R]
- Backups chiffrés (Postgres + objets) avec rétention 30/90 j, rotation clés KMS, RBAC admin, audit accès. [R]
- Observabilité & alertes : intégration Grafana/Prometheus ou OpenSearch, alertes sur SLO (feed, chat, paiement, push). [R]
- Runbooks : déploiement RU, rotation certificats, panne push (APNs/FCM), failover base, escalade conformité. [R]

## 2. Plan de développement réaliste vers le MVP PWA

### Phase 0 – Mise au clair & durcissement (1 semaine)
- Recenser fonctionnalités actives/mocks : auth locale (`useAuth`), notifications, chat Supabase, matching stores locaux.
- Régler dettes critiques héritées : corruption i18n (UTF-8), titres HTML, nettoyage assets inutiles, suppression clés Supabase exposées.
- Décider maintien Vite + `vite-plugin-pwa` (option retenue compte tenu du code existant) et planifier migration infra RU (documenter gaps).
- Mettre à jour CI/CD existant (lint, build, tests) et valider fonctionnement sur code actuel.

### Phase 1 – Fondations PWA sur base actuelle (2 semaines)
- Ajouter `vite-plugin-pwa` : génération manifest (nom RU/EN, icônes), Service Worker Workbox, stratégie cache-first shell / network-first données.
- Auto-héberger polices & images critiques ; retirer Google Fonts.
- Implémenter gestion offline visible (bannière état réseau, file d’attente actions via Background Sync).
- Centraliser consentements (modale + persistance Supabase ou store local transitoire) en attendant backend RU.

### Phase 2 – Auth, profils, localisation (2 semaines)
- Remplacer auth mockée par flux serveur : e-mail + OTP Supabase (transitoire) puis préparer passerelle RU ; intégrer VK ID via OAuth.
- Connecter pages onboarding/profils aux tables Supabase existantes (et prévoir schéma Postgres RU identique). Nettoyer fallback stores.
- Sécuriser géolocalisation : supprimer reverse BigDataCloud, ajouter fallback code ville, introduire service proxy (même Supabase Edge) temporaire.
- Journaliser consentements localisation/biométrie (même si base RU pas encore prête).

### Phase 3 – Matching, chat, traduction (3 semaines)
- Durcir endpoints Supabase : feed, votes, interactions → éliminer mocks, ajouter validations ; instrumenter scoring existant côté DB.
- Stabiliser WebSocket chat (Supabase Edge) et préparer migration vers backend RU (abstraction interface).
- Optimiser service traduction (Edge Supabase Marian) et planifier déploiement miroir RU ; gérer quotas et cache.
- Implémenter indicateurs diversité/équité côté front + exports analytiques (RR24, DMR) à partir des données existantes.

### Phase 4 – Notifications & Pousses (2 semaines)
- Mettre en place Web Push complet : subscription SW, stockage tokens, orchestrateur Node (peut démarrer sur Supabase edge functions) avec VAPID ; fallback e-mails.
- Gestion spécifique iOS ≥ 16.4 : cape `showInstallPrompt`, documentation APNs via Safari (préparer backend RU).
- Brancher Notification Center sur données temps réel (supprimer mocks), aligner préférences push/email/in-app stockées Supabase.
- Tester scénarios offline/permission (granted, denied, default) sur navigateurs cibles.

### Phase 5 – Vérification 18+, paiements, conformité (3 semaines)
- Intégrer Sumsub 18+ (mode test) avec webhooks vers Supabase (puis BI RU) ; stocker hash, purge images 30 j.
- Implémenter YooKassa ou CloudPayments (selon contrat) : page paiement, webhook vérifié, gestion 3DS, mapping produits (boosts/superlikes/abos).
- Mettre en place suppression/export compte self-service, pages consentements, journaux audit (même Supabase).
- Documenter plan migration données vers RU, y compris duplication Postgres + storage (scripts d’export).

### Phase 6 – Qualité, conformité & lancement (2 semaines)
- Tests unitaires/mocking mis à jour (matching, push, traduction), scénarios E2E (Cypress ou Playwright) tenant compte PWA installée.
- Audits Core Web Vitals + Lighthouse PWA, revue sécurité (CSP, headers, secrets). Documenter résidus non conformes et plan RU.
- Déployer monitoring (Sentry/Logflare transitoire, plan Grafana RU), alertes sur SLO principaux.
- Préparer dossier Roskomnadzor (notification transferts), check-list Apple/Google Web Push, plan support incident.

### Phase continue – Migration RU & stabilisation
- Migrer progressivement données vers infra RU (réplication Postgres, storage S3, remplacement endpoints Supabase).
- Lancer beta fermée, suivre KPI hebdo (RR24, DMR, opt-in push/géo), ajuster pondérations matching et bonus.
- Roadmap post-MVP : fil social, badges, E2EE chat (libsignal), Bergamot on-device, extension linguistique.

## 3. Références clés
- MDN / web.dev (PWA, Service Worker, Web Push, Core Web Vitals). [R]
- Apple Developer (Web Push iOS 16.4+, guidelines). [F]
- Yandex Cloud & VK Cloud (hébergement RU). [F]
- YooKassa / CloudPayments (SBP, MIR, SberPay). [F]
- Sumsub (vérification 18+ RU-ready). [F]
- DLA Piper Data Protection, ALRUD, Roskomnadzor (152‑FZ, 242‑FZ, transferts 2023). [F]
- PostGIS, pgvector, Marian/OPUS-MT, Bergamot, NSFWJS, libsignal. [R]
