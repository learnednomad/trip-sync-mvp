# Section 8: Security Architecture

## Authentication Security

```typescript
// Biometric Authentication Implementation
class BiometricAuth {
  static async authenticate(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;
    
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return false;
    
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access Trip Sync',
      cancelLabel: 'Cancel',
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false,
    });
    
    return result.success;
  }
}

// Secure Token Storage
class SecureStorage {
  private static storage = new MMKVStorage.Loader()
    .withEncryption()
    .initialize();
    
  static async setSecureItem(key: string, value: any): Promise<void> {
    const encrypted = await this.encrypt(JSON.stringify(value));
    this.storage.setString(key, encrypted);
  }
  
  static async getSecureItem(key: string): Promise<any> {
    const encrypted = this.storage.getString(key);
    if (!encrypted) return null;
    
    const decrypted = await this.decrypt(encrypted);
    return JSON.parse(decrypted);
  }
  
  private static async encrypt(text: string): Promise<string> {
    // AES-256-GCM encryption implementation
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  }
  
  private static async decrypt(encrypted: string): Promise<string> {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
```

## Data Protection

```typescript
// Row Level Security Implementation
-- Trips can only be accessed by participants
CREATE POLICY "trip_access_policy" ON trips
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM trip_participants 
      WHERE trip_id = trips.id
    )
  );

-- Expenses can only be modified by creator or trip owner
CREATE POLICY "expense_modify_policy" ON expenses
  FOR UPDATE
  USING (
    paid_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = expenses.trip_id
      AND trips.created_by = auth.uid()
    )
  );
```

---
