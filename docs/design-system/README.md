# Trip Sync Design System

## Overview

The Trip Sync Design System is a comprehensive set of design guidelines, components, and patterns that ensure consistency across the Trip Sync mobile application. It follows platform-specific guidelines (iOS Human Interface Guidelines and Material Design 3) while maintaining a cohesive brand identity.

## Core Principles

1. **Platform-Native Experience**: Honor platform conventions while maintaining brand consistency
2. **Accessibility First**: WCAG 2.1 AA compliance across all components
3. **Performance Optimized**: Lightweight components with minimal overhead
4. **Offline-First**: All UI components work seamlessly offline
5. **Responsive Design**: Adaptive layouts for various device sizes

## Design Tokens

### Color System

Our color system is semantic and supports both light and dark modes:

- **Background Colors**: Primary, secondary, tertiary, and elevated surfaces
- **Text Colors**: Primary, secondary, tertiary, and quaternary text
- **Platform Colors**: iOS system colors and Android Material You colors
- **Functional Colors**: Success, warning, danger, and info states
- **Brand Colors**: Trip Sync orange (#FF6C00) and secondary colors

See [`/src/core/theme/colors.ts`](../../src/core/theme/colors.ts) for implementation.

### Typography

Platform-specific typography scales:

- **iOS**: SF Pro with 11 text styles (largeTitle to caption2)
- **Android**: Roboto with Material Design 3 type scale

See [`/src/core/theme/typography.ts`](../../src/core/theme/typography.ts) for implementation.

### Spacing & Layout

- **Grid**: 4pt/8pt spacing system
- **Layout Constants**: Platform-specific header heights, tab bars, safe areas
- **Breakpoints**: Responsive design for phones and tablets

See [`/src/core/theme/tokens.ts`](../../src/core/theme/tokens.ts) for implementation.

## Components

### Foundation Components

#### Buttons
- Platform-specific variants (iOS: primary, secondary, plain, destructive)
- Android Material variants (filled, outlined, text, elevated, tonal)
- Consistent interaction states and loading indicators

#### Typography
- Text component with platform-specific styling
- Automatic font scaling for accessibility

#### Colors
- Semantic color usage throughout the app
- Automatic dark mode support

### Layout Components

#### Cards
- Platform-specific elevation/shadows
- Consistent padding and border radius

#### Lists
- iOS-style grouped lists
- Android Material lists with appropriate spacing

### Navigation Components

#### Tab Bar
- iOS tab bar with SF Symbols
- Android bottom navigation with Material icons

#### Navigation Bar
- iOS large titles and search integration
- Android app bar with Material Design patterns

## Usage Guidelines

### Color Usage

1. **Primary Actions**: Use brand primary color (#FF6C00)
2. **Text Hierarchy**: Follow platform-specific text color guidelines
3. **Interactive States**: Provide clear feedback for all interactions
4. **Dark Mode**: Test all color combinations in both light and dark modes

### Typography Guidelines

1. **Hierarchy**: Use platform-specific type scales consistently
2. **Readability**: Maintain minimum contrast ratios (4.5:1 for normal text)
3. **Localization**: Design for 30% text expansion in translations

### Spacing Guidelines

1. **Consistency**: Use spacing tokens, never arbitrary values
2. **Touch Targets**: Minimum 44pt (iOS) / 48dp (Android)
3. **Content Padding**: Use standard screen padding (16pt/16dp)

### Platform-Specific Guidelines

#### iOS
- Use SF Symbols for icons
- Implement haptic feedback for interactions
- Support Dynamic Type for accessibility
- Use iOS-specific gestures (swipe actions, pull to refresh)

#### Android
- Use Material Design icons
- Implement Material motion principles
- Support Material You theming
- Use Android-specific patterns (FAB, bottom sheets)

## Implementation

### Setup

1. Import design tokens:
```typescript
import { colors, typography, spacing } from '@/core/theme';
```

2. Use platform-specific components:
```typescript
import { PlatformButton } from '@/components/ui/PlatformButton';
```

3. Apply semantic colors:
```typescript
const backgroundColor = getSemanticColor('primary', colorScheme);
```

### Best Practices

1. **Always use design tokens** instead of hard-coded values
2. **Test on both platforms** to ensure proper rendering
3. **Validate accessibility** with screen readers
4. **Profile performance** of complex components
5. **Document deviations** from the design system

## Accessibility

### Requirements

- **Color Contrast**: WCAG 2.1 AA minimum (4.5:1 normal text, 3:1 large text)
- **Touch Targets**: 44x44pt (iOS) / 48x48dp (Android) minimum
- **Screen Reader**: Full VoiceOver (iOS) and TalkBack (Android) support
- **Dynamic Type**: Support system font scaling
- **Reduced Motion**: Respect user preferences for animations

### Testing

1. Use accessibility inspector tools
2. Test with screen readers enabled
3. Verify color contrast ratios
4. Check touch target sizes
5. Validate keyboard navigation (external keyboards)

## Maintenance

### Version Control

- Document all design token changes
- Maintain backwards compatibility
- Use semantic versioning for updates

### Review Process

1. Design review for new components
2. Accessibility audit
3. Performance testing
4. Cross-platform validation
5. Documentation updates

## Resources

- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design 3](https://m3.material.io/)
- [React Native Platform-Specific Code](https://reactnative.dev/docs/platform-specific-code)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Expo Design Guidelines](https://docs.expo.dev/)