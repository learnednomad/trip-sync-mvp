# Trip Sync v2 Developer Setup Guide

This guide will help you set up the Trip Sync v2 development environment in under 30 minutes.

## Prerequisites

### Required Software
- **Node.js** 18.x or higher
- **pnpm** 8.x or higher (`npm install -g pnpm`)
- **Git** 2.x or higher
- **Xcode** 15.0+ (for iOS development)
- **Android Studio** (for Android development)
- **VS Code** or **WebStorm** (recommended IDEs)

### Required Accounts
- [ ] **Supabase Account** - https://supabase.com
- [ ] **Expo Account** - https://expo.dev
- [ ] **Google Cloud Console** - https://console.cloud.google.com
- [ ] **Apple Developer Account** (for iOS) - https://developer.apple.com
- [ ] **Google Play Console** (for Android) - https://play.google.com/console

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/sabron-trip-sync.git
cd sabron-trip-sync

# Install dependencies
pnpm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Install Expo CLI globally
npm install -g expo-cli eas-cli
```

## Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - Project name: `trip-sync-dev`
   - Database password: (save securely)
   - Region: Choose closest to you
4. Wait for project to be ready (~2 minutes)

### 2.2 Get Supabase Credentials

1. Go to Settings > API
2. Copy:
   - Project URL
   - anon public key
   - service_role key (keep secret!)

### 2.3 Run Database Migrations

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Run migrations
supabase db push
```

## Step 3: External Services Setup

### 3.1 Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Directions API
4. Create credentials > API Key
5. Add restrictions:
   - iOS: Bundle ID restriction
   - Android: Package name restriction

### 3.2 OAuth Setup

#### Google OAuth
1. In Google Cloud Console > APIs & Services > Credentials
2. Create OAuth 2.0 Client IDs for:
   - Web application
   - iOS application
   - Android application
3. Add authorized redirect URIs:
   - `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

#### Apple Sign In
1. Go to Apple Developer Portal
2. Identifiers > Add Service ID
3. Configure Sign in with Apple
4. Add return URL: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

### 3.3 OCR Service (Choose One)

#### Option A: Google Document AI
1. Enable Document AI API in Google Cloud Console
2. Create service account
3. Download JSON key file

#### Option B: AWS Textract
1. Create IAM user with Textract permissions
2. Generate access keys

### 3.4 Exchange Rate API

1. Go to https://exchangerate-api.com
2. Sign up for free account
3. Get API key from dashboard

## Step 4: Environment Configuration

```bash
# Copy environment template
cp .env.example .env.development

# Edit with your credentials
code .env.development  # or use your preferred editor
```

Required variables to set:
```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
# ... etc (see .env.example for full list)
```

## Step 5: Run the Application

### Development Mode

```bash
# Start Metro bundler
pnpm start

# Run on iOS Simulator
pnpm ios

# Run on Android Emulator
pnpm android

# Run on web (limited functionality)
pnpm web
```

### Using Expo Go

1. Install Expo Go on your device
2. Run `pnpm start`
3. Scan QR code with:
   - iOS: Camera app
   - Android: Expo Go app

## Step 6: Verify Setup

Run the setup verification script:

```bash
# Run all checks
pnpm run doctor

# Expected output:
# ✅ Node.js version OK (18.x)
# ✅ pnpm installed
# ✅ Dependencies installed
# ✅ Environment variables configured
# ✅ Supabase connection successful
# ✅ External services configured
```

## Step 7: Development Workflow

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests (requires built app)
pnpm run e2e-test

# Type checking
pnpm run type-check

# Linting
pnpm run lint
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature-name
```

## Troubleshooting

### Common Issues

#### 1. Metro bundler errors
```bash
# Clear cache
pnpm start -- --reset-cache

# Clean and reinstall
rm -rf node_modules
pnpm install
```

#### 2. iOS build errors
```bash
# Clean build
cd ios && rm -rf build && pod install && cd ..

# Reset simulator
xcrun simctl erase all
```

#### 3. Android build errors
```bash
# Clean build
cd android && ./gradlew clean && cd ..

# Increase Java heap size
export JAVA_OPTS="-Xmx4g"
```

#### 4. Supabase connection errors
- Check if project is running at https://app.supabase.com
- Verify URL and keys in .env file
- Check network/firewall settings

#### 5. Type errors
```bash
# Regenerate types
pnpm run generate-types
```

## Development Tips

### 1. Use TypeScript Strictly
- Always define types for props and state
- Avoid `any` type
- Use type inference where possible

### 2. Follow Project Conventions
- Components: PascalCase
- Utilities: camelCase
- Constants: UPPER_SNAKE_CASE
- File names: kebab-case

### 3. Performance Best Practices
- Use `React.memo` for expensive components
- Implement proper list virtualization
- Optimize images with Expo Image
- Use lazy loading for screens

### 4. Testing Guidelines
- Write tests for critical paths
- Mock external services
- Test offline scenarios
- Verify error states

## Next Steps

1. Review [Architecture Documentation](./architecture.md)
2. Read [Coding Standards](./architecture/coding-standards.md)
3. Explore [Component Library](../src/components/README.md)
4. Join team Slack channel
5. Schedule onboarding session with team lead

## Support

- **Technical Issues**: Create GitHub issue
- **Setup Help**: Contact tech lead
- **Documentation**: See `/docs` folder
- **Team Chat**: Slack #trip-sync-dev

## Useful Commands Reference

```bash
# Development
pnpm start              # Start development server
pnpm ios               # Run on iOS
pnpm android           # Run on Android
pnpm web               # Run on web

# Environment-specific
pnpm start:staging     # Start with staging env
pnpm start:production  # Start with production env

# Testing
pnpm test              # Run unit tests
pnpm test:watch        # Watch mode
pnpm test:ci           # CI mode with coverage
pnpm e2e-test          # Run E2E tests

# Code Quality
pnpm lint              # Run ESLint
pnpm type-check        # TypeScript check
pnpm check-all         # Run all checks

# Building
pnpm prebuild          # Generate native projects
pnpm build:development:ios    # Build dev iOS
pnpm build:development:android # Build dev Android

# Utilities
pnpm doctor            # Check setup
pnpm clean             # Clean all caches
```

---

Welcome to the Trip Sync v2 team! 🚀