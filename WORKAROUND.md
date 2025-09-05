# iOS App Metro Bundler Error Workaround

## Problem
The app encounters a `SyntaxError: Unexpected token, expected "{" (28:8)` during Metro bundling when running `pnpm ios` or `expo run:ios`.

## Root Cause
The error occurs in the Metro bundler's sucrase parser at the `parseImportSpecifiers` function. Despite extensive debugging:
- All source files have correct syntax
- All dependencies are installed
- The native iOS build succeeds
- The error happens before any app code is parsed

## Workarounds

### Option 1: Run from Xcode (Recommended)
1. Open Xcode: `pnpm xcode` or `xed -b ios`
2. Select your simulator or device
3. Press the Run button (⌘R)
4. The app should launch without the Metro bundler error

### Option 2: Use Expo Go (Development Only)
1. Install Expo Go on your iOS device/simulator
2. Run: `npx expo start`
3. Scan the QR code or press 'i' for iOS simulator

### Option 3: Try Different Metro Cache Clear
```bash
watchman watch-del-all
rm -rf node_modules/.cache/metro
rm -rf .expo
npx expo start -c
```

### Option 4: Downgrade Dependencies
If the issue persists, it might be related to expo-router v5.1.5. Consider:
1. Downgrading to expo-router v5.0.x
2. Or waiting for a patch release

## Next Steps
1. File an issue with expo-router if not already reported
2. Monitor for updates to expo-router or Metro bundler
3. Use Xcode builds for now to continue development

## Notes
- The iOS build itself works fine
- The issue is specifically with Metro's JavaScript bundling
- All app code has been verified to be syntactically correct