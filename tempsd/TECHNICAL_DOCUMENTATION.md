# Sabron Trip Sync - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Core Systems](#core-systems)
5. [API Reference](#api-reference)
6. [Development Guide](#development-guide)
7. [Testing Guide](#testing-guide)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)

## Architecture Overview

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
├─────────────────────────────────────────────────────────────┤
│                    React Native (Expo)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   UI     │  │  State   │  │  Storage │  │  Sync    │  │
│  │  Layer   │◄─┤  Layer   │◄─┤  Layer   │◄─┤  Layer   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         NETWORK                             │
├─────────────────────────────────────────────────────────────┤
│     ┌──────────┐      ┌──────────┐      ┌──────────┐      │
│     │   CDN    │      │   API    │      │WebSocket │      │
│     │          │      │ Gateway  │      │  Server  │      │
│     └──────────┘      └──────────┘      └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Auth    │  │Business  │  │   Data   │  │Analytics │  │
│  │ Service  │  │  Logic   │  │  Access  │  │  Service │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
├─────────────────────────────────────────────────────────────┤
│     ┌──────────┐      ┌──────────┐      ┌──────────┐      │
│     │PostgreSQL│      │  Redis   │      │   S3     │      │
│     │          │      │  Cache   │      │ Storage  │      │
│     └──────────┘      └──────────┘      └──────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Mobile Framework** | React Native (Expo SDK 50) | Cross-platform development |
| **State Management** | Zustand + React Query | Client and server state |
| **Navigation** | Expo Router v3 | File-based routing |
| **Storage** | MMKV + SQLite | Local data persistence |
| **Styling** | NativeWind + RN Reusables | Tailwind CSS for RN |
| **Testing** | Jest + Maestro | Unit and E2E testing |
| **Backend** | Node.js + Express | API server |
| **Database** | PostgreSQL + Redis | Primary DB and cache |
| **Cloud** | AWS/GCP | Infrastructure |

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/sabron/trip-sync.git
cd sabron-trip-sync

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.development

# iOS specific setup (Mac only)
cd ios && pod install && cd ..

# Start the development server
pnpm start
```

### Running the App

```bash
# Start Metro bundler
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Run on web
pnpm web

# Run with production config
pnpm start --no-dev
```

## Project Structure

```
sabron-trip-sync/
├── src/                      # Source code
│   ├── app/                  # Expo Router screens
│   │   ├── (auth)/          # Authentication screens
│   │   ├── (app)/           # Main app screens
│   │   │   ├── (tabs)/      # Tab navigation
│   │   │   └── (modals)/    # Modal screens
│   │   └── _layout.tsx      # Root layout
│   ├── components/          # Reusable components
│   │   ├── primitives/      # Base UI components
│   │   ├── ui/             # Composed components
│   │   └── features/       # Feature-specific
│   ├── features/           # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── trips/         # Trip management
│   │   ├── expenses/      # Expense tracking
│   │   └── sync/          # Offline sync
│   ├── hooks/             # Custom hooks
│   ├── store/             # State management
│   │   ├── slices/        # Store slices
│   │   └── selectors/     # Computed state
│   ├── services/          # API services
│   ├── utils/             # Utilities
│   └── types/             # TypeScript types
├── assets/                # Static assets
├── __tests__/            # Test files
├── .maestro/             # E2E test flows
└── docs/                 # Documentation
```

## Core Systems

### 1. Authentication System

#### Overview
Multi-factor authentication with biometric support and JWT tokens.

#### Implementation
```typescript
// features/auth/services/AuthService.ts
export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResult>
  async logout(): Promise<void>
  async refreshToken(): Promise<TokenPair>
  async verifyMFA(code: string): Promise<boolean>
}
```

#### Usage Example
```typescript
import { useAuth } from '@/features/auth/hooks/useAuth'

function LoginScreen() {
  const { login, isLoading, error } = useAuth()
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password })
      // Navigate to dashboard
    } catch (error) {
      // Handle error
    }
  }
}
```

### 2. State Management

#### Store Architecture
```typescript
// store/index.ts
- authStore     # Authentication state
- tripStore     # Trip management
- expenseStore  # Expense tracking
- syncStore     # Offline sync
- uiStore       # UI state
```

#### Usage Pattern
```typescript
import { useTripStore } from '@/store/slices/tripStore'

function TripList() {
  const trips = useTripStore(state => state.trips)
  const addTrip = useTripStore(state => state.actions.addTrip)
  
  return <TripListView trips={trips} onAdd={addTrip} />
}
```

### 3. Offline Sync System

#### Sync Queue Management
```typescript
interface SyncAction {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  entity: 'trip' | 'expense' | 'participant'
  payload: any
  timestamp: number
  retryCount: number
}
```

#### Conflict Resolution
```typescript
enum ConflictResolution {
  LAST_WRITE_WINS = 'last_write_wins',
  FIELD_LEVEL_MERGE = 'field_level_merge',
  USER_CHOICE = 'user_choice'
}
```

### 4. Navigation System

#### Route Structure
```typescript
type Routes = {
  '/(auth)/login': undefined
  '/(auth)/register': undefined
  '/(app)/(tabs)/trips': undefined
  '/(app)/(tabs)/trips/[id]': { id: string }
  '/(app)/(modals)/add-expense': { tripId: string }
}
```

#### Deep Linking
```
sabrontrip://trip/123        → Trip details
sabrontrip://expense/add     → Add expense
sabrontrip://verify/token    → Email verification
```

## API Reference

### Authentication Endpoints

#### POST /auth/login
```typescript
interface LoginRequest {
  email: string
  password: string
  deviceId?: string
}

interface LoginResponse {
  user: User
  tokens: {
    access: string
    refresh: string
  }
}
```

#### POST /auth/refresh
```typescript
interface RefreshRequest {
  refreshToken: string
}

interface RefreshResponse {
  tokens: {
    access: string
    refresh: string
  }
}
```

### Trip Management

#### GET /trips
```typescript
interface TripsResponse {
  data: Trip[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}
```

#### POST /trips
```typescript
interface CreateTripRequest {
  name: string
  description?: string
  startDate: string
  endDate: string
  destination: string
}

interface CreateTripResponse {
  data: Trip
}
```

### Expense Tracking

#### POST /trips/:tripId/expenses
```typescript
interface CreateExpenseRequest {
  amount: number
  currency: string
  category: string
  description: string
  paidBy: string
  splitBetween: string[]
  receiptUrl?: string
}
```

## Development Guide

### Code Style

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

#### Component Structure
```typescript
// components/features/trips/TripCard.tsx
interface TripCardProps {
  trip: Trip
  onPress: (id: string) => void
}

export const TripCard = memo(({ trip, onPress }: TripCardProps) => {
  // Implementation
})
```

### Performance Guidelines

#### List Optimization
```typescript
import { FlashList } from '@shopify/flash-list'

<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={100}
  keyExtractor={item => item.id}
/>
```

#### Image Optimization
```typescript
import FastImage from 'react-native-fast-image'

<FastImage
  source={{ uri: imageUrl, priority: FastImage.priority.normal }}
  style={styles.image}
  resizeMode={FastImage.resizeMode.cover}
/>
```

### State Management Best Practices

#### Store Slices
```typescript
export const useTripStore = create<TripState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        trips: [],
        
        // Actions
        actions: {
          addTrip: (trip) => set(state => {
            state.trips.push(trip)
          })
        }
      }))
    )
  )
)
```

## Testing Guide

### Unit Testing

```typescript
// __tests__/components/TripCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native'
import { TripCard } from '@/components/cards/TripCard'

describe('TripCard', () => {
  it('renders trip information', () => {
    const trip = mockTrip()
    const { getByText } = render(<TripCard trip={trip} />)
    
    expect(getByText(trip.name)).toBeTruthy()
  })
})
```

### Integration Testing

```typescript
// __tests__/integration/TripCreation.test.tsx
describe('Trip Creation Flow', () => {
  it('creates a new trip', async () => {
    const { getByText, getByPlaceholderText } = render(<CreateTripScreen />)
    
    fireEvent.changeText(getByPlaceholderText('Trip Name'), 'Test Trip')
    fireEvent.press(getByText('Create'))
    
    await waitFor(() => {
      expect(getByText('Trip created!')).toBeTruthy()
    })
  })
})
```

### E2E Testing

```yaml
# .maestro/flows/trip_creation.yaml
appId: com.sabron.tripsync
---
- launchApp
- tapOn: "Create Trip"
- inputText: "Test Trip"
- tapOn: "Save"
- assertVisible: "Test Trip"
```

## Deployment Guide

### Build Configuration

#### iOS Build
```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

#### Android Build
```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

### Environment Configuration

```javascript
// app.config.ts
export default {
  expo: {
    name: process.env.APP_NAME,
    slug: 'sabron-trip-sync',
    version: '1.0.0',
    extra: {
      apiUrl: process.env.API_URL,
      sentryDsn: process.env.SENTRY_DSN
    }
  }
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: pnpm install
      - name: Run tests
        run: pnpm test
      - name: Build app
        run: eas build --non-interactive
```

## Troubleshooting

### Common Issues

#### Issue: Metro bundler crashes
```bash
# Solution: Clear cache
npx react-native start --reset-cache
rm -rf node_modules/.cache
```

#### Issue: iOS build fails
```bash
# Solution: Clean and rebuild
cd ios
pod deintegrate
pod install
cd ..
pnpm ios
```

#### Issue: Offline sync not working
```typescript
// Check sync status
const syncStatus = useSyncStore(state => state.syncStatus)
const pendingActions = useSyncStore(state => state.pendingActions)

// Force sync
await syncStore.actions.syncNow()
```

### Debug Tools

#### Flipper Integration
```typescript
// Enable Flipper in development
if (__DEV__) {
  require('react-native-flipper').default()
}
```

#### React Native Debugger
```bash
# Install
brew install react-native-debugger

# Use with app
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Performance Profiling

#### Using React DevTools
```bash
# Install
npm install -g react-devtools

# Run profiler
react-devtools
```

#### Memory Profiling
```typescript
import { PerformanceMonitor } from '@/utils/performance'

PerformanceMonitor.startTransaction('screen_load')
// ... screen rendering
PerformanceMonitor.endTransaction('screen_load')
```

---

## Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library)
- [NativeWind Documentation](https://www.nativewind.dev)

## Support

For issues and questions:
- GitHub Issues: [github.com/sabron/trip-sync/issues](https://github.com/sabron/trip-sync/issues)
- Email: support@sabrontripsync.com
- Discord: [discord.gg/sabrontrip](https://discord.gg/sabrontrip)