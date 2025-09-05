/**
 * Trip Sync Design System - Typography
 * Platform-specific typography scales
 */

import { Platform } from 'react-native';

// iOS Typography (SF Pro)
const iosTypography = {
  largeTitle: {
    fontFamily: 'System',
    fontSize: 34,
    lineHeight: 41,
    letterSpacing: 0.37,
    fontWeight: '400' as const,
  },
  title1: {
    fontFamily: 'System',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.36,
    fontWeight: '400' as const,
  },
  title2: {
    fontFamily: 'System',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
    fontWeight: '400' as const,
  },
  title3: {
    fontFamily: 'System',
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    fontWeight: '400' as const,
  },
  headline: {
    fontFamily: 'System',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    fontWeight: '600' as const,
  },
  body: {
    fontFamily: 'System',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    fontWeight: '400' as const,
  },
  callout: {
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.32,
    fontWeight: '400' as const,
  },
  subheadline: {
    fontFamily: 'System',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    fontWeight: '400' as const,
  },
  footnote: {
    fontFamily: 'System',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    fontWeight: '400' as const,
  },
  caption1: {
    fontFamily: 'System',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  caption2: {
    fontFamily: 'System',
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0.06,
    fontWeight: '400' as const,
  },
};

// Android Typography (Material Design 3)
const androidTypography = {
  displayLarge: {
    fontFamily: 'Roboto',
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: -0.25,
    fontWeight: '400' as const,
  },
  displayMedium: {
    fontFamily: 'Roboto',
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  displaySmall: {
    fontFamily: 'Roboto',
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  headlineLarge: {
    fontFamily: 'Roboto',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  headlineMedium: {
    fontFamily: 'Roboto',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  headlineSmall: {
    fontFamily: 'Roboto',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  titleLarge: {
    fontFamily: 'Roboto',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  titleMedium: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontWeight: '500' as const,
  },
  titleSmall: {
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500' as const,
  },
  bodyLarge: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    fontWeight: '400' as const,
  },
  labelLarge: {
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500' as const,
  },
  labelMedium: {
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontFamily: 'Roboto',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500' as const,
  },
};

// Export platform-specific typography
export const typography = Platform.OS === 'ios' ? iosTypography : androidTypography;

// Type-safe typography keys
export type IOSTypographyKey = keyof typeof iosTypography;
export type AndroidTypographyKey = keyof typeof androidTypography;
export type TypographyKey = IOSTypographyKey | AndroidTypographyKey;

// Helper function to get typography style
export const getTypographyStyle = (key: string) => {
  if (Platform.OS === 'ios' && key in iosTypography) {
    return iosTypography[key as IOSTypographyKey];
  }
  if (Platform.OS === 'android' && key in androidTypography) {
    return androidTypography[key as AndroidTypographyKey];
  }
  // Fallback to body/bodyMedium
  return Platform.OS === 'ios' ? iosTypography.body : androidTypography.bodyMedium;
};