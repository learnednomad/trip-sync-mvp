# Design System Migration Guide

## Overview

This guide helps developers migrate existing components to the new Trip Sync Design System. The migration ensures platform-specific UI guidelines, improved accessibility, and consistent theming across the application.

## Migration Timeline

### Phase 1: Core Components (Week 1)
- [x] Button → PlatformButton
- [x] Input → Enhanced Input with platform styling
- [x] Text → Enhanced Text with typography variants
- [x] Card → Platform-specific Card

### Phase 2: Layout Components (Week 2)
- [ ] List → Enhanced List with accessibility
- [ ] Modal → Accessible Modal with platform variants
- [ ] Navigation → PlatformHeader and PlatformTabBar

### Phase 3: Form Components (Week 3)
- [ ] Select → Platform-specific Select
- [ ] Checkbox → Enhanced Checkbox
- [ ] Form validation with accessibility

### Phase 4: Specialized Components (Week 4)
- [ ] Trip cards
- [ ] Expense components
- [ ] Custom navigation elements

## Component Migration Examples

### Button Migration

**Before:**
```tsx
import { Button } from '@/components/ui';

<Button
  label="Save Trip"
  variant="default"
  onPress={handleSave}
/>
```

**After:**
```tsx
import { PlatformButton } from '@/components/ui';

<PlatformButton
  label="Save Trip"
  variant="primary"
  onPress={handleSave}
/>
```

### Text Migration

**Before:**
```tsx
import { Text } from '@/components/ui';

<Text className="text-xl font-bold">
  Trip Details
</Text>
```

**After:**
```tsx
import { Text } from '@/components/ui';

<Text variant="headline" color="primary">
  Trip Details
</Text>
```

### Input Migration

**Before:**
```tsx
import { Input } from '@/components/ui';

<Input
  label="Trip Name"
  value={tripName}
  onChangeText={setTripName}
/>
```

**After:**
```tsx
import { Input } from '@/components/ui';

<Input
  label="Trip Name"
  value={tripName}
  onChangeText={setTripName}
  placeholder="Enter trip name"
  accessibilityHint="Required field for trip identification"
/>
```

### Navigation Migration

**Before:**
```tsx
// Custom header implementation
<View style={styles.header}>
  <Text style={styles.title}>{title}</Text>
</View>
```

**After:**
```tsx
import { PlatformHeader } from '@/components/ui';

<PlatformHeader
  title="My Trips"
  largeTitle={Platform.OS === 'ios'}
  rightButton={{
    label: 'Add',
    onPress: handleAddTrip,
  }}
/>
```

## Color System Migration

### Before (Hard-coded colors):
```tsx
style={{ color: '#FF6C00' }}
style={{ backgroundColor: '#F5F5F5' }}
```

### After (Semantic colors):
```tsx
import { colors } from '@/core/theme';

style={{ color: colors.brand.primary }}
style={{ backgroundColor: colors.background.secondary.light }}
```

## Typography Migration

### Before (Inline styles):
```tsx
style={{ fontSize: 24, fontWeight: 'bold' }}
```

### After (Typography system):
```tsx
import { typography } from '@/core/theme';

style={typography.headlineMedium}
// or use Text component
<Text variant="headlineMedium">Title</Text>
```

## Accessibility Checklist

When migrating components, ensure:

- [ ] All interactive elements have `accessibilityRole`
- [ ] All inputs have `accessibilityLabel` and `accessibilityHint`
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Touch targets are at least 44x44pt (iOS) or 48x48dp (Android)
- [ ] Screen reader announces state changes
- [ ] Keyboard navigation works (external keyboards)

## Testing Migration

### 1. Visual Testing
```bash
# Run on both platforms
npm run ios
npm run android

# Check for:
- Proper platform styling
- Correct colors in light/dark mode
- Responsive layouts
```

### 2. Accessibility Testing
```bash
# Enable screen readers
# iOS: Settings > Accessibility > VoiceOver
# Android: Settings > Accessibility > TalkBack

# Test all interactive elements
```

### 3. Performance Testing
```bash
# Profile component rendering
# Ensure no performance regression
```

## Common Issues and Solutions

### Issue: Colors not updating in dark mode
**Solution:** Use semantic colors from theme:
```tsx
// Wrong
color: '#000000'

// Correct
color: colors.text.primary.light // Will switch in dark mode
```

### Issue: Typography inconsistent across platforms
**Solution:** Use platform-specific typography:
```tsx
<Text variant="body"> // Automatically uses correct platform variant
```

### Issue: Buttons look the same on iOS and Android
**Solution:** Use PlatformButton with proper variants:
```tsx
<PlatformButton variant="primary" /> // Platform-specific styling
```

### Issue: Accessibility not working
**Solution:** Add required accessibility props:
```tsx
accessibilityRole="button"
accessibilityLabel="Save trip"
accessibilityHint="Double tap to save your trip details"
accessibilityState={{ disabled: isLoading }}
```

## Migration Utilities

### Codemod Script
```bash
# Run codemod to update imports
npm run migrate:design-system

# This will:
# 1. Update Button imports
# 2. Add accessibility props
# 3. Update color references
```

### ESLint Rules
```json
{
  "rules": {
    "no-hardcoded-colors": "error",
    "require-accessibility-props": "error",
    "prefer-platform-components": "warn"
  }
}
```

## Support

For migration support:
1. Check the [Design System Documentation](./README.md)
2. Review [Component Documentation](./components.md)
3. Ask in #design-system Slack channel
4. File issues with the `migration` label

## Post-Migration Checklist

- [ ] All components use new design system
- [ ] No hard-coded colors remain
- [ ] Typography is consistent
- [ ] Accessibility audit passed
- [ ] Performance metrics maintained
- [ ] Visual QA on both platforms
- [ ] Dark mode tested
- [ ] Documentation updated