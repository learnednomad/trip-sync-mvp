# Trip Sync MVP - Technical Architecture

**Version**: 1.0 MVP  
**Date**: January 2025  
**Status**: Active Development

## Architecture Principles

### MVP Philosophy
1. **Use proven patterns** - No experimental tech
2. **Leverage platform defaults** - Don't fight the framework
3. **Minimize dependencies** - Every package adds risk
4. **Offline-first** - Assume no connection
5. **Simple state management** - No over-engineering

## Technology Stack

### Core Technologies
| Layer | Technology | Version | Why |
|-------|------------|---------|-----|
| Runtime | React Native | 0.79.5 | Cross-platform, proven |
| Framework | Expo | SDK 53 | Simplifies deployment |
| Language | TypeScript | 5.5+ | Type safety, better DX |
| Navigation | Expo Router | 5.x | File-based, simple |
| Styling | NativeWind | 4.x | Tailwind for RN |
| State (Local) | Zustand | 5.x | Simple, TypeScript-friendly |
| State (Server) | TanStack Query | 5.x | Caching, offline support |
| Storage | React Native MMKV | 3.x | Fast, encrypted |
| Backend | Supabase | 2.x | All-in-one BaaS |

### Why These Choices
- **Expo**: Handles builds, OTA updates, and common native modules
- **Zustand**: 8KB vs 45KB for Redux, perfect for MVP
- **MMKV**: 30x faster than AsyncStorage
- **Supabase**: Auth + DB + Realtime + Storage in one

## System Architecture

```
┌─────────────────┐     ┌──────────────────┐
│                 │     │                  │
│   iOS Device    │     │  Android Device  │
│                 │     │                  │
└────────┬────────┘     └────────┬─────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────▼──────┐
              │             │
              │  Expo App   │
              │             │
              └──────┬──────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼───┐  ┌───▼───┐  ┌───▼───┐
    │ MMKV   │  │Zustand│  │TanStack│
    │Storage │  │ State │  │ Query  │
    └────┬───┘  └───┬───┘  └───┬───┘
         │           │           │
         └───────────┼───────────┘
                     │
              ┌──────▼──────┐
              │   Offline   │
              │   Queue     │
              └──────┬──────┘
                     │
                     │ Internet
                     │
              ┌──────▼──────┐
              │             │
              │  Supabase   │
              │             │
              └─────────────┘
```

## Project Structure

```
sabron-trip-sync/
├── src/
│   ├── app/                    # Expo Router screens
│   │   ├── (auth)/            # Auth flow screens
│   │   ├── (tabs)/            # Main app tabs
│   │   │   ├── home/
│   │   │   ├── trips/
│   │   │   ├── explore/
│   │   │   └── settings/
│   │   └── _layout.tsx        # Root layout
│   ├── components/
│   │   ├── ui/                # Basic components
│   │   └── features/          # Feature components
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client (see authentication-guide.md)
│   │   ├── storage.ts         # MMKV utilities
│   │   └── query-client.ts    # TanStack setup
│   ├── store/
│   │   ├── auth.ts            # Auth state
│   │   └── offline.ts         # Offline queue
│   ├── api/
│   │   ├── trips.ts           # Trip queries
│   │   └── expenses.ts        # Expense queries
│   └── theme/
│       └── colors.ts          # Theme config
├── app.config.ts              # Expo config
├── tailwind.config.js         # NativeWind config
└── tsconfig.json              # TypeScript config
```

## Data Architecture

### Local Storage Strategy

**MMKV Storage Keys**:
```typescript
- auth_session    // User session
- auth_user       // User profile  
- theme_pref      // Theme preference
- offline_queue   // Pending mutations
- trips_cache     // Cached trips
- expenses_cache  // Cached expenses
```

### State Management Patterns

**Zustand for UI State**:
```typescript
// Simple auth store example (full implementation in authentication-guide.md)
interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}
```

**TanStack Query for Server State**:
```typescript
// Simple query example
const { data: trips } = useQuery({
  queryKey: ['trips'],
  queryFn: fetchUserTrips,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Offline Architecture

**Queue Structure**:
```typescript
interface OfflineAction {
  id: string;
  type: 'CREATE_EXPENSE' | 'UPDATE_TRIP' | 'DELETE_EXPENSE';
  payload: any;
  timestamp: number;
  retryCount: number;
}
```

**Sync Strategy**:
1. Detect online status via NetInfo
2. Queue mutations when offline
3. Process queue when online
4. Max 3 retries per action
5. Clear after success or max retries

## API Design

### Endpoints (via Supabase)

All API calls go through Supabase PostgREST:

**Authentication** (see [Authentication Guide](./authentication-guide.md) for implementation details):
- `POST /auth/signup` - Email signup
- `POST /auth/signin` - Email signin
- `POST /auth/signout` - Sign out
- `POST /auth/apple` - Apple Sign In
- `POST /auth/google` - Google Sign In
- `POST /auth/otp` - Magic Link / SMS Auth
- `POST /auth/anonymous` - Anonymous Sign In

**Trips**:
- `GET /trips` - User's trips
- `POST /trips` - Create trip
- `PATCH /trips/:id` - Update trip
- `DELETE /trips/:id` - Delete trip

**Expenses**:
- `GET /expenses?trip_id=` - Trip expenses
- `POST /expenses` - Create expense
- `DELETE /expenses/:id` - Delete expense

**Real-time**:
- Subscribe to trip changes
- Subscribe to expense changes

### Database Schema (Simplified)

```sql
-- Core tables only
users (id, email, name, avatar_url)
trips (id, name, start_date, end_date, created_by, invite_code)
trip_members (trip_id, user_id, role, joined_at)
expenses (id, trip_id, amount, description, paid_by)
expense_splits (expense_id, user_id, amount_owed)
```

## Security Architecture

### Client Security
- Encrypted MMKV storage for sensitive data
- No credentials in code
- Environment variables for config
- Biometric authentication support
- Secure session management with auto-refresh
- Deep linking for OAuth callbacks

For complete authentication implementation details, see the [Authentication Guide](./authentication-guide.md).

### API Security
- Row Level Security (RLS) on all tables
- JWT tokens with short expiry
- Secure session refresh
- No sensitive data in logs

### Data Security
- User can only see their trips
- Trip members can see trip expenses
- No public trip data (MVP)
- Soft deletes for audit trail

## Performance Targets

### App Performance
- **Cold start**: <2s
- **Warm start**: <500ms
- **Navigation**: <300ms
- **List scrolling**: 60fps
- **Memory usage**: <150MB

### Network Performance
- **API timeout**: 30s
- **Retry logic**: 3 attempts
- **Offline detection**: <1s
- **Sync batch size**: 50 items

## Development Guidelines

### Code Standards
```typescript
// ✅ Simple and clear
const addExpense = async (expense: Expense) => {
  try {
    await supabase.from('expenses').insert(expense);
  } catch (error) {
    queueOfflineAction('CREATE_EXPENSE', expense);
  }
};

// ❌ Over-engineered
// No complex abstractions, factories, or unnecessary patterns
```

### Component Patterns
```typescript
// Simple functional component
export function ExpenseCard({ expense }: Props) {
  const theme = useTheme();
  
  return (
    <Card>
      <Text>{expense.description}</Text>
      <Text>${expense.amount}</Text>
    </Card>
  );
}
```

### Error Handling
```typescript
// Consistent error handling
try {
  await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  showToast('Something went wrong. Please try again.');
}
```

## Deployment Architecture

### Build & Release
```
Developer → GitHub → EAS Build → App Stores
                         ↓
                    TestFlight/Internal
```

### Environments
1. **Development**: Local Supabase
2. **Staging**: Staging Supabase project
3. **Production**: Production Supabase project

### Monitoring (Simple)
- Crash reporting: Sentry
- Basic analytics: Expo Analytics
- Error logs: Supabase Dashboard
- Performance: React Native Performance

## MVP Trade-offs

### What We're Accepting
1. **Last-write-wins sync** - Simple but may lose data
2. **Equal splits only** - Covers 80% of use cases
3. **No web version** - Mobile-only is fine for MVP
4. **Basic UI** - Functional over beautiful
5. **English only** - i18n is v2

### What We're NOT Compromising
1. **Offline support** - Core feature
2. **Data security** - Always encrypted
3. **Cross-platform** - iOS and Android
4. **Real-time sync** - Expected UX
5. **Type safety** - Prevents bugs

## Technical Decisions Log

| Decision | Choice | Why | Date |
|----------|--------|-----|------|
| State Management | Zustand | Simpler than Redux | Jan 2025 |
| Navigation | Expo Router | File-based is intuitive | Jan 2025 |
| Offline Storage | MMKV | Fastest option | Jan 2025 |
| UI Library | Custom | More control for MVP | Jan 2025 |
| Testing | Jest + Maestro | Good enough for MVP | Jan 2025 |

---

This architecture is designed for MVP simplicity. When in doubt, choose the simpler option that still delivers core value.