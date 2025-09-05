# Appendices

## A. Glossary of Terms
- **RLS**: Row Level Security (Supabase database feature)
- **MMKV**: High-performance key-value storage for React Native
- **Fabric**: React Native's new rendering system
- **Turbo Modules**: React Native's new native module system
- **JSI**: JavaScript Interface for direct native communication
- **Three-way Merge**: Conflict resolution comparing base, local, and remote versions
- **Vector Clocks**: Distributed system technique for ordering events and detecting conflicts
- **BaaS**: Backend-as-a-Service (Supabase in this project)
- **EAS**: Expo Application Services for building and deploying
- **PostgREST**: Automatic REST API from PostgreSQL schema
- **TOTP**: Time-based One-Time Password for 2FA
- **OCR**: Optical Character Recognition for receipt scanning

## B. References
- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Material Design 3](https://m3.material.io)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/)
- [NativeWind Documentation](https://www.nativewind.dev)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query)

## C. Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Jan 2025 | Initial PRD Creation | Product Team |
| 1.1 | Jan 2025 | Epic restructuring with infrastructure focus | Product Team |

## D. Epic Structure Summary (v1.1)
- **Epic 0**: Infrastructure & Environment Setup (NEW)
- **Epic 1**: Core Foundation & Components (NEW)
- **Epic 2**: Authentication & User Management
- **Epic 3**: Trip Management Core
- **Epic 4**: Offline Infrastructure & Sync
- **Epic 5**: Expense Tracking
- **Epic 6**: Real-time Collaboration (NEW)
- **Epic 7**: Testing & Quality Assurance (NEW)
- **Epic 8**: Polish & Production Readiness (NEW)

## E. External Services Required
1. **Supabase** - Backend infrastructure
2. **Google Maps API** - Location services
3. **OCR Service** - Receipt scanning (Google Document AI/AWS Textract)
4. **Exchange Rate API** - Currency conversion
5. **Push Notification Services** - iOS APNs, Android FCM
6. **Sentry** - Error monitoring
7. **OAuth Providers** - Google, Apple, Facebook

## F. Development Timeline
- **Project Kickoff**: January 27, 2025
- **Infrastructure Complete**: February 10, 2025
- **MVP Feature Complete**: July 28, 2025
- **Beta Testing Start**: August 1, 2025
- **Production Release**: September 1, 2025

---

**END OF DOCUMENT**