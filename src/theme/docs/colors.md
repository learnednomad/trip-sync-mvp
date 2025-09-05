# Color System Documentation

## Overview
The Trip Sync color system uses semantic color tokens that adapt to light, dark, and high-contrast modes. All colors are designed to meet WCAG AA accessibility standards.

## Color Scales
Each semantic color has a 10-step scale from 50 (lightest) to 900 (darkest):
- **50-200**: Light tints for backgrounds
- **300-400**: Medium tones for borders and secondary elements
- **500**: Base color (primary usage)
- **600-700**: Dark shades for hover states
- **800-900**: Very dark shades for text on light backgrounds

## Semantic Colors

### Primary Colors
- **Primary**: Brand blue (#2F95DC) - Main brand color for CTAs and key UI elements
- **Secondary**: Purple (#9B80FF) - Supporting brand color for accents
- **Tertiary**: Orange (#FF8C00) - Highlight color for special features

### Functional Colors
- **Error**: Red scale for errors and destructive actions
- **Warning**: Orange scale for warnings and cautions
- **Success**: Green scale for success states and confirmations
- **Info**: Blue scale for informational messages

### Surface Colors
- **Background**: Page and screen backgrounds
  - `primary`: Main background
  - `secondary`: Section backgrounds
  - `tertiary`: Nested section backgrounds
  
- **Surface**: Card and component surfaces
  - `primary`: Default surface
  - `secondary`: Alternative surface
  - `tertiary`: Nested surfaces
  - `elevated`: Elevated surfaces (with shadows)

### Content Colors
- **Content**: Text and icon colors
  - `primary`: Main text color
  - `secondary`: Secondary text
  - `tertiary`: Tertiary/placeholder text
  - `disabled`: Disabled state text
  - `inverse`: Inverted text (light on dark or dark on light)

### Border Colors
- `default`: Standard borders
- `subtle`: Light borders for subtle divisions
- `strong`: Strong borders for emphasis

## Theme Modes

### Light Mode
- White backgrounds with dark text
- Subtle gray surfaces
- High contrast between elements

### Dark Mode
- Dark backgrounds with light text
- Slightly lighter surfaces
- Maintained contrast ratios

### High Contrast Mode
- Pure black on white (light mode)
- Pure white on black (dark mode)
- Enhanced borders and increased contrast ratios

## Usage Examples

```typescript
// Import theme colors
import { getThemeColors } from '@/theme/colors';

// Get colors for current theme
const colors = getThemeColors('light', false);

// Use semantic colors
const primaryButton = {
  backgroundColor: colors.primary[500],
  color: colors.content.inverse,
};

// Check contrast ratio
import { meetsWCAGAA } from '@/theme/colors';
const isAccessible = meetsWCAGAA(
  colors.content.primary,
  colors.background.primary
);
```

## Accessibility

All color combinations are tested for WCAG compliance:
- **Normal text**: 4.5:1 contrast ratio (AA)
- **Large text**: 3:1 contrast ratio (AA)
- **Enhanced**: 7:1 for AAA compliance

Use the provided helper functions to validate custom color combinations.