-- ============================================================
-- RAAHI -- Database schema + Row Level Security policies
-- Run this in the Supabase SQL editor (Project -> SQL Editor)
-- ============================================================

create table if not exists menu_items (
  id           bigint primary key,
  name         text not null,
  price        integer not null check (price >= 0),
  category     text not null,
  description  text default '',
  is_available boolean not null default true,
  updated_at   timestamptz not null default now()
);

create table if not exists orders (
  id          uuid primary key default gen_random_uuid(),
  table_num   text not null,
  items       jsonb not null,
  total       integer not null,
  status      text not null default 'Pending Kitchen',
  created_at  timestamptz not null default now()
);

create index if not exists idx_orders_table_num on orders(table_num);
create index if not exists idx_orders_status on orders(status);

alter table menu_items enable row level security;
alter table orders enable row level security;

create policy "public can read menu"
  on menu_items for select
  using (true);

create policy "public can place orders"
  on orders for insert
  with check (true);

create policy "public can read orders"
  on orders for select
  using (true);

-- No anonymous UPDATE/DELETE on orders and no anonymous writes to
-- menu_items -- those go through the service-role API routes only.

insert into menu_items (id, name, price, category, description, is_available) values
  (101, 'Cream Of Spinach Soup', 220, 'Soups', 'Rich and creamy classic spinach soup.', true),
  (102, 'Cream Of Tomato Soup', 220, 'Soups', 'Velvety smooth garden tomato soup.', true)
on conflict (id) do nothing;
-- Send me your MASTER_PUB_MENU array again and I will generate the
-- full INSERT statement for all ~400 items.
