# Trip Sync Design System

A comprehensive design system for the Trip Sync mobile application, built with React Native, NativeWind (TailwindCSS), and TypeScript.

## Overview

The Trip Sync design system provides a complete theming solution with:
- 🎨 Light, dark, and high-contrast theme modes
- ♿ WCAG AA accessibility compliance
- 🚀 <50ms theme switching performance
- 📱 Platform-specific adaptations (iOS/Android)
- 🎯 Type-safe theme access
- 💾 Persistent theme preferences
- 🧪 Comprehensive testing utilities

## Quick Start

### Installation

The theme system is already integrated into the Trip Sync project. No additional installation required.

### Basic Usage

```tsx
import { ThemeProvider } from '@/theme';

// Wrap your app with ThemeProvider
export default function App() {
  return (
    <ThemeProvider defaultColorScheme="system">
      <YourApp />
    </ThemeProvider>
  );
}

// Use theme in components
import { useTheme, useThemeColors } from '@/theme';

function MyComponent() {
  const { colorScheme, toggleColorScheme } = useTheme();
  const colors = useThemeColors();
  
  return (
    <View style={{ backgroundColor: colors.background.primary }}>
      <Text style={{ color: colors.content.primary }}>
        Current theme: {colorScheme}
      </Text>
      <Button onPress={toggleColorScheme} title="Toggle Theme" />
    </View>
  );
}
```

## Documentation

### Core Concepts
- [Color System](./colors.md) - Semantic color tokens and palettes
- [Typography](./typography.md) - Type scale and text styles
- [Spacing](./spacing.md) - 8-point grid system
- [Animations](./animations.md) - Motion design and transitions

### API Reference
- [ThemeProvider](./api/ThemeProvider.md) - Theme context provider
- [Hooks](./api/hooks.md) - Theme access hooks
- [Types](./api/types.md) - TypeScript definitions
- [Testing](./api/testing.md) - Testing utilities

### Guides
- [Getting Started](./guides/getting-started.md) - Basic setup and usage
- [Accessibility](./guides/accessibility.md) - Building accessible UIs
- [Platform Adaptation](./guides/platform-adaptation.md) - iOS vs Android
- [Migration Guide](./guides/migration.md) - Migrating existing components

## Features

### Theme Modes

#### Light Mode
Clean, bright interface optimized for daytime use with high readability.

#### Dark Mode
Eye-friendly dark interface that reduces strain in low-light conditions while maintaining WCAG AA compliance.

#### High Contrast Mode
Enhanced contrast ratios for users with visual impairments, exceeding WCAG AAA standards.

### Design Tokens

#### Colors
- **Semantic naming**: `primary`, `secondary`, `error`, `success`, etc.
- **10-step scales**: 50-900 for each color
- **Contextual colors**: `background`, `surface`, `content`, `border`

#### Typography
- **7 font sizes**: xs (12px) to 3xl (32px)
- **5 font weights**: light to bold
- **Platform fonts**: SF Pro (iOS), Roboto (Android)

#### Spacing
- **8-point grid**: 0, 4, 8, 16, 24, 32, 40, 48, 56, 64px
- **Consistent rhythm**: All spacing multiples of 8 (except 4px)

#### Animation
- **3 durations**: fast (200ms), normal (300ms), slow (500ms)
- **Easing curves**: Linear, ease, spring, elastic, bounce
- **Performance**: 60 FPS optimized

### Accessibility

- ✅ WCAG AA compliant color contrast
- ✅ Touch targets ≥44px
- ✅ Reduce motion support
- ✅ Screen reader optimized
- ✅ High contrast mode
- ✅ Focus indicators

## Components

Example components demonstrating theme usage:

### Themed Button
```tsx
<Button
  className="bg-primary-500 px-4 py-2 rounded-lg"
  labelClassName="text-content-inverse font-medium"
>
  <Text>Press Me</Text>
</Button>
```

### Themed Card
```tsx
<View className="bg-surface-primary p-4 rounded-xl shadow-md">
  <Text className="text-heading-medium mb-2">Card Title</Text>
  <Text className="text-body-medium text-content-secondary">
    Card description text
  </Text>
</View>
```

### Theme Switcher
```tsx
<TouchableOpacity 
  onPress={toggleColorScheme}
  className="flex-row items-center gap-2 p-3"
>
  <Icon name={colorScheme === 'dark' ? 'moon' : 'sun'} />
  <Text className="text-label-medium">
    {colorScheme === 'dark' ? 'Dark' : 'Light'} Mode
  </Text>
</TouchableOpacity>
```

## Testing

### Unit Testing
```tsx
import { renderWithTheme, testThemeVariants } from '@/theme/testing';

// Test with theme
it('renders correctly', () => {
  const { getByText } = renderWithTheme(
    <MyComponent />,
    { colorScheme: 'dark' }
  );
  expect(getByText('Hello')).toBeTruthy();
});

// Test all theme variants
testThemeVariants(MyComponent).forEach(({ name, element }) => {
  it(`renders correctly in ${name}`, () => {
    const { toJSON } = render(element);
    expect(toJSON()).toMatchSnapshot();
  });
});
```

### Accessibility Testing
```typescript
import { createAccessibilityTestSuite } from '@/theme/testing';

const suite = createAccessibilityTestSuite(theme);

// Run tests
const { summary, details } = suite.colorContrast();
console.log(`Passed: ${summary.passed}/${summary.total}`);

// Generate report
const report = suite.report();
console.log(report);
```

## Performance

- **Theme switching**: <50ms (validated in tests)
- **Initial load**: Theme preferences loaded from MMKV (fastest React Native storage)
- **Memory**: ~2KB per theme configuration
- **Bundle size**: ~15KB (minified + gzipped)

## Best Practices

1. **Use semantic colors** - Don't hardcode hex values
2. **Follow spacing grid** - Use theme spacing tokens
3. **Test all modes** - Light, dark, and high contrast
4. **Check accessibility** - Run contrast validation
5. **Optimize animations** - Use `useNativeDriver: true`

## Troubleshooting

### Theme not updating
- Ensure component is wrapped in ThemeProvider
- Check that LayoutAnimation is not disabled
- Verify MMKV permissions

### Colors look wrong
- Check color scheme detection
- Verify high contrast mode setting
- Ensure proper color token usage

### Performance issues
- Enable animation optimizations
- Check for excessive re-renders
- Profile with React DevTools

## Contributing

When adding new theme features:
1. Update type definitions
2. Add tests for new functionality
3. Update documentation
4. Ensure accessibility compliance
5. Test on both platforms

## License

Part of the Trip Sync application. All rights reserved.