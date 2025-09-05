# Tech Stack

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|----------|-----------|
| Frontend Language | TypeScript | 5.8.3 | Type-safe development | Industry standard for large React Native apps |
| Frontend Framework | React Native | 0.79.4 | Cross-platform mobile | Latest stable with New Architecture support |
| UI Component Library | React Native Elements + Custom | 4.0.0-rc.8 | UI components | Lightweight with good customization options |
| State Management | Zustand + TanStack Query | 5.0.5 / 5.52.1 | Local state + server state | Simple API with powerful caching capabilities |
| Backend Language | TypeScript (Edge Functions) | 5.8.3 | Webhook handlers only | Consistency with frontend codebase |
| Backend Framework | Supabase Functions | Latest | Minimal serverless functions | Only for webhooks to avoid cold starts |
| API Style | PostgREST (REST) | Auto-generated | Database API | Zero-latency API generation from schema |
| Database | PostgreSQL | 15+ | Primary datastore | Advanced features for business logic |
| Cache | MMKV | 3.1.0 | Local caching | Fastest React Native storage solution |
| File Storage | Supabase Storage | Latest | Media storage | S3-compatible with RLS integration |
| Authentication | Supabase Auth | Latest | Multi-provider auth | Built-in with RLS integration |
| Frontend Testing | Jest + React Native Testing Library | 29.7.0 / 15.0.0 | Unit/component tests | Standard React Native testing stack |
| Backend Testing | Jest + Supertest | 29.7.0 / 6.3.4 | Function tests | Minimal due to database-driven logic |
| E2E Testing | Maestro | 1.37.0 | End-to-end testing | User's explicit preference, great for React Native |
| Build Tool | Expo CLI | 53.0.0 | Build orchestration | Integrated with Expo ecosystem |
| Bundler | Metro | 0.81.0 | JavaScript bundling | Default React Native bundler |

| CI/CD | GitHub Actions + EAS Build | Latest | Automated deployment | Native integration with Expo |
| Monitoring | Sentry | 8.32.0 | Error tracking | React Native specific features |
| Logging | Flipper + Custom | 0.260.0 | Debug logging | Development and production insights |
| CSS Framework | NativeWind | 4.1.23 | Styling | TailwindCSS for React Native |
