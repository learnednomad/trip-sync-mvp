# Accessibility Guidelines

## Overview

Trip Sync is committed to providing an accessible experience for all users. This guide outlines our accessibility standards and implementation guidelines following WCAG 2.1 AA compliance.

## Core Principles

1. **Perceivable**: Information must be presentable in ways users can perceive
2. **Operable**: Interface components must be operable
3. **Understandable**: Information and UI operation must be understandable
4. **Robust**: Content must be robust enough for various assistive technologies

## Implementation Requirements

### Color Contrast

#### Text Contrast Ratios
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text** (18pt+): 3:1 minimum contrast ratio
- **UI components**: 3:1 minimum contrast ratio

#### Testing Colors
```tsx
import { checkContrast } from '@/utils/accessibility';

// Check contrast before using colors
const isAccessible = checkContrast(
  colors.text.primary,
  colors.background.primary
); // Should return true for 4.5:1 ratio
```

### Touch Targets

#### Minimum Sizes
- **iOS**: 44×44 points
- **Android**: 48×48 dp
- **Spacing**: 8pt/8dp minimum between targets

#### Implementation
```tsx
// Good - Adequate touch target
<PlatformButton
  label="Save"
  size="md" // Ensures 44pt/48dp height
  onPress={handleSave}
/>

// Bad - Too small
<Pressable style={{ padding: 4 }}> // Only 8pt touch area
  <Text>Save</Text>
</Pressable>
```

### Screen Reader Support

#### Required Props
Every interactive element must include:

```tsx
// Button example
<PlatformButton
  label="Add Trip"
  accessibilityRole="button"
  accessibilityLabel="Add new trip"
  accessibilityHint="Opens form to create a new trip"
  accessibilityState={{
    disabled: isLoading,
    selected: isSelected,
  }}
/>

// Input example
<Input
  label="Destination"
  accessibilityLabel="Trip destination"
  accessibilityHint="Enter the city or country you're visiting"
  accessibilityValue={{ text: destination }}
/>
```

#### Accessibility Roles
- `button`: Interactive buttons
- `link`: Navigation links
- `header`: Section headers
- `text`: Static text
- `image`: Images and icons
- `search`: Search inputs
- `tab`: Tab navigation items
- `tablist`: Tab container
- `alert`: Important messages
- `dialog`: Modal dialogs

### Dynamic Content Announcements

```tsx
import { AccessibilityInfo } from 'react-native';

// Announce changes to screen readers
const handleSave = async () => {
  try {
    await saveTrip();
    AccessibilityInfo.announceForAccessibility('Trip saved successfully');
  } catch (error) {
    AccessibilityInfo.announceForAccessibility('Failed to save trip. Please try again.');
  }
};
```

### Focus Management

```tsx
import { findNodeHandle, AccessibilityInfo } from 'react-native';

// Set focus after navigation
const focusOnError = () => {
  if (errorRef.current) {
    const handle = findNodeHandle(errorRef.current);
    if (handle) {
      AccessibilityInfo.setAccessibilityFocus(handle);
    }
  }
};
```

### Images and Icons

```tsx
// Decorative images
<Image
  source={decorativeImage}
  accessibilityRole="none"
  accessibilityElementsHidden={true}
/>

// Informative images
<Image
  source={tripPhoto}
  accessibilityRole="image"
  accessibilityLabel="Photo of Paris Eiffel Tower at sunset"
/>

// Icon buttons
<Pressable
  onPress={handleDelete}
  accessibilityRole="button"
  accessibilityLabel="Delete trip"
  accessibilityHint="Permanently removes this trip"
>
  <Icon name="trash" accessibilityElementsHidden />
</Pressable>
```

### Forms and Validation

```tsx
// Accessible form field
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  accessibilityLabel="Email address"
  accessibilityHint="Required for account creation"
  accessibilityInvalid={!!emailError}
  accessibilityLiveRegion="polite" // Announces errors
/>

// Error announcement
{emailError && (
  <Text
    color="danger"
    accessibilityRole="alert"
    accessibilityLiveRegion="assertive"
  >
    {emailError}
  </Text>
)}
```

### Navigation Accessibility

```tsx
// Tab bar accessibility
<PlatformTabBar
  tabs={[
    {
      key: 'trips',
      title: 'Trips',
      icon: <Icon name="airplane" />,
      accessibilityLabel: 'Trips tab',
      accessibilityHint: 'View and manage your trips',
    },
  ]}
/>

// Screen reader navigation order
<View accessibilityViewIsModal={true}> // Modal focuses only its content
  <PlatformHeader title="Add Trip" />
  <ScrollView>
    {/* Content in logical reading order */}
  </ScrollView>
</View>
```

## Platform-Specific Considerations

### iOS (VoiceOver)

```tsx
// iOS-specific hints
import { Platform } from 'react-native';

const getHint = () => {
  if (Platform.OS === 'ios') {
    return 'Double tap to select';
  }
  return 'Double tap to activate';
};
```

### Android (TalkBack)

```tsx
// Android-specific announcements
if (Platform.OS === 'android') {
  // TalkBack reads roles differently
  props.accessibilityRole = 'button';
  props.accessibilityLiveRegion = 'polite';
}
```

## Testing Checklist

### Manual Testing
1. **Enable screen reader** (VoiceOver/TalkBack)
2. **Navigate using swipe gestures**
3. **Verify all content is announced**
4. **Test with external keyboard**
5. **Check focus indicators**
6. **Validate gesture alternatives**

### Automated Testing
```tsx
// Jest test example
describe('Accessibility', () => {
  it('should have proper accessibility props', () => {
    const { getByLabelText } = render(
      <PlatformButton
        label="Save"
        accessibilityLabel="Save trip"
      />
    );
    
    expect(getByLabelText('Save trip')).toBeTruthy();
  });
});
```

### Color Contrast Testing
```bash
# Use accessibility inspector
# iOS: Xcode > Open Developer Tool > Accessibility Inspector
# Android: Android Studio > Layout Inspector

# Chrome DevTools for web testing
# Lighthouse accessibility audit
```

## Common Patterns

### Loading States
```tsx
<View accessibilityLiveRegion="polite">
  {isLoading ? (
    <ActivityIndicator accessibilityLabel="Loading trips" />
  ) : (
    <TripList trips={trips} />
  )}
</View>
```

### Empty States
```tsx
<View accessibilityRole="status">
  <Text variant="headline">No trips yet</Text>
  <Text>Start planning your next adventure!</Text>
  <PlatformButton
    label="Create First Trip"
    accessibilityHint="Opens form to create your first trip"
  />
</View>
```

### Error Handling
```tsx
{error && (
  <View
    accessibilityRole="alert"
    accessibilityLiveRegion="assertive"
  >
    <Text color="danger">{error.message}</Text>
    <PlatformButton
      label="Try Again"
      onPress={retry}
      accessibilityHint="Retry the failed operation"
    />
  </View>
)}
```

## Accessibility Utilities

```tsx
// utils/accessibility.ts
export const a11y = {
  // Generate button props
  button: (label: string, hint?: string) => ({
    accessibilityRole: 'button' as const,
    accessibilityLabel: label,
    accessibilityHint: hint,
  }),
  
  // Generate input props
  input: (label: string, value: string, error?: string) => ({
    accessibilityLabel: label,
    accessibilityValue: { text: value },
    accessibilityInvalid: !!error,
    accessibilityLiveRegion: 'polite' as const,
  }),
  
  // Check if reduced motion is enabled
  prefersReducedMotion: () => {
    return AccessibilityInfo.isReduceMotionEnabled();
  },
};
```

## Resources

- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [iOS Accessibility](https://developer.apple.com/accessibility/)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Compliance Tracking

Track accessibility compliance in your components:

```tsx
interface ComponentA11yStatus {
  component: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  tested: boolean;
  issues: string[];
}

// Track in component documentation
/**
 * @accessibility
 * - WCAG Level: AA
 * - Screen reader: ✅ Tested
 * - Keyboard navigation: ✅ Tested
 * - Color contrast: ✅ 4.5:1 ratio
 * - Touch targets: ✅ 44pt minimum
 */
```