/**
 * Theme Testing Utilities
 * Helpers for testing components with theme support
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider';
import { ColorScheme, ContrastMode, Theme } from '../types';
import { lightColors, darkColors, highContrastColors } from '../colors';

// Extended render options for theme testing
interface ThemeRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  colorScheme?: ColorScheme;
  contrastMode?: ContrastMode;
  initialColorScheme?: 'light' | 'dark';
}

// Custom render function with theme provider
export function renderWithTheme(
  component: React.ReactElement,
  options: ThemeRenderOptions = {}
) {
  const {
    colorScheme = 'light',
    contrastMode = 'normal',
    initialColorScheme = 'light',
    ...renderOptions
  } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider
      defaultColorScheme={colorScheme}
      defaultContrastMode={contrastMode}
    >
      {children}
    </ThemeProvider>
  );

  return {
    ...render(component, { wrapper: Wrapper, ...renderOptions }),
    rerender: (rerenderComponent: React.ReactElement) =>
      render(rerenderComponent, { wrapper: Wrapper, ...renderOptions }).rerender(
        rerenderComponent
      ),
  };
}

// Theme test wrapper component
export const ThemeTestWrapper: React.FC<{
  children: React.ReactNode;
  colorScheme?: ColorScheme;
  contrastMode?: ContrastMode;
}> = ({ children, colorScheme = 'light', contrastMode = 'normal' }) => {
  return (
    <ThemeProvider
      defaultColorScheme={colorScheme}
      defaultContrastMode={contrastMode}
    >
      {children}
    </ThemeProvider>
  );
};

// Mock theme for isolated component testing
export const createMockTheme = (
  colorScheme: 'light' | 'dark' = 'light',
  highContrast: boolean = false
): Theme => {
  const colors = highContrast
    ? highContrastColors
    : colorScheme === 'dark'
    ? darkColors
    : lightColors;

  return {
    colors,
    typography: {
      fontFamily: { sans: 'System', mono: 'Courier' },
      fontSize: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 32 },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: { xs: 16, sm: 20, base: 24, lg: 28, xl: 28, '2xl': 32, '3xl': 40 },
    },
    spacing: {
      0: 0, 0.5: 4, 1: 8, 2: 16, 3: 24, 4: 32, 5: 40, 6: 48,
      7: 56, 8: 64, 10: 80, 12: 96, 14: 112, 16: 128, 20: 160,
      24: 192, 32: 256, 40: 320, 48: 384, 56: 448, 64: 512,
    },
    animation: {
      duration: { fast: 200, normal: 300, slow: 500 },
      easing: {
        linear: 'linear',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        spring: { damping: 15, mass: 1, stiffness: 100, velocity: 0 },
      },
    },
    layout: { containerPadding: 16, cardPadding: 16, screenPadding: 24 },
    borderRadius: { none: 0, sm: 4, base: 8, md: 12, lg: 16, xl: 20, '2xl': 24, full: 9999 },
    shadows: { sm: {}, base: {}, md: {}, lg: {}, xl: {} },
    zIndex: {
      hide: -1, base: 0, dropdown: 1000, sticky: 1100,
      banner: 1200, overlay: 1300, modal: 1400, popover: 1500, tooltip: 1600,
    },
  };
};

// Test helper to get theme styles
export const getThemeStyles = (colorScheme: 'light' | 'dark' = 'light') => {
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return {
    container: {
      backgroundColor: colors.background.primary,
    },
    text: {
      color: colors.content.primary,
    },
    surface: {
      backgroundColor: colors.surface.primary,
      borderColor: colors.border.default,
    },
    button: {
      backgroundColor: colors.primary[500],
      color: colors.content.inverse,
    },
  };
};

// Accessibility test helpers
export const createAccessibleComponent = (
  Component: React.ComponentType<any>,
  props: any = {}
) => {
  return (
    <Component
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Test component"
      {...props}
    />
  );
};

// Theme snapshot testing helper
export const testThemeVariants = (
  Component: React.ComponentType<any>,
  props: any = {}
) => {
  const variants = [
    { colorScheme: 'light' as ColorScheme, contrastMode: 'normal' as ContrastMode },
    { colorScheme: 'dark' as ColorScheme, contrastMode: 'normal' as ContrastMode },
    { colorScheme: 'light' as ColorScheme, contrastMode: 'high' as ContrastMode },
    { colorScheme: 'dark' as ColorScheme, contrastMode: 'high' as ContrastMode },
  ];

  return variants.map(({ colorScheme, contrastMode }) => ({
    name: `${colorScheme}-${contrastMode}`,
    element: (
      <ThemeProvider
        defaultColorScheme={colorScheme}
        defaultContrastMode={contrastMode}
      >
        <Component {...props} />
      </ThemeProvider>
    ),
  }));
};

// Animation testing helpers
export const disableAnimations = () => {
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
    ...jest.requireActual('react-native/Libraries/Animated/NativeAnimatedHelper'),
    shouldUseNativeDriver: () => false,
  }));
};

export const mockLayoutAnimation = () => {
  jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
    configureNext: jest.fn(),
    create: jest.fn(() => ({ duration: 0 })),
    Types: {
      spring: 'spring',
      linear: 'linear',
      easeInEaseOut: 'easeInEaseOut',
    },
    Properties: {
      opacity: 'opacity',
      scaleXY: 'scaleXY',
    },
  }));
};