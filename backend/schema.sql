-- Create tables for Analytics

create table public.daily_logs (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- using text to match simple auth or external auth
  date date not null,
  weight numeric,
  calories numeric,
  protein numeric,
  carbs numeric,
  fats numeric,
  water_intake numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

create table public.user_goals (
  id text not null primary key, -- client generated id or uuid
  user_id text not null,
  title text not null,
  category text, -- 'weight', 'nutrition', etc
  target numeric not null,
  current numeric default 0,
  unit text,
  deadline date,
  status text default 'active', -- 'active', 'completed'
  priority text default 'medium',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) if needed, or leave open for now if using Service Key (but we are using anon key, so RLS is needed for security usually, BUT I am using the anon key which usually requires RLS policies to allow access).
-- FOR DEVELOPMENT: We can enable RLS and add a policy "Allow all" or just disable RLS.
-- Since I don't know the exact auth setup (GoTrue), I will suggest disabling RLS or adding a permissive policy for testing.

alter table public.daily_logs enable row level security;
create policy "Allow all access" on public.daily_logs for all using (true) with check (true);

alter table public.user_goals enable row level security;
create policy "Allow all access" on public.user_goals for all using (true) with check (true);
