/**
 * Theme Typography System
 * Typography scale with 7 sizes and 5 weights
 * Platform-specific font families and line heights
 */

import { Platform } from 'react-native';
import { ThemeTypography } from './types';

// Platform-specific font families
const fontFamilies = {
  ios: {
    sans: Platform.select({
      ios: 'System',
      default: 'System',
    }),
    mono: Platform.select({
      ios: 'Menlo',
      default: 'Courier',
    }),
  },
  android: {
    sans: Platform.select({
      android: 'Roboto',
      default: 'System',
    }),
    mono: Platform.select({
      android: 'RobotoMono',
      default: 'Courier',
    }),
  },
};

// Typography scale following 8-point grid
export const typography: ThemeTypography = {
  fontFamily: Platform.OS === 'ios' ? fontFamilies.ios : fontFamilies.android,
  
  fontSize: {
    xs: 12,    // Small labels, captions
    sm: 14,    // Secondary text, labels
    base: 16,  // Body text default
    lg: 18,    // Emphasized body text
    xl: 20,    // Small headings
    '2xl': 24, // Section headings
    '3xl': 32, // Page headings
  },
  
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    xs: 16,    // 1.33x font size
    sm: 20,    // 1.43x font size
    base: 24,  // 1.5x font size
    lg: 28,    // 1.56x font size
    xl: 28,    // 1.4x font size
    '2xl': 32, // 1.33x font size
    '3xl': 40, // 1.25x font size
  },
};

// Typography style combinations
export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing?: number;
}

// Pre-defined text styles for consistency
export const textStyles = {
  // Display styles
  displayLarge: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight['3xl'],
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight['2xl'],
    letterSpacing: -0.25,
  },
  displaySmall: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.xl,
  },
  
  // Heading styles
  headingLarge: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.xl,
  },
  headingMedium: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.lg,
  },
  headingSmall: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.base,
  },
  
  // Body styles
  bodyLarge: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.lg,
  },
  bodyMedium: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.base,
  },
  bodySmall: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.sm,
  },
  
  // Label styles
  labelLarge: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.base,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: 0.15,
  },
  labelSmall: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.xs,
    letterSpacing: 0.2,
  },
  
  // Special styles
  button: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.base,
    letterSpacing: 0.15,
  },
  caption: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.xs,
    letterSpacing: 0.4,
  },
  overline: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  code: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.sm,
  },
};

// Helper to get typography style
export const getTypographyStyle = (
  size: keyof typeof typography.fontSize = 'base',
  weight: keyof typeof typography.fontWeight = 'regular'
): TypographyStyle => {
  return {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize[size],
    fontWeight: typography.fontWeight[weight],
    lineHeight: typography.lineHeight[size],
  };
};

// Platform-specific text style adjustments
export const getPlatformTextStyle = (baseStyle: TypographyStyle): TypographyStyle => {
  if (Platform.OS === 'ios') {
    // iOS-specific adjustments
    return {
      ...baseStyle,
      // iOS renders text slightly smaller
      fontSize: baseStyle.fontSize,
    };
  } else {
    // Android-specific adjustments
    return {
      ...baseStyle,
      // Android needs includeFontPadding: false for accurate line heights
      // This is handled in the component implementation
    };
  }
};

// Typography utilities for NativeWind
export const typographyUtilities = {
  // Font sizes
  'text-xs': { fontSize: typography.fontSize.xs, lineHeight: typography.lineHeight.xs },
  'text-sm': { fontSize: typography.fontSize.sm, lineHeight: typography.lineHeight.sm },
  'text-base': { fontSize: typography.fontSize.base, lineHeight: typography.lineHeight.base },
  'text-lg': { fontSize: typography.fontSize.lg, lineHeight: typography.lineHeight.lg },
  'text-xl': { fontSize: typography.fontSize.xl, lineHeight: typography.lineHeight.xl },
  'text-2xl': { fontSize: typography.fontSize['2xl'], lineHeight: typography.lineHeight['2xl'] },
  'text-3xl': { fontSize: typography.fontSize['3xl'], lineHeight: typography.lineHeight['3xl'] },
  
  // Font weights
  'font-light': { fontWeight: typography.fontWeight.light },
  'font-regular': { fontWeight: typography.fontWeight.regular },
  'font-medium': { fontWeight: typography.fontWeight.medium },
  'font-semibold': { fontWeight: typography.fontWeight.semibold },
  'font-bold': { fontWeight: typography.fontWeight.bold },
  
  // Text styles
  'text-display-large': textStyles.displayLarge,
  'text-display-medium': textStyles.displayMedium,
  'text-display-small': textStyles.displaySmall,
  'text-heading-large': textStyles.headingLarge,
  'text-heading-medium': textStyles.headingMedium,
  'text-heading-small': textStyles.headingSmall,
  'text-body-large': textStyles.bodyLarge,
  'text-body-medium': textStyles.bodyMedium,
  'text-body-small': textStyles.bodySmall,
  'text-label-large': textStyles.labelLarge,
  'text-label-medium': textStyles.labelMedium,
  'text-label-small': textStyles.labelSmall,
  'text-button': textStyles.button,
  'text-caption': textStyles.caption,
  'text-overline': textStyles.overline,
  'text-code': textStyles.code,
};