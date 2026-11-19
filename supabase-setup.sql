insert into storage.buckets (id, name, public) values ('products','products', true) on conflict (id) do nothing;
create policy "admin uploads images" on storage.objects for all to authenticated
  using (bucket_id = 'products' and (auth.jwt()->>'email') = 'your@email.com')
  with check (bucket_id = 'products' and (auth.jwt()->>'email') = 'alexalfa1333@.com');
