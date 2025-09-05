/**
 * MVP Typography Tests
 */

import { typography } from '../typography';

describe('MVP Typography', () => {
  it('should have exactly 3 text sizes', () => {
    expect(Object.keys(typography)).toHaveLength(3);
    expect(typography).toHaveProperty('small');
    expect(typography).toHaveProperty('medium');
    expect(typography).toHaveProperty('large');
  });

  describe('Text Sizes', () => {
    it('should have correct small text size', () => {
      expect(typography.small).toEqual({
        fontSize: 14,
        lineHeight: 20,
      });
    });

    it('should have correct medium text size', () => {
      expect(typography.medium).toEqual({
        fontSize: 16,
        lineHeight: 24,
      });
    });

    it('should have correct large text size', () => {
      expect(typography.large).toEqual({
        fontSize: 20,
        lineHeight: 28,
      });
    });
  });

  it('should have appropriate line height ratios', () => {
    // Line height should be approximately 1.4-1.5x font size
    expect(typography.small.lineHeight / typography.small.fontSize).toBeCloseTo(1.43, 1);
    expect(typography.medium.lineHeight / typography.medium.fontSize).toBe(1.5);
    expect(typography.large.lineHeight / typography.large.fontSize).toBe(1.4);
  });
});