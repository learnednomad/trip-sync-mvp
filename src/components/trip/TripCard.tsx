/**
 * TripCard Component
 * Displays trip information with platform-adaptive styling
 */

import React, { memo } from 'react';
import { Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import { format } from 'date-fns';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useAdaptiveTheme } from '@/hooks/useAdaptiveTheme';
import { AdaptiveCard } from '@/components/common/AdaptiveCard';
import { AdaptiveText } from '@/components/base/AdaptiveText';
import { AdaptiveView } from '@/components/base/AdaptiveView';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { Trip } from '@/types';

interface TripCardProps {
  trip: Trip;
  onPress: (trip: Trip) => void;
  testID?: string;
  isOffline?: boolean;
  isPending?: boolean;
}

export const TripCard = memo<TripCardProps>(({ 
  trip, 
  onPress, 
  testID,
  isOffline = false,
  isPending = false,
}) => {
  const { trigger } = useHapticFeedback();
  const { theme, platform } = useAdaptiveTheme();
  
  // Animation for pending state
  const opacity = useSharedValue(isPending ? 0.7 : 1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handlePress = () => {
    if (!isPending) {
      trigger(platform === 'ios' ? 'impactLight' : 'click');
      onPress(trip);
    }
  };

  // Format date range
  const formatDateRange = (start: Date, end: Date): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startFormat = format(startDate, 'MMM d');
    const endFormat = format(endDate, 'MMM d');
    const year = format(endDate, 'yyyy');
    
    if (startDate.getFullYear() === endDate.getFullYear()) {
      return `${startFormat} - ${endFormat}, ${year}`;
    } else {
      return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
    }
  };

  // Calculate trip duration
  const getTripDuration = (start: Date, end: Date): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  };

  return (
    <Animated.View style={animatedStyle}>
      <AdaptiveCard
        onPress={handlePress}
        testID={testID}
        variant={isOffline ? 'outlined' : 'elevated'}
        elevation={platform === 'android' ? 1 : undefined}
        padding="medium"
        margin="small"
        disabled={isPending}
        accessibilityLabel={`Trip to ${trip.name || 'Unnamed location'}`}
        accessibilityState={{ 
          disabled: isPending,
          selected: false,
        }}
      >
        {/* Header row */}
        <AdaptiveView direction="row" justify="between" align="start" gap="small">
          <AdaptiveView flex={1}>
            <AdaptiveView direction="row" align="center" gap="xsmall">
              <AdaptiveText 
                variant="titleMedium" 
                weight="semibold"
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                {trip.name || 'Untitled Trip'}
              </AdaptiveText>
              {trip.is_archived && (
                <AdaptiveView
                  variant="tonal"
                  padding="xxsmall"
                  borderRadius="small"
                  style={{ paddingHorizontal: 6 }}
                >
                  <AdaptiveText variant="labelSmall" color="secondary">
                    Archived
                  </AdaptiveText>
                </AdaptiveView>
              )}
            </AdaptiveView>
            
            <AdaptiveText 
              variant="bodySmall" 
              color="onSurfaceVariant"
              numberOfLines={1}
            >
              {formatDateRange(trip.start_date, trip.end_date)}
            </AdaptiveText>
          </AdaptiveView>
          
          <AdaptiveView
            variant="tonal"
            padding="small"
            borderRadius="continuous"
          >
            <AdaptiveText 
              variant="labelSmall" 
              weight="medium"
            >
              {getTripDuration(trip.start_date, trip.end_date)}
            </AdaptiveText>
          </AdaptiveView>
        </AdaptiveView>
        
        {/* Details row */}
        <AdaptiveView 
          direction="row" 
          align="center" 
          gap="medium"
          style={{ marginTop: 8 }}
        >
          {/* Members */}
          <AdaptiveView direction="row" align="center" gap="xxsmall">
            <DynamicIcon 
              name="people" 
              size="small" 
              color="onSurfaceVariant"
            />
            <AdaptiveText variant="bodySmall" color="onSurfaceVariant">
              {trip.trip_members?.length || 0} members
            </AdaptiveText>
          </AdaptiveView>
          
          {/* Expenses count (if available) */}
          {trip.expenses_count !== undefined && (
            <AdaptiveView direction="row" align="center" gap="xxsmall">
              <DynamicIcon 
                name="expense" 
                size="small" 
                color="onSurfaceVariant"
              />
              <AdaptiveText variant="bodySmall" color="onSurfaceVariant">
                {trip.expenses_count} expenses
              </AdaptiveText>
            </AdaptiveView>
          )}
        </AdaptiveView>
        
        {/* Offline/Sync status */}
        {(isOffline || isPending) && (
          <AdaptiveView 
            direction="row" 
            align="center" 
            gap="xsmall"
            style={{ marginTop: 8 }}
          >
            <DynamicIcon 
              name={isPending ? 'cloud-sync' : 'cloud-off'}
              size="small"
              color="warning"
            />
            <AdaptiveText 
              variant="labelSmall" 
              color="warning"
              weight="medium"
            >
              {isPending ? 'Syncing...' : 'Offline - Pending sync'}
            </AdaptiveText>
          </AdaptiveView>
        )}
      </AdaptiveCard>
    </Animated.View>
  );
});

TripCard.displayName = 'TripCard';