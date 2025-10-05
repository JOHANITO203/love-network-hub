# MatchModal Component

## Overview

The `MatchModal` component is a full-screen animated modal that celebrates when two users mutually like each other (match). It features sophisticated animations, glassmorphism effects, and confetti celebration.

## Location

- **Component**: `src/components/match/MatchModal.tsx`
- **Utilities**: `src/utils/matchMessages.ts`
- **Index**: `src/components/match/index.ts`

## Features

### Visual Design
- ✅ Full-screen modal overlay with semi-transparent backdrop
- ✅ Glassmorphism effect on modal background
- ✅ Circular profile photos with glowing animated borders
- ✅ Gradient title with sparkle icons
- ✅ Responsive mobile-first design
- ✅ Dark mode support

### Animations (Framer Motion)
- ✅ Modal entrance/exit (scale + opacity)
- ✅ Profile photos slide in from left and right with bounce effect
- ✅ Rotating and bouncing heart icon in center
- ✅ Pulsing glow rings around profile photos
- ✅ Falling confetti/hearts animation
- ✅ Hover effects on buttons

### Internationalization
- ✅ Support for English (en), French (fr), and Russian (ru)
- ✅ Dynamic text based on language prop
- ✅ Extensible message system

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls modal visibility |
| `onClose` | `() => void` | Yes | Callback when modal is closed |
| `currentUserPhoto` | `string` | Yes | URL of current user's profile photo |
| `currentUserName` | `string` | Yes | Current user's first name |
| `matchedUserPhoto` | `string` | Yes | URL of matched user's profile photo |
| `matchedUserName` | `string` | Yes | Matched user's first name |
| `onSayHello` | `() => void` | Yes | Callback when "Say Hello" button is clicked |
| `language` | `'en' \| 'fr' \| 'ru'` | No | Language for UI text (default: 'fr') |

## Usage

### Basic Usage

```tsx
import { MatchModal } from '@/components/match';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <MatchModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      currentUserPhoto="https://example.com/user1.jpg"
      currentUserName="Marie"
      matchedUserPhoto="https://example.com/user2.jpg"
      matchedUserName="Pierre"
      onSayHello={() => {
        console.log('Opening chat...');
        setShowModal(false);
      }}
      language="fr"
    />
  );
}
```

### Integration with useMatching Hook

The `MatchModal` is automatically integrated with the `useMatching` hook:

```tsx
import { useMatching } from '@/hooks/useMatching';
import { MatchModal } from '@/components/match';

function DiscoverPage() {
  const {
    matchModalData,
    showMatchModal,
    closeMatchModal,
    handleLike,
  } = useMatching();

  return (
    <>
      {/* Your discover UI */}

      {matchModalData && (
        <MatchModal
          isOpen={showMatchModal}
          onClose={closeMatchModal}
          currentUserPhoto={matchModalData.currentUserPhoto}
          currentUserName={matchModalData.currentUserName}
          matchedUserPhoto={matchModalData.matchedUserPhoto}
          matchedUserName={matchModalData.matchedUserName}
          onSayHello={() => {
            // Navigate to chat
            closeMatchModal();
          }}
        />
      )}
    </>
  );
}
```

## Animation Details

### Modal Animation
- **Entrance**: Scale from 0.8 to 1.0 with fade-in (spring animation)
- **Exit**: Scale to 0.8 with fade-out
- **Duration**: 0.5s with spring physics

### Profile Photos
- **Left photo**: Slides from -100px, rotates -5°
- **Right photo**: Slides from +100px, rotates +5°
- **Glow effect**: Pulsing box-shadow (2s loop)
- **Border rings**: Scale animation (1.0 → 1.1 → 1.0)

### Heart Icon
- **Entrance**: Scale from 0 with -180° rotation
- **Idle**: Breathing scale animation (1.0 → 1.2 → 1.0)

### Confetti
- **Count**: 30 particles
- **Colors**: Primary (#E94057), Orange (#F27121), Yellow (#F5C33B)
- **Animation**: Fall from top to bottom with rotation
- **Duration**: 3s per particle
- **Staggered**: Random delay 0-0.5s

## Color Scheme

```css
/* Primary Gradient */
from: #E94057 (Love Primary)
via:  #F27121 (Orange)
to:   #F5C33B (Yellow)

/* Glows */
Red glow:    rgba(233, 64, 87, 0.5)
Yellow glow: rgba(245, 195, 59, 0.5)
```

## i18n Messages

The component uses the `matchMessages` utility from `src/utils/matchMessages.ts`:

```typescript
import { getMatchMessage } from '@/utils/matchMessages';

// Get localized message
const title = getMatchMessage('fr', 'title'); // "C'est un match !"
const subtitle = getMatchMessage('fr', 'subtitle', 'Pierre');
// "Vous et Pierre vous aimez mutuellement"
```

### Available Message Keys
- `title` - Main heading
- `subtitle(name)` - Subtitle with matched user's name
- `sayHello` - Primary button text
- `keepSwiping` - Secondary button text
- `chatOpened` - Toast title when chat opens
- `chatDescription(name)` - Toast description

## Styling

The component uses:
- **Tailwind CSS** for utility classes
- **Custom gradients** for primary colors
- **Backdrop blur** for glassmorphism
- **Dark mode** via `dark:` classes

### Key Classes
```tsx
// Glassmorphism card
className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"

// Gradient text
className="bg-gradient-to-r from-[#E94057] via-[#F27121] to-[#F5C33B] bg-clip-text text-transparent"

// Gradient button
className="bg-gradient-to-r from-[#E94057] to-[#F27121]"
```

## Accessibility

- ✅ Keyboard navigation support (modal closes on backdrop click)
- ✅ Focus management (modal prevents interaction with background)
- ✅ Semantic HTML structure
- ✅ Alt text support for images
- ✅ ARIA labels (can be enhanced)

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ⚠️ Requires CSS backdrop-filter support for glassmorphism
- ⚠️ Framer Motion requires JavaScript enabled

## Performance Considerations

- **Confetti particles**: Limited to 30 particles for performance
- **Animations**: GPU-accelerated (transform, opacity)
- **Images**: Should be optimized before display
- **Mount/Unmount**: Uses AnimatePresence for clean transitions

## Future Enhancements

### Potential Improvements
- [ ] Add sound effects on match
- [ ] Customize confetti colors per user
- [ ] Add share match functionality
- [ ] Show compatibility percentage
- [ ] Add lottie animations option
- [ ] Support video profiles
- [ ] Add undo/report functionality
- [ ] Enhanced accessibility (ARIA)

## Dependencies

```json
{
  "framer-motion": "^11.x.x",
  "lucide-react": "^0.x.x"
}
```

## Testing

### Manual Testing Checklist
- [ ] Modal opens when match occurs
- [ ] Animations play smoothly
- [ ] Both profile photos display correctly
- [ ] "Say Hello" button navigates to chat
- [ ] "Keep Swiping" closes modal
- [ ] Modal closes on backdrop click
- [ ] Confetti animation plays
- [ ] Works on mobile devices
- [ ] Dark mode displays correctly
- [ ] All 3 languages work correctly

### Test Match Scenario

```typescript
// Simulate a match in useMatching hook
const testMatch = {
  currentUserPhoto: '/test-user-1.jpg',
  currentUserName: 'Test User',
  matchedUserPhoto: '/test-user-2.jpg',
  matchedUserName: 'Matched User',
  matchId: 'test-match-123'
};
```

## Troubleshooting

### Modal doesn't appear
- Check `isOpen` prop is true
- Verify z-index is not blocked by other elements
- Ensure framer-motion is installed

### Photos don't load
- Verify image URLs are valid
- Check CORS policies for external images
- Provide fallback placeholder images

### Animations are choppy
- Reduce confetti particle count
- Check device performance
- Disable animations for low-end devices

### Language not changing
- Verify language prop is correctly passed
- Check matchMessages.ts has all translations
- Ensure language code is valid ('en', 'fr', 'ru')

## Related Files

- `src/hooks/useMatching.tsx` - Matching logic and modal state
- `src/components/DatingApp.tsx` - Modal integration
- `src/utils/matchMessages.ts` - i18n messages
- `src/components/match/MatchModal.tsx` - Main component

## Credits

- Design specification: "Etape 6 pour OpenAI Codex _ Match Modal de l'Application МойDate.md"
- Animation library: Framer Motion
- Icon library: Lucide React
