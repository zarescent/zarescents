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
