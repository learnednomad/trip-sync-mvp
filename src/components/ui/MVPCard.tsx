/**
 * MVP Card Component
 * Simple container with surface color, rounded corners, shadow/elevation
 */

import React from 'react';
import { View, Platform } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '@/theme/mvp';

interface MVPCardProps extends ViewProps {
  children: React.ReactNode;
}

export const MVPCard: React.FC<MVPCardProps> = ({ 
  children, 
  style,
  ...props 
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: 8,
          padding: 16,
          marginVertical: 8,
          marginHorizontal: 16,
          // Shadow for iOS
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              // Elevation for Android
              elevation: 4,
            },
            default: {},
          }),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};