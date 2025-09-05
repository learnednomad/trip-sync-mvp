import React from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../core/theme/colors';
import { typography } from '../../../core/theme/typography';
import { layout, getElevation, iconSize } from '../../../core/theme/tokens';

export interface TabItem {
  key: string;
  title: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface PlatformTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
  showLabels?: boolean;
  variant?: 'default' | 'compact' | 'scrollable';
}

export const PlatformTabBar: React.FC<PlatformTabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  showLabels = true,
  variant = 'default',
}) => {
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'ios') {
    return (
      <IOSTabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={onTabPress}
        showLabels={showLabels}
        variant={variant}
        insets={insets}
      />
    );
  }

  return (
    <AndroidTabBar
      tabs={tabs}
      activeTab={activeTab}
      onTabPress={onTabPress}
      showLabels={showLabels}
      variant={variant}
      insets={insets}
    />
  );
};

// iOS Tab Bar Implementation
const IOSTabBar: React.FC<PlatformTabBarProps & {
  insets: { bottom: number };
}> = ({ tabs, activeTab, onTabPress, showLabels, insets }) => {
  const containerStyle: ViewStyle = {
    backgroundColor: colors.background.secondary.light,
    borderTopWidth: 0.5,
    borderTopColor: colors.ios.separator.light,
    paddingBottom: insets.bottom,
  };

  const tabBarStyle: ViewStyle = {
    flexDirection: 'row',
    height: layout.tabBarHeight,
    alignItems: 'center',
  };

  return (
    <View style={containerStyle}>
      <View style={tabBarStyle}>
        {tabs.map((tab) => (
          <IOSTabItem
            key={tab.key}
            tab={tab}
            isActive={activeTab === tab.key}
            onPress={() => onTabPress(tab.key)}
            showLabel={showLabels}
          />
        ))}
      </View>
    </View>
  );
};

const IOSTabItem: React.FC<{
  tab: TabItem;
  isActive: boolean;
  onPress: () => void;
  showLabel: boolean;
}> = ({ tab, isActive, onPress, showLabel }) => {
  const color = isActive ? colors.ios.systemBlue : colors.ios.systemGray;

  return (
    <Pressable
      style={({ pressed }) => ({
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
        paddingTop: 6,
      })}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${tab.title} tab`}
    >
      <View style={{ marginBottom: showLabel ? 2 : 0 }}>
        {React.cloneElement(tab.icon as React.ReactElement, {
          color,
          size: iconSize.md,
        })}
      </View>
      {showLabel && (
        <Text
          style={[
            typography.caption2,
            { color, marginTop: 2 },
          ]}
        >
          {tab.title}
        </Text>
      )}
      {tab.badge && (
        <View
          style={{
            position: 'absolute',
            top: 2,
            right: '25%',
            backgroundColor: colors.ios.systemRed,
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={[typography.caption2, { color: colors.text.primary.dark }]}>
            {tab.badge}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

// Android Tab Bar Implementation
const AndroidTabBar: React.FC<PlatformTabBarProps & {
  insets: { bottom: number };
}> = ({ tabs, activeTab, onTabPress, showLabels, variant, insets }) => {
  const containerStyle: ViewStyle = {
    backgroundColor: colors.android.surface,
    paddingBottom: insets.bottom,
    ...getElevation(8),
  };

  const tabBarStyle: ViewStyle = {
    flexDirection: 'row',
    height: layout.android.appBar,
    alignItems: 'center',
  };

  return (
    <View style={containerStyle}>
      <View style={tabBarStyle}>
        {tabs.map((tab) => (
          <AndroidTabItem
            key={tab.key}
            tab={tab}
            isActive={activeTab === tab.key}
            onPress={() => onTabPress(tab.key)}
            showLabel={showLabels}
            variant={variant}
          />
        ))}
      </View>
    </View>
  );
};

const AndroidTabItem: React.FC<{
  tab: TabItem;
  isActive: boolean;
  onPress: () => void;
  showLabel: boolean;
  variant?: string;
}> = ({ tab, isActive, onPress, showLabel, variant }) => {
  const color = isActive ? colors.android.primary : colors.android.onSurfaceVariant;
  const backgroundColor = isActive
    ? colors.android.secondaryContainer
    : 'transparent';

  const indicatorStyle: ViewStyle = variant === 'compact' ? {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 3,
    backgroundColor: colors.android.primary,
    borderRadius: 1.5,
  } : {};

  return (
    <Pressable
      style={({ pressed }) => ({
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        backgroundColor: pressed ? colors.android.onSurface + '08' : backgroundColor,
        borderRadius: variant === 'compact' ? 0 : 16,
        margin: variant === 'compact' ? 0 : 4,
      })}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${tab.title} tab`}
    >
      {isActive && variant === 'compact' && <View style={indicatorStyle} />}
      <View style={{ marginBottom: showLabel ? 4 : 0 }}>
        {React.cloneElement(tab.icon as React.ReactElement, {
          color,
          size: iconSize.md,
        })}
      </View>
      {showLabel && (
        <Text
          style={[
            typography.labelSmall,
            { color },
          ]}
        >
          {tab.title}
        </Text>
      )}
      {tab.badge && (
        <View
          style={{
            position: 'absolute',
            top: 4,
            right: '20%',
            backgroundColor: colors.android.error,
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={[typography.labelSmall, { color: colors.android.onError, fontSize: 10 }]}>
            {tab.badge}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

PlatformTabBar.displayName = 'PlatformTabBar';