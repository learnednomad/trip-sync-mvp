/**
 * Theme Type Definitions
 * Type definitions for the Trip Sync theme system
 */

export type {
  ColorScale,
  ColorScheme,
  ContrastMode,
  Theme,
  ThemeAnimation,
  ThemeBorderRadius,
  ThemeColors,
  ThemeConfig,
  ThemeLayout,
  ThemeMode,
  ThemeShadows,
  ThemeSpacing,
  ThemeTypography,
  ThemeZIndex,
} from './theme.config';

// Theme context types
export interface ThemeContextValue {
  theme: Theme;
  config: ThemeConfig;
  colorScheme: 'light' | 'dark';
  highContrast: boolean;
  setColorScheme: (scheme: ColorScheme) => void;
  setContrastMode: (mode: ContrastMode) => void;
  toggleColorScheme: () => void;
}

// Theme provider props
export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultColorScheme?: ColorScheme;
  defaultContrastMode?: ContrastMode;
}

// Styled component props
export interface ThemedProps {
  theme: Theme;
  colorScheme: 'light' | 'dark';
  highContrast: boolean;
}