# Spacing System Documentation

## Overview
The Trip Sync spacing system is based on an 8-point grid, ensuring consistent and harmonious spacing throughout the application. All spacing values are multiples of 8px (with the exception of 0.5 = 4px for fine adjustments).

## 8-Point Grid System

### Why 8-Point Grid?
- **Consistency**: Creates visual rhythm and alignment
- **Efficiency**: Reduces decision fatigue with predefined values
- **Scalability**: Works well across different screen densities
- **Compatibility**: Aligns with common design tools and systems

## Spacing Scale

| Token | Pixels | Usage |
|-------|--------|-------|
| 0 | 0px | No spacing |
| 0.5 | 4px | Tight spacing, fine adjustments |
| 1 | 8px | Minimum spacing, icon gaps |
| 2 | 16px | Default padding, component spacing |
| 3 | 24px | Section padding, larger gaps |
| 4 | 32px | Section spacing, card padding |
| 5 | 40px | Large section gaps |
| 6 | 48px | Extra large spacing |
| 7 | 56px | Hero section spacing |
| 8 | 64px | Maximum common spacing |
| 10-64 | 80-512px | Special cases, full-screen layouts |

## Common Spacing Patterns

### Page Padding
```typescript
pagePadding: {
  horizontal: 16px, // spacing[2]
  vertical: 24px,   // spacing[3]
}
```

### Card Padding
```typescript
cardPadding: {
  small: 16px,   // spacing[2]
  medium: 24px,  // spacing[3]
  large: 32px,   // spacing[4]
}
```

### List Item Spacing
```typescript
listItemSpacing: {
  compact: 8px,  // spacing[1]
  default: 16px, // spacing[2]
  relaxed: 24px, // spacing[3]
}
```

### Section Spacing
```typescript
sectionSpacing: {
  small: 32px,  // spacing[4]
  medium: 48px, // spacing[6]
  large: 64px,  // spacing[8]
}
```

## Usage with NativeWind

### Padding Classes
```tsx
// All sides
<View className="p-4">...</View>      // 32px padding

// Horizontal/Vertical
<View className="px-2 py-3">...</View> // 16px horizontal, 24px vertical

// Individual sides
<View className="pt-4 pb-2">...</View> // 32px top, 16px bottom
```

### Margin Classes
```tsx
// All sides
<View className="m-2">...</View>       // 16px margin

// Horizontal/Vertical
<View className="mx-auto my-4">...</View> // Auto horizontal, 32px vertical

// Individual sides
<View className="mt-3 mb-6">...</View> // 24px top, 48px bottom
```

### Gap Classes (Flexbox)
```tsx
// Uniform gap
<View className="flex gap-2">...</View> // 16px gap between items

// Directional gaps
<View className="flex gap-x-2 gap-y-4">...</View> // 16px horizontal, 32px vertical
```

## Programmatic Usage

### Using Spacing Values
```typescript
import { spacing, getSpacing } from '@/theme/spacing';

// Direct access
const padding = spacing[2]; // 16px

// Using helper
const margin = getSpacing(4); // 32px
```

### Using Utility Functions
```typescript
import { spacingUtilities } from '@/theme/spacing';

// Single value utilities
const styles = {
  ...spacingUtilities.p(2),  // padding: 16
  ...spacingUtilities.mx(3), // marginHorizontal: 24
};
```

### Creating Complex Spacing
```typescript
import { createSpacing } from '@/theme/spacing';

// Single value (all sides)
const padding1 = createSpacing(2); // 16px all sides

// Two values (vertical, horizontal)
const padding2 = createSpacing(2, 4); // 16px top/bottom, 32px left/right

// Three values (top, horizontal, bottom)
const padding3 = createSpacing(2, 3, 4); // 16px top, 24px left/right, 32px bottom

// Four values (top, right, bottom, left)
const padding4 = createSpacing(1, 2, 3, 4); // 8px top, 16px right, 24px bottom, 32px left
```

## Component Examples

### Card Component
```tsx
<View className="p-3 m-2 rounded-lg">
  <Text className="mb-2">Card Title</Text>
  <Text className="mb-4">Card description...</Text>
  <Button className="mt-auto" />
</View>
```

### List Item
```tsx
<View className="px-4 py-3 flex-row items-center gap-2">
  <Icon className="mr-2" />
  <Text className="flex-1">Item text</Text>
  <Chevron />
</View>
```

### Screen Layout
```tsx
<ScrollView className="flex-1">
  <View className="px-4 py-6">
    <Text className="text-3xl mb-6">Page Title</Text>
    
    <View className="gap-4">
      <Card className="p-4" />
      <Card className="p-4" />
    </View>
    
    <View className="mt-8">
      <Button />
    </View>
  </View>
</ScrollView>
```

## Best Practices

### Do's
- ✅ Use the spacing scale consistently
- ✅ Prefer spacing tokens over arbitrary values
- ✅ Use appropriate spacing for touch targets (minimum 48px)
- ✅ Consider visual hierarchy with spacing
- ✅ Test spacing on different screen sizes

### Don'ts
- ❌ Don't use arbitrary pixel values
- ❌ Don't mix spacing systems
- ❌ Don't use spacing smaller than 8px for touch targets
- ❌ Don't forget about safe area insets
- ❌ Don't use excessive spacing on small screens