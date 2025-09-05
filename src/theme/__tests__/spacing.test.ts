/**
 * Spacing System Tests
 */

import {
  spacing,
  spacingCombinations,
  spacingUtilities,
  getSpacing,
  createSpacing,
  nativeWindSpacing,
} from '../spacing';

describe('Spacing System', () => {
  describe('Spacing Scale', () => {
    it('should follow 8-point grid system', () => {
      // Check that most values are multiples of 8
      const values = Object.values(spacing);
      const multiplesOf8 = values.filter(v => v === 0 || v === 4 || v % 8 === 0);
      expect(multiplesOf8.length).toBe(values.length);
    });

    it('should have correct base values', () => {
      expect(spacing[0]).toBe(0);
      expect(spacing[0.5]).toBe(4);
      expect(spacing[1]).toBe(8);
      expect(spacing[2]).toBe(16);
      expect(spacing[4]).toBe(32);
      expect(spacing[8]).toBe(64);
    });

    it('should have consistent progression', () => {
      // Check linear progression for main values
      expect(spacing[2]).toBe(spacing[1] * 2);
      expect(spacing[4]).toBe(spacing[2] * 2);
      expect(spacing[8]).toBe(spacing[4] * 2);
    });

    it('should include large values for special cases', () => {
      expect(spacing[32]).toBe(256);
      expect(spacing[64]).toBe(512);
    });
  });

  describe('Spacing Combinations', () => {
    it('should have page padding combinations', () => {
      expect(spacingCombinations.pagePadding).toEqual({
        horizontal: 16,
        vertical: 24,
      });
    });

    it('should have card padding options', () => {
      expect(spacingCombinations.cardPadding).toHaveProperty('small');
      expect(spacingCombinations.cardPadding).toHaveProperty('medium');
      expect(spacingCombinations.cardPadding).toHaveProperty('large');
    });

    it('should have appropriate gap sizes', () => {
      const { gap } = spacingCombinations;
      expect(gap.xs).toBeLessThan(gap.sm);
      expect(gap.sm).toBeLessThan(gap.md);
      expect(gap.md).toBeLessThan(gap.lg);
      expect(gap.lg).toBeLessThan(gap.xl);
    });
  });

  describe('Spacing Utilities', () => {
    it('should create padding utilities correctly', () => {
      expect(spacingUtilities.p(2)).toEqual({ padding: 16 });
      expect(spacingUtilities.px(3)).toEqual({ paddingHorizontal: 24 });
      expect(spacingUtilities.py(4)).toEqual({ paddingVertical: 32 });
      expect(spacingUtilities.pt(1)).toEqual({ paddingTop: 8 });
    });

    it('should create margin utilities correctly', () => {
      expect(spacingUtilities.m(2)).toEqual({ margin: 16 });
      expect(spacingUtilities.mx(3)).toEqual({ marginHorizontal: 24 });
      expect(spacingUtilities.my(4)).toEqual({ marginVertical: 32 });
      expect(spacingUtilities.mb(1)).toEqual({ marginBottom: 8 });
    });

    it('should create gap utilities correctly', () => {
      expect(spacingUtilities.gap(2)).toEqual({ gap: 16 });
      expect(spacingUtilities.gapX(3)).toEqual({ columnGap: 24 });
      expect(spacingUtilities.gapY(4)).toEqual({ rowGap: 32 });
    });
  });

  describe('Helper Functions', () => {
    it('should get spacing value correctly', () => {
      expect(getSpacing(0)).toBe(0);
      expect(getSpacing(2)).toBe(16);
      expect(getSpacing(8)).toBe(64);
    });

    it('should create spacing object with single value', () => {
      const result = createSpacing(2);
      expect(result).toEqual({
        top: 16,
        right: 16,
        bottom: 16,
        left: 16,
      });
    });

    it('should create spacing object with two values', () => {
      const result = createSpacing(2, 4);
      expect(result).toEqual({
        top: 16,
        right: 32,
        bottom: 16,
        left: 32,
      });
    });

    it('should create spacing object with three values', () => {
      const result = createSpacing(1, 2, 3);
      expect(result).toEqual({
        top: 8,
        right: 16,
        bottom: 24,
        left: 16,
      });
    });

    it('should create spacing object with four values', () => {
      const result = createSpacing(1, 2, 3, 4);
      expect(result).toEqual({
        top: 8,
        right: 16,
        bottom: 24,
        left: 32,
      });
    });
  });

  describe('NativeWind Spacing Classes', () => {
    it('should generate padding classes', () => {
      expect(nativeWindSpacing['p-2']).toEqual({ padding: 16 });
      expect(nativeWindSpacing['px-4']).toEqual({ paddingHorizontal: 32 });
      expect(nativeWindSpacing['py-0.5']).toEqual({ paddingVertical: 4 });
    });

    it('should generate margin classes', () => {
      expect(nativeWindSpacing['m-3']).toEqual({ margin: 24 });
      expect(nativeWindSpacing['mx-auto']).toBeUndefined(); // Auto not in our system
      expect(nativeWindSpacing['mt-6']).toEqual({ marginTop: 48 });
    });

    it('should generate gap classes', () => {
      expect(nativeWindSpacing['gap-2']).toEqual({ gap: 16 });
      expect(nativeWindSpacing['gap-x-4']).toEqual({ columnGap: 32 });
      expect(nativeWindSpacing['gap-y-1']).toEqual({ rowGap: 8 });
    });

    it('should generate dimension classes', () => {
      expect(nativeWindSpacing['w-8']).toEqual({ width: 64 });
      expect(nativeWindSpacing['h-16']).toEqual({ height: 128 });
      expect(nativeWindSpacing['min-w-32']).toEqual({ minWidth: 256 });
      expect(nativeWindSpacing['max-h-64']).toEqual({ maxHeight: 512 });
    });
  });
});