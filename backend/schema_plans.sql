-- Create table for storing user meal plans
-- We assume one active plan per user for simplicity (overwritten on save)

create table public.user_meal_plans (
  user_id text not null primary key,
  plan_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_meal_plans enable row level security;
create policy "Allow all access" on public.user_meal_plans for all using (true) with check (true);
