/**
 * MVP Theme Context Tests
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { MMKV } from 'react-native-mmkv';
import { ThemeProvider, useTheme } from '../context';
import { lightColors, darkColors } from '../colors';

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn().mockReturnValue(null),
    set: jest.fn(),
  })),
}));

// Mock useColorScheme
jest.mock('react-native', () => ({
  useColorScheme: jest.fn().mockReturnValue('light'),
}));

describe('MVP Theme Context', () => {
  let mockStorage: any;

  beforeEach(() => {
    mockStorage = new (MMKV as any)();
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  describe('useTheme Hook', () => {
    it('should throw error when used outside ThemeProvider', () => {
      const { result } = renderHook(() => useTheme());
      expect(result.error).toEqual(
        Error('useTheme must be used within a ThemeProvider')
      );
    });

    it('should provide theme context when used within ThemeProvider', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current).toBeDefined();
      expect(result.current.theme).toBeDefined();
      expect(result.current.toggleTheme).toBeDefined();
      expect(result.current.setTheme).toBeDefined();
    });
  });

  describe('Theme State', () => {
    it('should default to light theme when no preference is saved', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.theme.isDark).toBe(false);
      expect(result.current.theme.colors).toEqual(lightColors);
    });

    it('should use saved theme preference', () => {
      mockStorage.getString.mockReturnValue('dark');
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.theme.isDark).toBe(true);
      expect(result.current.theme.colors).toEqual(darkColors);
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle from light to dark', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme.isDark).toBe(true);
      expect(result.current.theme.colors).toEqual(darkColors);
      expect(mockStorage.set).toHaveBeenCalledWith('theme_preference', 'dark');
    });

    it('should toggle from dark to light', () => {
      mockStorage.getString.mockReturnValue('dark');
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme.isDark).toBe(false);
      expect(result.current.theme.colors).toEqual(lightColors);
      expect(mockStorage.set).toHaveBeenCalledWith('theme_preference', 'light');
    });
  });

  describe('Set Theme', () => {
    it('should set dark theme', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setTheme(true);
      });
      
      expect(result.current.theme.isDark).toBe(true);
      expect(result.current.theme.colors).toEqual(darkColors);
      expect(mockStorage.set).toHaveBeenCalledWith('theme_preference', 'dark');
    });

    it('should set light theme', () => {
      mockStorage.getString.mockReturnValue('dark');
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setTheme(false);
      });
      
      expect(result.current.theme.isDark).toBe(false);
      expect(result.current.theme.colors).toEqual(lightColors);
      expect(mockStorage.set).toHaveBeenCalledWith('theme_preference', 'light');
    });
  });

  describe('Theme Object', () => {
    it('should include colors and typography', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.theme).toHaveProperty('colors');
      expect(result.current.theme).toHaveProperty('typography');
      expect(result.current.theme).toHaveProperty('isDark');
    });

    it('should have correct typography values', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.theme.typography).toEqual({
        small: { fontSize: 14, lineHeight: 20 },
        medium: { fontSize: 16, lineHeight: 24 },
        large: { fontSize: 20, lineHeight: 28 },
      });
    });
  });
});