/**
 * Trip Sync Design System - Design Tokens
 * Comprehensive design tokens for spacing, shadows, animations, etc.
 */

import { Platform } from 'react-native';

// Spacing scale (4pt/8pt grid)
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Border radius tokens
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
  // Platform-specific
  ios: {
    button: 10,
    card: 12,
    modal: 14,
    sheet: 20,
  },
  android: {
    button: 4,
    card: 12,
    modal: 28,
    sheet: 28,
  },
} as const;

// Shadow/Elevation tokens
export const shadows = {
  ios: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
    },
  },
  android: {
    1: { elevation: 1 },
    2: { elevation: 2 },
    3: { elevation: 3 },
    4: { elevation: 4 },
    6: { elevation: 6 },
    8: { elevation: 8 },
    12: { elevation: 12 },
    16: { elevation: 16 },
    24: { elevation: 24 },
  },
} as const;

// Animation durations
export const animation = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 1000,
  },
  easing: {
    easeInOut: [0.4, 0, 0.2, 1],
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    sharp: [0.4, 0, 0.6, 1],
    spring: [0.175, 0.885, 0.32, 1.275],
  },
} as const;

// Z-index layers
export const zIndex = {
  background: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
  overlay: 900,
} as const;

// Icon sizes
export const iconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
} as const;

// Layout constants
export const layout = {
  // Safe area insets handled by react-native-safe-area-context
  screenPadding: spacing.md,
  cardPadding: spacing.md,
  listItemHeight: {
    sm: 44,
    md: 56,
    lg: 72,
  },
  headerHeight: Platform.select({
    ios: 44,
    android: 56,
  }),
  tabBarHeight: Platform.select({
    ios: 49,
    android: 56,
  }),
  // iOS specific
  ios: {
    largeTitle: 96,
    searchBar: 52,
  },
  // Android specific
  android: {
    statusBar: 24,
    appBar: 56,
    extendedAppBar: 128,
  },
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  xs: 0,
  sm: 380, // Small phones
  md: 430, // Standard phones
  lg: 768, // Tablets
  xl: 1024, // Large tablets
} as const;

// Helper functions
export const getElevation = (level: number) => {
  if (Platform.OS === 'ios') {
    switch (level) {
      case 1:
        return shadows.ios.sm;
      case 2:
      case 3:
      case 4:
        return shadows.ios.md;
      case 6:
      case 8:
        return shadows.ios.lg;
      default:
        return shadows.ios.xl;
    }
  }
  return { elevation: level };
};

export const getBorderRadius = (size: 'button' | 'card' | 'modal' | 'sheet') => {
  return Platform.OS === 'ios' ? borderRadius.ios[size] : borderRadius.android[size];
};