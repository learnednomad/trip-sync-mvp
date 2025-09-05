# Core Workflows

## User Authentication Flow
```mermaid
sequenceDiagram
    participant User
    participant App
    participant SecureStore
    participant SupabaseAuth
    participant Database
    
    User->>App: Open app
    App->>SecureStore: Check for stored session
    
    alt Has valid session
        SecureStore-->>App: Return session
        App->>SupabaseAuth: Validate session
        SupabaseAuth-->>App: Session valid
        App->>User: Show main screen
    else No session or expired
        App->>User: Show login screen
        User->>App: Choose auth method
        
        alt Email/Password
            User->>App: Enter credentials
            App->>SupabaseAuth: signInWithPassword()
        else Social Login
            App->>SupabaseAuth: signInWithOAuth()
            SupabaseAuth->>User: Open provider
            User->>SupabaseAuth: Authorize
        else Magic Link
            User->>App: Enter email
            App->>SupabaseAuth: signInWithOtp()
            SupabaseAuth->>User: Send email
            User->>App: Click link
        end
        
        SupabaseAuth->>Database: Create/update user
        Database-->>SupabaseAuth: User record
        SupabaseAuth-->>App: Session token
        App->>SecureStore: Store session
        App->>User: Show onboarding/main
    end
    
    opt Enable biometric
        User->>App: Enable biometric
        App->>SecureStore: Store biometric flag
        App->>User: Biometric enabled
    end
```

## Offline-First Expense Creation
```mermaid
sequenceDiagram
    participant User
    participant App
    participant MMKV
    participant SyncEngine
    participant Supabase
    
    User->>App: Create expense
    App->>App: Generate UUID
    App->>App: Create vector clock
    
    App->>MMKV: Save to offline queue
    MMKV-->>App: Saved
    App->>User: Show success (optimistic)
    
    App->>SyncEngine: Queue sync
    
    alt Device Online
        SyncEngine->>Supabase: POST /expenses
        Supabase->>Supabase: Run business logic
        Supabase-->>SyncEngine: Created expense
        SyncEngine->>MMKV: Remove from queue
        SyncEngine->>MMKV: Update local cache
    else Device Offline
        Note over SyncEngine: Wait for connectivity
        SyncEngine->>SyncEngine: Retry with exponential backoff
    end
    
    alt Sync Conflict
        Supabase-->>SyncEngine: Conflict error
        SyncEngine->>SyncEngine: Compare vector clocks
        alt Local is newer
            SyncEngine->>Supabase: Force update
        else Remote is newer
            SyncEngine->>MMKV: Update local
            SyncEngine->>App: Notify user
        else Concurrent edit
            SyncEngine->>App: Show conflict UI
            User->>App: Choose version
            App->>SyncEngine: Resolve conflict
        end
    end
```

## Real-time Trip Collaboration
```mermaid
sequenceDiagram
    participant User1
    participant App1
    participant Realtime
    participant Database
    participant App2
    participant User2
    
    User1->>App1: Update trip details
    App1->>Database: UPDATE trips
    Database-->>App1: Confirmed
    
    Database->>Realtime: Broadcast change
    
    Realtime->>App2: Push update
    App2->>App2: Update local state
    App2->>User2: Show changes
    
    par Expense added
        User2->>App2: Add expense
        App2->>Database: INSERT expense
        Database->>Realtime: Broadcast
        Realtime->>App1: Push update
        App1->>User1: Show new expense
    and Member joined
        User2->>App2: Accept invite
        App2->>Database: UPDATE trip_members
        Database->>Realtime: Broadcast
        Realtime->>App1: Member joined
        App1->>User1: Update member list
    end
    
    Note over Realtime: Presence tracking
    App1->>Realtime: User1 active
    App2->>Realtime: User2 active
    Realtime->>App1,App2: Broadcast presence
```

## Mobile-Specific: Quick Add with Shortcuts
```mermaid
sequenceDiagram
    participant User
    participant Device
    participant App
    participant Camera
    participant MLKit
    participant Storage
    
    alt 3D Touch / Long Press
        User->>Device: Force touch app icon
        Device->>User: Show quick actions
        User->>Device: Select "Add Expense"
        Device->>App: Deep link to expense
    else Widget
        User->>Device: Tap widget button
        Device->>App: Deep link with context
    else Voice Assistant
        User->>Device: "Add $50 lunch expense"
        Device->>App: Intent with parameters
    end
    
    App->>Camera: Open camera
    User->>Camera: Take receipt photo
    Camera-->>App: Image captured
    
    App->>MLKit: Process image
    MLKit->>MLKit: Extract text
    MLKit-->>App: Parsed data
    
    App->>App: Pre-fill form
    App->>User: Show expense form
    User->>App: Confirm details
    
    App->>Storage: Upload receipt
    App->>App: Create expense
    App->>User: Success feedback
```

## Trip Activity Timeline View
```mermaid
sequenceDiagram
    participant User
    participant App
    participant TimelineView
    participant Database
    participant Cache
    
    User->>App: Open trip
    App->>Cache: Check cached timeline
    
    alt Cache hit
        Cache-->>App: Return timeline data
        App->>TimelineView: Render immediately
    else Cache miss
        App->>Database: Fetch activities, expenses
        Database-->>App: Return data
        App->>Cache: Store for offline
        App->>TimelineView: Render timeline
    end
    
    TimelineView->>User: Display timeline
    
    User->>TimelineView: Drag to reorder
    TimelineView->>TimelineView: Update positions
    TimelineView->>App: Save new order
    App->>Database: Update activity times
    
    User->>TimelineView: Filter by type
    TimelineView->>TimelineView: Apply filters
    TimelineView->>User: Filtered view
    
    User->>TimelineView: Tap activity
    TimelineView->>App: Show details
    App->>User: Activity modal
```

## Smart Expense Splitting
```mermaid
sequenceDiagram
    participant User
    participant SplitUI
    participant Calculator
    participant Database
    participant Realtime
    
    User->>SplitUI: Select split method
    
    alt Equal Split
        SplitUI->>Calculator: Divide equally
        Calculator-->>SplitUI: Equal amounts
    else Percentage Split
        User->>SplitUI: Set percentages
        SplitUI->>Calculator: Calculate amounts
        Calculator-->>SplitUI: Percentage amounts
    else Itemized Split
        User->>SplitUI: Assign items
        SplitUI->>Calculator: Sum by person
        Calculator-->>SplitUI: Individual totals
    else Custom Adjustment
        User->>SplitUI: Adjust amounts
        SplitUI->>Calculator: Validate sum
        Calculator-->>SplitUI: Validated splits
    end
    
    SplitUI->>User: Show split preview
    User->>SplitUI: Confirm split
    
    SplitUI->>Database: Save expense & splits
    Database->>Database: Calculate balances
    Database-->>SplitUI: Updated balances
    
    Database->>Realtime: Broadcast update
    Realtime->>Realtime: Notify affected users
    
    SplitUI->>User: Show new balances
```

## Share Trip & Export
```mermaid
sequenceDiagram
    participant User
    participant App
    participant ExportEngine
    participant Storage
    participant ShareAPI
    
    User->>App: Select share/export
    App->>User: Show options
    
    alt Share Link
        User->>App: Generate link
        App->>App: Create read-only token
        App->>User: Copy link
        User->>User: Share via messaging
    else Export PDF
        User->>App: Export as PDF
        App->>ExportEngine: Generate PDF
        ExportEngine->>ExportEngine: Format data
        ExportEngine->>ExportEngine: Create document
        ExportEngine-->>Storage: Save PDF
        Storage-->>App: File URL
        App->>ShareAPI: Share file
    else Financial Report
        User->>App: Generate report
        App->>Database: Calculate totals
        Database-->>App: Financial data
        App->>ExportEngine: Create spreadsheet
        ExportEngine-->>App: CSV/Excel file
        App->>ShareAPI: Share file
    end
    
    ShareAPI->>User: System share sheet
    User->>ShareAPI: Select app
    ShareAPI->>ShareAPI: Send to app
```

## Quick Trip Templates
```mermaid
sequenceDiagram
    participant User
    participant App
    participant Templates
    participant Database
    participant AI
    
    User->>App: Create new trip
    App->>User: Show template options
    
    alt Pre-defined Template
        User->>Templates: Select template
        Templates->>Templates: Load template data
        Templates-->>App: Template structure
    else Previous Trip
        User->>App: Duplicate trip
        App->>Database: Fetch trip data
        Database-->>App: Trip with activities
        App->>App: Clear personal data
    else AI Suggested
        User->>App: Describe trip
        App->>AI: Process description
        AI->>AI: Generate suggestions
        AI-->>App: Suggested itinerary
    end
    
    App->>User: Show customization
    User->>App: Modify template
    User->>App: Set dates/members
    
    App->>Database: Create from template
    Database->>Database: Generate activities
    Database-->>App: New trip created
    
    App->>User: Navigate to trip
```

## Accessibility Navigation
```mermaid
sequenceDiagram
    participant User
    participant Screen Reader
    participant App
    participant A11y Engine
    participant Haptics
    
    User->>Screen Reader: Navigate app
    Screen Reader->>App: Request focus
    
    App->>A11y Engine: Get accessibility tree
    A11y Engine-->>Screen Reader: Semantic labels
    Screen Reader->>User: Announce content
    
    User->>Screen Reader: Swipe gesture
    Screen Reader->>App: Next element
    App->>A11y Engine: Update focus
    A11y Engine->>Haptics: Feedback pulse
    Haptics->>User: Tactile feedback
    
    alt Custom Action
        User->>Screen Reader: Double tap
        Screen Reader->>App: Activate element
        App->>App: Perform action
        App->>A11y Engine: Announce result
        A11y Engine->>Screen Reader: Success message
        Screen Reader->>User: Speak result
    else Voice Control
        User->>Screen Reader: Voice command
        Screen Reader->>App: Execute command
        App->>User: Visual + audio feedback
    end
    
    Note over A11y Engine: High contrast mode active
    A11y Engine->>App: Apply contrast theme
    App->>User: Enhanced visibility
```
