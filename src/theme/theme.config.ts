/**
 * Theme Configuration
 * Central configuration for the Trip Sync design system
 * Integrates with NativeWind/TailwindCSS for styling
 */

import { Platform } from 'react-native';

export type ColorScheme = 'light' | 'dark' | 'system';
export type ContrastMode = 'normal' | 'high';

export interface ThemeMode {
  colorScheme: ColorScheme;
  contrastMode: ContrastMode;
}

export interface ThemeConfig {
  mode: ThemeMode;
  platform: 'ios' | 'android';
  accessibility: {
    reduceMotion: boolean;
    increaseContrast: boolean;
    screenReaderEnabled: boolean;
  };
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  animation: ThemeAnimation;
  layout: ThemeLayout;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  zIndex: ThemeZIndex;
}

export interface ThemeColors {
  // Semantic colors
  primary: ColorScale;
  secondary: ColorScale;
  tertiary: ColorScale;
  error: ColorScale;
  warning: ColorScale;
  success: ColorScale;
  info: ColorScale;
  
  // Surface colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
  };
  
  // Content colors
  content: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
  };
  
  // Border colors
  border: {
    default: string;
    subtle: string;
    strong: string;
  };
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Base
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string;
    mono: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
  fontWeight: {
    light: string;
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
}

export interface ThemeSpacing {
  0: number;
  0.5: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  10: number;
  12: number;
  14: number;
  16: number;
  20: number;
  24: number;
  32: number;
  40: number;
  48: number;
  56: number;
  64: number;
}

export interface ThemeAnimation {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spring: {
      damping: number;
      mass: number;
      stiffness: number;
      velocity: number;
    };
  };
}

export interface ThemeLayout {
  containerPadding: number;
  cardPadding: number;
  screenPadding: number;
}

export interface ThemeBorderRadius {
  none: number;
  sm: number;
  base: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  full: number;
}

export interface ThemeShadows {
  sm: any;
  base: any;
  md: any;
  lg: any;
  xl: any;
}

export interface ThemeZIndex {
  hide: number;
  base: number;
  dropdown: number;
  sticky: number;
  banner: number;
  overlay: number;
  modal: number;
  popover: number;
  tooltip: number;
}

// Default theme configuration
export const defaultThemeConfig: ThemeConfig = {
  mode: {
    colorScheme: 'system',
    contrastMode: 'normal',
  },
  platform: Platform.OS as 'ios' | 'android',
  accessibility: {
    reduceMotion: false,
    increaseContrast: false,
    screenReaderEnabled: false,
  },
};

// Theme mode helper functions
export const getEffectiveColorScheme = (
  mode: ThemeMode,
  systemColorScheme: 'light' | 'dark'
): 'light' | 'dark' => {
  if (mode.colorScheme === 'system') {
    return systemColorScheme;
  }
  return mode.colorScheme === 'dark' ? 'dark' : 'light';
};

export const shouldUseHighContrast = (
  mode: ThemeMode,
  systemHighContrast: boolean
): boolean => {
  return mode.contrastMode === 'high' || systemHighContrast;
};