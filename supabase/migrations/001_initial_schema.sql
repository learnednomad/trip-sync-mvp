-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips table
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  cover_image TEXT,
  budget DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD'
);

-- Trip participants table
CREATE TABLE public.trip_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  UNIQUE(trip_id, user_id)
);

-- Expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  paid_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  receipt_url TEXT,
  is_shared BOOLEAN DEFAULT true,
  split_type TEXT DEFAULT 'equal' CHECK (split_type IN ('equal', 'percentage', 'amount', 'custom'))
);

-- Expense splits table
CREATE TABLE public.expense_splits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  is_paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMPTZ,
  UNIQUE(expense_id, user_id)
);

-- Activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  category TEXT NOT NULL,
  cost DECIMAL(10, 2),
  currency TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_trips_created_by ON public.trips(created_by);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_trips_dates ON public.trips(start_date, end_date);
CREATE INDEX idx_trip_participants_trip_id ON public.trip_participants(trip_id);
CREATE INDEX idx_trip_participants_user_id ON public.trip_participants(user_id);
CREATE INDEX idx_expenses_trip_id ON public.expenses(trip_id);
CREATE INDEX idx_expenses_paid_by ON public.expenses(paid_by);
CREATE INDEX idx_expense_splits_expense_id ON public.expense_splits(expense_id);
CREATE INDEX idx_expense_splits_user_id ON public.expense_splits(user_id);
CREATE INDEX idx_activities_trip_id ON public.activities(trip_id);
CREATE INDEX idx_activities_created_by ON public.activities(created_by);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Trips policies
CREATE POLICY "Users can view trips they participate in" ON public.trips
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trip_participants
      WHERE trip_participants.trip_id = trips.id
      AND trip_participants.user_id = auth.uid()
      AND trip_participants.status = 'accepted'
    )
  );

CREATE POLICY "Users can create trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Trip owners can update their trips" ON public.trips
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.trip_participants
      WHERE trip_participants.trip_id = trips.id
      AND trip_participants.user_id = auth.uid()
      AND trip_participants.role = 'owner'
    )
  );

CREATE POLICY "Trip owners can delete their trips" ON public.trips
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.trip_participants
      WHERE trip_participants.trip_id = trips.id
      AND trip_participants.user_id = auth.uid()
      AND trip_participants.role = 'owner'
    )
  );

-- Trip participants policies
CREATE POLICY "Users can view trip participants for their trips" ON public.trip_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trip_participants AS tp
      WHERE tp.trip_id = trip_participants.trip_id
      AND tp.user_id = auth.uid()
      AND tp.status = 'accepted'
    )
  );

CREATE POLICY "Trip admins can manage participants" ON public.trip_participants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trip_participants AS tp
      WHERE tp.trip_id = trip_participants.trip_id
      AND tp.user_id = auth.uid()
      AND tp.role IN ('owner', 'admin')
    )
  );

-- Expenses policies
CREATE POLICY "Users can view expenses for their trips" ON public.expenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trip_participants
      WHERE trip_participants.trip_id = expenses.trip_id
      AND trip_participants.user_id = auth.uid()
      AND trip_participants.status = 'accepted'
    )
  );

CREATE POLICY "Trip participants can create expenses" ON public.expenses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trip_participants
      WHERE trip_participants.trip_id = expenses.trip_id
      AND trip_participants.user_id = auth.uid()
      AND trip_participants.status = 'accepted'
    )
  );

CREATE POLICY "Expense creators can update their expenses" ON public.expenses
  FOR UPDATE USING (auth.uid() = paid_by);

CREATE POLICY "Expense creators can delete their expenses" ON public.expenses
  FOR DELETE USING (auth.uid() = paid_by);

-- Activities policies
CREATE POLICY "Users can view activities for their trips" ON public.activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trip_participants
      WHERE trip_participants.trip_id = activities.trip_id
      AND trip_participants.user_id = auth.uid()
      AND trip_participants.status = 'accepted'
    )
  );

CREATE POLICY "Trip participants can create activities" ON public.activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trip_participants
      WHERE trip_participants.trip_id = activities.trip_id
      AND trip_participants.user_id = auth.uid()
      AND trip_participants.status = 'accepted'
    )
  );

CREATE POLICY "Activity creators can update their activities" ON public.activities
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Activity creators can delete their activities" ON public.activities
  FOR DELETE USING (auth.uid() = created_by);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();