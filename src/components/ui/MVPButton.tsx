/**
 * MVP Button Component
 * Simple button with primary style, loading and disabled states
 */

import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import type { PressableProps } from 'react-native';
import { useTheme } from '@/theme/mvp';

interface MVPButtonProps extends Omit<PressableProps, 'children'> {
  onPress?: () => void;
  children: string;
  loading?: boolean;
  disabled?: boolean;
}

export const MVPButton: React.FC<MVPButtonProps> = ({
  onPress,
  children,
  loading = false,
  disabled = false,
  ...props
}) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  // Ensure children is a string
  if (typeof children !== 'string') {
    console.warn('MVPButton: children must be a string');
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          backgroundColor: theme.colors.primary,
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48,
          opacity: pressed ? 0.8 : isDisabled ? 0.5 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={children}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityHint={isDisabled ? undefined : 'Double tap to activate'}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={theme.colors.surface}
          importantForAccessibility="no"
        />
      ) : (
        <Text
          style={{
            color: theme.colors.surface,
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};