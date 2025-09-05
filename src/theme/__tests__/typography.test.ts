/**
 * Typography System Tests
 */

import { Platform } from 'react-native';
import {
  typography,
  textStyles,
  getTypographyStyle,
  getPlatformTextStyle,
  typographyUtilities,
} from '../typography';

describe('Typography System', () => {
  describe('Typography Scale', () => {
    it('should have 7 font sizes', () => {
      const sizes = Object.keys(typography.fontSize);
      expect(sizes).toHaveLength(7);
      expect(sizes).toEqual(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']);
    });

    it('should have correct font size values', () => {
      expect(typography.fontSize.xs).toBe(12);
      expect(typography.fontSize.sm).toBe(14);
      expect(typography.fontSize.base).toBe(16);
      expect(typography.fontSize.lg).toBe(18);
      expect(typography.fontSize.xl).toBe(20);
      expect(typography.fontSize['2xl']).toBe(24);
      expect(typography.fontSize['3xl']).toBe(32);
    });

    it('should have 5 font weights', () => {
      const weights = Object.keys(typography.fontWeight);
      expect(weights).toHaveLength(5);
      expect(weights).toEqual(['light', 'regular', 'medium', 'semibold', 'bold']);
    });

    it('should have matching line heights for each font size', () => {
      const sizeKeys = Object.keys(typography.fontSize);
      const lineHeightKeys = Object.keys(typography.lineHeight);
      expect(sizeKeys).toEqual(lineHeightKeys);
    });

    it('should have appropriate line height ratios', () => {
      // Small text should have higher ratios
      expect(typography.lineHeight.xs / typography.fontSize.xs).toBeGreaterThan(1.3);
      expect(typography.lineHeight.sm / typography.fontSize.sm).toBeGreaterThan(1.4);
      
      // Large text should have lower ratios
      expect(typography.lineHeight['3xl'] / typography.fontSize['3xl']).toBeLessThan(1.3);
    });
  });

  describe('Platform-specific Fonts', () => {
    it('should use system fonts for iOS', () => {
      Platform.OS = 'ios';
      const { typography: iosTypography } = jest.requireActual('../typography');
      expect(iosTypography.fontFamily.sans).toMatch(/System/i);
    });

    it('should have mono font family', () => {
      expect(typography.fontFamily).toHaveProperty('mono');
      expect(typography.fontFamily.mono).toBeTruthy();
    });
  });

  describe('Text Styles', () => {
    it('should have all display styles', () => {
      expect(textStyles).toHaveProperty('displayLarge');
      expect(textStyles).toHaveProperty('displayMedium');
      expect(textStyles).toHaveProperty('displaySmall');
    });

    it('should have all heading styles', () => {
      expect(textStyles).toHaveProperty('headingLarge');
      expect(textStyles).toHaveProperty('headingMedium');
      expect(textStyles).toHaveProperty('headingSmall');
    });

    it('should have all body styles', () => {
      expect(textStyles).toHaveProperty('bodyLarge');
      expect(textStyles).toHaveProperty('bodyMedium');
      expect(textStyles).toHaveProperty('bodySmall');
    });

    it('should have all label styles', () => {
      expect(textStyles).toHaveProperty('labelLarge');
      expect(textStyles).toHaveProperty('labelMedium');
      expect(textStyles).toHaveProperty('labelSmall');
    });

    it('should have special styles', () => {
      expect(textStyles).toHaveProperty('button');
      expect(textStyles).toHaveProperty('caption');
      expect(textStyles).toHaveProperty('overline');
      expect(textStyles).toHaveProperty('code');
    });

    it('should use appropriate weights for different styles', () => {
      // Display styles should be bold
      expect(textStyles.displayLarge.fontWeight).toBe(typography.fontWeight.bold);
      expect(textStyles.displayMedium.fontWeight).toBe(typography.fontWeight.bold);
      
      // Body styles should be regular
      expect(textStyles.bodyMedium.fontWeight).toBe(typography.fontWeight.regular);
      
      // Labels should be medium
      expect(textStyles.labelMedium.fontWeight).toBe(typography.fontWeight.medium);
    });

    it('should use mono font for code style', () => {
      expect(textStyles.code.fontFamily).toBe(typography.fontFamily.mono);
    });

    it('should uppercase overline style', () => {
      expect(textStyles.overline.textTransform).toBe('uppercase');
    });
  });

  describe('Helper Functions', () => {
    it('should get typography style with defaults', () => {
      const style = getTypographyStyle();
      expect(style).toEqual({
        fontFamily: typography.fontFamily.sans,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.regular,
        lineHeight: typography.lineHeight.base,
      });
    });

    it('should get typography style with custom size and weight', () => {
      const style = getTypographyStyle('lg', 'semibold');
      expect(style).toEqual({
        fontFamily: typography.fontFamily.sans,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.lg,
      });
    });

    it('should apply platform-specific adjustments', () => {
      const baseStyle = getTypographyStyle('base', 'regular');
      const platformStyle = getPlatformTextStyle(baseStyle);
      
      expect(platformStyle).toHaveProperty('fontFamily');
      expect(platformStyle).toHaveProperty('fontSize');
      expect(platformStyle).toHaveProperty('fontWeight');
      expect(platformStyle).toHaveProperty('lineHeight');
    });
  });

  describe('Typography Utilities', () => {
    it('should have font size utilities', () => {
      expect(typographyUtilities).toHaveProperty('text-xs');
      expect(typographyUtilities).toHaveProperty('text-sm');
      expect(typographyUtilities).toHaveProperty('text-base');
      expect(typographyUtilities).toHaveProperty('text-lg');
      expect(typographyUtilities).toHaveProperty('text-xl');
      expect(typographyUtilities).toHaveProperty('text-2xl');
      expect(typographyUtilities).toHaveProperty('text-3xl');
    });

    it('should have font weight utilities', () => {
      expect(typographyUtilities).toHaveProperty('font-light');
      expect(typographyUtilities).toHaveProperty('font-regular');
      expect(typographyUtilities).toHaveProperty('font-medium');
      expect(typographyUtilities).toHaveProperty('font-semibold');
      expect(typographyUtilities).toHaveProperty('font-bold');
    });

    it('should have text style utilities', () => {
      expect(typographyUtilities).toHaveProperty('text-heading-large');
      expect(typographyUtilities).toHaveProperty('text-body-medium');
      expect(typographyUtilities).toHaveProperty('text-button');
    });

    it('should match text style definitions', () => {
      expect(typographyUtilities['text-heading-large']).toEqual(textStyles.headingLarge);
      expect(typographyUtilities['text-body-medium']).toEqual(textStyles.bodyMedium);
    });
  });
});