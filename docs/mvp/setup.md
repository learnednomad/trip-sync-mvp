# Trip Sync MVP - Quick Setup Guide

**Time to first screen**: ~10 minutes

## Prerequisites

- macOS with Xcode 14+ (for iOS development)
- Node.js 18+ and pnpm
- Android Studio (for Android development)
- VS Code or preferred editor

## Quick Start

### 1. Clone and Install (2 min)

```bash
# Clone the repository
git clone https://github.com/yourusername/sabron-trip-sync.git
cd sabron-trip-sync

# Install dependencies
pnpm install
```

### 2. Environment Setup (3 min)

```bash
# Copy environment template
cp .env.example .env.development

# Edit .env.development with your values:
EXPO_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

**Note**: For complete authentication setup including OAuth providers, see the [Authentication Guide](./authentication-guide.md).

### 3. Run the App (5 min)

```bash
# Start the development server
pnpm start

# In a new terminal, run on iOS
pnpm ios

# OR run on Android
pnpm android
```

## Detailed Setup

### Supabase Configuration

1. **Database Tables** (already created via migrations):
   - users
   - trips
   - trip_members
   - expenses
   - expense_splits

2. **Row Level Security** (RLS):
   ```sql
   -- Already configured in migrations
   -- Users can only see their own trips
   -- Trip members can see trip expenses
   ```

3. **Edge Functions** (if needed):
   ```bash
   # Deploy functions
   supabase functions deploy
   ```

### Apple Developer Setup (iOS)

1. **Bundle ID**: `com.sabron.tripsync`
2. **Capabilities**: Sign in with Apple
3. **Team ID**: Add to `.env.development`
4. **Deep Linking**: Configure `sabronsync://` scheme

For detailed Apple Sign In setup, see the [Authentication Guide](./authentication-guide.md#apple-sign-in-ios).

### Development Workflow

```bash
# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint code
pnpm lint

# Format code
pnpm format
```

### Common Commands

| Command | Description |
|---------|-------------|
| `pnpm start` | Start Expo dev server |
| `pnpm ios` | Run on iOS simulator |
| `pnpm android` | Run on Android emulator |
| `pnpm test` | Run test suite |
| `pnpm build:ios` | Build iOS app |
| `pnpm build:android` | Build Android app |

## Project Structure

```
src/
├── app/               # Screens (Expo Router)
├── components/        # UI components
│   ├── ui/           # Base components
│   └── features/     # Feature components
├── lib/              # Core utilities
├── store/            # State management
├── api/              # API queries
└── theme/            # Theme config
```

## First Steps After Setup

1. **Run the app** and verify it launches
2. **Create an account** using email
3. **Create your first trip**
4. **Add an expense**
5. **Test offline mode** (airplane mode)

## Troubleshooting

### iOS Issues

```bash
# Clear Metro cache
pnpm start --clear

# Reset iOS simulator
xcrun simctl erase all

# Reinstall pods
cd ios && pod install
```

### Android Issues

```bash
# Clean Android build
cd android && ./gradlew clean

# Reset Metro bundler
npx react-native start --reset-cache
```

### Common Errors

**"Unable to resolve module"**
```bash
pnpm install
pnpm start --clear
```

**"Supabase connection failed"**
- Check `.env.development` values
- Verify Supabase project is running
- Check network connection

**"Build failed"**
```bash
# Full reset
rm -rf node_modules
rm -rf ios/Pods
pnpm install
cd ios && pod install
```

## Development Tips

### Hot Reload
- Press `r` in terminal to reload
- Shake device for dev menu

### Debugging
```javascript
// Use Flipper for debugging
console.log('Debug:', data);

// Or React Native Debugger
debugger;
```

### Testing Changes
1. Make code changes
2. Save file (hot reload)
3. Test on both platforms
4. Run tests: `pnpm test`

## Next Steps

1. Review [Architecture](./architecture.md)
2. Read [Authentication Guide](./authentication-guide.md) for auth implementation
3. Check [API Reference](./api-reference.md)
4. Read current [User Stories](/docs/stories/)
5. Start coding! 🚀

## Support

- **Docs**: `/docs/mvp/`
- **Stories**: `/docs/stories/`
- **Issues**: GitHub Issues

---

Remember: This is MVP. Keep it simple!