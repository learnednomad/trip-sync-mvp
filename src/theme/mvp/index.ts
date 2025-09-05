/**
 * MVP Theme System Exports
 * Simple theme system for Trip Sync MVP
 */

// Core exports
export * from './colors';
export * from './typography';
export * from './context';

// Quick access exports
export { ThemeProvider, useTheme } from './context';
export { lightColors, darkColors, getThemeColors } from './colors';
export { typography } from './typography';