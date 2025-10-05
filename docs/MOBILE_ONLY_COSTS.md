# МойDate - Coûts Mobile-Only (Android + iOS)
**Version:** 1.0.0
**Date:** 2025-10-04
**Type:** Application Mobile Native/React Native

---

## 🎯 RÉPONSE RAPIDE

### ✅ OUI, 90% des coûts restent identiques

**Pourquoi?**
- Le **backend** (serveurs, DB, APIs) reste exactement pareil
- Mobile ou Web, vous avez besoin de:
  - Serveurs pour l'API REST
  - Base de données PostgreSQL
  - Stockage S3 pour photos/vidéos
  - RabbitMQ pour les événements
  - Push notifications (Firebase)
  - Paiements (Stripe, MirPay, etc.)

### ❌ Ce qui CHANGE pour mobile-only

1. **Pas besoin de serveur web** (React/Vite) → **-$10/mois**
2. **Nouveaux frais stores** (Apple + Google) → **+$125/an**
3. **Certificats & comptes développeur** → **+$99-149/an**
4. **Pas de CDN pour le frontend** → **-$0** (déjà gratuit)

**Résultat:** Coûts quasi identiques, avec ~$100-200/an de plus pour les stores

---

## 📱 Coûts ADDITIONNELS Mobile

### 1. Comptes Développeur (OBLIGATOIRES)

| Store | Compte | Prix/an | Renouvellement |
|-------|--------|---------|----------------|
| **Apple App Store** | Apple Developer Program | **$99/an** | Annuel obligatoire |
| **Google Play Store** | Google Play Console | **$25 unique** | Paiement une fois |
| **TOTAL** | | **$124 an 1, puis $99/an** | |

**Détails:**

**Apple Developer ($99/an):**
- Accès App Store
- TestFlight (beta testing)
- Certificats push notifications
- Code signing
- ⚠️ **NON-NÉGOCIABLE** - Sans ça, impossible de publier sur iOS

**Google Play ($25 unique):**
- Accès Google Play Store
- Google Play Console
- Beta testing
- Paiement **une seule fois** ✅

---

### 2. Certificats & Provisioning (iOS)

| Item | Prix | Fréquence |
|------|------|-----------|
| **Certificats de développement** | Inclus ($99/an) | Annuel |
| **Provisioning profiles** | Inclus | Annuel |
| **Push notification certificate** | Inclus | Annuel |

**Android:** Tout gratuit avec compte Play Store ✅

---

### 3. Frais de Transaction Stores (Commission)

#### Apple App Store

| Type d'achat | Commission Apple | Vous recevez |
|--------------|------------------|--------------|
| **Année 1** | 30% | 70% |
| **Après année 1** (même abonné) | 15% | 85% |
| **< $1M revenue/an** (Small Business) | 15% | 85% |

**Exemple:**
- Utilisateur achète 6 mois Premium à $79.99
- Apple prend: $24 (30%) ou $12 (15%)
- Vous recevez: $56 (70%) ou $68 (85%)

#### Google Play Store

| Type d'achat | Commission Google | Vous recevez |
|--------------|-------------------|--------------|
| **Standard** | 30% | 70% |
| **Après année 1** (même abonné) | 15% | 85% |
| **< $1M revenue/an** | 15% | 85% |

**⚠️ IMPORTANT:** Ces commissions s'ajoutent aux commissions de paiement (Stripe, etc.)

**Stack commissions total:**
```
Prix utilisateur: 1,999 ₽
- Apple/Google: -30% (599 ₽)
- Stripe/Mir: -2.5% (35 ₽)
= Vous recevez: 1,365 ₽ (68%)

Ou avec Small Business Program:
- Apple/Google: -15% (299 ₽)
- Stripe/Mir: -2.5% (35 ₽)
= Vous recevez: 1,665 ₽ (83%)
```

**💡 Astuce:** Qualifier pour "Small Business Program" = économiser 15% !

---

### 4. Services Spécifiques Mobile

#### 4.1 Push Notifications

| Service | iOS | Android | Prix |
|---------|-----|---------|------|
| **Firebase Cloud Messaging (FCM)** | ✅ | ✅ | **GRATUIT** |
| **Apple Push Notification (APN)** | ✅ | ❌ | Inclus ($99/an) |

**Verdict:** Firebase = gratuit pour les deux ✅

#### 4.2 Analytics Mobile

| Service | Features | Prix |
|---------|----------|------|
| **Firebase Analytics** | Events, users, funnels | **GRATUIT** |
| **Google Analytics 4** | Standard analytics | **GRATUIT** |
| **Mixpanel Free** | Jusqu'à 100K users/mois | **GRATUIT** |
| **Amplitude Free** | 10M events/mois | **GRATUIT** |

**Recommandation:** Firebase Analytics (gratuit) ✅

#### 4.3 Crash Reporting

| Service | Crashes/mois | Prix |
|---------|--------------|------|
| **Firebase Crashlytics** | Illimité | **GRATUIT** |
| **Sentry** | 5K events | **GRATUIT** |

**Recommandation:** Firebase Crashlytics (gratuit) ✅

#### 4.4 Deep Linking

| Service | Features | Prix |
|---------|----------|------|
| **Firebase Dynamic Links** | Deep links, déférrés | **GRATUIT** |
| **Branch.io Free** | 10K clicks/mois | **GRATUIT** |

**Recommandation:** Firebase Dynamic Links (gratuit) ✅

---

### 5. Testing & Distribution

#### 5.1 Beta Testing

| Platform | Service | Users | Prix |
|----------|---------|-------|------|
| **iOS** | TestFlight | 10K testeurs | Inclus ($99/an) |
| **Android** | Google Play Internal Testing | Illimité | Gratuit |
| **Android** | Google Play Closed/Open Beta | Illimité | Gratuit |

#### 5.2 CI/CD Mobile

| Service | Build minutes/mois | Prix |
|---------|-------------------|------|
| **GitHub Actions** | 2,000 min | **GRATUIT** |
| **Bitrise Free** | 90 min/mois | **GRATUIT** |
| **Codemagic Free** | 500 min/mois | **GRATUIT** |
| **Fastlane** | Self-hosted | **GRATUIT** |

**Recommandation:** GitHub Actions + Fastlane (gratuit) ✅

---

## 🆚 Ce qui CHANGE vs Web App

### ❌ PLUS BESOIN de:

| Service | Économie | Raison |
|---------|----------|--------|
| **CDN Frontend** | $0 (déjà gratuit) | Pas de JS/CSS à servir |
| **Serveur frontend** | $0 (déjà backend only) | App est sur téléphone |

**Total économies:** $0 (car backend reste identique)

### ✅ NOUVEAU pour Mobile:

| Service | Coût |
|---------|------|
| **Apple Developer** | $99/an |
| **Google Play** | $25 unique |
| **Commissions stores** | 15-30% des ventes |

---

## 💰 COÛTS TOTAUX Mobile-Only

### Phase 1 - MVP (1K users mobiles)

| Catégorie | Prix/mois | Notes |
|-----------|-----------|-------|
| **Backend (API REST)** | $163 | Identique web |
| **Base de données** | $25 | Identique |
| **Stockage S3** | $3 | Identique |
| **RabbitMQ** | $0 | Gratuit MVP |
| **SMS** | $20 | Identique |
| **Push Notifications** | $0 | Firebase gratuit ✅ |
| **Analytics** | $0 | Firebase gratuit ✅ |
| **Crash Reporting** | $0 | Firebase gratuit ✅ |
| **TOTAL MENSUEL** | **$211/mois** | |
| | | |
| **Apple Developer** | $99/an | $8.25/mois |
| **Google Play** | $25 unique | $2.08/mois (an 1) |
| **TOTAL avec stores** | **~$221/mois** | |

**+ Commissions stores:** 15-30% des ventes in-app

---

### Phase 2 - Croissance (10K users mobiles)

| Catégorie | Prix/mois |
|-----------|-----------|
| **Backend scaled** | $661 |
| **Base de données** | $99 |
| **Stockage** | $25 |
| **RabbitMQ** | $99 |
| **APIs tierces** | $250 |
| **Monitoring** | $75 |
| **Autres** | $50 |
| **TOTAL** | **$1,259/mois** |
| **Apple Developer** | +$8/mois |
| **TOTAL Mobile** | **~$1,267/mois** |

**+ Commissions stores:** 15-30% sur revenue ($48K/mois estimé)

---

## 📊 Comparaison Web vs Mobile

| Aspect | Web App | Mobile App | Différence |
|--------|---------|------------|------------|
| **Backend** | $211/mois | $211/mois | ✅ Identique |
| **Frontend hosting** | $0 (Cloudflare) | N/A | -$0 |
| **App Store fees** | N/A | $124/an | +$10/mois |
| **Commission ventes** | 2.5% (Stripe) | 15-30% (stores) | +12.5-27.5% |
| **Push notifs** | $0 (Firebase) | $0 (Firebase) | ✅ Identique |
| **Analytics** | $0 (GA4) | $0 (Firebase) | ✅ Identique |
| **Beta testing** | Gratuit | Gratuit (TestFlight/Play) | ✅ Identique |
| **TOTAL infrastructure** | $211/mois | $221/mois | **+$10/mois** |
| **TOTAL avec commissions** | Revenue × 2.5% | Revenue × 15-30% | **+12.5-27.5%** |

**Verdict:** Mobile coûte ~10-15% plus cher à cause des commissions stores.

---

## 🎯 Optimisation Coûts Mobile

### 1. Qualifier pour Small Business Program

**Apple + Google:**
- Si revenue < $1M/an
- Commission réduite à **15%** (au lieu de 30%)
- **Économie: 15% du revenue!**

**Exemple avec 10K users:**
- Revenue: $480K/an
- Commission 30%: $144K
- Commission 15%: $72K
- **Économie: $72K/an!** 🎉

### 2. Encourager Paiements Directs (Web)

**Stratégie:**
- Proposer abonnement sur site web МойDate.ru
- Commission: 2.5% (Stripe) au lieu de 30% (stores)
- Utilisateur se connecte dans l'app avec compte Premium

**Gain:**
```
6 mois Premium: 6,999 ₽

Via Apple/Google (30%):
- Commission: 2,100 ₽
- Vous recevez: 4,899 ₽

Via Web direct (2.5%):
- Commission: 175 ₽
- Vous recevez: 6,824 ₽

DIFFÉRENCE: +1,925 ₽ (+39% de profit!) 🚀
```

**⚠️ Règles stores:**
- Apple interdit de mentionner prix web dans l'app
- Mais vous pouvez avoir un site web séparé
- Utilisateurs peuvent s'abonner où ils veulent

### 3. Utiliser Firebase au Maximum

**Tout gratuit:**
- ✅ Push notifications
- ✅ Analytics
- ✅ Crashlytics
- ✅ Dynamic Links
- ✅ Remote Config
- ✅ A/B Testing (jusqu'à 5 tests)
- ✅ Performance Monitoring

**Économie:** $100-200/mois vs services payants

---

## 🏗️ Stack Technique Mobile

### Option A: React Native (Recommandé)

**Avantages:**
- ✅ 1 codebase pour iOS + Android
- ✅ Équipe JavaScript/TypeScript
- ✅ Hot reload (dev rapide)
- ✅ Communauté massive
- ✅ Performance native (avec Hermes/Turbo)

**Coût dev:**
- 1 dev React Native = iOS + Android
- vs 2 devs (1 iOS Swift, 1 Android Kotlin)

**Librairies essentielles:**
```json
{
  "dependencies": {
    "react-native": "0.73",
    "@react-navigation/native": "^6.1.9",
    "@react-native-firebase/app": "^19.0.0",
    "@react-native-firebase/messaging": "^19.0.0",
    "react-native-vector-icons": "^10.0.3",
    "react-native-gesture-handler": "^2.14.1",
    "react-native-reanimated": "^3.6.1",
    "axios": "^1.6.5",
    "socket.io-client": "^4.6.1"
  }
}
```

**Coûts additionnels:** $0 (tout open source)

### Option B: Native (iOS Swift + Android Kotlin)

**Avantages:**
- ✅ Performance maximale
- ✅ Accès complet features natives
- ✅ Pas de bridge JavaScript

**Inconvénients:**
- ❌ 2 codebases séparées
- ❌ 2 équipes de dev nécessaires
- ❌ Coût dev ×2

**Coût dev:**
- 2 devs × $5K/mois = $10K/mois
- vs React Native: 1 dev × $5K/mois

**Recommandation:** React Native sauf si app ultra-complexe

---

## 📱 Services Mobile Spécifiques

### 1. In-App Purchases (IAP)

**Configuration:**

**iOS (StoreKit):**
```swift
// Produits in-app
- com.moydate.premium.1week (599 ₽)
- com.moydate.premium.1month (1,999 ₽)
- com.moydate.premium.3months (4,499 ₽)
- com.moydate.premium.6months (6,999 ₽)
- com.moydate.superlike.5 (199 ₽)
- com.moydate.boost.1 (299 ₽)
```

**Android (Google Play Billing):**
```kotlin
// Même structure
moydate_premium_1w
moydate_premium_1m
moydate_premium_3m
moydate_premium_6m
```

**Coût setup:** $0 (juste du code)

### 2. Push Notifications

**Firebase Cloud Messaging:**
```javascript
// Gratuit, illimité
import messaging from '@react-native-firebase/messaging';

// Demander permission
const authStatus = await messaging().requestPermission();

// Récupérer token
const token = await messaging().getToken();

// Envoyer au backend
await api.post('/users/fcm-token', { token });
```

**Coût:** $0

### 3. Deep Linking

**Format:**
```
moydate://profile/user123
moydate://match/match456
https://moydate.ru/app/chat/conv789
```

**Configuration:**
- iOS: Associated Domains
- Android: App Links

**Coût:** $0

---

## 📋 Checklist Lancement Mobile

### ✅ Avant Développement

- [ ] **Créer compte Apple Developer** ($99/an)
- [ ] **Créer compte Google Play** ($25 unique)
- [ ] **Setup Firebase projet** (gratuit)
- [ ] **Choisir React Native vs Native**

### ✅ Pendant Développement

- [ ] **Intégrer Firebase SDK**
- [ ] **Configurer push notifications**
- [ ] **Setup deep linking**
- [ ] **Implémenter in-app purchases**
- [ ] **Intégrer analytics**
- [ ] **Tester sur devices physiques**

### ✅ Avant Lancement

- [ ] **TestFlight beta** (iOS) - 2-4 semaines
- [ ] **Google Play beta** (Android) - 1 semaine
- [ ] **Préparer screenshots stores** (5.5", 6.5", iPad)
- [ ] **Rédiger descriptions** (FR, EN, RU)
- [ ] **Privacy policy** obligatoire
- [ ] **RGPD compliance**

### ✅ Lancement

- [ ] **Submit iOS** (review 1-3 jours)
- [ ] **Submit Android** (review 1-2 jours)
- [ ] **Monitoring crashlytics**
- [ ] **Analytics dashboard**

---

## 💰 Budget Total Mobile Année 1

| Période | Infrastructure | Stores | Commissions | Total |
|---------|---------------|--------|-------------|-------|
| **M1-3 (Dev)** | $211/mois | $0 | $0 | **$633** |
| **M4 (Setup stores)** | $211 | $124 | $0 | **$335** |
| **M5-6 (Beta)** | $211/mois | $0 | $0 | **$422** |
| **M7-12 (Live)** | $350/mois | $0 | Variable | **$2,100+** |
| **TOTAL** | | | | **~$3,490** |

**+ Commissions stores:** 15-30% sur revenue in-app

**Avec revenue $250K:**
- Commission 30%: $75K
- Commission 15%: $37.5K

**Total Année 1:** $40K-80K (infrastructure + commissions)

---

## 🎓 Résumé pour Débutant

### ✅ Backend reste IDENTIQUE

Mobile ou Web, vous avez besoin de:
- Serveurs API: $163/mois
- Base de données: $25/mois
- Stockage photos: $3/mois
- SMS: $20/mois

**= $211/mois** (pareil web ou mobile)

### 📱 NOUVEAU pour Mobile

- Apple Developer: **$99/an** ($8/mois)
- Google Play: **$25 unique** ($2/mois an 1)
- Commissions stores: **15-30%** des ventes

**= +$10/mois + commissions stores**

### 💡 Astuce #1: Small Business Program

Si revenue < $1M/an → commission 15% (au lieu de 30%)
**Économie: 15% du revenue total!**

### 💡 Astuce #2: Vendre sur Web

Proposer abonnement sur moydate.ru:
- Commission: 2.5% (Stripe)
- vs 30% (App Store)
- **Économie: 27.5%!**

---

## ❓ FAQ Mobile

**Q: Dois-je lancer iOS ET Android en même temps?**
**R:** Idéalement oui, mais si budget limité:
1. Commencer par Android (moins cher: $25 vs $99)
2. Ajouter iOS après validation marché

**Q: React Native ou Native?**
**R:** React Native sauf si:
- App ultra-complexe (jeux 3D, AR/VR)
- Besoin performance extrême
- Équipe déjà experte Swift/Kotlin

**Q: Puis-je éviter les 30% de commission?**
**R:** Oui, avec stratégies:
1. Qualifier Small Business (<$1M) → 15%
2. Vendre sur web → 2.5%
3. Crypto-paiements (controversé)

**Q: Combien coûte le développement?**
**R:**
- Dev solo React Native: 4-6 mois
- Agence: $30K-80K
- Freelance senior: $20K-40K

---

**TL;DR:**
- ✅ **Backend identique** web/mobile ($211/mois)
- 📱 **Stores: +$124/an** (Apple + Google)
- 💰 **Commissions: 15-30%** des ventes in-app
- 🎯 **Total MVP mobile: ~$221/mois** + commissions
- 💡 **Astuce:** Qualifier Small Business Program (15% vs 30%)

Des questions sur le mobile? 📱
