/**
 * Theme Color System
 * Semantic color tokens for light, dark, and high-contrast modes
 */

import { ColorScale, ThemeColors } from './types';

// Brand color scales
const brandScale: ColorScale = {
  50: '#E8F4FD',
  100: '#D2E9FB',
  200: '#A5D3F7',
  300: '#77BCF3',
  400: '#4AA6EF',
  500: '#2F95DC', // Primary brand color
  600: '#2477B0',
  700: '#1A5884',
  800: '#0F3A58',
  900: '#051B2C',
};

const secondaryScale: ColorScale = {
  50: '#F5F3FF',
  100: '#EBE6FF',
  200: '#D7CCFF',
  300: '#C3B3FF',
  400: '#AF99FF',
  500: '#9B80FF',
  600: '#7C66CC',
  700: '#5D4D99',
  800: '#3E3366',
  900: '#1F1A33',
};

const tertiaryScale: ColorScale = {
  50: '#FFF4E6',
  100: '#FFE8CC',
  200: '#FFD199',
  300: '#FFBA66',
  400: '#FFA333',
  500: '#FF8C00',
  600: '#CC7000',
  700: '#995400',
  800: '#663800',
  900: '#331C00',
};

// Functional color scales
const errorScale: ColorScale = {
  50: '#FEE4E2',
  100: '#FECAC6',
  200: '#FCA5A5',
  300: '#F87171',
  400: '#EF4444',
  500: '#DC2626',
  600: '#B91C1C',
  700: '#991B1B',
  800: '#7F1D1D',
  900: '#451A1A',
};

const warningScale: ColorScale = {
  50: '#FFF7ED',
  100: '#FFEDD5',
  200: '#FED7AA',
  300: '#FDBA74',
  400: '#FB923C',
  500: '#F97316',
  600: '#EA580C',
  700: '#C2410C',
  800: '#9A3412',
  900: '#7C2D12',
};

const successScale: ColorScale = {
  50: '#F0FDF4',
  100: '#DCFCE7',
  200: '#BBF7D0',
  300: '#86EFAC',
  400: '#4ADE80',
  500: '#22C55E',
  600: '#16A34A',
  700: '#15803D',
  800: '#166534',
  900: '#14532D',
};

const infoScale: ColorScale = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
};

// Neutral scale for surfaces and content
const neutralScale = {
  0: '#FFFFFF',
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#E5E5E5',
  300: '#D4D4D4',
  400: '#A3A3A3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
  950: '#0A0A0A',
  1000: '#000000',
};

// Light theme colors
export const lightColors: ThemeColors = {
  primary: brandScale,
  secondary: secondaryScale,
  tertiary: tertiaryScale,
  error: errorScale,
  warning: warningScale,
  success: successScale,
  info: infoScale,
  
  background: {
    primary: neutralScale[0],      // White
    secondary: neutralScale[50],   // Light gray
    tertiary: neutralScale[100],   // Slightly darker gray
  },
  
  surface: {
    primary: neutralScale[0],      // White
    secondary: neutralScale[50],   // Light gray
    tertiary: neutralScale[100],   // Slightly darker gray
    elevated: neutralScale[0],     // White (with shadow)
  },
  
  content: {
    primary: neutralScale[950],    // Near black
    secondary: neutralScale[600],  // Dark gray
    tertiary: neutralScale[500],   // Medium gray
    disabled: neutralScale[400],   // Light gray
    inverse: neutralScale[0],      // White
  },
  
  border: {
    default: neutralScale[200],    // Light border
    subtle: neutralScale[100],     // Very light border
    strong: neutralScale[300],     // Darker border
  },
};

// Dark theme colors
export const darkColors: ThemeColors = {
  primary: brandScale,
  secondary: secondaryScale,
  tertiary: tertiaryScale,
  error: errorScale,
  warning: warningScale,
  success: successScale,
  info: infoScale,
  
  background: {
    primary: neutralScale[950],    // Near black
    secondary: neutralScale[900],  // Dark gray
    tertiary: neutralScale[800],   // Slightly lighter gray
  },
  
  surface: {
    primary: neutralScale[900],    // Dark gray
    secondary: neutralScale[800],  // Darker gray
    tertiary: neutralScale[700],   // Medium dark gray
    elevated: neutralScale[800],   // Dark gray (with shadow)
  },
  
  content: {
    primary: neutralScale[50],     // Near white
    secondary: neutralScale[200],  // Light gray
    tertiary: neutralScale[300],   // Medium light gray
    disabled: neutralScale[600],   // Dark gray
    inverse: neutralScale[950],    // Near black
  },
  
  border: {
    default: neutralScale[700],    // Dark border
    subtle: neutralScale[800],     // Very dark border
    strong: neutralScale[600],     // Lighter border
  },
};

// High contrast theme colors
export const highContrastColors: ThemeColors = {
  primary: {
    ...brandScale,
    500: '#0066CC', // Higher contrast primary
  },
  secondary: secondaryScale,
  tertiary: tertiaryScale,
  error: errorScale,
  warning: warningScale,
  success: successScale,
  info: infoScale,
  
  background: {
    primary: neutralScale[0],      // Pure white
    secondary: neutralScale[0],    // Pure white
    tertiary: neutralScale[50],    // Very light gray
  },
  
  surface: {
    primary: neutralScale[0],      // Pure white
    secondary: neutralScale[0],    // Pure white
    tertiary: neutralScale[50],    // Very light gray
    elevated: neutralScale[0],     // Pure white
  },
  
  content: {
    primary: neutralScale[1000],   // Pure black
    secondary: neutralScale[900],  // Near black
    tertiary: neutralScale[800],   // Dark gray
    disabled: neutralScale[500],   // Medium gray
    inverse: neutralScale[0],      // Pure white
  },
  
  border: {
    default: neutralScale[1000],   // Pure black
    subtle: neutralScale[400],     // Medium gray
    strong: neutralScale[1000],    // Pure black
  },
};

// Dark high contrast theme colors
export const darkHighContrastColors: ThemeColors = {
  primary: {
    ...brandScale,
    500: '#66B3FF', // Higher contrast primary for dark mode
  },
  secondary: secondaryScale,
  tertiary: tertiaryScale,
  error: errorScale,
  warning: warningScale,
  success: successScale,
  info: infoScale,
  
  background: {
    primary: neutralScale[1000],   // Pure black
    secondary: neutralScale[1000], // Pure black
    tertiary: neutralScale[950],   // Near black
  },
  
  surface: {
    primary: neutralScale[1000],   // Pure black
    secondary: neutralScale[1000], // Pure black
    tertiary: neutralScale[950],   // Near black
    elevated: neutralScale[950],   // Near black
  },
  
  content: {
    primary: neutralScale[0],      // Pure white
    secondary: neutralScale[100],  // Near white
    tertiary: neutralScale[200],   // Light gray
    disabled: neutralScale[500],   // Medium gray
    inverse: neutralScale[1000],   // Pure black
  },
  
  border: {
    default: neutralScale[0],      // Pure white
    subtle: neutralScale[600],     // Dark gray
    strong: neutralScale[0],       // Pure white
  },
};

// Helper function to get colors based on theme mode
export const getThemeColors = (
  colorScheme: 'light' | 'dark',
  highContrast: boolean
): ThemeColors => {
  if (highContrast) {
    return colorScheme === 'dark' ? darkHighContrastColors : highContrastColors;
  }
  return colorScheme === 'dark' ? darkColors : lightColors;
};

// Color contrast validation helpers
export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In production, use a proper library like color or chroma-js
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const sRGB = [r, g, b].map((val) => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lmax = Math.max(l1, l2);
  const lmin = Math.min(l1, l2);
  
  return (lmax + 0.05) / (lmin + 0.05);
};

// WCAG AA compliance check
export const meetsWCAGAA = (textColor: string, backgroundColor: string, isLargeText = false): boolean => {
  const ratio = getContrastRatio(textColor, backgroundColor);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

// WCAG AAA compliance check
export const meetsWCAGAAA = (textColor: string, backgroundColor: string, isLargeText = false): boolean => {
  const ratio = getContrastRatio(textColor, backgroundColor);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
};