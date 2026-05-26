-- Run this in the Supabase SQL Editor for your project.
-- Enables shared curriculum + progress across devices.

create table if not exists public.portal_data (
  id text primary key,
  payload jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.portal_data enable row level security;
alter table public.user_progress enable row level security;

-- MVP policies: allow anon read/write (tighten with auth before public launch)
create policy "portal_data_anon_all"
  on public.portal_data for all
  to anon, authenticated
  using (true) with check (true);

create policy "user_progress_anon_all"
  on public.user_progress for all
  to anon, authenticated
  using (true) with check (true);
