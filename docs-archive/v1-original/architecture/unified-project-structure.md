# Unified Project Structure

```plaintext
sabron-trip-sync/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── ci.yaml            # Test and lint workflow
│       └── deploy.yaml        # EAS Build workflow
├── .husky/                    # Git hooks
│   ├── pre-commit            # Lint staged files
│   └── commit-msg            # Validate commit messages
├── .vscode/                   # VS Code settings
│   └── settings.json         # Project-specific settings
├── .env.example              # Environment template
├── .env.development          # Development environment
├── .env.production           # Production environment
├── .gitignore               # Git ignore rules
├── .prettierrc.js           # Code formatting
├── app.config.ts            # Expo configuration
├── babel.config.js          # Babel configuration
├── eas.json                 # EAS Build configuration
├── eslint.config.mjs        # ESLint configuration
├── jest.config.js           # Jest test configuration
├── metro.config.js          # Metro bundler config
├── package.json             # Dependencies and scripts
├── pnpm-lock.yaml          # Locked dependencies
├── tailwind.config.js      # NativeWind configuration
├── tsconfig.json           # TypeScript configuration
├── app/                    # Expo Router app directory
│   ├── (auth)/             # Authentication screens
│   │   ├── _layout.tsx     # Auth layout
│   │   ├── sign-in.tsx     # Sign in screen
│   │   ├── sign-up.tsx     # Sign up screen
│   │   └── forgot-password.tsx
│   ├── (app)/              # Authenticated app
│   │   ├── _layout.tsx     # App layout
│   │   ├── (tabs)/         # Tab navigation
│   │   │   ├── _layout.tsx # Tab layout
│   │   │   ├── trips/      # Trips tab
│   │   │   │   ├── index.tsx
│   │   │   │   └── [id].tsx
│   │   │   ├── expenses.tsx
│   │   │   └── profile.tsx
│   │   └── modal/          # Modal screens
│   │       ├── add-expense.tsx
│   │       └── add-trip.tsx
│   └── _layout.tsx         # Root layout
├── assets/                 # Static assets
│   ├── fonts/             # Custom fonts
│   ├── images/            # Images and icons
│   └── splash.png         # Splash screen
├── src/                   # Source code
│   ├── components/        # React Native components
│   │   ├── common/        # Shared components
│   │   ├── expense/       # Expense components
│   │   ├── layout/        # Layout components
│   │   └── trip/          # Trip components
│   ├── constants/         # App constants
│   │   ├── Colors.ts      # Theme colors
│   │   └── Layout.ts      # Layout constants
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useOfflineSync.ts
│   │   └── useTrip.ts
│   ├── services/          # API services
│   │   ├── api.ts         # Supabase client
│   │   ├── auth.ts        # Auth service
│   │   ├── storage.ts     # MMKV storage
│   │   └── sync.ts        # Sync service
│   ├── stores/            # Zustand stores
│   │   ├── authStore.ts
│   │   ├── syncStore.ts
│   │   └── tripStore.ts
│   ├── types/             # TypeScript types
│   │   ├── database.ts    # Database types
│   │   ├── navigation.ts  # Navigation types
│   │   └── supabase.ts    # Generated types
│   └── utils/             # Utility functions
│       ├── date.ts        # Date formatting
│       ├── currency.ts    # Currency helpers
│       └── vectorClock.ts # Conflict resolution
├── supabase/              # Supabase configuration
│   ├── functions/         # Edge Functions
│   │   ├── webhooks/
│   │   │   └── push-notifications/
│   │   └── scheduled/
│   │       └── exchange-rates/
│   ├── migrations/        # Database migrations
│   │   ├── 001_initial_schema.sql
│   │   └── 002_add_partitions.sql
│   └── config.toml        # Supabase config
├── tests/                 # Test files
│   ├── components/        # Component tests
│   ├── hooks/            # Hook tests
│   ├── services/         # Service tests
│   └── e2e/              # Maestro E2E tests
│       ├── flows/        # Test flows
│       │   ├── auth.yaml
│       │   └── create-trip.yaml
│       └── config.yaml   # Maestro config
└── docs/                 # Documentation
    ├── prd.md            # Product requirements
    ├── architecture.md   # This document
    └── api/              # API documentation
```
