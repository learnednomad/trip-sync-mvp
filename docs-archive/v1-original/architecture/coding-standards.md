# Coding Standards

## Critical Fullstack Rules
- **Type Sharing:** Always define types in src/types and import from there
- **API Calls:** Never make direct HTTP calls - use the service layer
- **Environment Variables:** Access only through config objects, never process.env directly
- **Error Handling:** All API routes must use the standard error handler
- **State Updates:** Never mutate state directly - use proper state management patterns
- **Async Operations:** Always handle loading and error states in UI
- **Offline First:** All features must work offline with proper sync
- **Security:** Never expose sensitive data in client code

## Naming Conventions
| Element | Frontend | Backend | Example |
|---------|----------|---------|----------|
| Components | PascalCase | - | `UserProfile.tsx` |
| Hooks | camelCase with 'use' | - | `useAuth.ts` |
| API Routes | - | kebab-case | `/api/user-profile` |
| Database Tables | - | snake_case | `user_profiles` |
