# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sabron Trip Sync is a React Native/Expo mobile application for managing trips with real-time expense splitting. The app uses an adaptive design system that provides platform-specific UIs for iOS and Android while maintaining a unified codebase.

## Technology Stack

- **React Native 0.79.5** with **Expo SDK ~53.0.22**
- **TypeScript** throughout the codebase
- **Expo Router v5** for file-based navigation
- **NativeWind v4** (Tailwind CSS for React Native)
- **Zustand v5** for local state management
- **TanStack Query v5** with React Query Kit for server state
- **Supabase** for backend (auth, database, realtime, storage)
- **React Native MMKV** for encrypted local storage

## Key Commands

### Development
```bash
# Install dependencies (use pnpm)
pnpm install

# Run on iOS
pnpm ios

# Run on Android  
pnpm android

# Run on specific environment
pnpm ios:staging
pnpm android:production

# Start Expo dev server
pnpm start
```

### Testing
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage (must meet 70% threshold)
pnpm test:coverage

# Run a single test file
pnpm test -- path/to/test.test.tsx

# E2E tests with Maestro
pnpm maestro:test
```

### Code Quality
```bash
# Lint and fix
pnpm lint
pnpm lint:fix

# Type checking
pnpm typecheck

# Format code
pnpm prettier
```

### Building
```bash
# Development build
eas build --platform ios --profile development
eas build --platform android --profile development

# Production build
eas build --platform ios --profile production
eas build --platform android --profile production
```

## Architecture Principles

### Adaptive Design System
The app uses platform-specific components that automatically adapt to iOS and Android design languages:
- iOS: HIG compliance with translucent glass morphism UI
- Android: Material Design 3 with Material You theming

Key adaptive components are in `src/components/base/` - use these for any UI that should differ between platforms.

### State Management Architecture
1. **Local/UI State**: Zustand stores in `src/store/`
2. **Server State**: TanStack Query hooks in `src/api/`
3. **Persistent Storage**: MMKV through `src/lib/storage/`
4. **Offline Queue**: Sync service in `src/services/sync/`

### Component Structure
- Components should be under 80 lines
- Use functional components with TypeScript
- Memoize expensive computations with useMemo
- Extract complex logic into custom hooks
- Co-locate test files (*.test.tsx)

### API Layer
- API hooks are auto-generated in `src/api/`
- Use React Query Kit for type-safe API calls
- Implement optimistic updates for better UX
- Handle offline scenarios with sync queue

## File Organization

```
src/
├── api/          # Generated API hooks (don't edit directly)
├── app/          # Expo Router screens
├── components/   
│   ├── base/     # Platform-adaptive components
│   ├── common/   # Shared components
│   ├── ui/       # Core UI components (Button, Input, etc.)
│   └── [feature]/# Feature-specific components
├── hooks/        # Custom React hooks
├── lib/          # Core utilities
├── services/     # Business logic
├── store/        # Zustand stores
└── types/        # TypeScript types
```

## Code Style Guidelines

- **Naming**: Use kebab-case for files, PascalCase for components
- **Imports**: Use absolute imports with @ prefix
- **Styling**: Use NativeWind classes with tailwind-variants for variants
- **TypeScript**: Prefer interfaces over types, avoid any
- **Testing**: Minimum 70% coverage, test user interactions over implementation

## Key Patterns to Follow

### Creating a New Screen
1. Add file to `src/app/` following Expo Router conventions
2. Use `SafeAreaView` from react-native-safe-area-context
3. Apply adaptive styling based on platform
4. Handle loading/error states with TanStack Query

### Adding API Endpoints
1. Define endpoint in Supabase
2. Generate hooks using React Query Kit
3. Handle optimistic updates and error recovery
4. Test offline behavior

### Platform-Specific Code
```typescript
// Use Platform.select for simple cases
const styles = {
  padding: Platform.select({ ios: 20, android: 16 })
};

// Use adaptive components for complex UI
import { AdaptiveButton } from '@/components/base';
```

## Testing Requirements

- Write tests for all new features
- Use React Native Testing Library
- Mock external dependencies (Supabase, MMKV)
- Test both iOS and Android behaviors
- Ensure offline scenarios are covered

## Supabase Integration

- Database types are auto-generated in `src/types/database.types.ts`
- Use Row Level Security (RLS) for all tables
- Handle realtime subscriptions in services
- Implement proper error boundaries

## Performance Considerations

- Lazy load heavy screens with React.lazy
- Use FlashList for large lists
- Optimize images with expo-image
- Monitor bundle size (keep under 5MB)
- Profile with React DevTools

## Deployment

The app uses EAS Build for CI/CD:
- Development builds for testing
- Preview builds for stakeholder review  
- Production builds for app stores

Environment variables are managed through:
- `.env.*` files for local development
- EAS Secrets for CI/CD builds
- `env.js` for runtime configuration

## BMad Integration

The project includes BMad agents in `.claude/commands/BMad/` for various development tasks. Reference these for complex operations or when specific methodologies are needed.

## Important References

- Design System: `docs/DESIGN_SYSTEM.md`
- API Documentation: `tempsd/API_DOCUMENTATION.md`
- Architecture: `tempsd/ARCHITECTURE.md`
- Product Requirements: `tempsd/TRIP_SYNC_V2_COMPLETE_PRD.md`