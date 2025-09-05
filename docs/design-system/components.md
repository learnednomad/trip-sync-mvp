# Component Library Documentation

## Button Components

### PlatformButton

A platform-aware button component that automatically adapts its appearance based on the operating system.

#### Usage

```tsx
import { PlatformButton } from '@/components/ui/PlatformButton';

// Primary button
<PlatformButton
  label="Get Started"
  variant="primary"
  onPress={handlePress}
/>

// Secondary button with full width
<PlatformButton
  label="Learn More"
  variant="secondary"
  fullWidth
  onPress={handlePress}
/>

// Loading state
<PlatformButton
  label="Saving..."
  variant="primary"
  loading
  onPress={handlePress}
/>

// Destructive action (iOS) / Text button (Android)
<PlatformButton
  label="Delete Trip"
  variant="destructive"
  onPress={handleDelete}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Button text |
| variant | 'primary' \| 'secondary' \| 'plain' \| 'destructive' | 'primary' | Button style variant |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| fullWidth | boolean | false | Expand to full container width |
| loading | boolean | false | Show loading indicator |
| disabled | boolean | false | Disable button interactions |
| onPress | () => void | - | Press handler |

#### Platform Variants

**iOS Variants:**
- `primary`: Blue filled button (system blue)
- `secondary`: Gray background with blue text
- `plain`: Transparent with blue text
- `destructive`: Transparent with red text

**Android Variants:**
- `filled`: Purple filled button (Material primary)
- `outlined`: Purple outline with purple text
- `text`: Transparent with purple text
- `elevated`: Light purple background with shadow
- `tonal`: Purple-tinted background

### Legacy Button (Deprecated)

The original Button component is maintained for backward compatibility but should not be used in new features.

```tsx
// ❌ Don't use
import { Button } from '@/components/ui/button';

// ✅ Use instead
import { PlatformButton } from '@/components/ui/PlatformButton';
```

## Text Components

### Text

Platform-aware text component with semantic styling.

```tsx
import { Text } from '@/components/ui/text';

<Text variant="largeTitle">Welcome to Trip Sync</Text>
<Text variant="body">Plan your perfect journey</Text>
<Text variant="caption" color="secondary">Last updated 2 hours ago</Text>
```

## Input Components

### TextInput

Platform-styled text input with consistent behavior.

```tsx
import { TextInput } from '@/components/ui/input';

<TextInput
  label="Trip Name"
  placeholder="Enter trip name"
  value={tripName}
  onChangeText={setTripName}
  error={errors.tripName}
/>
```

## Layout Components

### Card

Container component with platform-specific elevation/shadows.

```tsx
import { Card } from '@/components/ui/card';

<Card variant="elevated">
  <Text variant="headline">Paris Adventure</Text>
  <Text variant="body">5 days • 3 travelers</Text>
</Card>
```

### List

Platform-specific list rendering.

```tsx
import { List, ListItem } from '@/components/ui/list';

<List>
  <ListItem
    title="Accommodation"
    subtitle="Hotel Montmartre"
    leading={<Icon name="bed" />}
    trailing={<Text>$450</Text>}
    onPress={handlePress}
  />
</List>
```

## Navigation Components

### TabBar

Platform-specific tab bar implementation.

```tsx
// iOS Tab Bar
<TabBar>
  <TabBar.Item
    title="Trips"
    icon="airplane"
    badge={3}
  />
  <TabBar.Item
    title="Expenses"
    icon="dollar-sign"
  />
</TabBar>

// Android Bottom Navigation
<BottomNavigation>
  <BottomNavigation.Item
    title="Trips"
    icon="flight"
    badge={3}
  />
</BottomNavigation>
```

## Form Components

### Select

Platform-specific select/picker component.

```tsx
import { Select } from '@/components/ui/select';

<Select
  label="Currency"
  value={currency}
  onValueChange={setCurrency}
  options={[
    { label: 'USD ($)', value: 'USD' },
    { label: 'EUR (€)', value: 'EUR' },
  ]}
/>
```

### Checkbox

Platform-styled checkbox with consistent behavior.

```tsx
import { Checkbox } from '@/components/ui/checkbox';

<Checkbox
  label="Include flights"
  checked={includeFlights}
  onCheckedChange={setIncludeFlights}
/>
```

## Feedback Components

### Modal

Platform-specific modal presentation.

```tsx
import { Modal } from '@/components/ui/modal';

<Modal
  visible={isVisible}
  onClose={handleClose}
  title="Add Expense"
>
  <ModalContent>
    {/* Form content */}
  </ModalContent>
  <ModalActions>
    <PlatformButton
      label="Cancel"
      variant="secondary"
      onPress={handleClose}
    />
    <PlatformButton
      label="Save"
      variant="primary"
      onPress={handleSave}
    />
  </ModalActions>
</Modal>
```

### Toast

Platform-appropriate toast notifications.

```tsx
import { showToast } from '@/components/ui/toast';

// Success toast
showToast({
  type: 'success',
  title: 'Trip Created',
  message: 'Your trip has been saved',
});

// Error toast
showToast({
  type: 'error',
  title: 'Network Error',
  message: 'Please check your connection',
  action: {
    label: 'Retry',
    onPress: handleRetry,
  },
});
```

## Icon Components

### Icon

Platform-specific icon implementation.

```tsx
import { Icon } from '@/components/ui/icon';

// iOS SF Symbol
<Icon name="airplane" size={24} color={colors.ios.systemBlue} />

// Android Material Icon
<Icon name="flight" size={24} color={colors.android.primary} />
```

## Utility Components

### LoadingIndicator

Platform-specific loading indicators.

```tsx
import { LoadingIndicator } from '@/components/ui/loading';

<LoadingIndicator size="large" />
<LoadingIndicator size="small" color={colors.brand.primary} />
```

### Divider

Platform-styled dividers.

```tsx
import { Divider } from '@/components/ui/divider';

<Divider />
<Divider inset />
<Divider spacing="large" />
```

## Animation Components

### AnimatedView

Platform-optimized animations.

```tsx
import { AnimatedView } from '@/components/ui/animated';

<AnimatedView
  from={{ opacity: 0, translateY: 20 }}
  to={{ opacity: 1, translateY: 0 }}
  duration={300}
>
  <Card>{/* Content */}</Card>
</AnimatedView>
```

## Best Practices

1. **Always use platform-specific components** when available
2. **Test on both iOS and Android** devices/simulators
3. **Follow platform conventions** for interactions
4. **Maintain consistent spacing** using design tokens
5. **Ensure accessibility** for all components
6. **Handle loading and error states** appropriately
7. **Use semantic color names** instead of raw values
8. **Implement proper touch feedback** for interactive elements

## Component Checklist

Before implementing a new component:

- [ ] Review platform-specific guidelines
- [ ] Define TypeScript interfaces
- [ ] Implement platform variants
- [ ] Add accessibility props
- [ ] Write component tests
- [ ] Document usage examples
- [ ] Validate performance
- [ ] Update Storybook stories