-- Run this in your Supabase SQL editor to set up the database schema.

-- Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  exports_this_month integer not null default 0,
  exports_reset_at timestamptz not null default date_trunc('month', now()),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  images jsonb not null default '[]'::jsonb,
  audio_url text,
  audio_filename text,
  segments jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'rendering', 'done', 'error')),
  output_url text,
  bg_color text default '#000000',
  fade boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Increment exports counter (resets monthly)
-- Used for both Free (2/mo) and Starter (10/mo) limit enforcement in server/routes/render.js
create or replace function public.increment_exports(uid uuid)
returns void language plpgsql security definer as $$
begin
  -- Reset counter if we're in a new month
  update public.users
  set
    exports_this_month = case
      when date_trunc('month', exports_reset_at) < date_trunc('month', now())
      then 1
      else exports_this_month + 1
    end,
    exports_reset_at = case
      when date_trunc('month', exports_reset_at) < date_trunc('month', now())
      then date_trunc('month', now())
      else exports_reset_at
    end
  where id = uid;
end;
$$;

-- Row-level security
alter table public.users enable row level security;
alter table public.projects enable row level security;

create policy "Users can read own row" on public.users for select using (auth.uid() = id);
create policy "Users can update own row" on public.users for update using (auth.uid() = id);

create policy "Users can manage own projects" on public.projects
  for all using (auth.uid() = user_id);
