/**
 * AdaptiveInput - Platform-adaptive text input component
 * iOS: Liquid Glass background with native styling
 * Android: Material 3 filled/outlined text field
 */

import React, { useState, useRef, useCallback } from 'react';
import { 
  TextInput,
  TextInputProps,
  View,
  Platform,
  Animated,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAdaptiveTheme } from '@/hooks/useAdaptiveTheme';
import { AdaptiveText } from '@/components/base/AdaptiveText';
import { AdaptiveView } from '@/components/base/AdaptiveView';
import { DynamicIcon } from './DynamicIcon';

export interface AdaptiveInputProps extends Omit<TextInputProps, 'style'> {
  // Appearance
  variant?: 'filled' | 'outlined';
  
  // Label and helpers
  label?: string;
  helperText?: string;
  errorText?: string;
  
  // Icons
  leadingIcon?: string;
  trailingIcon?: string;
  onTrailingIconPress?: () => void;
  
  // State
  error?: boolean;
  disabled?: boolean;
  
  // Style
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const AdaptiveInput = React.forwardRef<TextInput, AdaptiveInputProps>(
  (
    {
      variant = 'outlined',
      label,
      helperText,
      errorText,
      leadingIcon,
      trailingIcon,
      onTrailingIconPress,
      error = false,
      disabled = false,
      containerStyle,
      inputStyle,
      value,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const { theme, platform, colorScheme } = useAdaptiveTheme();
    const colors = theme.colors[colorScheme];
    
    // State
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);
    
    // Animation values
    const labelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;
    const borderWidth = useRef(new Animated.Value(1)).current;
    
    // Update value state
    React.useEffect(() => {
      setHasValue(!!value);
      if (value && !isFocused) {
        Animated.timing(labelPosition, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    }, [value]);
    
    // Handle focus
    const handleFocus = useCallback((e: any) => {
      setIsFocused(true);
      
      // Animate label
      Animated.parallel([
        Animated.timing(labelPosition, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(borderWidth, {
          toValue: 2,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
      
      onFocus?.(e);
    }, [onFocus]);
    
    // Handle blur
    const handleBlur = useCallback((e: any) => {
      setIsFocused(false);
      
      // Animate label back if no value
      if (!hasValue) {
        Animated.timing(labelPosition, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
      
      Animated.timing(borderWidth, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      
      onBlur?.(e);
    }, [hasValue, onBlur]);
    
    // Get input colors
    const inputColors = {
      label: error ? colors.error : isFocused ? colors.primary : colors.onSurfaceVariant,
      border: error ? colors.error : isFocused ? colors.primary : colors.outline,
      background: variant === 'filled' 
        ? colorScheme === 'light' ? colors.surfaceVariant : colors.surfaceVariant
        : 'transparent',
      text: disabled ? colors.onSurface + '60' : colors.onSurface,
      placeholder: colors.onSurfaceVariant,
      helper: error ? colors.error : colors.onSurfaceVariant,
    };
    
    // Build container style
    const containerStyles: ViewStyle = {
      marginVertical: 8,
    };
    
    // Build input container style
    const inputContainerStyle: ViewStyle = {
      minHeight: 56,
      borderRadius: platform === 'ios' ? 12 : 4,
      backgroundColor: inputColors.background,
      paddingHorizontal: leadingIcon ? 48 : 16,
      paddingRight: trailingIcon ? 48 : 16,
      flexDirection: 'row',
      alignItems: 'center',
    };
    
    if (variant === 'outlined') {
      inputContainerStyle.borderWidth = 1;
      inputContainerStyle.borderColor = inputColors.border;
    } else if (variant === 'filled' && platform === 'android') {
      // Material 3 filled text field
      inputContainerStyle.borderBottomWidth = 1;
      inputContainerStyle.borderBottomColor = inputColors.border;
      inputContainerStyle.borderRadius = 4;
      inputContainerStyle.borderTopLeftRadius = 12;
      inputContainerStyle.borderTopRightRadius = 12;
    }
    
    // Build text input style
    const textInputStyle: TextStyle = {
      flex: 1,
      fontSize: 16,
      color: inputColors.text,
      paddingVertical: platform === 'ios' ? 16 : 12,
      ...Platform.select({
        ios: {
          fontFamily: 'System',
        },
        android: {
          fontFamily: 'Roboto',
        },
      }),
    };
    
    return (
      <View style={[containerStyles, containerStyle]}>
        <View>
          {/* Input container */}
          <Animated.View
            style={[
              inputContainerStyle,
              variant === 'outlined' && {
                borderWidth: borderWidth,
              },
            ]}
          >
            {/* Leading icon */}
            {leadingIcon && (
              <View style={{ position: 'absolute', left: 12, zIndex: 1 }}>
                <DynamicIcon
                  name={leadingIcon}
                  size={24}
                  color={inputColors.label}
                />
              </View>
            )}
            
            {/* Label */}
            {label && (
              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: leadingIcon ? 48 : 16,
                  backgroundColor: variant === 'outlined' ? colors.background : 'transparent',
                  paddingHorizontal: 4,
                  transform: [
                    {
                      translateY: labelPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, platform === 'ios' ? -28 : -24],
                      }),
                    },
                    {
                      scale: labelPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.75],
                      }),
                    },
                  ],
                }}
              >
                <AdaptiveText
                  variant="bodyLarge"
                  style={{
                    color: inputColors.label,
                  }}
                >
                  {label}
                </AdaptiveText>
              </Animated.View>
            )}
            
            {/* Text input */}
            <TextInput
              ref={ref}
              value={value}
              style={[textInputStyle, inputStyle]}
              placeholderTextColor={inputColors.placeholder}
              editable={!disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              selectionColor={colors.primary}
              {...props}
            />
            
            {/* Trailing icon */}
            {trailingIcon && (
              <Pressable
                onPress={onTrailingIconPress}
                disabled={!onTrailingIconPress}
                style={{
                  position: 'absolute',
                  right: 12,
                  padding: 4,
                }}
              >
                <DynamicIcon
                  name={trailingIcon}
                  size={24}
                  color={inputColors.label}
                />
              </Pressable>
            )}
          </Animated.View>
          
          {/* Helper/Error text */}
          {(helperText || errorText) && (
            <View style={{ paddingHorizontal: 16, paddingTop: 4 }}>
              <AdaptiveText
                variant="bodySmall"
                style={{
                  color: inputColors.helper,
                }}
              >
                {errorText || helperText}
              </AdaptiveText>
            </View>
          )}
        </View>
      </View>
    );
  }
);

AdaptiveInput.displayName = 'AdaptiveInput';