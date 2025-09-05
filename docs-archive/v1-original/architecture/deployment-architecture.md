# Deployment Architecture

## Deployment Strategy

**Frontend Deployment:**
- **Platform:** Expo Application Services (EAS)
- **Build Command:** `eas build --platform all --profile production`
- **Output Directory:** Managed by EAS
- **CDN/Edge:** Expo CDN for OTA updates

**Backend Deployment:**
- **Platform:** Supabase Cloud (managed PostgreSQL + services)
- **Build Command:** `pnpm supabase db push --linked`
- **Deployment Method:** Git-based migrations + Edge Function deployment

## CI/CD Pipeline
```yaml
# .github/workflows/deploy.yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - name: Install dependencies
        run: pnpm install
      - name: Run tests
        run: pnpm test
      - name: Run E2E tests
        run: pnpm test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Build on EAS
        run: eas build --platform all --profile production --non-interactive

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Supabase
        run: |
          pnpm supabase db push --linked
          pnpm supabase functions deploy
      - name: Submit to stores
        run: eas submit --platform all --profile production
```

## Environments
| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|----------|
| Development | exp://localhost:8081 | http://localhost:54321 | Local development |
| Staging | https://staging.sabron-trip-sync.app | https://staging-project.supabase.co | Pre-production testing |
| Production | https://apps.apple.com/... & https://play.google.com/... | https://your-project.supabase.co | Live environment |
