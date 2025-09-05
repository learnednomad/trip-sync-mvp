# Changelog

All notable changes to the Sabron Trip Sync project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced navigation system with Expo Router v3 best practices
- TypeScript navigation type definitions for type-safe routing
- Protected route patterns for authentication flow
- Shared modal routes group for cross-tab accessible screens
- Lazy loading for tab screens to improve performance
- Index route as navigation fallback
- User profile, trip invite, expense details, and trip settings modal screens

### Fixed
- Fixed typo in catch-all route filename (`[...messing].tsx` → `[...missing].tsx`)
- Resolved hot reload navigation issue causing 404 screens
- Fixed navigation state persistence during development
- Improved authentication flow with better loading states
- Added auto-recovery mechanism for 404 screens with 2-second auto-redirect

### Changed
- Optimized root layout authentication flow with navigation readiness checks
- Enhanced auth group layout with protected route redirects
- Improved tabs layout with authentication guards
- Updated 404 screen with better UX and auto-redirect functionality
- Added gesture controls and animations to navigation transitions

### Technical Improvements
- Added `unstable_settings` for initial route configuration
- Implemented empty segments detection for hot reload scenarios
- Added navigation state management for better reliability
- Improved error boundaries and fallback mechanisms

## [0.1.0] - 2025-01-09

### Initial MVP Setup
- Basic Theme System (Story 1.1)
- Essential UI Components (Story 1.2)
- Basic Navigation Setup (Story 1.3)
- Authentication implementation with Supabase
- File-based routing with Expo Router
- Tab navigation with 4 main sections: Home, Trips, Explore, Settings
- Stack navigation within each tab
- React Native MMKV for encrypted local storage
- Zustand for state management
- TanStack Query for server state
- NativeWind v4 for styling