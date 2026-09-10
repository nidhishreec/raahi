-- Run this in the Supabase SQL editor, same as schema.sql

create table if not exists reservations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  date        date not null,
  time        time not null,
  status      text not null default 'Pending',
  created_at  timestamptz not null default now()
);

alter table reservations enable row level security;

-- No public SELECT policy -- reservations contain phone numbers,
-- which is real personal data. Only the service role (used by
-- /api/reservations) can read/write. Public can INSERT only, via
-- the API route which validates the input first.
