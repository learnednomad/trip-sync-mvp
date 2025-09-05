# Animation System Documentation

## Overview
The Trip Sync animation system provides consistent motion design with predefined durations, easing curves, and animation patterns. All animations are optimized for 60 FPS performance and respect system accessibility settings.

## Animation Durations

### Standard Durations
- **fast** (200ms): Quick transitions, hover effects, immediate feedback
- **normal** (300ms): Default animations, standard transitions
- **slow** (500ms): Deliberate animations, modals, emphasis

### Usage Guidelines
- Use `fast` for micro-interactions and immediate responses
- Use `normal` for most UI transitions
- Use `slow` for important state changes or to draw attention

## Easing Functions

### Basic Curves
- **linear**: Constant speed, no acceleration
- **easeIn**: Start slow, accelerate
- **easeOut**: Start fast, decelerate (most natural)
- **easeInOut**: Slow start and end

### Advanced Curves
- **Quad/Cubic**: Smooth acceleration curves
- **Expo**: Dramatic acceleration/deceleration
- **Back**: Slight overshoot for playful effect
- **Elastic**: Spring-like oscillation
- **Bounce**: Bouncing effect at the end

### Spring Animations
```typescript
spring: {
  snappy: { damping: 20, stiffness: 300 },  // Quick response
  default: { damping: 15, stiffness: 100 }, // Balanced
  gentle: { damping: 20, stiffness: 80 },   // Smooth
  bouncy: { damping: 10, stiffness: 200 },  // Playful
}
```

## Common Animation Patterns

### Fade Animations
```typescript
// Fade In
fadeIn: {
  from: { opacity: 0 },
  to: { opacity: 1 },
  duration: 200ms,
}

// Fade Out
fadeOut: {
  from: { opacity: 1 },
  to: { opacity: 0 },
  duration: 200ms,
}
```

### Scale Animations
```typescript
// Scale In (grow)
scaleIn: {
  from: { scale: 0.9 },
  to: { scale: 1 },
  duration: 300ms,
  easing: easeOutBack, // Slight overshoot
}
```

### Slide Animations
```typescript
// Slide from bottom
slideInUp: {
  from: { translateY: 50, opacity: 0 },
  to: { translateY: 0, opacity: 1 },
  duration: 300ms,
  easing: easeOutCubic,
}
```

### Modal Animations
```typescript
// Modal entrance
modalIn: {
  from: { opacity: 0, scale: 0.95, translateY: 10 },
  to: { opacity: 1, scale: 1, translateY: 0 },
  duration: 300ms,
}
```

## Usage Examples

### Basic Animation
```typescript
import { Animated } from 'react-native';
import { animation, nativeEasing } from '@/theme/animations';

const fadeAnim = new Animated.Value(0);

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: animation.duration.fast,
  easing: nativeEasing.easeOut,
  useNativeDriver: true,
}).start();
```

### Spring Animation
```typescript
import { reanimatedConfigs } from '@/theme/animations';

Animated.spring(scaleAnim, {
  toValue: 1,
  ...reanimatedConfigs.spring.bouncy,
  useNativeDriver: true,
}).start();
```

### Using Animation Patterns
```typescript
import { animationPatterns } from '@/theme/animations';

// Apply fade in pattern
const applyFadeIn = (animValue) => {
  Animated.timing(animValue, {
    ...animationPatterns.fadeIn,
    toValue: animationPatterns.fadeIn.to.opacity,
    useNativeDriver: true,
  }).start();
};
```

### Layout Animations
```typescript
import { LayoutAnimation } from 'react-native';
import { layoutAnimationPresets } from '@/theme/animation-utils';

// Before state change
LayoutAnimation.configureNext(layoutAnimationPresets.normal);
setState(newState);
```

### Theme Switching
```typescript
import { animateThemeChange } from '@/theme/animation-utils';

const switchTheme = () => {
  animateThemeChange(() => {
    setTheme(newTheme);
  });
};
```

## Gesture Animations

### Swipe Gestures
```typescript
gestureAnimations.swipe: {
  duration: 200ms,
  easing: easeOutCubic,
}
```

### Long Press
```typescript
gestureAnimations.longPress: {
  duration: 500ms,
  easing: easeInOutCubic,
}
```

## Performance Guidelines

### Do's
- ✅ Always use `useNativeDriver: true` when possible
- ✅ Prefer `opacity` and `transform` animations
- ✅ Test animations at 60 FPS
- ✅ Use `InteractionManager` for heavy animations
- ✅ Batch multiple animations with `Animated.parallel`

### Don'ts
- ❌ Animate layout properties (`width`, `height`, `margin`)
- ❌ Use animations in list items without optimization
- ❌ Create new animated values during render
- ❌ Forget to stop/cleanup animations
- ❌ Use complex animations on low-end devices

## Accessibility Considerations

### Reduce Motion
Always respect the system's reduce motion preference:

```typescript
import { getAccessibleDuration } from '@/theme/animation-utils';

const duration = getAccessibleDuration(animation.duration.normal);
// Returns shorter duration if reduce motion is enabled
```

### Motion Sensitivity
- Avoid rapid movements
- Limit rotation and scaling
- Reduce parallax effects
- Provide option to disable animations

## Animation Utilities

### Stagger Animations
```typescript
import { animationHelpers } from '@/theme/animations';

const staggeredAnims = animationHelpers.stagger(50, [
  fadeIn1,
  fadeIn2,
  fadeIn3,
]);
```

### Sequence Animations
```typescript
const sequence = animationHelpers.sequence([
  { ...slideIn, duration: 300 },
  { ...fadeIn, duration: 200 },
]);
```

### Loop Animations
```typescript
import { createLoop } from '@/theme/animation-utils';

const loopedAnimation = createLoop(
  Animated.timing(rotation, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }),
  { iterations: -1 } // Infinite loop
);
```