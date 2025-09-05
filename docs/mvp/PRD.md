# Trip Sync MVP - Product Requirements Document

**Version**: 1.0 MVP  
**Date**: January 2025  
**Status**: Active Development

## Executive Summary

Trip Sync MVP is a mobile-first expense splitting application focused on delivering core functionality in 3 months. This document defines the minimal viable product that validates our core value proposition.

### Core Value Proposition
> "Create trips, track expenses, split costs with friends, work offline"

Everything else is v2.

### Key MVP Metrics
- **Timeline**: 3 months development + 2 weeks buffer
- **Scope**: 120 story points (40% of original scope)
- **Platforms**: iOS and Android via React Native
- **Team Size**: 2-3 developers

## Product Overview

### What We're Building
A simple mobile app where users can:
1. Create trips and invite friends
2. Track shared expenses
3. Split costs automatically
4. Work offline and sync later

### What We're NOT Building (v2)
- Complex expense categories
- Receipt scanning/OCR
- Currency conversion
- Public trip sharing
- Advanced analytics
- Web version
- Complex animations
- Platform-specific UI

## User Personas (MVP)

### Primary: The Trip Organizer
- **Name**: Sarah, 28
- **Need**: Track shared expenses on a weekend trip
- **Pain**: Keeping track of who paid what
- **Goal**: Fair expense splitting without spreadsheets

### Secondary: The Trip Participant
- **Name**: Mike, 30
- **Need**: Know what he owes
- **Pain**: Unclear on trip expenses
- **Goal**: Pay his fair share easily

## Epic Structure

### Epic 0: Infrastructure (Week 1)
**Goal**: Development environment ready

Key deliverables:
- Supabase project configured ✅
- Apple Developer account setup ✅
- Basic CI/CD pipeline
- Development environment

### Epic 1: Core Foundation (Week 2-3)
**Goal**: Basic UI components and navigation

Stories:
1. Basic Theme System (3 points) ✅
2. Essential UI Components (8 points) ✅
3. Basic Navigation (4 points) ✅
4. Simple State Setup (3 points) ✅

### Epic 2: Authentication (Week 4-5)
**Goal**: Users can create accounts and sign in

Key features:
- Email/password authentication
- Apple Sign In (iOS requirement)
- Session management
- Basic profile

### Epic 3: Trip Management (Week 6-7)
**Goal**: Users can create and manage trips

Core features:
- Create trip (name, dates)
- Invite friends via link
- View trip list
- Basic trip details

### Epic 4: Offline & Sync (Week 8-9)
**Goal**: App works without internet

Implementation:
- MMKV local storage
- Offline queue for changes
- Simple conflict resolution (last write wins)
- Sync on reconnect

### Epic 5: Expense Tracking (Week 10-11)
**Goal**: Track and split expenses

Features:
- Add expense (amount, payer, description)
- Select expense participants
- Equal splitting only (MVP)
- View expense list
- Running balances

### Epic 6: Basic Collaboration (Week 12)
**Goal**: Real-time updates for trip members

Features:
- See expenses added by others
- Real-time balance updates
- Join trip via invite link

### Epic 7: Testing & Polish (Week 13)
**Goal**: Production-ready quality

Focus areas:
- Core user flows testing
- Performance optimization
- Bug fixes
- App store assets

### Epic 8: Production Release (Week 14)
**Goal**: Launch on app stores

Tasks:
- App store submission
- Production environment
- Basic monitoring
- 1.0 release

## Functional Requirements

### Authentication
- **FR1**: Email/password signup with verification
- **FR2**: Apple Sign In for iOS
- **FR3**: Persistent sessions
- **FR4**: Simple forgot password

### Trip Management
- **FR5**: Create trip with name and dates
- **FR6**: Generate shareable invite link
- **FR7**: View list of my trips
- **FR8**: Leave a trip

### Expense Management
- **FR9**: Add expense with amount and description
- **FR10**: Select who paid
- **FR11**: Select participants (equal split only)
- **FR12**: View expense list by trip
- **FR13**: See running balances

### Offline Support
- **FR14**: All features work offline
- **FR15**: Queue changes when offline
- **FR16**: Auto-sync when online
- **FR17**: Show offline indicator

### Collaboration
- **FR18**: Real-time updates for trip members
- **FR19**: See who added expenses
- **FR20**: Notification when balances change

## Non-Functional Requirements

### Performance
- App launch: <2 seconds
- Screen transitions: <300ms
- Offline detection: <1 second
- Sync completion: <5 seconds

### Reliability
- 99% crash-free sessions
- Offline mode always works
- No data loss during sync

### Usability
- Single tap to add expense
- 3 taps max for any action
- Clear offline indicators
- Obvious sync status

### Security
- Encrypted local storage
- Secure authentication
- Row-level security in database
- No sensitive data in logs

## Technical Constraints

### Platform Requirements
- iOS 13+ (90%+ coverage)
- Android 6+ (95%+ coverage)
- Phone only (no tablet optimization)

### Development Stack
- React Native 0.79.5
- Expo SDK 53
- Supabase backend
- No custom native modules

### Data Limits (MVP)
- 100 trips per user
- 50 members per trip
- 500 expenses per trip
- 90 day data retention

## Success Metrics

### Launch Metrics
- Successfully deployed to both stores
- <5 crash reports in first week
- Core flows working for 95%+ users

### User Metrics (First Month)
- 100+ downloads
- 50+ active trips created
- 70% of users complete first expense
- 4.0+ app store rating

### Technical Metrics
- <2% crash rate
- <3s average load time
- 90%+ successful sync rate
- <100MB app size

## MVP Exclusions

To maintain focus, these features are explicitly excluded:
- Receipt photos/OCR
- Expense categories
- Custom split ratios
- Currency conversion
- Trip templates
- Recurring expenses
- Export/reports
- Social features
- Web version
- Advanced animations
- Detailed analytics
- Multiple payment methods
- Settlement suggestions

## Development Principles

1. **Mobile First**: Every decision optimizes for mobile
2. **Offline First**: Assume no connection
3. **Simple First**: Choose simple over clever
4. **User First**: Core flow over edge cases
5. **Ship First**: Launch beats perfection

## Release Plan

### Beta Release (Week 13)
- TestFlight/Internal testing
- 20-30 beta users
- Focus on core flows

### Production Release (Week 15)
- Soft launch
- No marketing initially
- Gather feedback
- Iterate quickly

## Appendix: Simplified Data Model

### Core Entities

**User**
- id, email, name, avatar_url
- created_at, theme_preference

**Trip**
- id, name, start_date, end_date
- created_by, invite_code
- created_at, updated_at

**TripMember**
- trip_id, user_id, role
- joined_at, is_active

**Expense**
- id, trip_id, amount, description
- paid_by, created_by
- created_at, updated_at

**ExpenseSplit**
- expense_id, user_id
- amount_owed
- created_at

This MVP PRD supersedes all previous documentation. When in doubt, choose the simpler option.