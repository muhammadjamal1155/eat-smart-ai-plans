-- Migration: 01_rls_policies.sql
-- Drop old permissive policies
drop policy if exists "Allow all access" on public.daily_logs;
drop policy if exists "Allow all access" on public.user_goals;
drop policy if exists "Allow all access" on public.user_meal_plans;

-- Create secure policies for daily_logs
create policy "Allow all access" on public.daily_logs 
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

-- Create secure policies for user_goals
create policy "Allow all access" on public.user_goals 
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

-- Create secure policies for user_meal_plans
create policy "Allow all access" on public.user_meal_plans 
  for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
