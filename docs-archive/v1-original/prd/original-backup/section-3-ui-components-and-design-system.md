# Section 3: UI Components and Design System

## Platform-Specific Design Guidelines

### iOS Design System (iOS 17/18)
```typescript
// iOS Native Components
interface IOSDesignSystem {
  // Navigation
  navigation: {
    style: 'large-title' | 'standard';
    searchBar: {
      placement: 'navigationBar' | 'automatic';
      showsScopeBar: boolean;
    };
  };
  
  // SF Symbols 5
  icons: {
    weight: 'ultraLight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
    scale: 'small' | 'medium' | 'large';
    renderingMode: 'monochrome' | 'hierarchical' | 'palette' | 'multicolor';
  };
  
  // iOS 17+ Features
  widgets: {
    interactiveWidgets: boolean;
    standbyMode: boolean;
    dynamicIsland: boolean;
  };
}
```

### Android Material 3 Design
```typescript
// Material You Components
interface MaterialDesignSystem {
  // Dynamic Color
  colorScheme: {
    source: 'wallpaper' | 'content' | 'custom';
    variant: 'tonal' | 'vibrant' | 'expressive' | 'neutral';
  };
  
  // Material 3 Components
  components: {
    navigationBar: 'bottom' | 'rail' | 'drawer';
    fab: {
      size: 'small' | 'regular' | 'large';
      variant: 'surface' | 'primary' | 'secondary' | 'tertiary';
    };
  };
}
```

## Core UI Components

### Trip Card Component
```typescript
interface TripCardProps {
  trip: {
    id: string;
    title: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    coverImage?: string;
    participants: number;
    status: 'upcoming' | 'active' | 'completed';
  };
  variant: 'compact' | 'expanded' | 'hero';
  onPress: () => void;
  onLongPress?: () => void;
}

// Implementation with gesture support
const TripCard: React.FC<TripCardProps> = ({ trip, variant, onPress }) => {
  const { theme } = useTheme();
  const animatedScale = useSharedValue(1);
  
  const gesture = Gesture.Tap()
    .onBegin(() => {
      animatedScale.value = withSpring(0.95);
    })
    .onFinalize(() => {
      animatedScale.value = withSpring(1);
      runOnJS(onPress)();
    });
    
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles[variant], animatedStyle]}>
        {/* Card content */}
      </Animated.View>
    </GestureDetector>
  );
};
```

---
