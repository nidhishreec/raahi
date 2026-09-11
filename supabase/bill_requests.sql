-- Run this in the Supabase SQL editor, same as your other schema files.

create table if not exists bill_requests (
  id           uuid primary key default gen_random_uuid(),
  table_num    text not null,
  status       text not null default 'Requested', -- 'Requested' | 'Resolved'
  created_at   timestamptz not null default now(),
  resolved_at  timestamptz
);

create index if not exists idx_bill_requests_table_num on bill_requests(table_num);
create index if not exists idx_bill_requests_status on bill_requests(status);

alter table bill_requests enable row level security;

-- Public can READ (needed for the live banner on /kds and /admin, and
-- for a customer's own /order page to know if their request is still
-- pending after a refresh).
create policy "public can read bill requests"
  on bill_requests for select
  using (true);

-- No public INSERT/UPDATE policy -- both go through the API routes
-- (service role), which validate the table number and de-duplicate
-- repeat requests server-side.
