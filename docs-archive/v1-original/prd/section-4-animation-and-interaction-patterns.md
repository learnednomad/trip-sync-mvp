# Section 4: Animation and Interaction Patterns

## Gesture-Based Interactions

```typescript
// Swipeable Trip Actions
const SwipeableTrip = () => {
  const translateX = useSharedValue(0);
  
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (translateX.value < -100) {
        // Delete action
        translateX.value = withSpring(-width);
      } else if (translateX.value > 100) {
        // Archive action
        translateX.value = withSpring(width);
      } else {
        translateX.value = withSpring(0);
      }
    });
    
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <TripCard />
      </Animated.View>
    </GestureDetector>
  );
};
```

## Screen Transitions

```typescript
// Shared Element Transitions
const TripListToDetail = () => {
  return (
    <SharedElementTransition
      sharedElementId={`trip-${tripId}`}
      animation="fade-scale"
      duration={350}
    >
      <TripDetailScreen />
    </SharedElementTransition>
  );
};
```

---
