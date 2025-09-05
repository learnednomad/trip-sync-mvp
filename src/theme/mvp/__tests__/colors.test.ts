/**
 * MVP Theme Colors Tests
 */

import { lightColors, darkColors, getThemeColors, contrastValidation } from '../colors';

describe('MVP Theme Colors', () => {
  describe('Light Theme Colors', () => {
    it('should have all required color properties', () => {
      expect(lightColors).toHaveProperty('primary', '#007AFF');
      expect(lightColors).toHaveProperty('surface', '#FFFFFF');
      expect(lightColors).toHaveProperty('background', '#F2F2F7');
      expect(lightColors).toHaveProperty('error', '#FF3B30');
    });

    it('should have exactly 4 colors', () => {
      expect(Object.keys(lightColors)).toHaveLength(4);
    });
  });

  describe('Dark Theme Colors', () => {
    it('should have all required color properties', () => {
      expect(darkColors).toHaveProperty('primary', '#0A84FF');
      expect(darkColors).toHaveProperty('surface', '#1C1C1E');
      expect(darkColors).toHaveProperty('background', '#000000');
      expect(darkColors).toHaveProperty('error', '#FF453A');
    });

    it('should have exactly 4 colors', () => {
      expect(Object.keys(darkColors)).toHaveLength(4);
    });
  });

  describe('getThemeColors', () => {
    it('should return light colors when isDark is false', () => {
      expect(getThemeColors(false)).toBe(lightColors);
    });

    it('should return dark colors when isDark is true', () => {
      expect(getThemeColors(true)).toBe(darkColors);
    });
  });

  describe('Contrast Validation', () => {
    it('should have all contrast pairs validated for light theme', () => {
      expect(contrastValidation.light.primaryOnBackground).toBe(true);
      expect(contrastValidation.light.primaryOnSurface).toBe(true);
      expect(contrastValidation.light.errorOnBackground).toBe(true);
      expect(contrastValidation.light.errorOnSurface).toBe(true);
    });

    it('should have all contrast pairs validated for dark theme', () => {
      expect(contrastValidation.dark.primaryOnBackground).toBe(true);
      expect(contrastValidation.dark.primaryOnSurface).toBe(true);
      expect(contrastValidation.dark.errorOnBackground).toBe(true);
      expect(contrastValidation.dark.errorOnSurface).toBe(true);
    });
  });
});