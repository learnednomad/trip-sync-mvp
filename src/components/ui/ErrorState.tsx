/**
 * MVP ErrorState Component
 * Simple error display with icon, message, and optional retry button
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/theme/mvp';
import { MVPButton } from './MVPButton';

interface MVPErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const MVPErrorState: React.FC<MVPErrorStateProps> = ({
  message,
  onRetry,
}) => {
  const { theme } = useTheme();
  const textColor = theme.isDark ? '#FFFFFF' : '#000000';

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        maxWidth: 400,
        alignSelf: 'center',
      }}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      {/* Error icon using X symbol for better cross-platform consistency */}
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: theme.colors.error,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
        accessibilityLabel="Error icon"
      >
        <Text
          style={{
            fontSize: 32,
            color: theme.colors.surface,
            fontWeight: 'bold',
          }}
        >
          !
        </Text>
      </View>
      
      {/* Error message */}
      <Text
        style={{
          fontSize: 16,
          color: textColor,
          textAlign: 'center',
          marginBottom: onRetry ? 20 : 0,
          lineHeight: 24,
        }}
        accessibilityLabel={`Error: ${message}`}
      >
        {message}
      </Text>
      
      {/* Optional retry button */}
      {onRetry && (
        <MVPButton onPress={onRetry}>
          Try Again
        </MVPButton>
      )}
    </View>
  );
};