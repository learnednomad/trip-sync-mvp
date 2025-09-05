import React from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../../core/theme/colors';
import { typography } from '../../../core/theme/typography';
import { layout, getElevation } from '../../../core/theme/tokens';

interface PlatformHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonLabel?: string;
  rightButton?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'plain';
  };
  transparent?: boolean;
  largeTitle?: boolean; // iOS only
  variant?: 'standard' | 'transparent' | 'blur';
}

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  backButtonLabel,
  rightButton,
  transparent = false,
  largeTitle = false,
  variant = 'standard',
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  if (Platform.OS === 'ios') {
    return (
      <IOSHeader
        title={title}
        subtitle={subtitle}
        showBackButton={showBackButton}
        backButtonLabel={backButtonLabel}
        rightButton={rightButton}
        transparent={transparent}
        largeTitle={largeTitle}
        variant={variant}
        insets={insets}
        onBack={handleBack}
      />
    );
  }

  return (
    <AndroidHeader
      title={title}
      subtitle={subtitle}
      showBackButton={showBackButton}
      rightButton={rightButton}
      transparent={transparent}
      variant={variant}
      insets={insets}
      onBack={handleBack}
    />
  );
};

// iOS Header Implementation
const IOSHeader: React.FC<PlatformHeaderProps & {
  insets: { top: number };
  onBack: () => void;
}> = ({
  title,
  subtitle,
  showBackButton,
  backButtonLabel = 'Back',
  rightButton,
  transparent,
  largeTitle,
  variant,
  insets,
  onBack,
}) => {
  const containerStyle: ViewStyle = {
    paddingTop: insets.top,
    backgroundColor: transparent ? 'transparent' : colors.background.primary.light,
    borderBottomWidth: variant === 'standard' ? StyleSheet.hairlineWidth : 0,
    borderBottomColor: colors.ios.separator.light,
  };

  const navigationBarStyle: ViewStyle = {
    height: layout.ios.largeTitle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  };

  const titleStyle: TextStyle = largeTitle
    ? typography.largeTitle
    : typography.headline;

  return (
    <View style={containerStyle}>
      <View style={navigationBarStyle}>
        {/* Left Button */}
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          {showBackButton && (
            <Pressable
              onPress={onBack}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                opacity: pressed ? 0.5 : 1,
              })}
              accessibilityRole="button"
              accessibilityLabel={`Go back to ${backButtonLabel}`}
            >
              <Text style={[{ color: colors.ios.systemBlue }, typography.body]}>
                ‹ {backButtonLabel}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Center Title */}
        {!largeTitle && (
          <View style={{ flex: 2, alignItems: 'center' }}>
            <Text 
              style={[titleStyle, { color: colors.text.primary.light }]}
              numberOfLines={1}
              accessibilityRole="header"
            >
              {title}
            </Text>
            {subtitle && (
              <Text 
                style={[typography.footnote, { color: colors.text.secondary.light }]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        )}

        {/* Right Button */}
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          {rightButton && (
            <Pressable
              onPress={rightButton.onPress}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
              accessibilityRole="button"
            >
              <Text
                style={[
                  typography.body,
                  {
                    color:
                      rightButton.variant === 'plain'
                        ? colors.text.primary.light
                        : colors.ios.systemBlue,
                    fontWeight: rightButton.variant === 'plain' ? '400' : '600',
                  },
                ]}
              >
                {rightButton.label}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Large Title */}
      {largeTitle && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text 
            style={[typography.largeTitle, { color: colors.text.primary.light }]}
            accessibilityRole="header"
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={[typography.subheadline, { color: colors.text.secondary.light }]}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

// Android Header Implementation
const AndroidHeader: React.FC<PlatformHeaderProps & {
  insets: { top: number };
  onBack: () => void;
}> = ({
  title,
  subtitle,
  showBackButton,
  rightButton,
  transparent,
  variant,
  insets,
  onBack,
}) => {
  const containerStyle: ViewStyle = {
    paddingTop: insets.top,
    backgroundColor: transparent ? 'transparent' : colors.android.surface,
    height: layout.android.appBar + insets.top,
    ...getElevation(variant === 'standard' ? 4 : 0),
  };

  const toolbarStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  };

  return (
    <View style={containerStyle}>
      <View style={toolbarStyle}>
        {/* Navigation Icon */}
        {showBackButton && (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => ({
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: -12,
              borderRadius: 24,
              backgroundColor: pressed ? colors.android.onSurfaceVariant + '20' : 'transparent',
            })}
            accessibilityRole="button"
            accessibilityLabel="Navigate back"
          >
            <Text style={{ fontSize: 24, color: colors.android.onSurface }}>←</Text>
          </Pressable>
        )}

        {/* Title */}
        <View style={{ flex: 1, marginLeft: showBackButton ? 16 : 0 }}>
          <Text
            style={[
              typography.titleLarge,
              { color: colors.android.onSurface },
            ]}
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                typography.bodySmall,
                { color: colors.android.onSurfaceVariant },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Action Button */}
        {rightButton && (
          <Pressable
            onPress={rightButton.onPress}
            style={({ pressed }) => ({
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: pressed
                ? colors.android.primaryContainer
                : rightButton.variant === 'primary'
                ? colors.android.primary
                : 'transparent',
            })}
            accessibilityRole="button"
          >
            <Text
              style={[
                typography.labelLarge,
                {
                  color:
                    rightButton.variant === 'primary'
                      ? colors.android.onPrimary
                      : colors.android.primary,
                },
              ]}
            >
              {rightButton.label}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

PlatformHeader.displayName = 'PlatformHeader';