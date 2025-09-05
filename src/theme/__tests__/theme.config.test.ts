import { Platform } from 'react-native';
import {
  defaultThemeConfig,
  getEffectiveColorScheme,
  shouldUseHighContrast,
} from '../theme.config';

describe('Theme Configuration', () => {
  describe('defaultThemeConfig', () => {
    it('should have system color scheme by default', () => {
      expect(defaultThemeConfig.mode.colorScheme).toBe('system');
    });

    it('should have normal contrast mode by default', () => {
      expect(defaultThemeConfig.mode.contrastMode).toBe('normal');
    });

    it('should detect platform correctly', () => {
      expect(defaultThemeConfig.platform).toBe(Platform.OS);
    });

    it('should have accessibility features disabled by default', () => {
      expect(defaultThemeConfig.accessibility).toEqual({
        reduceMotion: false,
        increaseContrast: false,
        screenReaderEnabled: false,
      });
    });
  });

  describe('getEffectiveColorScheme', () => {
    it('should return system color scheme when mode is system', () => {
      const mode = { colorScheme: 'system' as const, contrastMode: 'normal' as const };
      expect(getEffectiveColorScheme(mode, 'light')).toBe('light');
      expect(getEffectiveColorScheme(mode, 'dark')).toBe('dark');
    });

    it('should return dark when mode is dark', () => {
      const mode = { colorScheme: 'dark' as const, contrastMode: 'normal' as const };
      expect(getEffectiveColorScheme(mode, 'light')).toBe('dark');
      expect(getEffectiveColorScheme(mode, 'dark')).toBe('dark');
    });

    it('should return light when mode is light', () => {
      const mode = { colorScheme: 'light' as const, contrastMode: 'normal' as const };
      expect(getEffectiveColorScheme(mode, 'light')).toBe('light');
      expect(getEffectiveColorScheme(mode, 'dark')).toBe('light');
    });
  });

  describe('shouldUseHighContrast', () => {
    it('should return true when contrast mode is high', () => {
      const mode = { colorScheme: 'light' as const, contrastMode: 'high' as const };
      expect(shouldUseHighContrast(mode, false)).toBe(true);
    });

    it('should return true when system high contrast is enabled', () => {
      const mode = { colorScheme: 'light' as const, contrastMode: 'normal' as const };
      expect(shouldUseHighContrast(mode, true)).toBe(true);
    });

    it('should return false when both are normal', () => {
      const mode = { colorScheme: 'light' as const, contrastMode: 'normal' as const };
      expect(shouldUseHighContrast(mode, false)).toBe(false);
    });
  });
});