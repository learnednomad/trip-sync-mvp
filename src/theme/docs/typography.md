# Typography System Documentation

## Overview
The Trip Sync typography system provides a consistent type scale with 7 sizes and 5 weights, optimized for both iOS and Android platforms.

## Type Scale

### Font Sizes
- **xs** (12px): Small labels, captions, disclaimers
- **sm** (14px): Secondary text, form labels, metadata
- **base** (16px): Default body text, readable content
- **lg** (18px): Emphasized body text, intro paragraphs
- **xl** (20px): Small headings, card titles
- **2xl** (24px): Section headings, modal titles
- **3xl** (32px): Page headings, hero text

### Font Weights
- **light** (300): Decorative text, large displays
- **regular** (400): Body text, default weight
- **medium** (500): Buttons, labels, emphasis
- **semibold** (600): Headings, important text
- **bold** (700): Strong emphasis, CTAs

### Line Heights
Each font size has an optimized line height following these ratios:
- Small text (xs-sm): 1.33-1.43x font size
- Body text (base-lg): 1.5-1.56x font size
- Headings (xl-3xl): 1.25-1.4x font size

## Platform-Specific Fonts

### iOS
- **Sans-serif**: System font (SF Pro)
- **Monospace**: Menlo

### Android
- **Sans-serif**: Roboto
- **Monospace**: Roboto Mono

## Pre-defined Text Styles

### Display Styles
- **displayLarge**: Hero text, splash screens
- **displayMedium**: Page titles, onboarding
- **displaySmall**: Section headers

### Heading Styles
- **headingLarge**: Primary headings
- **headingMedium**: Secondary headings
- **headingSmall**: Tertiary headings

### Body Styles
- **bodyLarge**: Intro text, readable content
- **bodyMedium**: Default body text
- **bodySmall**: Supporting text, descriptions

### Label Styles
- **labelLarge**: Form labels, navigation
- **labelMedium**: Button text, tabs
- **labelSmall**: Tags, badges, chips

### Special Styles
- **button**: CTA and button text
- **caption**: Image captions, timestamps
- **overline**: Section labels (uppercase)
- **code**: Code snippets, technical text

## Usage Examples

### With NativeWind Classes
```tsx
// Font size and weight
<Text className="text-lg font-semibold">
  Section Header
</Text>

// Pre-defined text style
<Text className="text-heading-large">
  Page Title
</Text>

// Combining utilities
<Text className="text-sm font-medium text-content-secondary">
  Subtitle text
</Text>
```

### With Style Objects
```typescript
import { getTypographyStyle, textStyles } from '@/theme/typography';

// Get custom style
const customStyle = getTypographyStyle('lg', 'semibold');

// Use pre-defined style
const headingStyle = textStyles.headingLarge;

// Apply to component
<Text style={headingStyle}>
  Welcome Back
</Text>
```

## Accessibility Guidelines

### Font Sizes
- Minimum body text: 16px (base)
- Minimum interactive text: 14px (sm)
- Important information: 16px+ (base+)

### Font Weights
- Avoid light weight for small text
- Use medium+ for interactive elements
- Ensure sufficient contrast with weight

### Line Height
- Maintains readability for long text
- Prevents text overlap
- Accommodates accents and descenders

## Typography Pairing Examples

### Card Layout
```
displaySmall (bold)     - Card Title
bodyMedium (regular)    - Description text
labelSmall (medium)     - Meta information
```

### Form Layout
```
labelLarge (medium)     - Field Label
bodyMedium (regular)    - Input Text
caption (regular)       - Helper Text
```

### List Item
```
headingSmall (semibold) - Item Title
bodySmall (regular)     - Item Description
caption (regular)       - Timestamp
```