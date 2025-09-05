/**
 * MVP Typography
 * Simple 3-size text system
 */

export interface TextSize {
  fontSize: number;
  lineHeight: number;
}

export interface Typography {
  small: TextSize;
  medium: TextSize;
  large: TextSize;
}

// Text sizes as specified
export const typography: Typography = {
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
  medium: {
    fontSize: 16,
    lineHeight: 24,
  },
  large: {
    fontSize: 20,
    lineHeight: 28,
  },
};