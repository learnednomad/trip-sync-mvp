/**
 * MVP LoadingSpinner Component
 * Simple animated spinner with size variants
 */

import React from 'react';
import { ActivityIndicator } from 'react-native';
import type { ActivityIndicatorProps } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

interface MVPLoadingSpinnerProps extends Omit<ActivityIndicatorProps, 'color' | 'size'> {
  size?: 'small' | 'medium' | 'large';
}

export const MVPLoadingSpinner: React.FC<MVPLoadingSpinnerProps> = ({
  size = 'medium',
  ...props
}) => {
  const { theme } = useTheme();
  
  // Map sizes properly
  const getSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'medium':
        return 'large';
      case 'large':
        return 48; // Custom numeric size for extra large
      default:
        return 'large';
    }
  };

  return (
    <ActivityIndicator
      size={getSize()}
      color={theme.colors.primary}
      accessibilityLabel="Loading"
      importantForAccessibility="no-hide-descendants"
      {...props}
    />
  );
};