create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  description text default '',
  img text default '',
  sold_out boolean default false,
  created_at timestamptz default now()
);
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_no text, name text, phone text, address text, note text,
  items jsonb, total numeric,
  status text default 'new',
  created_at timestamptz default now()
);
alter table products enable row level security;
alter table orders enable row level security;

create policy "anyone views products" on products for select using (true);
create policy "admin manages products" on products for all to authenticated
  using ((auth.jwt()->>'email') = 'your@email.com')
  with check ((auth.jwt()->>'email') = 'your@email.com');

create policy "anyone places orders" on orders for insert to anon, authenticated with check (true);
create policy "admin manages orders" on orders for all to authenticated
  using ((auth.jwt()->>'email') = 'your@email.com')
  with check ((auth.jwt()->>'email') = 'your@email.com');
