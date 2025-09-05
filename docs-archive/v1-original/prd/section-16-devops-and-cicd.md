# Section 16: DevOps and CI/CD

## CI/CD Pipeline Configuration

```yaml
# eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_ENV": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_ENV": "staging"
      }
    },
    "production": {
      "env": {
        "APP_ENV": "production"
      },
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "team@tripsync.app",
        "ascAppId": "123456789"
      },
      "android": {
        "serviceAccountKeyPath": "./android-service-account.json",
        "track": "production"
      }
    }
  }
}
```

## Monitoring and Observability

```typescript
// Sentry Configuration
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.APP_ENV,
  enableInExpoDevelopment: false,
  debug: __DEV__,
  integrations: [
    new Sentry.Native.ReactNativeTracing({
      tracingOrigins: ['localhost', /^\//],
      routingInstrumentation: new Sentry.Native.ReactNavigationInstrumentation(
        navigation,
      ),
    }),
  ],
  tracesSampleRate: 1.0,
  beforeSend: (event) => {
    // Sanitize sensitive data
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});

// Performance Monitoring
export const measurePerformance = (name: string) => {
  const transaction = Sentry.startTransaction({ name });
  return {
    finish: () => transaction.finish(),
    setData: (key: string, value: any) => transaction.setData(key, value),
  };
};
```

---
