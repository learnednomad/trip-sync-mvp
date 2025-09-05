# Section 9: API Specifications (Supabase)

## Supabase Client Configuration

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
```

## Authentication APIs

```typescript
// Authentication Service
class AuthService {
  // Email/Password Sign Up
  static async signUp(email: string, password: string, profile: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: profile,
        emailRedirectTo: 'tripsync://auth/callback',
      },
    });
    
    if (error) throw error;
    return data;
  }
  
  // Magic Link Sign In
  static async signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'tripsync://auth/callback',
      },
    });
    
    if (error) throw error;
  }
  
  // Social Authentication
  static async signInWithProvider(provider: 'google' | 'apple' | 'facebook') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'tripsync://auth/callback',
        skipBrowserRedirect: true,
      },
    });
    
    if (error) throw error;
    
    // Handle OAuth flow with expo-auth-session
    const authUrl = data.url;
    // ... OAuth flow implementation
  }
  
  // Session Management
  static async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
  
  static async refreshSession() {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  }
}
```

## Trip Management APIs

```typescript
// Trip Service using Supabase
class TripService {
  // Create Trip with Realtime
  static async createTrip(trip: TripInput) {
    const { data, error } = await supabase
      .from('trips')
      .insert({
        ...trip,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel(`trip:${data.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trips',
          filter: `id=eq.${data.id}`,
        },
        (payload) => {
          // Handle realtime updates
          console.log('Trip updated:', payload);
        }
      )
      .subscribe();
      
    return data;
  }
  
  // List Trips with Pagination
  static async listTrips(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await supabase
      .from('trips')
      .select('*, trip_participants!inner(*)', { count: 'exact' })
      .order('start_date', { ascending: false })
      .range(from, to);
      
    if (error) throw error;
    
    return {
      trips: data,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }
  
  // Update Trip with Optimistic Updates
  static async updateTrip(id: string, updates: Partial<Trip>) {
    // Optimistic update in local state
    const optimisticUpdate = { id, ...updates, _optimistic: true };
    
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      // Rollback optimistic update
      throw error;
    }
    
    return data;
  }
}
```

## Realtime Subscriptions

```typescript
// Realtime Collaboration
class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  
  // Subscribe to Trip Updates
  subscribeToTrip(tripId: string, callbacks: {
    onActivityAdded?: (activity: Activity) => void;
    onActivityUpdated?: (activity: Activity) => void;
    onActivityDeleted?: (id: string) => void;
    onParticipantJoined?: (participant: Participant) => void;
    onPresence?: (presence: any) => void;
  }) {
    const channel = supabase
      .channel(`trip:${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities',
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => callbacks.onActivityAdded?.(payload.new as Activity)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'activities',
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => callbacks.onActivityUpdated?.(payload.new as Activity)
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        callbacks.onPresence?.(state);
      })
      .subscribe();
      
    this.channels.set(tripId, channel);
    return channel;
  }
  
  // Broadcast User Presence
  async broadcastPresence(tripId: string, userState: any) {
    const channel = this.channels.get(tripId);
    if (channel) {
      await channel.track(userState);
    }
  }
  
  // Unsubscribe from Trip
  unsubscribeFromTrip(tripId: string) {
    const channel = this.channels.get(tripId);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(tripId);
    }
  }
}
```

## File Storage APIs

```typescript
// Storage Service for Images and Documents
class StorageService {
  // Upload Trip Cover Image
  static async uploadTripCover(tripId: string, file: File) {
    const fileName = `${tripId}/cover-${Date.now()}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('trip-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
      
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('trip-images')
      .getPublicUrl(fileName);
      
    // Update trip with cover image
    await supabase
      .from('trips')
      .update({ cover_image_url: publicUrl })
      .eq('id', tripId);
      
    return publicUrl;
  }
  
  // Upload Receipt Image with OCR
  static async uploadReceipt(expenseId: string, file: File) {
    const fileName = `receipts/${expenseId}-${Date.now()}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(fileName, file);
      
    if (error) throw error;
    
    // Trigger Edge Function for OCR
    const { data: ocrResult } = await supabase.functions.invoke('ocr-receipt', {
      body: { fileName },
    });
    
    return {
      url: data.path,
      ocrData: ocrResult,
    };
  }
}
```

## Edge Functions

```typescript
// Supabase Edge Function for OCR Processing
// supabase/functions/ocr-receipt/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { fileName } = await req.json();
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  // Download image from storage
  const { data: fileData } = await supabase.storage
    .from('receipts')
    .download(fileName);
    
  // Process with OCR service (e.g., Google Vision API)
  const ocrResult = await processWithOCR(fileData);
  
  // Parse receipt data
  const receiptData = {
    amount: extractAmount(ocrResult),
    currency: extractCurrency(ocrResult),
    date: extractDate(ocrResult),
    vendor: extractVendor(ocrResult),
    items: extractItems(ocrResult),
  };
  
  return new Response(JSON.stringify(receiptData), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---
