-- ============================================================
-- Zaré Scents. run this once in Supabase SQL Editor
-- Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

create extension if not exists "pgcrypto";

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  short_description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2),
  category text not null check (category in ('him', 'her', 'unisex', 'testers')),
  volume text not null default '50ml',
  scent_notes text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  image_urls text[] not null default '{}',
  featured boolean not null default false,
  new_arrival boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  address text not null,
  notes text default '',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null default 'cod',
  subtotal numeric(12,2) not null default 0,
  shipping_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  unit_price numeric(12,2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) not null
);

-- Admin profiles (link to Auth users)
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default 'Admin',
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_active on public.products(active);
create index if not exists idx_products_featured on public.products(featured);
create index if not exists idx_products_new_arrival on public.products(new_arrival);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_orders_email on public.orders(email);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles where id = auth.uid()
  );
$$;

create or replace function public.generate_order_number()
returns text
language plpgsql as $$
begin
  return 'ZR-' || to_char(now(), 'YYMMDD') || '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
end;
$$;

-- Place order atomically (guest checkout)
create or replace function public.place_order(
  p_customer_name text,
  p_email text,
  p_phone text,
  p_city text,
  p_address text,
  p_notes text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric(12,2) := 0;
  v_shipping numeric(12,2) := 0;
  v_total numeric(12,2);
  v_item jsonb;
  v_product record;
  v_qty integer;
  v_line numeric(12,2);
begin
  if length(trim(coalesce(p_customer_name, ''))) < 2 then
    raise exception 'Customer name is required';
  end if;
  if length(trim(coalesce(p_phone, ''))) < 10 then
    raise exception 'Valid phone number is required';
  end if;
  if length(trim(coalesce(p_city, ''))) < 2 then
    raise exception 'City is required';
  end if;
  if length(trim(coalesce(p_address, ''))) < 5 then
    raise exception 'Delivery address is required';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from products
      where id = (v_item->>'product_id')::uuid and active = true
      for update;
    if not found then
      raise exception 'Product not found';
    end if;
    v_qty := (v_item->>'quantity')::integer;
    if v_qty is null or v_qty < 1 then
      raise exception 'Invalid quantity';
    end if;
    if v_product.stock < v_qty then
      raise exception 'Insufficient stock for %', v_product.name;
    end if;
    v_subtotal := v_subtotal + (v_product.price * v_qty);
  end loop;

  -- Keep in sync with src/lib/types.ts FREE_SHIPPING_THRESHOLD / SHIPPING_FEE
  if v_subtotal < 3999 then
    v_shipping := 199;
  end if;
  v_total := v_subtotal + v_shipping;
  v_order_number := public.generate_order_number();

  insert into orders (
    order_number, customer_name, email, phone, city, address, notes,
    status, payment_method, subtotal, shipping_fee, total
  ) values (
    v_order_number, trim(p_customer_name), lower(trim(p_email)), trim(p_phone),
    trim(p_city), trim(p_address), coalesce(trim(p_notes), ''),
    'pending', 'cod', v_subtotal, v_shipping, v_total
  ) returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from products where id = (v_item->>'product_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;
    v_line := v_product.price * v_qty;

    insert into order_items (
      order_id, product_id, product_name, product_slug, unit_price, quantity, line_total
    ) values (
      v_order_id, v_product.id, v_product.name, v_product.slug,
      v_product.price, v_qty, v_line
    );

    update products set stock = stock - v_qty where id = v_product.id;
  end loop;

  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'shipping_fee', v_shipping,
    'total', v_total
  );
end;
$$;

grant execute on function public.place_order to anon, authenticated;

-- Guest order tracking (order number + checkout email)
create or replace function public.track_order(
  p_order_number text,
  p_email text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_items jsonb;
begin
  if length(trim(coalesce(p_order_number, ''))) < 3 then
    raise exception 'Order number is required';
  end if;
  if length(trim(coalesce(p_email, ''))) < 3 then
    raise exception 'Email is required';
  end if;

  select * into v_order
  from public.orders
  where upper(trim(order_number)) = upper(trim(p_order_number))
    and email = lower(trim(p_email));

  if not found then
    raise exception 'Order not found. Check your order number and email.';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'product_name', oi.product_name,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price,
        'line_total', oi.line_total
      )
      order by oi.product_name
    ),
    '[]'::jsonb
  )
  into v_items
  from public.order_items oi
  where oi.order_id = v_order.id;

  return jsonb_build_object(
    'order_number', v_order.order_number,
    'customer_name', v_order.customer_name,
    'email', v_order.email,
    'phone', v_order.phone,
    'city', v_order.city,
    'address', v_order.address,
    'notes', nullif(trim(v_order.notes), ''),
    'status', v_order.status,
    'payment_method', v_order.payment_method,
    'subtotal', v_order.subtotal,
    'shipping_fee', v_order.shipping_fee,
    'total', v_order.total,
    'created_at', v_order.created_at,
    'updated_at', v_order.updated_at,
    'items', v_items
  );
end;
$$;

grant execute on function public.track_order(text, text) to anon, authenticated;

-- Admin: update order status and restock when cancelling
create or replace function public.admin_set_order_status(
  p_order_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prev text;
  v_item record;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  if p_status not in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') then
    raise exception 'Invalid status';
  end if;

  select status into v_prev from orders where id = p_order_id for update;
  if not found then
    raise exception 'Order not found';
  end if;

  if v_prev = p_status then
    return;
  end if;

  -- Restock once when moving into cancelled
  if p_status = 'cancelled' and v_prev is distinct from 'cancelled' then
    for v_item in
      select product_id, quantity from order_items where order_id = p_order_id
    loop
      if v_item.product_id is not null then
        update products
          set stock = stock + v_item.quantity
          where id = v_item.product_id;
      end if;
    end loop;
  end if;

  update orders set status = p_status, updated_at = now() where id = p_order_id;
end;
$$;

grant execute on function public.admin_set_order_status to authenticated;

-- RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_profiles enable row level security;

drop policy if exists "Public read active products" on public.products;
create policy "Public read active products" on public.products
  for select using (active = true or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins read orders" on public.orders;
create policy "Admins read orders" on public.orders
  for select using (public.is_admin());

drop policy if exists "Admins update orders" on public.orders;
create policy "Admins update orders" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete orders" on public.orders;
create policy "Admins delete orders" on public.orders
  for delete using (public.is_admin());

drop policy if exists "Admins read order items" on public.order_items;
create policy "Admins read order items" on public.order_items
  for select using (public.is_admin());

drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins read profiles" on public.admin_profiles;
create policy "Admins read profiles" on public.admin_profiles
  for select using (auth.uid() = id);

-- Seed products (local images). 12 fragrances for New Arrivals + Most Popular
delete from public.products;

insert into public.products
  (name, slug, description, short_description, price, compare_at_price, category, volume, scent_notes, stock, image_url, featured, new_arrival, sort_order, created_at)
values
(
  'Noir Absolu', 'noir-absolu',
  'A commanding composition of smoked woods, black pepper and rich amber. Noir Absolu is crafted for evenings that demand presence: deep, long-lasting, unmistakably refined.',
  'Smoked woods, pepper & amber',
  2499, 3200, 'him', '50ml', array['Black Pepper','Cedar','Amber','Vetiver'],
  40, '/images/product-noir.jpg', true, false, 1, now() - interval '40 days'
),
(
  'Velvet Rose', 'velvet-rose',
  'Silk-soft petals meet warm vanilla and a whisper of musk. Velvet Rose is feminine elegance bottled: romantic, luminous, and endlessly wearable.',
  'Rose, vanilla & soft musk',
  2799, 3400, 'her', '50ml', array['Damask Rose','Vanilla','White Musk','Peony'],
  35, '/images/product-velvet.jpg', true, false, 2, now() - interval '38 days'
),
(
  'Aura', 'aura',
  'A modern unisex signature of clean iris, soft woods and pale musk. Aura floats close to the skin: intimate, polished, quietly magnetic.',
  'Iris, soft woods & musk',
  2599, 3100, 'unisex', '50ml', array['Iris','Sandalwood','White Musk','Bergamot'],
  45, '/images/product-aura.jpg', true, false, 3, now() - interval '35 days'
),
(
  'Oud Al Layl', 'oud-al-layl',
  'Dark oud resin wrapped in saffron and sweet tobacco. An oriental masterpiece that lingers long after midnight: bold, luxurious, unforgettable.',
  'Oud, saffron & tobacco',
  3499, 4200, 'unisex', '50ml', array['Agarwood','Saffron','Tobacco','Incense'],
  25, '/images/product-oud.jpg', true, false, 4, now() - interval '32 days'
),
(
  'Citrus Atelier', 'citrus-atelier',
  'Sunlit bergamot and bitter orange lifted by neroli and a crisp green heart. Fresh, confident, perfect for day wear that still feels luxurious.',
  'Bergamot, neroli & green notes',
  2199, 2800, 'him', '50ml', array['Bergamot','Neroli','Petitgrain','Cedar'],
  50, '/images/product-citrus.jpg', true, false, 5, now() - interval '28 days'
),
(
  'Rose de Soie', 'rose-de-soie',
  'A luminous Turkish rose absolute over creamy sandalwood and soft amber. Delicate yet lasting: the essence of quiet luxury.',
  'Turkish rose & sandalwood',
  2899, 3500, 'her', '50ml', array['Turkish Rose','Sandalwood','Amber','Lychee'],
  30, '/images/product-rose.jpg', true, false, 6, now() - interval '25 days'
),
(
  'Amber Nocturne', 'amber-nocturne',
  'Warm amber resin melted with tonka and soft spices. A nightfall signature: smooth, glowing, and deeply comforting.',
  'Amber, tonka & spice',
  2699, 3300, 'unisex', '50ml', array['Amber','Tonka','Cinnamon','Vanilla'],
  38, '/images/product-oud.jpg', false, true, 7, now() - interval '6 days'
),
(
  'Jade Vetiver', 'jade-vetiver',
  'Fresh cut vetiver with green citrus and cool moss. Crisp and modern: the scent of quiet confidence.',
  'Vetiver, citrus & moss',
  2399, 2900, 'him', '50ml', array['Vetiver','Grapefruit','Oakmoss','Mint'],
  42, '/images/product-citrus.jpg', false, true, 8, now() - interval '5 days'
),
(
  'Blush Orchid', 'blush-orchid',
  'Exotic orchid petals over creamy coconut and soft woods. A luminous floral with a tropical whisper.',
  'Orchid, coconut & woods',
  2999, 3600, 'her', '50ml', array['Orchid','Coconut','Ylang','Sandalwood'],
  28, '/images/product-velvet.jpg', false, true, 9, now() - interval '4 days'
),
(
  'Silver Musk', 'silver-musk',
  'Clean white musk with a metallic iris edge and soft cashmere woods. Minimal, modern, and addictive.',
  'White musk & iris',
  2299, 2700, 'unisex', '50ml', array['White Musk','Iris','Cashmere Wood','Aldehyde'],
  48, '/images/product-aura.jpg', false, true, 10, now() - interval '3 days'
),
(
  'Ember Leather', 'ember-leather',
  'Smoked leather wrapped in birch tar and sweet balsam. Dark, textured, and magnetic from first spray.',
  'Leather, birch & balsam',
  3199, 3800, 'him', '50ml', array['Leather','Birch','Balsam','Smoke'],
  22, '/images/product-noir.jpg', false, true, 11, now() - interval '2 days'
),
(
  'Discovery Set', 'discovery-set',
  'Five 5ml samples of your choice from the Zaré collection. Explore signatures before committing to a full bottle: the perfect introduction to Parfums de Luxe.',
  '5 × 5ml samples of your choice',
  1499, 1999, 'testers', '5×5ml', array['Curated','Travel','Sampler'],
  60, '/images/product-rose.jpg', false, true, 12, now() - interval '1 day'
);

-- ============================================================
-- STORAGE: product images (public read, admin write)
-- ============================================================
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

create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

create policy "Admins delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());

-- ============================================================
-- ADMIN SETUP (after creating Auth user in Dashboard):
-- 1. Authentication → Users → Add user
--    Email: your admin email | Password: your secure password
-- 2. Copy the user UUID, then run:
--
-- insert into public.admin_profiles (id, email, full_name)
-- values ('PASTE-USER-UUID-HERE', 'admin@zarescents.com', 'Zaré Admin');
-- ============================================================
