/**
 * Theme System Export
 * Central export point for the Trip Sync theme system
 */

// Core exports
export * from './types';
export * from './theme.config';
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './animations';
export * from './tokens';
export * from './animation-utils';

// Provider and hooks
export { ThemeProvider } from './ThemeProvider';
export {
  useTheme,
  useThemeColors,
  useThemeTypography,
  useThemeSpacing,
  useThemeAnimation,
  useThemeColorScheme,
  useHighContrast,
} from './ThemeProvider';

// Quick access exports
export { 
  lightColors,
  darkColors,
  highContrastColors,
  getThemeColors,
  meetsWCAGAA,
  meetsWCAGAAA,
} from './colors';

export {
  typography,
  textStyles,
  getTypographyStyle,
  typographyUtilities,
} from './typography';

export {
  spacing,
  spacingCombinations,
  spacingUtilities,
  getSpacing,
  createSpacing,
} from './spacing';

export {
  animation,
  nativeEasing,
  reanimatedConfigs,
  animationPatterns,
  animationHelpers,
  gestureAnimations,
} from './animations';

export {
  borderRadius,
  shadows,
  zIndex,
  layout,
  iconSize,
  breakpoints,
  getElevation,
  getBorderRadius,
} from './tokens';

export {
  createAnimatedValue,
  createAnimatedXY,
  runAnimation,
  animateThemeChange,
  layoutAnimationPresets,
} from './animation-utils';