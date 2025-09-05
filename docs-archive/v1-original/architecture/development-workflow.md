# Development Workflow

## Local Development Setup

### Prerequisites
```bash
# Required tools and versions
node --version  # v20.11.0 or higher
pnpm --version  # v9.0.0 or higher
watchman --version  # Latest
pod --version  # 1.15.0 or higher (macOS)

# iOS development (macOS only)
xcode-select --version  # Xcode 15.0+

# Android development
java --version  # JDK 17
$ANDROID_HOME  # Android SDK path set
```

### Initial Setup
```bash
# Clone repository
git clone https://github.com/yourusername/sabron-trip-sync.git
cd sabron-trip-sync

# Install dependencies
pnpm install

# iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Setup environment
cp .env.example .env.development
# Edit .env.development with your Supabase credentials

# Setup Supabase locally (optional)
pnpm supabase start
pnpm supabase db reset

# Pre-build for development
pnpm expo prebuild
```

### Development Commands
```bash
# Start all services
pnpm dev

# Start frontend only
pnpm expo start

# Start backend only
pnpm supabase start

# Run tests
pnpm test              # Unit tests
pnpm test:e2e         # Maestro E2E tests
```

## Environment Configuration

### Required Environment Variables
```bash
# Frontend (.env.local)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Backend (.env)
SUPABASE_SERVICE_KEY=your-service-key
EXCHANGE_API_KEY=your-exchange-api-key
EXPO_PUSH_TOKEN=your-expo-push-token

# Shared
NODE_ENV=development
```
