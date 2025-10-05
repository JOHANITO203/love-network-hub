# МойDate - Coûts Complets d'Infrastructure
**Version:** 1.0.0
**Date:** 2025-10-04
**Budget:** MVP → Croissance → Scale

---

## 📋 Table des Matières

1. [Résumé Exécutif](#résumé-exécutif)
2. [Hébergement Cloud](#1-hébergement-cloud)
3. [Base de Données](#2-base-de-données)
4. [Stockage Fichiers](#3-stockage-fichiers-imagesvidéos)
5. [Message Broker](#4-message-broker-rabbitmq)
6. [APIs Tierces](#5-apis-tierces)
7. [Notifications](#6-notifications-push)
8. [Paiements](#7-paiements)
9. [Monitoring & Logs](#8-monitoring--logs)
10. [CDN & DNS](#9-cdn--dns)
11. [Sécurité](#10-sécurité)
12. [Développement](#11-développement--cicd)
13. [Total par Phase](#total-par-phase)

---

## Résumé Exécutif

### 💰 Coûts Totaux Estimés

| Phase | Utilisateurs | Coût/mois | Coût/an |
|-------|-------------|-----------|---------|
| **MVP (Phase 1)** | 100-1,000 | **$250-350** | **$3,000-4,200** |
| **Croissance (Phase 2)** | 10,000 | **$800-1,200** | **$9,600-14,400** |
| **Scale (Phase 3)** | 50,000+ | **$2,500-4,000** | **$30,000-48,000** |

**Note:** Prix en USD pour comparaison internationale. Équivalent RUB: ×90 (ex: $250 = ₽22,500)

---

## 1. Hébergement Cloud

### Option A: AWS (International)

#### Phase 1 - MVP (100-1K users)

| Service | Config | Usage | Prix/mois |
|---------|--------|-------|-----------|
| **EC2 Instances** | 3× t3.medium (services) | 24/7 | $90 |
| **Load Balancer** | Application LB | 1 | $20 |
| **Route 53** | DNS hosted zone | 1 | $1 |
| **Elastic IP** | IP statique | 1 | $4 |
| **Data Transfer** | Sortant | ~100GB | $10 |
| **TOTAL AWS** | | | **~$125/mois** |

#### Phase 2 - Croissance (10K users)

| Service | Config | Usage | Prix/mois |
|---------|--------|-------|-----------|
| **EC2 Instances** | 8× t3.large (auto-scaling) | 24/7 | $480 |
| **Load Balancer** | Application LB | 1 | $25 |
| **Route 53** | DNS | 1 | $1 |
| **Elastic IP** | IP statique | 2 | $8 |
| **Data Transfer** | Sortant | ~1TB | $90 |
| **TOTAL AWS** | | | **~$604/mois** |

### Option B: Yandex Cloud (Russie - Recommandé marché RU)

#### Phase 1 - MVP

| Service | Config | Usage | Prix/mois (RUB) | Prix/mois (USD) |
|---------|--------|-------|-----------------|-----------------|
| **Compute Cloud** | 3× s2.medium (2 vCPU, 8GB) | 24/7 | ₽12,000 | $133 |
| **Load Balancer** | Network LB | 1 | ₽1,500 | $17 |
| **DNS** | Cloud DNS | 1 | ₽300 | $3 |
| **Data Transfer** | Sortant | 100GB | ₽900 | $10 |
| **TOTAL Yandex** | | | **₽14,700** | **~$163/mois** |

#### Phase 2 - Croissance

| Service | Config | Usage | Prix/mois (RUB) | Prix/mois (USD) |
|---------|--------|-------|-----------------|-----------------|
| **Compute Cloud** | 8× s2.large (4 vCPU, 16GB) | 24/7 | ₽48,000 | $533 |
| **Load Balancer** | Network LB | 1 | ₽2,000 | $22 |
| **DNS** | Cloud DNS | 1 | ₽500 | $6 |
| **Data Transfer** | Sortant | 1TB | ₽9,000 | $100 |
| **TOTAL Yandex** | | | **₽59,500** | **~$661/mois** |

---

## 2. Base de Données

### PostgreSQL (11 services = 11 DB instances)

#### Phase 1 - MVP

**Option A: Self-hosted (moins cher)**

| Service DB | Config | Prix/mois |
|------------|--------|-----------|
| PostgreSQL master | t3.medium (2 vCPU, 4GB) | $30 |
| PostgreSQL replicas | 2× t3.small | $30 |
| **TOTAL Self-hosted** | | **$60/mois** |

**Option B: Managed (AWS RDS)**

| Service | Config | Prix/mois |
|---------|--------|-----------|
| **RDS PostgreSQL** | db.t3.medium | $80 |
| **Backups automatiques** | 100GB | $10 |
| **Multi-AZ** | Haute disponibilité | +$80 |
| **TOTAL RDS (sans Multi-AZ)** | | **$90/mois** |
| **TOTAL RDS (avec Multi-AZ)** | | **$170/mois** |

**Option C: Supabase (Managed + Features)**

| Plan | Base données | Stockage | Auth | Realtime | Prix/mois |
|------|--------------|----------|------|----------|-----------|
| **Free** | 500MB | 1GB | ✅ | Limité | **$0** |
| **Pro** | 8GB | 100GB | ✅ | ✅ | **$25** |
| **Team** | 20GB | 200GB | ✅ | ✅ | **$99** |

#### Phase 2 - Croissance

| Option | Config | Prix/mois |
|--------|--------|-----------|
| **Self-hosted** | db.r6g.large + replicas | $300 |
| **AWS RDS** | db.r6g.large Multi-AZ | $450 |
| **Supabase Team** | 20GB + extensions | $99 |

---

## 3. Stockage Fichiers (Images/Vidéos)

### Photos utilisateurs (6 photos × utilisateurs)

#### Phase 1 - MVP (1K users, 6K photos)

**Calcul stockage:**
- 6,000 photos × 500KB moyenne = **3GB**
- Messages photos: +2GB/mois
- Vidéos messages: +5GB/mois
- **Total: ~10GB mois 1 → 50GB mois 6**

**Option A: AWS S3**

| Item | Usage | Prix/mois |
|------|-------|-----------|
| **Stockage** | 50GB | $1.15 |
| **Upload (PUT)** | 10K requêtes | $0.05 |
| **Download (GET)** | 100K requêtes | $0.40 |
| **Data transfer out** | 10GB | $0.90 |
| **TOTAL S3** | | **~$2.50/mois** |

**Option B: Cloudinary (avec optimisation auto)**

| Plan | Stockage | Bande passante | Transformations | Prix/mois |
|------|----------|----------------|-----------------|-----------|
| **Free** | 25GB | 25GB | 25K | **$0** |
| **Plus** | 100GB | 100GB | 100K | **$99** |

**Option C: Yandex Object Storage**

| Item | Usage | Prix/mois (RUB) | Prix/mois (USD) |
|------|-------|-----------------|-----------------|
| **Stockage** | 50GB | ₽500 | $6 |
| **Requêtes** | 100K | ₽300 | $3 |
| **Trafic sortant** | 10GB | ₽900 | $10 |
| **TOTAL Yandex Storage** | | **₽1,700** | **~$19/mois** |

#### Phase 2 - Croissance (10K users, 300GB stockés)

| Option | Stockage | Trafic | Prix/mois |
|--------|----------|--------|-----------|
| **AWS S3** | 300GB + 100GB/mois trafic | $25 |
| **Cloudinary Plus** | 100GB (limite) | $99 |
| **Yandex Storage** | 300GB + 100GB trafic | ₽9,000 (~$100) |

---

## 4. Message Broker (RabbitMQ)

### Options

#### Phase 1 - MVP

| Option | Config | Prix/mois |
|--------|--------|-----------|
| **Self-hosted VPS** | 4GB RAM Droplet | $20 |
| **CloudAMQP Free** | 1M messages/mois | **$0** |
| **CloudAMQP Tough Tiger** | 10M messages/mois | **$19** |

**Recommandation:** CloudAMQP Free pour MVP ($0), puis Tough Tiger ($19)

#### Phase 2 - Croissance (30M messages/mois)

| Option | Messages/mois | Prix/mois |
|--------|---------------|-----------|
| **CloudAMQP Roaring Rabbit** | 100M | $99 |
| **Self-hosted (t3.large)** | Illimité | $60 |

---

## 5. APIs Tierces

### 5.1 Traduction (DeepL + Google Fallback)

#### DeepL API

| Plan | Caractères/mois | Prix/mois |
|------|-----------------|-----------|
| **Free** | 500K caractères | **$0** |
| **Pro** | 10M caractères | **$25** |
| **Advanced** | 100M caractères | **$99** |

**Calcul МойDate (10K users Premium):**
- 10K users Premium × 50 messages traduits/mois × 100 caractères = **50M caractères/mois**
- **Plan: Advanced à $99/mois**

#### Google Translate (Fallback gratuit)

| Plan | Caractères/mois | Prix |
|------|-----------------|------|
| **Free tier** | 500K/mois | **$0** |
| **Pay-as-you-go** | Au-delà | $20/1M caractères |

**Recommandation:** Google gratuit pour Free users, DeepL pour Premium

**Total traduction Phase 1:** $0-25/mois
**Total traduction Phase 2:** $99/mois

---

### 5.2 Géolocalisation (Google Maps / OpenStreetMap)

#### Google Maps API

| API | Usage/mois | Prix gratuit | Prix payant |
|-----|-----------|--------------|-------------|
| **Geocoding** | 10K requêtes | 40K gratuit | $5/1K au-delà |
| **Distance Matrix** | 50K requêtes | 40K gratuit | $5/1K au-delà |

**Phase 1 (1K users):** Gratuit (dans limite)
**Phase 2 (10K users):** ~$50/mois

#### Alternative: OpenStreetMap (Nominatim)

| Service | Prix |
|---------|------|
| **Self-hosted Nominatim** | Gratuit (serveur ~$10/mois) |
| **API tierce (LocationIQ)** | 5K/jour gratuit, puis $50/mois |

**Recommandation:** OpenStreetMap/LocationIQ gratuit

---

### 5.3 SMS (Vérification numéros)

| Provider | SMS/mois | Prix/SMS | Total/mois |
|----------|----------|----------|------------|
| **Twilio** | 1,000 | $0.05 | $50 |
| **AWS SNS** | 1,000 | $0.04 | $40 |
| **SMS.ru** (Russie) | 1,000 | ₽1.5 ($0.017) | ₽1,500 ($17) |

**Phase 1:** ~$20/mois (vérifications)
**Phase 2:** ~$100/mois

---

## 6. Notifications Push

### Firebase Cloud Messaging (FCM)

| Service | Notifications/mois | Prix |
|---------|-------------------|------|
| **Push notifications** | Illimité | **GRATUIT** ✅ |
| **Analytics** | Illimité | **GRATUIT** ✅ |

**Total FCM:** **$0/mois** 🎉

### Supabase Realtime (notifications in-app)

| Plan | Connexions simultanées | Prix/mois |
|------|----------------------|-----------|
| **Free** | 200 | $0 |
| **Pro** | 500 | $25 (inclus dans DB Pro) |
| **Team** | Illimité | $99 (inclus dans DB Team) |

**Total Phase 1:** $0 (avec plan Supabase Free)
**Total Phase 2:** $25-99 (inclus dans DB)

---

## 7. Paiements

### 7.1 Paiements Russes (Prioritaires)

#### MirPay

| Item | Frais |
|------|-------|
| **Commission** | 2-3% par transaction |
| **Frais fixe** | ₽0 |
| **Abonnement mensuel** | ₽0 (gratuit avec banque partenaire) |

#### SberPay / Tinkoff / YooMoney

| Provider | Commission | Frais mensuel |
|----------|-----------|---------------|
| **SberPay** | 2.5% | ₽0 |
| **Tinkoff Acquiring** | 2.8% | ₽0 |
| **YooMoney (YooKassa)** | 2.8% + ₽10 | ₽0 |

**Total Phase 1:** ₽0 fixe, 2-3% commission sur ventes
**Revenue estimé:** ₽500K/mois × 2.5% = ₽12,500/mois ($139)

### 7.2 Paiements Internationaux

#### Stripe

| Item | Frais |
|------|-------|
| **Commission** | 2.9% + $0.30 par transaction |
| **Abonnement** | $0 |
| **Payout** | $0.25 par transfert |

#### Apple Pay / Google Pay

| Provider | Commission |
|----------|-----------|
| **Apple Pay** | 2.9% + $0.30 (via Stripe) |
| **Google Pay** | 2.9% + $0.30 (via Stripe) |

**Total Phase 1:** $0 fixe, 2.9% commission
**Revenue estimé:** $5K/mois × 2.9% = $145/mois

---

## 8. Monitoring & Logs

### 8.1 Monitoring (Prometheus + Grafana)

#### Option A: Self-hosted

| Service | Config | Prix/mois |
|---------|--------|-----------|
| **VPS Monitoring** | 2GB RAM | $10 |
| **Prometheus + Grafana** | Open source | $0 |
| **TOTAL** | | **$10/mois** |

#### Option B: Grafana Cloud

| Plan | Métriques | Logs | Prix/mois |
|------|-----------|------|-----------|
| **Free** | 10K séries | 50GB | $0 |
| **Pro** | 1M séries | 100GB | $49 |

**Recommandation Phase 1:** Grafana Cloud Free ($0)

### 8.2 Error Tracking (Sentry)

| Plan | Events/mois | Prix/mois |
|------|-------------|-----------|
| **Developer (Free)** | 5K errors | $0 |
| **Team** | 50K errors | $26 |
| **Business** | 500K errors | $80 |

**Phase 1:** Free ($0)
**Phase 2:** Team ($26)

### 8.3 Logs (ELK Stack ou Alternatives)

#### Option A: Self-hosted ELK

| Service | Config | Prix/mois |
|---------|--------|-----------|
| **VPS Logs** | 4GB RAM | $20 |
| **Elasticsearch + Kibana** | Open source | $0 |
| **TOTAL** | | **$20/mois** |

#### Option B: Logtail (Managed)

| Plan | Logs/mois | Rétention | Prix/mois |
|------|-----------|-----------|-----------|
| **Free** | 1GB | 3 jours | $0 |
| **Starter** | 10GB | 7 jours | $25 |
| **Growth** | 100GB | 30 jours | $99 |

**Recommandation Phase 1:** Logtail Free ($0)

---

## 9. CDN & DNS

### 9.1 CDN (CloudFront / Cloudflare)

#### Cloudflare (Recommandé)

| Plan | Bande passante | DDoS Protection | Prix/mois |
|------|----------------|-----------------|-----------|
| **Free** | Illimitée | Basique | **$0** ✅ |
| **Pro** | Illimitée | Avancée | $20 |
| **Business** | Illimitée | Enterprise | $200 |

**Recommandation:** Cloudflare Free ($0)

#### AWS CloudFront (Alternative)

| Item | Usage | Prix/mois |
|------|-------|-----------|
| **Data transfer** | 100GB/mois | $8.50 |
| **Requêtes HTTP** | 1M | $1 |
| **TOTAL** | | ~$10/mois |

### 9.2 DNS

#### Cloudflare DNS

| Service | Prix |
|---------|------|
| **DNS gratuit** | $0 ✅ |

#### Route 53 (AWS)

| Item | Prix/mois |
|------|-----------|
| **Hosted zone** | $0.50 |
| **Requêtes DNS** | $0.40/1M |
| **TOTAL** | ~$1/mois |

**Recommandation:** Cloudflare DNS gratuit ($0)

---

## 10. Sécurité

### 10.1 SSL/TLS Certificats

| Provider | Type | Prix/an |
|----------|------|---------|
| **Let's Encrypt** | Gratuit | **$0** ✅ |
| **Cloudflare SSL** | Gratuit | **$0** ✅ |
| **DigiCert** | Premium | $200+ |

**Recommandation:** Let's Encrypt ($0)

### 10.2 WAF (Web Application Firewall)

| Provider | Plan | Prix/mois |
|----------|------|-----------|
| **Cloudflare Free** | Basique | $0 |
| **Cloudflare Pro** | Avancé | $20 |
| **AWS WAF** | Pay-per-use | ~$10-50 |

**Recommandation Phase 1:** Cloudflare Free ($0)

### 10.3 DDoS Protection

| Provider | Protection | Prix/mois |
|----------|-----------|-----------|
| **Cloudflare** | Inclus Free | $0 |
| **AWS Shield Standard** | Basique | $0 |
| **AWS Shield Advanced** | Avancée | $3,000 |

**Recommandation:** Cloudflare gratuit ($0)

---

## 11. Développement & CI/CD

### 11.1 Git Hosting

| Provider | Repos privés | CI/CD | Prix/mois |
|----------|--------------|-------|-----------|
| **GitHub Free** | Illimités | 2,000 min/mois | $0 |
| **GitHub Team** | Illimités | 3,000 min/mois | $4/user |
| **GitLab Free** | Illimités | 400 min/mois | $0 |

**Recommandation:** GitHub Free ($0)

### 11.2 CI/CD

| Provider | Minutes build/mois | Prix/mois |
|----------|-------------------|-----------|
| **GitHub Actions Free** | 2,000 min | $0 |
| **GitHub Actions Team** | 3,000 min | $4/user |
| **CircleCI Free** | 6,000 min | $0 |

**Recommandation:** GitHub Actions Free ($0)

### 11.3 Docker Registry

| Provider | Stockage | Pulls | Prix/mois |
|----------|----------|-------|-----------|
| **Docker Hub Free** | 1 repo privé | Illimité | $0 |
| **Docker Hub Pro** | Illimités | Illimité | $5 |
| **GitHub Container Registry** | 500MB gratuit | Illimité | $0 |
| **AWS ECR** | 500MB gratuit | Pay-per-use | ~$1 |

**Recommandation:** GitHub Container Registry ($0)

---

## 12. Emails (Transactionnels)

### SendGrid

| Plan | Emails/mois | Prix/mois |
|------|-------------|-----------|
| **Free** | 100/jour (3K/mois) | $0 |
| **Essentials** | 50K/mois | $20 |
| **Pro** | 1.5M/mois | $90 |

**Phase 1:** Free ($0)
**Phase 2:** Essentials ($20)

### Alternatives

| Provider | Free tier | Prix payant |
|----------|-----------|-------------|
| **Mailgun** | 5K/mois | $35/50K |
| **AWS SES** | 62K/mois | $0.10/1K |
| **Postmark** | 100/mois | $10/10K |

**Recommandation:** SendGrid Free → Essentials

---

## Total par Phase

### 📊 Phase 1 - MVP (100-1K users)

| Catégorie | Service Recommandé | Prix/mois |
|-----------|-------------------|-----------|
| **Hébergement** | Yandex Cloud (3× VMs) | $163 |
| **Base de données** | Supabase Pro | $25 |
| **Stockage** | AWS S3 (50GB) | $3 |
| **RabbitMQ** | CloudAMQP Free | $0 |
| **Traduction** | DeepL Free + Google | $0 |
| **Géolocalisation** | OpenStreetMap | $0 |
| **SMS** | SMS.ru | $20 |
| **Push Notifications** | Firebase (gratuit) | $0 |
| **Paiements** | Commission ~2.5% | ~$140* |
| **Monitoring** | Grafana Cloud Free | $0 |
| **Sentry** | Free | $0 |
| **Logs** | Logtail Free | $0 |
| **CDN** | Cloudflare Free | $0 |
| **DNS** | Cloudflare Free | $0 |
| **SSL** | Let's Encrypt | $0 |
| **CI/CD** | GitHub Actions | $0 |
| **Emails** | SendGrid Free | $0 |
| **TOTAL FIXE** | | **~$211/mois** |
| **TOTAL avec commissions** | | **~$351/mois** |

*Commission paiements = variable selon revenue

---

### 📊 Phase 2 - Croissance (10K users)

| Catégorie | Service | Prix/mois |
|-----------|---------|-----------|
| **Hébergement** | Yandex Cloud (8× VMs scaled) | $661 |
| **Base de données** | Supabase Team | $99 |
| **Stockage** | AWS S3 (300GB) | $25 |
| **RabbitMQ** | CloudAMQP Roaring Rabbit | $99 |
| **Traduction** | DeepL Advanced | $99 |
| **Géolocalisation** | Google Maps API | $50 |
| **SMS** | SMS.ru (vérifications) | $100 |
| **Push Notifications** | Firebase (gratuit) | $0 |
| **Paiements** | Commission ~2.5% | ~$1,200* |
| **Monitoring** | Grafana Cloud Pro | $49 |
| **Sentry** | Team | $26 |
| **Logs** | Logtail Starter | $25 |
| **CDN** | Cloudflare Pro | $20 |
| **DNS** | Cloudflare Free | $0 |
| **SSL** | Let's Encrypt | $0 |
| **CI/CD** | GitHub Actions Team | $12 (3 devs) |
| **Emails** | SendGrid Essentials | $20 |
| **TOTAL FIXE** | | **~$1,285/mois** |
| **TOTAL avec commissions** | | **~$2,485/mois** |

*Commission paiements basée sur $48K revenue/mois estimé

---

### 📊 Phase 3 - Scale (50K+ users)

| Catégorie | Prix/mois |
|-----------|-----------|
| **Hébergement** | $2,000 |
| **Base de données** | $500 |
| **Stockage** | $150 |
| **RabbitMQ** | $299 |
| **APIs tierces** | $400 |
| **Monitoring & Logs** | $300 |
| **CDN** | $100 |
| **Autres** | $250 |
| **TOTAL FIXE** | **~$4,000/mois** |
| **Commissions paiements** | Variable |

---

## 🎯 Stratégies d'Optimisation

### 💡 Réduire les Coûts Phase 1

**1. Utiliser les tiers gratuits au maximum:**
- ✅ Cloudflare (CDN + DNS + SSL)
- ✅ Firebase (push notifications)
- ✅ Supabase Free (si <500MB DB)
- ✅ CloudAMQP Free (si <1M messages)
- ✅ GitHub Actions (CI/CD)
- ✅ SendGrid Free (emails)

**Économie: ~$150/mois**

**2. Self-host ce qui peut l'être:**
- PostgreSQL au lieu de RDS: **-$60/mois**
- RabbitMQ self-hosted: **-$19/mois**
- Monitoring self-hosted: **-$49/mois**

**Économie: ~$128/mois**

**3. Optimiser stockage:**
- Compression images avant upload
- Servir via CDN (cache)
- Supprimer anciennes données

**Économie: ~$10-20/mois**

### 🚀 Total MVP Optimisé

**Budget minimum viable:**
- Hébergement: $100 (VPS partagés)
- DB: $0 (Supabase Free)
- Stockage: $3 (S3)
- Reste: Gratuit

**Total: ~$103/mois** 🎉

---

## 📋 Checklist Abonnements à Prendre

### ✅ Obligatoires Jour 1

- [ ] **Hébergement cloud** (Yandex Cloud / AWS)
- [ ] **Nom de domaine** moydate.ru (~$10/an)
- [ ] **Stockage S3** (AWS / Yandex)

### ✅ Recommandés Semaine 1

- [ ] **Supabase Pro** ($25/mois) - DB + Realtime
- [ ] **Cloudflare Pro** ($20/mois) - CDN + Protection
- [ ] **Sentry** ($26/mois après Free) - Error tracking

### ✅ Avant Lancement Public

- [ ] **CloudAMQP Tough Tiger** ($19/mois) - RabbitMQ
- [ ] **DeepL Pro** ($25/mois) - Traductions Premium
- [ ] **SendGrid Essentials** ($20/mois) - Emails

### ✅ Après 1000 Users

- [ ] **Supabase Team** ($99/mois) - Plus de capacité
- [ ] **CloudAMQP Roaring Rabbit** ($99/mois)
- [ ] **DeepL Advanced** ($99/mois)
- [ ] **Grafana Cloud Pro** ($49/mois)

---

## 💰 Budget Prévisionnel Année 1

| Mois | Users | Coûts fixes | Commissions | Total/mois |
|------|-------|-------------|-------------|------------|
| M1-3 (Dev) | 0 | $103 | $0 | **$103** |
| M4-6 (Beta) | 100-500 | $211 | $50 | **$261** |
| M7-9 (Launch) | 1K-3K | $350 | $200 | **$550** |
| M10-12 (Growth) | 5K-10K | $800 | $800 | **$1,600** |

**Total Année 1:** ~$35,000 (infrastructure)
**Revenue estimé Année 1:** ~$250,000
**Marge brute:** ~86% 🎯

---

## 🎓 Résumé pour Débutant

### Ce que vous DEVEZ payer:

1. **Serveurs** (héberger le code): $100-700/mois
2. **Base de données** (stocker données): $0-100/mois
3. **Stockage fichiers** (photos): $3-25/mois
4. **SMS** (vérification): $20-100/mois
5. **Commissions paiements** (2-3% des ventes): Variable

### Ce qui est GRATUIT:

- Notifications push (Firebase)
- CDN (Cloudflare)
- SSL (Let's Encrypt)
- CI/CD (GitHub Actions)
- Monitoring basique (Grafana Cloud)
- DNS (Cloudflare)

### Budget Minimum Viable:

**$100-200/mois** pour démarrer (version ultra-optimisée)
**$300-400/mois** pour lancement confortable

---

**Des questions sur un service spécifique?** 💰
