# Section 7: Testing Strategy

## Unit Testing

```typescript
// Component Testing with React Native Testing Library
describe('TripCard', () => {
  it('should render trip information correctly', () => {
    const trip = mockTrip();
    const { getByText, getByTestId } = render(
      <TripCard trip={trip} variant="compact" onPress={jest.fn()} />
    );
    
    expect(getByText(trip.title)).toBeTruthy();
    expect(getByText(trip.destination)).toBeTruthy();
    expect(getByTestId('trip-dates')).toHaveTextContent(
      formatDateRange(trip.startDate, trip.endDate)
    );
  });
  
  it('should handle press interactions', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <TripCard trip={mockTrip()} variant="compact" onPress={onPress} />
    );
    
    fireEvent.press(getByTestId('trip-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

## Integration Testing

```typescript
// API Integration Tests
describe('Trip Management API', () => {
  let supabase: SupabaseClient;
  
  beforeEach(() => {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  });
  
  it('should create a trip with proper permissions', async () => {
    const { data: trip, error } = await supabase
      .from('trips')
      .insert({
        title: 'Test Trip',
        start_date: '2025-06-01',
        end_date: '2025-06-10',
        destinations: ['Paris', 'Rome']
      })
      .select()
      .single();
      
    expect(error).toBeNull();
    expect(trip).toMatchObject({
      title: 'Test Trip',
      status: 'draft',
      visibility: 'private'
    });
  });
});
```

## E2E Testing with Maestro

```yaml
# maestro/create_trip_flow.yaml
appId: com.tripsync.app
---
- launchApp
- assertVisible: "Welcome to Trip Sync"
- tapOn: "Create Trip"
- assertVisible: "New Trip"
- inputText: 
    text: "Summer Vacation 2025"
    id: "trip-title-input"
- tapOn: "Select Dates"
- selectDate: "2025-06-01"
- selectDate: "2025-06-10"
- tapOn: "Add Destination"
- inputText: "Paris"
- tapOn: "Create Trip"
- assertVisible: "Summer Vacation 2025"
- assertVisible: "June 1 - 10, 2025"
```

---
