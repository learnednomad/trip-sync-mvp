# Trip Sync MVP Documentation

Welcome to the Trip Sync MVP documentation. This directory contains all technical documentation for the MVP release.

## Documentation Structure

### 📋 Core Documents

1. **[Product Requirements (PRD)](./PRD.md)** - What we're building and why
   - MVP scope and timeline
   - User personas and epics
   - Feature prioritization

2. **[Technical Architecture](./architecture.md)** - How we're building it
   - Technology stack and decisions
   - System architecture
   - Performance targets
   - Security considerations

3. **[Quick Setup Guide](./setup.md)** - Get started in 10 minutes
   - Prerequisites
   - Installation steps
   - Common commands
   - Troubleshooting

4. **[Authentication Guide](./authentication-guide.md)** - Complete auth implementation
   - Supabase Auth setup
   - All authentication methods (Email, Apple, Google, Magic Link, SMS, Anonymous)
   - Session management
   - Security best practices
   - Implementation examples

5. **[API Reference](./api-reference.md)** - Endpoint documentation
   - Authentication endpoints
   - Trip management APIs
   - Expense tracking APIs
   - Real-time subscriptions

## Quick Links

### For Developers
- Start with the [Setup Guide](./setup.md)
- Review the [Architecture](./architecture.md) for system design
- Implement auth using the [Authentication Guide](./authentication-guide.md)
- Check [API Reference](./api-reference.md) for endpoints

### For Product/Design
- Read the [PRD](./PRD.md) for feature scope
- Review user personas and journeys
- Check epic structure and timeline

### For QA/Testing
- Review test requirements in each epic
- Check acceptance criteria in user stories
- See testing guidelines in architecture doc

## MVP Timeline

- **Week 1**: Infrastructure setup (Epic 0)
- **Week 2-3**: Core foundation (Epic 1)
- **Week 4-5**: Authentication (Epic 2)
- **Week 6-7**: Trip management (Epic 3)
- **Week 8-9**: Offline & sync (Epic 4)
- **Week 10-11**: Expense tracking (Epic 5)
- **Week 12**: Basic collaboration (Epic 6)
- **Week 13-14**: Testing & polish (Epic 7)
- **Week 15**: Production release (Epic 8)

## Key Decisions

1. **Mobile-only MVP** - No web version
2. **Offline-first** - Core differentiator
3. **Simple UI** - Functional over fancy
4. **Equal splits only** - Covers 80% of use cases
5. **Last-write-wins sync** - Simple conflict resolution

## Support

- **User Stories**: `/docs/stories/`
- **Design System**: `/docs/DESIGN_SYSTEM.md`
- **Issues**: GitHub Issues
- **Internal Docs**: `/tempsd/`

---

Remember: This is an MVP. When in doubt, choose the simpler option that still delivers core value.