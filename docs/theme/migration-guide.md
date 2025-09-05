# Theme Migration Guide

This guide helps you migrate existing components to use the new Trip Sync theme system.

## Overview

The new theme system replaces hardcoded colors and styles with semantic tokens, providing automatic dark mode support, accessibility compliance, and consistent design across the app.

## Migration Checklist

- [ ] Replace hardcoded colors with theme colors
- [ ] Update typography to use text styles
- [ ] Convert spacing to use 8-point grid
- [ ] Add theme provider wrapper
- [ ] Test in all theme modes
- [ ] Validate accessibility

## Step-by-Step Migration

### 1. Update Imports

**Before:**
```typescript
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
```

**After:**
```typescript
import { useTheme, useThemeColors, useThemeSpacing } from '@/theme';
```

### 2. Replace Hardcoded Colors

**Before:**
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#000000',
  },
  button: {
    backgroundColor: '#2F95DC',
  },
});
```

**After:**
```typescript
const MyComponent = () => {
  const colors = useThemeColors();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background.primary,
    },
    text: {
      color: colors.content.primary,
    },
    button: {
      backgroundColor: colors.primary[500],
    },
  });
};
```

### 3. Update Typography

**Before:**
```typescript
<Text style={{ fontSize: 16, fontWeight: '600' }}>
  Hello World
</Text>
```

**After:**
```typescript
import { textStyles } from '@/theme';

<Text style={[textStyles.headingMedium, { color: colors.content.primary }]}>
  Hello World
</Text>
```

Or with NativeWind:
```tsx
<Text className="text-heading-medium text-content-primary">
  Hello World
</Text>
```

### 4. Update Spacing

**Before:**
```typescript
const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 15,
  },
});
```

**After:**
```typescript
const spacing = useThemeSpacing();

const styles = StyleSheet.create({
  container: {
    padding: spacing[3],  // 24px (closest to 20px)
    marginBottom: spacing[2],  // 16px (closest to 15px)
  },
});
```

Or with NativeWind:
```tsx
<View className="p-3 mb-2">
  {/* Content */}
</View>
```

### 5. Update Conditional Styles

**Before:**
```typescript
const isDarkMode = useColorScheme() === 'dark';

<View style={{
  backgroundColor: isDarkMode ? '#000' : '#FFF',
}}>
```

**After:**
```typescript
const colors = useThemeColors();

<View style={{
  backgroundColor: colors.background.primary,
}}>
// Automatically adapts to theme
```

### 6. Handle Platform Differences

**Before:**
```typescript
const styles = StyleSheet.create({
  button: {
    borderRadius: Platform.OS === 'ios' ? 12 : 8,
  },
});
```

**After:**
```typescript
import { platformBorderRadius } from '@/theme/tokens';

const styles = StyleSheet.create({
  button: {
    borderRadius: platformBorderRadius[Platform.OS].button,
  },
});
```

## Common Patterns

### Dark Mode Support

The theme system automatically handles dark mode. No need for manual checks:

```typescript
// ❌ Don't do this
const isDarkMode = useColorScheme() === 'dark';
const textColor = isDarkMode ? '#FFF' : '#000';

// ✅ Do this
const colors = useThemeColors();
const textColor = colors.content.primary;
```

### Semantic Colors

Use semantic colors instead of raw values:

```typescript
// ❌ Don't do this
errorColor: '#FF0000'
successColor: '#00FF00'

// ✅ Do this
errorColor: colors.error[500]
successColor: colors.success[500]
```

### Touch Targets

Ensure all interactive elements meet minimum size requirements:

```typescript
const styles = StyleSheet.create({
  button: {
    minHeight: 44, // Apple HIG minimum
    minWidth: 44,
    padding: spacing[2], // Additional padding
  },
});
```

## Testing Your Migration

### 1. Theme Modes

Test your component in all theme modes:

```typescript
import { testThemeVariants } from '@/theme/testing';

describe('MyComponent', () => {
  testThemeVariants(MyComponent).forEach(({ name, element }) => {
    it(`renders correctly in ${name}`, () => {
      const { toJSON } = render(element);
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
```

### 2. Accessibility

Run accessibility tests:

```typescript
import { createAccessibilityTestSuite } from '@/theme/testing';

const suite = createAccessibilityTestSuite(theme);
const report = suite.report();
console.log(report);
```

### 3. Visual Testing

Use the theme playground to visually test your components:

```typescript
import { ThemePlayground } from '@/theme/examples/ThemePlayground';

// Add your component to the playground for testing
```

## Gradual Migration

You don't need to migrate everything at once. The old color system remains available for backward compatibility:

```typescript
// Old system still works
import Colors from '@/constants/Colors';

// But new components should use the theme
import { useThemeColors } from '@/theme';
```

## Need Help?

- Check the [Theme Documentation](./README.md)
- Review [Example Components](../src/theme/examples/)
- Run accessibility tests to catch issues
- Test in the Theme Playground

## Migration Timeline

1. **Phase 1**: Core components (buttons, cards, text)
2. **Phase 2**: Screen layouts and navigation
3. **Phase 3**: Complex components and animations
4. **Phase 4**: Remove legacy color system