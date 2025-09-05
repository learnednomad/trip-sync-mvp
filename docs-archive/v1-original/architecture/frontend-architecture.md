# Frontend Architecture

## Component Architecture

### Component Organization
```text
src/
├── design/                 # Design system core
│   ├── tokens/             # Design tokens
│   │   ├── index.ts
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── adaptive.ts
│   ├── theme/              # Theme configuration
│   │   ├── DynamicTheme.ts
│   │   ├── ios/
│   │   │   └── LiquidGlass.ts
│   │   └── android/
│   │       └── Material3.ts
│   └── motion/             # Animation system
│       ├── adaptiveMotion.ts
│       └── gestureAnimations.ts
├── components/
│   ├── base/               # Base adaptive components
│   │   ├── BaseComponent.tsx
│   │   ├── AdaptiveView.tsx
│   │   └── AdaptiveText.tsx
│   ├── common/             # Shared UI components
│   │   ├── AdaptiveButton.tsx
│   │   ├── AdaptiveInput.tsx
│   │   ├── AdaptiveCard.tsx
│   │   ├── AdaptiveModal.tsx
│   │   └── DynamicIcon.tsx
│   ├── ios/                # iOS-specific components
│   │   ├── LiquidGlassView.tsx
│   │   ├── LiquidGlassCard.tsx
│   │   └── IOSControls.tsx
│   ├── android/            # Android-specific components
│   │   ├── Material3Container.tsx
│   │   ├── ExpressiveCard.tsx
│   │   └── MaterialControls.tsx
│   ├── trip/               # Trip-specific components
│   │   ├── TripCard.tsx
│   │   ├── TripTimeline.tsx
│   │   └── TripMemberList.tsx
│   ├── expense/            # Expense components
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseCard.tsx
│   │   └── SplitCalculator.tsx
│   └── layout/             # Layout components
│       ├── AdaptiveScreen.tsx
│       ├── AdaptiveHeader.tsx
│       ├── AdaptiveTabBar.tsx
│       └── OfflineIndicator.tsx
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useOfflineSync.ts
│   ├── useTrip.ts
│   ├── useTheme.ts
│   ├── useAdaptiveTheme.ts
│   ├── useHapticFeedback.ts
│   └── useSystemColors.ts
├── providers/              # Context providers
│   ├── ThemeProvider.tsx
│   ├── MotionProvider.tsx
│   └── AccessibilityProvider.tsx
├── services/              # API and external services
│   ├── supabase.ts
│   ├── storage.ts
│   └── sync.ts
└── stores/                # Zustand stores
    ├── authStore.ts
    ├── tripStore.ts
    ├── syncStore.ts
    └── themeStore.ts
```

### Component Template (Adaptive Design System)
```typescript
import React, { memo } from 'react';
import { Platform } from 'react-native';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useAdaptiveTheme } from '@/hooks/useAdaptiveTheme';
import { AdaptiveCard } from '@/components/common/AdaptiveCard';
import { AdaptiveText } from '@/components/base/AdaptiveText';
import { AdaptiveView } from '@/components/base/AdaptiveView';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { adaptiveMotion } from '@/design/motion/adaptiveMotion';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface TripCardProps {
  trip: Trip;
  onPress: (trip: Trip) => void;
  testID?: string;
  isOffline?: boolean;
}

export const TripCard = memo<TripCardProps>(({ 
  trip, 
  onPress, 
  testID,
  isOffline = false 
}) => {
  const { trigger } = useHapticFeedback();
  const { theme, platform } = useAdaptiveTheme();

  const handlePress = () => {
    // Platform-specific haptic feedback
    trigger(platform === 'ios' ? 'impactLight' : 'click');
    onPress(trip);
  };

  // Platform-specific animations
  const animatedStyle = useAnimatedStyle(() => {
    if (platform === 'ios') {
      return adaptiveMotion.iosSpring({
        transform: [{ scale: withSpring(1, { damping: 20 }) }],
      });
    } else {
      return adaptiveMotion.material3Emphasized({
        elevation: withSpring(isOffline ? 0 : 1),
      });
    }
  });

  return (
    <Animated.View style={animatedStyle}>
      <AdaptiveCard
        onPress={handlePress}
        testID={testID}
        elevation={platform === 'android' ? 1 : undefined}
        variant="surface"
        padding="medium"
        accessibilityLabel={`Trip to ${trip.name}`}
        accessibilityRole="button"
        accessibilityState={{ 
          disabled: isOffline,
          expanded: false 
        }}
      >
        <AdaptiveView direction="row" justify="between" align="start">
          <AdaptiveView flex={1} gap="small">
            <AdaptiveText 
              variant="titleMedium" 
              weight="semibold"
              numberOfLines={1}
              adaptive
            >
              {trip.name}
            </AdaptiveText>
            <AdaptiveText 
              variant="bodySmall" 
              color="secondary"
              numberOfLines={1}
            >
              {formatDateRange(trip.startDate, trip.endDate)}
            </AdaptiveText>
            {isOffline && (
              <AdaptiveView direction="row" align="center" gap="xsmall">
                <DynamicIcon 
                  name={platform === 'ios' ? 'icloud.slash' : 'cloud-off'}
                  size="small"
                  color="warning"
                />
                <AdaptiveText variant="labelSmall" color="warning">
                  Offline - Pending sync
                </AdaptiveText>
              </AdaptiveView>
            )}
          </AdaptiveView>
          
          {trip.memberCount && (
            <AdaptiveView
              variant="tonal"
              padding="small"
              borderRadius={platform === 'ios' ? 'continuous' : 'medium'}
              backgroundColor={theme.colors.primary.container}
            >
              <AdaptiveText 
                variant="labelSmall" 
                color="onPrimaryContainer"
                weight="medium"
              >
                {trip.memberCount} members
              </AdaptiveText>
            </AdaptiveView>
          )}
        </AdaptiveView>
      </AdaptiveCard>
    </Animated.View>
  );
});

TripCard.displayName = 'TripCard';

// Utility function for platform-aware date formatting
function formatDateRange(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: startDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  };
  
  const start = startDate.toLocaleDateString(undefined, options);
  const end = endDate.toLocaleDateString(undefined, options);
  
  return `${start} - ${end}`;
}
```

## State Management Architecture

### State Structure
```typescript
// stores/types.ts
interface AppState {
  // Auth State
  auth: {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    error: string | null;
  };
  
  // Trip State
  trips: {
    items: Trip[];
    currentTrip: Trip | null;
    isLoading: boolean;
    error: string | null;
  };
  
  // Expense State
  expenses: {
    byTripId: Record<string, Expense[]>;
    isLoading: boolean;
    error: string | null;
  };
  
  // Sync State
  sync: {
    pendingOperations: SyncOperation[];
    lastSyncTime: Date | null;
    isSyncing: boolean;
    conflicts: Conflict[];
  };
}
```

### State Management Patterns
- **Zustand for Local State**: Auth, UI state, offline queue
- **TanStack Query for Server State**: Trips, expenses, activities with caching
- **MMKV for Persistence**: Offline data and user preferences
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Subscription Management**: Real-time updates via Supabase Realtime

## Routing Architecture

### Route Organization
```text
app/
├── (auth)/
│   ├── _layout.tsx         # Auth layout wrapper
│   ├── sign-in.tsx         # Sign in screen
│   ├── sign-up.tsx         # Sign up screen
│   └── forgot-password.tsx # Password reset
├── (app)/
│   ├── _layout.tsx         # Main app layout with tabs
│   ├── (tabs)/
│   │   ├── _layout.tsx     # Tab navigator
│   │   ├── trips/
│   │   │   ├── index.tsx   # Trips list
│   │   │   └── [id].tsx    # Trip details
│   │   ├── expenses.tsx    # Expenses overview
│   │   └── profile.tsx     # User profile
│   └── modal/
│       ├── add-expense.tsx  # Add expense modal
│       └── add-trip.tsx     # Create trip modal
└── _layout.tsx             # Root layout
```

### Protected Route Pattern
```typescript
// app/(app)/_layout.tsx
import { useAuth } from '@/hooks/useAuth';
import { Redirect, Stack } from 'expo-router';
import { SplashScreen } from '@/components/SplashScreen';

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
```

## Design System Integration

### Adaptive Design Approach
The application implements a unified design system that adapts to platform conventions:
- **iOS**: Follows iOS 18 Human Interface Guidelines with Liquid Glass materials
- **Android**: Implements Material Design 3 (Material You) with dynamic theming

### Key Design Features

#### Dynamic Color System
- Extracts colors from system settings (iOS accent color, Android Material You)
- Generates platform-specific color palettes maintaining brand consistency
- Supports light/dark mode with elevated surface variations

#### Platform-Specific Components
```typescript
// Example: Adaptive component usage
<AdaptiveButton
  variant="filled"
  size="medium"
  onPress={handleSubmit}
>
  Continue
</AdaptiveButton>

// Renders as:
// iOS: LiquidGlassView with spring animations
// Android: Material3Container with ripple effects
```

#### Motion & Animation
- **iOS**: Spring-based animations with rubber band effects
- **Android**: Material 3 emphasized motion with duration-based timing
- **Reduced Motion**: Respects system accessibility settings

#### Typography & Spacing
- Uses platform-native font stacks
- Responsive sizing based on system text size preferences  
- Consistent spacing tokens across platforms

### Design System Architecture
See [Design System Architecture](./design-system-architecture.md) for detailed implementation guidelines.

## Frontend Services Layer

### API Client Setup
```typescript
// services/api.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: {
        async getItem(key: string) {
          return storage.getString(key) || null;
        },
        async setItem(key: string, value: string) {
          storage.set(key, value);
        },
        async removeItem(key: string) {
          storage.delete(key);
        },
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Add request/response interceptors for offline support
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    // Update stored session
    storage.set('supabase.auth.token', JSON.stringify(session));
  }
});

export { supabase };
```

### Service Example
```typescript
// services/trips.ts
import { supabase } from './api';
import { syncStore } from '@/stores/syncStore';
import { Trip, TripInput } from '@/types';

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        trip_members!inner(
          user:user_profiles(*)
        )
      `)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createTrip(input: TripInput): Promise<Trip> {
    // Optimistic update
    const tempId = `temp_${Date.now()}`;
    const optimisticTrip = { ...input, id: tempId };
    
    // Add to sync queue if offline
    if (!navigator.onLine) {
      syncStore.addOperation({
        type: 'CREATE_TRIP',
        data: optimisticTrip,
        timestamp: new Date(),
      });
      return optimisticTrip as Trip;
    }

    const { data, error } = await supabase
      .from('trips')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  subscribeToTrip(tripId: string, callback: (trip: Trip) => void) {
    return supabase
      .channel(`trip:${tripId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trips', filter: `id=eq.${tripId}` },
        (payload) => callback(payload.new as Trip)
      )
      .subscribe();
  },
};
```
