/**
 * Theme Provider Tests
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import {
  ThemeProvider,
  useTheme,
  useThemeColors,
  useThemeColorScheme,
  useHighContrast,
} from '../ThemeProvider';
import { lightColors, darkColors, highContrastColors } from '../colors';

// Mock React Native modules
jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
  getColorScheme: jest.fn(() => 'light'),
}));

jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
  configureNext: jest.fn(),
  create: jest.fn(),
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

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock useColorScheme hook
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  useColorScheme: jest.fn(() => 'light'),
}));

describe('ThemeProvider', () => {
  let mockStorage: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage = new MMKV();
  });
  
  describe('Initial Setup', () => {
    it('should provide theme context to children', () => {
      const wrapper = ({ children }: any) => (
        <ThemeProvider>{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current).toBeDefined();
      expect(result.current.theme).toBeDefined();
      expect(result.current.config).toBeDefined();
    });
    
    it('should use system color scheme by default', () => {
      const wrapper = ({ children }: any) => (
        <ThemeProvider>{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.config.mode.colorScheme).toBe('system');
      expect(result.current.colorScheme).toBe('light'); // System is mocked as light
    });
    
    it('should load persisted theme settings', () => {
      mockStorage.getString.mockImplementation((key: string) => {
        if (key === 'theme:colorScheme') return 'dark';
        if (key === 'theme:contrastMode') return 'high';
        return undefined;
      });
      
      const wrapper = ({ children }: any) => (
        <ThemeProvider>{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.config.mode.colorScheme).toBe('dark');
      expect(result.current.config.mode.contrastMode).toBe('high');
    });
  });
  
  describe('Theme Switching', () => {
    it('should switch color scheme', () => {
      const wrapper = ({ children }: any) => (
        <ThemeProvider>{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setColorScheme('dark');
      });
      
      expect(result.current.colorScheme).toBe('dark');
      expect(mockStorage.set).toHaveBeenCalledWith('theme:colorScheme', 'dark');
    });
    
    it('should toggle color scheme', () => {
      const wrapper = ({ children }: any) => (
        <ThemeProvider defaultColorScheme="light">{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      // Start with light
      expect(result.current.colorScheme).toBe('light');
      
      // Toggle to dark
      act(() => {
        result.current.toggleColorScheme();
      });
      expect(result.current.colorScheme).toBe('dark');
      
      // Toggle to system
      act(() => {
        result.current.toggleColorScheme();
      });
      expect(result.current.config.mode.colorScheme).toBe('system');
      
      // Toggle back to light
      act(() => {
        result.current.toggleColorScheme();
      });
      expect(result.current.colorScheme).toBe('light');
    });
    
    it('should complete theme switch within 50ms', () => {
      const wrapper = ({ children }: any) => (
        <ThemeProvider>{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      const startTime = Date.now();
      
      act(() => {
        result.current.setColorScheme('dark');
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThanOrEqual(50);
    });
  });
  
  describe('Theme Colors', () => {
    it('should provide light colors in light mode', () => {
      const wrapper = ({ children }: any) => (
        <ThemeProvider defaultColorScheme="light">{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useThemeColors(), { wrapper });
      
      expect(result.current).toBe(lightColors);
    });
    
    it('should provide dark colors in dark mode', () => {
      const wrapper = ({ children }: any) => (
        <ThemeProvider defaultColorScheme="dark">{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useThemeColors(), { wrapper });
      
      expect(result.current).toBe(darkColors);
    });
    
    it('should provide high contrast colors when enabled', () => {
      const wrapper = ({ children }: any) => (
        <ThemeProvider 
          defaultColorScheme="light"
          defaultContrastMode="high"
        >{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useThemeColors(), { wrapper });
      
      expect(result.current).toBe(highContrastColors);
    });
  });
  
  describe('System Theme Following', () => {
    it('should follow system theme changes when set to system', () => {
      (useSystemColorScheme as jest.Mock).mockReturnValue('light');
      
      const wrapper = ({ children }: any) => (
        <ThemeProvider defaultColorScheme="system">{children}</ThemeProvider>
      );
      
      const { result, rerender } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.colorScheme).toBe('light');
      
      // Simulate system theme change
      (useSystemColorScheme as jest.Mock).mockReturnValue('dark');
      rerender();
      
      expect(result.current.colorScheme).toBe('dark');
    });
    
    it('should not follow system theme when set to specific scheme', () => {
      (useSystemColorScheme as jest.Mock).mockReturnValue('light');
      
      const wrapper = ({ children }: any) => (
        <ThemeProvider defaultColorScheme="dark">{children}</ThemeProvider>
      );
      
      const { result, rerender } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.colorScheme).toBe('dark');
      
      // Simulate system theme change
      (useSystemColorScheme as jest.Mock).mockReturnValue('light');
      rerender();
      
      // Should still be dark
      expect(result.current.colorScheme).toBe('dark');
    });
  });
  
  describe('Utility Hooks', () => {
    it('should provide theme color scheme', () => {
      const wrapper = ({ children }: any) => (
        <ThemeProvider defaultColorScheme="dark">{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useThemeColorScheme(), { wrapper });
      
      expect(result.current).toBe('dark');
    });
    
    it('should provide high contrast state', () => {
      const wrapper = ({ children }: any) => (
        <ThemeProvider defaultContrastMode="high">{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useHighContrast(), { wrapper });
      
      expect(result.current).toBe(true);
    });
  });
  
  describe('Error Handling', () => {
    it('should throw error when useTheme is used outside provider', () => {
      const { result } = renderHook(() => useTheme());
      
      expect(result.error).toEqual(
        new Error('useTheme must be used within a ThemeProvider')
      );
    });
  });
});