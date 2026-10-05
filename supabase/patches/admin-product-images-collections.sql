-- Run in Supabase SQL Editor (one-time)
-- Adds multi-image support, new arrival flag, and product-images storage bucket

alter table public.products
  add column if not exists image_urls text[] not null default '{}';

alter table public.products
  add column if not exists new_arrival boolean not null default false;

-- Backfill primary image into gallery array
update public.products
set image_urls = array[image_url]
where image_url is not null
  and image_url <> ''
  and (image_urls is null or cardinality(image_urls) = 0);

create index if not exists idx_products_new_arrival on public.products(new_arrival);

-- Storage bucket for product images (public read)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
