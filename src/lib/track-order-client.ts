"use client";

import { createClient } from "@/lib/supabase/client";
import type { TrackedOrder } from "@/lib/order-tracking";

export async function fetchTrackedOrder(
  orderNumber: string,
  email: string
): Promise<TrackedOrder> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("track_order", {
    p_order_number: orderNumber.trim(),
    p_email: email.trim(),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as TrackedOrder;
}
