/**
 * MVP TextInput Component
 * Basic text input with placeholder, error state, and theme integration
 */

import React from 'react';
import { TextInput as RNTextInput, View, Text } from 'react-native';
import type { TextInputProps as RNTextInputProps } from 'react-native';
import { useTheme } from '@/theme/mvp';

interface MVPTextInputProps extends RNTextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export const MVPTextInput: React.FC<MVPTextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  error,
  editable = true,
  ...props
}) => {
  const { theme } = useTheme();
  const textColor = theme.isDark ? '#FFFFFF' : '#000000';
  const placeholderColor = theme.isDark ? '#666666' : '#999999';
  const borderColor = error 
    ? theme.colors.error 
    : theme.isDark ? '#333333' : '#CCCCCC';
  
  return (
    <View style={{ marginVertical: 8 }}>
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        editable={editable}
        style={{
          backgroundColor: theme.colors.surface,
          color: textColor,
          borderWidth: 1,
          borderColor,
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          fontSize: 16,
          minHeight: 48,
        }}
        accessibilityRole="text"
        accessibilityLabel={placeholder}
        accessibilityHint={error ? `Error: ${error}` : 'Enter text'}
        accessibilityState={{ 
          disabled: !editable,
          selected: false
        }}
        {...props}
      />
      {error && (
        <Text
          style={{
            color: theme.colors.error,
            fontSize: 14,
            marginTop: 4,
            marginLeft: 4,
          }}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
    </View>
  );
};