/**
 * Accessibility Testing Utilities
 * Helpers for validating theme accessibility compliance
 */

import { getContrastRatio, meetsWCAGAA, meetsWCAGAAA } from '../colors';
import { Theme } from '../types';

// WCAG compliance levels
export enum WCAGLevel {
  A = 'A',
  AA = 'AA',
  AAA = 'AAA',
}

// Text size categories for WCAG
export enum TextSize {
  Normal = 'normal',     // < 18pt or < 14pt bold
  Large = 'large',       // >= 18pt or >= 14pt bold
}

// Accessibility test result
export interface AccessibilityTestResult {
  passed: boolean;
  level: WCAGLevel;
  contrastRatio: number;
  recommendation?: string;
}

// Color pair for testing
export interface ColorPair {
  foreground: string;
  background: string;
  textSize?: TextSize;
}

// Test a single color pair
export const testColorPair = (
  pair: ColorPair,
  targetLevel: WCAGLevel = WCAGLevel.AA
): AccessibilityTestResult => {
  const { foreground, background, textSize = TextSize.Normal } = pair;
  const isLargeText = textSize === TextSize.Large;
  const ratio = getContrastRatio(foreground, background);
  
  let passed = false;
  let recommendation;
  
  switch (targetLevel) {
    case WCAGLevel.AA:
      passed = meetsWCAGAA(foreground, background, isLargeText);
      if (!passed) {
        const requiredRatio = isLargeText ? 3 : 4.5;
        recommendation = `Increase contrast to at least ${requiredRatio}:1 (current: ${ratio.toFixed(2)}:1)`;
      }
      break;
      
    case WCAGLevel.AAA:
      passed = meetsWCAGAAA(foreground, background, isLargeText);
      if (!passed) {
        const requiredRatio = isLargeText ? 4.5 : 7;
        recommendation = `Increase contrast to at least ${requiredRatio}:1 (current: ${ratio.toFixed(2)}:1)`;
      }
      break;
      
    default:
      passed = ratio >= 2; // Basic visibility
  }
  
  return {
    passed,
    level: targetLevel,
    contrastRatio: ratio,
    recommendation,
  };
};

// Test all theme color combinations
export const testThemeAccessibility = (
  theme: Theme,
  targetLevel: WCAGLevel = WCAGLevel.AA
): {
  summary: { passed: number; failed: number; total: number };
  details: Array<{ name: string; result: AccessibilityTestResult }>;
} => {
  const { colors } = theme;
  const testCases: Array<{ name: string; pair: ColorPair }> = [
    // Primary text on backgrounds
    {
      name: 'Primary text on primary background',
      pair: {
        foreground: colors.content.primary,
        background: colors.background.primary,
      },
    },
    {
      name: 'Secondary text on primary background',
      pair: {
        foreground: colors.content.secondary,
        background: colors.background.primary,
      },
    },
    {
      name: 'Tertiary text on primary background',
      pair: {
        foreground: colors.content.tertiary,
        background: colors.background.primary,
      },
    },
    
    // Text on surfaces
    {
      name: 'Primary text on surface',
      pair: {
        foreground: colors.content.primary,
        background: colors.surface.primary,
      },
    },
    {
      name: 'Primary text on elevated surface',
      pair: {
        foreground: colors.content.primary,
        background: colors.surface.elevated,
      },
    },
    
    // Button text
    {
      name: 'Button text on primary button',
      pair: {
        foreground: colors.content.inverse,
        background: colors.primary[500],
      },
    },
    {
      name: 'Button text on secondary button',
      pair: {
        foreground: colors.content.inverse,
        background: colors.secondary[500],
      },
    },
    
    // Error states
    {
      name: 'Error text on background',
      pair: {
        foreground: colors.error[600],
        background: colors.background.primary,
      },
    },
    {
      name: 'White text on error background',
      pair: {
        foreground: colors.content.inverse,
        background: colors.error[500],
      },
    },
    
    // Success states
    {
      name: 'Success text on background',
      pair: {
        foreground: colors.success[600],
        background: colors.background.primary,
      },
    },
    {
      name: 'White text on success background',
      pair: {
        foreground: colors.content.inverse,
        background: colors.success[500],
      },
    },
    
    // Warning states
    {
      name: 'Warning text on background',
      pair: {
        foreground: colors.warning[600],
        background: colors.background.primary,
      },
    },
    
    // Info states
    {
      name: 'Info text on background',
      pair: {
        foreground: colors.info[600],
        background: colors.background.primary,
      },
    },
    
    // Disabled states
    {
      name: 'Disabled text on background',
      pair: {
        foreground: colors.content.disabled,
        background: colors.background.primary,
        textSize: TextSize.Normal,
      },
    },
  ];
  
  const results = testCases.map(({ name, pair }) => ({
    name,
    result: testColorPair(pair, targetLevel),
  }));
  
  const summary = {
    passed: results.filter(r => r.result.passed).length,
    failed: results.filter(r => !r.result.passed).length,
    total: results.length,
  };
  
  return { summary, details: results };
};

// Generate accessibility report
export const generateAccessibilityReport = (
  theme: Theme,
  targetLevel: WCAGLevel = WCAGLevel.AA
): string => {
  const { summary, details } = testThemeAccessibility(theme, targetLevel);
  
  let report = `# Accessibility Report\n\n`;
  report += `Target Level: WCAG ${targetLevel}\n\n`;
  report += `## Summary\n`;
  report += `- Passed: ${summary.passed}/${summary.total} (${(summary.passed / summary.total * 100).toFixed(1)}%)\n`;
  report += `- Failed: ${summary.failed}/${summary.total}\n\n`;
  
  if (summary.failed > 0) {
    report += `## Failed Tests\n\n`;
    details
      .filter(d => !d.result.passed)
      .forEach(({ name, result }) => {
        report += `### ${name}\n`;
        report += `- Contrast Ratio: ${result.contrastRatio.toFixed(2)}:1\n`;
        if (result.recommendation) {
          report += `- Recommendation: ${result.recommendation}\n`;
        }
        report += '\n';
      });
  }
  
  report += `## All Tests\n\n`;
  details.forEach(({ name, result }) => {
    const icon = result.passed ? '✅' : '❌';
    report += `- ${icon} ${name}: ${result.contrastRatio.toFixed(2)}:1\n`;
  });
  
  return report;
};

// Touch target size validation
export const validateTouchTarget = (width: number, height: number): {
  passed: boolean;
  minSize: number;
  recommendation?: string;
} => {
  const minSize = 44; // Apple HIG minimum
  const passed = width >= minSize && height >= minSize;
  
  return {
    passed,
    minSize,
    recommendation: passed
      ? undefined
      : `Increase touch target to at least ${minSize}x${minSize}px (current: ${width}x${height}px)`,
  };
};

// Animation accessibility check
export const validateAnimation = (duration: number, essential: boolean = false): {
  passed: boolean;
  recommendation?: string;
} => {
  // Non-essential animations should be short or skippable
  if (!essential && duration > 500) {
    return {
      passed: false,
      recommendation: 'Non-essential animations should be under 500ms or skippable',
    };
  }
  
  return { passed: true };
};

// Focus indicator validation
export const validateFocusIndicator = (
  focusColor: string,
  backgroundColor: string
): AccessibilityTestResult => {
  return testColorPair(
    { foreground: focusColor, background: backgroundColor },
    WCAGLevel.AA
  );
};

// Create accessibility test suite
export const createAccessibilityTestSuite = (theme: Theme) => {
  return {
    colorContrast: () => testThemeAccessibility(theme, WCAGLevel.AA),
    colorContrastAAA: () => testThemeAccessibility(theme, WCAGLevel.AAA),
    report: () => generateAccessibilityReport(theme, WCAGLevel.AA),
    reportAAA: () => generateAccessibilityReport(theme, WCAGLevel.AAA),
  };
};