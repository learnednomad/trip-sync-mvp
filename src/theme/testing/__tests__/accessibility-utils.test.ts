/**
 * Accessibility Utilities Tests
 */

import {
  WCAGLevel,
  TextSize,
  testColorPair,
  testThemeAccessibility,
  generateAccessibilityReport,
  validateTouchTarget,
  validateAnimation,
  validateFocusIndicator,
  createAccessibilityTestSuite,
} from '../accessibility-utils';
import { createMockTheme } from '../theme-test-utils';

describe('Accessibility Utilities', () => {
  describe('testColorPair', () => {
    it('should pass WCAG AA for black on white', () => {
      const result = testColorPair({
        foreground: '#000000',
        background: '#FFFFFF',
      });
      
      expect(result.passed).toBe(true);
      expect(result.level).toBe(WCAGLevel.AA);
      expect(result.contrastRatio).toBeGreaterThan(21);
    });

    it('should fail WCAG AA for light gray on white', () => {
      const result = testColorPair({
        foreground: '#CCCCCC',
        background: '#FFFFFF',
      });
      
      expect(result.passed).toBe(false);
      expect(result.recommendation).toBeDefined();
    });

    it('should have different requirements for large text', () => {
      const normalResult = testColorPair({
        foreground: '#666666',
        background: '#FFFFFF',
        textSize: TextSize.Normal,
      });
      
      const largeResult = testColorPair({
        foreground: '#666666',
        background: '#FFFFFF',
        textSize: TextSize.Large,
      });
      
      // Large text has lower contrast requirements
      expect(largeResult.passed).toBe(true);
      expect(normalResult.passed).toBe(false);
    });

    it('should test WCAG AAA compliance', () => {
      const result = testColorPair(
        {
          foreground: '#666666',
          background: '#FFFFFF',
        },
        WCAGLevel.AAA
      );
      
      expect(result.passed).toBe(false);
      expect(result.level).toBe(WCAGLevel.AAA);
    });
  });

  describe('testThemeAccessibility', () => {
    it('should test all theme color combinations', () => {
      const theme = createMockTheme('light');
      const { summary, details } = testThemeAccessibility(theme);
      
      expect(summary.total).toBeGreaterThan(10);
      expect(details).toHaveLength(summary.total);
    });

    it('should identify failing color combinations', () => {
      const theme = createMockTheme('light');
      // Make disabled text too light
      theme.colors.content.disabled = '#F0F0F0';
      
      const { summary, details } = testThemeAccessibility(theme);
      
      const disabledTest = details.find(d => d.name.includes('Disabled text'));
      expect(disabledTest?.result.passed).toBe(false);
      expect(summary.failed).toBeGreaterThan(0);
    });

    it('should test dark theme accessibility', () => {
      const theme = createMockTheme('dark');
      const { summary } = testThemeAccessibility(theme);
      
      // Dark theme should also have good accessibility
      expect(summary.passed / summary.total).toBeGreaterThan(0.9);
    });

    it('should test high contrast theme accessibility', () => {
      const theme = createMockTheme('light', true);
      const { summary } = testThemeAccessibility(theme);
      
      // High contrast theme should pass all tests
      expect(summary.passed).toBe(summary.total);
    });
  });

  describe('generateAccessibilityReport', () => {
    it('should generate markdown report', () => {
      const theme = createMockTheme('light');
      const report = generateAccessibilityReport(theme);
      
      expect(report).toContain('# Accessibility Report');
      expect(report).toContain('Target Level: WCAG AA');
      expect(report).toContain('## Summary');
      expect(report).toContain('## All Tests');
    });

    it('should include failed tests section when failures exist', () => {
      const theme = createMockTheme('light');
      theme.colors.content.disabled = '#F0F0F0'; // Too light
      
      const report = generateAccessibilityReport(theme);
      
      expect(report).toContain('## Failed Tests');
      expect(report).toContain('Recommendation:');
    });

    it('should generate AAA level report', () => {
      const theme = createMockTheme('light');
      const report = generateAccessibilityReport(theme, WCAGLevel.AAA);
      
      expect(report).toContain('Target Level: WCAG AAA');
    });
  });

  describe('validateTouchTarget', () => {
    it('should pass for adequate touch targets', () => {
      const result = validateTouchTarget(44, 44);
      
      expect(result.passed).toBe(true);
      expect(result.minSize).toBe(44);
      expect(result.recommendation).toBeUndefined();
    });

    it('should fail for small touch targets', () => {
      const result = validateTouchTarget(30, 30);
      
      expect(result.passed).toBe(false);
      expect(result.recommendation).toContain('44x44px');
    });

    it('should fail if either dimension is too small', () => {
      const result = validateTouchTarget(44, 30);
      
      expect(result.passed).toBe(false);
    });
  });

  describe('validateAnimation', () => {
    it('should pass for short non-essential animations', () => {
      const result = validateAnimation(300, false);
      
      expect(result.passed).toBe(true);
      expect(result.recommendation).toBeUndefined();
    });

    it('should fail for long non-essential animations', () => {
      const result = validateAnimation(1000, false);
      
      expect(result.passed).toBe(false);
      expect(result.recommendation).toContain('500ms');
    });

    it('should pass for essential animations regardless of duration', () => {
      const result = validateAnimation(1000, true);
      
      expect(result.passed).toBe(true);
    });
  });

  describe('validateFocusIndicator', () => {
    it('should validate focus indicator contrast', () => {
      const result = validateFocusIndicator('#0066CC', '#FFFFFF');
      
      expect(result.passed).toBe(true);
      expect(result.contrastRatio).toBeGreaterThan(4.5);
    });

    it('should fail for insufficient focus contrast', () => {
      const result = validateFocusIndicator('#CCCCCC', '#FFFFFF');
      
      expect(result.passed).toBe(false);
    });
  });

  describe('createAccessibilityTestSuite', () => {
    it('should create test suite with all test methods', () => {
      const theme = createMockTheme('light');
      const suite = createAccessibilityTestSuite(theme);
      
      expect(suite).toHaveProperty('colorContrast');
      expect(suite).toHaveProperty('colorContrastAAA');
      expect(suite).toHaveProperty('report');
      expect(suite).toHaveProperty('reportAAA');
    });

    it('should run color contrast tests', () => {
      const theme = createMockTheme('light');
      const suite = createAccessibilityTestSuite(theme);
      
      const result = suite.colorContrast();
      expect(result.summary).toBeDefined();
      expect(result.details).toBeDefined();
    });

    it('should generate reports', () => {
      const theme = createMockTheme('light');
      const suite = createAccessibilityTestSuite(theme);
      
      const report = suite.report();
      expect(report).toContain('# Accessibility Report');
      
      const reportAAA = suite.reportAAA();
      expect(reportAAA).toContain('WCAG AAA');
    });
  });
});