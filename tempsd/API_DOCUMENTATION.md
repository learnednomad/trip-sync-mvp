# API Documentation - Sabron Trip Sync

## Base URL
```
Development: http://localhost:3000/api/v1
Staging: https://staging-api.sabrontripsync.com/api/v1
Production: https://api.sabrontripsync.com/api/v1
```

## Authentication
All API requests require authentication except for login and registration endpoints. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user
- Headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "phoneNumber": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123456",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "tokens": {
      "access": "eyJhbGc...",
      "refresh": "eyJhbGc...",
      "expiresIn": 900
    }
  }
}
```

#### POST /auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "deviceId": "device_123456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123456",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "tokens": {
      "access": "eyJhbGc...",
      "refresh": "eyJhbGc...",
      "expiresIn": 900
    }
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "tokens": {
      "access": "eyJhbGc...",
      "refresh": "eyJhbGc...",
      "expiresIn": 900
    }
  }
}
```

#### POST /auth/logout
Logout user and invalidate tokens.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /auth/verify-email
Verify user email address.

**Request Body:**
```json
{
  "token": "verification_token_123456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Trip Management

#### GET /trips
Get all trips for authenticated user.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (upcoming, active, completed)
- `search` (string): Search in trip names and destinations

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trips": [
      {
        "id": "trip_123456",
        "name": "Summer Vacation",
        "description": "Beach trip with friends",
        "destination": "Bali, Indonesia",
        "startDate": "2024-07-01",
        "endDate": "2024-07-15",
        "status": "upcoming",
        "participants": [
          {
            "id": "usr_123456",
            "name": "John Doe",
            "role": "organizer"
          }
        ],
        "createdBy": "usr_123456",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

#### GET /trips/:id
Get specific trip details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": "trip_123456",
      "name": "Summer Vacation",
      "description": "Beach trip with friends",
      "destination": "Bali, Indonesia",
      "startDate": "2024-07-01",
      "endDate": "2024-07-15",
      "status": "upcoming",
      "participants": [],
      "itinerary": [],
      "expenses": [],
      "totalExpenses": {
        "USD": 1500.00,
        "EUR": 200.00
      },
      "createdBy": "usr_123456",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### POST /trips
Create a new trip.

**Request Body:**
```json
{
  "name": "Summer Vacation",
  "description": "Beach trip with friends",
  "destination": "Bali, Indonesia",
  "startDate": "2024-07-01",
  "endDate": "2024-07-15"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": "trip_123456",
      "name": "Summer Vacation",
      "status": "upcoming"
    }
  }
}
```

#### PUT /trips/:id
Update trip details.

**Request Body:**
```json
{
  "name": "Updated Trip Name",
  "description": "Updated description",
  "destination": "Updated destination"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": "trip_123456",
      "name": "Updated Trip Name"
    }
  }
}
```

#### DELETE /trips/:id
Delete a trip (organizer only).

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

### Participants

#### GET /trips/:tripId/participants
Get all participants for a trip.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "participants": [
      {
        "id": "usr_123456",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "organizer",
        "joinedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### POST /trips/:tripId/participants
Add participant to trip.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "role": "participant"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "participant": {
      "id": "usr_789012",
      "email": "newuser@example.com",
      "role": "participant"
    }
  }
}
```

#### DELETE /trips/:tripId/participants/:userId
Remove participant from trip.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Participant removed successfully"
}
```

### Expenses

#### GET /trips/:tripId/expenses
Get all expenses for a trip.

**Query Parameters:**
- `category` (string): Filter by category
- `paidBy` (string): Filter by payer user ID
- `startDate` (string): Filter by date range
- `endDate` (string): Filter by date range

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "id": "exp_123456",
        "tripId": "trip_123456",
        "amount": 150.00,
        "currency": "USD",
        "category": "accommodation",
        "description": "Hotel booking",
        "paidBy": {
          "id": "usr_123456",
          "name": "John Doe"
        },
        "splitBetween": [
          {
            "userId": "usr_123456",
            "amount": 50.00
          },
          {
            "userId": "usr_789012",
            "amount": 50.00
          },
          {
            "userId": "usr_345678",
            "amount": 50.00
          }
        ],
        "receiptUrl": "https://cdn.example.com/receipts/123456.jpg",
        "date": "2024-07-02",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "summary": {
      "total": 1500.00,
      "byCategory": {
        "accommodation": 500.00,
        "food": 600.00,
        "transport": 400.00
      },
      "byPerson": {
        "usr_123456": 500.00,
        "usr_789012": 500.00,
        "usr_345678": 500.00
      }
    }
  }
}
```

#### POST /trips/:tripId/expenses
Add new expense to trip.

**Request Body:**
```json
{
  "amount": 150.00,
  "currency": "USD",
  "category": "accommodation",
  "description": "Hotel booking",
  "paidBy": "usr_123456",
  "splitBetween": ["usr_123456", "usr_789012", "usr_345678"],
  "splitType": "equal",
  "date": "2024-07-02",
  "receiptUrl": "https://cdn.example.com/receipts/123456.jpg"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "expense": {
      "id": "exp_123456",
      "amount": 150.00,
      "currency": "USD"
    }
  }
}
```

#### PUT /trips/:tripId/expenses/:expenseId
Update expense details.

**Request Body:**
```json
{
  "amount": 175.00,
  "description": "Updated hotel booking"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "expense": {
      "id": "exp_123456",
      "amount": 175.00
    }
  }
}
```

#### DELETE /trips/:tripId/expenses/:expenseId
Delete an expense.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

#### GET /trips/:tripId/expenses/settlements
Calculate expense settlements.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "settlements": [
      {
        "from": {
          "id": "usr_789012",
          "name": "Jane Smith"
        },
        "to": {
          "id": "usr_123456",
          "name": "John Doe"
        },
        "amount": 150.00,
        "currency": "USD"
      }
    ],
    "summary": {
      "totalExpenses": 1500.00,
      "perPerson": 500.00,
      "currency": "USD"
    }
  }
}
```

### Itinerary

#### GET /trips/:tripId/itinerary
Get trip itinerary.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "itinerary": [
      {
        "id": "itn_123456",
        "day": 1,
        "date": "2024-07-01",
        "activities": [
          {
            "id": "act_123456",
            "time": "09:00",
            "title": "Airport Departure",
            "description": "Meet at airport",
            "location": {
              "name": "JFK Airport",
              "coordinates": {
                "lat": 40.6413,
                "lng": -73.7781
              }
            },
            "duration": 120,
            "category": "transport"
          }
        ]
      }
    ]
  }
}
```

#### POST /trips/:tripId/itinerary
Add itinerary item.

**Request Body:**
```json
{
  "day": 1,
  "date": "2024-07-01",
  "activities": [
    {
      "time": "09:00",
      "title": "Airport Departure",
      "description": "Meet at airport",
      "location": {
        "name": "JFK Airport",
        "coordinates": {
          "lat": 40.6413,
          "lng": -73.7781
        }
      },
      "duration": 120,
      "category": "transport"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "itinerary": {
      "id": "itn_123456",
      "day": 1
    }
  }
}
```

### Media

#### POST /trips/:tripId/media/upload
Upload media file for trip.

**Request:** `multipart/form-data`
- `file`: The media file (max 10MB)
- `type`: Type of media (photo, document)
- `description`: Optional description

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "media": {
      "id": "med_123456",
      "url": "https://cdn.example.com/media/123456.jpg",
      "thumbnailUrl": "https://cdn.example.com/media/123456_thumb.jpg",
      "type": "photo",
      "size": 2048576,
      "uploadedBy": "usr_123456",
      "uploadedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### GET /trips/:tripId/media
Get all media for trip.

**Query Parameters:**
- `type` (string): Filter by type (photo, document)
- `uploadedBy` (string): Filter by uploader

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "media": [
      {
        "id": "med_123456",
        "url": "https://cdn.example.com/media/123456.jpg",
        "thumbnailUrl": "https://cdn.example.com/media/123456_thumb.jpg",
        "type": "photo",
        "description": "Beach sunset",
        "uploadedBy": {
          "id": "usr_123456",
          "name": "John Doe"
        },
        "uploadedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Sync

#### POST /sync/push
Push offline changes to server.

**Request Body:**
```json
{
  "changes": [
    {
      "id": "sync_123456",
      "type": "CREATE",
      "entity": "expense",
      "data": {},
      "timestamp": "2024-01-01T00:00:00Z",
      "version": 1
    }
  ],
  "lastSyncTime": "2024-01-01T00:00:00Z"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accepted": ["sync_123456"],
    "rejected": [],
    "conflicts": [],
    "serverTime": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /sync/pull
Pull changes from server.

**Query Parameters:**
- `lastSyncTime` (string): ISO timestamp of last sync
- `entities` (string): Comma-separated list of entities to sync

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "changes": [
      {
        "type": "UPDATE",
        "entity": "trip",
        "entityId": "trip_123456",
        "data": {},
        "timestamp": "2024-01-01T00:00:00Z",
        "version": 2
      }
    ],
    "serverTime": "2024-01-01T00:00:00Z",
    "hasMore": false
  }
}
```

## WebSocket Events

### Connection
```javascript
const ws = new WebSocket('wss://api.sabrontripsync.com/ws')

ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'jwt_token'
  }))
})
```

### Events

#### trip.updated
Emitted when trip details are updated.
```json
{
  "type": "trip.updated",
  "data": {
    "tripId": "trip_123456",
    "changes": {},
    "updatedBy": "usr_123456",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### expense.added
Emitted when new expense is added.
```json
{
  "type": "expense.added",
  "data": {
    "tripId": "trip_123456",
    "expense": {},
    "addedBy": "usr_123456",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### participant.joined
Emitted when participant joins trip.
```json
{
  "type": "participant.joined",
  "data": {
    "tripId": "trip_123456",
    "participant": {},
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | Invalid email or password |
| `AUTH_TOKEN_EXPIRED` | JWT token has expired |
| `AUTH_TOKEN_INVALID` | Invalid JWT token |
| `AUTH_UNAUTHORIZED` | User not authorized for this action |
| `VALIDATION_ERROR` | Request validation failed |
| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `CONFLICT_EXISTS` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `SERVER_ERROR` | Internal server error |
| `SYNC_CONFLICT` | Sync conflict detected |

## Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `204` | No Content |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `409` | Conflict |
| `429` | Too Many Requests |
| `500` | Internal Server Error |
| `503` | Service Unavailable |

## SDK Examples

### JavaScript/TypeScript
```typescript
import { SabronTripSyncAPI } from '@sabron/trip-sync-sdk'

const api = new SabronTripSyncAPI({
  baseURL: 'https://api.sabrontripsync.com',
  apiKey: 'your_api_key'
})

// Login
const { user, tokens } = await api.auth.login({
  email: 'user@example.com',
  password: 'password'
})

// Get trips
const trips = await api.trips.list({
  status: 'upcoming',
  page: 1,
  limit: 20
})

// Create expense
const expense = await api.expenses.create('trip_123456', {
  amount: 150.00,
  currency: 'USD',
  category: 'food',
  description: 'Dinner'
})
```

### cURL Examples
```bash
# Login
curl -X POST https://api.sabrontripsync.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get trips
curl -X GET https://api.sabrontripsync.com/api/v1/trips \
  -H "Authorization: Bearer <token>"

# Create expense
curl -X POST https://api.sabrontripsync.com/api/v1/trips/trip_123456/expenses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"amount":150,"currency":"USD","category":"food"}'
```

## Changelog

### Version 1.0.0 (2024-01-01)
- Initial API release
- Authentication endpoints
- Trip management
- Expense tracking
- Basic sync functionality

### Version 1.1.0 (2024-02-01)
- Added itinerary management
- Media upload support
- WebSocket real-time updates
- Improved sync conflict resolution

### Version 1.2.0 (2024-03-01)
- Payment integration endpoints
- Advanced expense splitting
- Multi-currency support
- Performance optimizations