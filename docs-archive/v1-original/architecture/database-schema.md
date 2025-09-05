# Database Schema

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm" FOR SCHEMA public;

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{
        "currency": "USD",
        "language": "en",
        "theme": "system",
        "notifications": {
            "push": true,
            "email": true,
            "trip_updates": true,
            "expense_updates": true
        }
    }'::jsonb,
    push_token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips table
CREATE TABLE public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
    cover_image_url TEXT,
    settings JSONB DEFAULT '{
        "currency": "USD",
        "timezone": "UTC",
        "visibility": "private",
        "split_method": "equal"
    }'::jsonb,
    created_by UUID NOT NULL REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    vector_clock JSONB DEFAULT '{}'::jsonb
);

-- Trip members (many-to-many)
CREATE TABLE public.trip_members (
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'editor', 'viewer', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    invited_by UUID REFERENCES public.user_profiles(id),
    invited_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    PRIMARY KEY (trip_id, user_id)
);

-- Destinations within trips
CREATE TABLE public.destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    country TEXT,
    arrival_date DATE,
    departure_date DATE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    place_id TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses table with partitioning for performance
CREATE TABLE public.expenses (
    id UUID DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL,
    paid_by_user_id UUID NOT NULL REFERENCES public.user_profiles(id),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('accommodation', 'transport', 'food', 'activities', 'shopping', 'other')),
    description TEXT NOT NULL,
    receipt_url TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    vector_clock JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create partitions for expenses (monthly)
CREATE TABLE public.expenses_2025_01 PARTITION OF public.expenses
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE public.expenses_2025_02 PARTITION OF public.expenses
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
-- Continue creating partitions as needed...

-- Foreign key for partitioned table
ALTER TABLE public.expenses ADD CONSTRAINT expenses_trip_fkey 
    FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;

-- Expense splits
CREATE TABLE public.expense_splits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id),
    amount DECIMAL(10,2) NOT NULL,
    percentage DECIMAL(5,2),
    shares INTEGER,
    is_settled BOOLEAN DEFAULT FALSE,
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities/Itinerary items
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('flight', 'accommodation', 'transport', 'tour', 'restaurant', 'attraction', 'custom')),
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    location JSONB,
    booking_reference TEXT,
    booking_url TEXT,
    cost JSONB,
    documents JSONB DEFAULT '[]'::jsonb,
    created_by UUID NOT NULL REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    vector_clock JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX idx_trips_dates ON public.trips(start_date, end_date);
CREATE INDEX idx_trips_created_by ON public.trips(created_by);
CREATE INDEX idx_trip_members_user ON public.trip_members(user_id);
CREATE INDEX idx_expenses_trip_date ON public.expenses(trip_id, date);
CREATE INDEX idx_expenses_paid_by ON public.expenses(paid_by_user_id);
CREATE INDEX idx_expense_splits_expense ON public.expense_splits(expense_id);
CREATE INDEX idx_expense_splits_user ON public.expense_splits(user_id);
CREATE INDEX idx_activities_trip ON public.activities(trip_id);
CREATE INDEX idx_activities_start_time ON public.activities(start_time);

-- Full text search indexes
CREATE INDEX idx_trips_search ON public.trips USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_activities_search ON public.activities USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Row Level Security Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- User profiles: Users can read all profiles but only update their own
CREATE POLICY "Users can read all profiles"
    ON public.user_profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Trips: Users can only see trips they're members of
CREATE POLICY "Users can view their trips"
    ON public.trips FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.trip_members
            WHERE trip_id = trips.id
        )
    );

CREATE POLICY "Trip creators and admins can update"
    ON public.trips FOR UPDATE
    USING (
        auth.uid() = created_by OR
        auth.uid() IN (
            SELECT user_id FROM public.trip_members
            WHERE trip_id = trips.id AND role = 'admin'
        )
    );

-- Trip members: Viewable by trip members
CREATE POLICY "Trip members can view members"
    ON public.trip_members FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.trip_members tm
            WHERE tm.trip_id = trip_members.trip_id
        )
    );

-- Expenses: Viewable by trip members
CREATE POLICY "Trip members can view expenses"
    ON public.expenses FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.trip_members
            WHERE trip_id = expenses.trip_id
        )
    );

CREATE POLICY "Trip members can create expenses"
    ON public.expenses FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.trip_members
            WHERE trip_id = expenses.trip_id
        )
    );

-- Database Functions
CREATE OR REPLACE FUNCTION public.calculate_trip_balances(p_trip_id UUID)
RETURNS TABLE(
    user_id UUID,
    total_paid DECIMAL(10,2),
    total_owed DECIMAL(10,2),
    balance DECIMAL(10,2),
    currency TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH trip_currency AS (
        SELECT settings->>'currency' as currency
        FROM public.trips
        WHERE id = p_trip_id
    ),
    user_payments AS (
        SELECT 
            e.paid_by_user_id as user_id,
            SUM(e.amount) as total_paid
        FROM public.expenses e
        WHERE e.trip_id = p_trip_id
        GROUP BY e.paid_by_user_id
    ),
    user_owes AS (
        SELECT 
            es.user_id,
            SUM(es.amount) as total_owed
        FROM public.expense_splits es
        JOIN public.expenses e ON es.expense_id = e.id
        WHERE e.trip_id = p_trip_id
        GROUP BY es.user_id
    )
    SELECT 
        COALESCE(up.user_id, uo.user_id) as user_id,
        COALESCE(up.total_paid, 0) as total_paid,
        COALESCE(uo.total_owed, 0) as total_owed,
        COALESCE(up.total_paid, 0) - COALESCE(uo.total_owed, 0) as balance,
        tc.currency
    FROM user_payments up
    FULL OUTER JOIN user_owes uo ON up.user_id = uo.user_id
    CROSS JOIN trip_currency tc;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_members;
```
