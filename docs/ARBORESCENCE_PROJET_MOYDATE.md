# МойDate - Arborescence Complète du Projet
**Version:** 1.0.0
**Date:** 2025-10-04
**Objectif:** Documentation complète de l'architecture frontend (existante) et backend (à implémenter)

---

## 📂 PARTIE 1: ARBORESCENCE FRONTEND (EXISTANTE)

### Structure Actuelle du Projet

```
love-network-hub/
│
├── 📁 src/                                    # Code source React/TypeScript
│   │
│   ├── 📁 components/                         # Composants réutilisables
│   │   ├── 📁 animations/                     # Composants animés
│   │   │   ├── AnimatedButton.tsx
│   │   │   ├── AnimatedInput.tsx
│   │   │   ├── FeedbackToast.tsx
│   │   │   ├── LikeButton.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   ├── SwipeCard.tsx
│   │   │   ├── ToastContainer.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 auth/                           # Authentification UI
│   │   │   ├── CountrySelector.tsx            # Sélecteur pays (+indicatif)
│   │   │   └── OtpInput.tsx                   # Input code OTP
│   │   │
│   │   ├── 📁 discover/                       # Écran découverte/swipe
│   │   │   ├── DiscoverActionButton.tsx
│   │   │   ├── DiscoverActions.tsx
│   │   │   ├── DiscoverHeader.tsx
│   │   │   ├── DiscoverProfileCard.tsx
│   │   │   ├── FiltersPanel.tsx
│   │   │   └── SwipeCard.tsx
│   │   │
│   │   ├── 📁 match/                          # Match modal
│   │   │   ├── MatchModal.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 ui/                             # shadcn/ui components
│   │   │   ├── accordion.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── date-picker-modern.tsx         # ✅ iOS-style date picker
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── toggle.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── use-toast.ts
│   │   │
│   │   ├── AdvancedFiltersPanel.tsx           # Filtres avancés
│   │   ├── ChatInterface.tsx                  # Interface chat
│   │   ├── CountrySelector.tsx
│   │   ├── DatingApp.tsx                      # App principale
│   │   ├── DebugPanel.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── MatchingPreferences.tsx
│   │   ├── MatchingProfileCard.tsx
│   │   ├── ModeToggle.tsx
│   │   ├── ModernDatePicker.tsx
│   │   ├── Navigation.tsx                     # Navigation principale
│   │   ├── NotificationCenter.tsx             # ✅ Centre notifications
│   │   ├── PhotoCarousel.tsx
│   │   ├── PhotoUploader.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── ProfileSetup.tsx
│   │   ├── SocialFeed.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── theme-provider.tsx
│   │
│   ├── 📁 features/                           # Features modulaires
│   │   │
│   │   ├── 📁 discover/                       # Feature découverte
│   │   │   ├── 📁 components/
│   │   │   │   ├── DiscoverActions.tsx
│   │   │   │   ├── DiscoverHeader.tsx
│   │   │   │   ├── DiscoverMain.tsx
│   │   │   │   ├── DiscoverMediaViewer.tsx
│   │   │   │   ├── DiscoverProfileCard.tsx
│   │   │   │   └── FiltersSheet.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 discover-modern/                # Version moderne découverte
│   │   │   ├── 📁 components/
│   │   │   │   ├── ActionButtons.tsx
│   │   │   │   ├── Discover.tsx
│   │   │   │   ├── FiltersSidebar.tsx
│   │   │   │   ├── ProfileModal.tsx
│   │   │   │   ├── SwipeCard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── index.ts
│   │   │   │   ├── useDiscoverProfiles.ts
│   │   │   │   └── useSwipe.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── userStats.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 feed/                           # Social feed
│   │   │   ├── 📁 components/
│   │   │   │   ├── FeedPostCard.tsx
│   │   │   │   ├── FeedStoriesRail.tsx
│   │   │   │   ├── NarratorBanner.tsx
│   │   │   │   └── SocialFeedView.tsx
│   │   │   ├── 📁 data/
│   │   │   │   ├── posts.ts
│   │   │   │   └── stories.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 matches/                        # Liste matchs
│   │   │   ├── 📁 components/
│   │   │   │   ├── MatchCard.tsx
│   │   │   │   ├── MatchSectionTitle.tsx
│   │   │   │   └── MatchesView.tsx
│   │   │   ├── data.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 matches-modern/                 # Version moderne matchs
│   │   │   ├── 📁 components/
│   │   │   │   ├── MatchCard.tsx
│   │   │   │   ├── MatchPreviewModal.tsx
│   │   │   │   ├── MatchesFilter.tsx
│   │   │   │   ├── MatchesScreen.tsx
│   │   │   │   ├── SectionHeader.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── index.ts
│   │   │   │   └── useMatches.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── matchesStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 messages/                       # Messages/chat
│   │   │   ├── 📁 components/
│   │   │   │   ├── ActivityStories.tsx
│   │   │   │   ├── ConversationView.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   ├── MessagesHeader.tsx
│   │   │   │   └── MessagesView.tsx
│   │   │   ├── conversations.ts
│   │   │   ├── data.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 messages-modern/                # Version moderne messages
│   │   │   ├── 📁 components/
│   │   │   │   ├── ActivitiesBar.tsx
│   │   │   │   ├── ConversationListItem.tsx
│   │   │   │   ├── ConversationView.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── MessageInput.tsx
│   │   │   │   ├── MessagesScreen.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── index.ts
│   │   │   │   └── useMessages.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── messagesStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 onboarding/                     # Onboarding flow
│   │   │   ├── 📁 components/
│   │   │   │   ├── BirthdaySelector.tsx
│   │   │   │   ├── ContactAccessPrompt.tsx
│   │   │   │   ├── IdentitySelector.tsx
│   │   │   │   ├── NotificationPrompt.tsx
│   │   │   │   ├── OnboardingSlides.tsx       # ✅ Slides d'intro
│   │   │   │   ├── OnboardingSummary.tsx
│   │   │   │   ├── OtpVerification.tsx        # ✅ Vérification OTP
│   │   │   │   ├── PassionSelector.tsx
│   │   │   │   └── PhoneCapture.tsx           # ✅ Capture téléphone
│   │   │   ├── 📁 data/
│   │   │   │   └── slides.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 profile/                        # Profil utilisateur
│   │   │   ├── 📁 components/
│   │   │   │   ├── ProfileDetailsForm.tsx
│   │   │   │   └── ProfileHub.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 profile-modern/                 # Version moderne profil
│   │   │   ├── 📁 components/
│   │   │   │   ├── AboutSection.tsx
│   │   │   │   ├── BadgesSection.tsx
│   │   │   │   ├── MediaGallery.tsx
│   │   │   │   ├── PremiumCard.tsx
│   │   │   │   ├── ProfileEditModal.tsx
│   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   ├── ProfileProgress.tsx
│   │   │   │   ├── ProfileScreen.tsx
│   │   │   │   ├── SettingsSection.tsx
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 hooks/
│   │   │   │   └── useProfile.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── profileStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 social-modern/                  # Version moderne social
│   │   │   ├── 📁 components/
│   │   │   │   ├── NarrativePost.tsx
│   │   │   │   ├── NarrativesBar.tsx
│   │   │   │   ├── SocialFeedScreen.tsx
│   │   │   │   ├── UserPost.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── index.ts
│   │   │   │   └── useSocialFeed.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── socialStore.ts
│   │   │   ├── 📁 types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   └── 📁 stories/                        # Stories (Instagram-like)
│   │       ├── 📁 components/
│   │       │   ├── StoryFooter.tsx
│   │       │   ├── StoryHeader.tsx
│   │       │   └── StoryViewer.tsx
│   │       ├── data.ts
│   │       └── index.ts
│   │
│   ├── 📁 hooks/                              # React hooks custom
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── useAdvancedFilters.ts
│   │   ├── useAuth.tsx
│   │   ├── useAutoSave.ts
│   │   ├── useChatWithDisclaimer.ts
│   │   ├── useFeedPosts.ts
│   │   ├── useGeolocation.ts
│   │   ├── useMatching.tsx
│   │   ├── useNotifications.ts
│   │   ├── useProfilePhotos.ts
│   │   ├── useProfilePhotosMock.ts
│   │   ├── useSocialComments.ts
│   │   └── useToast.ts
│   │
│   ├── 📁 pages/                              # Pages principales
│   │   ├── 📁 onboarding/                     # Pages onboarding
│   │   │   ├── OnboardingBasics.tsx           # ✅ Infos basiques
│   │   │   ├── OnboardingBio.tsx              # ✅ Bio utilisateur
│   │   │   ├── OnboardingComplete.tsx         # ✅ Écran fin
│   │   │   ├── OnboardingGender.tsx           # ✅ Sélection genre
│   │   │   ├── OnboardingLocation.tsx         # ✅ Localisation
│   │   │   ├── OnboardingPhotos.tsx           # ✅ Upload photos
│   │   │   ├── OnboardingPreferences.tsx      # ✅ Préférences
│   │   │   └── types.ts
│   │   │
│   │   ├── Auth.tsx
│   │   ├── Index.tsx
│   │   ├── Landing.tsx
│   │   ├── NotFound.tsx
│   │   ├── ProfileDetailScreen.tsx
│   │   ├── ProfileDetails.tsx
│   │   ├── ProfileSetupScreen.tsx
│   │   ├── SignupContact.tsx
│   │   └── SignupVerify.tsx
│   │
│   ├── 📁 contexts/                           # React contexts
│   │   └── ThemeProvider.tsx
│   │
│   ├── 📁 data/                               # Données mock/static
│   │   ├── countries.ts                       # Liste pays
│   │   ├── feedTemplates.ts                   # Templates narratives
│   │   ├── mockData.ts                        # Données test
│   │   └── profileOptions.ts
│   │
│   ├── 📁 i18n/                               # Internationalisation
│   │   ├── I18nProvider.tsx
│   │   ├── index.ts
│   │   ├── messages.ts                        # Traductions
│   │   └── types.ts
│   │
│   ├── 📁 integrations/                       # Intégrations externes
│   │   └── 📁 supabase/
│   │       ├── client.ts                      # Client Supabase
│   │       └── types.ts
│   │
│   ├── 📁 lib/                                # Librairies utilitaires
│   │   └── utils.ts
│   │
│   ├── 📁 utils/                              # Fonctions utilitaires
│   │   ├── audioUtils.ts
│   │   ├── autoMessages.ts
│   │   ├── errorMessage.ts
│   │   ├── feedAutoPost.ts
│   │   ├── i18n.ts
│   │   ├── keywordDetector.ts
│   │   ├── matchMessages.ts
│   │   ├── testStorage.ts
│   │   ├── translation.ts
│   │   └── zodiacCalculator.ts
│   │
│   ├── 📁 config/                             # Configuration
│   │   ├── tailwind.colors.js
│   │   └── tailwind.config.js
│   │
│   ├── 📁 types/                              # TypeScript types
│   │   └── global.d.ts
│   │
│   ├── App.tsx                                # Composant racine
│   ├── main.tsx                               # Point d'entrée
│   └── vite-env.d.ts
│
├── 📁 docs/                                   # Documentation
│   ├── ARBORESCENCE_PROJET_MOYDATE.md         # ✅ CE FICHIER
│   ├── BACKEND_ARCHITECTURE_MICROSERVICES.md
│   ├── BACKEND_ARCHITECTURE_V2_UPDATED.md     # ✅ Architecture backend
│   ├── BACKEND_TODO.md
│   ├── CAHIER_DES_CHARGES.md                  # ✅ Specs complètes
│   ├── FREE_VS_PREMIUM_FEATURES.md            # ✅ Pricing features
│   ├── INFRASTRUCTURE_COSTS_COMPLETE.md       # ✅ Coûts infrastructure
│   ├── INTEGRATION_MOCKUP_ETAPE0.md
│   ├── MATCH_MODAL_IMPLEMENTATION.md
│   ├── MICRO_INTERACTIONS_GUIDE.md
│   ├── MOBILE_ONLY_COSTS.md                   # ✅ Coûts mobile
│   ├── MOYDATE_IMPLEMENTATION_BLUEPRINT.md
│   ├── PREMIUM_PRICING_STRATEGY.md            # ✅ Stratégie pricing
│   ├── PROFILE_DETAIL_IMPLEMENTATION.md
│   ├── RABBITMQ_EXPLAINED.md                  # ✅ RabbitMQ expliqué
│   ├── design-system-analysis.md
│   └── profile-setup-enhancements.md
│
├── 📁 public/                                 # Assets publics
│   └── (images, fonts, etc.)
│
├── package.json                               # Dépendances npm
├── package-lock.json
├── tsconfig.json                              # Config TypeScript
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts                             # Config Vite
├── tailwind.config.ts                         # Config Tailwind CSS
├── postcss.config.js
├── components.json                            # Config shadcn/ui
├── eslint.config.js
├── CLAUDE.md                                  # Instructions Claude Code
└── README.md
```

---

## 📂 PARTIE 2: ARBORESCENCE BACKEND (À IMPLÉMENTER)

### Architecture Microservices - Node.js + Express + PostgreSQL + Redis + RabbitMQ

```
moydate-backend/
│
├── 📁 services/                               # Microservices indépendants
│   │
│   ├── 📁 auth-service/                       # Service 1: Authentification
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/
│   │   │   │   ├── better-auth.config.ts      # BetterAuth config
│   │   │   │   ├── database.ts                # PostgreSQL config
│   │   │   │   ├── redis.ts                   # Redis sessions
│   │   │   │   └── oauth-providers.ts         # VK, Google, Apple, Instagram
│   │   │   │
│   │   │   ├── 📁 controllers/
│   │   │   │   ├── auth.controller.ts         # Login, Register, Logout
│   │   │   │   ├── oauth.controller.ts        # OAuth callbacks
│   │   │   │   ├── session.controller.ts      # Session management
│   │   │   │   └── phone.controller.ts        # Phone verification (SMS)
│   │   │   │
│   │   │   ├── 📁 middleware/
│   │   │   │   ├── auth.middleware.ts         # JWT verification
│   │   │   │   ├── rate-limit.middleware.ts   # Rate limiting
│   │   │   │   └── validate.middleware.ts
│   │   │   │
│   │   │   ├── 📁 models/
│   │   │   │   ├── user.model.ts              # User table
│   │   │   │   ├── session.model.ts           # Session table
│   │   │   │   └── oauth-account.model.ts     # OAuth accounts
│   │   │   │
│   │   │   ├── 📁 routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── oauth.routes.ts
│   │   │   │   └── session.routes.ts
│   │   │   │
│   │   │   ├── 📁 services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── sms.service.ts             # SMS OTP (SMSINT.ru)
│   │   │   │   ├── jwt.service.ts
│   │   │   │   └── oauth.service.ts
│   │   │   │
│   │   │   ├── 📁 utils/
│   │   │   │   ├── password.util.ts           # Hashing bcrypt
│   │   │   │   ├── token.util.ts
│   │   │   │   └── validation.util.ts
│   │   │   │
│   │   │   ├── app.ts                         # Express app
│   │   │   └── server.ts                      # Server entry
│   │   │
│   │   ├── 📁 migrations/                     # DB migrations
│   │   │   ├── 001_create_users.sql
│   │   │   ├── 002_create_sessions.sql
│   │   │   └── 003_create_oauth_accounts.sql
│   │   │
│   │   ├── 📁 tests/
│   │   │   ├── auth.test.ts
│   │   │   └── oauth.test.ts
│   │   │
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   └── .env.example
│   │
│   ├── 📁 profile-service/                    # Service 2: Gestion profils
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/
│   │   │   │   ├── database.ts
│   │   │   │   ├── redis.ts
│   │   │   │   └── s3.ts                      # AWS S3 config (photos)
│   │   │   │
│   │   │   ├── 📁 controllers/
│   │   │   │   ├── profile.controller.ts      # CRUD profil
│   │   │   │   ├── photo.controller.ts        # Upload photos
│   │   │   │   ├── preferences.controller.ts
│   │   │   │   └── verification.controller.ts # Vérification profil
│   │   │   │
│   │   │   ├── 📁 middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── upload.middleware.ts       # Multer
│   │   │   │   └── image-processing.middleware.ts
│   │   │   │
│   │   │   ├── 📁 models/
│   │   │   │   ├── profile.model.ts
│   │   │   │   ├── photo.model.ts
│   │   │   │   ├── preference.model.ts
│   │   │   │   └── verification.model.ts
│   │   │   │
│   │   │   ├── 📁 routes/
│   │   │   │   ├── profile.routes.ts
│   │   │   │   ├── photo.routes.ts
│   │   │   │   └── preferences.routes.ts
│   │   │   │
│   │   │   ├── 📁 services/
│   │   │   │   ├── profile.service.ts
│   │   │   │   ├── photo.service.ts           # Upload S3
│   │   │   │   ├── image-processing.service.ts # Sharp resize
│   │   │   │   ├── geolocation.service.ts     # Coordonnées GPS
│   │   │   │   └── verification.service.ts
│   │   │   │
│   │   │   ├── 📁 utils/
│   │   │   │   ├── image.util.ts
│   │   │   │   ├── geo.util.ts
│   │   │   │   └── validation.util.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── 📁 migrations/
│   │   │   ├── 001_create_profiles.sql
│   │   │   ├── 002_create_photos.sql
│   │   │   └── 003_create_preferences.sql
│   │   │
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   └── .env.example
│   │
│   ├── 📁 matching-service/                   # Service 3: Matching & Swipe
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/
│   │   │   │   ├── database.ts
│   │   │   │   ├── redis.ts                   # Cache profils
│   │   │   │   └── rabbitmq.ts                # Events matching
│   │   │   │
│   │   │   ├── 📁 controllers/
│   │   │   │   ├── discover.controller.ts     # GET profiles
│   │   │   │   ├── swipe.controller.ts        # POST swipe
│   │   │   │   ├── match.controller.ts        # GET matches
│   │   │   │   └── filters.controller.ts
│   │   │   │
│   │   │   ├── 📁 middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── rate-limit.middleware.ts   # 50 profils / 3h
│   │   │   │   └── validate.middleware.ts
│   │   │   │
│   │   │   ├── 📁 models/
│   │   │   │   ├── swipe.model.ts             # Table swipes
│   │   │   │   ├── match.model.ts             # Table matches
│   │   │   │   ├── filter.model.ts
│   │   │   │   └── superlike.model.ts
│   │   │   │
│   │   │   ├── 📁 routes/
│   │   │   │   ├── discover.routes.ts
│   │   │   │   ├── swipe.routes.ts
│   │   │   │   └── match.routes.ts
│   │   │   │
│   │   │   ├── 📁 services/
│   │   │   │   ├── matching.service.ts        # Algo matching
│   │   │   │   ├── discovery.service.ts       # Récupération profils
│   │   │   │   ├── swipe.service.ts
│   │   │   │   ├── filter.service.ts          # Filtres avancés
│   │   │   │   └── cache.service.ts           # Redis cache
│   │   │   │
│   │   │   ├── 📁 algorithms/
│   │   │   │   ├── elo.algorithm.ts           # Score ELO
│   │   │   │   ├── compatibility.algorithm.ts # Score compatibilité
│   │   │   │   └── geo-distance.algorithm.ts  # Distance GPS
│   │   │   │
│   │   │   ├── 📁 events/
│   │   │   │   ├── match.publisher.ts         # Publish match.created
│   │   │   │   └── swipe.publisher.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── 📁 migrations/
│   │   │   ├── 001_create_swipes.sql
│   │   │   ├── 002_create_matches.sql
│   │   │   └── 003_create_superlikes.sql
│   │   │
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .env.example
│   │
│   ├── 📁 messaging-service/                  # Service 4: Messagerie temps réel
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/
│   │   │   │   ├── database.ts
│   │   │   │   ├── redis.ts                   # Socket.io adapter
│   │   │   │   ├── rabbitmq.ts
│   │   │   │   ├── socket.ts                  # Socket.io config
│   │   │   │   └── s3.ts                      # Stockage photos/vidéos
│   │   │   │
│   │   │   ├── 📁 controllers/
│   │   │   │   ├── conversation.controller.ts
│   │   │   │   ├── message.controller.ts
│   │   │   │   └── media.controller.ts        # Upload media
│   │   │   │
│   │   │   ├── 📁 middleware/
│   │   │   │   ├── socket-auth.middleware.ts  # Auth WebSocket
│   │   │   │   ├── message-validation.middleware.ts
│   │   │   │   └── rate-limit.middleware.ts   # 100 messages/jour free
│   │   │   │
│   │   │   ├── 📁 models/
│   │   │   │   ├── conversation.model.ts
│   │   │   │   ├── message.model.ts
│   │   │   │   ├── read-receipt.model.ts
│   │   │   │   └── typing-indicator.model.ts
│   │   │   │
│   │   │   ├── 📁 routes/
│   │   │   │   ├── conversation.routes.ts
│   │   │   │   └── message.routes.ts
│   │   │   │
│   │   │   ├── 📁 services/
│   │   │   │   ├── message.service.ts
│   │   │   │   ├── conversation.service.ts
│   │   │   │   ├── media.service.ts           # Upload photos/voice
│   │   │   │   ├── translation.service.ts     # DeepL + Google
│   │   │   │   └── emoji.service.ts
│   │   │   │
│   │   │   ├── 📁 socket/
│   │   │   │   ├── handlers/
│   │   │   │   │   ├── message.handler.ts     # Handle message events
│   │   │   │   │   ├── typing.handler.ts      # Typing indicators
│   │   │   │   │   └── presence.handler.ts    # Online/offline
│   │   │   │   └── events.ts                  # Socket event definitions
│   │   │   │
│   │   │   ├── 📁 utils/
│   │   │   │   ├── encryption.util.ts         # E2E encryption (futur)
│   │   │   │   └── moderation.util.ts         # Modération contenu
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts                      # HTTP + Socket.io
│   │   │
│   │   ├── 📁 migrations/
│   │   │   ├── 001_create_conversations.sql
│   │   │   ├── 002_create_messages.sql
│   │   │   └── 003_create_read_receipts.sql
│   │   │
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .env.example
│   │
│   ├── 📁 narrative-service/                  # Service 5: Narrative Engine (P0)
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/
│   │   │   │   ├── database.ts
│   │   │   │   ├── rabbitmq.ts                # Consume events
│   │   │   │   └── scenarios.ts               # 20+ scenarios config
│   │   │   │
│   │   │   ├── 📁 controllers/
│   │   │   │   ├── narrative.controller.ts    # GET narratives
│   │   │   │   └── template.controller.ts     # Admin templates
│   │   │   │
│   │   │   ├── 📁 models/
│   │   │   │   ├── narrative.model.ts
│   │   │   │   ├── scenario.model.ts
│   │   │   │   └── template.model.ts
│   │   │   │
│   │   │   ├── 📁 routes/
│   │   │   │   └── narrative.routes.ts
│   │   │   │
│   │   │   ├── 📁 services/
│   │   │   │   ├── narrative-generator.service.ts
│   │   │   │   ├── scenario-detector.service.ts
│   │   │   │   ├── template.service.ts
│   │   │   │   └── personalization.service.ts
│   │   │   │
│   │   │   ├── 📁 scenarios/                  # Détection scénarios
│   │   │   │   ├── picky-swiper.scenario.ts
│   │   │   │   ├── instant-match.scenario.ts
│   │   │   │   ├── ghosting.scenario.ts
│   │   │   │   ├── first-message.scenario.ts
│   │   │   │   └── [18+ autres scenarios]
│   │   │   │
│   │   │   ├── 📁 templates/                  # JSON templates
│   │   │   │   ├── picky_swiper.json
│   │   │   │   ├── instant_match.json
│   │   │   │   ├── ghosting.json
│   │   │   │   └── [20+ templates]
│   │   │   │
│   │   │   ├── 📁 events/
│   │   │   │   ├── match.consumer.ts          # Consume match events
│   │   │   │   ├── swipe.consumer.ts
│   │   │   │   └── message.consumer.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── 📁 migrations/
│   │   │   ├── 001_create_narratives.sql
│   │   │   └── 002_create_scenarios.sql
│   │   │
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .env.example
│   │
│   ├── 📁 tracker-service/                    # Service 6: Relationship Tracker (P0)
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/
│   │   │   │   ├── database.ts
│   │   │   │   └── rabbitmq.ts
│   │   │   │
│   │   │   ├── 📁 controllers/
│   │   │   │   ├── milestone.controller.ts    # GET milestones
│   │   │   │   ├── questionnaire.controller.ts
│   │   │   │   └── stats.controller.ts
│   │   │   │
│   │   │   ├── 📁 models/
│   │   │   │   ├── milestone.model.ts
│   │   │   │   ├── questionnaire.model.ts
│   │   │   │   ├── answer.model.ts
│   │   │   │   └── relationship-stats.model.ts
│   │   │   │
│   │   │   ├── 📁 routes/
│   │   │   │   ├── milestone.routes.ts
│   │   │   │   └── questionnaire.routes.ts
│   │   │   │
│   │   │   ├── 📁 services/
│   │   │   │   ├── milestone-detector.service.ts
│   │   │   │   ├── questionnaire.service.ts
│   │   │   │   ├── compatibility.service.ts   # Analyse compatibilité
│   │   │   │   └── stats.service.ts
│   │   │   │
│   │   │   ├── 📁 questionnaires/             # Templates questionnaires
│   │   │   │   ├── first-date.json
│   │   │   │   ├── one-month.json
│   │   │   │   └── six-months.json
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── 📁 migrations/
│   │   │   ├── 001_create_milestones.sql
│   │   │   └── 002_create_questionnaires.sql
│   │   │
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── 📁 gamification-service/               # Service 7: Gamification (P0)
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/
│   │   │   │   ├── database.ts
│   │   │   │   ├── redis.ts                   # Leaderboards
│   │   │   │   └── rabbitmq.ts
│   │   │   │
│   │   │   ├── 📁 controllers/
│   │   │   │   ├── badge.controller.ts        # GET badges
│   │   │   │   ├── xp.controller.ts           # XP points
│   │   │   │   ├── leaderboard.controller.ts
│   │   │   │   └── achievement.controller.ts
│   │   │   │
│   │   │   ├── 📁 models/
│   │   │   │   ├── badge.model.ts
│   │   │   │   ├── xp.model.ts
│   │   │   │   ├── achievement.model.ts
│   │   │   │   └── leaderboard.model.ts
│   │   │   │
│   │   │   ├── 📁 routes/
│   │   │   │   ├── badge.routes.ts
│   │   │   │   ├── xp.routes.ts
│   │   │   │   └── leaderboard.routes.ts
│   │   │   │
│   │   │   ├── 📁 services/
│   │   │   │   ├── badge.service.ts
│   │   │   │   ├── xp.service.ts
│   │   │   │   ├── leaderboard.service.ts     # Redis sorted sets
│   │   │   │   └── achievement.service.ts
│   │   │   │
│   │   │   ├── 📁 events/
│   │   │   │   ├── match.consumer.ts          # Award XP on match
│   │   │   │   ├── message.consumer.ts        # Award XP on message
│   │   │   │   └── profile.consumer.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── 📁 migrations/
│   │   │   ├── 001_create_badges.sql
│   │   │   ├── 002_create_xp.sql
│   │   │   └── 003_create_achievements.sql
│   │   │
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── 📁 social-feed-service/                # Service 8: Social Feed
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/
│   │   │   │   ├── database.ts
│   │   │   │   ├── redis.ts                   # Cache feed
│   │   │   │   ├── rabbitmq.ts
│   │   │   │   └── s3.ts                      # Photos/vidéos posts
│   │   │   │
│   │   │   ├── 📁 controllers/
│   │   │   │   ├── post.controller.ts         # CRUD posts
│   │   │   │   ├── comment.controller.ts      # Commentaires
│   │   │   │   ├── reaction.controller.ts     # ❤️ 😂 😮 😢 😡
│   │   │   │   └── share.controller.ts
│   │   │   │
│   │   │   ├── 📁 models/
│   │   │   │   ├── post.model.ts
│   │   │   │   ├── comment.model.ts
│   │   │   │   ├── reaction.model.ts
│   │   │   │   └── share.model.ts
│   │   │   │
│   │   │   ├── 📁 routes/
│   │   │   │   ├── post.routes.ts
│   │   │   │   ├── comment.routes.ts
│   │   │   │   └── reaction.routes.ts
│   │   │   │
│   │   │   ├── 📁 services/
│   │   │   │   ├── post.service.ts
│   │   │   │   ├── feed.service.ts            # Algo feed timeline
│   │   │   │   ├── comment.service.ts
│   │   │   │   ├── reaction.service.ts
│   │   │   │   └── moderation.service.ts      # Modération contenu
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── 📁 migrations/
│   │   │   ├── 001_create_posts.sql
│   │   │   ├── 002_create_comments.sql
│   │   │   └── 003_create_reactions.sql
│   │   │
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── 📁 notification-service/               # Service 9: Notifications
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/
│   │   │   │   ├── database.ts
│   │   │   │   ├── redis.ts
│   │   │   │   ├── rabbitmq.ts                # Consume tous events
│   │   │   │   ├── firebase.ts                # Firebase Cloud Messaging
│   │   │   │   └── supabase.ts                # Supabase Realtime
│   │   │   │
│   │   │   ├── 📁 controllers/
│   │   │   │   ├── notification.controller.ts # GET notifications
│   │   │   │   ├── preference.controller.ts   # Settings notifs
│   │   │   │   └── device.controller.ts       # FCM tokens
│   │   │   │
│   │   │   ├── 📁 models/
│   │   │   │   ├── notification.model.ts
│   │   │   │   ├── preference.model.ts
│   │   │   │   └── device-token.model.ts
│   │   │   │
│   │   │   ├── 📁 routes/
│   │   │   │   ├── notification.routes.ts
│   │   │   │   └── preference.routes.ts
│   │   │   │
│   │   │   ├── 📁 services/
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── push.service.ts            # Firebase push
│   │   │   │   ├── realtime.service.ts        # Supabase realtime
│   │   │   │   └── preference.service.ts
│   │   │   │
│   │   │   ├── 📁 events/
│   │   │   │   ├── match.consumer.ts          # Notif match
│   │   │   │   ├── message.consumer.ts        # Notif message
│   │   │   │   ├── like.consumer.ts           # Notif like (Premium)
│   │   │   │   └── narrative.consumer.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── 📁 migrations/
│   │   │   ├── 001_create_notifications.sql
│   │   │   └── 002_create_device_tokens.sql
│   │   │
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── 📁 premium-service/                    # Service 10: Premium & Paiements
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/
│   │   │   │   ├── database.ts
│   │   │   │   ├── payments/
│   │   │   │   │   ├── mir-pay.config.ts      # MirPay (prioritaire)
│   │   │   │   │   ├── sberbank.config.ts     # SberPay
│   │   │   │   │   ├── tinkoff.config.ts      # Tinkoff
│   │   │   │   │   ├── yoomoney.config.ts     # YooMoney
│   │   │   │   │   ├── stripe.config.ts       # International
│   │   │   │   │   └── apple-pay.config.ts    # Apple/Google Pay
│   │   │   │   └── rabbitmq.ts
│   │   │   │
│   │   │   ├── 📁 controllers/
│   │   │   │   ├── subscription.controller.ts # Abonnements
│   │   │   │   ├── payment.controller.ts      # Paiements
│   │   │   │   ├── webhook.controller.ts      # Webhooks paiements
│   │   │   │   ├── boost.controller.ts        # Achats Boosts
│   │   │   │   └── superlike.controller.ts    # Achats SuperLikes
│   │   │   │
│   │   │   ├── 📁 models/
│   │   │   │   ├── subscription.model.ts
│   │   │   │   ├── payment.model.ts
│   │   │   │   ├── boost.model.ts
│   │   │   │   └── superlike.model.ts
│   │   │   │
│   │   │   ├── 📁 routes/
│   │   │   │   ├── subscription.routes.ts
│   │   │   │   ├── payment.routes.ts
│   │   │   │   └── webhook.routes.ts
│   │   │   │
│   │   │   ├── 📁 services/
│   │   │   │   ├── subscription.service.ts
│   │   │   │   ├── payment.service.ts
│   │   │   │   ├── mir-pay.service.ts         # Intégration MirPay
│   │   │   │   ├── sberbank.service.ts
│   │   │   │   ├── tinkoff.service.ts
│   │   │   │   ├── yoomoney.service.ts
│   │   │   │   ├── stripe.service.ts
│   │   │   │   ├── boost.service.ts
│   │   │   │   └── superlike.service.ts
│   │   │   │
│   │   │   ├── 📁 pricing/
│   │   │   │   ├── subscription-plans.ts      # 599₽, 1999₽, 4499₽, 6999₽
│   │   │   │   ├── boost-packs.ts
│   │   │   │   └── superlike-packs.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── 📁 migrations/
│   │   │   ├── 001_create_subscriptions.sql
│   │   │   ├── 002_create_payments.sql
│   │   │   └── 003_create_purchases.sql
│   │   │
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── 📁 translation-service/                # Service 11: Traduction
│       ├── 📁 src/
│       │   ├── 📁 config/
│       │   │   ├── deepl.config.ts            # DeepL API (Premium)
│       │   │   ├── google-translate.config.ts # Google (Free fallback)
│       │   │   └── redis.ts                   # Cache traductions
│       │   │
│       │   ├── 📁 controllers/
│       │   │   └── translate.controller.ts
│       │   │
│       │   ├── 📁 models/
│       │   │   └── translation-cache.model.ts
│       │   │
│       │   ├── 📁 routes/
│       │   │   └── translate.routes.ts
│       │   │
│       │   ├── 📁 services/
│       │   │   ├── translation.service.ts
│       │   │   ├── deepl.service.ts           # Premium users
│       │   │   ├── google-translate.service.ts # Free users
│       │   │   └── cache.service.ts
│       │   │
│       │   ├── app.ts
│       │   └── server.ts
│       │
│       ├── 📁 migrations/
│       │   └── 001_create_translation_cache.sql
│       │
│       ├── package.json
│       └── Dockerfile
│
├── 📁 gateway/                                # API Gateway (Nginx OU Node.js)
│   ├── nginx.conf                             # Reverse proxy config
│   ├── rate-limiting.conf
│   ├── ssl.conf
│   └── Dockerfile
│
├── 📁 shared/                                 # Code partagé
│   ├── 📁 types/
│   │   ├── user.types.ts
│   │   ├── match.types.ts
│   │   ├── message.types.ts
│   │   └── events.types.ts
│   │
│   ├── 📁 utils/
│   │   ├── logger.util.ts                     # Winston
│   │   ├── error.util.ts
│   │   └── validation.util.ts
│   │
│   └── 📁 constants/
│       ├── error-codes.ts
│       ├── event-types.ts
│       └── config.ts
│
├── 📁 infrastructure/                         # Infrastructure as Code
│   ├── 📁 docker/
│   │   ├── docker-compose.yml                 # Dev environment
│   │   ├── docker-compose.prod.yml            # Production (Selectel)
│   │   └── docker-compose.test.yml
│   │
│   ├── 📁 kubernetes/                         # K8s manifests (Phase 2)
│   │   ├── deployments/
│   │   ├── services/
│   │   ├── ingress/
│   │   └── configmaps/
│   │
│   ├── 📁 terraform/                          # Terraform (Yandex Cloud)
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   │
│   └── 📁 scripts/
│       ├── setup.sh                           # Setup dev environment
│       ├── deploy.sh                          # Deploy to production
│       ├── backup.sh                          # Database backups
│       └── migrate.sh                         # Run migrations
│
├── 📁 monitoring/                             # Monitoring & Observability
│   ├── 📁 grafana/
│   │   └── dashboards/
│   │       ├── api-performance.json
│   │       ├── database.json
│   │       └── business-metrics.json
│   │
│   └── 📁 prometheus/
│       └── prometheus.yml
│
├── 📁 tests/                                  # Tests d'intégration
│   ├── 📁 e2e/
│   │   ├── auth.e2e.test.ts
│   │   ├── matching.e2e.test.ts
│   │   └── messaging.e2e.test.ts
│   │
│   └── 📁 integration/
│       ├── payment.integration.test.ts
│       └── notification.integration.test.ts
│
├── 📁 docs/                                   # Documentation backend
│   ├── API.md                                 # API documentation
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── RABBITMQ.md
│   └── PAYMENT_INTEGRATION.md
│
├── .gitignore
├── .env.example                               # Variables d'environnement
├── package.json                               # Monorepo root
├── pnpm-workspace.yaml                        # PNPM workspaces
├── README.md
└── LICENSE
```

### Technologies Stack Backend

```typescript
// package.json (Backend Monorepo)
{
  "name": "moydate-backend",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "services/*",
    "shared"
  ],
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "migrate": "pnpm -r migrate",
    "docker:up": "docker-compose -f infrastructure/docker/docker-compose.yml up -d",
    "docker:down": "docker-compose -f infrastructure/docker/docker-compose.yml down"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "nodemon": "^3.0.2"
  }
}
```

**Technologies principales:**
- **Runtime:** Node.js 20 LTS
- **Framework:** Express 4.18
- **Language:** TypeScript 5.3
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Queue:** RabbitMQ 3.12
- **Auth:** BetterAuth + JWT
- **WebSocket:** Socket.io 4.6
- **Storage:** AWS S3 compatible
- **Push:** Firebase Cloud Messaging
- **Monitoring:** Grafana + Prometheus
- **Tests:** Jest + Supertest

---

## 📊 Statistiques Frontend Actuel

**Total fichiers:** 237 fichiers TypeScript/JavaScript
**Composants UI:** 48 composants shadcn/ui
**Features modulaires:** 9 features (discover, matches, messages, onboarding, etc.)
**Pages:** 15 pages principales
**Hooks custom:** 15 hooks
**Utils:** 10 utilitaires

**Frameworks & Librairies:**
- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 3
- shadcn/ui
- Supabase client
- i18next (internationalisation)

---

## 🎯 Fichiers Frontend Critiques (Déjà Implémentés)

### ✅ Onboarding Complet
- `src/features/onboarding/components/PhoneCapture.tsx` - Capture téléphone
- `src/features/onboarding/components/OtpVerification.tsx` - Vérification OTP
- `src/pages/onboarding/OnboardingGender.tsx` - Sélection genre
- `src/pages/onboarding/OnboardingBasics.tsx` - Infos basiques
- `src/pages/onboarding/OnboardingPhotos.tsx` - Upload photos
- `src/pages/onboarding/OnboardingPreferences.tsx` - Préférences matching
- `src/pages/onboarding/OnboardingBio.tsx` - Bio utilisateur
- `src/pages/onboarding/OnboardingComplete.tsx` - Fin onboarding

### ✅ Discover/Swipe
- `src/features/discover-modern/components/SwipeCard.tsx` - Carte swipe
- `src/features/discover-modern/components/ActionButtons.tsx` - ❌ ⭐ ❤️
- `src/features/discover-modern/hooks/useSwipe.ts` - Logique swipe
- `src/features/discover-modern/hooks/useDiscoverProfiles.ts` - Chargement profils

### ✅ Matches
- `src/features/matches-modern/components/MatchCard.tsx` - Carte match
- `src/features/matches-modern/components/MatchesScreen.tsx` - Écran liste
- `src/components/match/MatchModal.tsx` - Modal "It's a Match!"

### ✅ Messages
- `src/features/messages-modern/components/ConversationView.tsx` - Vue conversation
- `src/features/messages-modern/components/MessageBubble.tsx` - Bulle message
- `src/features/messages-modern/components/MessageInput.tsx` - Input message

### ✅ Social Feed
- `src/features/feed/components/FeedPostCard.tsx` - Carte post
- `src/features/feed/components/NarratorBanner.tsx` - Banner narrateur
- `src/data/feedTemplates.ts` - Templates narratives

### ✅ Profil
- `src/features/profile-modern/components/ProfileScreen.tsx` - Écran profil
- `src/features/profile-modern/components/PremiumCard.tsx` - Carte Premium
- `src/features/profile-modern/components/BadgesSection.tsx` - Badges gamification

### ✅ UI Moderne
- `src/components/ui/date-picker-modern.tsx` - ✅ iOS-style date picker
- `src/components/NotificationCenter.tsx` - ✅ Centre notifications

---

## 🔗 Intégrations Frontend ↔ Backend

### Points d'API Requis

```typescript
// src/services/api.ts (À CRÉER)

const API_BASE_URL = process.env.VITE_API_URL || 'https://api.moydate.ru';

// Auth Service
export const authApi = {
  loginWithPhone: (phone: string) => POST('/auth/phone/send-otp'),
  verifyOtp: (phone: string, code: string) => POST('/auth/phone/verify'),
  loginWithVK: () => GET('/auth/oauth/vk'),
  loginWithGoogle: () => GET('/auth/oauth/google'),
  logout: () => POST('/auth/logout'),
};

// Profile Service
export const profileApi = {
  getProfile: (userId: string) => GET(`/profiles/${userId}`),
  updateProfile: (data: ProfileData) => PUT('/profiles/me', data),
  uploadPhoto: (file: File) => POST('/profiles/photos', file),
  deletePhoto: (photoId: string) => DELETE(`/profiles/photos/${photoId}`),
};

// Matching Service
export const matchingApi = {
  getProfiles: (filters: Filters) => GET('/discover', { params: filters }),
  swipe: (profileId: string, direction: 'left' | 'right') =>
    POST('/swipe', { profileId, direction }),
  superlike: (profileId: string) => POST('/swipe/superlike', { profileId }),
  getMatches: () => GET('/matches'),
};

// Messaging Service
export const messagingApi = {
  getConversations: () => GET('/conversations'),
  getMessages: (conversationId: string) => GET(`/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, content: string) =>
    POST(`/conversations/${conversationId}/messages`, { content }),
};

// Narrative Service
export const narrativeApi = {
  getNarratives: () => GET('/narratives'),
  getNarrativeById: (id: string) => GET(`/narratives/${id}`),
};

// Premium Service
export const premiumApi = {
  getPlans: () => GET('/premium/plans'),
  createSubscription: (planId: string, paymentMethod: string) =>
    POST('/premium/subscribe', { planId, paymentMethod }),
  buyBoosts: (quantity: number) => POST('/premium/boosts', { quantity }),
  buySuperLikes: (quantity: number) => POST('/premium/superlikes', { quantity }),
};
```

---

Cette arborescence complète montre **exactement** où nous en sommes (frontend) et **exactement** ce qui doit être construit (backend).

Le frontend est **90% terminé** pour le MVP.
Le backend est **0% construit** mais **100% spécifié** dans ce document.

---

## 📋 PARTIE 3: PROMPT POUR DÉVELOPPEURS BACKEND

### 🎯 Contexte du Projet

**МойDate** est une application de rencontre innovante qui combine:
- **Swipe classique** (Tinder-like) pour découvrir des profils
- **Narrative Engine unique** qui raconte l'histoire de votre vie amoureuse avec humour/sarcasme
- **Social Feed** où narratives et posts utilisateurs coexistent
- **Relationship Tracker** avec milestones et questionnaires de compatibilité
- **Gamification complète** (badges, XP, leaderboards)

**Marché cible:** Russie (prioritaire), puis international

**Frontend:** 90% terminé (React + TypeScript + Tailwind + shadcn/ui)
**Backend:** À construire entièrement (vous êtes ici)

---

### 🚀 Votre Mission

Implémenter **11 microservices indépendants** en **Node.js + TypeScript** avec architecture event-driven (RabbitMQ).

**Stack technique imposée:**
- **Runtime:** Node.js 20 LTS
- **Framework:** Express 4.18+
- **Language:** TypeScript 5.3+
- **Database:** PostgreSQL 16 (1 DB par service)
- **Cache:** Redis 7
- **Message Queue:** RabbitMQ 3.12
- **Auth:** BetterAuth (OAuth VK prioritaire)
- **WebSocket:** Socket.io 4.6 (messaging temps réel)
- **Storage:** AWS S3 compatible (Selectel Object Storage)
- **ORM:** Prisma OU TypeORM (au choix)
- **Tests:** Jest + Supertest
- **Linting:** ESLint + Prettier
- **Container:** Docker + Docker Compose

---

### 📐 Architecture Imposée

**Pattern:** Microservices avec Event-Driven Architecture

```
┌─────────────┐
│   Nginx     │ ← API Gateway (reverse proxy)
│   Gateway   │
└──────┬──────┘
       │
       ├────► Auth Service (port 3001)
       ├────► Profile Service (port 3002)
       ├────► Matching Service (port 3003)
       ├────► Messaging Service (port 3004) ← WebSocket
       ├────► Narrative Service (port 3005) ⭐ CORE DIFFERENTIATOR
       ├────► Tracker Service (port 3006)
       ├────► Gamification Service (port 3007)
       ├────► Social Feed Service (port 3008)
       ├────► Notification Service (port 3009)
       ├────► Premium Service (port 3010)
       └────► Translation Service (port 3011)

           ▲
           │ Events (RabbitMQ)
           ▼

┌────────────────────────────────────────┐
│         RabbitMQ Event Bus             │
│  (match.created, message.sent, etc.)   │
└────────────────────────────────────────┘
```

**Communication:**
- **Frontend → Backend:** REST API (HTTP/HTTPS)
- **Service → Service:** RabbitMQ (événements asynchrones)
- **Client ↔ Messaging:** Socket.io (WebSocket)

---

### 📦 11 Microservices à Implémenter

#### 1️⃣ Auth Service (PRIORITÉ 1)

**Responsabilités:**
- OAuth (VK, Google, Apple, Instagram) - **VK PRIORITAIRE**
- Login par téléphone + SMS OTP (SMSINT.ru)
- Gestion sessions (Redis)
- JWT token generation/validation
- Rate limiting (anti brute-force)

**Endpoints principaux:**
```typescript
POST   /auth/phone/send-otp          // Envoie SMS OTP
POST   /auth/phone/verify            // Vérifie code OTP
GET    /auth/oauth/vk                // Redirect VK OAuth
GET    /auth/oauth/vk/callback       // Callback VK
GET    /auth/oauth/google            // Redirect Google
GET    /auth/oauth/google/callback
POST   /auth/logout                  // Logout utilisateur
GET    /auth/me                      // Get current user
```

**Technologies spécifiques:**
- BetterAuth (framework auth)
- bcrypt (hash passwords)
- jsonwebtoken (JWT)
- axios (API calls vers VK/Google)
- SMSINT.ru API (SMS OTP Russie)

**Variables d'environnement requises:**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/moydate_auth
REDIS_URL=redis://localhost:6379/0
VK_CLIENT_ID=xxx
VK_CLIENT_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
SMSINT_API_KEY=xxx
JWT_SECRET=xxx
JWT_EXPIRES_IN=7d
```

**Table principale:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'vk', 'google', 'apple', 'instagram'
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_user_id)
);
```

**Events publiés:**
- `user.registered` → Notification Service
- `user.logged_in` → Analytics (futur)

---

#### 2️⃣ Profile Service (PRIORITÉ 1)

**Responsabilités:**
- CRUD profils utilisateurs
- Upload photos (max 6) → S3
- Resize/optimize images (Sharp)
- Géolocalisation temps réel
- Préférences matching
- Vérification profils (badges bleus)

**Endpoints principaux:**
```typescript
GET    /profiles/me                  // Mon profil
GET    /profiles/:userId             // Profil utilisateur
PUT    /profiles/me                  // Update profil
POST   /profiles/photos              // Upload photo (multipart/form-data)
DELETE /profiles/photos/:photoId     // Supprimer photo
PUT    /profiles/location            // Update localisation GPS
GET    /profiles/:userId/preferences // Préférences matching
PUT    /profiles/preferences         // Update préférences
POST   /profiles/verify              // Demande vérification
```

**Technologies spécifiques:**
- Multer (upload fichiers)
- Sharp (resize images)
- AWS SDK (S3 upload)
- @turf/turf (calculs géographiques)

**Variables d'environnement:**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/moydate_profiles
REDIS_URL=redis://localhost:6379/1
S3_ENDPOINT=https://s3.selcdn.ru
S3_BUCKET=moydate-photos
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
MAX_PHOTOS=6
MAX_FILE_SIZE=10485760  # 10MB
```

**Tables principales:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(20) NOT NULL,
  bio TEXT,
  location GEOGRAPHY(POINT, 4326),  -- PostGIS
  city VARCHAR(100),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  position INTEGER NOT NULL,  -- Ordre d'affichage (1-6)
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 99,
  max_distance INTEGER DEFAULT 50,  -- km
  interested_in VARCHAR(20)[],  -- ['men', 'women', 'everyone']
  show_me VARCHAR(20) DEFAULT 'everyone',
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Events publiés:**
- `profile.created` → Gamification Service (award XP)
- `profile.updated` → Matching Service (clear cache)
- `photo.uploaded` → Gamification Service (award XP)

---

#### 3️⃣ Matching Service (PRIORITÉ 1)

**Responsabilités:**
- Découverte de profils (algorithme ELO + distance GPS)
- Swipe left/right
- SuperLikes
- Détection matchs mutuels
- Rate limiting (50 profils / 3h pour free users)
- Cache Redis (profils pré-calculés)

**Endpoints principaux:**
```typescript
GET    /discover                     // GET profils à swiper (avec filtres)
POST   /swipe                        // POST swipe (left/right/superlike)
GET    /matches                      // GET liste matchs
GET    /matches/:matchId             // Détail match
DELETE /matches/:matchId             // Unmatch
POST   /rewind                       // Annuler dernier swipe (Premium)
```

**Algorithme matching:**
```typescript
// Pseudo-code
function calculateMatchScore(currentUser, candidateProfile) {
  let score = 0;

  // 1. Score ELO (attractivité)
  score += calculateEloScore(currentUser.elo, candidateProfile.elo);

  // 2. Distance GPS (pénalité si trop loin)
  const distance = calculateDistance(currentUser.location, candidateProfile.location);
  if (distance <= 5) score += 30;
  else if (distance <= 20) score += 15;
  else if (distance <= 50) score += 5;
  else score -= 10;

  // 3. Compatibilité âge
  if (candidateProfile.age >= currentUser.preferences.minAge &&
      candidateProfile.age <= currentUser.preferences.maxAge) {
    score += 20;
  }

  // 4. Activité récente (boost actifs)
  if (candidateProfile.lastActive < 24h) score += 15;

  // 5. Photos complètes (boost profils complets)
  if (candidateProfile.photos.length >= 3) score += 10;

  return score;
}
```

**Variables d'environnement:**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/moydate_matching
REDIS_URL=redis://localhost:6379/2
RABBITMQ_URL=amqp://localhost:5672
SWIPE_RATE_LIMIT_FREE=50        # 50 profils / 3h
SWIPE_RATE_LIMIT_WINDOW=10800   # 3 heures en secondes
SUPERLIKE_DAILY_LIMIT=1         # Free users
```

**Tables principales:**
```sql
CREATE TABLE swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  direction VARCHAR(20) NOT NULL,  -- 'left', 'right', 'superlike'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

CREATE INDEX idx_swipes_to_user ON swipes(to_user_id);
CREATE INDEX idx_swipes_created_at ON swipes(created_at);

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  CHECK (user1_id < user2_id)  -- Éviter doublons (A-B = B-A)
);

CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);
```

**Events publiés:**
- `match.created` → Notification Service, Narrative Service, Gamification Service
- `swipe.made` → Narrative Service (scénarios)
- `superlike.sent` → Notification Service (Premium feature)

**Rate Limiting (Redis):**
```typescript
// Exemple avec ioredis
async function checkSwipeRateLimit(userId: string, isPremium: boolean) {
  if (isPremium) return true;  // Illimité pour Premium

  const key = `swipe_limit:${userId}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 10800);  // 3 heures
  }

  return count <= 50;
}
```

---

#### 4️⃣ Messaging Service (PRIORITÉ 1)

**Responsabilités:**
- Chat temps réel (Socket.io)
- Messages texte, photos, vidéos, voice notes
- Emojis, stickers, memes
- Typing indicators
- Read receipts
- Online/offline status
- Traduction automatique (appel Translation Service)
- Rate limiting (100 messages/jour free users)

**Endpoints principaux:**
```typescript
// REST API
GET    /conversations                // Liste conversations
GET    /conversations/:id            // Messages d'une conversation
POST   /conversations/:id/messages   // Envoyer message (fallback REST)
POST   /conversations/:id/media      // Upload photo/video
PUT    /conversations/:id/read       // Marquer comme lu
DELETE /conversations/:id            // Supprimer conversation

// Socket.io Events
socket.on('message:send', ...)      // Envoyer message temps réel
socket.on('typing:start', ...)      // User typing...
socket.on('typing:stop', ...)
socket.on('message:read', ...)      // Mark as read
socket.emit('message:new', ...)     // Recevoir nouveau message
socket.emit('user:online', ...)     // User is online
socket.emit('user:offline', ...)
```

**Architecture Socket.io avec Redis Adapter:**
```typescript
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL }
});

// Redis adapter (scaling horizontal)
const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();
await Promise.all([pubClient.connect(), subClient.connect()]);
io.adapter(createAdapter(pubClient, subClient));

// Authentification Socket.io
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Handler messages
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);

  // Rejoindre rooms (1 room = 1 conversation)
  const conversations = await getU serConversations(socket.userId);
  conversations.forEach(conv => socket.join(`conversation:${conv.id}`));

  // Envoyer message
  socket.on('message:send', async (data) => {
    const { conversationId, content, type } = data;

    // Valider rate limit (100 messages/jour free users)
    const canSend = await checkMessageRateLimit(socket.userId);
    if (!canSend) {
      return socket.emit('error', { message: 'Rate limit exceeded' });
    }

    // Sauvegarder message en DB
    const message = await saveMessage({
      conversationId,
      senderId: socket.userId,
      content,
      type  // 'text', 'photo', 'voice', 'emoji'
    });

    // Publier événement RabbitMQ
    await publishEvent('message.sent', {
      messageId: message.id,
      conversationId,
      senderId: socket.userId,
      type
    });

    // Broadcast aux autres users de la conversation
    io.to(`conversation:${conversationId}`)
      .except(socket.id)
      .emit('message:new', message);

    // Confirmation à l'émetteur
    socket.emit('message:sent', { messageId: message.id });
  });

  // Typing indicators
  socket.on('typing:start', ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`)
      .emit('user:typing', { userId: socket.userId });
  });

  socket.on('typing:stop', ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`)
      .emit('user:stopped_typing', { userId: socket.userId });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});
```

**Variables d'environnement:**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/moydate_messaging
REDIS_URL=redis://localhost:6379/3
RABBITMQ_URL=amqp://localhost:5672
S3_ENDPOINT=https://s3.selcdn.ru
S3_BUCKET=moydate-messages
MESSAGE_RATE_LIMIT_FREE=100     # 100 messages/jour
PORT=3004
SOCKET_PORT=3004
```

**Tables principales:**
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT,
  type VARCHAR(20) DEFAULT 'text',  -- 'text', 'photo', 'voice', 'emoji', 'sticker'
  media_url TEXT,
  translated_content TEXT,  -- Traduction auto (si activée)
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(is_read) WHERE is_read = false;
```

**Events publiés:**
- `message.sent` → Notification Service, Narrative Service
- `conversation.created` → Gamification Service

---

#### 5️⃣ Narrative Service (PRIORITÉ 0 - CORE DIFFERENTIATOR ⭐)

**Responsabilités:**
- **Détection automatique de 20+ scénarios** de vie amoureuse
- Génération narratives sarcastiques/humoristiques
- Personnalisation selon historique utilisateur
- Feed de narratives (mélangé avec user posts)

**C'EST LE SERVICE QUI DIFFÉRENCIE MOYDATE DE TOUTES LES AUTRES APPS!**

**Endpoints principaux:**
```typescript
GET    /narratives                   // Feed narratives utilisateur
GET    /narratives/:id               // Détail narrative
GET    /narratives/scenarios         // Liste scénarios disponibles (admin)
```

**20+ Scénarios à implémenter:**
```typescript
export const SCENARIOS = {
  // 1. Swipe behavior
  PICKY_SWIPER: {
    trigger: 'User passé 50 profils sans like',
    template: 'picky_swiper.json',
    tone: 'sarcastique'
  },

  // 2. Match speed
  INSTANT_MATCH: {
    trigger: 'Match créé en <1min après like',
    template: 'instant_match.json',
    tone: 'romantique'
  },
  SLOW_MATCH: {
    trigger: 'Match créé après 7+ jours',
    template: 'slow_match.json',
    tone: 'ironique'
  },

  // 3. Messaging behavior
  GHOSTING: {
    trigger: 'Pas de réponse après 3+ messages',
    template: 'ghosting.json',
    tone: 'sarcastique'
  },
  DOUBLE_TEXT: {
    trigger: 'User envoie 3+ messages sans réponse',
    template: 'double_text.json',
    tone: 'moqueur'
  },
  FIRST_MESSAGE_FAIL: {
    trigger: 'Premier message pas de réponse après 24h',
    template: 'first_message_fail.json',
    tone: 'ironique'
  },

  // 4. Photo behavior
  NO_BIO_SWIPER: {
    trigger: 'User swipe right sur profils sans bio',
    template: 'no_bio_swiper.json',
    tone: 'moqueur'
  },
  SERIAL_SUPERLIKE: {
    trigger: 'User utilise 5+ SuperLikes en 24h',
    template: 'serial_superlike.json',
    tone: 'sarcastique'
  },

  // 5. Timing patterns
  LATE_NIGHT_SWIPER: {
    trigger: 'User swipe entre 23h-3h',
    template: 'late_night.json',
    tone: 'moqueur'
  },
  WEEKEND_WARRIOR: {
    trigger: 'User actif uniquement le weekend',
    template: 'weekend_warrior.json',
    tone: 'ironique'
  },

  // 6. Match milestones
  FIRST_MATCH: {
    trigger: 'Premier match utilisateur',
    template: 'first_match.json',
    tone: 'encourageant'
  },
  MATCH_STREAK: {
    trigger: '5+ matchs en 24h',
    template: 'match_streak.json',
    tone: 'admiratif'
  },

  // 7. Distance behavior
  LONG_DISTANCE_LOVER: {
    trigger: 'Match avec personne à 100+ km',
    template: 'long_distance.json',
    tone: 'sarcastique'
  },

  // 8. Profile updates
  PHOTO_CHANGE: {
    trigger: 'User change photo principale 3+ fois/jour',
    template: 'photo_change.json',
    tone: 'moqueur'
  },
  BIO_POET: {
    trigger: 'User écrit bio de 500+ caractères',
    template: 'bio_poet.json',
    tone: 'admiratif'
  },

  // 9. Premium behavior
  PREMIUM_UPGRADE: {
    trigger: 'User achète Premium',
    template: 'premium_upgrade.json',
    tone: 'congratulations'
  },

  // 10. Relationship milestones
  FIRST_DATE_PLANNED: {
    trigger: 'User coche milestone "First date"',
    template: 'first_date.json',
    tone: 'romantique'
  },

  // ... 10+ autres scénarios
};
```

**Exemple de template narrative (picky_swiper.json):**
```json
{
  "id": "picky_swiper",
  "title": "Le Critique d'Art du Swipe",
  "variants": [
    {
      "text": "{{userName}} vient de passer 50 profils sans un seul like. Apparemment, trouver l'amour nécessite les mêmes standards qu'un jury du prix Nobel. 🏆",
      "conditions": {
        "swipes_count": ">= 50",
        "likes_count": "0"
      }
    },
    {
      "text": "{{userName}} cherche la perfection... 73 profils consultés, 0 likes. Peut-être que le/la partenaire idéal(e) se cache au profil #74? 🔍",
      "conditions": {
        "swipes_count": ">= 70",
        "likes_count": "0"
      }
    }
  ],
  "reactions": ["😂", "😮", "❤️"],
  "visibility": "public",
  "can_comment": true
}
```

**Architecture Event Consumer:**
```typescript
// events/match.consumer.ts
import { ConsumeMessage } from 'amqplib';
import { detectScenarios } from '../services/scenario-detector.service';
import { generateNarrative } from '../services/narrative-generator.service';

export async function consumeMatchCreated(msg: ConsumeMessage) {
  const event = JSON.parse(msg.content.toString());
  const { matchId, user1Id, user2Id, timestamp } = event;

  // Détecter scénarios potentiels
  const scenarios = await detectScenarios('match.created', {
    matchId,
    user1Id,
    user2Id,
    timestamp
  });

  // Générer narratives pour chaque scénario détecté
  for (const scenario of scenarios) {
    await generateNarrative({
      userId: user1Id,
      scenarioId: scenario.id,
      variables: scenario.variables,
      template: scenario.template
    });
  }
}
```

**Variables d'environnement:**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/moydate_narratives
REDIS_URL=redis://localhost:6379/4
RABBITMQ_URL=amqp://localhost:5672
NARRATIVE_GENERATION_ENABLED=true
```

**Tables principales:**
```sql
CREATE TABLE narratives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  scenario_id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tone VARCHAR(50),  -- 'sarcastique', 'romantique', 'ironique', etc.
  variables JSONB,  -- Variables utilisées (userName, swipesCount, etc.)
  reactions JSONB DEFAULT '[]',  -- [{userId, emoji, timestamp}]
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_narratives_user ON narratives(user_id, created_at DESC);
CREATE INDEX idx_narratives_scenario ON narratives(scenario_id);
```

**Events consommés:**
- `match.created` → Détecter INSTANT_MATCH, SLOW_MATCH
- `swipe.made` → Détecter PICKY_SWIPER, NO_BIO_SWIPER, LATE_NIGHT_SWIPER
- `message.sent` → Détecter GHOSTING, DOUBLE_TEXT, FIRST_MESSAGE_FAIL
- `profile.updated` → Détecter PHOTO_CHANGE, BIO_POET
- `subscription.created` → Détecter PREMIUM_UPGRADE

---

#### 6️⃣ Tracker Service (PRIORITÉ 0)

**Responsabilités:**
- Détection milestones relationnels
- Questionnaires de compatibilité
- Analyse compatibilité couple
- Statistiques relation

**Endpoints principaux:**
```typescript
GET    /milestones                   // Liste milestones utilisateur
POST   /milestones/:type             // Marquer milestone (first_date, etc.)
GET    /questionnaires               // Liste questionnaires disponibles
POST   /questionnaires/:id/answers   // Soumettre réponses
GET    /compatibility/:matchId       // Score compatibilité couple
```

**Milestones types:**
- `first_message` - Premier message échangé
- `first_date` - Premier rendez-vous
- `one_week` - 1 semaine de relation
- `one_month` - 1 mois
- `three_months` - 3 mois
- `six_months` - 6 mois
- `one_year` - 1 an

**Questionnaires:**
- Questionnaire "First Date" (10 questions)
- Questionnaire "1 Month" (15 questions)
- Questionnaire "6 Months" (20 questions)

**Variables d'environnement:**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/moydate_tracker
RABBITMQ_URL=amqp://localhost:5672
```

---

#### 7️⃣ Gamification Service (PRIORITÉ 0)

**Responsabilités:**
- Système XP (experience points)
- Badges (achievements)
- Leaderboards (Redis sorted sets)
- Niveaux utilisateur

**Actions qui donnent XP:**
- Profile complété: +100 XP
- Photo uploadée: +20 XP
- Match créé: +50 XP
- Message envoyé: +5 XP
- Premier rendez-vous: +200 XP
- Milestone atteint: +100 XP

**Badges:**
- "Nouveau venu" - Profil créé
- "Photographe" - 6 photos uploadées
- "Bavard" - 100 messages envoyés
- "Populaire" - 10 matchs
- "Romantique" - Premier rendez-vous
- "Expert" - 50 matchs
- ... 20+ badges

**Endpoints:**
```typescript
GET    /gamification/xp              // XP utilisateur actuel
GET    /gamification/badges          // Badges débloqués
GET    /gamification/leaderboard     // Top 100 utilisateurs
GET    /gamification/level           // Niveau actuel
```

---

#### 8️⃣ Social Feed Service (PRIORITÉ 1)

**Responsabilités:**
- CRUD posts utilisateurs
- Commentaires
- Réactions (❤️ 😂 😮 😢 😡)
- Partages
- Feed algorithm (narratives + user posts)

**Endpoints:**
```typescript
GET    /feed                         // Feed mélangé (narratives + posts)
POST   /posts                        // Créer post
PUT    /posts/:id                    // Modifier post
DELETE /posts/:id                    // Supprimer post
POST   /posts/:id/comments           // Commenter
POST   /posts/:id/reactions          // Réagir
POST   /posts/:id/share              // Partager
```

---

#### 9️⃣ Notification Service (PRIORITÉ 1)

**Responsabilités:**
- Push notifications (Firebase Cloud Messaging)
- In-app notifications
- Préférences notifications
- Badge counts

**Notifications types:**
- `new_match` - Nouveau match
- `new_message` - Nouveau message
- `new_like` - Nouveau like (Premium)
- `new_superlike` - Nouveau SuperLike
- `new_narrative` - Nouvelle narrative
- `milestone_unlocked` - Milestone débloqué
- `badge_earned` - Badge gagné

**Endpoints:**
```typescript
GET    /notifications                // Liste notifications
PUT    /notifications/:id/read       // Marquer comme lu
PUT    /notifications/read-all       // Tout marquer comme lu
POST   /notifications/register-device // Enregistrer FCM token
GET    /notifications/preferences    // Préférences
PUT    /notifications/preferences    // Modifier préférences
```

---

#### 🔟 Premium Service (PRIORITÉ 1)

**Responsabilités:**
- Abonnements Premium (1 semaine, 1 mois, 3 mois, 6 mois)
- Paiements russes (MirPay, SberPay, Tinkoff, YooMoney)
- Paiements internationaux (Stripe, Apple Pay, Google Pay)
- Achats in-app (Boosts, SuperLikes)
- Webhooks paiements
- Vérification statut Premium

**Pricing:**
```typescript
export const SUBSCRIPTION_PLANS = {
  WEEK_1: { price: 599, currency: 'RUB', duration: '1_week' },
  MONTH_1: { price: 1999, currency: 'RUB', duration: '1_month' },
  MONTH_3: { price: 4499, currency: 'RUB', duration: '3_months' },
  MONTH_6: { price: 6999, currency: 'RUB', duration: '6_months' }
};

export const BOOST_PACKS = {
  BOOST_1: { price: 299, currency: 'RUB', quantity: 1 },
  BOOST_3: { price: 799, currency: 'RUB', quantity: 3 },
  BOOST_5: { price: 1199, currency: 'RUB', quantity: 5 },
  BOOST_10: { price: 1999, currency: 'RUB', quantity: 10 }
};

export const SUPERLIKE_PACKS = {
  SUPERLIKE_5: { price: 199, currency: 'RUB', quantity: 5 },
  SUPERLIKE_10: { price: 349, currency: 'RUB', quantity: 10 },
  SUPERLIKE_25: { price: 799, currency: 'RUB', quantity: 25 },
  SUPERLIKE_50: { price: 1399, currency: 'RUB', quantity: 50 }
};
```

**Endpoints:**
```typescript
GET    /premium/plans                // Liste plans disponibles
POST   /premium/subscribe            // S'abonner
GET    /premium/status               // Statut Premium actuel
POST   /premium/cancel               // Annuler abonnement
POST   /premium/boosts               // Acheter Boosts
POST   /premium/superlikes           // Acheter SuperLikes
POST   /webhook/mirpay               // Webhook MirPay
POST   /webhook/sberbank             // Webhook SberBank
POST   /webhook/stripe               // Webhook Stripe
```

**Intégration MirPay (PRIORITAIRE):**
```typescript
// services/mir-pay.service.ts
import axios from 'axios';

export async function createMirPayment(
  userId: string,
  amount: number,
  currency: string,
  planId: string
) {
  const response = await axios.post(
    `${process.env.MIR_PAY_API_URL}/payment/init`,
    {
      amount: amount * 100,  // Kopecks
      currency,
      orderId: `moydate_${userId}_${Date.now()}`,
      description: `МойDate Premium - ${planId}`,
      returnUrl: `${process.env.FRONTEND_URL}/premium/success`,
      callbackUrl: `${process.env.BACKEND_URL}/webhook/mirpay`
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.MIR_PAY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    paymentId: response.data.paymentId,
    paymentUrl: response.data.paymentUrl
  };
}
```

---

#### 1️⃣1️⃣ Translation Service (PRIORITÉ 2)

**Responsabilités:**
- Traduction messages (DeepL pour Premium, Google pour Free)
- Cache traductions (Redis)
- Auto-détection langue

**Endpoints:**
```typescript
POST   /translate                    // Traduire texte
GET    /translate/languages          // Langues supportées
```

**Intégration DeepL:**
```typescript
import axios from 'axios';

export async function translateWithDeepL(
  text: string,
  sourceLang: string,
  targetLang: string
) {
  const response = await axios.post(
    'https://api.deepl.com/v2/translate',
    {
      text: [text],
      source_lang: sourceLang.toUpperCase(),
      target_lang: targetLang.toUpperCase()
    },
    {
      headers: {
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`
      }
    }
  );

  return response.data.translations[0].text;
}
```

---

### 🔧 Configuration Docker Compose (Développement)

Chaque développeur doit avoir cet environnement local:

```yaml
# infrastructure/docker/docker-compose.yml
version: '3.8'

services:
  # Bases de données PostgreSQL (1 par service)
  postgres-auth:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: moydate_auth
      POSTGRES_USER: moydate
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres-auth-data:/var/lib/postgresql/data

  postgres-profiles:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: moydate_profiles
      POSTGRES_USER: moydate
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5433:5432"
    volumes:
      - postgres-profiles-data:/var/lib/postgresql/data

  # ... (répéter pour chaque service)

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --maxmemory 2gb --maxmemory-policy allkeys-lru

  # RabbitMQ
  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    ports:
      - "5672:5672"   # AMQP
      - "15672:15672" # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: moydate
      RABBITMQ_DEFAULT_PASS: dev_password
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq

  # Gateway (Nginx)
  gateway:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - auth-service
      - profile-service
      - matching-service

  # Services (à démarrer individuellement pour dev)
  # Chaque dev travaille sur 1-2 services à la fois

volumes:
  postgres-auth-data:
  postgres-profiles-data:
  postgres-matching-data:
  postgres-messaging-data:
  postgres-narratives-data:
  postgres-tracker-data:
  postgres-gamification-data:
  postgres-social-data:
  postgres-notifications-data:
  postgres-premium-data:
  postgres-translation-data:
  rabbitmq-data:
```

---

### 📝 Standards de Code OBLIGATOIRES

#### Structure de fichier IMPOSÉE:
```
service-name/
├── src/
│   ├── config/          # Configuration (DB, Redis, RabbitMQ)
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # DB models (Prisma/TypeORM)
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Helpers
│   ├── events/          # RabbitMQ publishers/consumers
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── migrations/          # SQL migrations
├── tests/               # Jest tests
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

#### Naming Conventions:
- **Fichiers:** kebab-case (`user.controller.ts`)
- **Classes:** PascalCase (`UserController`)
- **Fonctions:** camelCase (`getUserById`)
- **Constantes:** SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Interfaces:** PascalCase avec prefix I (`IUser`)
- **Types:** PascalCase (`UserProfile`)

#### Error Handling:
```typescript
// utils/error.util.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

// Middleware error handler
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
}
```

#### Logger:
```typescript
// utils/logger.util.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

#### Tests OBLIGATOIRES:
```typescript
// tests/auth.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Auth Service', () => {
  describe('POST /auth/phone/send-otp', () => {
    it('should send OTP to valid phone number', async () => {
      const res = await request(app)
        .post('/auth/phone/send-otp')
        .send({ phone: '+79991234567' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'OTP sent');
    });

    it('should reject invalid phone number', async () => {
      const res = await request(app)
        .post('/auth/phone/send-otp')
        .send({ phone: 'invalid' });

      expect(res.status).toBe(400);
    });
  });
});
```

**Coverage minimum:** 80% (obligatoire avant merge)

---

### 🚀 Déploiement Production (Selectel)

**Configuration Selectel:**
- **VPS:** 4 vCPU, 8GB RAM (Phase MVP 0-500 users)
- **Storage:** S3-compatible Selectel Object Storage (50GB)
- **DNS:** Cloudflare (gratuit)
- **SSL:** Let's Encrypt (gratuit)

**Docker Compose Production:**
```yaml
# infrastructure/docker/docker-compose.prod.yml
version: '3.8'

services:
  gateway:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    restart: unless-stopped

  auth-service:
    image: moydate/auth-service:latest
    env_file: .env.prod
    restart: unless-stopped
    depends_on:
      - postgres
      - redis

  # ... autres services

  postgres:
    image: postgres:16-alpine
    env_file: .env.prod
    volumes:
      - /var/lib/postgresql/data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 1gb --maxmemory-policy allkeys-lru
    restart: unless-stopped

  rabbitmq:
    image: rabbitmq:3.12-alpine
    env_file: .env.prod
    restart: unless-stopped
```

---

### ✅ Checklist par Service (pour vous)

Avant de considérer un service "terminé":

- [ ] Toutes les routes implémentées
- [ ] Validation input (Zod ou Joi)
- [ ] Error handling complet
- [ ] Rate limiting configuré
- [ ] Tests unitaires (>80% coverage)
- [ ] Tests intégration (endpoints critiques)
- [ ] Events RabbitMQ (publish/consume)
- [ ] Migrations DB créées
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Logs Winston configurés
- [ ] Variables d'environnement documentées (.env.example)
- [ ] Dockerfile fonctionnel
- [ ] README.md à jour

---

### 📚 Ressources & Documentation

**Lectures obligatoires:**
- `docs/BACKEND_ARCHITECTURE_V2_UPDATED.md` - Architecture complète
- `docs/RABBITMQ_EXPLAINED.md` - RabbitMQ expliqué
- `docs/PREMIUM_PRICING_STRATEGY.md` - Stratégie pricing
- `docs/FREE_VS_PREMIUM_FEATURES.md` - Features gratuites vs Premium

**APIs externes à intégrer:**
- VK API: https://dev.vk.com/ru/api/access-token/getting-started
- SMSINT.ru: https://smsint.ru/api
- DeepL: https://www.deepl.com/docs-api
- Firebase Cloud Messaging: https://firebase.google.com/docs/cloud-messaging

**Technologies:**
- BetterAuth: https://www.better-auth.com/docs
- Express: https://expressjs.com
- Socket.io: https://socket.io/docs/v4
- Prisma: https://www.prisma.io/docs
- RabbitMQ: https://www.rabbitmq.com/tutorials

---

### 🎯 Priorités d'Implémentation

**Phase 1 (MVP 0-500 users) - 8 semaines:**
1. ✅ Auth Service (Semaine 1-2)
2. ✅ Profile Service (Semaine 2-3)
3. ✅ Matching Service (Semaine 3-4)
4. ✅ Messaging Service (Semaine 4-5)
5. ✅ Narrative Service (Semaine 5-6) ⭐ CORE
6. ✅ Social Feed Service (Semaine 6-7)
7. ✅ Notification Service (Semaine 7)
8. ✅ Premium Service (Semaine 7-8)

**Phase 2 (features secondaires):**
9. ✅ Tracker Service
10. ✅ Gamification Service
11. ✅ Translation Service

---

### ⚠️ Points d'Attention CRITIQUES

**1. Sécurité:**
- **JAMAIS** stocker passwords en clair (bcrypt obligatoire)
- **TOUJOURS** valider input côté serveur
- **TOUJOURS** rate limit les endpoints sensibles
- **JAMAIS** logger de données sensibles (tokens, passwords)

**2. Performance:**
- Cacher les profils en Redis (TTL 15min)
- Indexer toutes les colonnes utilisées dans WHERE
- Paginer toutes les listes (max 50 items/page)
- Compresser les images (Sharp)

**3. Scalabilité:**
- Stateless services (pas de session in-memory)
- Redis adapter pour Socket.io (scaling horizontal)
- RabbitMQ pour découplage services
- Database per service (pas de shared DB)

**4. Monitoring:**
- Logs structurés (Winston + JSON)
- Health checks (`/health` endpoint)
- Prometheus metrics (optionnel Phase 1)

---

### 🤝 Communication & Support

**Questions techniques:**
- Créer issue sur GitHub avec label `question`
- Daily standup 10h (Moscow time)
- Code review obligatoire avant merge

**Code review checklist:**
- [ ] Code suit standards projet
- [ ] Tests passent (>80% coverage)
- [ ] Pas de secrets hardcodés
- [ ] Documentation à jour
- [ ] Variables d'environnement dans .env.example

---

**BON COURAGE!**

Vous construisez le backend d'une app qui va révolutionner le dating en Russie! 🚀

Le **Narrative Engine** est votre priorité #1 - c'est ce qui nous différencie de toutes les autres apps de rencontre. Faites-en quelque chose de génial!

---

