/**
 * Trip Sync Design System - Theme Export
 * Central export point for all design tokens and theme utilities
 */

export * from './colors';
export * from './typography';
export * from './tokens';

// Re-export commonly used items for convenience
export { colors, getPlatformColor, getSemanticColor } from './colors';
export { typography, getTypographyStyle } from './typography';
export {
  spacing,
  borderRadius,
  shadows,
  animation,
  zIndex,
  iconSize,
  layout,
  breakpoints,
  getElevation,
  getBorderRadius,
} from './tokens';

// Platform detection helper
import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Theme configuration type
export interface ThemeConfig {
  colorScheme: 'light' | 'dark';
  platform: 'ios' | 'android';
  accessibility: {
    reduceMotion: boolean;
    increaseContrast: boolean;
    screenReaderEnabled: boolean;
  };
}

// Default theme configuration
export const defaultThemeConfig: ThemeConfig = {
  colorScheme: 'light',
  platform: Platform.OS as 'ios' | 'android',
  accessibility: {
    reduceMotion: false,
    increaseContrast: false,
    screenReaderEnabled: false,
  },
};