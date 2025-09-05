/**
 * Additional Theme Tokens
 * Border radius, shadows, z-index, and other design tokens
 */

import { Platform } from 'react-native';
import { ThemeBorderRadius, ThemeShadows, ThemeZIndex, ThemeLayout } from './types';

// Border radius scale
export const borderRadius: ThemeBorderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// Platform-specific border radius
export const platformBorderRadius = {
  ios: {
    button: 12,
    card: 16,
    modal: 20,
    sheet: 20,
  },
  android: {
    button: 8,
    card: 12,
    modal: 16,
    sheet: 16,
  },
};

// Shadow definitions
export const shadows: ThemeShadows = Platform.select({
  ios: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
    },
  },
  android: {
    sm: { elevation: 2 },
    base: { elevation: 4 },
    md: { elevation: 8 },
    lg: { elevation: 12 },
    xl: { elevation: 16 },
  },
  default: {
    sm: {},
    base: {},
    md: {},
    lg: {},
    xl: {},
  },
});

// Z-index scale
export const zIndex: ThemeZIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

// Layout constants
export const layout: ThemeLayout = {
  containerPadding: 16,
  cardPadding: 16,
  screenPadding: 24,
};

// Icon sizes
export const iconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};

// Breakpoints for responsive design (tablet support)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Export helper functions
export const getElevation = (level: keyof ThemeShadows): any => {
  return shadows[level];
};

export const getBorderRadius = (size: keyof ThemeBorderRadius): number => {
  return borderRadius[size];
};

// Re-export spacing for convenience
export { spacing } from './spacing';