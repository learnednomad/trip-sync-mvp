# Developer Onboarding Guide - Sabron Trip Sync

Welcome to the Sabron Trip Sync development team! This guide will help you get up and running with our mobile application development environment.

## Table of Contents
1. [Welcome](#welcome)
2. [Development Environment Setup](#development-environment-setup)
3. [Project Overview](#project-overview)
4. [Development Workflow](#development-workflow)
5. [Code Standards](#code-standards)
6. [Testing Requirements](#testing-requirements)
7. [Resources & Support](#resources--support)

## Welcome

### What is Sabron Trip Sync?
Sabron Trip Sync is a comprehensive group travel management mobile application that helps users plan trips, track expenses, and collaborate in real-time. Built with React Native and Expo, it provides offline-first functionality across iOS, Android, and web platforms.

### Your First Week Checklist
- [ ] Complete environment setup
- [ ] Clone and run the project locally
- [ ] Review architecture documentation
- [ ] Complete the onboarding tasks
- [ ] Join team channels
- [ ] Schedule 1:1 with team lead
- [ ] Review current sprint board
- [ ] Make your first PR (documentation update)

## Development Environment Setup

### System Requirements

#### macOS (Recommended for iOS development)
- macOS 12.0 or later
- Xcode 14.0 or later
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space

#### Windows/Linux
- Windows 10/11 or Ubuntu 20.04+
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space

### Required Software

#### 1. Install Node.js and pnpm
```bash
# Install Node.js 18+ via nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install pnpm
npm install -g pnpm
```

#### 2. Install Expo CLI
```bash
pnpm add -g expo-cli eas-cli
```

#### 3. Platform-Specific Setup

##### iOS (Mac only)
```bash
# Install Xcode from App Store
# Then install iOS Simulator
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods
```

##### Android (All platforms)
1. Download [Android Studio](https://developer.android.com/studio)
2. Install Android SDK (API Level 33)
3. Configure ANDROID_HOME environment variable:
```bash
# Add to ~/.zshrc or ~/.bashrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### 4. Install Development Tools
```bash
# VS Code (recommended)
# Download from https://code.visualstudio.com

# Install VS Code extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
```

### Project Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/sabron/trip-sync.git
cd sabron-trip-sync
```

#### 2. Install Dependencies
```bash
pnpm install

# iOS specific (Mac only)
cd ios && pod install && cd ..
```

#### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.development

# Edit with your local settings
# API_URL=http://localhost:3000
# ...
```

#### 4. Run the Application
```bash
# Start Metro bundler
pnpm start

# In another terminal, run on your platform:
pnpm ios     # iOS Simulator
pnpm android # Android Emulator
pnpm web     # Web Browser
```

### Verify Setup
```bash
# Run setup verification script
pnpm run verify-setup

# Expected output:
# ✅ Node.js version: 18.x.x
# ✅ pnpm version: 8.x.x
# ✅ Expo CLI installed
# ✅ Project dependencies installed
# ✅ Environment configured
```

## Project Overview

### Architecture Layers

```
┌─────────────────────────────────┐
│      Presentation Layer         │
│   (Components, Screens, UI)     │
├─────────────────────────────────┤
│      Business Logic Layer       │
│   (Hooks, Services, Utils)      │
├─────────────────────────────────┤
│      State Management Layer     │
│   (Zustand, React Query)        │
├─────────────────────────────────┤
│      Data Persistence Layer     │
│   (MMKV, SQLite, Secure Store)  │
└─────────────────────────────────┘
```

### Key Technologies

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| React Native | Mobile framework | [Docs](https://reactnative.dev) |
| Expo | Development platform | [Docs](https://docs.expo.dev) |
| TypeScript | Type safety | [Docs](https://www.typescriptlang.org) |
| Zustand | State management | [Docs](https://github.com/pmndrs/zustand) |
| React Query | Server state | [Docs](https://tanstack.com/query) |
| NativeWind | Styling | [Docs](https://www.nativewind.dev) |
| Expo Router | Navigation | [Docs](https://expo.github.io/router) |

### Project Structure
```
src/
├── app/              # Screens (Expo Router)
├── components/       # Reusable components
├── features/         # Feature modules
├── hooks/           # Custom hooks
├── services/        # API services
├── store/           # State management
├── utils/           # Utilities
└── types/           # TypeScript types
```

## Development Workflow

### Git Workflow

#### Branch Naming Convention
```
feature/JIRA-123-add-expense-splitting
bugfix/JIRA-456-fix-login-crash
hotfix/JIRA-789-critical-sync-issue
chore/update-dependencies
```

#### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)

# Examples:
feat(trips): add trip creation flow
fix(auth): resolve login timeout issue
docs(readme): update setup instructions
```

#### Pull Request Process
1. Create feature branch from `develop`
2. Make changes and commit
3. Push branch and create PR
4. Ensure CI passes
5. Request code review
6. Address feedback
7. Merge after approval

### Daily Development Flow

#### 1. Start Your Day
```bash
# Pull latest changes
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/JIRA-XXX-description

# Ensure dependencies are up to date
pnpm install
```

#### 2. Development
```bash
# Run app in development mode
pnpm start

# Run tests in watch mode
pnpm test --watch

# Check TypeScript
pnpm typecheck

# Lint code
pnpm lint
```

#### 3. Before Committing
```bash
# Format code
pnpm format

# Run all checks
pnpm precommit

# Commit changes
git add .
git commit -m "feat(scope): description"
```

#### 4. Submit PR
```bash
# Push branch
git push origin feature/JIRA-XXX-description

# Create PR via GitHub/GitLab
# Fill PR template
# Link JIRA ticket
```

## Code Standards

### TypeScript Guidelines

#### Use Strict Types
```typescript
// ✅ Good
interface User {
  id: string
  name: string
  email: string
}

// ❌ Bad
interface User {
  id: any
  name: any
  email: any
}
```

#### Prefer Functional Components
```typescript
// ✅ Good
export const TripCard: FC<TripCardProps> = ({ trip, onPress }) => {
  return <View>...</View>
}

// ❌ Bad
export class TripCard extends Component {
  render() {
    return <View>...</View>
  }
}
```

### Component Structure

```typescript
// components/features/trips/TripCard.tsx

import { memo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Trip } from '@/types'

interface TripCardProps {
  trip: Trip
  onPress: (id: string) => void
}

export const TripCard = memo(({ trip, onPress }: TripCardProps) => {
  const handlePress = useCallback(() => {
    onPress(trip.id)
  }, [trip.id, onPress])

  return (
    <Pressable onPress={handlePress}>
      <View className="p-4 bg-white rounded-lg">
        <Text className="text-lg font-bold">{trip.name}</Text>
        <Text className="text-gray-600">{trip.destination}</Text>
      </View>
    </Pressable>
  )
})

TripCard.displayName = 'TripCard'
```

### State Management Patterns

```typescript
// store/slices/tripStore.ts
export const useTripStore = create<TripState>()(
  immer((set, get) => ({
    // State
    trips: [],
    loading: false,
    
    // Actions
    actions: {
      addTrip: (trip) => set(state => {
        state.trips.push(trip)
      }),
      
      updateTrip: (id, updates) => set(state => {
        const index = state.trips.findIndex(t => t.id === id)
        if (index !== -1) {
          Object.assign(state.trips[index], updates)
        }
      })
    }
  }))
)
```

### Testing Standards

```typescript
// __tests__/components/TripCard.test.tsx
describe('TripCard', () => {
  const mockTrip = createMockTrip()
  const mockOnPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render trip information', () => {
    const { getByText } = render(
      <TripCard trip={mockTrip} onPress={mockOnPress} />
    )
    
    expect(getByText(mockTrip.name)).toBeTruthy()
    expect(getByText(mockTrip.destination)).toBeTruthy()
  })

  it('should call onPress when tapped', () => {
    const { getByTestId } = render(
      <TripCard trip={mockTrip} onPress={mockOnPress} />
    )
    
    fireEvent.press(getByTestId('trip-card'))
    expect(mockOnPress).toHaveBeenCalledWith(mockTrip.id)
  })
})
```

## Testing Requirements

### Test Coverage Goals
- Unit Tests: 70% minimum
- Integration Tests: Key user flows
- E2E Tests: Critical paths

### Running Tests

```bash
# Unit tests
pnpm test

# With coverage
pnpm test --coverage

# Watch mode
pnpm test --watch

# E2E tests (iOS)
pnpm test:e2e:ios

# E2E tests (Android)
pnpm test:e2e:android
```

### Writing Tests

#### Unit Test Example
```typescript
import { renderHook, act } from '@testing-library/react-hooks'
import { useTrips } from '@/hooks/useTrips'

test('useTrips hook', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useTrips())
  
  expect(result.current.loading).toBe(true)
  
  await waitForNextUpdate()
  
  expect(result.current.loading).toBe(false)
  expect(result.current.trips).toHaveLength(3)
})
```

#### E2E Test Example
```yaml
# .maestro/flows/login.yaml
appId: com.sabron.tripsync
---
- launchApp
- assertVisible: "Welcome"
- tapOn: "Email"
- inputText: "test@example.com"
- tapOn: "Password"
- inputText: "password123"
- tapOn: "Sign In"
- assertVisible: "Dashboard"
```

## Resources & Support

### Documentation
- [Technical Documentation](./TECHNICAL_DOCUMENTATION.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Testing Guide](./TESTING_GUIDE.md)

### Team Resources
- **Slack Channel**: #sabron-trip-sync-dev
- **JIRA Board**: [jira.sabron.com/trip-sync](https://jira.sabron.com/trip-sync)
- **Confluence**: [confluence.sabron.com/trip-sync](https://confluence.sabron.com/trip-sync)
- **Figma Designs**: [figma.com/sabron-trip-sync](https://figma.com/sabron-trip-sync)

### Key Contacts
- **Tech Lead**: John Doe (john.doe@sabron.com)
- **Product Manager**: Jane Smith (jane.smith@sabron.com)
- **QA Lead**: Bob Johnson (bob.johnson@sabron.com)
- **DevOps**: Alice Williams (alice.williams@sabron.com)

### Learning Resources

#### React Native
- [Official React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Express](http://www.reactnativeexpress.com)

#### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

#### State Management
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query/latest)

#### Testing
- [Testing Library Docs](https://testing-library.com/docs/react-native-testing-library/intro)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Maestro Documentation](https://maestro.mobile.dev)

### Common Issues & Solutions

#### Issue: Metro bundler won't start
```bash
# Solution
npx react-native start --reset-cache
rm -rf node_modules
pnpm install
```

#### Issue: iOS build fails
```bash
# Solution
cd ios
pod deintegrate
pod cache clean --all
pod install
cd ..
pnpm ios
```

#### Issue: Android build fails
```bash
# Solution
cd android
./gradlew clean
cd ..
pnpm android
```

### Getting Help

1. **Check Documentation**: Review relevant docs first
2. **Search Slack**: Someone may have faced the same issue
3. **Ask in Slack**: Post in #sabron-trip-sync-dev
4. **Create JIRA Ticket**: For bugs or blockers
5. **Schedule Pairing**: For complex issues

## Next Steps

### Week 1 Tasks
1. Complete environment setup
2. Run the app on all platforms
3. Review codebase structure
4. Make a documentation PR
5. Attend team standup

### Week 2 Tasks
1. Pick up first JIRA ticket
2. Implement a small feature
3. Write tests for your code
4. Submit PR for review
5. Participate in code reviews

### First Month Goals
- [ ] Complete 5+ JIRA tickets
- [ ] Participate in sprint planning
- [ ] Give a tech talk or demo
- [ ] Contribute to documentation
- [ ] Mentor a newer team member

---

Welcome aboard! We're excited to have you on the team. Remember, no question is too small - we're here to help you succeed.

**Happy Coding! 🚀**