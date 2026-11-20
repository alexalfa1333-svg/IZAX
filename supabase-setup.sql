-- 1) Storage bucket for product photos (public so customers can see them)
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- 2) Storage policies (re-runnable)
drop policy if exists "public read" on storage.objects;
drop policy if exists "admin upload" on storage.objects;
drop policy if exists "admin update" on storage.objects;
drop policy if exists "admin uploads images" on storage.objects;
drop policy if exists "admin manage images" on storage.objects;

create policy "public read" on storage.objects
for select
using (bucket_id = 'products');

create policy "admin manage images" on storage.objects
for all to authenticated
using (bucket_id = 'products' and (auth.jwt()->>'email') = 'YOUR_ADMIN_EMAIL')
with check (bucket_id = 'products' and (auth.jwt()->>'email') = 'YOUR_ADMIN_EMAIL');

-- 3) Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  description text default '',
  img text default '',
  sold_out boolean default false,
  created_at timestamptz default now()
);

alter table public.products enable row level security;

drop policy if exists "products public read" on public.products;
drop policy if exists "products admin write" on public.products;

create policy "products public read" on public.products
for select
using (true);

create policy "products admin write" on public.products
for all to authenticated
using ((auth.jwt()->>'email') = 'YOUR_ADMIN_EMAIL')
with check ((auth.jwt()->>'email') = 'YOUR_ADMIN_EMAIL');

-- 4) Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text,
  name text,
  phone text,
  address text,
  note text default '',
  items jsonb,
  total numeric,
  status text default 'new',
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

drop policy if exists "orders anyone insert" on public.orders;
drop policy if exists "orders admin manage" on public.orders;

create policy "orders anyone insert" on public.orders
for insert to anon, authenticated
with check (true);

create policy "orders admin manage" on public.orders
for all to authenticated
using ((auth.jwt()->>'email') = 'YOUR_ADMIN_EMAIL')
with check ((auth.jwt()->>'email') = 'YOUR_ADMIN_EMAIL');
