# Trip Sync E2E Test Suite

Comprehensive E2E tests for all MVP epics using Maestro.

## Test Structure

```
.maestro/
├── tests/
│   ├── epic-1-core-foundation.yaml    # Theme, navigation, UI components
│   ├── epic-2-authentication.yaml     # Signup, signin, profile
│   ├── epic-3-trip-management.yaml    # Create, join, list trips
│   ├── epic-4-offline-sync.yaml       # Offline mode, caching, sync
│   ├── epic-5-expense-tracking.yaml   # Add expenses, balances
│   ├── epic-6-collaboration.yaml      # Real-time updates (2 devices)
│   └── full-mvp-e2e.yaml             # Run all tests
├── helpers/
│   ├── login-test-user.yaml          # Reusable login flow
│   └── create-test-trip.yaml          # Reusable trip creation
└── README.md                          # This file
```

## Running Tests

### Prerequisites
```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Start your app
pnpm ios # or pnpm android
```

### Run Individual Epic Tests
```bash
# Test a specific epic
maestro test .maestro/tests/epic-1-core-foundation.yaml
maestro test .maestro/tests/epic-2-authentication.yaml
maestro test .maestro/tests/epic-3-trip-management.yaml
maestro test .maestro/tests/epic-4-offline-sync.yaml
maestro test .maestro/tests/epic-5-expense-tracking.yaml
```

### Run Collaboration Test (Requires 2 Devices)
```bash
# Start two simulators/devices
# Then run:
ENABLE_COLLABORATION_TEST=true maestro test .maestro/tests/epic-6-collaboration.yaml
```

### Run Full Test Suite
```bash
# Run all tests
maestro test .maestro/tests/full-mvp-e2e.yaml

# Run with collaboration tests
ENABLE_COLLABORATION_TEST=true maestro test .maestro/tests/full-mvp-e2e.yaml
```

## Test Data Setup

Before running tests, ensure:
1. Test database is seeded
2. Test user exists: test@example.com / TestPassword123!
3. Friend user exists: friend@example.com / TestPassword123!

## CI Integration

Add to your CI pipeline:
```yaml
# .github/workflows/e2e-tests.yml
- name: Run E2E Tests
  run: |
    maestro cloud \
      --apiKey ${{ secrets.MAESTRO_API_KEY }} \
      .maestro/tests/full-mvp-e2e.yaml
```

## Test Coverage

| Epic | Feature | Test File | Coverage |
|------|---------|-----------|----------|
| 1 | Core Foundation | epic-1-core-foundation.yaml | ✅ |
| 2 | Authentication | epic-2-authentication.yaml | ✅ |
| 3 | Trip Management | epic-3-trip-management.yaml | ✅ |
| 4 | Offline & Sync | epic-4-offline-sync.yaml | ✅ |
| 5 | Expense Tracking | epic-5-expense-tracking.yaml | ✅ |
| 6 | Collaboration | epic-6-collaboration.yaml | ✅ |
| 7 | Testing & Polish | N/A - Meta epic | - |
| 8 | Production Release | N/A - Deployment | - |

## Debugging Failed Tests

```bash
# Run with more output
maestro test --debug .maestro/tests/epic-1-core-foundation.yaml

# Take screenshots on failure
maestro test --screenshot-on-failure .maestro/tests/epic-2-authentication.yaml

# Record video
maestro record .maestro/tests/epic-3-trip-management.yaml
```

## Best Practices

1. **Run tests on clean state**: Each test starts with `clearState: true`
2. **Use helpers**: Reuse common flows like login
3. **Test offline**: Epic 4 tests require airplane mode
4. **Test real-time**: Epic 6 needs 2 devices/simulators
5. **Keep tests fast**: Avoid unnecessary waits

## Troubleshooting

**Test fails with "Element not found"**
- Check element IDs match your code
- Add `waitForAnimationToEnd` after navigation
- Use `assertVisible` with regex for dynamic content

**Collaboration tests not running**
- Ensure `ENABLE_COLLABORATION_TEST=true` is set
- Start two simulators before running
- Check both devices have different user accounts

**Offline tests flaky**
- Ensure airplane mode toggle works on your simulator
- Add delays after toggling airplane mode
- Check offline banner implementation