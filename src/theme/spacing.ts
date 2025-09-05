/**
 * Theme Spacing System
 * 8-point grid system for consistent spacing
 */

import { ThemeSpacing } from './types';

// Base unit for the spacing system (8-point grid)
const BASE_UNIT = 8;

// Spacing scale based on 8-point grid
export const spacing: ThemeSpacing = {
  0: 0,        // 0px
  0.5: 4,      // 4px (half unit)
  1: 8,        // 8px (1x base)
  2: 16,       // 16px (2x base)
  3: 24,       // 24px (3x base)
  4: 32,       // 32px (4x base)
  5: 40,       // 40px (5x base)
  6: 48,       // 48px (6x base)
  7: 56,       // 56px (7x base)
  8: 64,       // 64px (8x base)
  10: 80,      // 80px (10x base)
  12: 96,      // 96px (12x base)
  14: 112,     // 112px (14x base)
  16: 128,     // 128px (16x base)
  20: 160,     // 160px (20x base)
  24: 192,     // 192px (24x base)
  32: 256,     // 256px (32x base)
  40: 320,     // 320px (40x base)
  48: 384,     // 384px (48x base)
  56: 448,     // 448px (56x base)
  64: 512,     // 512px (64x base)
};

// Common spacing combinations
export const spacingCombinations = {
  // Page padding
  pagePadding: {
    horizontal: spacing[2],  // 16px
    vertical: spacing[3],    // 24px
  },
  
  // Card spacing
  cardPadding: {
    small: spacing[2],       // 16px
    medium: spacing[3],      // 24px
    large: spacing[4],       // 32px
  },
  
  // List item spacing
  listItemSpacing: {
    compact: spacing[1],     // 8px
    default: spacing[2],     // 16px
    relaxed: spacing[3],     // 24px
  },
  
  // Section spacing
  sectionSpacing: {
    small: spacing[4],       // 32px
    medium: spacing[6],      // 48px
    large: spacing[8],       // 64px
  },
  
  // Component gaps
  gap: {
    xs: spacing[0.5],        // 4px
    sm: spacing[1],          // 8px
    md: spacing[2],          // 16px
    lg: spacing[3],          // 24px
    xl: spacing[4],          // 32px
  },
  
  // Icon spacing
  iconSpacing: {
    fromText: spacing[1],    // 8px
    inButton: spacing[1],    // 8px
    standalone: spacing[2],  // 16px
  },
};

// Spacing utilities for padding and margin
export const spacingUtilities = {
  // Padding utilities
  p: (value: keyof typeof spacing) => ({ padding: spacing[value] }),
  px: (value: keyof typeof spacing) => ({ paddingHorizontal: spacing[value] }),
  py: (value: keyof typeof spacing) => ({ paddingVertical: spacing[value] }),
  pt: (value: keyof typeof spacing) => ({ paddingTop: spacing[value] }),
  pr: (value: keyof typeof spacing) => ({ paddingRight: spacing[value] }),
  pb: (value: keyof typeof spacing) => ({ paddingBottom: spacing[value] }),
  pl: (value: keyof typeof spacing) => ({ paddingLeft: spacing[value] }),
  
  // Margin utilities
  m: (value: keyof typeof spacing) => ({ margin: spacing[value] }),
  mx: (value: keyof typeof spacing) => ({ marginHorizontal: spacing[value] }),
  my: (value: keyof typeof spacing) => ({ marginVertical: spacing[value] }),
  mt: (value: keyof typeof spacing) => ({ marginTop: spacing[value] }),
  mr: (value: keyof typeof spacing) => ({ marginRight: spacing[value] }),
  mb: (value: keyof typeof spacing) => ({ marginBottom: spacing[value] }),
  ml: (value: keyof typeof spacing) => ({ marginLeft: spacing[value] }),
  
  // Gap utilities (for flex containers)
  gap: (value: keyof typeof spacing) => ({ gap: spacing[value] }),
  gapX: (value: keyof typeof spacing) => ({ columnGap: spacing[value] }),
  gapY: (value: keyof typeof spacing) => ({ rowGap: spacing[value] }),
};

// Helper to get spacing value
export const getSpacing = (value: keyof typeof spacing): number => {
  return spacing[value];
};

// Helper to create spacing object
export const createSpacing = (
  top: keyof typeof spacing,
  right?: keyof typeof spacing,
  bottom?: keyof typeof spacing,
  left?: keyof typeof spacing
) => {
  if (right === undefined) {
    // Single value: all sides
    return {
      top: spacing[top],
      right: spacing[top],
      bottom: spacing[top],
      left: spacing[top],
    };
  } else if (bottom === undefined) {
    // Two values: vertical, horizontal
    return {
      top: spacing[top],
      right: spacing[right],
      bottom: spacing[top],
      left: spacing[right],
    };
  } else if (left === undefined) {
    // Three values: top, horizontal, bottom
    return {
      top: spacing[top],
      right: spacing[right],
      bottom: spacing[bottom],
      left: spacing[right],
    };
  } else {
    // Four values: top, right, bottom, left
    return {
      top: spacing[top],
      right: spacing[right],
      bottom: spacing[bottom],
      left: spacing[left],
    };
  }
};

// NativeWind spacing classes
export const nativeWindSpacing = Object.keys(spacing).reduce((acc, key) => {
  const value = key as keyof typeof spacing;
  const pixels = spacing[value];
  
  return {
    ...acc,
    // Padding classes
    [`p-${key}`]: { padding: pixels },
    [`px-${key}`]: { paddingHorizontal: pixels },
    [`py-${key}`]: { paddingVertical: pixels },
    [`pt-${key}`]: { paddingTop: pixels },
    [`pr-${key}`]: { paddingRight: pixels },
    [`pb-${key}`]: { paddingBottom: pixels },
    [`pl-${key}`]: { paddingLeft: pixels },
    
    // Margin classes
    [`m-${key}`]: { margin: pixels },
    [`mx-${key}`]: { marginHorizontal: pixels },
    [`my-${key}`]: { marginVertical: pixels },
    [`mt-${key}`]: { marginTop: pixels },
    [`mr-${key}`]: { marginRight: pixels },
    [`mb-${key}`]: { marginBottom: pixels },
    [`ml-${key}`]: { marginLeft: pixels },
    
    // Gap classes
    [`gap-${key}`]: { gap: pixels },
    [`gap-x-${key}`]: { columnGap: pixels },
    [`gap-y-${key}`]: { rowGap: pixels },
    
    // Width and height
    [`w-${key}`]: { width: pixels },
    [`h-${key}`]: { height: pixels },
    
    // Min/max dimensions
    [`min-w-${key}`]: { minWidth: pixels },
    [`min-h-${key}`]: { minHeight: pixels },
    [`max-w-${key}`]: { maxWidth: pixels },
    [`max-h-${key}`]: { maxHeight: pixels },
  };
}, {});