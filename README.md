# 💕 LoveConnect - Application de Rencontres Moderne

Une application de dating moderne développée avec React, TypeScript, et Supabase, intégrant l'IA pour les conversations vocales et un algorithme de matching intelligent.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-2.57.4-green.svg)

## 🌟 Fonctionnalités Principales

### ✅ **Authentification & Profils**
- **Inscription/Connexion** sécurisée avec Supabase Auth
- **Configuration de profil multi-étapes** (4 étapes guidées)
- **Upload d'images** avec stockage sécurisé
- **Sélection d'intérêts** (16+ catégories disponibles)
- **Date picker français** avec calcul automatique de l'âge
- **Signe astrologique** et informations personnelles
- **Validation par étape** avec barre de progression

### ✅ **Système de Matching Intelligent**
- **Algorithme de compatibilité** basé sur 4 critères :
  - 40% - Âge (fourchette préférée)
  - 30% - Intérêts communs
  - 20% - Proximité géographique  
  - 10% - Complétude du profil
  - Bonus - Compatibilité astrologique
- **Score de compatibilité** visible (0-100%)
- **Préférences configurables** (âge, distance)
- **Évitement des profils** déjà vus (liked/passed)
- **Création automatique de matches** (likes mutuels)

### ✅ **Messagerie en Temps Réel avec IA**
- **Chat vocal et textuel** avec OpenAI Realtime API
- **Reconnaissance vocale** en temps réel
- **Synthèse vocale** pour les réponses de l'IA
- **WebSocket** pour la communication instantanée
- **Interface moderne** avec bulles de messages
- **Assistant IA** pour faciliter les conversations

### ✅ **Interface Utilisateur Moderne**
- **Design responsive** adapté mobile/desktop
- **Système de design** avec tokens sémantiques
- **Animations fluides** et transitions
- **Gradients et effets** visuels modernes
- **Mode sombre/clair** (système de thèmes)
- **Navigation intuitive** avec onglets

## 🏗️ Architecture Technique

### **Frontend**
```
├── React 18.3.1 + TypeScript
├── Vite (build tool)
├── Tailwind CSS (styling)
├── Shadcn/ui (composants)
├── Lucide React (icônes)
├── React Router (navigation)
├── React Hook Form (formulaires)
└── Date-fns (gestion des dates)
```

### **Backend & Base de Données**
```
├── Supabase (BaaS)
├── PostgreSQL (base de données)
├── Row Level Security (RLS)
├── Storage API (images)
├── Edge Functions (Deno)
└── WebSocket (temps réel)
```

### **IA & Services Externes**
```
├── OpenAI Realtime API (chat vocal)
├── Web Audio API (audio processing)
└── Supabase Realtime (synchronisation)
```

## 📊 Schéma de Base de Données

### **Tables Principales**
- **`profiles`** - Profils utilisateurs avec toutes les informations
- **`user_preferences`** - Préférences de matching (âge, distance)
- **`user_interactions`** - Historique des likes/passes
- **`matches`** - Matches confirmés (likes mutuels)
- **`storage.objects`** - Images de profil

### **Fonctionnalités Automatiques**
- **Triggers** pour mise à jour des timestamps
- **Calcul automatique de l'âge** depuis la date de naissance
- **Création automatique de matches** lors de likes mutuels
- **Politiques RLS** pour la sécurité des données

## 🚀 Installation & Démarrage

### **Prérequis**
- Node.js 18+
- Compte Supabase
- Clé API OpenAI

### **Installation**
```bash
# Cloner le repository
git clone <votre-repo>
cd loveconnect

# Installer les dépendances
npm install

# Configuration de l'environnement
# Copier .env.example vers .env et remplir les variables

# Démarrer en développement
npm run dev
```

### **Variables d'Environnement**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
```

### **Configuration Supabase**
1. Créer un nouveau projet Supabase
2. Exécuter les migrations SQL (disponibles dans `/supabase/migrations/`)
3. Configurer les URL de redirection pour l'authentification
4. Ajouter la clé OpenAI dans les secrets des Edge Functions

## 📱 Captures d'Écran

### Authentification
- Interface de connexion/inscription moderne
- Validation d'email automatique

### Configuration du Profil
- Formulaire multi-étapes guidé
- Upload d'images avec prévisualisation
- Sélection d'intérêts interactive

### Découverte & Matching
- Cards de profils avec scores de compatibilité
- Navigation photo fluide
- Actions like/pass intuitives

### Chat Vocal
- Interface de messagerie moderne
- Boutons d'enregistrement vocal
- Transcription en temps réel

## 🔄 Progression du Développement

### ✅ **Phase 1 - Fondations (Terminée)**
- [x] Configuration du projet (React + TypeScript + Vite)
- [x] Setup Supabase et authentification
- [x] Design system et composants UI
- [x] Interface d'authentification

### ✅ **Phase 2 - Profils Utilisateurs (Terminée)**
- [x] Upload d'images avec Supabase Storage
- [x] Formulaire de profil multi-étapes
- [x] Validation et gestion d'erreurs
- [x] Date picker et calcul d'âge automatique

### ✅ **Phase 3 - Système de Matching (Terminée)**
- [x] Algorithme de compatibilité intelligent
- [x] Base de données pour interactions et matches
- [x] Interface de préférences utilisateur
- [x] Gestion des likes/passes avec déduplication

### ✅ **Phase 4 - Chat & IA (Terminée)**
- [x] Intégration OpenAI Realtime API
- [x] WebSocket pour communication temps réel
- [x] Interface de chat moderne
- [x] Support audio bidirectionnel

## 🚧 Roadmap - Étapes à Venir

### 📋 **Phase 5 - Amélioration de l'Expérience Utilisateur**
- [ ] **Notifications push** pour nouveaux matches et messages
- [ ] **Géolocalisation** pour matching basé sur la position réelle
- [ ] **Photos multiples** par profil avec carrousel
- [ ] **Filtres avancés** (éducation, revenus, style de vie)
- [ ] **Vérification de profil** avec badge certifié

### 📋 **Phase 6 - Fonctionnalités Sociales**
- [ ] **Super likes** limités avec animation spéciale
- [ ] **Boost de profil** pour augmenter la visibilité
- [ ] **Stories temporaires** à la Instagram
- [ ] **Événements locaux** et rencontres de groupe
- [ ] **Feed d'activités** des matches

### 📋 **Phase 7 - Monétisation & Premium**
- [ ] **Abonnement Premium** avec Stripe
- [ ] **Likes illimités** pour les membres Premium
- [ ] **Mode invisible** et fonctionnalités avancées
- [ ] **Analytics de profil** détaillées
- [ ] **Rematch** des profils passés

### 📋 **Phase 8 - Optimisations & Sécurité**
- [ ] **Modération automatique** des photos avec IA
- [ ] **Détection de faux profils** avec algorithmes ML
- [ ] **Signalement et blocage** d'utilisateurs
- [ ] **Chiffrement end-to-end** des messages
- [ ] **Optimisations de performance** et cache

### 📋 **Phase 9 - Extensions Mobile**
- [ ] **PWA** pour installation mobile native
- [ ] **Notifications natives** sur mobile
- [ ] **Partage de géolocalisation** en temps réel
- [ ] **Intégration caméra** pour photos instantanées
- [ ] **Mode hors ligne** avec synchronisation

### 📋 **Phase 10 - Intelligence Artificielle Avancée**
- [ ] **IA de recommendation** améliorée avec ML
- [ ] **Analyse de compatibilité** psychologique
- [ ] **Suggestions de conversation** personnalisées
- [ ] **Prédiction de succès** des matches
- [ ] **Coach relationnel** virtuel

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev          # Démarrer le serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Linter ESLint
npm run type-check   # Vérification TypeScript

# Supabase
npx supabase start   # Démarrer Supabase local
npx supabase db push # Pousser les migrations
npx supabase gen types # Générer les types TypeScript
```

## 📈 Métriques & Performance

### **Bundles JavaScript**
- **Taille du bundle principal** : ~800KB (gzipped)
- **Lazy loading** des composants non critiques
- **Tree shaking** automatique avec Vite
- **Code splitting** par routes

### **Base de Données**
- **RLS activé** sur toutes les tables sensibles
- **Index optimisés** pour les requêtes de matching
- **Triggers** pour la cohérence des données
- **Politiques de sécurité** strictes

### **Performance Audio**
- **Streaming audio** en chunks de 4096 échantillons
- **Encodage PCM16** à 24kHz
- **Queue audio** pour lecture séquentielle
- **Gestion d'erreurs** robuste

## 🤝 Contribution

### **Guidelines de Développement**
1. **TypeScript strict** - Tous les types doivent être définis
2. **Composants fonctionnels** avec hooks React
3. **Shadcn/ui** pour tous les composants de base
4. **Tailwind classes utilitaires** uniquement
5. **Tests** pour les fonctions critiques

### **Structure du Code**
```
src/
├── components/     # Composants React réutilisables
├── hooks/         # Hooks personnalisés
├── pages/         # Pages de l'application
├── data/          # Données statiques et configurations
├── utils/         # Fonctions utilitaires
├── integrations/  # Intégrations externes (Supabase)
└── assets/        # Images et ressources statiques
```

## 📊 Déploiement Lovable

**URL du projet**: https://lovable.dev/projects/f2c80f56-a4b3-46a3-be12-a75ac3a82b8d

### **Déploiement Simple**
1. Ouvrir [Lovable](https://lovable.dev/projects/f2c80f56-a4b3-46a3-be12-a75ac3a82b8d)
2. Cliquer sur Share → Publish
3. L'application sera déployée automatiquement

### **Domaine Personnalisé**
- Aller dans Project > Settings > Domains
- Cliquer sur "Connect Domain"
- Suivre les instructions pour connecter votre domaine

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- **Issues GitHub** : [Créer une issue](../../issues)
- **Documentation** : Consultez ce README
- **Supabase Docs** : [supabase.com/docs](https://supabase.com/docs)
- **Lovable Docs** : [docs.lovable.dev](https://docs.lovable.dev)

---

**Développé avec ❤️ par l'équipe LoveConnect**

*"Connecter les cœurs grâce à la technologie moderne"*