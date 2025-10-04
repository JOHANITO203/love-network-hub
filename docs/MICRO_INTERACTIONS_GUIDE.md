# Micro-Interactions Implementation Guide

This guide demonstrates how to use the sophisticated micro-interaction components built with framer-motion.

## 🎨 Components Overview

### 1. AnimatedButton
Sophisticated button with hover, scale, and glow effects.

**Features:**
- Smooth scale transitions on hover/tap
- Optional glow effect with shadow
- Loading state with spinner
- Multiple variants (primary, secondary, ghost, danger)
- Three sizes (sm, md, lg)

**Usage:**
```tsx
import { AnimatedButton } from '../components/animations';

// Basic usage
<AnimatedButton onClick={handleClick}>
  Click Me
</AnimatedButton>

// With glow effect
<AnimatedButton variant="primary" glowEffect>
  Glow Button
</AnimatedButton>

// With loading state
<AnimatedButton isLoading>
  Loading...
</AnimatedButton>

// Different sizes
<AnimatedButton size="lg" variant="secondary">
  Large Button
</AnimatedButton>
```

### 2. LikeButton
Heart button with pulsation and particle explosion effects.

**Features:**
- Smooth heart fill animation
- Pulsing ring effect on like
- 8-particle explosion animation
- Scale transitions
- Customizable size

**Usage:**
```tsx
import { LikeButton } from '../components/animations';

<LikeButton
  initialLiked={false}
  onLike={(liked) => console.log('Liked:', liked)}
  size={32}
/>
```

### 3. SwipeCard
Tinder-style swipeable card with directional indicators.

**Features:**
- Smooth drag interactions
- Dynamic rotation based on swipe direction
- LIKE/NOPE/SUPER LIKE indicators
- Configurable swipe thresholds
- Velocity-based swipe detection

**Usage:**
```tsx
import { SwipeCard } from '../components/animations';

<SwipeCard
  onSwipeRight={() => console.log('Liked!')}
  onSwipeLeft={() => console.log('Nope!')}
  onSwipeUp={() => console.log('Super Like!')}
>
  <div className="p-6">
    <img src="profile.jpg" alt="Profile" />
    <h3>User Name</h3>
    <p>Bio...</p>
  </div>
</SwipeCard>
```

### 4. LoadingSpinner
Multiple elegant loading animation variants.

**Features:**
- 4 variants: circle, dots, pulse, heart
- 4 sizes: sm, md, lg, xl
- Customizable colors
- Spring-based animations

**Usage:**
```tsx
import { LoadingSpinner } from '../components/animations';

// Circle spinner
<LoadingSpinner variant="circle" size="md" />

// Animated dots
<LoadingSpinner variant="dots" size="lg" color="text-blue-500" />

// Pulsing circle
<LoadingSpinner variant="pulse" size="xl" />

// Heart pulse (perfect for dating app)
<LoadingSpinner variant="heart" size="md" color="text-pink-500" />
```

### 5. AnimatedInput
Form input with floating label and focus animations.

**Features:**
- Floating label that animates on focus
- Smooth border color transitions
- Focus indicator line
- Error state with icon
- Helper text support
- Optional icon

**Usage:**
```tsx
import { AnimatedInput } from '../components/animations';
import { Mail } from 'lucide-react';

// Basic usage
<AnimatedInput
  label="Email"
  type="email"
  placeholder="Enter your email"
/>

// With icon
<AnimatedInput
  label="Email"
  icon={<Mail size={18} />}
  helperText="We'll never share your email"
/>

// With error
<AnimatedInput
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>
```

### 6. FeedbackToast
Elegant notification toast with multiple types and positions.

**Features:**
- 4 types: success, error, warning, info
- Auto-dismiss with progress bar
- 4 position options
- Smooth slide-in animations
- Icon animations
- Customizable duration

**Usage:**
```tsx
import { FeedbackToast } from '../components/animations';
import { useToast } from '../hooks/useToast';

function MyComponent() {
  const { toasts, hideToast, success, error } = useToast();

  const handleSuccess = () => {
    success('Profile updated!', 'Your changes have been saved successfully.');
  };

  const handleError = () => {
    error('Something went wrong', 'Please try again later.');
  };

  return (
    <>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>

      <ToastContainer toasts={toasts} onClose={hideToast} />
    </>
  );
}
```

### 7. PageTransition
Smooth page transitions for route changes.

**Features:**
- 4 transition variants: fade, slide, scale, slideUp
- React Router integration
- Spring-based animations
- Exit animations

**Usage:**
```tsx
import { PageTransition } from '../components/animations';

// In your route component
<PageTransition variant="slideUp">
  <YourPageContent />
</PageTransition>

// Different variants
<PageTransition variant="fade">...</PageTransition>
<PageTransition variant="slide">...</PageTransition>
<PageTransition variant="scale">...</PageTransition>
```

## 🎯 useToast Hook

Custom hook for managing toast notifications.

**Features:**
- Queue multiple toasts
- Helper methods for each type
- Auto-dismiss support
- Unique ID generation

**Usage:**
```tsx
import { useToast } from '../hooks/useToast';

function MyComponent() {
  const { success, error, warning, info } = useToast();

  return (
    <div>
      <button onClick={() => success('Success!', 'Operation completed')}>
        Success Toast
      </button>
      <button onClick={() => error('Error!', 'Something went wrong')}>
        Error Toast
      </button>
      <button onClick={() => warning('Warning!', 'Please be careful')}>
        Warning Toast
      </button>
      <button onClick={() => info('Info', 'Did you know...')}>
        Info Toast
      </button>
    </div>
  );
}
```

## 🎨 Animation Principles

All components follow these principles:

1. **Spring-based animations** - Natural, physics-based motion
2. **Consistent timing** - Stiffness: 300-400, Damping: 17-30
3. **Subtle effects** - Enhance UX without being distracting
4. **Accessibility** - Respect `prefers-reduced-motion`
5. **Performance** - GPU-accelerated transforms

## 🔧 Customization

All components support:
- Custom className for Tailwind utilities
- Full TypeScript support
- Extended HTML props
- Theme compatibility

## 📱 Responsive Design

All animations are optimized for:
- Touch devices
- Different screen sizes
- Reduced motion preferences
- Performance on mobile

## 🚀 Performance Tips

1. Use `transform` and `opacity` for animations (GPU-accelerated)
2. Avoid animating `width`, `height`, or layout properties
3. Keep animation durations under 500ms for perceived performance
4. Use `AnimatePresence` for exit animations
5. Leverage framer-motion's built-in optimizations

## 🎭 Best Practices

1. **Meaningful Motion** - Every animation should have a purpose
2. **Consistency** - Use the same timing functions throughout
3. **Feedback** - Provide visual feedback for all interactions
4. **Subtle** - Don't overuse animations
5. **Accessible** - Always provide non-animated alternatives

## 📦 Component Integration

Example of combining multiple components:

```tsx
import {
  AnimatedButton,
  LikeButton,
  SwipeCard,
  LoadingSpinner,
  AnimatedInput,
  PageTransition
} from '../components/animations';
import { useToast } from '../hooks/useToast';

function ProfileCard() {
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <PageTransition variant="slideUp">
      <SwipeCard
        onSwipeRight={() => success('Match!', 'You liked this profile')}
        onSwipeLeft={() => console.log('Nope')}
      >
        <div className="p-6">
          {isLoading ? (
            <LoadingSpinner variant="heart" size="xl" />
          ) : (
            <>
              <img src="profile.jpg" alt="Profile" />

              <div className="mt-4 space-y-4">
                <AnimatedInput
                  label="Message"
                  placeholder="Say hello..."
                />

                <div className="flex justify-between items-center">
                  <LikeButton onLike={(liked) => console.log(liked)} />

                  <AnimatedButton
                    variant="primary"
                    glowEffect
                    onClick={() => setIsLoading(true)}
                  >
                    Send Message
                  </AnimatedButton>
                </div>
              </div>
            </>
          )}
        </div>
      </SwipeCard>
    </PageTransition>
  );
}
```

## 🎯 Next Steps

1. Integrate components into existing pages
2. Customize colors to match brand
3. Add more specialized animations as needed
4. Test on different devices and browsers
5. Optimize for accessibility

---

All components are located in `src/components/animations/` and are fully typed with TypeScript.
