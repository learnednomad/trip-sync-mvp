# Section 11: Migration and Deployment Plan

## Database Migration Strategy

```sql
-- Migration: 001_initial_schema.sql
BEGIN;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create tables with versioning
CREATE TABLE schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial schema creation
CREATE TABLE public.user_profiles (
  -- Schema from Section 6
);

-- Insert migration record
INSERT INTO schema_migrations (version) VALUES (1);

COMMIT;

-- Migration: 002_add_offline_sync.sql
BEGIN;

-- Add sync metadata
ALTER TABLE public.trips 
  ADD COLUMN sync_version INTEGER DEFAULT 1,
  ADD COLUMN last_synced_at TIMESTAMPTZ,
  ADD COLUMN offline_changes JSONB DEFAULT '[]';

-- Create sync conflict resolution table
CREATE TABLE public.sync_conflicts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  local_version JSONB,
  server_version JSONB,
  resolved BOOLEAN DEFAULT FALSE,
  resolution JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO schema_migrations (version) VALUES (2);

COMMIT;
```

## Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:ci
      - run: pnpm lint
      - run: pnpm typecheck

  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform ios --profile production --non-interactive

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform android --profile production --non-interactive

  deploy:
    needs: [build-ios, build-android]
    runs-on: ubuntu-latest
    steps:
      - uses: expo/expo-github-action@v8
      - run: eas submit --platform all --profile production --non-interactive
```

---
