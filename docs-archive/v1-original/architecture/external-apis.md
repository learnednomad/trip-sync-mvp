# External APIs

## Google Maps API
- **Purpose:** Location search, route planning, place details
- **Documentation:** https://developers.google.com/maps/documentation
- **Base URL(s):** 
  - Maps SDK for iOS/Android (native)
  - Places API: https://maps.googleapis.com/maps/api/place/
  - Directions API: https://maps.googleapis.com/maps/api/directions/
- **Authentication:** API key with platform restrictions
- **Rate Limits:** 28,000 requests/month free ($200 credit)

**Key Endpoints Used:**
- Places Autocomplete - Location search
- Place Details - Get location information
- Directions - Route planning between destinations

**Integration Notes:** 
- API key restricted by platform (iOS bundle ID, Android package)
- Implement caching for place details
- Use native SDKs for better performance

## OCR Service (Document AI or Similar)
- **Purpose:** Receipt scanning and data extraction
- **Documentation:** 
  - Google Document AI: https://cloud.google.com/document-ai/docs
  - AWS Textract: https://docs.aws.amazon.com/textract/
  - Azure Form Recognizer: https://docs.microsoft.com/en-us/azure/cognitive-services/form-recognizer/
- **Base URL(s):** Varies by provider
- **Authentication:** Service account credentials
- **Rate Limits:** ~1.50 per 1000 pages

**Key Endpoints Used:**
- Process Document - Extract text and structure from receipts
- Analyze Receipt - Specialized receipt parsing

**Integration Notes:** 
- Process on-device first if possible
- Fall back to cloud API for complex receipts
- Store extracted data, not just images

## Exchange Rate API
- **Purpose:** Real-time currency conversion for multi-currency trips
- **Documentation:** https://exchangerate-api.com/docs
- **Base URL(s):** https://v6.exchangerate-api.com/v6/
- **Authentication:** API key in URL path
- **Rate Limits:** 1,500 requests/month (free tier)

**Key Endpoints Used:**
- `GET /latest/{base_currency}` - Get all rates for a base currency
- `GET /pair/{from}/{to}` - Direct currency conversion

**Integration Notes:** 
- Cache rates for 1 hour minimum
- Update via Edge Function daily
- Store historical rates for offline access

## Expo Push Service API
- **Purpose:** Send push notifications for trip updates and reminders
- **Documentation:** https://docs.expo.dev/push-notifications/overview/
- **Base URL(s):** https://exp.host/--/api/v2/push/send
- **Authentication:** Expo access token (optional)
- **Rate Limits:** 600 notifications/second

**Key Endpoints Used:**
- `POST /push/send` - Send single or batch notifications
- `POST /push/getReceipts` - Check delivery status

**Integration Notes:** 
- Notifications sent via Edge Functions
- Handle push tokens per device
- Implement notification preferences

## Authentication Providers (OAuth)
- **Purpose:** Social login integration
- **Providers:**
  - Google Sign-In
  - Apple Sign-In  
  - Facebook Login
- **Documentation:** Handled by Supabase Auth
- **Integration Notes:**
  - OAuth credentials configured in Supabase dashboard
  - Redirect URLs must match Supabase project
  - Native SDKs for better UX

## Sentry Error Tracking
- **Purpose:** Error monitoring and performance tracking
- **Documentation:** https://docs.sentry.io/platforms/react-native/
- **Base URL(s):** https://sentry.io/api/
- **Authentication:** DSN in client, auth token for uploads
- **Rate Limits:** Based on plan (free: 5K errors/month)

**Key Endpoints Used:**
- Error reporting (automatic via SDK)
- Source map uploads
- Performance tracking

**Integration Notes:**
- Initialize early in app lifecycle
- Upload source maps in CI/CD
- Configure for different environments