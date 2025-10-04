# МойDate Frontend Implementation Blueprint

## Executive Summary

This document provides a comprehensive architectural blueprint for implementing the МойDate dating application frontend. The application combines dating features with reality TV-style storytelling and social gamification, built with React (Vite), TailwindCSS, Framer Motion, and Supabase.

**Core Philosophy**: Mobile-first, responsive, sarcastic AI narrative, intercultural matchmaking

---

## 1. System Architecture Overview

### 1.1 Technology Stack

- **Framework**: React 18.3+ with TypeScript
- **Build Tool**: Vite 5.4+
- **Styling**: TailwindCSS with custom theme
- **Animations**: Framer Motion
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6
- **Backend**: Supabase (Auth, Database, Storage, Realtime)
- **Internationalization**: react-intl
- **UI Components**: Radix UI primitives + custom components

### 1.2 Design System

#### Color Palette
```typescript
primary: '#E94057' // Rouge vif (main CTA, hearts, likes)
background-light: '#FFFFFF' // White backgrounds
text-dark: '#111' // Primary text
text-secondary: '#666' // Secondary text
text-meta: '#9AA0A6' // Metadata/subtle text
gradients: 'pink/violet' // Subtle background gradients
```

#### Typography
- Font Family: Inter / SF Pro (system fonts)
- Hierarchy: Clear heading/body distinction
- Mobile-first sizing with responsive scaling

#### Visual Style
- **Borders**: Rounded XL (`rounded-xl` = 12px)
- **Shadows**: Soft shadows (`shadow-lg`) for depth
- **Effects**: Glassmorphism on modals
- **Icons**: Lucide React icons
- **Emojis**: Extensive use for personality

---

## 2. Component Architecture

### 2.1 Component Hierarchy

```
src/
├── components/
│   ├── auth/
│   │   ├── OtpInput.tsx
│   │   ├── PhoneInput.tsx
│   │   └── CountrySelector.tsx
│   │
│   ├── onboarding/
│   │   ├── OnboardingSlide.tsx
│   │   └── SlideIndicator.tsx
│   │
│   ├── profile/
│   │   ├── PhotoUploader.tsx (✓ exists)
│   │   ├── PhotoGallery.tsx
│   │   ├── InterestSelector.tsx
│   │   ├── CountryPicker.tsx
│   │   ├── AstrologicalBadge.tsx
│   │   ├── DiasporaChip.tsx
│   │   └── BadgeDisplay.tsx
│   │
│   ├── discover/
│   │   ├── SwipeCard.tsx
│   │   ├── SwipeActions.tsx
│   │   ├── PhotoDots.tsx
│   │   ├── ProfilePreview.tsx
│   │   └── FilterPanel.tsx (extends AdvancedFiltersPanel)
│   │
│   ├── match/
│   │   ├── MatchModal.tsx
│   │   └── MatchAnimation.tsx
│   │
│   ├── matches/
│   │   ├── MatchesList.tsx
│   │   ├── MatchCard.tsx
│   │   ├── LikedYouList.tsx
│   │   └── QuickActions.tsx
│   │
│   ├── chat/
│   │   ├── ConversationList.tsx
│   │   ├── ChatView.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx
│   │   ├── DisclaimerBanner.tsx
│   │   └── MediaPicker.tsx
│   │
│   ├── feed/
│   │   ├── SocialFeed.tsx (✓ exists - enhance)
│   │   ├── FeedPost.tsx
│   │   ├── SarcasticOverlay.tsx
│   │   ├── StoryViewer.tsx
│   │   ├── MatchPost.tsx
│   │   ├── CouplePost.tsx
│   │   ├── BadgePost.tsx
│   │   └── CommentSection.tsx
│   │
│   ├── settings/
│   │   ├── ProfileEditor.tsx
│   │   ├── DiscoveryPreferences.tsx
│   │   ├── NotificationSettings.tsx
│   │   ├── SecuritySettings.tsx
│   │   └── AccountSettings.tsx
│   │
│   ├── shared/
│   │   ├── Navigation.tsx (✓ exists)
│   │   ├── BottomNav.tsx
│   │   ├── Avatar.tsx
│   │   ├── StatusIndicator.tsx
│   │   ├── LoadingState.tsx
│   │   └── EmptyState.tsx
│   │
│   └── ui/ (✓ Radix UI components exist)
│
├── pages/
│   ├── OnboardingScreen.tsx
│   ├── AuthScreen.tsx (enhance Auth.tsx)
│   ├── ProfileSetupScreen.tsx (enhance ProfileSetup.tsx)
│   ├── DiscoverScreen.tsx
│   ├── ProfileDetailScreen.tsx
│   ├── MatchesListScreen.tsx
│   ├── MessagesChatScreen.tsx
│   ├── SocialFeedScreen.tsx
│   └── SettingsProfileScreen.tsx
│
├── hooks/
│   ├── useAuth.tsx (✓ exists)
│   ├── useMatching.tsx (✓ exists)
│   ├── useProfile.tsx
│   ├── useSwipe.tsx
│   ├── useChat.tsx
│   ├── useRealtime.tsx
│   ├── useFeedPosts.tsx (✓ exists)
│   ├── useNotifications.tsx (✓ exists)
│   ├── useGeolocation.tsx (✓ exists)
│   ├── useProfilePhotos.tsx (✓ exists)
│   ├── useAdvancedFilters.tsx (✓ exists)
│   ├── useKeywordDetection.tsx
│   └── useI18n.tsx
│
├── utils/
│   ├── astrology.ts
│   ├── ageCalculation.ts
│   ├── diaspora.ts
│   ├── templateEngine.ts
│   ├── keywordDetector.ts (✓ exists)
│   ├── translation.ts (✓ exists)
│   ├── errorMessage.ts (✓ exists)
│   ├── autoMessages.ts (✓ exists)
│   ├── feedAutoPost.ts (✓ exists)
│   └── validation.ts
│
├── data/
│   ├── feedTemplates.ts (import from JSON)
│   ├── profileOptions.ts (✓ exists)
│   ├── countries.ts
│   └── badges.ts
│
├── types/
│   ├── profile.ts
│   ├── match.ts
│   ├── message.ts
│   ├── feed.ts
│   └── index.ts
│
└── lib/
    ├── supabase.ts
    └── framer-variants.ts
```

### 2.2 Component Reusability Matrix

#### Highly Reusable Components (Use Everywhere)
- `Avatar` - User profile pictures
- `Badge` - Status indicators (Verified, Diaspora, etc.)
- `Button` - All CTAs
- `Card` - Content containers
- `StatusIndicator` - Online/offline
- `LoadingState` - Skeleton screens
- `EmptyState` - No data screens

#### Context-Specific Components
- `SwipeCard` - Only in Discover
- `MessageBubble` - Only in Chat
- `FeedPost` - Only in Social Feed
- `MatchModal` - Triggered from Discover/Matches

#### Shared Patterns
- **Photo Carousels**: Discover, Profile Detail, Settings
- **Filter Panels**: Discover, Matches, Feed
- **Action Buttons**: Swipe actions, Quick actions, Message actions
- **Navigation**: Bottom nav (mobile), Sidebar (desktop)

---

## 3. Data Flow Architecture

### 3.1 State Management Strategy

#### Global State (React Context)
```typescript
// AuthContext (✓ exists)
- user: User | null
- session: Session | null
- loading: boolean
- signIn, signOut, signUp

// ProfileContext (NEW)
- profile: UserProfile | null
- updateProfile()
- uploadPhotos()
- updatePreferences()

// MatchingContext (enhance useMatching)
- matches: Match[]
- likedYou: Profile[]
- swipeHistory: SwipeAction[]
- currentProfile: Profile | null
- swipeLeft(), swipeRight(), superLike()

// ChatContext (NEW)
- conversations: Conversation[]
- activeChat: ChatId | null
- sendMessage(), markAsRead()
- onNewMessage (realtime)

// FeedContext (NEW)
- posts: FeedPost[]
- loadMore()
- likePost(), commentPost()
- sarcasticTemplates
```

#### Local State (useState/useReducer)
- Form inputs
- UI toggles (modals, drawers)
- Temporary selections
- Animation states

#### Server State (TanStack Query)
```typescript
// Query Keys
profiles.list
profiles.detail(id)
matches.list
matches.likedYou
messages.list(chatId)
feed.list
user.profile
```

### 3.2 Data Models

#### Core Types
```typescript
// User Profile
interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name?: string;
  date_of_birth: Date;
  age: number; // calculated
  astrological_sign: AstrologicalSign; // calculated
  gender: 'male' | 'female' | 'other';
  orientation: 'heterosexual' | 'gay' | 'lesbian'; // private
  bio?: string;
  job?: string;
  interests: string[];
  country_origin: string; // ISO2
  country_current: string; // ISO2
  is_diaspora: boolean; // calculated
  photos: ProfilePhoto[];
  badges: Badge[];
  created_at: Date;
  updated_at: Date;
}

// Profile Photo
interface ProfilePhoto {
  id: string;
  profile_id: string;
  url: string;
  order: number;
  is_primary: boolean;
}

// Match
interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: Date;
  status: 'active' | 'unmatched';
  profile: UserProfile; // populated
}

// Message
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'emoji' | 'image' | 'video' | 'audio';
  media_url?: string;
  read_at?: Date;
  sent_at: Date;
}

// Feed Post
interface FeedPost {
  id: string;
  type: 'match' | 'couple' | 'badge' | 'story' | 'sarcastic';
  template_id?: number;
  content: string; // generated from template
  overlay?: string; // sarcastic narrator
  profiles: UserProfile[];
  media_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: Date;
}

// Badge
interface Badge {
  id: string;
  type: 'verified' | 'diaspora' | 'intercultural' |
        'couple_official' | 'superlike' | 'premium';
  unlocked_at: Date;
  icon: string;
  label: string;
}

// Swipe Action
interface SwipeAction {
  id: string;
  swiper_id: string;
  target_id: string;
  action: 'like' | 'dislike' | 'superlike';
  created_at: Date;
}

// Discovery Preferences
interface DiscoveryPreferences {
  user_id: string;
  gender_preference: 'male' | 'female' | 'all';
  age_min: number;
  age_max: number;
  distance_max: number;
  origin_countries: string[];
  interests: string[];
  intercultural_boost: boolean;
}
```

---

## 4. Routing Structure

```typescript
// Route Definitions
const routes = [
  {
    path: '/',
    element: <OnboardingScreen />,
    auth: false,
    description: 'Landing - 3 slides intro'
  },
  {
    path: '/auth',
    element: <AuthScreen />,
    auth: false,
    description: 'OTP authentication (phone/email)'
  },
  {
    path: '/profile/setup',
    element: <ProfileSetupScreen />,
    auth: true,
    description: 'Initial profile configuration'
  },
  {
    path: '/discover',
    element: <DiscoverScreen />,
    auth: true,
    description: 'Main swipe interface'
  },
  {
    path: '/profile/:userId',
    element: <ProfileDetailScreen />,
    auth: true,
    description: 'Detailed profile view'
  },
  {
    path: '/matches',
    element: <MatchesListScreen />,
    auth: true,
    description: 'Matches & Liked You lists'
  },
  {
    path: '/messages',
    element: <MessagesChatScreen />,
    auth: true,
    children: [
      { path: ':conversationId', element: <ChatView /> }
    ],
    description: 'Conversations list & chat'
  },
  {
    path: '/feed',
    element: <SocialFeedScreen />,
    auth: true,
    description: 'Reality mode social feed'
  },
  {
    path: '/settings',
    element: <SettingsProfileScreen />,
    auth: true,
    description: 'Profile editor & app settings'
  }
];

// Navigation Flow
Onboarding → Auth → Profile Setup → Discover
                                   ↓
                              [Bottom Nav]
                    Discover | Matches | Feed | Messages | Settings
```

---

## 5. Animation Patterns with Framer Motion

### 5.1 Global Variants Library

```typescript
// src/lib/framer-variants.ts

// Page Transitions
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Swipe Card Animations
export const swipeVariants = {
  center: { x: 0, y: 0, rotate: 0, opacity: 1 },
  left: { x: -300, rotate: -20, opacity: 0 },
  right: { x: 300, rotate: 20, opacity: 0 },
  up: { y: -300, opacity: 0 }
};

// Modal Animations
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

// Match Modal Special
export const matchModalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300
    }
  }
};

// Photo Carousel
export const photoSlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

// List Item Stagger
export const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Hover Effects
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export const hoverTap = {
  scale: 0.95,
  transition: { duration: 0.1 }
};
```

### 5.2 Animation Usage Per Screen

#### Onboarding
- Slide transitions: horizontal slide + fade
- CTA buttons: scale on hover

#### Auth
- OTP input: auto-focus slide
- Form transitions: fade between states

#### Profile Setup
- Photo upload: scale + fade
- Section transitions: accordion-style

#### Discover (Swipe)
- Card drag: pan gestures with rotation
- Photo change: horizontal slide
- Action buttons: scale + bounce

#### Match Modal
- Entry: scale + spring animation
- Photos: move towards center
- Exit: fade + scale

#### Matches List
- Grid items: stagger fade-in
- Quick actions: slide from bottom

#### Chat
- Message bubbles: fade + slide
- Disclaimer banner: slide from top
- Typing indicator: bounce dots

#### Feed
- Posts: stagger scroll appearance
- Sarcastic overlay: pop-in effect
- Like animation: heart burst

#### Settings
- Section expansion: accordion
- Photo reorder: drag-and-drop

---

## 6. Internationalization (i18n) Strategy

### 6.1 Setup

```typescript
// src/lib/i18n.ts
import { IntlProvider } from 'react-intl';

export const locales = ['fr', 'en', 'pt', 'ru'];
export const defaultLocale = 'fr';

// Language files structure
src/locales/
  ├── fr.json
  ├── en.json
  ├── pt.json
  └── ru.json
```

### 6.2 Translation Keys Structure

```json
{
  "app": {
    "name": "МойDate",
    "tagline": "Real People. Real Drama."
  },
  "auth": {
    "signIn": "Se connecter",
    "signUp": "S'inscrire",
    "continue": "Continuer",
    "resend": "Renvoyer le code"
  },
  "profile": {
    "setup": "Configuration du profil",
    "addPhotos": "Ajouter des photos",
    "interests": "Centres d'intérêt",
    "origin": "Pays d'origine"
  },
  "discover": {
    "noMore": "Plus de profils pour le moment",
    "like": "J'aime",
    "pass": "Passer",
    "superlike": "Super Like"
  },
  "feed": {
    "title": "Reality Mode",
    "newMatch": "Nouveau match!",
    "couple": "Couple officiel"
  }
}
```

### 6.3 Usage Pattern

```tsx
import { useIntl } from 'react-intl';

const Component = () => {
  const intl = useIntl();

  return (
    <button>
      {intl.formatMessage({ id: 'discover.like' })}
    </button>
  );
};
```

---

## 7. Implementation Order & Dependencies

### Phase 1: Foundation (Week 1)
**Priority: Critical Path**

1. **Setup Core Infrastructure**
   - Enhance TailwindCSS config with МойDate colors
   - Create Framer Motion variants library
   - Setup i18n structure
   - Define TypeScript types

2. **Authentication Flow**
   - Enhance `Auth.tsx` → `AuthScreen.tsx`
   - Create `OtpInput.tsx` component
   - Create `PhoneInput.tsx` with country selector
   - Implement OTP verification logic

3. **Onboarding Experience**
   - Create `OnboardingScreen.tsx`
   - 3 slides: Algorithm, Matches, Premium
   - Slide navigation with animations

**Deliverables**: Users can onboard and authenticate

---

### Phase 2: Profile System (Week 2)
**Priority: Core Feature**

1. **Profile Setup Enhancement**
   - Enhance `ProfileSetup.tsx` → `ProfileSetupScreen.tsx`
   - Multi-photo upload (1-9 photos)
   - Date picker with age/astro calculation
   - Interest selector with icons
   - Country picker with flags & Diaspora detection

2. **Utilities**
   - `astrology.ts` - Sign calculation from DOB
   - `ageCalculation.ts` - Age from DOB
   - `diaspora.ts` - Detect origin ≠ current
   - `countries.ts` - ISO2 + flags data

3. **Profile Display**
   - Create `ProfileDetailScreen.tsx`
   - Photo gallery with navigation
   - Badge display system
   - Bio, interests, location display

**Deliverables**: Complete profile creation and viewing

---

### Phase 3: Discovery & Matching (Week 3)
**Priority: Core Feature**

1. **Discover Screen**
   - Create `DiscoverScreen.tsx`
   - `SwipeCard.tsx` with drag gestures
   - `PhotoDots.tsx` for image navigation
   - `SwipeActions.tsx` - Like, Pass, SuperLike
   - Keyboard shortcuts (desktop)

2. **Filtering System**
   - Extend `AdvancedFiltersPanel.tsx`
   - Gender, age range, distance slider
   - Origin countries multi-select
   - Intercultural boost toggle

3. **Match Modal**
   - Create `MatchModal.tsx`
   - Animated entry with photos
   - "Say hello" / "Keep swiping" CTAs

4. **Matches List**
   - Create `MatchesListScreen.tsx`
   - "Your Matches" grid
   - "Liked You" grid with quick actions
   - Navigation to chat

**Deliverables**: Full swipe-match workflow

---

### Phase 4: Messaging System (Week 4)
**Priority: Core Feature**

1. **Chat Infrastructure**
   - Create `MessagesChatScreen.tsx`
   - `ConversationList.tsx` with previews
   - `ChatView.tsx` with message history
   - `MessageBubble.tsx` component

2. **Message Input**
   - `MessageInput.tsx` with rich features
   - Emoji picker integration
   - File/media attachment (simulate upload)
   - Audio message (simulate recording)

3. **Safety Features**
   - `DisclaimerBanner.tsx`
   - Keyword detection integration (`keywordDetector.ts`)
   - Auto-display on suspicious keywords

4. **Realtime**
   - Supabase Realtime subscriptions
   - `useRealtime.tsx` hook
   - Online/offline status
   - Typing indicators

**Deliverables**: Full messaging experience

---

### Phase 5: Social Feed (Reality Mode) (Week 5)
**Priority: Differentiator Feature**

1. **Feed Template System**
   - Import `moydate_feed_templates.json` → `feedTemplates.ts`
   - Create `templateEngine.ts` for dynamic generation
   - Mock data generator for testing

2. **Feed Posts**
   - Enhance `SocialFeed.tsx` → `SocialFeedScreen.tsx`
   - Create `FeedPost.tsx` with type variants:
     - `MatchPost.tsx` - New matches
     - `CouplePost.tsx` - Official couples
     - `BadgePost.tsx` - Badge unlocks
     - `StoryViewer.tsx` - 45s stories
     - Sarcastic posts with `SarcasticOverlay.tsx`

3. **Interactions**
   - Like button with animation
   - `CommentSection.tsx`
   - Profile navigation from posts

4. **Auto-Generation**
   - Integrate `feedAutoPost.ts`
   - Server-side triggers (future)

**Deliverables**: Engaging social feed with humor

---

### Phase 6: Settings & Profile Management (Week 6)
**Priority: Necessary Feature**

1. **Settings Screen**
   - Create `SettingsProfileScreen.tsx`
   - Section-based layout (accordion)

2. **Profile Editor**
   - `ProfileEditor.tsx` - Edit all fields
   - Photo management (add, delete, reorder)
   - Preview mode

3. **Preferences**
   - `DiscoveryPreferences.tsx`
   - `NotificationSettings.tsx` with toggles
   - `SecuritySettings.tsx` (password, devices, blocked users)

4. **Account Actions**
   - `AccountSettings.tsx`
   - Logout
   - Delete account (with confirmation)

**Deliverables**: Complete user control panel

---

### Phase 7: Polish & Optimization (Week 7)
**Priority: UX Excellence**

1. **Responsive Design Audit**
   - Test all screens on mobile (320px - 768px)
   - Test tablet (768px - 1024px)
   - Test desktop (1024px+)
   - Desktop modal containers (max-width: 560px)

2. **Animation Refinement**
   - Performance optimization
   - Reduce motion preferences
   - Loading states everywhere

3. **Error Handling**
   - Network error states
   - Form validation with friendly messages
   - Empty states with illustrations

4. **Accessibility**
   - Keyboard navigation
   - Screen reader labels
   - Focus management
   - Color contrast

**Deliverables**: Production-ready polish

---

## 8. Shared Utilities & Hooks

### 8.1 Custom Hooks

#### useSwipe.tsx
```typescript
export const useSwipe = () => {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const swipeLeft = async () => { /* ... */ };
  const swipeRight = async () => { /* ... */ };
  const superLike = async () => { /* ... */ };

  return { currentProfile, swipeLeft, swipeRight, superLike };
};
```

#### useChat.tsx
```typescript
export const useChat = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (content: string) => { /* ... */ };
  const subscribeToMessages = () => { /* ... */ };

  return { messages, sendMessage, isTyping };
};
```

#### useProfile.tsx
```typescript
export const useProfile = (userId?: string) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId)
  });

  const updateProfile = useMutation({
    mutationFn: (data: Partial<UserProfile>) => updateProfileApi(data)
  });

  return { profile, updateProfile, isLoading };
};
```

### 8.2 Utility Functions

#### astrology.ts
```typescript
export const getAstrologicalSign = (dateOfBirth: Date): AstrologicalSign => {
  const month = dateOfBirth.getMonth() + 1;
  const day = dateOfBirth.getDate();

  // Zodiac date ranges
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  // ... all signs
};

export const getSignEmoji = (sign: AstrologicalSign): string => {
  const emojiMap = {
    aries: '♈', taurus: '♉', gemini: '♊',
    // ... all signs
  };
  return emojiMap[sign];
};
```

#### templateEngine.ts
```typescript
import templates from '@/data/feedTemplates';

export const generateSarcasticPost = (
  templateType: string,
  data: Record<string, any>
): string => {
  const template = templates.find(t => t.type === templateType);
  if (!template) return '';

  let content = template.template;

  // Replace placeholders
  Object.keys(data).forEach(key => {
    content = content.replace(`{${key}}`, data[key]);
  });

  return content;
};
```

---

## 9. Integration with Supabase

### 9.1 Database Tables (Reference)

Based on existing migrations, ensure these tables exist:

- `profiles` - User profiles
- `profile_photos` - Multiple photos per profile
- `swipes` - Swipe actions
- `matches` - Mutual likes
- `conversations` - Chat rooms
- `messages` - Chat messages
- `feed_posts` - Social feed content
- `badges` - User achievements
- `notifications` - Push notifications
- `discovery_preferences` - Filter settings

### 9.2 Realtime Subscriptions

```typescript
// New matches
supabase
  .channel('matches')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'matches',
    filter: `user1_id=eq.${userId}`
  }, handleNewMatch)
  .subscribe();

// New messages
supabase
  .channel(`conversation:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, handleNewMessage)
  .subscribe();
```

### 9.3 Storage Buckets

- `profile-photos` - User photos (public)
- `chat-media` - Message attachments (private)
- `stories` - 45s video stories (temporary)

---

## 10. Key Architectural Decisions

### Decision 1: State Management
**Choice**: React Context + TanStack Query
**Rationale**:
- Context for global auth/user state
- TanStack Query for server state caching
- Avoids Redux complexity for this scale
- Built-in loading/error states

### Decision 2: Component Library
**Choice**: Radix UI primitives + custom components
**Rationale**:
- Already integrated (package.json)
- Accessible by default
- Headless UI allows full style control
- Matches МойDate design system

### Decision 3: Animation Strategy
**Choice**: Framer Motion exclusively
**Rationale**:
- Already in dependencies
- Declarative API matches React patterns
- Powerful gesture support for swipe
- Excellent performance

### Decision 4: Routing
**Choice**: React Router v6
**Rationale**:
- Already integrated
- Standard industry choice
- Good nested routing support
- Data loading APIs

### Decision 5: Forms
**Choice**: react-hook-form + zod
**Rationale**:
- Already in dependencies
- Best performance for large forms (Profile Setup)
- Type-safe validation with zod
- Excellent DX

### Decision 6: Mobile-First Approach
**Choice**: Start with mobile, enhance for desktop
**Rationale**:
- Dating apps are primarily mobile
- Easier to scale up than down
- Desktop gets modal containers (560px max-width)
- Touch gestures as primary interaction

### Decision 7: i18n Implementation
**Choice**: react-intl
**Rationale**:
- Already in dependencies
- Comprehensive formatting (dates, numbers, plurals)
- Good TypeScript support
- Standard for React apps

---

## 11. Performance Considerations

### 11.1 Optimization Strategies

#### Code Splitting
```typescript
// Lazy load screens
const DiscoverScreen = lazy(() => import('./pages/DiscoverScreen'));
const SocialFeedScreen = lazy(() => import('./pages/SocialFeedScreen'));
```

#### Image Optimization
- Use Supabase image transformations
- Lazy load images outside viewport
- Generate thumbnails for lists
- WebP format with fallbacks

#### Infinite Scroll
- Feed posts: Load 20 at a time
- Matches list: Virtual scrolling for 100+
- Chat history: Load on scroll up

#### Memoization
```typescript
// Expensive calculations
const age = useMemo(() => calculateAge(dateOfBirth), [dateOfBirth]);
const sign = useMemo(() => getAstrologicalSign(dateOfBirth), [dateOfBirth]);
```

#### Debouncing
```typescript
// Search filters
const debouncedSearch = useDebounce(searchTerm, 300);
```

### 11.2 Bundle Size Targets

- Initial bundle: < 200KB gzipped
- Screen chunks: < 50KB each
- Total app: < 1MB

### 11.3 Lighthouse Targets

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 85

---

## 12. Testing Strategy

### 12.1 Component Testing

**Priority Components for Tests**:
1. `OtpInput` - Critical auth flow
2. `SwipeCard` - Core UX
3. `MessageInput` - User input validation
4. `DisclaimerBanner` - Safety feature
5. `PhotoUploader` - Complex interaction

### 12.2 Integration Testing

**Key User Flows**:
1. Onboarding → Auth → Profile Setup
2. Discover → Swipe → Match → Chat
3. Upload photos → Edit profile → Save
4. Send message → Keyword detection → Disclaimer

### 12.3 E2E Testing

**Critical Paths** (Playwright/Cypress):
1. Complete signup journey
2. Create match and send first message
3. Update profile with photos
4. Filter discovery and swipe

---

## 13. Deployment Architecture

### 13.1 Environments

- **Development**: Local Vite dev server
- **Staging**: Vercel/Netlify preview
- **Production**: Vercel/Netlify with CDN

### 13.2 CI/CD Pipeline

```yaml
# GitHub Actions example
on: [push]
jobs:
  build:
    - Lint (ESLint)
    - Type check (TypeScript)
    - Build (Vite)
    - Test (Vitest)
    - Deploy (Vercel)
```

---

## 14. Monitoring & Analytics

### 14.1 Key Metrics to Track

**User Engagement**:
- Daily Active Users (DAU)
- Swipes per session
- Match rate
- Messages sent per match
- Feed post engagement

**Performance**:
- Page load times
- Time to interactive
- API response times
- Error rates

**Business**:
- Signup completion rate
- Profile completion rate
- Time to first match
- Premium conversion (future)

### 14.2 Tools

- **Analytics**: Google Analytics 4 / Mixpanel
- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics / Lighthouse CI

---

## 15. Security Considerations

### 15.1 Frontend Security

- **XSS Prevention**: Sanitize user input (bios, messages)
- **CSRF**: Supabase handles tokens
- **Auth**: Short-lived JWT tokens
- **Storage**: Never store sensitive data in localStorage

### 15.2 Content Moderation

- Keyword detection (`keywordDetector.ts`) for messages
- Photo moderation (manual/AI - future)
- Report/block functionality
- Rate limiting on API calls

---

## 16. Accessibility Guidelines

### 16.1 Requirements

- **WCAG 2.1 Level AA** compliance
- Keyboard navigation for all features
- Screen reader support (ARIA labels)
- Focus indicators on all interactive elements
- Color contrast ratios (4.5:1 text, 3:1 UI)
- Reduced motion support (`prefers-reduced-motion`)

### 16.2 Implementation

```tsx
// Example: Swipe actions with keyboard
<motion.div
  role="button"
  tabIndex={0}
  aria-label={intl.formatMessage({ id: 'discover.like' })}
  onKeyDown={(e) => e.key === 'Enter' && handleLike()}
>
```

---

## 17. Future Enhancements (Post-MVP)

### 17.1 Phase 8+

1. **Video Profiles** - Replace static photos
2. **Voice Messages** - Real audio recording
3. **Live Stories** - Instagram-style 24h stories
4. **Video Calls** - WebRTC integration
5. **Events** - Local dating events
6. **Premium Features** - See who liked you, unlimited swipes
7. **AI Matching** - ML-based compatibility scores
8. **Badges Expansion** - More gamification
9. **Translation** - Real-time message translation
10. **Groups** - Interest-based communities

---

## 18. Success Metrics

### 18.1 Launch Criteria (MVP)

- [ ] All 10 specification screens implemented
- [ ] Mobile responsive (320px - 768px)
- [ ] Desktop responsive (1024px+)
- [ ] All animations smooth (60fps)
- [ ] i18n for 4 languages (FR, EN, PT, RU)
- [ ] Lighthouse score > 90
- [ ] Zero critical bugs
- [ ] Authentication flow 100% functional
- [ ] Swipe-match-chat flow complete
- [ ] Feed posts generating correctly

### 18.2 Post-Launch Goals (Month 1)

- 1,000 registered users
- 10,000 swipes per day
- 500 matches per day
- 100 messages per day
- Average session: 8 minutes
- Feed engagement: 60% of users

---

## 19. Development Workflow

### 19.1 Git Strategy

```
main (production)
└── develop (staging)
    ├── feature/auth-otp
    ├── feature/swipe-cards
    ├── feature/social-feed
    └── fix/photo-upload-bug
```

### 19.2 Commit Convention

```
feat: Add OTP input component
fix: Resolve swipe gesture on mobile
style: Update button hover states
refactor: Extract template engine
docs: Update implementation blueprint
test: Add SwipeCard test suite
```

### 19.3 Code Review Checklist

- [ ] Responsive on all breakpoints
- [ ] Animations use Framer Motion variants
- [ ] i18n keys for all user-facing text
- [ ] TypeScript types defined
- [ ] Loading/error states handled
- [ ] Accessibility attributes present
- [ ] No console errors/warnings

---

## 20. Conclusion

This blueprint provides a comprehensive roadmap for implementing the МойDate frontend application. The architecture prioritizes:

1. **User Experience** - Smooth animations, responsive design
2. **Developer Experience** - Clear patterns, reusable components
3. **Performance** - Optimized loading, efficient state management
4. **Scalability** - Modular architecture, clear separation of concerns
5. **Maintainability** - TypeScript types, documented decisions

### Next Steps

1. Review and approve this blueprint
2. Setup development environment
3. Begin Phase 1 implementation
4. Daily standups to track progress
5. Weekly demos of completed screens

### Questions for Stakeholders

1. Priority of language support? (All 4 or start with FR/EN?)
2. Photo upload limits? (9 photos confirmed?)
3. Premium features scope? (Future or launch?)
4. Analytics provider preference?
5. Desired launch date?

---

**Document Version**: 1.0
**Last Updated**: 2025-10-01
**Author**: System Architecture Designer
**Status**: Ready for Review

---

## Appendix A: File Creation Checklist

### Priority 1 (Week 1-2)
- [ ] `src/lib/framer-variants.ts`
- [ ] `src/types/index.ts`
- [ ] `src/utils/astrology.ts`
- [ ] `src/utils/ageCalculation.ts`
- [ ] `src/utils/diaspora.ts`
- [ ] `src/data/feedTemplates.ts`
- [ ] `src/components/auth/OtpInput.tsx`
- [ ] `src/components/auth/PhoneInput.tsx`
- [ ] `src/pages/OnboardingScreen.tsx`
- [ ] `src/pages/AuthScreen.tsx` (enhance existing)

### Priority 2 (Week 3-4)
- [ ] `src/pages/DiscoverScreen.tsx`
- [ ] `src/components/discover/SwipeCard.tsx`
- [ ] `src/components/discover/SwipeActions.tsx`
- [ ] `src/components/match/MatchModal.tsx`
- [ ] `src/pages/MatchesListScreen.tsx`
- [ ] `src/hooks/useSwipe.tsx`

### Priority 3 (Week 5-6)
- [ ] `src/pages/MessagesChatScreen.tsx`
- [ ] `src/components/chat/ChatView.tsx`
- [ ] `src/components/chat/DisclaimerBanner.tsx`
- [ ] `src/pages/SocialFeedScreen.tsx` (enhance existing)
- [ ] `src/utils/templateEngine.ts`
- [ ] `src/hooks/useChat.tsx`

### Priority 4 (Week 7)
- [ ] `src/pages/SettingsProfileScreen.tsx`
- [ ] `src/components/settings/ProfileEditor.tsx`
- [ ] All remaining components as needed

---

## Appendix B: Existing Codebase Enhancements

### Files to Enhance (Not Replace)

1. **D:\love-network-hub\src\pages\Auth.tsx**
   - Add OTP flow (phone/email toggle)
   - Add country selector for phone
   - Add resend timer
   - Add Framer Motion transitions

2. **D:\love-network-hub\src\components\ProfileSetup.tsx**
   - Add date picker with age/astro calculation
   - Enhance photo uploader to 1-9 photos
   - Add Diaspora detection
   - Add interest selector with icons

3. **D:\love-network-hub\src\components\SocialFeed.tsx**
   - Add feed post types (match, couple, badge, story, sarcastic)
   - Integrate template engine
   - Add sarcastic overlay component
   - Add like/comment interactions

4. **D:\love-network-hub\src\hooks\useMatching.tsx**
   - Add swipe actions (left, right, superlike)
   - Add current profile state
   - Add match detection logic

5. **D:\love-network-hub\tailwind.config.ts**
   - Add МойDate color variables
   - Ensure rounded-xl = 12px
   - Add custom shadow classes

6. **D:\love-network-hub\src\data\profileOptions.ts**
   - Already good, no major changes needed
   - Consider adding more interests if needed

---

## Appendix C: Quick Reference

### Color Variables (Add to CSS)
```css
:root {
  --moydate-primary: #E94057;
  --moydate-bg: #FFFFFF;
  --moydate-text: #111;
  --moydate-text-secondary: #666;
  --moydate-text-meta: #9AA0A6;
  --gradient-pink-violet: linear-gradient(135deg, #FFC3A0 0%, #FFAFBD 100%);
}
```

### Screen Breakpoints
```typescript
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1400px
```

### Desktop Modal Container
```css
@media (min-width: 1024px) {
  .modal-container {
    max-width: 560px;
    margin: 0 auto;
  }
}
```

---

**End of Implementation Blueprint**
