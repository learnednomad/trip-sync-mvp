# Data Models

## User
**Purpose:** Core user entity for authentication and profile management

**Key Attributes:**
- id: UUID - Unique identifier from Supabase Auth
- email: string - Primary email address
- fullName: string - Display name
- avatar: string? - Profile picture URL
- preferences: UserPreferences - User settings
- createdAt: timestamp - Account creation date

**TypeScript Interface:**
```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

interface UserPreferences {
  currency: string;
  language: string;
  notifications: NotificationSettings;
  theme: 'light' | 'dark' | 'system';
}
```

**Relationships:**
- Has many TripMembers
- Has many Expenses (as payer)
- Has many Activities

## Trip
**Purpose:** Container for travel plans with multi-user collaboration

**Key Attributes:**
- id: UUID - Unique identifier
- name: string - Trip title
- startDate: Date - Trip start
- endDate: Date - Trip end
- status: TripStatus - Current state
- coverImage?: string - Header image
- settings: TripSettings - Trip configuration

**TypeScript Interface:**
```typescript
interface Trip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  coverImage?: string;
  settings: TripSettings;
  createdAt: Date;
  updatedAt: Date;
}

interface TripSettings {
  currency: string;
  timezone: string;
  visibility: 'private' | 'shared';
  splitMethod: 'equal' | 'percentage' | 'shares' | 'exact';
}
```

**Relationships:**
- Has many TripMembers
- Has many Expenses
- Has many Activities
- Has many Destinations

## Expense
**Purpose:** Track shared expenses with splitting logic

**Key Attributes:**
- id: UUID - Unique identifier
- tripId: UUID - Associated trip
- paidBy: UUID - User who paid
- amount: number - Total amount
- currency: string - Currency code
- category: ExpenseCategory - Type of expense
- splits: ExpenseSplit[] - How to divide

**TypeScript Interface:**
```typescript
interface Expense {
  id: string;
  tripId: string;
  paidBy: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string;
  receipt?: string;
  date: Date;
  splits: ExpenseSplit[];
  createdAt: Date;
  updatedAt: Date;
  vectorClock: VectorClock;
}

interface ExpenseSplit {
  userId: string;
  amount: number;
  percentage?: number;
  shares?: number;
  settled: boolean;
}

type ExpenseCategory = 
  | 'accommodation' 
  | 'transport' 
  | 'food' 
  | 'activities' 
  | 'shopping' 
  | 'other';
```

**Relationships:**
- Belongs to Trip
- Belongs to User (paidBy)
- Has many ExpenseSplits

## Activity
**Purpose:** Itinerary items and bookings

**Key Attributes:**
- id: UUID - Unique identifier
- tripId: UUID - Associated trip
- name: string - Activity title
- type: ActivityType - Category
- startTime: Date - Start date/time
- endTime?: Date - End date/time
- location?: Location - Geographic data

**TypeScript Interface:**
```typescript
interface Activity {
  id: string;
  tripId: string;
  destinationId?: string;
  name: string;
  type: ActivityType;
  description?: string;
  startTime: Date;
  endTime?: Date;
  location?: Location;
  bookingReference?: string;
  cost?: Money;
  documents?: string[];
  createdAt: Date;
  updatedAt: Date;
  vectorClock: VectorClock;
}

type ActivityType = 
  | 'flight' 
  | 'accommodation' 
  | 'transport' 
  | 'tour' 
  | 'restaurant' 
  | 'attraction' 
  | 'custom';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  placeId?: string;
}
```

**Relationships:**
- Belongs to Trip
- Belongs to Destination (optional)
- Created by User
