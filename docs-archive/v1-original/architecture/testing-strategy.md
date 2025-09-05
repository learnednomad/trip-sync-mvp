# Testing Strategy

## Testing Pyramid
```text
         E2E Tests
        /        \
   Integration Tests
   /            \
Frontend Unit  Backend Unit
```

## Test Organization

### Frontend Tests
```text
tests/
├── components/
│   ├── TripCard.test.tsx
│   └── ExpenseForm.test.tsx
├── hooks/
│   ├── useAuth.test.ts
│   └── useOfflineSync.test.ts
└── services/
    ├── sync.test.ts
    └── api.test.ts
```

### Backend Tests
```text
supabase/tests/
├── database/
│   ├── functions.test.sql
│   └── rls.test.sql
└── functions/
    └── webhooks.test.ts
```

### E2E Tests
```text
tests/e2e/
├── flows/
│   ├── onboarding.yaml
│   ├── create-trip.yaml
│   └── add-expense.yaml
├── helpers/
│   └── test-data.js
└── maestro.yaml
```

## Test Examples

### Frontend Component Test
```typescript
// tests/components/TripCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TripCard } from '@/components/trip/TripCard';

describe('TripCard', () => {
  const mockTrip = {
    id: '123',
    name: 'Paris Adventure',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-07'),
    memberCount: 4,
  };

  it('renders trip information correctly', () => {
    const { getByText } = render(
      <TripCard trip={mockTrip} onPress={jest.fn()} />
    );

    expect(getByText('Paris Adventure')).toBeTruthy();
    expect(getByText('4 members')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <TripCard trip={mockTrip} onPress={onPress} testID="trip-card" />
    );

    fireEvent.press(getByTestId('trip-card'));
    expect(onPress).toHaveBeenCalledWith(mockTrip);
  });
});
```

### Backend API Test
```typescript
// supabase/tests/functions/webhooks.test.ts
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

Deno.test('Push notification webhook sends notifications', async () => {
  const response = await fetch('http://localhost:54321/functions/v1/webhooks/push-notifications', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer test-token',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'INSERT',
      table: 'expenses',
      record: {
        trip_id: 'test-trip-id',
        paid_by_user_id: 'user-1',
        description: 'Lunch',
      },
    }),
  });

  assertEquals(response.status, 200);
});
```

### E2E Test
```yaml
# tests/e2e/flows/create-trip.yaml
appId: com.sabron.tripsync
---
- launchApp:
    clearState: true

- assertVisible: "Welcome to Trip Sync"
- tapOn: "Sign In"

- inputText:
    text: "test@example.com"
    id: "email-input"
- inputText:
    text: "password123"
    id: "password-input"
- tapOn: "Sign In"

- assertVisible: "My Trips"
- tapOn: "Create Trip"

- inputText:
    text: "Summer Road Trip"
    id: "trip-name-input"
- tapOn: "June 1, 2025"
- tapOn: "15" # Select date
- tapOn: "Done"

- tapOn: "June 7, 2025"
- tapOn: "21" # Select date
- tapOn: "Done"

- tapOn: "Create Trip"
- assertVisible: "Summer Road Trip"
```
