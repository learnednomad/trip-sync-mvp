# Section 19: Documentation and Support

## User Documentation

```markdown
# Trip Sync User Guide

# Getting Started
1. **Download the App**: Available on iOS App Store and Google Play
2. **Create Account**: Sign up with email or social login
3. **Create First Trip**: Tap the + button to start planning
4. **Invite Friends**: Share trip code or send invites
5. **Start Planning**: Add activities, flights, and accommodations

# Key Features

## Offline Mode
Trip Sync works completely offline. All changes sync automatically when you reconnect.

## Expense Splitting
1. Add an expense
2. Select who paid
3. Choose split method
4. App calculates who owes whom

## Collaborative Planning
- Real-time updates
- See who's viewing/editing
- Comment on activities
- Vote on decisions
```

## Developer Documentation

```markdown
# Trip Sync Developer Guide

# Architecture Overview
- **Frontend**: React Native + Expo
- **State**: Zustand + React Query
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Storage**: MMKV for offline data

# Local Development

\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Run on iOS
pnpm ios

# Run on Android
pnpm android
\`\`\`

# Testing

\`\`\`bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type checking
pnpm typecheck
\`\`\`

# Deployment

\`\`\`bash
# Build for production
eas build --platform all --profile production

# Submit to stores
eas submit --platform all
\`\`\`
```

---
