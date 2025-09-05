-- Sabron Trip Sync MVP Schema
-- Simplified version for faster development

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table (extends auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trips table (simplified)
CREATE TABLE public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by UUID NOT NULL REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trip_members table
CREATE TABLE public.trip_members (
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (trip_id, user_id)
);

-- Create expenses table (simplified)
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    paid_by_user_id UUID NOT NULL REFERENCES public.user_profiles(id),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    description TEXT NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create expense_splits table (simplified - equal splits only for MVP)
CREATE TABLE public.expense_splits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id),
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create basic indexes
CREATE INDEX idx_trips_created_by ON public.trips(created_by);
CREATE INDEX idx_trip_members_user ON public.trip_members(user_id);
CREATE INDEX idx_expenses_trip ON public.expenses(trip_id);
CREATE INDEX idx_expense_splits_expense ON public.expense_splits(expense_id);
CREATE INDEX idx_expense_splits_user ON public.expense_splits(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies

-- Users can read all profiles (for member lists)
CREATE POLICY "Users can read all profiles"
    ON public.user_profiles FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Users can see trips they're members of
CREATE POLICY "Users can view their trips"
    ON public.trips FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.trip_members
            WHERE trip_id = trips.id
        )
    );

-- Users can create trips
CREATE POLICY "Users can create trips"
    ON public.trips FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Trip members can view other members
CREATE POLICY "Trip members can view members"
    ON public.trip_members FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.trip_members tm
            WHERE tm.trip_id = trip_members.trip_id
        )
    );

-- Trip members can view expenses
CREATE POLICY "Trip members can view expenses"
    ON public.expenses FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.trip_members
            WHERE trip_id = expenses.trip_id
        )
    );

-- Trip members can create expenses
CREATE POLICY "Trip members can create expenses"
    ON public.expenses FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.trip_members
            WHERE trip_id = expenses.trip_id
        )
    );

-- Users can view their expense splits
CREATE POLICY "Users can view expense splits"
    ON public.expense_splits FOR SELECT
    USING (
        auth.uid() IN (
            SELECT tm.user_id 
            FROM public.trip_members tm
            JOIN public.expenses e ON e.trip_id = tm.trip_id
            WHERE e.id = expense_splits.expense_id
        )
    );

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', 'New User'));
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Simple function to create a trip with creator as member
CREATE OR REPLACE FUNCTION public.create_trip_with_member(
    p_name TEXT,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS trips AS $$
DECLARE
    v_trip trips;
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    
    -- Create trip
    INSERT INTO trips (name, start_date, end_date, created_by)
    VALUES (p_name, p_start_date, p_end_date, v_user_id)
    RETURNING * INTO v_trip;
    
    -- Add creator as member
    INSERT INTO trip_members (trip_id, user_id)
    VALUES (v_trip.id, v_user_id);
    
    RETURN v_trip;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;