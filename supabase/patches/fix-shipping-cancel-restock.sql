-- Run this in Supabase SQL Editor if schema was applied earlier.
-- Aligns shipping with the storefront and adds cancel → restock.

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
