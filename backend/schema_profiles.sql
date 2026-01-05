-- Create profiles table to match AuthContext User interface
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key, -- Linked to Supabase Auth
  email text,
  name text,
  age integer,
  weight numeric,
  height numeric,
  goal text,
  nutrition jsonb default '{}'::jsonb, -- Store calories, protein, etc targets
  lifestyle jsonb default '{}'::jsonb, -- Store activity level, preferences
  security jsonb default '{}'::jsonb,  -- Store 2FA status, devices (careful with sensitive info)
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Policy: Users can insert their own profile
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);
