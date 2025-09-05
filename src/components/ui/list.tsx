import React from 'react';
import type { ViewStyle } from 'react-native';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Platform,
  AccessibilityInfo,
  findNodeHandle,
} from 'react-native';
import { colors } from '../../core/theme/colors';
import { typography } from '../../core/theme/typography';
import { spacing } from '../../core/theme/tokens';

export interface ListItemData {
  id: string;
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

interface ListProps {
  data: ListItemData[];
  variant?: 'plain' | 'grouped' | 'inset';
  showSeparators?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  ListEmptyComponent?: React.ReactNode;
}

export const List: React.FC<ListProps> = ({
  data,
  variant = 'plain',
  showSeparators = true,
  onRefresh,
  refreshing = false,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
}) => {
  const renderItem = ({ item, index }: { item: ListItemData; index: number }) => (
    <ListItem
      {...item}
      isFirst={index === 0}
      isLast={index === data.length - 1}
      variant={variant}
      showSeparator={showSeparators && index < data.length - 1}
    />
  );

  const keyExtractor = (item: ListItemData) => item.id;

  const getContentContainerStyle = (): ViewStyle => {
    if (variant === 'grouped' && Platform.OS === 'ios') {
      return {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
      };
    }
    return {};
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={getContentContainerStyle()}
      ItemSeparatorComponent={showSeparators ? ListSeparator : null}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      onRefresh={onRefresh}
      refreshing={refreshing}
      accessibilityRole="list"
      accessibilityLabel="List of items"
    />
  );
};

interface ListItemProps extends ListItemData {
  isFirst: boolean;
  isLast: boolean;
  variant: 'plain' | 'grouped' | 'inset';
  showSeparator: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  disabled = false,
  isFirst,
  isLast,
  variant,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const ref = React.useRef<View>(null);

  const handlePress = () => {
    // Announce selection to screen readers
    const label = accessibilityLabel || title;
    AccessibilityInfo.announceForAccessibility(`${label} selected`);
    
    // Focus management for accessibility
    if (ref.current) {
      const handle = findNodeHandle(ref.current);
      if (handle) {
        AccessibilityInfo.setAccessibilityFocus(handle);
      }
    }

    onPress?.();
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: Platform.OS === 'ios' ? 44 : 56,
      paddingHorizontal: variant === 'inset' ? spacing.xl : spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.background.primary.light,
    };

    if (variant === 'grouped' && Platform.OS === 'ios') {
      return {
        ...baseStyle,
        backgroundColor: colors.background.elevated.light,
        borderTopLeftRadius: isFirst ? 12 : 0,
        borderTopRightRadius: isFirst ? 12 : 0,
        borderBottomLeftRadius: isLast ? 12 : 0,
        borderBottomRightRadius: isLast ? 12 : 0,
      };
    }

    return baseStyle;
  };

  const content = (
    <>
      {leading && (
        <View style={{ marginRight: spacing.md }} accessibilityElementsHidden>
          {leading}
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text
          style={[
            Platform.OS === 'ios' ? typography.body : typography.bodyLarge,
            { color: disabled ? colors.text.tertiary.light : colors.text.primary.light },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              Platform.OS === 'ios' ? typography.footnote : typography.bodySmall,
              { color: colors.text.secondary.light, marginTop: 2 },
            ]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {trailing && (
        <View style={{ marginLeft: spacing.md }} accessibilityElementsHidden>
          {trailing}
        </View>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        ref={ref}
        onPress={disabled ? undefined : handlePress}
        style={({ pressed }) => [
          getContainerStyle(),
          pressed && { opacity: 0.7 },
        ]}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint || `Tap to select ${title}`}
        accessibilityState={{
          disabled,
        }}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      ref={ref}
      style={getContainerStyle()}
      accessibilityRole="text"
      accessibilityLabel={`${title}${subtitle ? `, ${subtitle}` : ''}`}
    >
      {content}
    </View>
  );
};

const ListSeparator: React.FC = () => {
  if (Platform.OS === 'ios') {
    return (
      <View
        style={{
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.ios.separator.light,
          marginLeft: spacing.md,
        }}
        accessibilityElementsHidden
      />
    );
  }

  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.android.outlineVariant,
      }}
      accessibilityElementsHidden
    />
  );
};

// Export additional list components for convenience
export const ListSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <View accessibilityRole="region" accessibilityLabel={`${title} section`}>
    <Text
      style={[
        Platform.OS === 'ios' ? typography.footnote : typography.labelMedium,
        {
          color: colors.text.secondary.light,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          textTransform: Platform.OS === 'ios' ? 'uppercase' : 'none',
        },
      ]}
      accessibilityRole="header"
    >
      {title}
    </Text>
    {children}
  </View>
);

List.displayName = 'List';
ListItem.displayName = 'ListItem';
ListSection.displayName = 'ListSection';