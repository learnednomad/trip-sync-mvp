/**
 * Color System Tests
 */

import {
  lightColors,
  darkColors,
  highContrastColors,
  darkHighContrastColors,
  getThemeColors,
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
} from '../colors';

describe('Color System', () => {
  describe('Theme Colors', () => {
    it('should have all required color properties in light theme', () => {
      expect(lightColors).toHaveProperty('primary');
      expect(lightColors).toHaveProperty('secondary');
      expect(lightColors).toHaveProperty('tertiary');
      expect(lightColors).toHaveProperty('error');
      expect(lightColors).toHaveProperty('warning');
      expect(lightColors).toHaveProperty('success');
      expect(lightColors).toHaveProperty('info');
      expect(lightColors).toHaveProperty('background');
      expect(lightColors).toHaveProperty('surface');
      expect(lightColors).toHaveProperty('content');
      expect(lightColors).toHaveProperty('border');
    });

    it('should have all required color properties in dark theme', () => {
      expect(darkColors).toHaveProperty('primary');
      expect(darkColors).toHaveProperty('background');
      expect(darkColors).toHaveProperty('content');
    });

    it('should have color scales with all required steps', () => {
      const scale = lightColors.primary;
      expect(scale).toHaveProperty('50');
      expect(scale).toHaveProperty('100');
      expect(scale).toHaveProperty('200');
      expect(scale).toHaveProperty('300');
      expect(scale).toHaveProperty('400');
      expect(scale).toHaveProperty('500');
      expect(scale).toHaveProperty('600');
      expect(scale).toHaveProperty('700');
      expect(scale).toHaveProperty('800');
      expect(scale).toHaveProperty('900');
    });
  });

  describe('getThemeColors', () => {
    it('should return light colors for light mode', () => {
      const colors = getThemeColors('light', false);
      expect(colors).toBe(lightColors);
    });

    it('should return dark colors for dark mode', () => {
      const colors = getThemeColors('dark', false);
      expect(colors).toBe(darkColors);
    });

    it('should return high contrast colors when enabled', () => {
      const lightHighContrast = getThemeColors('light', true);
      expect(lightHighContrast).toBe(highContrastColors);

      const darkHighContrast = getThemeColors('dark', true);
      expect(darkHighContrast).toBe(darkHighContrastColors);
    });
  });

  describe('Contrast Ratio Calculations', () => {
    it('should calculate contrast ratio between white and black', () => {
      const ratio = getContrastRatio('#FFFFFF', '#000000');
      expect(ratio).toBeGreaterThan(20); // Black on white has 21:1 ratio
    });

    it('should calculate contrast ratio between similar colors', () => {
      const ratio = getContrastRatio('#F5F5F5', '#E5E5E5');
      expect(ratio).toBeLessThan(2); // Very similar colors have low contrast
    });
  });

  describe('WCAG Compliance', () => {
    it('should validate WCAG AA compliance correctly', () => {
      // Black on white should pass
      expect(meetsWCAGAA('#000000', '#FFFFFF')).toBe(true);
      
      // Very light gray on white should fail
      expect(meetsWCAGAA('#F5F5F5', '#FFFFFF')).toBe(false);
      
      // Large text has lower requirements
      expect(meetsWCAGAA('#737373', '#FFFFFF', true)).toBe(true);
    });

    it('should validate WCAG AAA compliance correctly', () => {
      // Black on white should pass AAA
      expect(meetsWCAGAAA('#000000', '#FFFFFF')).toBe(true);
      
      // Medium gray on white might pass AA but not AAA
      expect(meetsWCAGAAA('#737373', '#FFFFFF')).toBe(false);
    });
  });

  describe('Theme Color Accessibility', () => {
    it('should have accessible primary text on backgrounds in light mode', () => {
      const isAccessible = meetsWCAGAA(
        lightColors.content.primary,
        lightColors.background.primary
      );
      expect(isAccessible).toBe(true);
    });

    it('should have accessible primary text on backgrounds in dark mode', () => {
      const isAccessible = meetsWCAGAA(
        darkColors.content.primary,
        darkColors.background.primary
      );
      expect(isAccessible).toBe(true);
    });

    it('should have accessible primary button colors', () => {
      // Light mode button
      const lightButtonAccessible = meetsWCAGAA(
        lightColors.content.inverse,
        lightColors.primary[500]
      );
      expect(lightButtonAccessible).toBe(true);

      // Dark mode button
      const darkButtonAccessible = meetsWCAGAA(
        darkColors.content.inverse,
        darkColors.primary[500]
      );
      expect(darkButtonAccessible).toBe(true);
    });
  });
});