/**
 * DynamicIcon - Platform-adaptive icon component
 * Uses SF Symbols on iOS and Material Icons on Android
 */

import React from 'react';
import { Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAdaptiveTheme } from '@/hooks/useAdaptiveTheme';

export interface DynamicIconProps {
  // Icon name (will be mapped to platform-specific icon)
  name: string;
  
  // Icon properties
  size?: number | 'small' | 'medium' | 'large';
  color?: string | 'primary' | 'secondary' | 'onSurface' | 'onSurfaceVariant' | 'error' | 'success' | 'warning';
  
  // Style
  style?: any;
}

// Icon name mapping between platforms
const iconMap: Record<string, { ios: string; android: string }> = {
  // Navigation
  'back': { ios: 'chevron-back', android: 'arrow-back' },
  'forward': { ios: 'chevron-forward', android: 'arrow-forward' },
  'menu': { ios: 'menu', android: 'menu' },
  'close': { ios: 'close', android: 'close' },
  'home': { ios: 'home', android: 'home' },
  
  // Actions
  'add': { ios: 'add', android: 'add' },
  'edit': { ios: 'pencil', android: 'edit' },
  'delete': { ios: 'trash', android: 'delete' },
  'save': { ios: 'checkmark', android: 'save' },
  'share': { ios: 'share', android: 'share' },
  'search': { ios: 'search', android: 'search' },
  'filter': { ios: 'funnel', android: 'filter-list' },
  'sort': { ios: 'swap-vertical', android: 'sort' },
  
  // Status
  'check': { ios: 'checkmark', android: 'check' },
  'error': { ios: 'close-circle', android: 'error' },
  'warning': { ios: 'warning', android: 'warning' },
  'info': { ios: 'information-circle', android: 'info' },
  'success': { ios: 'checkmark-circle', android: 'check-circle' },
  
  // Media
  'camera': { ios: 'camera', android: 'camera-alt' },
  'image': { ios: 'image', android: 'image' },
  'video': { ios: 'videocam', android: 'videocam' },
  'mic': { ios: 'mic', android: 'mic' },
  
  // Communication
  'mail': { ios: 'mail', android: 'mail' },
  'call': { ios: 'call', android: 'call' },
  'chat': { ios: 'chatbubble', android: 'chat' },
  'notifications': { ios: 'notifications', android: 'notifications' },
  
  // User
  'person': { ios: 'person', android: 'person' },
  'people': { ios: 'people', android: 'people' },
  'settings': { ios: 'settings', android: 'settings' },
  
  // Trip-specific
  'trip': { ios: 'airplane', android: 'flight' },
  'expense': { ios: 'cash', android: 'attach-money' },
  'calendar': { ios: 'calendar', android: 'event' },
  'location': { ios: 'location', android: 'place' },
  'time': { ios: 'time', android: 'schedule' },
  
  // Sync status
  'cloud': { ios: 'cloud', android: 'cloud' },
  'cloud-sync': { ios: 'cloud-upload', android: 'cloud-upload' },
  'cloud-done': { ios: 'cloud-done', android: 'cloud-done' },
  'cloud-off': { ios: 'cloud-offline', android: 'cloud-off' },
  'icloud.slash': { ios: 'cloud-offline', android: 'cloud-off' },
  
  // Misc
  'more': { ios: 'ellipsis', android: 'more-vert' },
  'more-horizontal': { ios: 'ellipsis', android: 'more-horiz' },
  'refresh': { ios: 'refresh', android: 'refresh' },
  'download': { ios: 'download', android: 'download' },
  'upload': { ios: 'upload', android: 'upload' },
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  size = 'medium',
  color = 'onSurface',
  style,
}) => {
  const { theme, platform, colorScheme } = useAdaptiveTheme();
  const colors = theme.colors[colorScheme];
  
  // Get numeric size
  const numericSize = typeof size === 'number' 
    ? size 
    : size === 'small' ? 16 
    : size === 'large' ? 28 
    : 24; // medium
  
  // Get color value
  let colorValue: string;
  if (color.startsWith('#') || color.startsWith('rgb')) {
    colorValue = color;
  } else {
    switch (color) {
      case 'primary':
        colorValue = colors.primary;
        break;
      case 'secondary':
        colorValue = colors.secondary;
        break;
      case 'onSurface':
        colorValue = colors.onSurface;
        break;
      case 'onSurfaceVariant':
        colorValue = Platform.OS === 'ios'
          ? theme.ios.systemColors.secondaryLabel[colorScheme]
          : colors.onSurfaceVariant || colors.onSurface;
        break;
      case 'error':
        colorValue = colors.error;
        break;
      case 'success':
        colorValue = theme.brand.success;
        break;
      case 'warning':
        colorValue = theme.brand.warning;
        break;
      default:
        colorValue = colors.onSurface;
    }
  }
  
  // Get platform-specific icon name
  const iconMapping = iconMap[name];
  let iconName: string;
  
  if (iconMapping) {
    iconName = platform === 'ios' ? iconMapping.ios : iconMapping.android;
  } else {
    // Fallback to original name if not mapped
    iconName = name;
  }
  
  // Render platform-specific icon
  if (platform === 'ios') {
    return (
      <Ionicons
        name={iconName as any}
        size={numericSize}
        color={colorValue}
        style={style}
      />
    );
  } else {
    // Check if it's a material icon
    if (iconMapping && iconMapping.android) {
      return (
        <MaterialIcons
          name={iconMapping.android as any}
          size={numericSize}
          color={colorValue}
          style={style}
        />
      );
    }
    
    // Fallback to Ionicons for Android too
    return (
      <Ionicons
        name={iconName as any}
        size={numericSize}
        color={colorValue}
        style={style}
      />
    );
  }
};