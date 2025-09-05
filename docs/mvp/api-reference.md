# Trip Sync MVP - API Reference

**Version**: 1.0 MVP  
**Base URL**: `https://[your-project].supabase.co`  
**Authentication**: Bearer token (JWT)

## Overview

All API calls go through Supabase's auto-generated REST API. This reference covers the MVP endpoints only.

## Authentication

### Sign Up
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response**: 
```json
{
  "access_token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### Sign In
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Sign Out
```http
POST /auth/v1/logout
Authorization: Bearer {token}
```

## Trips

### Get User's Trips
```http
GET /rest/v1/trips?select=*,trip_members(*)
Authorization: Bearer {token}
```

**Response**:
```json
[
  {
    "id": "trip-uuid",
    "name": "Weekend in Vegas",
    "start_date": "2025-02-01",
    "end_date": "2025-02-03",
    "invite_code": "ABC123",
    "created_by": "user-uuid",
    "trip_members": [
      {
        "user_id": "user-uuid",
        "role": "owner",
        "joined_at": "2025-01-15T10:00:00Z"
      }
    ]
  }
]
```

### Create Trip
```http
POST /rest/v1/trips
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Summer Road Trip",
  "start_date": "2025-07-01",
  "end_date": "2025-07-07"
}
```

### Join Trip
```http
POST /rest/v1/rpc/join_trip
Authorization: Bearer {token}
Content-Type: application/json

{
  "invite_code": "ABC123"
}
```

### Get Trip Details
```http
GET /rest/v1/trips?id=eq.{trip_id}&select=*,trip_members(*),expenses(*)
Authorization: Bearer {token}
```

## Expenses

### Get Trip Expenses
```http
GET /rest/v1/expenses?trip_id=eq.{trip_id}&select=*,expense_splits(*)
Authorization: Bearer {token}
```

**Response**:
```json
[
  {
    "id": "expense-uuid",
    "trip_id": "trip-uuid",
    "amount": 120.50,
    "description": "Dinner at restaurant",
    "paid_by": "user-uuid",
    "created_by": "user-uuid",
    "created_at": "2025-01-20T19:30:00Z",
    "expense_splits": [
      {
        "user_id": "user-uuid-1",
        "amount_owed": 40.17
      },
      {
        "user_id": "user-uuid-2",
        "amount_owed": 40.17
      }
    ]
  }
]
```

### Create Expense
```http
POST /rest/v1/expenses
Authorization: Bearer {token}
Content-Type: application/json

{
  "trip_id": "trip-uuid",
  "amount": 150.00,
  "description": "Gas for road trip",
  "paid_by": "user-uuid",
  "participants": ["user-uuid-1", "user-uuid-2", "user-uuid-3"]
}
```

*Note: The participants array is processed by a database function to create equal splits*

### Delete Expense
```http
DELETE /rest/v1/expenses?id=eq.{expense_id}
Authorization: Bearer {token}
```

## Real-time Subscriptions

### Subscribe to Trip Changes
```javascript
// Using Supabase client
const subscription = supabase
  .channel('trip-changes')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'trips',
      filter: `id=eq.${tripId}`
    }, 
    (payload) => console.log(payload)
  )
  .subscribe();
```

### Subscribe to Expense Changes
```javascript
// Using Supabase client  
const subscription = supabase
  .channel('expense-changes')
  .on('postgres_changes',
    {
      event: '*',
      schema: 'public', 
      table: 'expenses',
      filter: `trip_id=eq.${tripId}`
    },
    (payload) => console.log(payload)
  )
  .subscribe();
```

## User Profile

### Get Profile
```http
GET /rest/v1/users?id=eq.{user_id}
Authorization: Bearer {token}
```

### Update Profile
```http
PATCH /rest/v1/users?id=eq.{user_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "avatar_url": "https://..."
}
```

## Error Responses

All errors follow this format:
```json
{
  "code": "PGRST301",
  "details": null,
  "hint": null,
  "message": "JWT expired"
}
```

Common error codes:
- `PGRST301` - Authentication required
- `PGRST204` - No rows found
- `23505` - Unique constraint violation
- `23503` - Foreign key violation

## Rate Limits

- **Anonymous**: Not allowed
- **Authenticated**: 1000 requests per hour
- **Real-time**: 100 concurrent connections

## SDK Usage Example

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

// Example: Create expense
async function createExpense(expense: NewExpense) {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
```

## Notes

1. All timestamps are in UTC
2. All amounts are in cents (multiply by 100)
3. Use select parameter to include relations
4. Filters use PostgREST syntax
5. Real-time requires authenticated connection

For more details, see [Supabase Documentation](https://supabase.com/docs).